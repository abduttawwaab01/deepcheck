import { offlineDb, type PendingMutation } from "./db";

type SyncListener = (status: SyncStatus) => void;

export type SyncStatus = {
  isOnline: boolean;
  pendingMutations: number;
  pendingAssessments: number;
  lastSyncedAt: number | null;
  isSyncing: boolean;
};

type SyncEvent = "status-change" | "sync-complete" | "sync-error";

const listeners = new Map<SyncEvent, Set<SyncListener>>();

function notify(event: SyncEvent, status: SyncStatus) {
  listeners.get(event)?.forEach((fn) => fn(status));
}

let currentStatus: SyncStatus = {
  isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
  pendingMutations: 0,
  pendingAssessments: 0,
  lastSyncedAt: null,
  isSyncing: false,
};

function getStatus(): SyncStatus {
  return { ...currentStatus };
}

async function refreshCounts() {
  currentStatus.pendingMutations = await offlineDb.getPendingMutationCount();
  const assessments = await offlineDb.getAllPendingAssessments();
  currentStatus.pendingAssessments = assessments.length;
}

async function processQueue() {
  if (currentStatus.isSyncing || !currentStatus.isOnline) return;
  currentStatus.isSyncing = true;
  notify("status-change", getStatus());

  try {
    const mutations = await offlineDb.getPendingMutations();
    for (const mutation of mutations) {
      try {
        const res = await fetch("/api/trpc/" + mutation.procedure.replaceAll(".", "/"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 0: { json: mutation.input } }),
        });
        if (res.ok) {
          await offlineDb.deletePendingMutation(mutation.id!);
        } else if (mutation.retries >= 5) {
          await offlineDb.deletePendingMutation(mutation.id!);
        } else {
          await offlineDb.addPendingMutation({ ...mutation, retries: mutation.retries + 1 });
          await offlineDb.deletePendingMutation(mutation.id!);
        }
      } catch {
        currentStatus.isSyncing = false;
        notify("sync-error", getStatus());
        return;
      }
    }

    currentStatus.lastSyncedAt = Date.now();
    await refreshCounts();
    currentStatus.isSyncing = false;
    notify("sync-complete", getStatus());
  } catch {
    currentStatus.isSyncing = false;
    notify("sync-error", getStatus());
  }
}

export const syncManager = {
  init() {
    if (typeof window === "undefined") return;

    const updateOnline = async () => {
      currentStatus.isOnline = navigator.onLine;
      await refreshCounts();
      notify("status-change", getStatus());
      if (navigator.onLine) {
        processQueue();
      }
    };

    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);

    navigator.serviceWorker?.addEventListener("message", (event) => {
      if (event.data?.type === "SYNC_PENDING" || event.data?.type === "SYNC_ASSESSMENTS") {
        processQueue();
      }
    });

    updateOnline();
  },

  enqueueMutation(procedure: string, input: unknown) {
    offlineDb.addPendingMutation({ procedure, input, createdAt: Date.now(), retries: 0 });
    refreshCounts().then(() => notify("status-change", getStatus()));
    if (currentStatus.isOnline) {
      processQueue();
    } else {
      navigator.serviceWorker?.ready.then((reg) => {
        reg.sync.register("sync-pending").catch(() => {});
      });
    }
  },

  getStatus,

  subscribe(event: SyncEvent, listener: SyncListener) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event)!.add(listener);
    return () => listeners.get(event)?.delete(listener);
  },

  forceSync() {
    if (currentStatus.isOnline) processQueue();
  },
};
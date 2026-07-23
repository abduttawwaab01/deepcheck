import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "deep-check-offline";
const DB_VERSION = 1;

export type PendingMutation = {
  id?: number;
  procedure: string;
  input: unknown;
  createdAt: number;
  retries: number;
};

export type PendingAssessment = {
  instanceId: string;
  answers: Record<string, string>;
  startTime: number;
  status: "in_progress" | "completed" | "syncing";
};

export type TRPCCacheEntry = {
  procedure: string;
  inputHash: string;
  data: unknown;
  fetchedAt: number;
  ttl: number;
};

export type AuthCacheEntry = {
  key: "session";
  token: string | null;
  user: Record<string, unknown> | null;
  expiresAt: number;
};

function upgradeDB(db: IDBPDatabase) {
  db.createObjectStore("trpc_cache", { keyPath: ["procedure", "inputHash"] });
  db.createObjectStore("pending_mutations", { keyPath: "id", autoIncrement: true });
  db.createObjectStore("pending_assessments", { keyPath: "instanceId" });
  db.createObjectStore("auth_cache", { keyPath: "key" });
  db.createObjectStore("app_state", { keyPath: "key" });
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, { upgrade: upgradeDB });
  }
  return dbPromise;
}

export const offlineDb = {
  // tRPC cache
  async getTRPCCache(procedure: string, inputHash: string): Promise<TRPCCacheEntry | undefined> {
    const db = await getDb();
    return db.get("trpc_cache", [procedure, inputHash]);
  },
  async setTRPCCache(entry: TRPCCacheEntry) {
    const db = await getDb();
    await db.put("trpc_cache", entry);
  },
  async clearTRPCCache() {
    const db = await getDb();
    await db.clear("trpc_cache");
  },

  // Pending mutations
  async addPendingMutation(mutation: Omit<PendingMutation, "id">): Promise<number> {
    const db = await getDb();
    return db.add("pending_mutations", mutation);
  },
  async getPendingMutations(): Promise<PendingMutation[]> {
    const db = await getDb();
    return db.getAll("pending_mutations");
  },
  async deletePendingMutation(id: number) {
    const db = await getDb();
    await db.delete("pending_mutations", id);
  },
  async getPendingMutationCount(): Promise<number> {
    const db = await getDb();
    return db.count("pending_mutations");
  },

  // Pending assessments
  async getPendingAssessment(instanceId: string): Promise<PendingAssessment | undefined> {
    const db = await getDb();
    return db.get("pending_assessments", instanceId);
  },
  async setPendingAssessment(assessment: PendingAssessment) {
    const db = await getDb();
    await db.put("pending_assessments", assessment);
  },
  async deletePendingAssessment(instanceId: string) {
    const db = await getDb();
    await db.delete("pending_assessments", instanceId);
  },
  async getAllPendingAssessments(): Promise<PendingAssessment[]> {
    const db = await getDb();
    return db.getAll("pending_assessments");
  },

  // Auth cache
  async getAuthCache(): Promise<AuthCacheEntry | undefined> {
    const db = await getDb();
    return db.get("auth_cache", "session");
  },
  async setAuthCache(entry: Omit<AuthCacheEntry, "key">) {
    const db = await getDb();
    await db.put("auth_cache", { key: "session", ...entry });
  },
  async clearAuthCache() {
    const db = await getDb();
    await db.delete("auth_cache", "session");
  },

  // App state
  async getAppState(key: string): Promise<unknown> {
    const db = await getDb();
    const entry = await db.get("app_state", key);
    return entry?.value;
  },
  async setAppState(key: string, value: unknown) {
    const db = await getDb();
    await db.put("app_state", { key, value });
  },

  // Utility
  async clearAll() {
    const db = await getDb();
    await db.clear("trpc_cache");
    await db.clear("pending_mutations");
    await db.clear("pending_assessments");
  },
};
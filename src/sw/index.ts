/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import { Serwist, NetworkFirst, CacheFirst } from "serwist";

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (string | { url: string; revision: string })[];
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    ...defaultCache,

    // tRPC GET queries
    {
      matcher: ({ url }) => url.pathname.startsWith("/api/trpc/"),
      method: "GET",
      handler: new NetworkFirst({
        cacheName: "trpc-cache-v1",
        networkTimeoutSeconds: 5,
        plugins: [
          {
            cacheWillUpdate: async ({ response }) => {
              if (response && response.status === 200) {
                const cloned = response.clone();
                try {
                  const body = await cloned.json();
                  if (body?.result?.data) {
                    return response;
                  }
                } catch {
                  return null;
                }
              }
              return null;
            },
          },
        ],
      }),
    },

    // Other GET API endpoints
    {
      matcher: ({ url }) => url.pathname.startsWith("/api/"),
      method: "GET",
      handler: new NetworkFirst({
        cacheName: "api-cache-v1",
        networkTimeoutSeconds: 3,
      }),
    },

    // Images
    {
      matcher: ({ request }) => request.destination === "image",
      handler: new CacheFirst({
        cacheName: "image-cache-v1",
      }),
    },
  ],
});

serwist.addEventListeners();

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-pending") {
    event.waitUntil(syncPending());
  }
  if (event.tag === "sync-assessments") {
    event.waitUntil(syncAssessments());
  }
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

async function syncPending() {
  const clients = await self.clients.matchAll();
  for (const client of clients) {
    client.postMessage({ type: "SYNC_PENDING" });
  }
}

async function syncAssessments() {
  const clients = await self.clients.matchAll();
  for (const client of clients) {
    client.postMessage({ type: "SYNC_ASSESSMENTS" });
  }
}
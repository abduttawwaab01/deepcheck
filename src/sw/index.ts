import { defaultCache } from "@serwist/next/worker";
import { Serwist, NetworkFirst, CacheFirst, StaleWhileRevalidate } from "serwist";

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    ...defaultCache,

    // tRPC GET queries — NetworkFirst with 5s timeout, fall back to cache
    {
      matcher: ({ url }) => url.pathname.startsWith("/api/trpc/") && url.method === "GET",
      handler: new NetworkFirst({
        cacheName: "trpc-cache-v1",
        networkTimeoutSeconds: 5,
        plugins: [
          {
            cacheWillUpdate: async ({ response }) => {
              if (response && response.status === 200) {
                const cloned = response.clone();
                const body = await cloned.json();
                if (body?.result?.data) {
                  return response;
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
      matcher: ({ url }) => url.pathname.startsWith("/api/") && url.method === "GET",
      handler: new NetworkFirst({
        cacheName: "api-cache-v1",
        networkTimeoutSeconds: 3,
      }),
    },

    // Images — CacheFirst, expire after 30 days
    {
      matcher: ({ request }) => request.destination === "image",
      handler: new CacheFirst({
        cacheName: "image-cache-v1",
        plugins: [
          {
            cacheWillUpdate: async ({ response }) => {
              if (response && response.status === 200) {
                const cloned = response.clone();
                if (cloned.headers.get("content-length") !== "0") {
                  return response;
                }
              }
              return null;
            },
          },
        ],
      }),
    },
  ],
});

serwist.addEventListeners();

// Handle background sync for pending mutations
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-pending") {
    event.waitUntil(syncPending());
  }
  if (event.tag === "sync-assessments") {
    event.waitUntil(syncAssessments());
  }
});

// Listen for messages from the client
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

// Fallback offline page for navigation requests
serwist.addToPrecacheList([
  { url: "/offline", revision: Date.now().toString() },
]);
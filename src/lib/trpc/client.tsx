"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState, useEffect } from "react";
import superjson from "superjson";
import type { AppRouter } from "@/lib/trpc/router";
import { offlineDb } from "@/lib/offline/db";
import { syncManager } from "@/lib/offline/sync-manager";

export const trpc = createTRPCReact<AppRouter>();

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 24 * 60 * 60 * 1000,
        retry: 1,
        networkMode: "offlineFirst",
      },
      mutations: {
        networkMode: "offlineFirst",
      },
    },
  }));

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({ enabled: () => process.env.NODE_ENV === "development" }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
          fetch: async (url, options) => {
            try {
              const res = await fetch(url, options);
              if (res.ok) {
                return res;
              }
              throw new Error(`HTTP ${res.status}`);
            } catch (err) {
              if (options?.method === "GET" || !options?.method) {
                const urlStr = typeof url === "string" ? url : url instanceof URL ? url.pathname + url.search : "";
                const match = urlStr.match(/\/api\/trpc\/(.+?)\?batch=1/);
                if (match) {
                  const procedure = match[1].replace(/\//g, ".");
                  const cached = await offlineDb.getTRPCCache(procedure, urlStr);
                  if (cached) {
                    return new Response(JSON.stringify(cached.data), {
                      status: 200,
                      headers: { "Content-Type": "application/json" },
                    });
                  }
                }
              }
              throw err;
            }
          },
        }),
      ],
    })
  );

  useEffect(() => {
    return syncManager.init();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
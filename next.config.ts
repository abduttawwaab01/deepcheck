import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/sw/index.ts",
  swDest: "public/sw.js",
  reloadOnOnline: true,
  cacheOnNavigation: true,
  additionalPrecacheEntries: ["/offline"],
  exclude: [/\.map$/, /^manifest.*\.js$/, /\/api\//, /\/trpc\//],
});

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
    unoptimized: true,
  },
  eslint: { ignoreDuringBuilds: true },
};

export default withSerwist(nextConfig);
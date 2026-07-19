# DEEP CHECK — Software Requirements Specification

## Phase 12: Technology Stack

---

## 1. FRONTEND

| Layer | Choice | Rationale | Free Tier |
|-------|--------|-----------|-----------|
| **Framework** | Next.js 14+ (App Router) | SSR, API routes, edge functions, React Server Components | Unlimited on Vercel Hobby |
| **Language** | TypeScript 5+ | Type safety across full stack | Free |
| **State (Client)** | Zustand + TanStack Query | Zustand for UI state; TanStack Query for server state, caching, pagination | Free |
| **Styling** | Tailwind CSS v4 | Utility-first, dark mode, responsive, tree-shaking | Free |
| **Components** | shadcn/ui + Radix UI | Accessible, unstyled primitives + prebuilt components | Free |
| **Animation** | Framer Motion v11 | Declarative animations, layout animations, gesture support | Free |
| **Charts** | Recharts + D3.js | Recharts for standard charts; D3 for custom (radar, heatmap, knowledge graph) | Free |
| **Forms** | React Hook Form + Zod | Performant forms with schema validation | Free |
| **PDF** | @react-pdf/renderer | Server-side PDF generation with React components | Free |
| **Maps/Graphs** | Cytoscape.js | Force-directed knowledge graph | Free |
| **Icons** | Lucide React | Consistent icon set, tree-shakeable | Free |
| **Fonts** | Inter + Plus Jakarta Sans | Loaded via next/font (self-hosted, no external requests) | Free |

### 1.1 Bundle Size Targets

| Page Type | Initial JS (gzip) | First Paint | Time to Interactive |
|-----------|------------------|-------------|-------------------|
| Landing Page | < 80KB | < 1.5s | < 2s |
| Dashboard | < 100KB | < 2s | < 3s |
| Assessment | < 60KB | < 1.5s | < 2s |
| Report | < 120KB | < 2.5s | < 3.5s |

---

## 2. BACKEND

| Layer | Choice | Rationale | Free Tier |
|-------|--------|-----------|-----------|
| **Runtime** | Node.js 20+ (Vercel Serverless) | Standard, well-supported | Included in Vercel Hobby |
| **API Layer** | tRPC v11 + Next.js Route Handlers | Type-safe frontend↔backend; REST for webhooks | Free |
| **Auth** | NextAuth.js (Auth.js) v5 | 80+ providers, JWT + database sessions, MFA support | Free |
| **ORM** | Drizzle ORM | Type-safe SQL, zero runtime overhead, supports Neon serverless | Free |
| **Validation** | Zod | Runtime type validation, shared schemas between frontend/backend | Free |
| **Queue / Jobs** | Inngest | Serverless queues, cron jobs, step functions, retry logic | 2K runs/month free |
| **File Upload** | Uploadthing | Direct-to-S3 uploads from browser, webhook on upload complete | 2GB free |

---

## 3. DATABASE & STORAGE

| Layer | Choice | Rationale | Free Tier |
|-------|--------|-----------|-----------|
| **Primary DB** | Neon (PostgreSQL 16) | Serverless Postgres, branching, autoscaling to 0 | 0.5GB + 100h compute/mo |
| **Cache** | Upstash Redis | Serverless Redis (REST + SDK), no persistent connection | 10K commands/day, 256MB |
| **Vector Store** | pgvector (on Neon) | Store concept/question embeddings for similarity search | Included in Neon |
| **Blob Storage** | Vercel Blob | Image uploads, PDF storage, report assets | 2GB |
| **Search** | Meilisearch Cloud | Typo-tolerant full-text search, instant faceted filtering | 10K docs, 1GB |

---

## 4. AI & ANALYTICS

| Layer | Choice | Rationale | Free Tier |
|-------|--------|-----------|-----------|
| **LLM Access** | OpenRouter | Single API for GPT-4o, Claude, Gemini; no monthly fee | Pay-per-token |
| **AI SDK** | Vercel AI SDK v4 | Streaming, tool use, multi-model, edge-compatible | Free |
| **Analytics** | PostHog Cloud | Product analytics, session recording, feature flags, A/B testing | 1M events/month free |
| **Monitoring** | Sentry | Error tracking, performance monitoring, release tracking | 5K errors/month |

---

## 5. INFRASTRUCTURE & DEPLOYMENT

| Layer | Choice | Free Tier |
|-------|--------|-----------|
| **Hosting** | Vercel (Hobby) | Unlimited sites, 100GB bandwidth, 6000 build min/mo |
| **Domain** | Cloudflare DNS + SSL | Free (CDN, DDoS, SSL) |
| **CI/CD** | GitHub Actions | 2000 min/month free |
| **Edge Functions** | Vercel Edge Runtime | Included in Vercel Hobby |
| **Serverless Functions** | Vercel Functions (Node.js) | 100GB-hours included |

---

## 6. PROJECT STRUCTURE

```
deep-check/
├── apps/
│   └── web/                          # Next.js application
│       ├── app/                      # App Router pages
│       │   ├── (public)/             # Landing, pricing, blog
│       │   ├── (dashboard)/          # Authenticated pages
│       │   │   ├── student/
│       │   │   ├── parent/
│       │   │   ├── school/
│       │   │   ├── teacher/
│       │   │   └── admin/
│       │   ├── assessment/
│       │   ├── reports/
│       │   └── api/                  # REST endpoints + webhooks
│       ├── components/               # Shared components
│       │   ├── ui/                   # shadcn/ui primitives
│       │   ├── charts/               # Radar, heatmap, etc.
│       │   ├── layout/               # AppShell, Sidebar, TopBar
│       │   ├── dashboard/            # Dashboard-specific widgets
│       │   └── landing/              # Landing page sections
│       ├── lib/                      # Utilities, clients, helpers
│       │   ├── trpc/                 # tRPC client + server setup
│       │   ├── auth/                 # NextAuth configuration
│       │   ├── db/                   # Drizzle schema + migrations
│       │   ├── ai/                   # AI/LLM service
│       │   ├── payment/              # Payment providers
│       │   ├── assessment/           # CAT algorithm, IRT, BKT
│       │   ├── analytics/            # Materialized views, scoring
│       │   └── reports/              # Report generation
│       ├── stores/                   # Zustand stores
│       ├── styles/                   # Global CSS, Tailwind config
│       ├── types/                    # Shared TypeScript types
│       └── public/                   # Static assets
├── packages/
│   ├── shared/                       # Shared types + Zod schemas
│   └── engine/                       # Core assessment engine (isolated)
│       ├── src/
│       │   ├── irt/                  # 3PL model, theta estimation
│       │   ├── cat/                  # Adaptive algorithm
│       │   ├── bkt/                  # Bayesian Knowledge Tracing
│       │   └── scoring/              # Readiness scoring
│       └── __tests__/
├── tooling/
│   ├── eslint/                       # ESLint config
│   └── typescript/                   # Shared tsconfig
├── scripts/
│   ├── seed/                         # Database seed scripts
│   └── migrate/                      # Migration scripts
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 7. PACKAGE DEPENDENCIES (Key)

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "@trpc/client": "^11.0.0",
    "@trpc/server": "^11.0.0",
    "@trpc/next": "^11.0.0",
    "@trpc/react-query": "^11.0.0",
    "next-auth": "^5.0.0",
    "drizzle-orm": "^0.38.0",
    "neon-serverless": "^0.10.0",
    "zod": "^3.23.0",
    "zustand": "^5.0.0",
    "@tanstack/react-query": "^5.0.0",
    "framer-motion": "^11.0.0",
    "recharts": "^2.14.0",
    "d3": "^7.9.0",
    "cytoscape": "^3.30.0",
    "@react-pdf/renderer": "^4.0.0",
    "react-hook-form": "^7.54.0",
    "lucide-react": "^0.460.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "drizzle-kit": "^0.30.0",
    "@types/d3": "^7.4.0",
    "tailwindcss": "^4.0.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^9.0.0",
    "prettier": "^3.4.0",
    "vitest": "^2.1.0",
    "@testing-library/react": "^16.0.0",
    "storybook": "^8.0.0"
  }
}
```

---

## 8. CI/CD PIPELINE

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install
      - run: pnpm lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install
      - run: pnpm typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install
      - run: pnpm test -- --coverage

  # Automated deployment via Vercel (git push to main triggers deploy)
```

---

## 9. COST ESTIMATION (Free Tier Capacity)

| Service | Free Tier Limit | Estimated Users Supported |
|---------|----------------|--------------------------|
| Vercel Hobby | 100GB bandwidth, 6000 build min | 50,000 pageviews/month |
| Neon Free | 0.5GB storage, 100h compute | 10,000 users (light usage) |
| Upstash Free | 10K commands/day, 256MB | 5,000 users |
| PostHog Free | 1M events/month | 20,000 users |
| Sentry Free | 5K errors/month | Any scale (sampling) |
| Inngest Free | 2K runs/month | 5,000 assessments |
| Uploadthing Free | 2GB | 10,000 uploads |
| Meilisearch Free | 10K docs | 10,000 users |

**Upgrade triggers:** When any service reaches ~80% of free tier capacity, evaluate paid tier. Expected to support first 10,000-20,000 users on free tier.

---

*End of Phase 12 — Technology Stack*

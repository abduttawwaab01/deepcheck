# DEEP CHECK — Software Requirements Specification

## Phase 10: UI/UX Design System & Dashboard Specifications

---

## 1. DESIGN SYSTEM

### 1.1 Brand Identity

| Element | Specification |
|---------|---------------|
| **Brand Name** | Deep Check |
| **Tagline** | Deep Learning Diagnostic Intelligence Platform |
| **Tone** | Premium, intelligent, warm, authoritative, innovative |
| **Voice** | Direct, confident, encouraging, never condescending |
| **Target Vibe** | "Apple meets Khan Academy meets Bloomberg Terminal" |

### 1.2 Color System

```typescript
const colors = {
  // Primary Brand
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',  // Primary
    600: '#2563EB',  // Primary Dark
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    950: '#172554',
  },
  
  // Secondary (accent)
  secondary: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',  // Secondary
    600: '#9333EA',
    700: '#7C3AED',
    800: '#6B21A8',
    900: '#581C87',
  },
  
  // Semantic
  success: '#16A34A',
  warning: '#CA8A04',
  error: '#DC2626',
  info: '#2563EB',
  
  // Neutral
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
  
  // Glass (for glassmorphism effects)
  glass: {
    light: 'rgba(255, 255, 255, 0.7)',
    dark: 'rgba(15, 23, 42, 0.7)',
    border: 'rgba(255, 255, 255, 0.2)',
    blur: '16px',
  },
  
  // Readiness Score Colors
  readiness: {
    critical: '#DC2626',
    weak: '#EA580C',
    developing: '#CA8A04',
    competent: '#65A30D',
    strong: '#16A34A',
    mastered: '#059669',
  },
};
```

### 1.3 Typography

```typescript
const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: "'Plus Jakarta Sans', 'Inter', sans-serif",  // Headings
    mono: "'JetBrains Mono', 'Fira Code', monospace",     // Data, code
  },
  
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  lineHeight: {
    tight: '1.15',
    normal: '1.5',
    relaxed: '1.75',
  },
  
  // Usage
  heading1: { fontSize: '4xl', fontWeight: 800, lineHeight: '1.15', letterSpacing: '-0.02em' },
  heading2: { fontSize: '3xl', fontWeight: 700, lineHeight: '1.2', letterSpacing: '-0.01em' },
  heading3: { fontSize: '2xl', fontWeight: 700, lineHeight: '1.3' },
  heading4: { fontSize: 'xl', fontWeight: 600, lineHeight: '1.4' },
  body: { fontSize: 'base', fontWeight: 400, lineHeight: '1.6' },
  small: { fontSize: 'sm', fontWeight: 400, lineHeight: '1.5' },
  caption: { fontSize: 'xs', fontWeight: 400, lineHeight: '1.4', color: 'neutral.500' },
  data: { fontFamily: 'mono', fontSize: 'lg', fontWeight: 600 },
};
```

### 1.4 Spacing & Sizing

```typescript
const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  2: '0.5rem',      // 8px
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  8: '2rem',        // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  32: '8rem',       // 128px
  
  // Container max widths
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1440px',
  },
  
  // Border radius
  radius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },
};
```

### 1.5 Shadows & Elevation

```typescript
const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Glassmorphism
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  
  // Glow (for interactive elements)
  glow: {
    primary: '0 0 20px rgba(59, 130, 246, 0.3)',
    secondary: '0 0 20px rgba(168, 85, 247, 0.3)',
    success: '0 0 20px rgba(22, 163, 74, 0.3)',
  },
};
```

### 1.6 Animations & Transitions

```typescript
const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    xl: '1000ms',
  },
  
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    smooth: 'cubic-bezier(0.65, 0, 0.35, 1)',
  },
  
  // Framer Motion variants
  variants: {
    fadeIn: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
    },
    slideUp: {
      initial: { opacity: 0, y: 40 },
      animate: { opacity: 1, y: 0 },
    },
    stagger: {
      animate: { transition: { staggerChildren: 0.1 } },
    },
    counter: {
      // Number counting animation
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    radarReveal: {
      // Radar chart radial reveal
      animate: { pathLength: 1, transition: { duration: 1.5, ease: 'easeOut' } },
    },
  },
  
  // Micro-interactions
  micro: {
    buttonHover: { scale: 1.02, transition: { duration: 0.2 } },
    buttonTap: { scale: 0.98 },
    cardHover: { y: -4, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
    iconSpin: { rotate: 360, transition: { duration: 0.5, ease: 'linear' } },
    skeletonPulse: { opacity: [1, 0.4, 1], transition: { duration: 1.5, repeat: Infinity } },
  },
};
```

---

## 2. COMPONENT LIBRARY (shadcn/ui Based)

### 2.1 Core Components (Customized from shadcn/ui)

| Component | Customizations | States |
|-----------|----------------|--------|
| **Button** | Primary (solid), Secondary (outline), Ghost, Danger, Link; sizes: sm, md, lg, xl; loading spinner; icon support | default, hover, active, disabled, loading |
| **Input** | Text, email, password, number, phone; validation states; character count; prefix/suffix icons | default, focus, error, success, disabled |
| **Select** | Native select on mobile, custom dropdown on desktop; searchable; multi-select | default, open, selected, disabled |
| **Card** | Glassmorphism variant; interactive (hover lift); gradient border; data card | default, hover, selected, loading |
| **Badge** | Status (success, warning, error, info, neutral); score badge; notification dot | — |
| **Progress** | Linear bar; radial gauge; segmented (multi-step) | determinate, indeterminate, animated |
| **Tabs** | Underline style; pill style; animated indicator; vertical on mobile | active, hover, disabled |
| **Modal/Dialog** | Centered; slide-up on mobile; draggable (desktop); size variants | open, closing, closed |
| **Toast** | Top-right on desktop; bottom on mobile; success/error/info/warning; undo action | enter, exit, auto-dismiss |
| **Tooltip** | Rich content support; delay show/hide; position auto-flip | hidden, visible |
| **Skeleton** | Text block, avatar, card, chart placeholders | animated pulse |
| **Empty State** | Custom illustration; title, description, action button | — |
| **Alert** | Inline; banner; dismissible; with icon | info, warning, error, success |

### 2.2 Data Visualization Components

| Component | Tech | Description |
|-----------|------|-------------|
| **RadarChart** | Custom D3 | Polar area chart for multi-dimensional scores |
| **HeatmapChart** | Custom D3 | Matrix grid with color scale |
| **LineChart** | Recharts | Time series with confidence band |
| **BarChart** | Recharts | Horizontal/vertical, stacked, grouped |
| **GaugeChart** | Custom SVG | Semi-circular gauge for readiness score |
| **PieChart** | Recharts | Donut variant; labeled segments |
| **ScatterChart** | Recharts | XY plot with quadrant coloring |
| **KnowledgeGraph** | Cytoscape.js | Force-directed network graph |
| **Sparkline** | Custom D3 | Mini line chart in 50×20px SVG |
| **TrendIndicator** | Custom SVG | Up/down/stable arrow with color |

### 2.3 Dashboard Components

| Component | Description |
|-----------|-------------|
| **KPICard** | Large number + label + trend arrow + icon |
| **StatsRow** | Horizontal row of KPI cards (responsive grid) |
| **DataTable** | Sortable, filterable, paginated; row selection; inline edit; export |
| **FilterBar** | Date range, search, multi-select filters; saved presets |
| **ActivityFeed** | Chronological list of activities; grouped by date |
| **NotificationPanel** | Slide-out panel; grouped by read/unread; mark-all-read |
| **QuickActionCard** | Action button with icon, title, description |
| **ProfileCard** | Avatar + name + role + school + quick stats |
| **ChildSelector** | Dropdown/tabs for parent to switch between children |
| **AssessmentProgress** | Step indicator for assessment progress (1/30 items) |
| **StreakCounter** | Fire icon + count; gradient for 7+ days |
| **ReadinessGauge** | Large centered gauge with category label |

### 2.4 Layout Components

| Component | Description |
|-----------|-------------|
| **AppShell** | Sidebar + TopBar + Main content area |
| **Sidebar** | Collapsible; icon+label; nested sections; active state |
| **TopBar** | Search + notifications + profile menu; sticky |
| **BottomNav** | Mobile bottom tab bar (5 tabs max) |
| **PageHeader** | Title + description + breadcrumbs + actions |
| **ContentCard** | White/glass card with optional header and footer |
| **GridLayout** | Responsive CSS grid for dashboard widgets |
| **SectionGroup** | Collapsible section with toggle |
| **SplitPane** | Resizable left/right panels (admin panel) |

---

## 3. LANDING PAGE SPECIFICATION

### 3.1 Sections

```
┌──────────────────────────────────────────────────────────────────┐
│  NAV: [Logo]  Features  How It Works  Pricing  For Schools  │
│        For Parents  Blog  [Get Started]  [Sign In]              │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  HERO SECTION                                          │     │
│  │                                                        │     │
│  │  "Discover What Your Child Doesn't Know"               │     │
│  │  [animated typing effect on 'Doesn't Know']            │     │
│  │                                                        │     │
│  │  The world's most advanced learning diagnostic         │     │
│  │  intelligence platform. We uncover every hidden gap    │     │
│  │  before your child moves to the next class.            │     │
│  │                                                        │     │
│  │  [Start Free Assessment →]  [Watch Demo ▸]             │     │
│  │                                                        │     │
│  │  Glass card: Live dashboard preview (3D tilted,        │     │
│  │  rotating on hover) showing radar chart, score 62%,    │     │
│  │  recommendations. Animated data updates.               │     │
│  │                                                        │     │
│  │  Trust bar: ⭐⭐⭐⭐⭐ "Trusted by 500+ schools across  │     │
│  │  Nigeria"                                              │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  STATISTICS COUNTER SECTION                             │     │
│  │  [Count-up animation on scroll]                        │     │
│  │                                                        │     │
│  │  50,000+     1.2M+      500+       45,000+             │     │
│  │  Assessments  Gaps Found  Schools    Deep Reports       │     │
│  │  Completed               Using DC   Generated           │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  HOW IT WORKS (3-step animated cards)                   │     │
│  │                                                        │     │
│  │  Step 1 ────→ Step 2 ────→ Step 3                      │     │
│  │  [Take       [Receive    [Follow                       │     │
│  │  Adaptive   Deep       Personalized                    │     │
│  │  Assessment] Diagnostic] Plan]                         │     │
│  │  ───────    ─────────    ─────────                     │     │
│  │  30-50      AI-powered   Daily/weekly/                 │     │
│  │  adaptive   report with  monthly plan                  │     │
│  │  questions  radar charts  with practice                │     │
│  │            & gap analysis exercises                    │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  DEEP INTELLIGENCE SECTION (Tabs / Carousel)           │     │
│  │                                                        │     │
│  │  [Radar Chart Preview] [Heatmap Preview]               │     │
│  │  [Gap Analysis] [Recommendations] [Progress]           │     │
│  │                                                        │     │
│  │  Interactive demo: user can hover over segments        │     │
│  │  to see tooltips. Animated transitions between tabs.   │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  TESTIMONIALS CAROUSEL                                 │     │
│  │                                                        │     │
│  │  [Student Story]  [School Story]  [Parent Story]       │     │
│  │  ───────────────  ──────────────  ──────────────       │     │
│  │  "I never knew   "Our school's   "Finally, I          │     │
│  │  I had gaps in   performance      know exactly what    │     │
│  │  critical        improved 23%     my child needs."     │     │
│  │  thinking."      in one term."    — Mrs. Adeyemi       │     │
│  │  — Adeola, P6    — Gracefield                          │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  PRICING SECTION                                        │     │
│  │                                                        │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│     │
│  │  │  FREE    │  │ DEEP     │  │ SCHOOL   │  │ENTERPRSE││     │
│  │  │          │  │ REPORT   │  │ BULK     │  │         ││     │
│  │  │ Full     │  │ ₦3,000   │  │ From     │  │Custom   ││     │
│  │  │ assess-  │  │ per       │  │ ₦150,000 │  │pricing  ││     │
│  │  │ ment +   │  │ report   │  │ /50      │  │Unlimited││     │
│  │  │ basic    │  │          │  │ credits  │  │         ││     │
│  │  │ report   │  │          │  │          │  │         ││     │
│  │  │ [Free]   │  │[Buy Now] │  │[Contact] │  │[Contact]││     │
│  │  └──────────┘  └──────────┘  └──────────┘  └─────────┘│     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  FAQ (Accordion)                                        │     │
│  │  • What is Deep Check?                                 │     │
│  │  • How is this different from exams?                   │     │
│  │  • How long does assessment take?                      │     │
│  │  • Can my school use this?                             │     │
│  │  • Is my child's data safe?                            │     │
│  │  • What if we don't have internet at home?             │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  PARTNERS / LOGOS                                       │     │
│  │  [School logos grid] [Partner badges]                   │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  FINAL CTA                                              │     │
│  │                                                        │     │
│  │  "Start Your Child's Diagnostic Journey Today"         │     │
│  │  [Get Started Free →]                                  │     │
│  │  No credit card required. Full assessment included.    │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  FOOTER                                                │     │
│  │  Product | Company | Legal | Social | Newsletter       │     │
│  │  © 2026 Deep Check. All rights reserved.              │     │
│  └────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Landing Page States

| State | Behavior |
|-------|----------|
| **Initial load** | Skeleton placeholders for hero + animated dashboard preview. Counter stats at 0 (animate up when scrolled into view) |
| **Scroll** | Parallax effects on dashboard preview. Stagger animations on section entrance. Sticky nav with backdrop blur |
| **Dark mode toggle** | Smooth color transition (CSS `prefers-color-scheme` + manual toggle). All sections adapt colors |
| **CTA click** | Smooth scroll to registration form or pricing |
| **Mobile** | Collapsed hamburger menu. Stacked single-column layout. Animated dashboard preview becomes static |

---

## 4. DASHBOARD SPECIFICATIONS

### 4.1 Student Dashboard (Desktop)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [☰]  [Logo]  [Search assessments, concepts...]       🔔  👤 Adeola ▼      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  👋 Good morning, Adeola!  🔥 5-day streak  │ 📝 Daily practice   │   │
│  │  "Your daily practice is ready"              │ is ready!            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │     Overall Readiness       │  │         Radar Chart                 │  │
│  │                             │  │           (5-dim)                   │  │
│  │         ┌───┐              │  │         ╱───╲                        │  │
│  │         │62%│              │  │       ╱       ╲                      │  │
│  │         │ ↑ │              │  │      ╱  ●━━●   ╲                     │  │
│  │         └───┘              │  │     ╱  ●    ●   ╲                   │  │
│  │       Developing           │  │    ╱   ●━━●     ╲                   │  │
│  │       ↑ 5% from last       │  │   ╱               ╲                  │  │
│  │       month                │  │  ━━━━━━━━━━━━━━━━━━                   │  │
│  └─────────────────────────────┘  └─────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                     │
│  │    📝    │ │    🎯    │ │    💪    │ │    📊    │                     │
│  │   3      │ │   7      │ │   4      │ │   1      │                     │
│  │Assess-   │ │Weak      │ │Concepts  │ │Deep      │                     │
│  │ments     │ │Concepts  │ │Mastered  │ │Report    │                     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘                     │
│                                                                             │
│  ┌────────────────────────────────┐  ┌────────────────────────────────┐   │
│  │  ⚠️ Weak Concepts (focus!)     │  │  📈 Learning Journey           │   │
│  │                                │  │                                │   │
│  │  Logical Deduction  ████░░ 28% │  │  May 1 ─●── 62%               │   │
│  │  Fraction Ops       █████░ 34% │  │  Apr 1 ─●── 55%               │   │
│  │  Reading Comp.      ██████░45% │  │  Mar 1 ─●── 45%               │   │
│  │  Scientific Method  ██████░40% │  │                                │   │
│  │  Inference          ████░░ 30% │  │  [View Full Journey →]        │   │
│  │                                │  │                                │   │
│  │  [Practice Logic Now →]        │  │                                │   │
│  └────────────────────────────────┘  └────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  🎯 Recommended For You                                             │   │
│  │  → Practice one logic puzzle daily to build deduction skills        │   │
│  │  → Review fraction operations (video: "Fractions Made Easy")       │   │
│  │  → Read a story and predict what happens next (inference practice) │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Quick Actions                                                      │   │
│  │  [Start New Assessment]  [View Full Report]  [Invite Parent]        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  🏠 Dashboard  📝 Assess  📊 Reports  🎯 Plans  👤 Profile                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 School Admin Dashboard (Desktop)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [☰]  [Gracefield College]  [Search...]       🔔  👤 Mrs. Adebayo ▼        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  School Dashboard  |  Second Term 2025/2026  |  [Generate School Report]   │
│                                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ 👨‍🎓 847     │ │ 👩‍🏫 48       │ │ 📝 1,234    │ │ 📊 62%     │          │
│  │ Students    │ │ Teachers    │ │ Assessments │ │ Avg.       │          │
│  │             │ │             │ │ This Term   │ │ Readiness  │          │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘          │
│                                                                             │
│  ┌────────────────────────────────────────┐ ┌──────────────────────────┐  │
│  │  Readiness Distribution                │ │  Subject Comparison     │  │
│  │  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐       │ │                         │  │
│  │  │ ██│ │████│ │████│ │ ██│ │   │       │ │  Math ██████████░░ 55%  │  │
│  │  │12%│ │28%│ │35%│ │18%│ │ 7%│       │ │  Eng  ████████████░ 78%  │  │
│  │  │Crí│ │Wk │ │Dev│ │Cmpt│ │Str│       │ │  Sci  ██████████░░ 61%  │  │
│  │  └───┘ └───┘ └───┘ └───┘ └───┘       │ │  SS   █████████░░░ 65%  │  │
│  └────────────────────────────────────────┘ └──────────────────────────┘  │
│                                                                             │
│  ┌────────────────────────────────────────┐ ┌──────────────────────────┐  │
│  │  At-Risk Students                      │ │  Class Comparison        │  │
│  │  Adeola S.   28% ⚠️ Critical           │ │                         │  │
│  │  Chidi O.    32% ⚠️ Weak              │ │  P6A ████████░░ 58% ──  │  │
│  │  Funke A.    45% 🟡 Developing        │ │  P6B █████████░░ 65% ↑   │  │
│  │  Tunde B.    50% 🟢 Competent         │ │  P6C ████████░░ 55% ↓   │  │
│  │  [View All 42 At-Risk →]               │ │                         │  │
│  └────────────────────────────────────────┘ └──────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Trend: Average Readiness Over Time                                 │   │
│  │  ┌─────────────────────────────────────────────┐                   │   │
│  │  │   ▁▂▃▄▅▆▇█▇▆▅▄▃▄▅▆▇█▇▆▅▄▃▄▅▆   │                   │   │
│  │  │   Sep Oct Nov Dec Jan Feb Mar Apr May        │                   │   │
│  │  └─────────────────────────────────────────────┘                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Recent Activity                                                     │   │
│  │  • 12 students completed assessment today                            │   │
│  │  • Mrs. Okonkwo's class shows 15% improvement in Critical Thinking │   │
│  │  • 3 new deep reports purchased by parents                           │   │
│  │  • System recommendation: Review P6 Mathematics curriculum           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Admin Dashboard (Desktop)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [☰]  [Logo]  [Search users, schools...]       🔔  👤 Chidi ▼  ⚙️          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ 12,847   │ │ 534      │ │ 50,239   │ │ ₦4.2M    │ │ 🟢 99.8% │        │
│  │ Users    │ │ Schools  │ │ Assess.  │ │ Revenue  │ │ Uptime   │        │
│  │ ↑ 12%    │ │ ↑ 8%     │ │ ↑ 22%    │ │ this mo  │ │          │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│                                                                             │
│  ┌────────────────────────────────┐ ┌────────────────────────────────┐    │
│  │  User Growth (30 days)        │ │  System Health                 │    │
│  │  ┌──────────────────────────┐ │ │  🟢 Database: 12ms avg        │    │
│  │  │  ▁▂▃▄▅▆▇█▇▆▅▄▃▄▅▆▇█▇▆  │ │  🟢 API: 45ms avg            │    │
│  │  └──────────────────────────┘ │ │  🟡 Queue backlog: 234        │    │
│  │  May 15 — Jun 15             │ │  🟢 AI Service: Operational    │    │
│  └────────────────────────────────┘ └────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Pending Actions                                                     │   │
│  │  🔴 12 schools pending verification — Last: Gracefield Int'l        │   │
│  │  🟡 45 questions pending review — Oldest: 3 days ago                │   │
│  │  🔵 3 scheduled reports ready for review                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Recent Transactions                                                 │   │
│  │  • Gracefield College — ₦150,000 — School Credits ✅                │   │
│  │  • Mrs. Adeyemi — ₦3,000 — Deep Report ✅                           │   │
│  │  • Excel College — ₦450,000 — Annual License ✅                     │   │
│  │  • Dr. Eze — ₦10,000 — Parent Bundle (5 reports) ✅                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. MICRO-INTERACTIONS SPECIFICATION

| Element | Interaction | Animation | Duration | Easing |
|---------|-------------|-----------|----------|--------|
| **Dashboard cards** | Hover | Lift 4px + shadow increase | 200ms | spring |
| **Score gauge** | Page load | Animate from 0 to final value | 1000ms | easeOut |
| **Counter numbers** | Scroll into view | Count up from 0 | 1500ms | easeOut |
| **Radar chart** | Page load | Radial reveal (draw path) | 1500ms | easeOut |
| **Heatmap cells** | Hover | Scale 1.1 + show tooltip | 150ms | spring |
| **Knowledge graph** | Load | Force simulation settle | 2000ms | — |
| **Sidebar** | Toggle | Smooth expand/collapse | 300ms | easeInOut |
| **Notifications** | New arrives | Slide down from top | 300ms | easeOut |
| **Button** | Hover | Scale 1.02 | 150ms | spring |
| **Button** | Click | Scale 0.98 | 100ms | spring |
| **Modal** | Open | Scale up + fade in | 250ms | easeOut |
| **Modal** | Close | Scale down + fade out | 200ms | easeIn |
| **Toast** | Appear | Slide from right | 300ms | easeOut |
| **Toast** | Dismiss | Slide to right + fade | 200ms | easeIn |
| **Accordion** | Expand | Height transition | 300ms | easeInOut |
| **Tabs** | Switch | Slide content left/right | 300ms | easeInOut |
| **Progress bar** | Update | Animate width change | 500ms | easeOut |
| **Skeleton loader** | Loading | Pulse opacity | 1500ms | easeInOut |
| **Page transition** | Route change | Fade + slight slide up | 300ms | easeInOut |
| **Drag (knowledge graph)** | User drag | Follow cursor with spring | — | spring |
| **Confetti** | Assessment complete | Particle burst | 2000ms | — |

---

## 6. RESPONSIVE BREAKPOINTS

```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Desktop wide
  '2xl': '1536px', // Desktop ultra-wide
};

// Layout behavior per breakpoint:
// < 640px (mobile):
//   - Bottom tab navigation (5 tabs)
//   - Single column layout
//   - Full-width cards
//   - Hamburger menu instead of sidebar
//   - Touch-friendly targets (min 44px)
//   - Stack horizontal elements vertically
//   - Charts: simplified versions (donut instead of radar)
//   - Text: scale down headings

// 640-768px (tablet portrait):
//   - Bottom tabs or collapsible sidebar
//   - 2-column grid for cards
//   - Sidebar icons only (no text) on tablet
//   - Charts: full versions, compact

// 768-1024px (tablet landscape):
//   - Collapsible sidebar showing icons
//   - 2-3 column grids
//   - Full dashboard layouts

// > 1024px (desktop):
//   - Full sidebar with labels
//   - Multi-column grids (3-4)
//   - All chart types available
//   - Split-pane views
```

---

## 7. DARK MODE SPECIFICATION

### 7.1 Color Adaptations

| Element | Light | Dark |
|---------|-------|------|
| **Background** | #FFFFFF (white) | #0F172A (slate 900) |
| **Surface** | #F8FAFC (slate 50) | #1E293B (slate 800) |
| **Card** | #FFFFFF | #1E293B with border #334155 |
| **Text primary** | #0F172A | #F8FAFC |
| **Text secondary** | #64748B | #94A3B8 |
| **Border** | #E2E8F0 | #334155 |
| **Sidebar** | #F8FAFC | #0F172A with border #1E293B |
| **Input bg** | #FFFFFF | #1E293B |
| **Glass** | rgba(255,255,255,0.7) | rgba(15,23,42,0.7) |

### 7.2 Implementation

```typescript
// Use Tailwind's dark mode with 'class' strategy
// darkMode: 'class' in tailwind.config

// Toggle stored in localStorage + system preference detection
function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return [isDark, setIsDark];
}
```

---

*End of Phase 10 — UI/UX & Dashboard Specifications*

**Complete design system (colors, typography, spacing, shadows, animations), 30+ component library, full landing page specification with all sections, 3 detailed dashboard wireframes (Student, School Admin, Admin), 20 micro-interactions specification, responsive breakpoints, dark mode specification.**

**Remaining phases for confirmation: 11 (Payment Flow), 12 (Technology Stack), 13 (Security & Compliance), 14 (Roadmap & QA).**

*Ready for your next instruction.*

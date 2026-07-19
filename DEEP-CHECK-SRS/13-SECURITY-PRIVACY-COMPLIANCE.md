# DEEP CHECK — Software Requirements Specification

## Phase 13: Security, Privacy & Compliance

---

## 1. SECURITY ARCHITECTURE

### 1.1 Authentication & Authorization

| Mechanism | Implementation | Standard |
|-----------|---------------|----------|
| **Password Hashing** | bcrypt (cost factor 12) | NIST SP 800-63B |
| **Session Management** | JWT (RS256) + HTTP-only refresh token | 15min access / 7d refresh |
| **MFA** | TOTP via authenticator app (admin only) | RFC 6238 |
| **Rate Limiting** | Upstash Ratelimit (sliding window) | 5 login attempts/min per IP |
| **Account Lockout** | Auto-lock after 5 failed attempts, 15min cooldown | OWASP |
| **Password Policy** | Min 8 chars, 1 upper, 1 lower, 1 number, 1 special | OWASP |

### 1.2 API Security

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client   │────▶│  Vercel  │────▶│  API     │
│          │     │  Edge    │     │  Routes  │
└──────────┘     └──────────┘     └──────────┘
     │                │                │
     │ HTTPS          │ WAF            │ Rate
     │ TLS 1.3       │ (Cloudflare)   │ Limit
     │ CORS           │ DDoS           │ Validate
     │                │ Protection     │ Sanitize
```

| Measure | Implementation |
|---------|---------------|
| **TLS** | TLS 1.3 enforced, HSTS headers, HTTP → HTTPS redirect |
| **CORS** | Strict origin whitelist (production domain only) |
| **CSRF** | Next.js built-in CSRF protection + SameSite=Strict cookies |
| **XSS Prevention** | React's built-in XSS protection + Content-Security-Policy headers |
| **SQL Injection** | Parameterized queries via Drizzle ORM (no raw SQL) |
| **Request Validation** | Zod schemas validate ALL input before processing |
| **Rate Limiting** | Per-endpoint limits (see Phase 5 §7) |
| **Webhook Verification** | HMAC-SHA256 signature verification for all payment webhooks |

### 1.3 Data Encryption

| Data State | Encryption | Detail |
|------------|------------|--------|
| **In Transit** | TLS 1.3 | All external and internal traffic |
| **At Rest (DB)** | AES-256 (Neon) | Encrypted storage volumes |
| **At Rest (Blob)** | AES-256 (Vercel Blob) | Server-side encryption |
| **Passwords** | bcrypt + salt | Never stored in plaintext |
| **PII** | Application-level encryption | Email, phone, address encrypted with app key |
| **API Keys** | Hash (SHA-256) + prefix | Full key only shown once at creation |

### 1.4 Secrets Management

```typescript
// All secrets stored in Vercel Environment Variables
// NEVER in code, .env files committed, or logs

// Required environment variables:
DATABASE_URL="postgres://..."
REDIS_URL="redis://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
PAYSTACK_SECRET_KEY="..."
PAYSTACK_PUBLIC_KEY="..."
FLUTTERWAVE_SECRET_KEY="..."
STRIPE_SECRET_KEY="..."
OPENROUTER_API_KEY="..."
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."
POSTHOG_KEY="..."
SENTRY_DSN="..."
RESEND_API_KEY="..."
UPLOADTHING_SECRET="..."
MEILISEARCH_API_KEY="..."
```

---

## 2. DATA PRIVACY

### 2.1 Data Classification

| Classification | Examples | Handling Requirements |
|---------------|----------|----------------------|
| **Public** | Landing page content, pricing | No restrictions |
| **Internal** | Blog posts, feature descriptions | No special handling |
| **Confidential** | Student names, class rosters, readiness scores | Encrypted at rest, access-controlled |
| **Restricted** | Parent contact info, health data, IEP notes | Encrypted at rest, strict RBAC, audit logged |
| **Regulated** | Payment data, children's data (under 13) | PCI DSS for payments, COPPA for children |

### 2.2 Privacy by Design

| Principle | Implementation |
|-----------|---------------|
| **Data Minimization** | Only collect data necessary for diagnostic purpose. No unnecessary PII. |
| **Purpose Limitation** | Assessment data used only for educational diagnostics. Never sold. |
| **Consent** | Parental consent required for children under 13. Clear consent language. |
| **Access & Portability** | Users can export all their data via `/settings/export-data` (GDPR Art. 20) |
| **Deletion** | Users can delete account and all associated data via `/settings/delete-account` |
| **Breach Notification** | Automated alerting + 72-hour notification policy (GDPR Art. 33) |
| **Data Localization** | Primary database in Europe (Neon EU region) or Nigeria (future) |
| **Retention Limitation** | Data retained per policy in Phase 4 §6. Auto-deleted after retention period. |

### 2.3 Children's Privacy (COPPA / Age-Appropriate Design)

```typescript
// Age verification on registration
async function handleUnderageRegistration(user: NewUser): Promise<void> {
  if (user.age < 13) {
    // 1. Flag account as 'underage'
    // 2. Request parent email
    // 3. Send consent request to parent
    // 4. Lock account until consent verified
    // 5. If no consent within 30 days → auto-delete account
    
    await db.update(users)
      .set({ 
        isVerified: false,
        consentStatus: 'pending_parental',
        parentalConsentEmail: user.parentEmail,
      })
      .where(eq(users.id, user.id));
    
    await sendParentalConsentEmail(user.parentEmail, user.id);
  }
}

// Under-13 restrictions:
// - No sharing features
// - No public profiles
// - No behavioral advertising
// - Parent can view all data
// - Parent can delete account
```

---

## 3. COMPLIANCE CHECKLIST

| Regulation | Status | Actions Required |
|------------|--------|-----------------|
| **NDPR (Nigeria)** | Required | Data Protection Audit, file with NITDA, Data Protection Officer appointment |
| **GDPR (EU)** | Required (if EU users) | DPO, Data Processing Agreement, Privacy Notice, consent records, breach procedure |
| **COPPA (US)** | Required (under 13) | Parental consent mechanism, restricted data collection, privacy policy for children |
| **FERPA (US)** | Future | Education record handling, parent access rights |
| **PCI DSS** | Not directly (using Paystack) | Paystack is PCI DSS Level 1 compliant. We handle no raw card data. |
| **ISO 27001** | Future (Year 2) | ISMS implementation |
| **WCAG 2.1 AA** | Required | Accessibility compliance |

---

## 4. AUDIT TRAIL

```typescript
// ALL state-changing operations are logged to audit_logs table
// Immutable (insert-only). Never deleted. Archived monthly.

// Minimum audit events:
// - User: create, update, delete, lock, unlock, role_change, impersonate
// - School: create, update, verify, suspend
// - Question: create, update, delete, approve, reject, publish, retire
// - Assessment: schedule, cancel, complete (flagged only)
// - Payment: create, complete, fail, refund
// - Report: generate, purchase, share
// - Permission: role_create, role_update, permission_grant, permission_revoke
// - System: config_change, backup, restore, feature_flag_change
```

---

## 5. INCIDENT RESPONSE PLAN

| Severity | Definition | Response Time | Example |
|----------|-----------|---------------|---------|
| **SEV-1** | Data breach, complete system outage, payment system down | 15 min | Database exposed, all users locked out |
| **SEV-2** | Major feature degraded, partial outage | 1 hour | Assessment engine down, reports not generating |
| **SEV-3** | Minor feature issue, performance degradation | 4 hours | Chart not rendering on one dashboard |
| **SEV-4** | Cosmetic, non-urgent | 1 week | Typo on landing page, wrong color |

**Response process:**
1. Automated alert (Sentry + PagerDuty/email)
2. Acknowledge within response time
3. Assess severity and impact
4. Mitigate (rollback, feature flag, hotfix)
5. Root cause analysis (within 48 hours for SEV-1/2)
6. Implement permanent fix
7. Post-mortem documentation

---

*End of Phase 13 — Security, Privacy & Compliance*

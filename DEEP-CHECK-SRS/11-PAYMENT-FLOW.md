# DEEP CHECK — Software Requirements Specification

## Phase 11: Payment Flow

---

## 1. PAYMENT PROVIDERS

| Provider | Scope | Integration | Free Tier |
|----------|-------|-------------|-----------|
| **Paystack** | Nigeria (Primary) | Direct API + Webhook | Free (0 fees on free tier) |
| **Flutterwave** | Nigeria + Africa | Direct API + Webhook | Free |
| **Stripe** | International | Direct API + Webhook | Free |

### 1.1 Provider Selection Logic

```typescript
function getPaymentProvider(currency: string, country: string): PaymentProvider {
  if (currency === 'NGN') return 'paystack'; // or flutterwave based on config
  if (['GHS', 'KES', 'ZAR', 'UGX'].includes(currency)) return 'flutterwave';
  return 'stripe'; // USD, EUR, GBP
}
```

---

## 2. PRICE CONFIGURATION (Admin-Editable)

```typescript
interface PriceConfig {
  deepReport: {
    NGN: number;  // default: 3000
    USD: number;  // default: 3.99
    GBP: number;  // default: 2.99
    EUR: number;  // default: 3.49
  };
  schoolBulk: {
    credits50: { NGN: number; USD: number };  // default: 150000
    credits200: { NGN: number; USD: number }; // default: 450000
    credits500: { NGN: number; USD: number }; // default: 875000
  };
  parentBundle: {
    reports5: { NGN: number };  // default: 10000
    reports10: { NGN: number }; // default: 18000
    reports25: { NGN: number }; // default: 40000
  };
  institutionLicense: {
    monthly: { NGN: number }; // default: 500000
    yearly: { NGN: number };  // default: 5000000
  };
  subscription: {
    monthly: { NGN: number; USD: number }; // default: 5000
    yearly: { NGN: number; USD: number };  // default: 50000
  };
}
```

---

## 3. PAYMENT FLOWS

### 3.1 Deep Report Purchase

```
User completes assessment → Basic Report displayed
  │
  ├─ CTA: "Unlock Deep Report — ₦3,000"
  │
  ▼
Payment Page (/payment/deep-report/{instanceId})
  │
  ├─ Order Summary
  │   • Deep Diagnostic Report
  │   • ₦3,000
  │   • [Coupon Code Input] → Apply
  │   • Discount: -₦X (if coupon valid)
  │   • Total: ₦Y
  │
  ├─ Payment Methods
  │   • Card (Paystack iframe)
  │   • Bank Transfer (Virtual Account)
  │   • USSD
  │   • QR (Paystack)
  │
  ▼
User completes payment in provider's interface
  │
  ▼
Provider sends webhook POST /api/webhooks/paystack
  │
  ├─ Validate signature (HMAC SHA-256)
  ├─ Find pending transaction by reference
  ├─ Update transaction to 'completed'
  ├─ Generate Deep Report (async via Inngest)
  ├─ Send confirmation: email + SMS + in-app
  └─ Redirect user to Deep Report viewer
```

### 3.2 School Credit Purchase

```
School Admin → Billing → Purchase Credits
  │
  ├─ Select Plan: 50, 200, 500 credits or custom
  ├─ Price displayed (with volume discount)
  ├─ Payment via: Invoice (bank transfer) or card
  │
  ▼
Payment completed → Credits added to school_credits table
  │
  ▼
Admin distributes credits to students manually or auto-assigns
  │
  ▼
Each student's deep report is "pre-paid" → no charge to parent
```

### 3.3 Coupon System

```typescript
// Coupon validation logic
async function validateCoupon(
  code: string,
  amount: number,
  userId: string
): Promise<{ valid: boolean; discount: number; couponId?: string }> {
  const coupon = await db.query.coupons.findFirst({
    where: and(
      eq(coupons.code, code.toUpperCase()),
      eq(coupons.isActive, true),
      or(
        isNull(coupons.validUntil),
        gte(coupons.validUntil, new Date())
      ),
      or(
        isNull(coupons.maxUses),
        lt(coupons.currentUses, coupons.maxUses)
      ),
    ),
  });

  if (!coupon) return { valid: false, discount: 0 };

  // Check user hasn't exceeded max uses
  const userUsage = await db.query.couponUsage.count({
    where: and(
      eq(couponUsage.couponId, coupon.id),
      eq(couponUsage.userId, userId),
    ),
  });

  if (userUsage >= (coupon.maxUsesPerUser || 999)) {
    return { valid: false, discount: 0, reason: 'max_uses_reached' };
  }

  // Check minimum purchase
  if (coupon.minPurchaseAmount && amount < coupon.minPurchaseAmount) {
    return { valid: false, discount: 0, reason: 'min_purchase' };
  }

  // Calculate discount
  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = amount * (coupon.discountValue / 100);
  } else {
    discount = Math.min(coupon.discountValue, amount);
  }

  return { valid: true, discount, couponId: coupon.id };
}
```

---

## 4. TRANSACTION TABLE & RECONCILIATION

```typescript
// Automatic reconciliation process (runs daily via Inngest cron):
// 1. Fetch all 'pending' transactions older than 24 hours
// 2. Query provider API for each transaction reference
// 3. If provider shows 'success' → update to completed
// 4. If provider shows 'failed' → update to failed, notify user
// 5. Generate daily reconciliation report for admin
```

---

*End of Phase 11 — Payment Flow*

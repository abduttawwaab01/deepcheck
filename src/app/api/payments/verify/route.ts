import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { paymentTransactions, subscriptionCredits, subscriptionPlans } from "@/lib/db/schemas/payments";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  const session = await auth();
  const userId = session?.user?.id;

  // Demo mode: auto-verify and grant coins
  if (reference.startsWith("DEMO-")) {
    if (userId) {
      // Check if already verified
      const [existing] = await db.select().from(paymentTransactions)
        .where(eq(paymentTransactions.reference, reference)).limit(1);

      if (!existing) {
        const [newTx] = await db.insert(paymentTransactions).values({
          userId,
          reference,
          amount: "10000",
          status: "success",
          paidAt: new Date(),
          metadata: { plan_code: "coins_custom", demo: true },
        }).returning();

        // Grant 5 demo coins
        const [plan] = await db.select().from(subscriptionPlans)
          .where(eq(subscriptionPlans.code, "coins_custom")).limit(1);
        if (plan) {
          await db.insert(subscriptionCredits).values({
            userId,
            planId: plan.id,
            transactionId: newTx.id,
            creditsRemaining: 5,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          });
        }
      }
    }

    return NextResponse.json({
      status: true,
      message: "Demo payment verified",
      data: { reference, status: "success", amount: 10000, metadata: { plan_code: "coins_custom" } },
    });
  }

  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!paystackSecretKey) {
    return NextResponse.json({ status: false, message: "Paystack not configured" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${paystackSecretKey}` },
    });
    const data = await response.json();

    // If verification succeeded and user is logged in, grant coins
    if (data.status && data.data?.status === "success" && userId) {
      const [existing] = await db.select().from(paymentTransactions)
        .where(eq(paymentTransactions.reference, reference)).limit(1);

      if (!existing) {
        const planCode = data.data.metadata?.plan_code;
        const [newTx] = await db.insert(paymentTransactions).values({
          userId,
          reference,
          amount: String(data.data.amount / 100),
          status: "success",
          paidAt: new Date(),
          metadata: data.data.metadata || {},
        }).returning();

        if (planCode) {
          const [plan] = await db.select().from(subscriptionPlans)
            .where(eq(subscriptionPlans.code, planCode)).limit(1);
          if (plan) {
            let coins = plan.credits || 0;
            if (planCode === "coins_custom" || coins <= 0) {
              const amountPaid = Number(data.data.amount) / 100;
              coins = Math.floor(amountPaid / 2000);
            }
            if (coins > 0) {
              await db.insert(subscriptionCredits).values({
                userId,
                planId: plan.id,
                transactionId: newTx.id,
                creditsRemaining: coins,
                expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
              });
            }
          }
        }
      }
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

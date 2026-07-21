import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { paymentTransactions, subscriptionCredits, subscriptionPlans } from "@/lib/db/schemas/payments";
import { eq, sql } from "drizzle-orm";
import crypto from "crypto";

function verifyPaystackSignature(body: string, signature: string, secret: string): boolean {
  const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");
  return hash === signature;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature") || "";
    const webhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET;

    if (webhookSecret && !verifyPaystackSignature(body, signature, webhookSecret)) {
      return NextResponse.json({ status: false, message: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    const eventType = event.event;

    if (eventType === "charge.success") {
      const { reference, status, amount, metadata } = event.data;

      const [existing] = await db.select().from(paymentTransactions)
        .where(eq(paymentTransactions.reference, reference)).limit(1);

      if (!existing) {
        const userId = metadata?.user_id || metadata?.userId;
        if (userId) {
          const [newTx] = await db.insert(paymentTransactions).values({
            userId,
            reference,
            amount: String(amount / 100),
            status: "success",
            paidAt: new Date(),
            metadata: metadata || {},
          }).returning();

          const planCode = metadata?.plan_code || metadata?.planCode;
          if (planCode && newTx) {
            const [plan] = await db.select().from(subscriptionPlans)
              .where(eq(subscriptionPlans.code, planCode)).limit(1);
            if (plan && plan.credits && plan.credits > 0) {
              await db.insert(subscriptionCredits).values({
                userId,
                planId: plan.id,
                transactionId: newTx.id,
                creditsRemaining: plan.credits,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              });
            }
          }
        }
      } else if (existing.status !== "success") {
        await db.update(paymentTransactions).set({
          status: "success",
          paidAt: new Date(),
        }).where(eq(paymentTransactions.reference, reference));
      }
    }

    return NextResponse.json({ status: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ status: false }, { status: 500 });
  }
}

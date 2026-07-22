import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { paymentTransactions } from "@/lib/db/schemas/payments";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { email, amount, metadata, planCode } = body;

    if (!email || !amount) {
      return NextResponse.json({ error: "Missing email or amount" }, { status: 400 });
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    const reference = `DC-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    if (session?.user?.id) {
      await db.insert(paymentTransactions).values({
        userId: session.user.id,
        reference,
        amount: String(amount),
        status: "pending",
        metadata: { ...metadata, plan_code: planCode, email },
      });
    }

    if (!paystackSecretKey) {
      return NextResponse.json({
        status: true,
        message: "Demo mode payment initiated",
        data: {
          authorization_url: `/payment/confirm?reference=DEMO-${reference}&amount=${amount}&email=${email}`,
          reference: `DEMO-${reference}`,
          access_code: "demo_access_code",
        },
      });
    }

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100),
        reference,
        metadata: {
          ...metadata,
          user_id: session?.user?.id,
          plan_code: planCode,
        },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://skoolar.org"}/payment/confirm`,
      }),
    });

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json({ error: data.message || "Payment initialization failed" }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Payment init error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

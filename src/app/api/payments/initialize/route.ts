import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, amount, metadata } = body;

    if (!email || !amount) {
      return NextResponse.json({ error: "Missing email or amount" }, { status: 400 });
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!paystackSecretKey) {
      // Demo mode: return a mock authorization URL
      return NextResponse.json({
        status: true,
        message: "Demo mode payment initiated",
        data: {
          authorization_url: `/payment/confirm?reference=DEMO-${Date.now()}&amount=${amount}&email=${email}`,
          reference: `DEMO-${Date.now()}`,
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
        metadata,
        callback_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/payment/callback`,
      }),
    });

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json({ error: "Payment initialization failed" }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

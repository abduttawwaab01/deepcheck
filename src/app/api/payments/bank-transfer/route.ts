import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bankTransfers } from "@/lib/db/schemas/payments";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, coinsRequested, senderName } = body;

    if (!amount || !coinsRequested || !senderName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [transfer] = await db.insert(bankTransfers).values({
      userId,
      amount: String(amount),
      coinsRequested,
      senderName,
      status: "pending",
    }).returning();

    return NextResponse.json({
      success: true,
      transferId: transfer.id,
      message: "Bank transfer request submitted. Awaiting admin confirmation.",
    });
  } catch (error) {
    console.error("Bank transfer error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = body.event;

    // Paystack webhook events: charge.success, charge.failed, etc.
    if (event === "charge.success") {
      const { reference, status, metadata } = body.data;

      // Create report request record in DB
      console.log(`Payment success: ${reference}, status: ${status}`, metadata);

      // In production: create a report_requests row in the database
      // await db.insert(reportRequests).values({ ... })
    }

    return NextResponse.json({ status: true });
  } catch {
    return NextResponse.json({ status: false }, { status: 500 });
  }
}

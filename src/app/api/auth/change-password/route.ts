import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schemas";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: "Current and new passwords are required" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ message: "New password must be at least 8 characters" }, { status: 400 });
    }

    const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
    if (!user || !user.passwordHash) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await db.update(users).set({ passwordHash: newHash, updatedAt: new Date() }).where(eq(users.id, session.user.id));

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

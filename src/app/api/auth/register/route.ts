import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, roles, userRoles, studentProfiles } from "@/lib/db/schemas";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
    }

    const validRoles = ["student", "teacher", "parent", "school_admin"];
    const assignedRole = validRoles.includes(role) ? role : "student";

    const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existing) {
      return NextResponse.json({ message: "An account with this email already exists" }, { status: 409 });
    }

    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    const passwordHash = await bcrypt.hash(password, 12);

    const [user] = await db.insert(users).values({
      email,
      firstName,
      lastName,
      passwordHash,
      isActive: true,
      isVerified: false,
    }).returning();

    const [roleRecord] = await db.select().from(roles).where(eq(roles.name, assignedRole)).limit(1);
    if (roleRecord) {
      await db.insert(userRoles).values({
        userId: user.id,
        roleId: roleRecord.id,
      });
    }

    if (assignedRole === "student") {
      await db.insert(studentProfiles).values({
        userId: user.id,
        enrollmentStatus: "active",
      });
    }

    try {
      const { sendEmail, welcomeEmail } = await import("@/lib/notifications/email");
      const emailContent = welcomeEmail(name, assignedRole);
      await sendEmail({ to: email, subject: emailContent.subject, html: emailContent.html });
    } catch (e) {
      console.error("Welcome email error:", e);
    }

    return NextResponse.json({ message: "Account created successfully", userId: user.id }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

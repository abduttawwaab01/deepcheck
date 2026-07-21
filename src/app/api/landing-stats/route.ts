import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { schools } from "@/lib/db/schemas/schools";
import { questions } from "@/lib/db/schemas/questions";
import { users } from "@/lib/db/schemas/users";
import { assessmentInstances } from "@/lib/db/schemas/assessments";
import { deepReports } from "@/lib/db/schemas/reports";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [assessmentCount] = await db.select({ count: sql<number>`count(*)` }).from(assessmentInstances);
    const [schoolCount] = await db.select({ count: sql<number>`count(*)` }).from(schools).where(sql`${schools.deletedAt} IS NULL`);
    const [questionCount] = await db.select({ count: sql<number>`count(*)` }).from(questions).where(sql`${questions.deletedAt} IS NULL`);
    const [deepReportCount] = await db.select({ count: sql<number>`count(*)` }).from(deepReports).where(sql`${deepReports.status} = 'completed'`);
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users).where(sql`${users.deletedAt} IS NULL`);

    return NextResponse.json({
      assessmentsCompleted: Number(assessmentCount?.count || 0),
      schoolsUsing: Number(schoolCount?.count || 0),
      deepReportsGenerated: Number(deepReportCount?.count || 0),
      totalUsers: Number(userCount?.count || 0),
      totalQuestions: Number(questionCount?.count || 0),
    });
  } catch {
    return NextResponse.json({
      assessmentsCompleted: 0, schoolsUsing: 0, deepReportsGenerated: 0, totalUsers: 0, totalQuestions: 0,
    });
  }
}

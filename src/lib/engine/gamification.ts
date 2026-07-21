import { db } from "@/lib/db";
import { userStreaks, userBadges, leaderboard } from "@/lib/db/schemas/gamification";
import { eq, and, sql, desc, inArray } from "drizzle-orm";

export interface BadgeDefinition {
  code: string;
  name: string;
  description: string;
  iconUrl: string;
  xpAwarded: number;
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  totalAssessments: number;
  avgScore: number;
  currentStreak: number;
  bestScore: number;
  totalXp: number;
  level: number;
  previousScore?: number;
}

const BADGES: BadgeDefinition[] = [
  { code: "first_assessment", name: "First Steps", description: "Completed your first assessment", iconUrl: "🎯", xpAwarded: 50, condition: (s) => s.totalAssessments >= 1 },
  { code: "five_assessments", name: "Getting Serious", description: "Completed 5 assessments", iconUrl: "📚", xpAwarded: 100, condition: (s) => s.totalAssessments >= 5 },
  { code: "ten_assessments", name: "Dedicated Learner", description: "Completed 10 assessments", iconUrl: "🏅", xpAwarded: 200, condition: (s) => s.totalAssessments >= 10 },
  { code: "twentyfive_assessments", name: "Assessment Champion", description: "Completed 25 assessments", iconUrl: "🏆", xpAwarded: 500, condition: (s) => s.totalAssessments >= 25 },
  { code: "fifty_assessments", name: "Learning Machine", description: "Completed 50 assessments", iconUrl: "⚡", xpAwarded: 1000, condition: (s) => s.totalAssessments >= 50 },
  { code: "score_80", name: "High Achiever", description: "Scored 80% or above", iconUrl: "🌟", xpAwarded: 150, condition: (s) => s.bestScore >= 80 },
  { code: "score_90", name: "Excellence", description: "Scored 90% or above", iconUrl: "💎", xpAwarded: 300, condition: (s) => s.bestScore >= 90 },
  { code: "score_100", name: "Perfect Score", description: "Scored 100% on an assessment", iconUrl: "👑", xpAwarded: 500, condition: (s) => s.bestScore >= 100 },
  { code: "streak_3", name: "On Fire", description: "3-day learning streak", iconUrl: "🔥", xpAwarded: 75, condition: (s) => s.currentStreak >= 3 },
  { code: "streak_7", name: "Weekly Warrior", description: "7-day learning streak", iconUrl: "⚔️", xpAwarded: 200, condition: (s) => s.currentStreak >= 7 },
  { code: "streak_14", name: "Unstoppable", description: "14-day learning streak", iconUrl: "🚀", xpAwarded: 400, condition: (s) => s.currentStreak >= 14 },
  { code: "streak_30", name: "Monthly Master", description: "30-day learning streak", iconUrl: "🌟", xpAwarded: 1000, condition: (s) => s.currentStreak >= 30 },
  { code: "level_5", name: "Rising Star", description: "Reached Level 5", iconUrl: "⭐", xpAwarded: 100, condition: (s) => s.level >= 5 },
  { code: "level_10", name: "Knowledge Seeker", description: "Reached Level 10", iconUrl: "🎯", xpAwarded: 250, condition: (s) => s.level >= 10 },
  { code: "level_20", name: "Wisdom Master", description: "Reached Level 20", iconUrl: "🧠", xpAwarded: 500, condition: (s) => s.level >= 20 },
  { code: "improvement_10", name: "Growing", description: "Improved score by 10% from previous assessment", iconUrl: "📈", xpAwarded: 100, condition: (s) => s.previousScore !== undefined && (s.bestScore - s.previousScore) >= 10 },
  { code: "improvement_20", name: "Breakthrough", description: "Improved score by 20% from previous assessment", iconUrl: "🚀", xpAwarded: 250, condition: (s) => s.previousScore !== undefined && (s.bestScore - s.previousScore) >= 20 },
];

function calculateLevel(totalXp: number): number {
  return Math.floor(1 + Math.sqrt(totalXp / 100));
}

function xpForLevel(level: number): number {
  return Math.round(Math.pow(level - 1, 2) * 100);
}

export async function processAssessmentCompletion(
  userId: string,
  score: number,
): Promise<{ xpEarned: number; levelUp: boolean; newBadges: BadgeDefinition[] }> {
  let xpEarned = Math.round(score * 2 + 10);
  if (score >= 90) xpEarned = Math.round(xpEarned * 1.5);
  else if (score >= 80) xpEarned = Math.round(xpEarned * 1.2);

  const [existing] = await db.select().from(userStreaks)
    .where(eq(userStreaks.userId, userId)).limit(1);

  const today = new Date().toISOString().split("T")[0];
  let currentStreak = 0;
  let longestStreak = 0;
  let totalXp = 0;

  if (existing) {
    totalXp = (existing.totalXp || 0) + xpEarned;
    const lastDate = existing.lastActivityDate;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (lastDate === today) {
      currentStreak = existing.currentStreak || 0;
    } else if (lastDate === yesterdayStr) {
      currentStreak = (existing.currentStreak || 0) + 1;
    } else {
      currentStreak = 1;
    }
    longestStreak = Math.max(currentStreak, existing.longestStreak || 0);

    await db.update(userStreaks).set({
      currentStreak,
      longestStreak,
      lastActivityDate: today,
      totalXp,
      level: calculateLevel(totalXp),
      updatedAt: new Date(),
    }).where(eq(userStreaks.id, existing.id));
  } else {
    currentStreak = 1;
    totalXp = xpEarned;
    await db.insert(userStreaks).values({
      userId,
      currentStreak: 1,
      longestStreak: 1,
      lastActivityDate: today,
      totalXp,
      level: 1,
    });
  }

  const newLevel = calculateLevel(totalXp);
  const oldLevel = existing?.level || 1;
  const levelUp = newLevel > oldLevel;

  const { assessmentInstances: aiTable } = await import("@/lib/db/schemas/assessments");
  const { basicReports: brTable } = await import("@/lib/db/schemas/reports");

  const [assessCount] = await db.select({ count: sql<number>`count(*)` }).from(aiTable)
    .where(and(eq(aiTable.userId, userId), eq(aiTable.status, "completed")));

  const previousScore = existing?.lastActivityDate
    ? Number((await db.select({ score: brTable.overallScore }).from(brTable)
        .where(eq(brTable.userId, userId))
        .orderBy(sql`${brTable.createdAt} DESC`)
        .limit(1))[0]?.score) || undefined
    : undefined;

  const [bestScoreRow] = await db.select({ best: sql<number>`coalesce(max(${brTable.overallScore}), 0)` })
    .from(brTable).where(eq(brTable.userId, userId));
  const historicalBest = bestScoreRow?.best || 0;
  const bestScore = Math.max(historicalBest, score);

  const [avgScoreRow] = await db.select({ avg: sql<number>`coalesce(avg(${brTable.overallScore}), 0)` })
    .from(brTable).where(eq(brTable.userId, userId));
  const historicalAvg = Math.round(avgScoreRow?.avg || 0);
  const totalAssessments = (assessCount?.count || 0) + 1;
  const avgScore = Math.round(((historicalAvg * (assessCount?.count || 0)) + score) / totalAssessments);

  const stats: UserStats = {
    totalAssessments,
    avgScore,
    currentStreak,
    bestScore,
    totalXp,
    level: newLevel,
    ...(previousScore !== undefined ? { previousScore } : {}),
  };

  const newBadges: BadgeDefinition[] = [];
  const existingBadges = await db.select({ badgeCode: userBadges.badgeCode })
    .from(userBadges).where(eq(userBadges.userId, userId));
  const ownedCodes = new Set(existingBadges.map((b) => b.badgeCode));

  for (const badge of BADGES) {
    if (!ownedCodes.has(badge.code) && badge.condition(stats)) {
      newBadges.push(badge);
      await db.insert(userBadges).values({
        userId,
        badgeCode: badge.code,
        badgeName: badge.name,
        description: badge.description,
        iconUrl: badge.iconUrl,
        xpAwarded: badge.xpAwarded,
      });
      xpEarned += badge.xpAwarded;
    }
  }

  try {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekKey = weekStart.toISOString().split("T")[0];
    const period = `weekly-${weekKey}`;

    const [existingLeaderboard] = await db.select().from(leaderboard)
      .where(and(eq(leaderboard.userId, userId), eq(leaderboard.period, period))).limit(1);

    if (existingLeaderboard) {
      await db.update(leaderboard).set({
        totalXp,
        assessmentCount: totalAssessments,
        avgScore,
        updatedAt: now,
      }).where(eq(leaderboard.id, existingLeaderboard.id));
    } else {
      await db.insert(leaderboard).values({
        userId,
        period,
        totalXp,
        assessmentCount: totalAssessments,
        avgScore,
      });
    }
  } catch (err) {
    console.error("Leaderboard update failed:", err);
  }

  return { xpEarned, levelUp, newBadges };
}

export async function getUserGamification(userId: string) {
  const [streak] = await db.select().from(userStreaks)
    .where(eq(userStreaks.userId, userId)).limit(1);

  const badges = await db.select().from(userBadges)
    .where(eq(userBadges.userId, userId)).orderBy(desc(userBadges.awardedAt));

  return {
    currentStreak: streak?.currentStreak || 0,
    longestStreak: streak?.longestStreak || 0,
    totalXp: streak?.totalXp || 0,
    level: streak?.level || 1,
    nextLevelXp: xpForLevel((streak?.level || 1) + 1),
    badges: badges.map((b) => ({
      code: b.badgeCode,
      name: b.badgeName,
      description: b.description,
      iconUrl: b.iconUrl,
      awardedAt: b.awardedAt?.toISOString() || "",
    })),
  };
}

export async function getLeaderboard(period: string = "weekly", limit: number = 20) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekKey = weekStart.toISOString().split("T")[0];
  const currentPeriod = period === "weekly" ? `weekly-${weekKey}` : period;

  const rows = await db.select({
    userId: leaderboard.userId,
    totalXp: leaderboard.totalXp,
    assessmentCount: leaderboard.assessmentCount,
    avgScore: leaderboard.avgScore,
  }).from(leaderboard)
    .where(eq(leaderboard.period, currentPeriod))
    .orderBy(desc(leaderboard.totalXp))
    .limit(limit);

  const userIds = rows.map((r) => r.userId);
  if (userIds.length === 0) return [];

  const { users } = await import("@/lib/db/schemas");
  const userNames = await db.select({ id: users.id, firstName: users.firstName, lastName: users.lastName })
    .from(users).where(inArray(users.id, userIds));
  const nameMap: Record<string, string> = {};
  for (const u of userNames) nameMap[u.id] = `${u.firstName} ${u.lastName}`;

  return rows.map((r, i) => ({
    rank: i + 1,
    userId: r.userId,
    name: nameMap[r.userId] || "Unknown",
    totalXp: r.totalXp || 0,
    assessmentCount: r.assessmentCount || 0,
    avgScore: r.avgScore || 0,
  }));
}

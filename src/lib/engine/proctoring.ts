import { db } from "@/lib/db";
import { assessmentProctoring } from "@/lib/db/schemas/assessments";
import { eq, sql } from "drizzle-orm";

export type ProctorEventType =
  | "tab_switch" | "copy" | "paste" | "idle"
  | "face_detected" | "multiple_faces" | "phone_detected" | "audio_anomaly";

export interface ProctorEvent {
  instanceId: string;
  eventType: ProctorEventType;
  metadata?: Record<string, any>;
}

export async function logProctorEvent(event: ProctorEvent): Promise<void> {
  try {
    await db.insert(assessmentProctoring).values({
      instanceId: event.instanceId,
      eventType: event.eventType,
      metadata: event.metadata || {},
    });
  } catch (error) {
    console.error("Proctoring log error:", error);
  }
}

export interface IntegrityReport {
  totalEvents: number;
  tabSwitches: number;
  copyPasteEvents: number;
  idleEvents: number;
  suspiciousEvents: number;
  integrityScore: number;
  riskLevel: "low" | "medium" | "high";
  details: string[];
}

export async function getIntegrityReport(instanceId: string): Promise<IntegrityReport> {
  const events = await db.select().from(assessmentProctoring)
    .where(eq(assessmentProctoring.instanceId, instanceId));

  const tabSwitches = events.filter((e) => e.eventType === "tab_switch").length;
  const copyPasteEvents = events.filter((e) => e.eventType === "copy" || e.eventType === "paste").length;
  const idleEvents = events.filter((e) => e.eventType === "idle").length;
  const multipleFaces = events.filter((e) => e.eventType === "multiple_faces").length;
  const phoneDetected = events.filter((e) => e.eventType === "phone_detected").length;

  const suspiciousEvents = tabSwitches + copyPasteEvents + multipleFaces + phoneDetected;

  let integrityScore = 100;
  integrityScore -= Math.min(30, tabSwitches * 5);
  integrityScore -= Math.min(25, copyPasteEvents * 10);
  integrityScore -= Math.min(15, multipleFaces * 15);
  integrityScore -= Math.min(15, phoneDetected * 15);
  integrityScore -= Math.min(10, idleEvents * 2);
  integrityScore = Math.max(0, integrityScore);

  const riskLevel: "low" | "medium" | "high" =
    integrityScore >= 80 ? "low" : integrityScore >= 50 ? "medium" : "high";

  const details: string[] = [];
  if (tabSwitches > 3) details.push(`${tabSwitches} tab switches detected - possible looking at external resources`);
  if (copyPasteEvents > 0) details.push(`${copyPasteEvents} copy/paste events - possible content plagiarism`);
  if (multipleFaces > 0) details.push(`${multipleFaces} instances of multiple faces - possible unauthorized assistance`);
  if (phoneDetected > 0) details.push(`${phoneDetected} instances of phone usage detected`);
  if (idleEvents > 5) details.push(`${idleEvents} idle periods detected - possible distraction`);

  return {
    totalEvents: events.length,
    tabSwitches,
    copyPasteEvents,
    idleEvents,
    suspiciousEvents,
    integrityScore,
    riskLevel,
    details,
  };
}

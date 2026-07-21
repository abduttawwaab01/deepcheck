import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface BasicReportPDF {
  studentName: string;
  score: number;
  category: string;
  date: string;
  topics: { name: string; score: number }[];
  strengths: string[];
  weaknesses: string[];
  recommendations: (string | { title: string; description: string; priority?: string })[];
}

export function generateBasicReportPDF(report: BasicReportPDF): Blob {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Deep Check - Basic Report", pageWidth / 2, y, { align: "center" });
  y += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated on ${report.date}`, pageWidth / 2, y, { align: "center" });
  doc.setTextColor(0, 0, 0);
  y += 12;

  doc.setDrawColor(220, 220, 220);
  doc.line(20, y, pageWidth - 20, y);
  y += 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Student Information", 20, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Name: ${report.studentName}`, 20, y);
  y += 6;
  doc.text(`Assessment Type: ${report.category}`, 20, y);
  y += 6;
  doc.text(`Date: ${report.date}`, 20, y);
  y += 6;
  doc.text(`Overall Score: ${report.score}%`, 20, y);
  y += 12;

  if (report.topics.length > 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Topic Breakdown", 20, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Topic", "Score", "Status"]],
      body: report.topics.map((t) => [
        t.name,
        `${t.score}%`,
        t.score >= 70 ? "Strong" : t.score >= 50 ? "Average" : "Weak",
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235] },
      columnStyles: { 1: { halign: "right" }, 2: { halign: "center" } },
      margin: { left: 20, right: 20 },
    });
    y = (doc as any).lastAutoTable.finalY + 10;
  }

  if (report.strengths.length > 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Strengths", 20, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    for (const s of report.strengths) {
      doc.text(`• ${s}`, 24, y);
      y += 6;
    }
    y += 4;
  }

  if (report.weaknesses.length > 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Areas for Improvement", 20, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    for (const w of report.weaknesses) {
      doc.text(`• ${w}`, 24, y);
      y += 6;
    }
    y += 4;
  }

  if (report.recommendations.length > 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Recommendations", 20, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    let idx = 1;
    for (const r of report.recommendations) {
      const text = typeof r === "string" ? r : `${r.title}: ${r.description}`;
      const lines = doc.splitTextToSize(`${idx}. ${text}`, pageWidth - 48);
      for (const line of lines) {
        doc.text(line, 24, y);
        y += 5;
      }
      y += 2;
      idx++;
    }
  }

  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text("Powered by Deep Check — Psychometric Learning Diagnostics", pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });

  return doc.output("blob");
}

interface DeepReportPDF {
  studentName: string;
  overallScore: number;
  thetaEstimate: number;
  classification: string;
  date: string;
  assessmentType: string;
  topicBreakdown: { name: string; mastery: number; responses: number }[];
  strengths: string[];
  weaknesses: string[];
  recommendations: { title: string; description: string; priority: string }[];
  cognitiveProfile?: string;
  studyPlan?: { week: number; topics: string[]; activities: string[] }[];
}

export function generateDeepReportPDF(report: DeepReportPDF): Blob {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Deep Check — Diagnostic Report", pageWidth / 2, y, { align: "center" });
  y += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text(`${report.studentName} | ${report.assessmentType} | ${report.date}`, pageWidth / 2, y, { align: "center" });
  doc.setTextColor(0, 0, 0);
  y += 12;

  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.5);
  doc.line(20, y, pageWidth - 20, y);
  y += 10;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Performance Summary", 20, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: [
      ["Overall Score", `${report.overallScore}%`],
      ["Ability Estimate (θ)", report.thetaEstimate.toFixed(3)],
      ["Classification", report.classification],
      ["Total Topics Assessed", String(report.topicBreakdown.length)],
    ],
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 20, right: 20 },
  });
  y = (doc as any).lastAutoTable.finalY + 12;

  if (report.topicBreakdown.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Topic Mastery Analysis", 20, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Topic", "Mastery %", "Responses", "Status"]],
      body: report.topicBreakdown.map((t) => [
        t.name,
        `${Math.round(t.mastery * 100)}%`,
        String(t.responses),
        t.mastery >= 0.7 ? "Proficient" : t.mastery >= 0.4 ? "Developing" : "Emerging",
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235] },
      margin: { left: 20, right: 20 },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 3) {
          const val = data.cell.raw as string;
          if (val === "Proficient") data.cell.styles.textColor = [22, 163, 74];
          else if (val === "Emerging") data.cell.styles.textColor = [220, 38, 38];
        }
      },
    });
    y = (doc as any).lastAutoTable.finalY + 12;
  }

  if (report.strengths.length > 0 || report.weaknesses.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Strengths & Weaknesses", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    if (report.strengths.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Strengths:", 20, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      for (const s of report.strengths) {
        doc.text(`✓ ${s}`, 24, y);
        y += 5;
      }
      y += 3;
    }
    if (report.weaknesses.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Weaknesses:", 20, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      for (const w of report.weaknesses) {
        doc.text(`✗ ${w}`, 24, y);
        y += 5;
      }
      y += 3;
    }
  }

  if (y > 250) { doc.addPage(); y = 20; }

  if (report.recommendations.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Recommendations", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    for (const r of report.recommendations) {
      const priorityMarker = r.priority === "high" ? "[HIGH]" : r.priority === "medium" ? "[MED]" : "[LOW]";
      const lines = doc.splitTextToSize(`${priorityMarker} ${r.title}: ${r.description}`, pageWidth - 48);
      for (const line of lines) {
        doc.text(line, 24, y);
        y += 5;
      }
      y += 4;
      if (y > 270) { doc.addPage(); y = 20; }
    }
  }

  if (report.cognitiveProfile) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Cognitive Profile", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(report.cognitiveProfile, pageWidth - 40);
    for (const line of lines) {
      doc.text(line, 20, y);
      y += 5;
    }
    y += 8;
  }

  if (report.studyPlan && report.studyPlan.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Study Plan", 20, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Week", "Topics", "Activities"]],
      body: report.studyPlan.map((w) => [
        `Week ${w.week}`,
        w.topics.join(", ") || "—",
        w.activities.join(", ") || "—",
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235] },
      margin: { left: 20, right: 20 },
      columnStyles: { 0: { cellWidth: 20 } },
    });
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 160);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
    doc.text("Powered by Deep Check — Psychometric Learning Diagnostics", pageWidth / 2, doc.internal.pageSize.getHeight() - 6, { align: "center" });
  }

  return doc.output("blob");
}

interface SchoolDeepReportPDF {
  schoolName: string;
  overallScore: number;
  overallRating: string;
  date: string;
  domainAnalysis: { domain: string; score: number; rating: string; findings: string[]; improvements: string[] }[];
  criticalGaps: { domain: string; score: number }[];
  strengths: { domain: string; score: number }[];
  priorityActions: { rank: number; domain: string; action: string; expectedImpact: string; timeframe: string; difficulty: string }[];
  benchmarkComparison: { domain: string; schoolScore: number; bestPracticeScore: number; gap: number; status: string }[];
  improvementTimeline: { phase30Days: { actions: string[]; expectedOutcome: string }; phase60Days: { actions: string[]; expectedOutcome: string }; phase90Days: { actions: string[]; expectedOutcome: string } };
  aiSummary: string;
}

export function generateSchoolDeepReportPDF(report: SchoolDeepReportPDF): Blob {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  const BLUE: [number, number, number] = [37, 99, 235];
  const GREEN: [number, number, number] = [22, 163, 74];
  const RED: [number, number, number] = [220, 38, 38];
  const GRAY: [number, number, number] = [120, 120, 120];

  function addFooter(pageNum: number, total: number) {
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 160);
    doc.text(`Page ${pageNum} of ${total}`, pageWidth / 2, pageHeight - 10, { align: "center" });
    doc.text("Powered by Deep Check", pageWidth / 2, pageHeight - 6, { align: "center" });
  }

  function checkNewPage(needed: number): boolean {
    if (y + needed > pageHeight - 30) {
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  }

  function sectionTitle(title: string) {
    checkNewPage(20);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(title, margin, y);
    y += 6;
    doc.setDrawColor(...BLUE);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + contentWidth, y);
    y += 8;
  }

  function drawWrappedText(text: string, x: number, maxWidth: number, lineHeight = 5): void {
    const lines = doc.splitTextToSize(text, maxWidth);
    for (const line of lines) {
      checkNewPage(6);
      doc.text(line, x, y);
      y += lineHeight;
    }
  }

  // ── Cover Page ──
  doc.setFillColor(...BLUE);
  doc.rect(0, 0, pageWidth, 80, "F");

  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("School Assessment", pageWidth / 2, 35, { align: "center" });
  doc.setFontSize(16);
  doc.text("Deep Report", pageWidth / 2, 48, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(report.schoolName, pageWidth / 2, 65, { align: "center" });

  y = 100;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(report.schoolName, pageWidth / 2, y, { align: "center" });
  y += 14;

  doc.setFontSize(36);
  doc.setTextColor(...BLUE);
  doc.text(`${report.overallScore}%`, pageWidth / 2, y, { align: "center" });
  y += 12;

  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(`Rating: ${report.overallRating}`, pageWidth / 2, y, { align: "center" });
  y += 10;

  doc.setFontSize(11);
  doc.setTextColor(...GRAY);
  doc.text(`Date: ${report.date}`, pageWidth / 2, y, { align: "center" });

  addFooter(1, 1);

  // ── Page 2+: Executive Summary ──
  doc.addPage();
  y = margin;

  sectionTitle("Executive Summary");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  drawWrappedText(report.aiSummary, margin, contentWidth);
  y += 8;

  // ── Domain Analysis ──
  if (report.domainAnalysis.length > 0) {
    sectionTitle("Domain Analysis");
    autoTable(doc, {
      startY: y,
      head: [["Domain", "Score", "Rating"]],
      body: report.domainAnalysis.map((d) => [d.domain, `${d.score}%`, d.rating]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: BLUE },
      margin: { left: margin, right: margin },
      columnStyles: { 1: { halign: "right" }, 2: { halign: "center" } },
    });
    y = (doc as any).lastAutoTable.finalY + 12;

    for (const domain of report.domainAnalysis) {
      checkNewPage(30);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(`${domain.domain} — Findings & Improvements`, margin, y);
      y += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      if (domain.findings.length > 0) {
        doc.setTextColor(0, 0, 0);
        for (const f of domain.findings) {
          checkNewPage(6);
          doc.text(`• ${f}`, margin + 4, y);
          y += 5;
        }
      }
      if (domain.improvements.length > 0) {
        for (const imp of domain.improvements) {
          checkNewPage(6);
          doc.setTextColor(...BLUE);
          doc.text(`→ ${imp}`, margin + 4, y);
          y += 5;
        }
      }
      y += 4;
    }
  }

  // ── Critical Gaps ──
  if (report.criticalGaps.length > 0) {
    sectionTitle("Critical Gaps");
    doc.setFillColor(254, 226, 226);
    doc.roundedRect(margin, y - 2, contentWidth, report.criticalGaps.length * 8 + 8, 2, 2, "F");
    y += 5;
    autoTable(doc, {
      startY: y,
      head: [["Domain", "Score"]],
      body: report.criticalGaps.map((g) => [g.domain, `${g.score}%`]),
      styles: { fontSize: 9, cellPadding: 3, textColor: RED },
      headStyles: { fillColor: RED },
      margin: { left: margin, right: margin },
      columnStyles: { 1: { halign: "right" } },
    });
    y = (doc as any).lastAutoTable.finalY + 12;
  }

  // ── Strengths ──
  if (report.strengths.length > 0) {
    sectionTitle("Strengths");
    doc.setFillColor(220, 252, 231);
    doc.roundedRect(margin, y - 2, contentWidth, report.strengths.length * 8 + 8, 2, 2, "F");
    y += 5;
    autoTable(doc, {
      startY: y,
      head: [["Domain", "Score"]],
      body: report.strengths.map((s) => [s.domain, `${s.score}%`]),
      styles: { fontSize: 9, cellPadding: 3, textColor: GREEN },
      headStyles: { fillColor: GREEN },
      margin: { left: margin, right: margin },
      columnStyles: { 1: { halign: "right" } },
    });
    y = (doc as any).lastAutoTable.finalY + 12;
  }

  // ── Priority Actions ──
  if (report.priorityActions.length > 0) {
    checkNewPage(30);
    sectionTitle("Priority Actions");
    autoTable(doc, {
      startY: y,
      head: [["#", "Domain", "Action", "Impact", "Timeframe", "Difficulty"]],
      body: report.priorityActions.map((a) => [
        String(a.rank),
        a.domain,
        a.action,
        a.expectedImpact,
        a.timeframe,
        a.difficulty,
      ]),
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: BLUE },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 28 },
        4: { cellWidth: 25, halign: "center" },
        5: { cellWidth: 22, halign: "center" },
      },
    });
    y = (doc as any).lastAutoTable.finalY + 12;
  }

  // ── Benchmark Comparison ──
  if (report.benchmarkComparison.length > 0) {
    checkNewPage(30);
    sectionTitle("Benchmark Comparison");
    autoTable(doc, {
      startY: y,
      head: [["Domain", "School", "Best Practice", "Gap", "Status"]],
      body: report.benchmarkComparison.map((b) => [
        b.domain,
        `${b.schoolScore}%`,
        `${b.bestPracticeScore}%`,
        `${b.gap > 0 ? "+" : ""}${b.gap}%`,
        b.status,
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: BLUE },
      margin: { left: margin, right: margin },
      columnStyles: { 1: { halign: "right" }, 2: { halign: "right" }, 3: { halign: "right" }, 4: { halign: "center" } },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 4) {
          const val = data.cell.raw as string;
          if (val.toLowerCase().includes("leading")) data.cell.styles.textColor = GREEN;
          else if (val.toLowerCase().includes("gap") || val.toLowerCase().includes("critical")) data.cell.styles.textColor = RED;
        }
      },
    });
    y = (doc as any).lastAutoTable.finalY + 12;
  }

  // ── Improvement Timeline ──
  {
    checkNewPage(30);
    sectionTitle("Improvement Timeline");

    const phases = [
      { label: "30 Days", data: report.improvementTimeline.phase30Days, color: [219, 234, 254] as [number, number, number] },
      { label: "60 Days", data: report.improvementTimeline.phase60Days, color: [219, 234, 254] as [number, number, number] },
      { label: "90 Days", data: report.improvementTimeline.phase90Days, color: [220, 252, 231] as [number, number, number] },
    ];

    for (const phase of phases) {
      checkNewPage(20);
      doc.setFillColor(...phase.color);
      doc.roundedRect(margin, y - 3, contentWidth, 8, 1, 1, "F");
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(`Phase: ${phase.label}`, margin + 4, y + 3);
      y += 10;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      for (const action of phase.data.actions) {
        checkNewPage(6);
        doc.text(`• ${action}`, margin + 6, y);
        y += 5;
      }
      checkNewPage(10);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(...BLUE);
      doc.text(`Expected: ${phase.data.expectedOutcome}`, margin + 6, y);
      y += 10;
      doc.setTextColor(0, 0, 0);
    }
  }

  // ── Footer on all pages ──
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  return doc.output("blob");
}

interface ParentDeepReportPDF {
  parentName: string;
  overallScore: number;
  overallRating: string;
  date: string;
  parentingStyle: { primary: string; secondary: string; description: string; strengths: string[]; concerns: string[] };
  domainAnalysis: { domain: string; score: number; rating: string; findings: string[]; practicalTips: string[] }[];
  criticalGaps: { domain: string; score: number }[];
  strengths: { domain: string; score: number }[];
  actionPlan: { week: number; theme: string; actions: string[]; expectedOutcome: string }[];
  redFlags: { domain: string; concern: string; urgency: string }[];
  aiSummary: string;
}

export function generateParentDeepReportPDF(report: ParentDeepReportPDF): Blob {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  const BLUE: [number, number, number] = [37, 99, 235];
  const GREEN: [number, number, number] = [22, 163, 74];
  const RED: [number, number, number] = [220, 38, 38];
  const GRAY: [number, number, number] = [120, 120, 120];

  function addFooter(pageNum: number, total: number) {
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 160);
    doc.text(`Page ${pageNum} of ${total}`, pageWidth / 2, pageHeight - 10, { align: "center" });
    doc.text("Powered by Deep Check", pageWidth / 2, pageHeight - 6, { align: "center" });
  }

  function checkNewPage(needed: number): boolean {
    if (y + needed > pageHeight - 30) {
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  }

  function sectionTitle(title: string) {
    checkNewPage(20);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(title, margin, y);
    y += 6;
    doc.setDrawColor(...BLUE);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + contentWidth, y);
    y += 8;
  }

  function drawWrappedText(text: string, x: number, maxWidth: number, lineHeight = 5): void {
    const lines = doc.splitTextToSize(text, maxWidth);
    for (const line of lines) {
      checkNewPage(6);
      doc.text(line, x, y);
      y += lineHeight;
    }
  }

  // ── Cover Page ──
  doc.setFillColor(...BLUE);
  doc.rect(0, 0, pageWidth, 80, "F");

  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("Parent Assessment", pageWidth / 2, 35, { align: "center" });
  doc.setFontSize(16);
  doc.text("Deep Report", pageWidth / 2, 48, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(report.parentName, pageWidth / 2, 65, { align: "center" });

  y = 100;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(report.parentName, pageWidth / 2, y, { align: "center" });
  y += 14;

  doc.setFontSize(36);
  doc.setTextColor(...BLUE);
  doc.text(`${report.overallScore}%`, pageWidth / 2, y, { align: "center" });
  y += 12;

  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(`Rating: ${report.overallRating}`, pageWidth / 2, y, { align: "center" });
  y += 10;

  doc.setFontSize(11);
  doc.setTextColor(...GRAY);
  doc.text(`Date: ${report.date}`, pageWidth / 2, y, { align: "center" });

  addFooter(1, 1);

  // ── Page 2+: Parenting Style Profile ──
  doc.addPage();
  y = margin;

  sectionTitle("Parenting Style Profile");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Primary Style: ${report.parentingStyle.primary}`, margin, y);
  y += 6;
  doc.text(`Secondary Style: ${report.parentingStyle.secondary}`, margin, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  drawWrappedText(report.parentingStyle.description, margin, contentWidth);
  y += 4;

  if (report.parentingStyle.strengths.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...GREEN);
    doc.text("Style Strengths:", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    for (const s of report.parentingStyle.strengths) {
      checkNewPage(6);
      doc.text(`✓ ${s}`, margin + 4, y);
      y += 5;
    }
    y += 4;
  }

  if (report.parentingStyle.concerns.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...RED);
    doc.text("Style Concerns:", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    for (const c of report.parentingStyle.concerns) {
      checkNewPage(6);
      doc.text(`✗ ${c}`, margin + 4, y);
      y += 5;
    }
    y += 4;
  }

  // ── Executive Summary ──
  sectionTitle("Executive Summary");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  drawWrappedText(report.aiSummary, margin, contentWidth);
  y += 8;

  // ── Domain Analysis ──
  if (report.domainAnalysis.length > 0) {
    sectionTitle("Domain Analysis");
    autoTable(doc, {
      startY: y,
      head: [["Domain", "Score", "Rating"]],
      body: report.domainAnalysis.map((d) => [d.domain, `${d.score}%`, d.rating]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: BLUE },
      margin: { left: margin, right: margin },
      columnStyles: { 1: { halign: "right" }, 2: { halign: "center" } },
    });
    y = (doc as any).lastAutoTable.finalY + 12;

    for (const domain of report.domainAnalysis) {
      checkNewPage(30);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(`${domain.domain} — Findings & Practical Tips`, margin, y);
      y += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      if (domain.findings.length > 0) {
        for (const f of domain.findings) {
          checkNewPage(6);
          doc.setTextColor(0, 0, 0);
          doc.text(`• ${f}`, margin + 4, y);
          y += 5;
        }
      }
      if (domain.practicalTips.length > 0) {
        for (const tip of domain.practicalTips) {
          checkNewPage(6);
          doc.setTextColor(...BLUE);
          doc.text(`💡 ${tip}`, margin + 4, y);
          y += 5;
        }
      }
      y += 4;
    }
  }

  // ── Critical Gaps ──
  if (report.criticalGaps.length > 0) {
    sectionTitle("Critical Gaps");
    doc.setFillColor(254, 226, 226);
    doc.roundedRect(margin, y - 2, contentWidth, report.criticalGaps.length * 8 + 8, 2, 2, "F");
    y += 5;
    autoTable(doc, {
      startY: y,
      head: [["Domain", "Score"]],
      body: report.criticalGaps.map((g) => [g.domain, `${g.score}%`]),
      styles: { fontSize: 9, cellPadding: 3, textColor: RED },
      headStyles: { fillColor: RED },
      margin: { left: margin, right: margin },
      columnStyles: { 1: { halign: "right" } },
    });
    y = (doc as any).lastAutoTable.finalY + 12;
  }

  // ── Strengths ──
  if (report.strengths.length > 0) {
    sectionTitle("Strengths");
    doc.setFillColor(220, 252, 231);
    doc.roundedRect(margin, y - 2, contentWidth, report.strengths.length * 8 + 8, 2, 2, "F");
    y += 5;
    autoTable(doc, {
      startY: y,
      head: [["Domain", "Score"]],
      body: report.strengths.map((s) => [s.domain, `${s.score}%`]),
      styles: { fontSize: 9, cellPadding: 3, textColor: GREEN },
      headStyles: { fillColor: GREEN },
      margin: { left: margin, right: margin },
      columnStyles: { 1: { halign: "right" } },
    });
    y = (doc as any).lastAutoTable.finalY + 12;
  }

  // ── 4-Week Action Plan ──
  if (report.actionPlan.length > 0) {
    checkNewPage(30);
    sectionTitle("4-Week Action Plan");
    autoTable(doc, {
      startY: y,
      head: [["Week", "Theme", "Actions", "Expected Outcome"]],
      body: report.actionPlan.map((w) => [
        `Week ${w.week}`,
        w.theme,
        w.actions.join("\n"),
        w.expectedOutcome,
      ]),
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: BLUE },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 18, halign: "center" },
        1: { cellWidth: 30 },
        2: { cellWidth: 70 },
      },
    });
    y = (doc as any).lastAutoTable.finalY + 12;
  }

  // ── Red Flags ──
  if (report.redFlags.length > 0) {
    checkNewPage(30);
    sectionTitle("Red Flags");
    doc.setFillColor(254, 226, 226);
    doc.roundedRect(margin, y - 2, contentWidth, report.redFlags.length * 10 + 8, 2, 2, "F");
    y += 5;
    autoTable(doc, {
      startY: y,
      head: [["Domain", "Concern", "Urgency"]],
      body: report.redFlags.map((r) => [r.domain, r.concern, r.urgency]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: RED },
      margin: { left: margin, right: margin },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 2) {
          const val = (data.cell.raw as string).toLowerCase();
          if (val === "high" || val === "critical") data.cell.styles.textColor = RED;
          else if (val === "medium") data.cell.styles.textColor = [234, 179, 8];
        }
      },
    });
    y = (doc as any).lastAutoTable.finalY + 12;
  }

  // ── Footer on all pages ──
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  return doc.output("blob");
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

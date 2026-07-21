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

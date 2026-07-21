"use client";

import { ReactNode, useCallback } from "react";

type CSVRow = Record<string, string | number>;
type CSVRowArray = (string | number)[];

interface CSVLinkProps {
  data: CSVRow[] | CSVRowArray[];
  filename: string;
  children: ReactNode;
  className?: string;
}

export function CSVLink({ data, filename, children, className }: CSVLinkProps) {
  const handleDownload = useCallback(() => {
    if (data.length === 0) return;
    let headers: string[];
    let rows: string[][];
    if (Array.isArray(data[0])) {
      headers = (data[0] as CSVRowArray).map(String);
      rows = (data as CSVRowArray[]).slice(1).map((r) => r.map(String));
    } else {
      headers = Object.keys(data[0] as CSVRow);
      rows = (data as CSVRow[]).map((row) => headers.map((h) => String(row[h] ?? "")));
    }
    const csvRows = [headers.join(",")];
    for (const row of rows) {
      const values = row.map((val) =>
        val.includes(",") || val.includes('"') || val.includes("\n")
          ? `"${val.replace(/"/g, '""')}"`
          : val
      );
      csvRows.push(values.join(","));
    }
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data, filename]);

  return (
    <button onClick={handleDownload} className={className}>
      {children}
    </button>
  );
}

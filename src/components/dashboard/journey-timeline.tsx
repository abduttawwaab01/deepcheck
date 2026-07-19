"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface JourneyPoint {
  date: string;
  score: number;
}

export function JourneyTimeline({ data }: { data: JourneyPoint[] }) {
  if (!data.length) return null;

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">📈 Learning Journey</h3>
        <span className="text-xs text-neutral-400">Last {data.length} assessments</span>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-neutral-800" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(8px)",
              }}
            />
            <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
        <span>Started: {data[0]?.date}</span>
        <span>Latest: {data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}

import type { ChartData } from "@/data/assessments/types";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#ec4899"];

export function BarChart({ data }: { data: ChartData }) {
  const maxVal = Math.max(...data.values, 1);
  const barWidth = Math.min(40, 600 / data.values.length - 8);
  return (
    <div className="my-4">
      <p className="mb-2 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400">{data.title}</p>
      <svg viewBox={`0 0 ${data.values.length * (barWidth + 8) + 40} 200`} className="w-full max-h-48">
        <line x1="30" y1="180" x2={data.values.length * (barWidth + 8) + 30} y2="180" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="30" y1="10" x2="30" y2="180" stroke="#94a3b8" strokeWidth="1.5" />
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
          <g key={frac}>
            <line x1="27" y1={180 - frac * 170} x2="30" y2={180 - frac * 170} stroke="#94a3b8" strokeWidth="1" />
            <text x="25" y={182 - frac * 170} textAnchor="end" fontSize="9" fill="#94a3b8">{Math.round(maxVal * frac)}{data.unit || ""}</text>
          </g>
        ))}
        {data.values.map((v, i) => {
          const h = (v / maxVal) * 170;
          const x = 35 + i * (barWidth + 8);
          return (
            <g key={i}>
              <rect x={x} y={180 - h} width={barWidth} height={h} rx="3" fill={data.colors?.[i] || COLORS[i % COLORS.length]} opacity="0.85" />
              <text x={x + barWidth / 2} y="195" textAnchor="middle" fontSize="8" fill="#94a3b8">{data.labels[i]}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function PieChart({ data }: { data: ChartData }) {
  const total = data.values.reduce((a, b) => a + b, 0) || 1;
  let cumulative = 0;
  const arcs = data.values.map((v, i) => {
    const startAngle = (cumulative / total) * 360;
    cumulative += v;
    const endAngle = (cumulative / total) * 360;
    return { start: (startAngle - 90) * (Math.PI / 180), end: (endAngle - 90) * (Math.PI / 180), color: data.colors?.[i] || COLORS[i % COLORS.length], label: data.labels[i], value: v };
  });

  return (
    <div className="my-4 flex flex-col items-center">
      <p className="mb-2 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400">{data.title}</p>
      <svg viewBox="0 0 200 200" className="w-48 h-48">
        {arcs.map((arc, i) => {
          const r = 80;
          const x1 = 100 + r * Math.cos(arc.start);
          const y1 = 100 + r * Math.sin(arc.start);
          const x2 = 100 + r * Math.cos(arc.end);
          const y2 = 100 + r * Math.sin(arc.end);
          const largeArc = arc.end - arc.start > Math.PI ? 1 : 0;
          return <path key={i} d={`M100 100 L${x1} ${y1} A${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`} fill={arc.color} opacity="0.85" />;
        })}
      </svg>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {arcs.map((arc, i) => (
          <div key={i} className="flex items-center gap-1 text-xs text-neutral-500">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: arc.color }} />
            {arc.label} ({Math.round((arc.value / total) * 100)}%)
          </div>
        ))}
      </div>
    </div>
  );
}

export function LineChart({ data }: { data: ChartData }) {
  const maxVal = Math.max(...data.values, 1);
  const minVal = Math.min(...data.values, 0);
  const range = maxVal - minVal || 1;
  const w = Math.max(200, data.values.length * 50);
  const h = 180;
  const pad = { top: 10, right: 10, bottom: 30, left: 35 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;
  const stepX = innerW / (data.values.length - 1 || 1);
  const points = data.values.map((v, i) => `${pad.left + i * stepX},${pad.top + innerH - ((v - minVal) / range) * innerH}`);
  const polyline = points.join(" ");

  return (
    <div className="my-4">
      <p className="mb-2 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400">{data.title}</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-48">
        <line x1={pad.left} y1={pad.top + innerH} x2={pad.left + innerW} y2={pad.top + innerH} stroke="#94a3b8" strokeWidth="1.5" />
        <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + innerH} stroke="#94a3b8" strokeWidth="1.5" />
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
          <g key={frac}>
            <line x1={pad.left - 3} y1={pad.top + innerH - frac * innerH} x2={pad.left} y2={pad.top + innerH - frac * innerH} stroke="#94a3b8" strokeWidth="1" />
            <text x={pad.left - 5} y={pad.top + innerH - frac * innerH + 3} textAnchor="end" fontSize="9" fill="#94a3b8">{Math.round(minVal + frac * range)}{data.unit || ""}</text>
          </g>
        ))}
        {data.values.map((_, i) => (
          <text key={i} x={pad.left + i * stepX} y={pad.top + innerH + 15} textAnchor="middle" fontSize="8" fill="#94a3b8">{data.labels[i]}</text>
        ))}
        <polyline points={polyline} fill="none" stroke={data.colors?.[0] || "#6366f1"} strokeWidth="2.5" strokeLinejoin="round" />
        {data.values.map((v, i) => (
          <circle key={i} cx={pad.left + i * stepX} cy={pad.top + innerH - ((v - minVal) / range) * innerH} r="4" fill={data.colors?.[0] || "#6366f1"} />
        ))}
      </svg>
    </div>
  );
}

export function ChartRenderer({ data }: { data: ChartData }) {
  switch (data.type) {
    case "bar": return <BarChart data={data} />;
    case "pie": return <PieChart data={data} />;
    case "line": return <LineChart data={data} />;
  }
}

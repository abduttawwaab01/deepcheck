import type { GeometryData } from "@/data/assessments/types";

export function GeometryRenderer({ data }: { data: GeometryData }) {
  switch (data.type) {
    case "right_triangle": return <RightTriangle data={data} />;
    case "triangle": return <Triangle data={data} />;
    case "circle": return <Circle data={data} />;
    case "graph": return <Graph data={data} />;
    case "number_line": return <NumberLine data={data} />;
    case "quadrilateral": return <Quadrilateral data={data} />;
    default: return <div className="p-4 text-sm text-neutral-500">Diagram: {data.label}</div>;
  }
}

function RightTriangle({ data }: { data: GeometryData }) {
  const { dimensions } = data;
  const base = dimensions.base || 4;
  const height = dimensions.height || 3;
  const scale = 40;
  const w = base * scale + 40;
  const h = height * scale + 40;
  return (
    <div className="my-4 flex justify-center">
      <svg viewBox={`0 0 ${w} ${h}`} className="max-h-48 w-auto" style={{ maxWidth: 280 }}>
        <polygon points={`20,${h - 20} ${w - 20},${h - 20} 20,${h - 20 - height * scale}`} fill="none" stroke="#6366f1" strokeWidth="2" />
        <rect x="20" y={h - 20 - height * scale} width="12" height="12" fill="none" stroke="#6366f1" strokeWidth="1" />
        <text x={w / 2} y={h - 5} textAnchor="middle" fontSize="11" fill="#64748b">{dimensions.baseLabel || `base = ${base}`}</text>
        <text x="10" y={h / 2} textAnchor="middle" fontSize="11" fill="#64748b" transform={`rotate(-90, 10, ${h / 2})`}>{dimensions.heightLabel || `height = ${height}`}</text>
        <text x={(w - 20) * 0.6} y={h - 20 - height * scale * 0.4} fontSize="11" fill="#64748b" transform={`rotate(${Math.atan2(height, base) * (180 / Math.PI)}, ${(w - 20) * 0.6}, ${h - 20 - height * scale * 0.4})`}>
          {dimensions.hypLabel || `hypotenuse`}
        </text>
      </svg>
    </div>
  );
}

function Triangle({ data }: { data: GeometryData }) {
  const s1 = data.dimensions.side1 || 5;
  const s2 = data.dimensions.side2 || 5;
  const s3 = data.dimensions.side3 || 5;
  return (
    <div className="my-4 flex justify-center">
      <svg viewBox="0 0 160 140" className="max-h-40 w-auto" style={{ maxWidth: 200 }}>
        <polygon points="80,10 10,130 150,130" fill="none" stroke="#6366f1" strokeWidth="2" />
        <text x="80" y="8" textAnchor="middle" fontSize="11" fill="#64748b">{s1}</text>
        <text x="5" y="125" textAnchor="start" fontSize="11" fill="#64748b">{s2}</text>
        <text x="155" y="125" textAnchor="end" fontSize="11" fill="#64748b">{s3}</text>
        {data.markings?.map((m, i) => <text key={i} x={30 + i * 40} y={20 + i * 30} fontSize="10" fill="#6366f1">{m}</text>)}
      </svg>
    </div>
  );
}

function Circle({ data }: { data: GeometryData }) {
  const r = data.dimensions.radius || 50;
  return (
    <div className="my-4 flex justify-center">
      <svg viewBox="0 0 160 160" className="max-h-40 w-auto" style={{ maxWidth: 200 }}>
        <circle cx="80" cy="80" r={Math.min(r, 70)} fill="none" stroke="#6366f1" strokeWidth="2" />
        <line x1="80" y1="80" x2={80 + Math.min(r, 70)} y2="80" stroke="#6366f1" strokeWidth="1.2" strokeDasharray="4" />
        <text x={80 + Math.min(r, 70) / 2} y="75" textAnchor="middle" fontSize="11" fill="#64748b">r = {data.dimensions.radius || r}</text>
        {data.dimensions.diameter && <line x1={80 - Math.min(r, 70)} y1="80" x2={80 + Math.min(r, 70)} y2="80" stroke="#6366f1" strokeWidth="1" strokeDasharray="3" opacity="0.5" />}
        {data.markings?.map((m, i) => <text key={i} x={90 + i * 30} y={90 + i * 15} fontSize="10" fill="#6366f1">{m}</text>)}
      </svg>
    </div>
  );
}

function Graph({ data }: { data: GeometryData }) {
  const xLabels = [-1, 1, 2, 3, 4].filter((v) => 20 + (v + 1) * 25 <= 170);
  const yLabels = [1, 2, 3, 4, 5].filter((v) => 160 - v * 25 >= 10);
  return (
    <div className="my-4 flex justify-center">
      <svg viewBox="0 0 180 180" className="max-h-44 w-auto" style={{ maxWidth: 220 }}>
        <line x1="20" y1="160" x2="170" y2="160" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="20" y1="10" x2="20" y2="160" stroke="#94a3b8" strokeWidth="1.5" />
        <text x="175" y="164" fontSize="10" fill="#94a3b8">x</text>
        <text x="15" y="14" fontSize="10" fill="#94a3b8">y</text>
        <text x="20" y="175" fontSize="8" fill="#94a3b8">O</text>
        {xLabels.map((v, i) => (
          <text key={`lx${i}`} x={20 + (v + 1) * 25} y="175" textAnchor="middle" fontSize="8" fill="#94a3b8">{v}</text>
        ))}
        {yLabels.map((v, i) => (
          <text key={`ly${i}`} x="12" y={160 - v * 25 + 3} textAnchor="end" fontSize="8" fill="#94a3b8">{v}</text>
        ))}
        {data.dimensions.point1x != null && data.dimensions.point1y != null && (
          <circle cx={20 + (data.dimensions.point1x + 1) * 25} cy={160 - data.dimensions.point1y * 25} r="4" fill="#6366f1" />
        )}
        {data.dimensions.point2x != null && data.dimensions.point2y != null && (
          <circle cx={20 + (data.dimensions.point2x + 1) * 25} cy={160 - data.dimensions.point2y * 25} r="4" fill="#22c55e" />
        )}
      </svg>
    </div>
  );
}

function NumberLine({ data }: { data: GeometryData }) {
  return (
    <div className="my-4 flex justify-center">
      <svg viewBox="0 0 240 40" className="w-full max-h-12">
        <line x1="10" y1="20" x2="230" y2="20" stroke="#94a3b8" strokeWidth="2" />
        {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((v, i) => {
          const x = 20 + v * 20;
          if (x >= 10 && x <= 230) {
            return (
              <g key={i}>
                <line x1={x} y1="15" x2={x} y2="25" stroke="#94a3b8" strokeWidth="1.5" />
                <text x={x} y="37" textAnchor="middle" fontSize="9" fill="#94a3b8">{v}</text>
              </g>
            );
          }
        })}
        {data.dimensions.marker != null && (
          <circle cx={20 + data.dimensions.marker * 20} cy="20" r="5" fill="#6366f1" />
        )}
      </svg>
    </div>
  );
}

function Quadrilateral({ data }: { data: GeometryData }) {
  const w = data.dimensions.width || 6;
  const h = data.dimensions.height || 4;
  const scale = 25;
  const svgW = w * scale + 40;
  const svgH = h * scale + 40;
  return (
    <div className="my-4 flex justify-center">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="max-h-36 w-auto" style={{ maxWidth: 240 }}>
        <rect x="20" y={svgH - 20 - h * scale} width={w * scale} height={h * scale} fill="none" stroke="#6366f1" strokeWidth="2" rx="2" />
        {data.dimensions.width && <text x={20 + (w * scale) / 2} y={svgH - 5} textAnchor="middle" fontSize="11" fill="#64748b">{data.dimensions.width} cm</text>}
        {data.dimensions.height && <text x="10" y={svgH - 20 - (h * scale) / 2} textAnchor="middle" fontSize="11" fill="#64748b" transform={`rotate(-90, 10, ${svgH - 20 - (h * scale) / 2})`}>{data.dimensions.height} cm</text>}
      </svg>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface RadarDataPoint {
  dimension: string;
  student: number;
  peerAverage?: number;
}

interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
  levels?: number;
}

export function RadarChart({ data, size = 300, levels = 5 }: RadarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = 40;
    const radius = (size - margin * 2) / 2;
    const center = size / 2;
    const angleSlice = (Math.PI * 2) / data.length;
    const maxValue = 100;
    const rScale = d3.scaleLinear().domain([0, maxValue]).range([0, radius]);

    const g = svg.append("g").attr("transform", `translate(${center}, ${center})`);

    // Grid levels (concentric polygons)
    for (let level = 1; level <= levels; level++) {
      const r = (radius / levels) * level;
      const points = data.map((_, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        return [r * Math.cos(angle), r * Math.sin(angle)];
      });

      g.append("polygon")
        .attr("points", points.map((p) => p.join(",")).join(" "))
        .attr("fill", "none")
        .attr("stroke", "#e2e8f0")
        .attr("stroke-width", 0.5)
        .attr("class", "dark:stroke-neutral-700");
    }

    // Axes
    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const line = g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", radius * Math.cos(angle))
        .attr("y2", radius * Math.sin(angle))
        .attr("stroke", "#e2e8f0")
        .attr("stroke-width", 0.5)
        .attr("class", "dark:stroke-neutral-700");

      // Labels
      const labelR = radius + 16;
      g.append("text")
        .attr("x", labelR * Math.cos(angle))
        .attr("y", labelR * Math.sin(angle))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", "9")
        .attr("fill", "#64748b")
        .attr("class", "dark:fill-neutral-400")
        .text(d.dimension.length > 10 ? d.dimension.substring(0, 10) + "..." : d.dimension);
    });

    // Student data
    const studentPoints = data.map((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const r = rScale(d.student);
      return [r * Math.cos(angle), r * Math.sin(angle)];
    });

    g.append("polygon")
      .attr("points", studentPoints.map((p) => p.join(",")).join(" "))
      .attr("fill", "rgba(59, 130, 246, 0.2)")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2);

    // Student data points
    studentPoints.forEach((point) => {
      g.append("circle")
        .attr("cx", point[0])
        .attr("cy", point[1])
        .attr("r", 3)
        .attr("fill", "#3b82f6");
    });

    // Peer average (dashed)
    if (data[0]?.peerAverage) {
      const peerPoints = data.map((d, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const r = rScale(d.peerAverage!);
        return [r * Math.cos(angle), r * Math.sin(angle)];
      });

      g.append("polygon")
        .attr("points", peerPoints.map((p) => p.join(",")).join(" "))
        .attr("fill", "none")
        .attr("stroke", "#a855f7")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "4,4");
    }
  }, [data, size, levels]);

  if (!data.length) return null;

  return (
    <div className="flex items-center justify-center">
      <svg ref={svgRef} width={size} height={size} className="overflow-visible" />
    </div>
  );
}

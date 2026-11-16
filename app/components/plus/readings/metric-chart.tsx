"use client";

import { useState } from "react";
import { parseStamp, type HealthMetric } from "@/lib/plus/health";
import { MONTHS_SHORT } from "@/lib/plus/format";
import { hasMetricReading, primaryValue } from "@/lib/plus/metric-series";

type Point = { label: string; at: Date; metric: HealthMetric; primary: number; secondary: number | null };

function points(metrics: HealthMetric[]): Point[] {
  const byDay = new Map<string, Point>();
  for (const m of metrics) {
    const at = parseStamp(m.last_updated);
    if (!at || !hasMetricReading(m)) continue;
    const key = `${at.getFullYear()}-${at.getMonth()}-${at.getDate()}`;
    const existing = byDay.get(key);
    if (existing && at.getTime() <= existing.at.getTime()) continue;
    byDay.set(key, { label: `${MONTHS_SHORT[at.getMonth()]} ${at.getDate()}`, at, metric: m, primary: primaryValue(m), secondary: m.type === "bp" ? m.diastolic ?? 0 : null });
  }
  return [...byDay.values()].sort((a, b) => a.at.getTime() - b.at.getTime());
}

function spline(xy: Array<[number, number]>): string {
  if (xy.length === 0) return "";
  if (xy.length === 1) return `M${xy[0][0]},${xy[0][1]}`;
  let d = `M${xy[0][0]},${xy[0][1]}`;
  for (let i = 0; i < xy.length - 1; i += 1) {
    const p0 = xy[i - 1] ?? xy[i];
    const p1 = xy[i];
    const p2 = xy[i + 1];
    const p3 = xy[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return d;
}

const fmtPrimary = (m: HealthMetric) => {
  if (m.type === "bp") return `${m.systolic ?? 0}/${m.diastolic ?? 0}`;
  const v = Number.parseFloat(m.latest_value) || 0;
  return v === Math.round(v) ? v.toFixed(0) : v.toFixed(1);
};

const compact = (v: number) => (Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1).replace(/\.0$/, "")}K` : String(Math.round(v)));

/** bp_graphs.dart CartesianChart: one point per day, spline, tap to select. */
export default function MetricChart({ metrics, onSelect }: { metrics: HealthMetric[]; onSelect: (m: HealthMetric) => void }) {
  const pts = points(metrics);
  const [tip, setTip] = useState<number | null>(null);
  if (pts.length === 0) {
    return <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(var(--vc-navy-rgb),0.5)", fontWeight: 600, fontSize: 13 }}>No readings in this range yet</div>;
  }
  const isBp = pts[0].metric.type === "bp";
  const unit = isBp ? "mmHg" : pts[0].metric.type === "glucose" ? "mg/dL" : pts[0].metric.type === "weight" ? "kg" : pts[0].metric.unit;
  const values = [...pts.map((p) => p.primary), ...(isBp ? pts.map((p) => p.secondary ?? 0).filter((v) => v > 0) : [])];
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const pad = Math.min(24, Math.max(4, Math.abs(maxV - minV) * 0.18));
  const yMin = Math.max(0, minV - pad);
  const yMax = maxV + pad;
  const W = 360;
  const H = 272;
  const left = 44;
  const right = 12;
  const top = isBp ? 30 : 14;
  const bottom = 26;
  const plotW = W - left - right;
  const plotH = H - top - bottom;
  const xOf = (i: number) => left + (pts.length === 1 ? plotW / 2 : (i / (pts.length - 1)) * plotW);
  const yOf = (v: number) => top + plotH - ((v - yMin) / (yMax - yMin || 1)) * plotH;
  const ticks = 5;
  const tickVals = Array.from({ length: ticks }, (_, i) => yMin + ((yMax - yMin) * i) / (ticks - 1));
  const labelEvery = Math.max(1, Math.ceil(pts.length / 6));
  const primaryXY = pts.map((p, i) => [xOf(i), yOf(p.primary)] as [number, number]);
  const diaPts = pts.map((p, i) => ({ p, i })).filter(({ p }) => (p.secondary ?? 0) > 0);
  const diaXY = diaPts.map(({ p, i }) => [xOf(i), yOf(p.secondary ?? 0)] as [number, number]);
  const navy = "var(--vc-navy)";
  const showLabels = pts.length <= 14;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ overflow: "visible", fontFamily: "inherit" }}>
      {isBp ? (
        <g fontSize={11} fontWeight={700} fill="rgba(var(--vc-navy-rgb),0.7)">
          <line x1={left} x2={left + 14} y1={10} y2={10} stroke={navy} strokeWidth={2.6} />
          <text x={left + 18} y={14}>SYS</text>
          <line x1={left + 54} x2={left + 68} y1={10} y2={10} stroke="var(--vc-action)" strokeWidth={2.4} strokeDasharray="6 4" />
          <text x={left + 72} y={14}>DIA</text>
        </g>
      ) : null}
      {tickVals.map((v, i) => (
        <g key={i}>
          <line x1={left} x2={W - right} y1={yOf(v)} y2={yOf(v)} stroke="rgba(var(--vc-navy-rgb),0.08)" strokeDasharray="4 4" />
          <text x={left - 6} y={yOf(v) + 4} textAnchor="end" fontSize={11} fontWeight={600} fill="rgba(var(--vc-navy-rgb),0.45)">{compact(v)}</text>
        </g>
      ))}
      <text transform={`translate(10 ${top + plotH / 2}) rotate(-90)`} textAnchor="middle" fontSize={10} fontWeight={600} fill="rgba(var(--vc-navy-rgb),0.4)">{unit}</text>
      <line x1={left} x2={W - right} y1={top + plotH} y2={top + plotH} stroke="rgba(var(--vc-navy-rgb),0.12)" />
      {pts.map((p, i) => (i % labelEvery === 0 ? (
        <g key={`x${i}`}>
          <line x1={xOf(i)} x2={xOf(i)} y1={top + plotH} y2={top + plotH + 4} stroke="rgba(var(--vc-navy-rgb),0.2)" />
          <text x={xOf(i)} y={top + plotH + 17} textAnchor="middle" fontSize={11} fontWeight={600} fill="rgba(var(--vc-navy-rgb),0.55)">{p.label}</text>
        </g>
      ) : null))}
      <path d={spline(primaryXY)} fill="none" stroke={navy} strokeWidth={2.6} />
      {isBp && diaXY.length ? <path d={spline(diaXY)} fill="none" stroke="var(--vc-action)" strokeWidth={2.4} strokeDasharray="6 4" /> : null}
      {isBp
        ? diaPts.map(({ p, i }) => (
            <circle key={`d${i}`} cx={xOf(i)} cy={yOf(p.secondary ?? 0)} r={3.5} fill="var(--vc-surface)" stroke="var(--vc-action)" strokeWidth={2} style={{ cursor: "pointer" }} onClick={() => { setTip(i); onSelect(p.metric); }} />
          ))
        : null}
      {pts.map((p, i) => (
        <g key={`p${i}`} style={{ cursor: "pointer" }} onClick={() => { setTip(i); onSelect(p.metric); }}>
          <circle cx={xOf(i)} cy={yOf(p.primary)} r={14} fill="transparent" />
          <circle cx={xOf(i)} cy={yOf(p.primary)} r={4} fill="var(--vc-surface)" stroke={navy} strokeWidth={2.2} />
          {showLabels ? <text x={xOf(i)} y={yOf(p.primary) - 9} textAnchor="middle" fontSize={10} fontWeight={800} fill={navy}>{fmtPrimary(p.metric)}</text> : null}
        </g>
      ))}
      {tip !== null && pts[tip] ? (
        <g pointerEvents="none">
          <rect x={Math.min(W - right - 96, Math.max(left, xOf(tip) - 48))} y={Math.max(0, yOf(pts[tip].primary) - 46)} width={96} height={24} rx={4} fill="#003E48" />
          <text x={Math.min(W - right - 48, Math.max(left + 48, xOf(tip)))} y={Math.max(0, yOf(pts[tip].primary) - 46) + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">
            {pts[tip].label} : {fmtPrimary(pts[tip].metric)}
          </text>
        </g>
      ) : null}
    </svg>
  );
}

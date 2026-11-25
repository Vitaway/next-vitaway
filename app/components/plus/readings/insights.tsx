"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage, type Translate } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { formatGlucose, formatGlucoseUnitBoth, useGlucoseUnit } from "@/lib/plus/units";
import {
  useInsight,
  type ActivityInsight,
  type BandSummary,
  type BpInsight,
  type GlucoseInsight,
  type InsightType,
  type MedsInsight,
  type Period,
  type Text,
  type WeightInsight,
} from "@/lib/plus/client/insights";
import { ActionButton, AppBar, Skeleton, cx } from "../ui/vita";

/*
 * Health Metrics demo "Insights": one plain sentence first, then the picture, then what it means and one next step.
 * Every number comes from GET /mobile/insights/:type. Categories show only when the clinical rule is approved
 * (CA-03/CA-04); targets come from the care team (member_targets). Colour always has words beside it.
 */

type Ctx = { t: Translate; L: (x: Text | null | undefined) => string };

const DAY = 86_400_000;
const C = { navy: "var(--vc-navy)", orange: "var(--vc-action)", ok: "var(--vc-teal)", bad: "var(--vc-danger)", faint: "rgba(var(--vc-navy-rgb),0.18)", grid: "rgba(var(--vc-navy-rgb),0.08)", band: "rgba(31,158,117,0.13)" };

function toneColor(tone: string): string {
  return tone === "ok" ? C.ok : tone === "warn" ? C.orange : tone === "low" ? "#2E6FD8" : C.bad;
}

function shortDay(iso: string, lang: string): string {
  const d = new Date(iso.length <= 10 ? `${iso}T12:00:00` : iso);
  return d.toLocaleDateString(lang === "rw" ? "fr-RW" : "en-GB", { day: "numeric", month: "short" });
}

/* ───────── small charts (plain SVG) ───────── */

/**
 * Charts are drawn at the real width of their card (1 unit = 1 px), so text, dots and bars keep their size on a
 * phone, a tablet and a wide desktop. A fixed viewBox stretched to the card made everything balloon.
 */
function useChartWidth(): [React.RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(340);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => setW(Math.max(260, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

type Pt = { x: number; y: number; c?: string; tip?: string };
type Series = { pts: Pt[]; color: string; line?: boolean; dots?: boolean; width?: number };

function LineChart({ x0, x1, y0, y1, series, band, refs = [], ticks = [], labels, aria, h = 180 }: {
  x0: number; x1: number; y0: number; y1: number; series: Series[]; band?: [number, number] | null; refs?: Array<{ y: number; label?: string; color?: string }>;
  ticks?: number[]; labels: [string, string]; aria: string; h?: number;
}) {
  const [box, w] = useChartWidth();
  const ml = 34, mr = 10, mt = 10, mb = 22;
  const X = (x: number) => ml + ((x - x0) / (x1 - x0 || 1)) * (w - ml - mr);
  const Y = (y: number) => mt + (1 - (Math.min(Math.max(y, y0), y1) - y0) / (y1 - y0 || 1)) * (h - mt - mb);
  const [tip, setTip] = useState<string | null>(null);
  return (
    <div className="vita-ins-chart" ref={box}>
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={aria}>
        {band ? <rect x={ml} y={Y(band[1])} width={w - ml - mr} height={Math.max(0, Y(band[0]) - Y(band[1]))} fill={C.band} /> : null}
        {ticks.filter((v) => v >= y0 && v <= y1).map((v) => (
          <g key={v}>
            <line x1={ml} x2={w - mr} y1={Y(v)} y2={Y(v)} stroke={C.grid} />
            <text x={ml - 6} y={Y(v) + 4} fontSize="10" textAnchor="end" fill="rgba(var(--vc-navy-rgb),0.55)">{v}</text>
          </g>
        ))}
        {refs.filter((r) => r.y >= y0 && r.y <= y1).map((r, i) => (
          <g key={i}>
            <line x1={ml} x2={w - mr} y1={Y(r.y)} y2={Y(r.y)} stroke={r.color ?? C.ok} strokeDasharray="4 4" strokeWidth={1.3} />
            {r.label ? <text x={w - mr} y={Y(r.y) - 4} fontSize="10" fontWeight="700" textAnchor="end" fill={r.color ?? C.ok}>{r.label}</text> : null}
          </g>
        ))}
        <text x={ml} y={h - 5} fontSize="10" fill="rgba(var(--vc-navy-rgb),0.55)">{labels[0]}</text>
        <text x={w - mr} y={h - 5} fontSize="10" textAnchor="end" fill="rgba(var(--vc-navy-rgb),0.55)">{labels[1]}</text>
        {series.map((s, i) =>
          s.line && s.pts.length > 1 ? (
            <polyline key={`l${i}`} fill="none" stroke={s.color} strokeWidth={s.width ?? 2} strokeLinejoin="round" strokeLinecap="round" points={s.pts.map((p) => `${X(p.x).toFixed(1)},${Y(p.y).toFixed(1)}`).join(" ")} />
          ) : null,
        )}
        {series.map((s, i) =>
          s.dots === false ? null : s.pts.map((p, j) => (
            <circle key={`d${i}-${j}`} cx={X(p.x)} cy={Y(p.y)} r={3.2} fill={p.c ?? s.color} onClick={() => setTip(p.tip ?? null)} style={{ cursor: p.tip ? "pointer" : undefined }} />
          )),
        )}
      </svg>
      <div className="vita-ins-tip">{tip ?? " "}</div>
    </div>
  );
}

function BarChart({ bars, goal, goalLabel, band, max, aria, every = 1 }: { bars: Array<{ v: number | null; label: string; c: string }>; goal?: number; goalLabel?: string; band?: [number, number]; max: number; aria: string; every?: number }) {
  const [box, w] = useChartWidth();
  const h = 150, ml = 8, mr = 8, mt = 10, mb = 20;
  const n = Math.max(1, bars.length), bw = (w - ml - mr) / n;
  // A bar never gets wider than 34 px, so two bars do not turn into two big blocks.
  const barW = Math.min(34, bw * 0.68);
  const Y = (v: number) => mt + (1 - Math.min(v, max) / (max || 1)) * (h - mt - mb);
  return (
    <div className="vita-ins-chart" ref={box}>
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={aria}>
        {band ? <rect x={ml} y={Y(band[1])} width={w - ml - mr} height={Y(band[0]) - Y(band[1])} fill={C.band} /> : null}
        {bars.map((b, i) => (
          <g key={i}>
            {b.v ? <rect x={ml + i * bw + (bw - barW) / 2} y={Y(b.v)} width={barW} height={Math.max(0, Y(0) - Y(b.v))} rx={2} fill={b.c} /> : <circle cx={ml + i * bw + bw / 2} cy={Y(0) - 2} r={1.6} fill={C.faint} />}
            {i % every === 0 || i === n - 1 ? <text x={ml + i * bw + bw / 2} y={h - 5} fontSize="9.5" textAnchor="middle" fill="rgba(var(--vc-navy-rgb),0.55)">{b.label}</text> : null}
          </g>
        ))}
        {goal ? (
          <g>
            <line x1={ml} x2={w - mr} y1={Y(goal)} y2={Y(goal)} stroke={C.orange} strokeDasharray="4 4" strokeWidth={1.4} />
            {goalLabel ? <text x={w - mr} y={Y(goal) - 4} fontSize="10" fontWeight="700" textAnchor="end" fill={C.orange}>{goalLabel}</text> : null}
          </g>
        ) : null}
      </svg>
    </div>
  );
}

function RowBar({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div className="vita-ins-row">
      <span className="lb">{label}</span>
      <span className="v">{value}</span>
      <span className="b"><i style={{ width: `${Math.max(2, Math.min(100, pct))}%`, background: color }} /></span>
    </div>
  );
}

function Stack({ parts }: { parts: Array<{ v: number; c: string; l: string }> }) {
  const total = parts.reduce((a, p) => a + p.v, 0) || 1;
  return (
    <>
      <div className="vita-ins-stack" role="img" aria-label={parts.map((p) => `${p.l} ${p.v}`).join(", ")}>
        {parts.filter((p) => p.v > 0).map((p) => <i key={p.l} style={{ width: `${(p.v / total) * 100}%`, background: p.c }} />)}
      </div>
      <div className="vita-ins-legend">
        {parts.map((p) => <span key={p.l}><i style={{ background: p.c }} />{p.l} {p.v}</span>)}
      </div>
    </>
  );
}

/* ───────── shared cards ───────── */

function Card({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cx("vita-ins-card", className)}>
      {title ? <h3>{title}</h3> : null}
      {children}
    </section>
  );
}

function Mean({ ctx, notes }: { ctx: Ctx; notes: Text[] }) {
  if (!notes.length) return null;
  return (
    <div className="vita-ins-mean">
      <b>{ctx.t("ins_what_means", undefined, "What this means")}</b>
      {notes.map((n, i) => <p key={i}>{ctx.L(n)}</p>)}
    </div>
  );
}

function Bands({ ctx, bands }: { ctx: Ctx; bands: BandSummary }) {
  // Same ranges the reading card uses (clinical-config), so the two never disagree; a draft is labelled as one.
  if (!bands.rule || !bands.counts.length) return null;
  return (
    <Card title={ctx.t("ins_bands", undefined, "Readings by category")}>
      <Stack parts={bands.counts.map((c) => ({ v: c.n, c: toneColor(c.tone), l: ctx.L(c.chip) }))} />
      {bands.rule === "pending_signoff" ? <p className="vita-ins-fine">{ctx.t("ins_bands_draft", undefined, "These ranges are a draft waiting for your clinic's sign-off. Your care team sees every reading.")}</p> : null}
    </Card>
  );
}

function NextStep({ ctx, logPath }: { ctx: Ctx; logPath?: string }) {
  const { push } = usePlusPaths();
  return (
    <Card className="next" title={ctx.t("ins_next_step", undefined, "Your one next step")}>
      <p>{ctx.t("ins_next_step_body", undefined, "Keep logging at the same time each day, and ask your care team about anything that worries you.")}</p>
      <div className="vita-ins-actions">
        {logPath ? <ActionButton small label={ctx.t("ins_log_more", undefined, "Log a reading")} onClick={() => push(logPath)} /> : null}
        <ActionButton small tone="white" label={ctx.t("ins_ask_nurse", undefined, "Ask a nurse")} onClick={() => push("/care")} />
      </div>
    </Card>
  );
}

/** Averages and categories from one or two readings mislead, so below this they are not shown. */
export const MIN_READINGS = 3;

function TooFew({ ctx, count, period, logPath, lines }: { ctx: Ctx; count: number; period: number; logPath: string; lines?: string[] }) {
  return (
    <>
      <Card className="few">
        <p className="vita-ins-head">{ctx.t("ins_too_few_title", { n: count, min: MIN_READINGS }, "Not enough readings yet: {n} of {min}")}</p>
        <p className="vita-ins-fine">{ctx.t("ins_too_few_body", { min: MIN_READINGS, period }, "Averages and patterns appear once you have {min} readings in these {period} days. Try a longer period, or log a few more.")}</p>
        {lines?.length ? (
          <ul className="vita-ins-few">
            {lines.map((l) => <li key={l}>{l}</li>)}
          </ul>
        ) : null}
      </Card>
      <NextStep ctx={ctx} logPath={logPath} />
    </>
  );
}

/* ───────── per metric ───────── */

function BpView({ d, ctx, lang }: { d: BpInsight; ctx: Ctx; lang: string }) {
  if (d.count < MIN_READINGS) return <TooFew ctx={ctx} count={d.count} period={d.period} logPath="/log/bp" lines={d.points.map((p) => `${shortDay(p.at, lang)} · ${p.s}/${p.d} mmHg`)} />;
  const end = Date.now(), start = end - d.period * DAY;
  const tip = (p: { at: string; s: number; d: number; band: { chip: Text } | null }) => `${shortDay(p.at, lang)} · ${p.s}/${p.d}${p.band ? ` · ${ctx.L(p.band.chip)}` : ""}`;
  const ys = d.points.flatMap((p) => [p.s, p.d]);
  const y1 = Math.max(170, ...ys.map((v) => v + 5)), y0 = Math.min(60, ...ys.map((v) => v - 5));
  return (
    <>
      <Card>
        <span className="vita-ins-k">{ctx.t("ins_average", undefined, "Average")}</span>
        <p className="vita-ins-big">{d.average ? `${d.average.s}/${d.average.d}` : "—"} <small>mmHg</small></p>
        {d.change ? (
          <span className={cx("vita-ins-delta", d.change.s <= 0 ? "up" : "dn")}>
            {d.change.s <= 0 ? "▼" : "▲"} {ctx.t("ins_from_before", { value: `${d.previous!.s}/${d.previous!.d}` }, "from {value} the period before")}
          </span>
        ) : null}
        <p className="vita-ins-fine">{ctx.t("ins_readings_days", { count: d.count, days: d.days_measured, period: d.period }, "{count} readings on {days} of {period} days")}</p>
      </Card>
      {d.target ? (
        <Card title={ctx.t("ins_target_title", { value: `${d.target.high}/${d.target.high2}` }, "Below your target of {value}")}>
          <p className="vita-ins-head">{d.in_target_pct ?? 0}%</p>
          <Stack parts={[{ v: Math.round(((d.in_target_pct ?? 0) / 100) * d.count), c: C.ok, l: ctx.t("ins_in_target", undefined, "Below target") }, { v: d.count - Math.round(((d.in_target_pct ?? 0) / 100) * d.count), c: C.orange, l: ctx.t("ins_above_target", undefined, "Above target") }]} />
          <p className="vita-ins-fine">{ctx.t("ins_target_from_team", undefined, "Set by your care team.")}</p>
        </Card>
      ) : (
        <p className="vita-ins-fine">{ctx.t("ins_no_target", undefined, "Your care team has not set a personal target yet.")}</p>
      )}
      <Bands ctx={ctx} bands={d.bands} />
      {d.points.length ? (
        <Card title={ctx.t("ins_trend", undefined, "Trend")}>
          <p className="vita-ins-fine">{ctx.t("ins_trend_bp", undefined, "Top number (orange), bottom number (navy). The thick line is your 7-reading average.")}</p>
          <LineChart
            x0={start} x1={end} y0={y0} y1={y1}
            ticks={[80, 100, 120, 140, 160]}
            refs={d.target ? [{ y: d.target.high, label: `${d.target.high}` }, { y: d.target.high2, label: `${d.target.high2}` }] : []}
            labels={[shortDay(new Date(start).toISOString(), lang), ctx.t("hm_today", undefined, "Today")]}
            aria={ctx.t("ins_trend", undefined, "Trend")}
            series={[
              { pts: d.points.map((p) => ({ x: +new Date(p.at), y: p.d, c: C.navy, tip: tip(p) })), color: C.navy },
              { pts: d.points.map((p) => ({ x: +new Date(p.at), y: p.s, c: p.band ? toneColor(p.band.tone) : C.orange, tip: tip(p) })), color: C.orange },
              { pts: d.moving_average.map((p) => ({ x: +new Date(p.at), y: p.s })), color: C.navy, line: true, dots: false, width: 3 },
            ]}
          />
        </Card>
      ) : null}
      {d.morning || d.evening || d.weekly.length > 1 ? (
        <Card title={ctx.t("ins_morning_evening", undefined, "Morning and evening")}>
          {d.morning ? <RowBar label={ctx.t("ins_morning", undefined, "Mornings")} value={`${d.morning.s}/${d.morning.d}`} pct={((d.morning.s - 90) / 90) * 100} color={C.orange} /> : null}
          {d.evening ? <RowBar label={ctx.t("ins_evening", undefined, "Evenings")} value={`${d.evening.s}/${d.evening.d}`} pct={((d.evening.s - 90) / 90) * 100} color={C.bad} /> : null}
          {d.weekly.length > 1 ? (
            <>
              <h4>{ctx.t("ins_week_by_week", undefined, "Week by week (top number)")}</h4>
              <BarChart max={180} goal={d.target?.high} goalLabel={d.target ? `${d.target.high}` : undefined} aria={ctx.t("ins_week_by_week", undefined, "Week by week")} every={d.weekly.length > 6 ? 2 : 1}
                bars={d.weekly.map((w) => ({ v: w.s, label: shortDay(w.week_end, lang), c: d.target && w.s >= d.target.high ? C.orange : C.ok }))} />
            </>
          ) : null}
          <Mean ctx={ctx} notes={d.notes} />
        </Card>
      ) : <Mean ctx={ctx} notes={d.notes} />}
      <NextStep ctx={ctx} logPath="/log/bp" />
    </>
  );
}

function GlucoseView({ d, ctx, lang }: { d: GlucoseInsight; ctx: Ctx; lang: string }) {
  const [unit] = useGlucoseUnit();
  const [view, setView] = useState<"fasting" | "after_meal">("fasting");
  const g = (mg: number | null) => (mg == null ? "—" : `${formatGlucose(mg, unit)} ${formatGlucoseUnitBoth(mg, unit)}`);
  if (d.count < MIN_READINGS) return <TooFew ctx={ctx} count={d.count} period={d.period} logPath="/log/glucose" lines={d.points.map((p) => `${shortDay(p.at, lang)} · ${g(p.mg)}`)} />;
  const end = Date.now(), start = end - d.period * DAY;
  const pts = d.points.filter((p) => (view === "fasting" ? p.context === "fasting" || p.context === "before_meal" : p.context === "after_meal"));
  const band: [number, number] | null = view === "fasting" ? (d.targets.fasting_mg ? [d.targets.fasting_mg.low, d.targets.fasting_mg.high] : null) : d.targets.after_meal_mg ? [70, d.targets.after_meal_mg.high] : null;
  const judged = d.points.filter((p) => p.in_target !== null);
  const inN = judged.filter((p) => p.in_target).length;
  const days = d.typical_day.filter((b) => b.median_mg !== null);
  const mealMax = Math.max(200, ...d.by_meal.map((m) => m.average_mg ?? 0));
  return (
    <>
      <Card>
        {d.in_target_pct !== null ? (
          <>
            <p className="vita-ins-head">{ctx.t("ins_glucose_in", { pct: d.in_target_pct }, "{pct}% of your readings were within your targets")}</p>
            {d.previous_in_target_pct !== null ? (
              <span className={cx("vita-ins-delta", d.in_target_pct >= d.previous_in_target_pct ? "up" : "dn")}>
                {d.in_target_pct >= d.previous_in_target_pct ? "▲" : "▼"} {ctx.t("ins_points_vs", { n: Math.abs(d.in_target_pct - d.previous_in_target_pct) }, "{n} points vs the period before")}
              </span>
            ) : null}
            <Stack parts={[{ v: inN, c: C.ok, l: ctx.t("ins_in_target_g", undefined, "In target") }, { v: judged.length - inN, c: C.orange, l: ctx.t("ins_out_target_g", undefined, "Outside target") }]} />
          </>
        ) : (
          <p className="vita-ins-fine">{ctx.t("ins_no_target_g", undefined, "Your care team has not set glucose targets yet, so readings are not compared with a target.")}</p>
        )}
        <div className="vita-ins-kpis">
          <div><b>{g(d.fasting_average_mg)}</b><span>{ctx.t("ins_fasting_avg", undefined, "Fasting average")}</span></div>
          <div><b>{g(d.after_meal_average_mg)}</b><span>{ctx.t("ins_after_avg", undefined, "After-meal average")}</span></div>
        </div>
        <p className="vita-ins-fine">{ctx.t("ins_meter_readings", { count: d.count }, "{count} meter readings. Percentages are of readings, not of time.")}</p>
      </Card>
      <Bands ctx={ctx} bands={d.bands} />
      {days.length >= 2 ? (
        <Card title={ctx.t("ins_typical_day", undefined, "Your typical day")}>
          <p className="vita-ins-fine">{ctx.t("ins_typical_day_note", undefined, "Your middle reading at each time of day.")}</p>
          <BarChart max={Math.max(220, ...days.map((b) => b.median_mg ?? 0))} band={[70, 180]} aria={ctx.t("ins_typical_day", undefined, "Your typical day")}
            bars={d.typical_day.map((b) => ({ v: b.median_mg, label: ctx.L(b.label), c: b.median_mg != null && b.median_mg > 180 ? C.orange : C.ok }))} />
        </Card>
      ) : null}
      {d.points.length ? (
        <Card title={ctx.t("ins_trend", undefined, "Trend")}>
          <div className="vita-ins-seg" role="group">
            <button type="button" aria-pressed={view === "fasting"} onClick={() => setView("fasting")}>{ctx.t("ins_fasting", undefined, "Fasting")}</button>
            <button type="button" aria-pressed={view === "after_meal"} onClick={() => setView("after_meal")}>{ctx.t("ins_after_meal", undefined, "After meals")}</button>
          </div>
          {pts.length ? (
            <LineChart x0={start} x1={end} y0={50} y1={Math.max(view === "fasting" ? 200 : 270, ...pts.map((p) => p.mg + 10))} ticks={[70, 130, 180, 250]} band={band}
              labels={[shortDay(new Date(start).toISOString(), lang), ctx.t("hm_today", undefined, "Today")]} aria={ctx.t("ins_trend", undefined, "Trend")}
              series={[{ pts: pts.map((p) => ({ x: +new Date(p.at), y: p.mg, c: p.in_target === false ? C.orange : C.ok, tip: `${shortDay(p.at, lang)} · ${g(p.mg)}${p.meal ? ` · ${p.meal}` : ""}` })), color: C.ok }]} />
          ) : <p className="vita-ins-fine">{ctx.t("ins_none", undefined, "No readings of this kind in this period yet.")}</p>}
          {band ? <p className="vita-ins-fine">{ctx.t("ins_band_note", undefined, "The green band is your target from your care team.")}</p> : null}
        </Card>
      ) : null}
      {d.by_meal.some((m) => m.n) ? (
        <Card title={ctx.t("ins_after_meals", undefined, "Two hours after each meal")}>
          {d.by_meal.filter((m) => m.n).map((m) => (
            <RowBar key={m.meal} label={ctx.t(`ins_meal_${m.meal}`, undefined, m.meal)} value={formatGlucose(m.average_mg ?? 0, unit)} pct={((m.average_mg ?? 0) / mealMax) * 100} color={d.targets.after_meal_mg && (m.average_mg ?? 0) > d.targets.after_meal_mg.high ? C.orange : C.ok} />
          ))}
        </Card>
      ) : null}
      {d.hba1c.length ? (
        <Card title={ctx.t("ins_hba1c", undefined, "HbA1c: your 3-month average")}>
          {d.hba1c.map((h) => <RowBar key={h.at} label={shortDay(h.at, lang)} value={`${h.value}%`} pct={(h.value / 12) * 100} color={C.navy} />)}
          <p className="vita-ins-fine">{ctx.t("ins_hba1c_note", undefined, "From the lab. Your doctor sets your own HbA1c target.")}</p>
        </Card>
      ) : null}
      <Mean ctx={ctx} notes={d.notes} />
      <NextStep ctx={ctx} logPath="/log/glucose" />
    </>
  );
}

function WeightView({ d, ctx, lang }: { d: WeightInsight; ctx: Ctx; lang: string }) {
  if (!d.count) return <NextStep ctx={ctx} logPath="/log/weight" />;
  const goal = d.goal;
  const span = goal != null && d.start != null && d.start !== goal ? d.start - goal : null;
  const pct = span ? Math.max(0, Math.min(100, ((d.start! - d.now!) / span) * 100)) : null;
  const fivePct = span && d.five_pct_mark != null ? Math.max(0, Math.min(100, ((d.start! - d.five_pct_mark) / span) * 100)) : null;
  const kgs = d.points.map((p) => p.kg).concat(goal != null ? [goal] : []);
  const first = +new Date(d.points[0].at), last = Math.max(Date.now(), +new Date(d.points[d.points.length - 1].at));
  return (
    <>
      <Card>
        <p className="vita-ins-head">{ctx.L(d.headline)}</p>
        {d.pct_lost != null && d.pct_lost > 0 ? (
          <span className="vita-ins-delta up">{ctx.t("ins_pct_lost", { pct: d.pct_lost }, "{pct}% of your starting weight")}{d.rate_per_week && d.rate_per_week > 0 ? ` · ${ctx.t("ins_rate", { value: d.rate_per_week }, "about {value} kg a week lately")}` : ""}</span>
        ) : null}
        {pct !== null ? (
          <div className="vita-ins-journey" role="img" aria-label={ctx.t("ins_journey_aria", { pct: Math.round(pct) }, "{pct}% of the way to your goal")}>
            <div className="fill" style={{ width: `${pct}%` }} />
            <span className="mk" style={{ left: `${pct}%` }} />
            {fivePct !== null ? <span className="five" style={{ left: `${fivePct}%` }} /> : null}
            <span className="lab l">{ctx.t("ins_start", undefined, "Start")} {d.start} kg</span>
            <span className="lab r">{ctx.t("ins_goal", undefined, "Goal")} {goal} kg</span>
          </div>
        ) : <p className="vita-ins-fine">{ctx.t("ins_no_goal", undefined, "Set a weight goal to see your journey.")}</p>}
        {fivePct !== null ? <p className="vita-ins-fine">{ctx.t("ins_five_pct", undefined, "The small mark is 5% of your starting weight: the point where blood sugar and blood pressure usually start to improve.")}</p> : null}
      </Card>
      <Card title={ctx.t("ins_weigh_ins", undefined, "Every weigh-in")}>
        <LineChart x0={first} x1={last} y0={Math.floor(Math.min(...kgs) - 1)} y1={Math.ceil(Math.max(...kgs) + 1)} ticks={[]} refs={goal != null ? [{ y: goal, label: `${ctx.t("ins_goal", undefined, "Goal")} ${goal}` }] : []}
          labels={[shortDay(d.points[0].at, lang), ctx.t("hm_today", undefined, "Today")]} aria={ctx.t("ins_weigh_ins", undefined, "Every weigh-in")}
          series={[{ pts: d.points.map((p) => ({ x: +new Date(p.at), y: p.kg, tip: `${shortDay(p.at, lang)} · ${p.kg} kg` })), color: C.ok }, { pts: d.moving_average.map((p) => ({ x: +new Date(p.at), y: p.kg })), color: C.navy, line: true, dots: false, width: 2.6 }]} />
        <Mean ctx={ctx} notes={d.notes} />
      </Card>
      {d.bmi != null || d.waist.length ? (
        <Card>
          {d.bmi != null ? (
            <div className="vita-ins-kpis">
              <div><b>{d.bmi}</b><span>{ctx.t("ins_bmi_now", undefined, "BMI now")}</span></div>
              {d.bmi_start != null ? <div><b>{d.bmi_start}</b><span>{ctx.t("ins_bmi_start", undefined, "BMI at the start")}</span></div> : null}
            </div>
          ) : null}
          {d.waist.length ? (
            <>
              <h4>{ctx.t("ins_waist", undefined, "Waist")}</h4>
              {d.waist.slice(-6).map((w) => <RowBar key={w.at} label={shortDay(w.at, lang)} value={`${w.cm} cm`} pct={((w.cm - 60) / 70) * 100} color={C.navy} />)}
            </>
          ) : null}
        </Card>
      ) : null}
      <NextStep ctx={ctx} logPath="/log/weight" />
    </>
  );
}

function ActivityView({ d, ctx, lang }: { d: ActivityInsight; ctx: Ctx; lang: string }) {
  const every = d.period > 30 ? 14 : d.period > 7 ? 5 : 1;
  const lab = (iso: string) => (d.period === 7 ? new Date(`${iso}T12:00:00`).toLocaleDateString(lang === "rw" ? "fr-RW" : "en-GB", { weekday: "narrow" }) : shortDay(iso, lang));
  return (
    <>
      <Card title={ctx.t("ins_steps", undefined, "Steps")}>
        <p className="vita-ins-fine">{d.steps.average != null ? ctx.t("ins_steps_avg", { value: d.steps.average.toLocaleString("en-US"), goal: d.goals.steps.toLocaleString("en-US") }, "Average {value} steps a day · goal {goal}") : ctx.t("ins_none", undefined, "No readings of this kind in this period yet.")}</p>
        <BarChart max={Math.max(d.goals.steps * 1.4, ...d.days.map((x) => x.steps ?? 0))} goal={d.goals.steps} goalLabel={d.goals.steps.toLocaleString("en-US")} every={every} aria={ctx.t("ins_steps", undefined, "Steps")}
          bars={d.days.map((x) => ({ v: x.steps, label: lab(x.date), c: (x.steps ?? 0) >= d.goals.steps ? C.ok : "#9FB3C8" }))} />
      </Card>
      <Card title={ctx.t("ins_sleep", undefined, "Sleep")}>
        <p className="vita-ins-fine">{d.sleep.average != null ? ctx.t("ins_sleep_avg", { value: d.sleep.average, n: d.sleep.nights_at_goal, goal: d.goals.sleepLow }, "Average {value} h a night · {n} nights of {goal} h or more") : ctx.t("ins_none", undefined, "No readings of this kind in this period yet.")}</p>
        <BarChart max={10} band={[d.goals.sleepLow, 9]} every={every} aria={ctx.t("ins_sleep", undefined, "Sleep")}
          bars={d.days.map((x) => ({ v: x.sleep_hours, label: lab(x.date), c: (x.sleep_hours ?? 0) >= d.goals.sleepLow ? "#7A5AF8" : "#C9BEF5" }))} />
      </Card>
      <Card title={ctx.t("ins_water_mood", undefined, "Water and mood")}>
        <RowBar label={ctx.t("ins_water", undefined, "Water, glasses a day")} value={d.water.average != null ? String(d.water.average) : "—"} pct={((d.water.average ?? 0) / Math.max(d.goals.water, 1)) * 100} color="#2E6FD8" />
        <RowBar label={ctx.t("ins_mood", undefined, "Mood, out of 5")} value={d.mood.average != null ? String(d.mood.average) : "—"} pct={((d.mood.average ?? 0) / 5) * 100} color={C.orange} />
      </Card>
      <NextStep ctx={ctx} logPath="/log" />
    </>
  );
}

function MedsView({ d, ctx, lang }: { d: MedsInsight; ctx: Ctx; lang: string }) {
  const cell = (s: string) => (s === "taken" ? "t" : s === "missed" || s === "skipped" ? "m" : "n");
  return (
    <>
      {d.due ? (
        <Card>
          <p className="vita-ins-fine">{ctx.t("ins_doses", { taken: d.counts.taken, due: d.due, late: d.counts.late }, "{taken} of {due} doses · {late} taken more than 30 minutes late")}</p>
          <Stack parts={[{ v: d.counts.taken, c: C.ok, l: ctx.t("ins_taken", undefined, "Taken") }, { v: d.counts.missed + d.counts.skipped, c: C.orange, l: ctx.t("ins_missed", undefined, "Missed or skipped") }, { v: d.counts.not_recorded, c: C.faint, l: ctx.t("ins_not_recorded", undefined, "Not recorded") }]} />
        </Card>
      ) : null}
      {d.by_medicine.length ? (
        <Card title={ctx.t("ins_meds_by", undefined, "By medicine")}>
          {d.by_medicine.map((m) => <RowBar key={m.id} label={`${m.name}${m.dose ? ` ${m.dose}` : ""}`} value={m.taken_pct != null ? `${m.taken_pct}%` : "—"} pct={m.taken_pct ?? 0} color={(m.taken_pct ?? 0) >= 80 ? C.ok : C.orange} />)}
          {d.morning_pct != null || d.evening_pct != null ? <h4>{ctx.t("ins_meds_time", undefined, "By time of day")}</h4> : null}
          {d.morning_pct != null ? <RowBar label={ctx.t("ins_morning_doses", undefined, "Morning doses")} value={`${d.morning_pct}%`} pct={d.morning_pct} color={d.morning_pct >= 80 ? C.ok : C.orange} /> : null}
          {d.evening_pct != null ? <RowBar label={ctx.t("ins_evening_doses", undefined, "Evening doses")} value={`${d.evening_pct}%`} pct={d.evening_pct} color={d.evening_pct >= 80 ? C.ok : C.orange} /> : null}
          <p className="vita-ins-fine">{ctx.t("ins_meds_goal", undefined, "Taking 80% or more of your doses is the usual goal.")}</p>
        </Card>
      ) : null}
      {d.grid.length ? (
        <Card title={ctx.t("ins_pillbox", undefined, "Your pillbox")}>
          <p className="vita-ins-fine">{ctx.t("ins_pillbox_note", undefined, "Green = taken, orange = missed or skipped, outline = not recorded.")}</p>
          {d.grid.map((r) => {
            const days = r.days.slice(-30);
            return (
              <div key={`${r.medication_id}-${r.slot}`} className="vita-ins-pill">
                <b>{r.name} · {r.slot}</b>
                <div className="vita-ins-heat" style={{ gridTemplateColumns: `repeat(${Math.max(days.length, 7)}, minmax(0, 16px))` }}>
                  {days.map((x) => <i key={x.date} className={cell(x.status)} title={`${shortDay(x.date, lang)}: ${x.status}`} />)}
                </div>
              </div>
            );
          })}
        </Card>
      ) : null}
      <Mean ctx={ctx} notes={d.notes} />
      <NextStep ctx={ctx} logPath="/medications" />
    </>
  );
}

/* ───────── panel + screen ───────── */

export function InsightsPanel({ type, embedded = false }: { type: InsightType; embedded?: boolean }) {
  const { t, language } = useLanguage();
  const [period, setPeriod] = useState<Period>(30);
  const { data, loading, error, reload } = useInsight(type, period);
  const L = (x: Text | null | undefined) => (x ? (language === "rw" && x.rw ? x.rw : x.en) : "");
  const ctx: Ctx = { t, L };
  const showPeriod = type !== "weight";
  return (
    <div className={cx("vita-ins", embedded && "embedded")}>
      {embedded ? <h2 className="vita-ins-title">{t("ins_title", undefined, "What your numbers say")}</h2> : null}
      {showPeriod ? (
        <div className="vita-ins-seg" role="group" aria-label={t("ins_period", undefined, "Period")}>
          {([7, 30, 90] as Period[]).map((p) => (
            <button key={p} type="button" aria-pressed={period === p} onClick={() => setPeriod(p)}>{t("ins_days", { n: p }, "{n} days")}</button>
          ))}
        </div>
      ) : null}
      {loading && !data ? (
        <><Skeleton height={110} /><Skeleton height={180} style={{ marginTop: 12 }} /></>
      ) : error && !data ? (
        <div className="vita-ins-card">
          <p className="vita-ins-fine">{t("ins_error", undefined, "We could not load your insights. Check your connection.")}</p>
          <ActionButton small tone="white" label={t("retry", undefined, "Try again")} onClick={() => void reload()} />
        </div>
      ) : data ? (
        <>
          {data.type !== "weight" ? <p className="vita-ins-lead">{L(data.headline)}</p> : null}
          {data.type === "bp" ? <BpView d={data} ctx={ctx} lang={language} /> : null}
          {data.type === "glucose" ? <GlucoseView d={data} ctx={ctx} lang={language} /> : null}
          {data.type === "weight" ? <WeightView d={data} ctx={ctx} lang={language} /> : null}
          {data.type === "activity" ? <ActivityView d={data} ctx={ctx} lang={language} /> : null}
          {data.type === "meds" ? <MedsView d={data} ctx={ctx} lang={language} /> : null}
        </>
      ) : null}
    </div>
  );
}

/** /metrics/activity and /metrics/meds: insight-only screens (no single "latest reading" hero). */
export default function InsightsScreen({ type }: { type: "activity" | "meds" }) {
  const { t } = useLanguage();
  return (
    <div className="vita-page">
      <AppBar title={type === "activity" ? t("ins_activity_title", undefined, "Activity and sleep") : t("ins_meds_title", undefined, "Medicines")} />
      <div className="vita-scroll" style={{ padding: "12px 16px 24px" }}>
        <InsightsPanel type={type} />
      </div>
    </div>
  );
}

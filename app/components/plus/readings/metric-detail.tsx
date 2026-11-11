"use client";

import { useMemo, useState } from "react";
import { Activity, Add, Alarm, Drop, Flag, Heart, Weight } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { useMe, useMetrics } from "@/lib/plus/client/data";
import { saveWeightGoal, useGoals } from "@/lib/plus/client/goals";
import { bpCategoryOf, bpMetricsStatus, glucoseCategoryOf, glucoseMetricsStatus, latestByType, parseStamp, type HealthMetric } from "@/lib/plus/health";
import { fmtLongDay, sameDay } from "@/lib/plus/format";
import { currentMonth, currentWeek, currentYear, hasMetricReading } from "@/lib/plus/metric-series";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { ActionButton, AppBar, CenterSpinner, EmptyState, Modal, Tabs, useFeedback } from "../ui/vita";
import MetricChart from "./metric-chart";

type Range = "week" | "month" | "year";

function weekAverage(type: string, all: HealthMetric[]): number | null {
  const week = currentWeek(all, type).filter((m): m is HealthMetric => m !== null && hasMetricReading(m));
  if (!week.length) return null;
  const vals = (type === "bp" ? week.map((m) => m.systolic ?? 0) : week.map((m) => Number.parseFloat(m.latest_value) || 0)).filter((v) => v > 0);
  if (!vals.length) return null;
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return type === "bp" ? Math.round(avg) : Math.round(avg * 10) / 10;
}

function dateLabel(raw: string, t: (k: string) => string): string {
  const at = parseStamp(raw);
  if (!at) return raw;
  const now = new Date();
  if (sameDay(at, now)) return t("hm_today");
  if (sameDay(at, new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1))) return t("hm_tomorrow");
  return fmtLongDay(at);
}

function statusFor(metric: HealthMetric, bmi: number): { label: string; chip: string; color: string } {
  const faint = "rgba(var(--vc-navy-rgb),0.45)";
  if (metric.type === "bp" || metric.type === "glucose") {
    const status = metric.type === "bp" ? bpMetricsStatus(bpCategoryOf(metric)) : glucoseMetricsStatus(glucoseCategoryOf(metric));
    if (!status) return { label: "No reading yet", chip: "—", color: faint };
    const color = status.tone === "ok" ? "var(--vc-navy)" : status.tone === "warn" ? "var(--vc-action)" : "var(--vc-danger)";
    return { label: status.label, chip: status.chip, color };
  }
  if (bmi <= 0) return { label: "Add your height for BMI", chip: "—", color: faint };
  if (bmi < 18.5) return { label: "Underweight range", chip: "Low", color: "var(--vc-action)" };
  if (bmi <= 24.9) return { label: "Healthy BMI range", chip: "Normal", color: "var(--vc-navy)" };
  if (bmi <= 29.9) return { label: "Overweight range", chip: "High", color: "var(--vc-action)" };
  return { label: "Talk with your care team", chip: "High", color: "var(--vc-danger)" };
}

const big = { fontSize: 40, lineHeight: 1, fontWeight: 800 } as const;
const small = (alpha: number, size = 12) => ({ fontSize: size, fontWeight: 700, color: `rgba(var(--vc-navy-rgb),${alpha})` });

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
      <span style={small(0.55)}>{label}</span>
    </span>
  );
}

function BpRangeBar({ systolic }: { systolic: number }) {
  const t = Math.min(1, Math.max(0, (systolic - 90) / 90));
  return (
    <div>
      <div style={{ position: "relative", height: 14 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 3, height: 8, borderRadius: 999, background: "linear-gradient(90deg, var(--vc-tile-mint), var(--vc-tile-sage), var(--vc-tile-peach), var(--vc-danger-soft))" }} />
        {systolic > 0 ? <span style={{ position: "absolute", top: 0, left: `clamp(0px, calc(${t * 100}% - 7px), calc(100% - 14px))`, width: 14, height: 14, borderRadius: "50%", background: "#fff", border: "2px solid var(--vc-navy)", boxShadow: "0 2px 6px rgba(var(--vc-navy-rgb),0.18)" }} /> : null}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.4)" }}>
        <span>90</span>
        <span>Normal to high</span>
        <span>180</span>
      </div>
    </div>
  );
}

function SummaryHero({ metric, bmi, avg, date }: { metric: HealthMetric; bmi: number; avg: number | null; date: string }) {
  const status = statusFor(metric, bmi);
  const tint = metric.type === "glucose" ? "var(--vc-tile-peach)" : metric.type === "bp" ? "var(--vc-tile-lilac)" : metric.type === "weight" ? "var(--vc-tile-mint)" : "var(--vc-wash)";
  const icon = metric.type === "glucose" ? <Drop size={20} variant="Bold" color="currentColor" /> : metric.type === "bp" ? <Activity size={20} color="currentColor" /> : metric.type === "weight" ? <Weight size={20} color="currentColor" /> : <Heart size={20} variant="Bold" color="currentColor" />;
  return (
    <div style={{ padding: "16px 18px", borderRadius: 10, background: "var(--vc-surface)", border: "1px solid rgba(var(--vc-navy-rgb),0.06)", boxShadow: "var(--vc-card-shadow)" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ width: 40, height: 40, borderRadius: 8, background: tint, color: "var(--vc-navy)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{icon}</span>
        <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--vc-navy)" }}>{date}</div>
          <div style={{ marginTop: 2, fontSize: 12, fontWeight: 600, color: status.color }}>{status.label}</div>
        </div>
        <span style={{ padding: "6px 10px", borderRadius: 999, background: `color-mix(in srgb, ${status.color} 12%, transparent)`, fontSize: 11, fontWeight: 800, color: status.color }}>{status.chip}</span>
      </div>
      <div style={{ marginTop: 16 }}>
        {metric.type === "bp" ? (
          <>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <span style={{ ...big, color: "var(--vc-navy)" }}>{metric.systolic ?? "—"}</span>
              <span style={{ padding: "0 4px 6px", fontSize: 28, fontWeight: 700, color: "rgba(var(--vc-navy-rgb),0.35)" }}>/</span>
              <span style={{ ...big, color: "var(--vc-action)" }}>{metric.diastolic ?? "—"}</span>
              <span style={{ marginLeft: 8, paddingBottom: 6, ...small(0.45, 13) }}>mmHg</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10 }}>
              <Legend color="var(--vc-navy)" label="SYS" />
              <Legend color="var(--vc-action)" label="DIA" />
              <span style={{ flex: 1 }} />
              {avg !== null ? <span style={small(0.55)}>Week avg SYS {avg.toFixed(0)}</span> : null}
            </div>
            <div style={{ marginTop: 14 }}>
              <BpRangeBar systolic={metric.systolic ?? 0} />
            </div>
          </>
        ) : metric.type === "weight" ? (
          <>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <span style={{ ...big, color: "var(--vc-navy)" }}>{metric.latest_value}</span>
              <span style={{ marginLeft: 8, paddingBottom: 6, ...small(0.45, 14) }}>kg</span>
              <span style={{ flex: 1 }} />
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.45)" }}>BMI</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--vc-navy)" }}>{bmi.toFixed(1)}</div>
              </div>
            </div>
            {avg !== null ? <div style={{ marginTop: 10, ...small(0.55) }}>Week avg {avg.toFixed(1)} kg</div> : null}
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <span style={{ ...big, color: "var(--vc-navy)" }}>{metric.latest_value}</span>
              <span style={{ marginLeft: 8, paddingBottom: 6, ...small(0.45, 14) }}>{metric.unit || "mg/dL"}</span>
            </div>
            {avg !== null ? <div style={{ marginTop: 10, ...small(0.55) }}>Week avg {avg.toFixed(1)}</div> : null}
          </>
        )}
      </div>
    </div>
  );
}

function SetGoalModal({ open, current, onClose }: { open: boolean; current: number; onClose: () => void }) {
  const t = useT();
  const { toast } = useFeedback();
  const { user } = useMe();
  const { weightGoal } = useGoals();
  const [text, setText] = useState(current.toFixed(1));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const target = Number.parseFloat(text.trim().replace(",", ".")) || 0;
  const save = async () => {
    const parsed = Number.parseFloat(text.trim().replace(",", "."));
    if (!Number.isFinite(parsed) || parsed <= 0) return setError("Enter a target greater than 0");
    setLoading(true);
    setError(null);
    try {
      await saveWeightGoal(user?.id ?? 0, weightGoal, parsed);
      toast(t("hm_goal_updated"));
      setLoading(false);
      onClose();
    } catch {
      setLoading(false);
      setError("Unable to save goal. Try again.");
    }
  };
  return (
    <Modal
      open={open}
      title={t("hm_set_goal")}
      onClose={loading ? undefined : onClose}
      actions={
        <>
          <ActionButton small tone="white" label={t("hm_cancel")} disabled={loading} onClick={onClose} />
          <ActionButton small label={t("hm_save")} loading={loading} disabled={target <= 0} onClick={save} />
        </>
      }
    >
      <div style={{ textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 18, color: "var(--vc-navy)" }}>
          {t("hm_current_value")}: {current.toFixed(1)}
        </p>
        <label style={{ display: "block", marginTop: 16, textAlign: "left" }}>
          <span className="vita-label">{t("hm_target_value")}</span>
          <input className="vita-input" inputMode="decimal" value={text} onChange={(e) => { setText(e.target.value); setError(null); }} />
        </label>
        {error ? <p style={{ margin: "10px 0 0", color: "#D32F2F", fontWeight: 600, fontSize: 13 }}>{error}</p> : null}
      </div>
    </Modal>
  );
}

export default function MetricDetailScreen({ type }: { type: string }) {
  const t = useT();
  const { push } = usePlusPaths();
  const { metrics, loading } = useMetrics();
  const { user } = useMe();
  const { goals, weightGoal } = useGoals();
  const [range, setRange] = useState<Range>("week");
  const [picked, setPicked] = useState<HealthMetric | null>(null);
  const [goalOpen, setGoalOpen] = useState(false);
  const base = latestByType(metrics)[type] ?? null;
  const selected = picked ?? base;
  const series = useMemo(() => {
    if (range === "week") return currentWeek(metrics, type).filter((m): m is HealthMetric => m !== null && hasMetricReading(m));
    if (range === "month") return currentMonth(metrics, type);
    return currentYear(metrics, type);
  }, [metrics, type, range]);

  const titleKey = `hm_${(base?.name ?? (type === "bp" ? "blood pressure" : type)).toLowerCase().replace(/ /g, "_")}`;
  const title = t(titleKey, undefined, base?.name ?? type);
  if (loading) return <div className="vita-page"><AppBar title={title} /><CenterSpinner /></div>;
  if (!selected) {
    return (
      <div className="vita-page">
        <AppBar title={title} />
        <EmptyState title={t("no_health_metrics")} subtitle={t("no_health_metrics_body")} />
      </div>
    );
  }
  const weight = Number.parseFloat(selected.latest_value);
  const height = Number(user?.profile?.height ?? 0) || 0;
  const bmi = Number.isFinite(weight) && height > 0 ? (weight / (height * height)) * 10000 : 0;
  const hasGoal = goals.some((g) => g.type === "weight");
  const emptyCopy = range === "week" ? "No readings this week yet" : range === "year" ? "No readings this year yet" : t(type === "glucose" ? "hm_no_glucose_data_for_current_month" : type === "bp" ? "hm_no_blood_pressure_data_for_current_month" : "hm_no_weight_data_for_current_month");
  const addPath = type === "glucose" ? "/log/glucose" : type === "bp" ? "/log/bp" : type === "weight" ? "/log/weight" : null;
  const toGo = weightGoal?.value != null ? weightGoal.value - (Number.parseFloat(selected.latest_value) || 0) : 0;

  return (
    <div className="vita-page">
      <AppBar title={title} />
      <div className="vita-scroll" style={{ padding: 0 }}>
        <div style={{ padding: "12px 16px 0" }}>
          <Tabs<Range> tabs={[{ value: "week", label: t("hm_week") }, { value: "month", label: t("hm_month") }, { value: "year", label: t("hm_year") }]} value={range} onChange={setRange} />
        </div>
        <div style={{ padding: "14px 16px 0" }}>
          <SummaryHero metric={selected} bmi={bmi} avg={weekAverage(type, metrics)} date={dateLabel(selected.last_updated, t)} />
        </div>
        <div style={{ height: 280, padding: "8px 8px 0 4px" }}>
          {series.length === 0 ? (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", color: "rgba(var(--vc-navy-rgb),0.55)", fontWeight: 600 }}>{emptyCopy}</div>
          ) : (
            <MetricChart metrics={series} onSelect={setPicked} />
          )}
        </div>
        <div style={{ height: 12 }} />
        {type === "weight" && !hasGoal ? (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
            <ActionButton tone="white" label={t("hm_set_goal")} icon={<Flag size={16} color="currentColor" />} onClick={() => setGoalOpen(true)} />
          </div>
        ) : null}
        {type === "weight" && hasGoal ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button type="button" onClick={() => setGoalOpen(true)} style={{ width: 280, padding: 20, borderRadius: 10, background: "var(--vc-surface)", boxShadow: "0 3px 7px 5px rgba(0,62,72,0.5)", color: "var(--vc-navy)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Flag size={20} color="currentColor" />
                <span style={{ fontSize: 15 }}>{t("hm_my_goal")}</span>
              </div>
              <div style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ padding: 10, borderRadius: 8, border: "1px solid rgba(var(--vc-navy-rgb),0.15)" }}>
                  <div>{t("hm_current")}</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{selected.latest_value}</div>
                </div>
                <div style={{ width: 90 }}>
                  <div style={{ fontSize: 12 }}>{Math.round(toGo * 10) / 10} Kg to go</div>
                  <div style={{ height: 1, background: "rgba(var(--vc-navy-rgb),0.65)" }} />
                </div>
                <div style={{ padding: 10, borderRadius: 6, border: "1px solid rgba(var(--vc-navy-rgb),0.15)" }}>
                  <div>{t("hm_target")}</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{String(weightGoal?.value ?? "")}</div>
                </div>
              </div>
            </button>
          </div>
        ) : null}
        <div style={{ display: "flex", gap: 10, padding: "20px 16px 20px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <ActionButton full tone="teal" label={t("hm_add_measure")} icon={<Add size={18} color="currentColor" />} onClick={() => { if (addPath) push(addPath); }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <ActionButton full tone="white" label={t("hm_add_reminder")} icon={<Alarm size={16} color="currentColor" />} onClick={() => push("/reminders/add")} />
          </div>
        </div>
      </div>
      {goalOpen ? <SetGoalModal open current={Number.parseFloat(selected.latest_value) || 0} onClose={() => setGoalOpen(false)} /> : null}
    </div>
  );
}

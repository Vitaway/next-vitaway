"use client";

import { Activity, ArrowRight3, Drop, Health, Heart, Timer1, Weight } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { useMetrics } from "@/lib/plus/client/data";
import { formatGlucose, formatGlucoseUnitBoth, useGlucoseUnit } from "@/lib/plus/units";
import { parseStamp, type HealthMetric } from "@/lib/plus/health";
import { fmtLongDay } from "@/lib/plus/format";
import { currentWeek, homeMetrics, primaryValue } from "@/lib/plus/metric-series";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { AppBar, CenterSpinner, CircleButton, EmptyState, HubLinks } from "../ui/vita";

const LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function WeekStrip({ days }: { days: number[] }) {
  const peak = days.reduce((m, v) => (v > m ? v : m), 0);
  const track = 48;
  const today = (new Date().getDay() + 6) % 7;
  return (
    <div style={{ display: "flex" }}>
      {days.map((v, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ height: track, display: "flex", alignItems: "flex-end" }}>
            <span style={{ width: 8, borderRadius: 8, height: v <= 0 ? 8 : 8 + (track - 8) * (v / (peak || 1)), background: v <= 0 ? "rgba(var(--vc-navy-rgb),0.1)" : i === today ? "var(--vc-action)" : "var(--vc-teal-ink)" }} />
          </div>
          <span style={{ marginTop: 6, fontSize: 13, fontWeight: 700, color: "rgba(var(--vc-navy-rgb),0.4)" }}>{LABELS[i]}</span>
        </div>
      ))}
    </div>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.4, color: "rgba(var(--vc-navy-rgb),0.4)" }}>{label}</div>
      <div style={{ fontSize: 32, lineHeight: 1.05, fontWeight: 800, color: "var(--vc-navy)" }}>{value}</div>
    </div>
  );
}

function NumberCard({ metric, history, onOpen }: { metric: HealthMetric; history: HealthMetric[]; onOpen: () => void }) {
  const [unit] = useGlucoseUnit();
  const type = metric.type.toLowerCase();
  const week = currentWeek(history, type).map((m) => (m ? primaryValue(m) : 0));
  const at = parseStamp(metric.last_updated);
  const Icon = type === "glucose" ? Drop : type === "bp" ? Heart : type === "weight" ? Weight : Activity;
  let values: React.ReactNode;
  if (type === "bp") {
    values = (
      <div style={{ display: "flex", alignItems: "flex-end", gap: 22 }}>
        <Figure label="SYS" value={String(metric.systolic ?? "—")} />
        <Figure label="DIA" value={String(metric.diastolic ?? "—")} />
        <span style={{ flex: 1 }} />
        <span style={{ paddingBottom: 6, fontSize: 13, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.4)" }}>{metric.unit}</span>
      </div>
    );
  } else if (type === "glucose") {
    const mg = Number.parseFloat(metric.latest_value) || 0;
    values = <Figure label={formatGlucoseUnitBoth(mg, unit)} value={formatGlucose(mg, unit)} />;
  } else {
    values = <Figure label="kg" value={(Number.parseFloat(metric.latest_value) || 0).toFixed(1)} />;
  }
  return (
    <button type="button" onClick={onOpen} className="vita-tap" style={{ width: "100%", textAlign: "left", padding: "16px 16px 14px", borderRadius: 10, background: "var(--vc-surface)", border: "1px solid rgba(var(--vc-navy-rgb),0.08)" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--vc-tile-mint)", color: "var(--vc-navy)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          <Icon size={20} color="currentColor" />
        </span>
        <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "var(--vc-navy)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{metric.name}</div>
          <div style={{ marginTop: 2, fontSize: 13, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.45)" }}>{at ? fmtLongDay(at) : metric.last_updated}</div>
        </div>
        <span style={{ color: "rgba(var(--vc-navy-rgb),0.3)" }}>
          <ArrowRight3 size={22} color="currentColor" />
        </span>
      </div>
      <div style={{ marginTop: 16 }}>{values}</div>
      <div style={{ marginTop: 16 }}>
        <WeekStrip days={week} />
      </div>
    </button>
  );
}

export default function AllMetricsScreen() {
  const t = useT();
  const { push } = usePlusPaths();
  const { metrics, loading } = useMetrics();
  const latest = homeMetrics(metrics);
  return (
    <div className="vita-page w-wide">
      <AppBar
        title={t("nav_my_health")}
        back={false}
        profile
        actions={
          <CircleButton label={t("health_metrics_title")}>
            <Heart size={17} color="currentColor" />
          </CircleButton>
        }
      />
      <div className="vita-scroll" style={{ padding: 0 }}>
        <div style={{ padding: "12px 16px 0" }}>
          <HubLinks
            links={[
              { label: t("pillbox"), icon: <Health size={20} color="currentColor" />, onClick: () => push("/medications") },
              { label: t("health_score"), icon: <Heart size={20} color="currentColor" />, onClick: () => push("/health-score") },
              { label: t("reminders_title"), icon: <Timer1 size={20} color="currentColor" />, onClick: () => push("/reminders") },
            ]}
          />
        </div>
        {loading ? (
          <CenterSpinner />
        ) : latest.length === 0 ? (
          <EmptyState title={t("no_health_metrics")} subtitle={t("no_health_metrics_body")} />
        ) : (
          <div className="vita-flex-list" style={{ padding: "8px 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
            {latest.map((m) => (
              <NumberCard key={m.type} metric={m} history={metrics} onOpen={() => push(`/metrics/${encodeURIComponent(m.type)}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

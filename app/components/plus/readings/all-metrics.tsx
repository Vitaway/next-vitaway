"use client";

import { Add, ArrowRight3, Heart } from "@/lib/plus/icons";
import { useLanguage, useT } from "@/lib/plus/i18n";
import { useMetrics } from "@/lib/plus/client/data";
import { formatGlucose, formatGlucoseUnitBoth, useGlucoseUnit } from "@/lib/plus/units";
import { glucoseContextFromFullness, parseStamp, type HealthMetric } from "@/lib/plus/health";
import { bpStatus, glucoseStatus, type ReadingStatus } from "@/lib/plus/clinical-rules";
import { useClinicalConfig } from "@/lib/plus/client/clinical-config";
import { fmtLongDay } from "@/lib/plus/format";
import { currentWeek, homeMetrics, primaryValue } from "@/lib/plus/metric-series";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { AppBar, CenterSpinner, CircleButton, EmptyState, HubLinks, cx } from "../ui/vita";
import { ILLU_TINT, Illu, type IlluName } from "../ui/vita-icons";

const LABELS = ["M", "T", "W", "T", "F", "S", "S"];

/** This week's readings as rounded bars (Mon–Sun); today is orange, days without a reading are a soft dot. */
export function WeekStrip({ days }: { days: number[] }) {
  const peak = days.reduce((m, v) => (v > m ? v : m), 0);
  const today = (new Date().getDay() + 6) % 7;
  return (
    <div className="vita-mc-week" aria-hidden>
      {days.map((v, i) => (
        <div key={i} className={cx("d", i === today && "today", v > 0 && "has")}>
          <span className="bar-track">
            <span className="bar" style={{ height: v > 0 ? `${Math.max(18, Math.round((v / (peak || 1)) * 100))}%` : undefined }} />
          </span>
          <span className="lb">{LABELS[i]}</span>
        </div>
      ))}
    </div>
  );
}

type Meta = { illu: IlluName; titleKey: string; logPath: string };
const META: Record<string, Meta> = {
  weight: { illu: "weight", titleKey: "hm_weight", logPath: "/log/weight" },
  glucose: { illu: "glucose", titleKey: "hm_glucose", logPath: "/log/glucose" },
  bp: { illu: "bp", titleKey: "hm_blood_pressure", logPath: "/log/bp" },
};

function MetricCard({ metric, history, onOpen, onLog }: { metric: HealthMetric; history: HealthMetric[]; onOpen: () => void; onLog: (path: string) => void }) {
  const t = useT();
  const { language } = useLanguage();
  const clinical = useClinicalConfig();
  const [unit] = useGlucoseUnit();
  const type = metric.type.toLowerCase();
  const meta = META[type];
  const week = currentWeek(history, type).map((m) => (m ? primaryValue(m) : 0));
  const weekCount = week.filter((v) => v > 0).length;
  const at = parseStamp(metric.last_updated);

  // Value, unit and (where a clinical rule is approved) the status chip; otherwise "care team will review".
  let value: string;
  let unitText: string;
  let status: ReadingStatus | null = null;
  let neutral: string | null = null;
  if (type === "bp") {
    value = `${metric.systolic ?? "—"}/${metric.diastolic ?? "—"}`;
    unitText = metric.unit || "mmHg";
    status = bpStatus(clinical, metric.systolic, metric.diastolic, language);
    if (!status) neutral = t("reading_care_team_review");
  } else if (type === "glucose") {
    const mg = Number.parseFloat(metric.latest_value) || 0;
    value = formatGlucose(mg, unit);
    unitText = formatGlucoseUnitBoth(mg, unit);
    status = glucoseStatus(clinical, mg, glucoseContextFromFullness(metric.fullness), language);
    if (!status) neutral = t("reading_care_team_review");
  } else {
    value = (Number.parseFloat(metric.latest_value) || 0).toFixed(1);
    unitText = metric.unit || "kg";
    neutral = t("latest_weigh_in");
  }
  const title = meta ? t(meta.titleKey) : metric.name;
  const weekText = weekCount === 0 ? t("metric_week_none") : weekCount === 1 ? t("metric_week_one") : t("metric_week_many", { count: weekCount });

  return (
    <article className={cx("vita-mc", `t-${type}`)} onClick={onOpen}>
      <header className="vita-mc-head">
        <span className="ic" style={{ background: meta ? ILLU_TINT[meta.illu] : "var(--vc-tile-mint)" }}>
          {meta ? <Illu name={meta.illu} size={34} /> : <Heart size={22} color="var(--vc-navy)" />}
        </span>
        <span className="tt">
          <h3>{title}</h3>
          <span>
            {t("metric_last_reading")} · {at ? fmtLongDay(at) : metric.last_updated}
          </span>
        </span>
      </header>

      <div className="vita-mc-value">
        <b>{value}</b>
        <span className="u">{unitText}</span>
      </div>
      {status ? <span className={cx("vita-mc-chip", `tone-${status.tone}`)}>{status.chip || status.label}</span> : neutral ? <span className="vita-mc-chip tone-neutral">{neutral}</span> : null}

      <div className={cx("vita-mc-chart", weekCount === 0 && "empty")}>
        <div className="top">
          <span>{t("home_this_week")}</span>
          <span>{weekText}</span>
        </div>
        <WeekStrip days={week} />
      </div>

      <footer className="vita-mc-foot" onClick={(event) => event.stopPropagation()}>
        {meta ? (
          <button type="button" className="log" onClick={() => onLog(meta.logPath)}>
            <Add size={16} color="currentColor" /> {t("metric_log_new")}
          </button>
        ) : null}
        <button type="button" className="hist" onClick={onOpen} aria-label={`${title}: ${t("metric_history")}`}>
          {t("metric_history")} <ArrowRight3 size={16} color="currentColor" />
        </button>
      </footer>
    </article>
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
      <div className="vita-scroll vita-mh" style={{ padding: 0 }}>
        <div className="vita-mh-hub">
          <HubLinks
            links={[
              { label: t("pillbox"), icon: <Illu name="pillbox" size={30} />, tint: ILLU_TINT.pillbox, onClick: () => push("/medications") },
              { label: t("health_score"), icon: <Illu name="health-score" size={30} />, tint: ILLU_TINT["health-score"], onClick: () => push("/health-score") },
              { label: t("reminders_title"), icon: <Illu name="reminders" size={30} />, tint: ILLU_TINT.reminders, onClick: () => push("/reminders") },
            ]}
          />
        </div>
        {loading ? (
          <CenterSpinner />
        ) : latest.length === 0 ? (
          <EmptyState title={t("no_health_metrics")} subtitle={t("no_health_metrics_body")} />
        ) : (
          <section className="vita-mh-section" aria-label={t("metric_section_title")}>
            <h2 className="vita-mh-title">{t("metric_section_title")}</h2>
            <div className="vita-mc-grid">
              {latest.map((m) => (
                <MetricCard key={m.type} metric={m} history={metrics} onOpen={() => push(`/metrics/${encodeURIComponent(m.type)}`)} onLog={push} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

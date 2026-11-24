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
import { useInsight, type Text } from "@/lib/plus/client/insights";
import { AppBar, CenterSpinner, CircleButton, EmptyState, HubLinks, Skeleton, cx } from "../ui/vita";
import { ILLU_TINT, Illu, type IlluName } from "../ui/vita-icons";
import { HabitsCard } from "./habits";

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

type Pt = { at: number; v: number };

/** A small trend line for a card: one or two series over the same time axis, last point marked. */
function Spark({ series, aria }: { series: Array<{ pts: Pt[]; color: string }>; aria: string }) {
  const all = series.flatMap((s) => s.pts);
  if (!all.length) return null;
  const W = 300;
  const H = 64;
  const x0 = Math.min(...all.map((p) => p.at));
  const x1 = Math.max(...all.map((p) => p.at));
  let y0 = Math.min(...all.map((p) => p.v));
  let y1 = Math.max(...all.map((p) => p.v));
  const pad = Math.max(1, (y1 - y0) * 0.15);
  y0 -= pad;
  y1 += pad;
  const X = (t: number) => (x1 === x0 ? W / 2 : 6 + ((t - x0) / (x1 - x0)) * (W - 12));
  const Y = (v: number) => H - 6 - ((v - y0) / (y1 - y0 || 1)) * (H - 12);
  return (
    <svg className="vita-mc-spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={aria}>
      {series.map((s, i) => {
        const pts = [...s.pts].sort((a, b) => a.at - b.at);
        const last = pts[pts.length - 1];
        return (
          <g key={i}>
            {pts.length > 1 ? <polyline points={pts.map((p) => `${X(p.at).toFixed(1)},${Y(p.v).toFixed(1)}`).join(" ")} fill="none" stroke={s.color} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" /> : null}
            {pts.length <= 12 ? pts.map((p, j) => <circle key={j} cx={X(p.at)} cy={Y(p.v)} r={2.2} fill={s.color} opacity={0.55} vectorEffect="non-scaling-stroke" />) : null}
            {last ? <circle cx={X(last.at)} cy={Y(last.v)} r={4} fill={s.color} stroke="var(--vc-surface)" strokeWidth={2} vectorEffect="non-scaling-stroke" /> : null}
          </g>
        );
      })}
    </svg>
  );
}

const ms = (iso: string) => new Date(iso).getTime();

/** The last 30 days for one reading type: trend line, one plain sentence and a count (GET /mobile/insights). */
function CardTrend({ type }: { type: "bp" | "glucose" | "weight" }) {
  const t = useT();
  const { language } = useLanguage();
  const [unit] = useGlucoseUnit();
  const { data, loading } = useInsight(type, 30);
  const L = (x: Text | null | undefined) => (x ? (language === "rw" && x.rw ? x.rw : x.en) : "");
  if (loading && !data) return <Skeleton height={118} style={{ marginTop: 16, borderRadius: 14 }} />;
  if (!data) return null;
  const cutoff = Date.now() - 30 * 86_400_000;
  let series: Array<{ pts: Pt[]; color: string }> = [];
  let right = "";
  let aria = "";
  if (data.type === "bp") {
    series = [
      { pts: data.points.map((p) => ({ at: ms(p.at), v: p.s })), color: "var(--vc-action)" },
      { pts: data.points.map((p) => ({ at: ms(p.at), v: p.d })), color: "var(--vc-navy)" },
    ];
    right = data.average ? `${t("ins_average")} ${data.average.s}/${data.average.d}` : "";
    aria = t("ins_trend_bp");
  } else if (data.type === "glucose") {
    series = [{ pts: data.points.map((p) => ({ at: ms(p.at), v: p.mg })), color: "#2bb3a3" }];
    right = data.average_mg != null ? `${t("ins_average")} ${formatGlucose(data.average_mg, unit)}` : "";
    aria = L(data.headline);
  } else if (data.type === "weight") {
    series = [{ pts: data.points.filter((p) => ms(p.at) >= cutoff).map((p) => ({ at: ms(p.at), v: p.kg })), color: "#2bb3a3" }];
    right = data.change != null && data.change !== 0 ? `${data.change > 0 ? "+" : ""}${data.change} kg` : "";
    aria = L(data.headline);
  }
  const count = series[0]?.pts.length ?? 0;
  return (
    <div className={cx("vita-mc-chart", !count && "empty")}>
      <div className="top">
        <span>{t("mh_last_30")}</span>
        <span>{count ? right || t("mh_readings_n", { n: count }) : ""}</span>
      </div>
      {count ? <Spark series={series} aria={aria} /> : <p className="vita-mc-none">{t("mh_no_30")}</p>}
      {count ? <p className="vita-mc-say">{L(data.headline)}</p> : null}
    </div>
  );
}

/** Your week: activity and sleep (left), medicines (right). Both open their Insights screen. */
function WeekCards() {
  const t = useT();
  const { language } = useLanguage();
  const { push } = usePlusPaths();
  const act = useInsight("activity", 7);
  const meds = useInsight("meds", 7);
  const L = (x: Text | null | undefined) => (x ? (language === "rw" && x.rw ? x.rw : x.en) : "");
  const a = act.data;
  const m = meds.data;
  const peak = Math.max(a?.goals.steps ?? 0, ...(a?.days ?? []).map((d) => d.steps ?? 0), 1);
  const dayLetter = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString(language === "rw" ? "rw-RW" : "en-GB", { weekday: "narrow" });
  const pct = m?.taken_pct ?? null;
  const R = 34;
  const C = 2 * Math.PI * R;
  return (
    <div className="vita-mh-week">
      <article className="vita-mh-wcard" onClick={() => push("/metrics/activity")}>
        <header className="vita-mc-head">
          <span className="ic" style={{ background: ILLU_TINT.today }}><Illu name="today" size={34} /></span>
          <span className="tt">
            <h3>{t("ins_activity_title")}</h3>
            <span>{t("mh_week_7")}</span>
          </span>
          <ArrowRight3 size={18} color="currentColor" className="go" />
        </header>
        {act.loading && !a ? (
          <Skeleton height={150} style={{ marginTop: 14, borderRadius: 14 }} />
        ) : a ? (
          <>
            <div className="vita-mh-steps" role="img" aria-label={L(a.headline)}>
              {a.days.slice(-7).map((d) => (
                <span key={d.date} className={cx("d", (d.steps ?? 0) >= a.goals.steps && "goal")}>
                  <span className="track"><span className="bar" style={{ height: d.steps ? `${Math.max(8, Math.round((d.steps / peak) * 100))}%` : 0 }} /></span>
                  <span className="lb">{dayLetter(d.date)}</span>
                </span>
              ))}
            </div>
            <div className="vita-mh-stats">
              <span><b>{a.steps.average != null ? a.steps.average.toLocaleString() : "—"}</b><small>{t("ins_steps")}</small></span>
              <span><b>{a.sleep.average != null ? `${a.sleep.average} h` : "—"}</b><small>{t("ins_sleep")}</small></span>
              <span><b>{a.water.average ?? "—"}</b><small>{t("mh_water")}</small></span>
              <span><b>{a.mood.average != null ? `${a.mood.average}/5` : "—"}</b><small>{t("mh_mood")}</small></span>
            </div>
            <p className="vita-mc-say">{L(a.headline)}</p>
          </>
        ) : null}
      </article>

      <article className="vita-mh-wcard" onClick={() => push(m && m.due ? "/metrics/meds" : "/medications")}>
        <header className="vita-mc-head">
          <span className="ic" style={{ background: ILLU_TINT.pillbox }}><Illu name="pillbox" size={34} /></span>
          <span className="tt">
            <h3>{t("ins_meds_title")}</h3>
            <span>{t("mh_week_7")}</span>
          </span>
          <ArrowRight3 size={18} color="currentColor" className="go" />
        </header>
        {meds.loading && !m ? (
          <Skeleton height={150} style={{ marginTop: 14, borderRadius: 14 }} />
        ) : m && m.due ? (
          <>
            <div className="vita-mh-meds">
              <svg viewBox="0 0 84 84" width={96} height={96} role="img" aria-label={L(m.headline)}>
                <circle cx="42" cy="42" r={R} fill="none" stroke="var(--vc-surface-muted)" strokeWidth="10" />
                <circle cx="42" cy="42" r={R} fill="none" stroke="#2bb3a3" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${((pct ?? 0) / 100) * C} ${C}`} transform="rotate(-90 42 42)" />
                <text x="42" y="47" textAnchor="middle" className="pct">{pct != null ? `${pct}%` : "—"}</text>
              </svg>
              <ul>
                <li><i style={{ background: "#2bb3a3" }} />{t("ins_taken")}<b>{m.counts.taken}</b></li>
                <li><i style={{ background: "var(--vc-action)" }} />{t("ins_missed")}<b>{m.counts.missed + m.counts.skipped}</b></li>
                <li><i className="ring" />{t("ins_not_recorded")}<b>{m.counts.not_recorded}</b></li>
              </ul>
            </div>
            <p className="vita-mc-say">{L(m.headline)}</p>
          </>
        ) : (
          <div className="vita-mh-nomeds">
            <p>{t("mh_no_meds")}</p>
            <span className="vita-mh-link">{t("mh_add_med")} <ArrowRight3 size={15} color="currentColor" /></span>
          </div>
        )}
      </article>
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

      {type === "bp" || type === "glucose" || type === "weight" ? (
        <CardTrend type={type} />
      ) : (
        <div className={cx("vita-mc-chart", weekCount === 0 && "empty")}>
          <div className="top">
            <span>{t("home_this_week")}</span>
            <span>{weekText}</span>
          </div>
          <WeekStrip days={week} />
        </div>
      )}

      <footer className="vita-mc-foot" onClick={(event) => event.stopPropagation()}>
        {meta ? (
          <button type="button" className="log" onClick={() => onLog(meta.logPath)}>
            <Add size={16} color="currentColor" /> {t("metric_log_new")}
          </button>
        ) : null}
        <button type="button" className="hist" onClick={onOpen} aria-label={`${title}: ${t("metric_history")}`}>
          {t("mh_see_insights")} <ArrowRight3 size={16} color="currentColor" />
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
        <section className="vita-mh-section" aria-label={t("hb_title")}>
          <HabitsCard compact />
        </section>
        <section className="vita-mh-section" aria-label={t("mh_your_week")}>
          <h2 className="vita-mh-title">{t("mh_your_week")}</h2>
          <WeekCards />
        </section>
      </div>
    </div>
  );
}

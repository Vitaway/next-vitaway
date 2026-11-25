"use client";

import { cloneElement, isValidElement, useEffect, useMemo, useState } from "react";
import { Activity, ArrowRight3, Call, Chart, Drop, Flash, MessageQuestion, Notification, Reserve, TickCircle, Weight } from "@/lib/plus/icons";
import { useLanguage, useT, type Translate } from "@/lib/plus/i18n";
import { RecommendedBlock, useAcademyHome } from "../academy/my-programme";
import { BMI_HOME_CAPTION_KEY, bmiViewFor } from "@/lib/plus/bmi";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { useTheme } from "@/lib/plus/theme";
import {
  appointmentStart,
  useAppointments,
  useMe,
  useMetrics,
  useNotifications,
  useSubscription,
} from "@/lib/plus/client/data";
import { useCarePlan } from "@/lib/plus/client/care-plan";
import { useTodayMedications } from "@/lib/plus/client/meds";
import { useInsight } from "@/lib/plus/client/insights";
import { doseLabel } from "@/lib/plus/medication";
import { glucoseContextFromFullness, latestByType, parseStamp, type HealthMetric } from "@/lib/plus/health";
import { bpStatus, gatedHealthScore, glucoseStatus, healthScoreAllowed } from "@/lib/plus/clinical-rules";
import { useClinicalConfig } from "@/lib/plus/client/clinical-config";
import { useReminders } from "@/lib/plus/reminders";
import { fmtHeaderDate, WEEKDAYS } from "@/lib/plus/format";
import { appointmentCardText } from "@/lib/plus/appointment-text";
import { formatGlucose, formatGlucoseUnitBoth, useGlucoseUnit } from "@/lib/plus/units";
import { useProgrammeConfig } from "@/lib/plus/client/programme-config";
import { dailyQuestionKey, homeSections, metricCardLayout, pick, readingPrompts, tipOfTheDay, type ProgrammeConfig, type ReadingType } from "@/lib/plus/programme-config";
import { DotSpinner, Photo, SectionHead } from "../ui/vita";
import { ILLU_TINT, Illu } from "../ui/vita-icons";

const ARROW = <ArrowRight3 size={22} color="rgba(var(--vc-navy-rgb),0.35)" />;

function weekLetters(): string[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (6 - i));
    return WEEKDAYS[d.getDay()][0];
  });
}

function weekSeries(history: HealthMetric[], type: string, systolic = false): Array<number | null> {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
  const values: Array<number | null> = Array(7).fill(null);
  const stamps: Array<Date | null> = Array(7).fill(null);
  for (const metric of history) {
    if (metric.type !== type) continue;
    const parsed = parseStamp(metric.last_updated);
    if (!parsed) continue;
    const day = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
    const index = Math.round((day.getTime() - start.getTime()) / 86_400_000);
    if (index < 0 || index > 6) continue;
    const n = systolic ? metric.systolic ?? 0 : Number.parseFloat(metric.latest_value) || 0;
    if (n <= 0) continue;
    const previous = stamps[index];
    if (!previous || parsed > previous) {
      stamps[index] = parsed;
      values[index] = n;
    }
  }
  return values;
}

function WeekChart({ series, color, height }: { series: Array<number | null>; color: string; height: number }) {
  const width = 140;
  const values = series.filter((v): v is number => v !== null);
  const gradientId = useMemo(() => `g${Math.random().toString(36).slice(2, 8)}`, []);
  if (!values.length) {
    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden>
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke={color} strokeOpacity="0.18" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1, max - min);
  const yOf = (v: number) => height - 5 - ((v - min) / span) * (height - 10);
  const slot = width / 7;
  const points = series
    .map((v, i) => (v === null ? null : { x: slot * i + slot / 2, y: yOf(v) }))
    .filter((p): p is { x: number; y: number } => p !== null);
  const line = points.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ");
  const fill = `M${points[0].x},${height} ${points.map((p) => `L${p.x},${p.y}`).join(" ")} L${points[points.length - 1].x},${height} Z`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.22" />
          <stop offset="1" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#${gradientId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      {points.map((p, i) => {
        const last = i === points.length - 1;
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={last ? 4.2 : 3.2} fill="var(--vc-surface)" stroke={color} strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
            {last ? <circle cx={p.x} cy={p.y} r="1.6" fill={color} /> : null}
          </g>
        );
      })}
    </svg>
  );
}

/** One reading on Home: a compact tile (value, a one-line status, a 7-day sparkline). Same height in a row. */
function MetricTile({
  icon,
  tint,
  ink,
  title,
  value,
  unit,
  status,
  series,
  letters,
  onClick,
}: {
  icon: React.ReactNode;
  tint: string;
  ink: string;
  title: string;
  value: string;
  unit: string;
  status: string;
  series: Array<number | null>;
  letters: string[];
  onClick: () => void;
}) {
  const parts = unit.match(/^(\S+)\s*\((.+)\)$/);
  const unitMain = parts ? parts[1] : unit;
  const unitAlt = parts ? parts[2] : "";
  const empty = value === "—";
  return (
    <button type="button" onClick={onClick} className={`vita-tap vh-tile ${empty ? "is-empty" : ""}`} style={{ ["--t-ink" as string]: ink, ["--t-tint" as string]: tint }}>
      <span className="vh-tile-head">
        <span className="vh-tile-ic">{icon}</span>
        <span className="vh-tile-title">{title}</span>
        <ArrowRight3 size={16} color="currentColor" />
      </span>
      <span className="vh-tile-val">
        <b>{value}</b>
        {unitMain ? <small>{unitMain}</small> : null}
        {unitAlt ? <em>{unitAlt}</em> : null}
      </span>
      <span className="vh-tile-status">{status}</span>
      <span className="vh-tile-chart">
        <WeekChart series={series} color={ink} height={34} />
        <span className="vh-tile-days">
          {letters.map((letter, i) => (
            <span key={i} className={i === letters.length - 1 ? "today" : ""}>{letter}</span>
          ))}
        </span>
      </span>
    </button>
  );
}

function weightCaption(t: Translate, heightCm: number | null | undefined, age: number | null | undefined, metric?: HealthMetric): string {
  if (!metric) return t("not_logged_yet");
  const kg = Number.parseFloat(metric.latest_value) || 0;
  const cm = heightCm ?? 0;
  if (kg <= 0) return t("not_logged_yet");
  // 110 cm is the old placeholder height, not a real measurement.
  if (cm <= 0 || cm === 110) return t("latest_weigh_in");
  // BL-013: adult ranges only from 18; children and unknown ages get a neutral caption.
  const view = bmiViewFor(kg, cm, age);
  if (!view.band) return t("latest_weigh_in");
  return t(BMI_HOME_CAPTION_KEY[view.band]);
}

function BannerShell({
  onClick,
  tint,
  ink,
  icon,
  title,
  subtitle,
  trailing,
  loading = false,
}: {
  onClick?: () => void;
  tint: string;
  ink: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  trailing?: string;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className="vita-tap"
      style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, textAlign: "left", background: tint, borderRadius: 20, padding: "12px 12px 12px 14px" }}
    >
      <span style={{ width: 40, height: 40, borderRadius: 8, background: "var(--vc-surface)", color: ink, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{icon}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 14, fontWeight: 800, color: "var(--vc-ink)" }}>{title}</span>
        <span style={{ display: "block", marginTop: 2, fontSize: 13, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.58)" }}>{subtitle}</span>
      </span>
      {loading ? (
        <span style={{ color: ink, marginRight: 4 }}>
          <DotSpinner small />
        </span>
      ) : trailing ? (
        <span style={{ minWidth: 44, padding: "8px 10px", borderRadius: 8, background: "var(--vc-surface)", textAlign: "center", fontSize: 18, fontWeight: 800, color: ink, marginRight: 4 }}>{trailing}</span>
      ) : null}
      {loading ? null : ARROW}
    </button>
  );
}

function SubscriptionBanner({ onClick }: { onClick: () => void }) {
  const { t } = useLanguage();
  const sub = useSubscription();
  const care = useCarePlan();
  const mintInk = "#2BB3A3";
  if (sub.loading || care.loading) {
    return <BannerShell loading tint="var(--vc-tile-mint)" ink={mintInk} icon={<Illu name="plan" size={30} />} title={t("home_plan_checking")} subtitle={t("home_plan_checking_body")} />;
  }
  // F07: a care-programme trial wins over the older MiraFood subscription banner.
  if (care.onTrial) {
    return (
      <BannerShell
        onClick={onClick}
        tint="var(--vc-tile-mint)"
        ink={mintInk}
        icon={<Illu name="plan" size={30} />}
        title={t("home_trial_days_left", { days: `${care.daysLeft}` })}
        subtitle={t("home_trial_keep")}
        trailing={`${care.daysLeft}`}
      />
    );
  }
  if (care.active || sub.active) {
    const days = care.active ? care.daysLeft || sub.daysLeft : sub.daysLeft;
    const unit = days === 1 ? t("day_one") : t("days");
    return (
      <BannerShell
        onClick={onClick}
        tint="var(--vc-tile-mint)"
        ink={mintInk}
        icon={<Illu name="plan" size={30} />}
        title={sub.onTrial ? t("home_trial_days_left", { days: `${days}` }) : t("home_sub_active")}
        subtitle={sub.onTrial ? t("home_trial_keep") : t("home_days_left", { days: `${days} ${unit}` })}
        trailing={days ? `${days}` : undefined}
      />
    );
  }
  if (sub.canTrial) {
    return <BannerShell onClick={onClick} tint="var(--vc-tile-mint)" ink={mintInk} icon={<Flash size={22} color="currentColor" />} title={t("home_start_trial_cta")} subtitle={t("plans_trial_included")} />;
  }
  return <BannerShell onClick={onClick} tint="var(--vc-tile-peach)" ink="#E85A2E" icon={<Illu name="plan" size={30} />} title={t("home_subscribe_cta")} subtitle={t("choose_plan")} />;
}

function LearnSection({ onOpenLearn }: { onOpenLearn: () => void }) {
  const t = useT();
  const academy = useAcademyHome();
  return (
    <div>
      <button type="button" onClick={onOpenLearn} className="vita-tap" style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, textAlign: "left", background: "var(--vc-tile-mint)", borderRadius: 10, padding: 14 }}>
        <span style={{ width: 42, height: 42, borderRadius: 8, background: "var(--vc-surface)", color: "var(--vc-navy)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          <Illu name="badge" size={34} />
        </span>
        <span style={{ flex: 1 }}>
          <span style={{ display: "block", fontSize: 15, fontWeight: 800, color: "var(--vc-ink)" }}>{t("earn_badges")}</span>
          <span style={{ display: "block", marginTop: 2, fontSize: 13, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.6)" }}>{t("home_learn_hint")}</span>
        </span>
        <ArrowRight3 size={22} color="rgba(var(--vc-navy-rgb),0.4)" />
      </button>
      {/* The same Academy cards as the Learn tab: video briefs and recipes picked for the member's programme. */}
      <div className="vh-learn-cards">
        <RecommendedBlock courseId={academy.data?.programme?.course_id ?? null} />
      </div>
    </div>
  );
}

const READING_ICON: Record<ReadingType, React.ReactNode> = {
  glucose: <Illu name="glucose" size={34} />,
  bp: <Illu name="bp" size={34} />,
  weight: <Illu name="weight" size={34} />,
};

/** W13: one question a day from the programme. Only "answered today" is kept, on this phone; answers are not sent yet. */
function DailyQuestion({ question }: { question: NonNullable<ProgrammeConfig["daily_question"]> }) {
  const { t, language } = useLanguage();
  const key = dailyQuestionKey(question.id, new Date());
  const [answered, setAnswered] = useState(false);
  useEffect(() => {
    try {
      setAnswered(window.localStorage.getItem(key) === "1");
    } catch {
      /* private mode */
    }
  }, [key]);
  const answer = () => {
    setAnswered(true);
    try {
      window.localStorage.setItem(key, "1");
    } catch {
      /* private mode */
    }
  };
  return (
    <div data-testid="home-daily-question" style={{ background: "var(--vc-tile-lilac)", borderRadius: 10, padding: 14 }}>
      <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 800, color: "rgba(var(--vc-navy-rgb),0.6)", textTransform: "uppercase", letterSpacing: 0.4 }}>
        <MessageQuestion size={16} color="currentColor" /> {t("home_daily_question")}
      </span>
      <p style={{ margin: "8px 0 0", fontSize: 15, fontWeight: 800, color: "var(--vc-ink)" }}>{pick(question.text, language)}</p>
      {answered ? (
        <p style={{ margin: "10px 0 0", fontSize: 13, fontWeight: 700, color: "var(--vc-navy)" }}>{t("daily_question_thanks")}</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          {question.answers.map((a) => (
            <button key={a.value} type="button" onClick={answer} className="vita-tap" style={{ padding: "8px 14px", borderRadius: 999, background: "var(--vc-surface)", fontSize: 13, fontWeight: 800, color: "var(--vc-navy)" }}>
              {pick(a.label, language)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MealTip({ config }: { config: ProgrammeConfig }) {
  const { t, language } = useLanguage();
  const tip = tipOfTheDay(config.meal_tips.tips, new Date());
  if (!tip) return null;
  return (
    <div data-testid="home-meal-tip" style={{ display: "flex", gap: 12, background: "var(--vc-tile-mint)", borderRadius: 10, padding: 14 }}>
      <span style={{ width: 40, height: 40, borderRadius: 8, background: "var(--vc-surface)", color: "var(--vc-navy)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
        <Reserve size={22} color="currentColor" />
      </span>
      <span style={{ flex: 1 }}>
        <span style={{ display: "block", fontSize: 13, fontWeight: 800, color: "rgba(var(--vc-navy-rgb),0.6)", textTransform: "uppercase", letterSpacing: 0.4 }}>{t("home_meal_tip")}</span>
        <span style={{ display: "block", marginTop: 4, fontSize: 14, fontWeight: 700, color: "var(--vc-ink)", lineHeight: 1.35 }}>{pick(tip, language)}</span>
      </span>
    </div>
  );
}

/** A progress ring for the hero's "today at a glance". `total` 0 shows a dash and an empty track. */
function GlanceRing({ done, total, label, color, center, onClick }: { done: number; total: number; label: string; color: string; center?: string; onClick: () => void }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const pct = total > 0 ? Math.max(0, Math.min(1, done / total)) : 0;
  return (
    <button type="button" className="vita-tap vh-ring" onClick={onClick}>
      <span className="vh-ring-svg">
        <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden>
          <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="6" />
          <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${c * pct} ${c}`} transform="rotate(-90 32 32)" style={{ transition: "stroke-dasharray .6s ease" }} />
        </svg>
        <b>{center ?? (total > 0 ? `${done}/${total}` : "—")}</b>
      </span>
      <span className="vh-ring-label">{label}</span>
    </button>
  );
}

type PlanRow = { key: string; icon: React.ReactNode; tint: string; title: string; sub: string; done: boolean; action: string; onClick: () => void };

/** W13 + pillbox: everything due today in one checklist (programme readings, medicine doses, the next reminder). */
const PLAN_SHOWN = 4;

/** "8:0" → "08:00". */
const hhmm = (v: string) => v.replace(/^(\d{1,2}):(\d{1,2})$/, (_, h: string, m: string) => `${h.padStart(2, "0")}:${m.padStart(2, "0")}`);

function TodayPlan({ rows, emptyAction, onSeeAll }: { rows: PlanRow[]; emptyAction: () => void; onSeeAll: () => void }) {
  const { t } = useLanguage();
  const [more, setMore] = useState(false);
  const done = rows.filter((r) => r.done).length;
  const total = rows.length;
  // What is still to do comes first; finished rows sink to the bottom.
  const ordered = [...rows.filter((r) => !r.done), ...rows.filter((r) => r.done)];
  const shown = more ? ordered : ordered.slice(0, PLAN_SHOWN);
  const hidden = ordered.length - shown.length;
  return (
    <div className="vh-card vh-plan" data-testid="home-reading-prompts">
      <div className="vh-plan-head">
        <span>
          <span className="vh-card-title">{t("home_plan_title")}</span>
          <span className="vh-card-sub">{total ? (done === total ? t("home_plan_all_done") : t("home_plan_progress", { done, total })) : t("home_plan_empty")}</span>
        </span>
        <button type="button" className="vh-link" onClick={onSeeAll}>{t("see_all")}</button>
      </div>
      {total ? (
        <>
          <span className="vh-plan-bar" aria-hidden>
            <span style={{ width: `${Math.round((done / total) * 100)}%` }} />
          </span>
          <ul className="vh-plan-list">
            {shown.map((row) => (
              <li key={row.key}>
                <button type="button" className={`vh-plan-row ${row.done ? "is-done" : ""}`} onClick={row.onClick}>
                  <span className="vh-plan-ic" style={{ background: row.tint }}>{row.icon}</span>
                  <span className="vh-plan-txt">
                    <span className="vh-plan-title">{row.title}</span>
                    <span className="vh-plan-sub">{row.sub}</span>
                  </span>
                  {row.done ? (
                    <span className="vh-plan-check" aria-label={t("home_done")}>
                      <TickCircle size={22} variant="Bold" color="currentColor" />
                    </span>
                  ) : (
                    <span className="vh-plan-go">{row.action}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          {hidden > 0 || more ? (
            <button type="button" className="vh-plan-more" aria-expanded={more} onClick={() => setMore((m) => !m)}>
              {more ? t("home_plan_less") : t("home_plan_more", { n: hidden })}
            </button>
          ) : null}
        </>
      ) : (
        <button type="button" className="vh-plan-row" onClick={emptyAction}>
          <span className="vh-plan-ic" style={{ background: ILLU_TINT.today }}>
            <Illu name="today" size={30} />
          </span>
          <span className="vh-plan-txt">
            <span className="vh-plan-title">{t("home_nothing_due")}</span>
            <span className="vh-plan-sub">{t("home_nothing_due_body")}</span>
          </span>
          <span className="vh-plan-go">{t("home_log")}</span>
        </button>
      )}
    </div>
  );
}

/** The insights headline (GET /mobile/insights) for BP and glucose, when there are readings in the last 30 days. */
function NumbersCard({ types, onOpen }: { types: ReadingType[]; onOpen: (type: ReadingType) => void }) {
  const { t, language } = useLanguage();
  const bp = useInsight("bp", 30);
  const glucose = useInsight("glucose", 30);
  const lines: Array<{ type: ReadingType; text: string }> = [];
  if (types.includes("bp") && bp.data && bp.data.count > 0) lines.push({ type: "bp", text: language === "rw" ? bp.data.headline.rw : bp.data.headline.en });
  if (types.includes("glucose") && glucose.data && glucose.data.count > 0) lines.push({ type: "glucose", text: language === "rw" ? glucose.data.headline.rw : glucose.data.headline.en });
  if (!lines.length) return null;
  return (
    <div className="vh-card vh-numbers" data-testid="home-numbers">
      <span className="vh-numbers-kicker">
        <Chart size={16} color="currentColor" /> {t("home_numbers_title")}
      </span>
      {lines.map((line) => (
        <button key={line.type} type="button" className="vh-numbers-row" onClick={() => onOpen(line.type)}>
          <span className="vh-plan-ic" style={{ background: ILLU_TINT[line.type] }}>{READING_ICON[line.type]}</span>
          <span className="vh-numbers-text">{line.text}</span>
          <ArrowRight3 size={18} color="currentColor" />
        </button>
      ))}
    </div>
  );
}

export default function HomeScreen() {
  const { t, language } = useLanguage();
  const clinical = useClinicalConfig();
  const { dark } = useTheme();
  const { push } = usePlusPaths();
  const { user } = useMe();
  const { metrics } = useMetrics();
  const { unread } = useNotifications();
  const { all: appointments } = useAppointments();
  const { list: reminders } = useReminders();
  const meds = useTodayMedications();
  const [glucoseUnit] = useGlucoseUnit();
  const { config } = useProgrammeConfig();

  const latest = latestByType(metrics);
  const glucose = latest.glucose;
  const bp = latest.bp;
  const weight = latest.weight;
  // Tracker v9.0: no interpretation until CA-03/CA-04 are approved, no score until CA-15.
  const glucoseMg = glucose ? Math.round(Number.parseFloat(glucose.latest_value) || 0) : 0;
  const glucoseView = glucose ? glucoseStatus(clinical, glucoseMg, glucoseContextFromFullness(glucose.fullness), language) : null;
  const bpView = bp ? bpStatus(clinical, bp.systolic, bp.diastolic, language) : null;
  const showScore = healthScoreAllowed(clinical);
  const scorePoints = gatedHealthScore(clinical, { bp: bpView, glucose: glucoseView, weightLogged: !!weight && (Number.parseFloat(weight.latest_value) || 0) > 0 });
  const caption = (logged: boolean, view: { label: string } | null) => (!logged ? t("no_reading_yet") : view ? view.label : t("reading_care_team_review"));
  const first = (user?.first_name ?? "").trim();
  const org = user?.organization?.name?.trim() ?? "";
  const orgName = org.toLowerCase().replace(/[\s_-]+/g, "") === "mirafood" ? "MiraFood" : org;
  const discount = Number(user?.organization?.discount_pct ?? 0);
  const letters = weekLetters();
  const now = Date.now();
  const upcoming = appointments
    .filter((a) => a.status === "PENDING" && appointmentStart(a).getTime() > now)
    .sort((a, b) => appointmentStart(a).getTime() - appointmentStart(b).getTime());
  // BL-103: never "Monday with Platform".
  const visit = upcoming.length
    ? appointmentCardText({ start: appointmentStart(upcoming[0]), firstName: upcoming[0].coach_profile?.first_name, speciality: (upcoming[0].coach_profile as { speciality?: unknown } | null | undefined)?.speciality, clinic: upcoming[0].kind === "clinic", lang: language === "rw" ? "rw" : "en" })
    : null;
  const next = reminders[0] ?? null;
  // W13: which sections, in which order, come from the member's programmes (default = the old Home).
  const sections = homeSections(config.home_cards);
  const metricCards = metricCardLayout(config.home_cards);
  const prompts = readingPrompts(config, metrics.map((m) => ({ type: m.type, at: parseStamp(m.last_updated) })), new Date());
  const tile = (type: ReadingType) => {
    if (type === "glucose")
      return (
        <MetricTile
          icon={<Drop size={15} variant="Bold" color="currentColor" />}
          tint="var(--vc-tile-peach)"
          ink="#E85A2E"
          title={t("hm_glucose")}
          value={glucose ? formatGlucose(Number.parseFloat(glucose.latest_value) || 0, glucoseUnit) : "—"}
          unit={glucose ? formatGlucoseUnitBoth(Number.parseFloat(glucose.latest_value) || 0, glucoseUnit) : ""}
          status={caption(!!glucose && glucoseMg > 0, glucoseView)}
          series={weekSeries(metrics, "glucose")}
          letters={letters}
          onClick={() => push("/metrics/glucose")}
        />
      );
    if (type === "bp")
      return (
        <MetricTile
          icon={<Activity size={15} color="currentColor" />}
          tint="var(--vc-tile-lilac)"
          ink={dark ? "#A99BDB" : "#5B4B8A"}
          title={t("hm_blood_pressure")}
          value={bp ? `${bp.systolic ?? "—"}/${bp.diastolic ?? "—"}` : "—"}
          unit={bp ? "mmHg" : ""}
          status={caption(!!bp && (bp.systolic ?? 0) > 0, bpView)}
          series={weekSeries(metrics, "bp", true)}
          letters={letters}
          onClick={() => push("/metrics/bp")}
        />
      );
    return (
      <MetricTile
        icon={<Weight size={14} color="currentColor" />}
        tint="var(--vc-tile-mint)"
        ink={dark ? "#7FD8C8" : "#0B6B63"}
        title={t("hm_weight")}
        value={weight ? (Number.parseFloat(weight.latest_value) || 0).toFixed(1) : "—"}
        unit={weight ? "kg" : ""}
        status={weightCaption(t, user?.profile?.height, Number(user?.age ?? user?.profile?.age ?? 0) || 0, weight)}
        series={weekSeries(metrics, "weight")}
        letters={letters}
        onClick={() => push("/metrics/weight")}
      />
    );
  };

  // One "Today's plan" card replaces the three old lists (readings due, the next reminder, medicines today).
  const PLAN_SECTIONS = ["reading_prompts", "today", "medicines"];
  const planRows: PlanRow[] = [];
  if (sections.includes("reading_prompts")) {
    for (const p of prompts) {
      const when = p.when === "today" ? t("reading_due_today") : t("reading_due_week", { done: p.doneThisWeek, total: p.perWeek });
      const tod = p.timeOfDay.map((x) => t(`tod_${x}`)).join(", ");
      planRows.push({
        key: `r-${p.type}`,
        icon: <Illu name={p.type} size={28} />,
        tint: ILLU_TINT[p.type],
        title: pick(p.text, language) || t(`reading_prompt_${p.type}`),
        sub: tod ? `${when} · ${tod}` : when,
        done: !p.due,
        action: t("home_log"),
        onClick: () => push(`/log/${p.type}`),
      });
    }
  }
  if (sections.includes("today") && next && next.type !== "med" && !prompts.some((p) => p.type === next.type)) {
    planRows.push({
      key: "reminder",
      icon: <Illu name={next.type === "bp" ? "bp" : "glucose"} size={28} />,
      tint: ILLU_TINT[next.type === "bp" ? "bp" : "glucose"],
      title: next.name,
      sub: next.times[0] ? hhmm(next.times[0]) : t("home_scheduled_today"),
      done: false,
      action: t("home_log"),
      onClick: () => push(next.type === "bp" ? "/log/bp" : "/log/glucose"),
    });
  }
  let dosesDue = 0;
  let dosesTaken = 0;
  if (sections.includes("medicines") && !meds.error) {
    // One row per medicine (its next dose), not one per dose: four medicines can be fifteen doses a day.
    const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
    const mins = (hm: string) => {
      const [h, m] = hm.split(":").map(Number);
      return (h || 0) * 60 + (m || 0);
    };
    for (const med of meds.list) {
      if (!med.slots.length) continue;
      const taken = med.slots.filter((x) => x.status === "taken").length;
      dosesDue += med.slots.length;
      dosesTaken += taken;
      // A dose marked missed can still be taken late; only taken or skipped doses are finished.
      const open = med.slots.filter((x) => x.status !== "taken" && x.status !== "skipped");
      const next = open.find((x) => mins(x.time) >= nowMin - 60) ?? open[open.length - 1];
      const parts = [doseLabel(med)];
      if (next) parts.push(t("home_med_next", { time: hhmm(next.time) }));
      if (med.slots.length > 1) parts.push(t("home_med_taken", { done: taken, total: med.slots.length }));
      planRows.push({
        key: `m-${med.id}`,
        icon: <Illu name="pillbox" size={28} />,
        tint: ILLU_TINT.pillbox,
        title: med.name,
        sub: parts.filter(Boolean).join(" · "),
        done: !next,
        action: t("home_take"),
        onClick: () => push("/medications"),
      });
    }
  }
  const planDone = planRows.filter((r) => r.done).length;
  const weekTarget = prompts.reduce((sum, p) => sum + p.perWeek, 0);

  const renderSection = (section: string): React.ReactNode => {
    switch (section) {
      case "metrics":
        return (
          <div key="metrics" data-sec="metrics">
            <SectionHead title={t("home_this_week")} action={t("see_all")} onAction={() => push("/metrics")} style={{ margin: "24px 0 10px" }} />
            <div className="vh-tiles">
              {metricCards.map(({ type }) => (
                <div key={type} className="vh-tile-cell">{tile(type)}</div>
              ))}
            </div>
            <NumbersCard types={metricCards.map((m) => m.type)} onOpen={(type) => push(`/metrics/${type}`)} />
          </div>
        );
      case "reading_prompts":
      case "today":
      case "medicines":
        // The plan card sits where the first of its three sections was.
        return sections.find((s) => PLAN_SECTIONS.includes(s)) === section ? (
          <div key="plan" data-sec="plan" style={{ marginTop: 20 }}>
            <TodayPlan rows={planRows} emptyAction={() => push("/log/glucose")} onSeeAll={() => push("/reminders")} />
          </div>
        ) : null;
      case "daily_question":
        return config.daily_question ? (
          <div key="daily_question" data-sec="daily_question" style={{ marginTop: 20 }}>
            <DailyQuestion question={config.daily_question} />
          </div>
        ) : null;
      case "meal_tips":
        return config.meal_tips.enabled ? (
          <div key="meal_tips" data-sec="meal_tips" style={{ marginTop: 20 }}>
            <MealTip config={config} />
          </div>
        ) : null;
      case "visit":
        return (
          <div key="visit" data-sec="visit" style={{ marginTop: 20 }}>
            <button type="button" className="vita-tap vh-visit" onClick={() => push("/care")}>
              <span className="vh-plan-ic" style={{ background: "var(--vc-surface)" }}>
                <Illu name="book-visit" size={30} />
              </span>
              <span className="vh-plan-txt">
                <span className="vh-plan-kicker">{t("home_clinic_visit")}</span>
                <span className="vh-plan-title">{visit ? visit.title : t("quick_book_visit")}</span>
                <span className="vh-plan-sub">{visit ? visit.subtitle : t("home_book_visit_body")}</span>
              </span>
              <ArrowRight3 size={20} color="rgba(var(--vc-navy-rgb),0.4)" />
            </button>
          </div>
        );
      case "learn":
        return (
          <div key="learn" data-sec="learn">
            <SectionHead title={t("learn_title")} action={t("view_all")} onAction={() => push("/learn")} style={{ margin: "24px 0 10px" }} />
            <LearnSection onOpenLearn={() => push("/learn")} />
          </div>
        );
      default:
        return null;
    }
  };
  // Web: some sections move to the right rail. Phones keep the programme's order through CSS `order`.
  const sectionNodes = sections.map((section, index) => {
    const node = renderSection(section);
    const el = isValidElement(node) ? (node as React.ReactElement<{ style?: React.CSSProperties }>) : null;
    return { rail: RAIL_SECTIONS.includes(section), node: el ? cloneElement(el, { style: { ...(el.props.style ?? {}), order: index } }) : node };
  });
  const weekCutoff = Date.now() - 7 * 86_400_000;
  const weekCount = metrics.filter((m) => (parseStamp(m.last_updated)?.getTime() ?? 0) >= weekCutoff).length;
  const weekLine = weekCount === 0 ? t("home_week_none") : weekCount === 1 ? t("home_week_one") : t("home_week_many", { count: weekCount });
  const hello = first ? `${t("hello")}, ${first}!` : `${t("hello")}!`;

  return (
    <div className="vita-home vh" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 104px)" }}>
      <div className="vita-home-top" style={{ position: "relative" }}>
        <div className="vita-home-hero vh-band" style={{ background: "#003E48", borderRadius: "0 0 28px 28px", padding: "calc(env(safe-area-inset-top) + 14px) 18px 22px" }}>
          <div className="vh-toprow" style={{ display: "flex", alignItems: "center" }}>
            <span className="vita-home-logo" style={{ width: 44, height: 44, borderRadius: "50%", background: "#fff", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/plus-assets/vitaway-logo.png" alt="Vitaway" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </span>
            <span style={{ flex: 1 }} />
            <button type="button" className="vita-home-hero-btn" aria-label="Notifications" onClick={() => push("/notifications")} style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", color: "#fff" }}>
              <Notification size={20} variant="Bold" color="currentColor" />
              {unread > 0 ? (
                <span style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: "#E85A2E", border: "1.2px solid #fff", color: "#fff", fontSize: 8, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
                  {unread > 9 ? "9" : unread}
                </span>
              ) : null}
            </button>
            <button type="button" className="vita-home-hero-btn" aria-label="Account" onClick={() => push("/profile")} style={{ marginLeft: 10, width: 42, height: 42, borderRadius: "50%", background: "#fff", padding: 2 }}>
              <span style={{ display: "block", width: 38, height: 38, borderRadius: "50%", overflow: "hidden" }}>
                <Photo url={user?.profile?.profile_picture} size={38} />
              </span>
            </button>
          </div>
          <div className="vh-hero">
            <div className="vh-hero-text">
              <span className="vh-date">{fmtHeaderDate(new Date())}</span>
              <h1 className="vh-hello">
                {hello} <span className="vita-wave" aria-hidden>👋</span>
              </h1>
              <p className="vh-weekline">{weekLine}</p>
              {orgName ? <span className="vh-org">{discount > 0 ? t("org_discount", { name: orgName, percent: discount }) : t("org_with", { name: orgName })}</span> : null}
            </div>
            <div className="vh-glance" aria-label={t("home_glance_title")}>
              <span className="vh-glance-title">{t("home_glance_title")}</span>
              <div className="vh-rings">
                {showScore ? <GlanceRing done={scorePoints ?? 0} total={scorePoints === null ? 0 : 100} center={scorePoints === null ? "—" : `${scorePoints}`} label={t("health_score")} color="#FF9466" onClick={() => push("/health-score")} /> : null}
                <GlanceRing done={planDone} total={planRows.length} label={t("home_ring_plan")} color="#5CE0C6" onClick={() => push("/reminders")} />
                <GlanceRing done={weekCount} total={weekTarget || Math.max(weekCount, 1)} center={weekTarget ? `${Math.min(weekCount, 99)}/${weekTarget}` : `${weekCount}`} label={t("home_ring_week")} color="#FFB38A" onClick={() => push("/metrics")} />
                {showScore ? null : <GlanceRing done={dosesTaken} total={dosesDue} label={t("home_ring_meds")} color="#C3B5F5" onClick={() => push("/medications")} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="vita-home-body vh-body" style={{ padding: "0 18px" }}>
        <div className="vita-home-main">{sectionNodes.filter((n) => !n.rail).map((n) => n.node)}</div>
        <aside className="vita-home-rail" aria-label={t("home_side_panel")}>
          <button type="button" className="vita-tap vh-sos" data-testid="home-emergency-card" onClick={() => push("/emergency")} style={{ order: -2 }}>
            <span className="vh-sos-ic">
              <Call size={18} variant="Bold" color="currentColor" />
            </span>
            <span className="vh-plan-txt">
              <span className="vh-plan-title">{t("emergency_card_title")}</span>
              <span className="vh-plan-sub">{t("emergency_card_sub")}</span>
            </span>
            <ArrowRight3 size={18} color="currentColor" />
          </button>
          <div className="vh-subwrap" style={{ order: -1 }}>
            <SubscriptionBanner onClick={() => push("/plans")} />
          </div>
          {sectionNodes.filter((n) => n.rail).map((n) => n.node)}
        </aside>
      </div>
    </div>
  );
}

const RAIL_SECTIONS = ["daily_question", "meal_tips", "visit"];

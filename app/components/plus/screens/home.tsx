"use client";

import { useMemo } from "react";
import { Activity, Add, ArrowRight3, Book1, Calendar1, Crown1, Drop, Flash, Health, Heart, Notification, TickCircle, Weight } from "iconsax-react";
import { useLanguage, type Translate } from "@/lib/plus/i18n";
import { BMI_HOME_CAPTION_KEY, bmiViewFor } from "@/lib/plus/bmi";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { useTheme } from "@/lib/plus/theme";
import {
  appointmentStart,
  useAppointments,
  useArticles,
  useMe,
  useMetrics,
  useNotifications,
  useSubscription,
  type Article,
} from "@/lib/plus/client/data";
import { useTodayMedications } from "@/lib/plus/client/meds";
import {
  bpCategoryOf,
  bpHomeCaption,
  glucoseCategoryOf,
  glucoseHomeCaption,
  healthScoreFrom,
  latestByType,
  parseStamp,
  type HealthMetric,
} from "@/lib/plus/health";
import { useReminders } from "@/lib/plus/reminders";
import { fmtHeaderDate, fmtHm, WEEKDAYS } from "@/lib/plus/format";
import { formatGlucose, glucoseUnitLabel, useGlucoseUnit } from "@/lib/plus/units";
import { ActionButton, DotSpinner, Photo, SectionHead } from "../ui/vita";
import { TodayMedicineCard } from "../meds/cards";

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

function InsightCard({
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
  compact = false,
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
  compact?: boolean;
}) {
  const valueText = unit ? `${value} ${unit}` : value;
  const ellipsis: React.CSSProperties = { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
  const letterRow = (size: number) => (
    <span style={{ display: "flex" }}>
      {letters.map((letter, i) => (
        <span key={i} style={{ flex: 1, textAlign: "center", fontSize: size, fontWeight: 700, color: "rgba(var(--vc-navy-rgb),0.4)" }}>
          {letter}
        </span>
      ))}
    </span>
  );
  if (compact) {
    return (
      <button type="button" onClick={onClick} className="vita-tap" style={{ width: "100%", display: "flex", gap: 12, textAlign: "left", background: "var(--vc-surface)", borderRadius: 10, padding: "12px 14px 10px" }}>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 26, height: 26, borderRadius: 8, background: tint, color: ink, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</span>
            <span style={{ fontWeight: 800, fontSize: 13, color: "var(--vc-ink)", ...ellipsis }}>{title}</span>
          </span>
          <span style={{ display: "block", marginTop: 8, fontSize: 22, fontWeight: 800, color: "var(--vc-ink)", ...ellipsis }}>{valueText}</span>
          <span style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.55)", ...ellipsis }}>{status}</span>
        </span>
        <span style={{ width: 120, flex: "none", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <ArrowRight3 size={18} color="rgba(var(--vc-navy-rgb),0.35)" />
          <span style={{ display: "block", width: "100%", marginTop: 6 }}>
            <WeekChart series={series} color={ink} height={36} />
          </span>
          <span style={{ display: "block", width: "100%", marginTop: 2 }}>{letterRow(9)}</span>
        </span>
      </button>
    );
  }
  return (
    <button type="button" onClick={onClick} className="vita-tap" style={{ width: "100%", display: "block", textAlign: "left", background: "var(--vc-surface)", borderRadius: 10, padding: "14px 14px 12px" }}>
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 28, height: 28, borderRadius: 6, background: tint, color: ink, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{icon}</span>
        <span style={{ flex: 1, fontWeight: 800, fontSize: 13, color: "var(--vc-ink)", ...ellipsis }}>{title}</span>
        <ArrowRight3 size={18} color="rgba(var(--vc-navy-rgb),0.35)" />
      </span>
      <span style={{ display: "block", marginTop: 12, fontSize: 20, fontWeight: 800, color: "var(--vc-ink)", ...ellipsis }}>{valueText}</span>
      <span style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.55)", ...ellipsis }}>{status}</span>
      <span style={{ display: "block", marginTop: 10 }}>
        <WeekChart series={series} color={ink} height={44} />
      </span>
      <span style={{ display: "block", marginTop: 4 }}>{letterRow(10)}</span>
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
        <span style={{ display: "block", marginTop: 2, fontSize: 12.5, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.58)" }}>{subtitle}</span>
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
  const mintInk = "#2BB3A3";
  if (sub.loading) {
    return <BannerShell loading tint="var(--vc-tile-mint)" ink={mintInk} icon={<Crown1 size={22} color="currentColor" />} title={t("home_plan_checking")} subtitle={t("home_plan_checking_body")} />;
  }
  if (sub.active) {
    const unit = sub.daysLeft === 1 ? t("day_one") : t("days");
    return (
      <BannerShell
        onClick={onClick}
        tint="var(--vc-tile-mint)"
        ink={mintInk}
        icon={<Crown1 size={22} color="currentColor" />}
        title={sub.onTrial ? t("home_trial_active") : t("home_sub_active")}
        subtitle={t("home_days_left", { days: `${sub.daysLeft} ${unit}` })}
        trailing={`${sub.daysLeft}`}
      />
    );
  }
  if (sub.canTrial) {
    return <BannerShell onClick={onClick} tint="var(--vc-tile-mint)" ink={mintInk} icon={<Flash size={22} color="currentColor" />} title={t("home_start_trial_cta")} subtitle={t("plans_trial_included")} />;
  }
  return <BannerShell onClick={onClick} tint="var(--vc-tile-peach)" ink="#E85A2E" icon={<Crown1 size={22} color="currentColor" />} title={t("home_subscribe_cta")} subtitle={t("choose_plan")} />;
}

function MedicinesToday({ onAdd, onOpenPillBox, onOpen }: { onAdd: () => void; onOpenPillBox: () => void; onOpen: (id: number) => void }) {
  const { t } = useLanguage();
  const { list, loading, error } = useTodayMedications();
  if (loading) {
    return (
      <div style={{ background: "var(--vc-surface)", borderRadius: 10, padding: 16, height: 80, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vc-navy)" }}>
        <DotSpinner />
      </div>
    );
  }
  const meds = error ? [] : list;
  if (!meds.length) {
    return (
      <div style={{ background: "var(--vc-surface)", borderRadius: 10, padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ flex: 1, fontWeight: 700, fontSize: 14, color: "var(--vc-navy)" }}>{t("home_no_medicines_today")}</span>
        <ActionButton small tone="teal" label={t("add")} onClick={onAdd} icon={<Add size={16} color="currentColor" />} />
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {meds.slice(0, 3).map((med) => (
        <TodayMedicineCard key={med.id} medication={med} onClick={() => onOpen(med.id)} />
      ))}
      {meds.length > 3 ? (
        <button type="button" onClick={onOpenPillBox} style={{ padding: 10, fontWeight: 700, color: "var(--vc-teal-ink)", fontSize: 14 }}>
          {t("home_see_all_medicines", { count: meds.length })}
        </button>
      ) : null}
    </div>
  );
}

function LearnSection({ onOpenLearn, onOpenArticle }: { onOpenLearn: () => void; onOpenArticle: (a: Article) => void }) {
  const { t, language } = useLanguage();
  const { articles, loading } = useArticles(language);
  return (
    <div>
      <button type="button" onClick={onOpenLearn} className="vita-tap" style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, textAlign: "left", background: "var(--vc-tile-mint)", borderRadius: 10, padding: 14 }}>
        <span style={{ width: 42, height: 42, borderRadius: 8, background: "var(--vc-surface)", color: "var(--vc-navy)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          <Crown1 size={22} color="currentColor" />
        </span>
        <span style={{ flex: 1 }}>
          <span style={{ display: "block", fontSize: 15, fontWeight: 800, color: "var(--vc-ink)" }}>{t("earn_badges")}</span>
          <span style={{ display: "block", marginTop: 2, fontSize: 12.5, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.6)" }}>{t("home_learn_hint")}</span>
        </span>
        <ArrowRight3 size={22} color="rgba(var(--vc-navy-rgb),0.4)" />
      </button>
      <div style={{ marginTop: 12 }}>
        {loading ? (
          <div style={{ height: 168, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vc-navy)" }}>
            <DotSpinner />
          </div>
        ) : !articles.length ? (
          <div style={{ padding: "22px 16px", background: "var(--vc-surface)", borderRadius: 10, border: "1px solid rgba(var(--vc-navy-rgb),0.08)", textAlign: "center" }}>
            <Book1 size={28} color="rgba(var(--vc-navy-rgb),0.35)" />
            <p style={{ margin: "8px 0 0", fontSize: 13, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.55)" }}>{t("home_learn_empty")}</p>
          </div>
        ) : (
          <div className="vita-hide-scroll" style={{ display: "flex", gap: 10, overflowX: "auto", margin: "0 -18px", padding: "0 18px" }}>
            {articles.slice(0, 6).map((article) => (
              <button
                key={article.id}
                type="button"
                onClick={() => onOpenArticle(article)}
                className="vita-tap"
                style={{ width: 168, height: 178, flex: "none", textAlign: "left", background: "var(--vc-surface)", borderRadius: 10, border: "1px solid rgba(var(--vc-navy-rgb),0.08)", overflow: "hidden", display: "flex", flexDirection: "column" }}
              >
                <span style={{ height: 96, width: "100%", background: "var(--vc-tile-mint)", display: "block", flex: "none" }}>
                  {article.image ? <Photo url={article.image} /> : null}
                </span>
                <span style={{ padding: "10px 12px" }}>
                  <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontSize: 13, fontWeight: 800, lineHeight: 1.25, color: "var(--vc-ink)" }}>{article.title}</span>
                  <span style={{ display: "block", marginTop: 6, fontSize: 11, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.45)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {article.author?.trim() ? article.author : "Vitaway"}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomeScreen() {
  const { t } = useLanguage();
  const { dark } = useTheme();
  const { push } = usePlusPaths();
  const { user } = useMe();
  const { metrics } = useMetrics();
  const { unread } = useNotifications();
  const { all: appointments } = useAppointments();
  const { list: reminders } = useReminders();
  const [glucoseUnit] = useGlucoseUnit();

  const latest = latestByType(metrics);
  const glucose = latest.glucose;
  const bp = latest.bp;
  const weight = latest.weight;
  const score = healthScoreFrom({ glucose, bloodPressure: bp, weight });
  const first = (user?.first_name ?? "").trim();
  const name = first || t("hello");
  const mrn = (user?.profile?.medical_record_number ?? "").trim();
  const org = user?.organization?.name?.trim() ?? "";
  const orgName = org.toLowerCase().replace(/[\s_-]+/g, "") === "mirafood" ? "MiraFood" : org;
  const discount = Number(user?.organization?.discount_pct ?? 0);
  const letters = weekLetters();
  const now = Date.now();
  const upcoming = appointments
    .filter((a) => a.status === "PENDING" && appointmentStart(a).getTime() > now)
    .sort((a, b) => appointmentStart(a).getTime() - appointmentStart(b).getTime());
  const next = reminders[0] ?? null;
  const pad = { padding: "0 18px" };

  return (
    <div style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 104px)" }}>
      {/* Dashboard header */}
      <div style={{ position: "relative", paddingBottom: 40 }}>
        <div style={{ background: "#003E48", borderRadius: "0 0 24px 24px", padding: "calc(env(safe-area-inset-top) + 14px) 20px 86px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ width: 52, height: 52, borderRadius: "50%", background: "#fff", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/plus-assets/vitaway-logo.png" alt="Vitaway" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </span>
            <span style={{ marginLeft: 10, padding: "8px 12px", borderRadius: 10, background: "rgba(255,255,255,0.18)", color: "#fff", fontWeight: 700, fontSize: 13 }}>{fmtHeaderDate(new Date())}</span>
            <span style={{ flex: 1 }} />
            <button type="button" aria-label="Notifications" onClick={() => push("/notifications")} style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", color: "#fff" }}>
              <Notification size={20} variant="Bold" color="currentColor" />
              {unread > 0 ? (
                <span style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: "#003E48", border: "1.2px solid #fff", color: "#fff", fontSize: 8, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
                  {unread > 9 ? "9" : unread}
                </span>
              ) : null}
            </button>
            <button type="button" aria-label="Account" onClick={() => push("/profile")} style={{ marginLeft: 10, width: 44, height: 44, borderRadius: "50%", background: "#fff", padding: 2 }}>
              <span style={{ display: "block", width: 40, height: 40, borderRadius: "50%", overflow: "hidden" }}>
                <Photo url={user?.profile?.profile_picture} size={40} />
              </span>
            </button>
          </div>
          <p style={{ margin: "22px 0 0", color: "#fff", fontSize: 30, lineHeight: 1.05, fontWeight: 800, letterSpacing: -0.6 }}>Hello, {name}!</p>
        </div>
        <button
          type="button"
          onClick={() => push("/health-score")}
          className="vita-tap"
          style={{ position: "absolute", left: 18, right: 18, bottom: 12, display: "flex", alignItems: "center", gap: 14, textAlign: "left", background: "var(--vc-surface)", borderRadius: 10, padding: "12px 14px", boxShadow: "var(--vc-card-shadow)" }}
        >
          <span style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--vc-tile-mint)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800, color: "var(--vc-navy)", flex: "none" }}>
            {score.points === null ? "—" : score.points}
          </span>
          <span style={{ flex: 1 }}>
            <span style={{ display: "block", fontSize: 16, fontWeight: 800, color: "var(--vc-ink)" }}>{score.headline}</span>
            <span style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
              {score.inRange ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 10, background: "var(--vc-tile-mint)", color: "var(--vc-navy)", fontSize: 11, fontWeight: 800 }}>
                  <Heart size={12} variant="Bold" color="currentColor" /> {t("home_in_range")}
                </span>
              ) : null}
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 10, background: "var(--vc-tile-peach)", color: "var(--vc-navy)", fontSize: 11, fontWeight: 800 }}>
                {mrn ? <TickCircle size={12} color="currentColor" /> : <Add size={12} color="currentColor" />} {mrn ? t("home_record_linked") : t("home_add_reading")}
              </span>
            </span>
          </span>
          {ARROW}
        </button>
      </div>

      {orgName ? (
        <p style={{ margin: "0 18px 8px", fontSize: 14, fontWeight: 800, color: "var(--vc-navy)" }}>
          {discount > 0 ? t("org_discount", { name: orgName, percent: discount }) : t("org_with", { name: orgName })}
        </p>
      ) : null}

      <div style={{ padding: "0 18px 4px" }}>
        <SubscriptionBanner onClick={() => push("/plans")} />
      </div>

      <div style={pad}>
        <SectionHead title={t("home_this_week")} action={t("see_all")} onAction={() => push("/metrics")} style={{ margin: "24px 0 10px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <InsightCard
            icon={<Drop size={16} variant="Bold" color="currentColor" />}
            tint="var(--vc-tile-peach)"
            ink="#E85A2E"
            title={t("hm_glucose")}
            value={glucose ? formatGlucose(Number.parseFloat(glucose.latest_value) || 0, glucoseUnit) : "—"}
            unit={glucose ? glucoseUnitLabel(glucoseUnit) : ""}
            status={glucoseHomeCaption(glucoseCategoryOf(glucose))}
            series={weekSeries(metrics, "glucose")}
            letters={letters}
            onClick={() => push("/log/glucose")}
          />
          <InsightCard
            icon={<Activity size={16} color="currentColor" />}
            tint="var(--vc-tile-lilac)"
            ink={dark ? "#A99BDB" : "#5B4B8A"}
            title={t("hm_blood_pressure")}
            value={bp ? `${bp.systolic ?? "—"}/${bp.diastolic ?? "—"}` : "—"}
            unit={bp ? "mmHg" : ""}
            status={bpHomeCaption(bpCategoryOf(bp))}
            series={weekSeries(metrics, "bp", true)}
            letters={letters}
            onClick={() => push("/log/bp")}
          />
          <div style={{ gridColumn: "1 / -1" }}>
            <InsightCard
              compact
              icon={<Weight size={15} color="currentColor" />}
              tint="var(--vc-tile-mint)"
              ink={dark ? "#E4EBE8" : "#003E48"}
              title={t("hm_weight")}
              value={weight ? (Number.parseFloat(weight.latest_value) || 0).toFixed(1) : "—"}
              unit={weight ? "kg" : ""}
              status={weightCaption(t, user?.profile?.height, Number(user?.age ?? user?.profile?.age ?? 0) || 0, weight)}
              series={weekSeries(metrics, "weight")}
              letters={letters}
              onClick={() => push("/log/weight")}
            />
          </div>
        </div>

        <SectionHead title={t("hm_today")} action={t("see_all")} onAction={() => push("/reminders")} style={{ margin: "24px 0 10px" }} />
        <button
          type="button"
          className="vita-tap"
          onClick={() => {
            if (!next) return push("/log/glucose");
            // BL-122: a medicine reminder opens the Pillbox.
            if (next.type === "med") return push("/medications");
            if (next.type === "bp") return push("/log/bp");
            return push("/log/glucose");
          }}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, textAlign: "left", background: "var(--vc-surface)", borderRadius: 10, padding: 16 }}
        >
          <span style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--vc-tile-peach)", color: "#E85A2E", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            {!next ? <Add size={24} color="currentColor" /> : next.type === "med" ? <Health size={24} color="currentColor" /> : next.type === "bp" ? <Activity size={24} color="currentColor" /> : <Drop size={24} variant="Bold" color="currentColor" />}
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontSize: 16, fontWeight: 800, color: "var(--vc-ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{next ? next.name : t("home_nothing_due")}</span>
            <span style={{ display: "block", marginTop: 4, fontSize: 13, color: "rgba(var(--vc-navy-rgb),0.6)" }}>
              {next ? (next.times[0] ?? t("home_scheduled_today")) : t("home_nothing_due_body")}
            </span>
          </span>
        </button>

        <SectionHead title={t("medicines_today")} action={t("pillbox")} onAction={() => push("/medications")} style={{ margin: "24px 0 10px" }} />
        <MedicinesToday onAdd={() => push("/medications/add")} onOpenPillBox={() => push("/medications")} onOpen={(id) => push(`/medications/${id}`)} />

        <SectionHead title={t("home_clinic_visit")} action={t("home_book")} onAction={() => push("/book-visit")} style={{ margin: "24px 0 10px" }} />
        <button
          type="button"
          className="vita-tap"
          onClick={() => push(upcoming.length ? "/appointments" : "/book-visit")}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, textAlign: "left", background: "var(--vc-wash)", borderRadius: 10, padding: 14 }}
        >
          <span style={{ width: 40, height: 40, borderRadius: 8, background: "#E85A2E", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <Calendar1 size={22} color="currentColor" />
          </span>
          <span style={{ flex: 1 }}>
            <span style={{ display: "block", fontWeight: 800, fontSize: 15, color: "var(--vc-ink)" }}>
              {upcoming.length ? `${WEEKDAYS[appointmentStart(upcoming[0]).getDay()]} with ${upcoming[0].coach_profile?.first_name || (upcoming[0].kind === "clinic" ? "Clinic" : "")}` : t("quick_book_visit")}
            </span>
            <span style={{ display: "block", fontSize: 12.5, color: dark ? "#D9B8A6" : "#6A4A3A" }}>
              {upcoming.length ? `${fmtHm(appointmentStart(upcoming[0]))} · Vitaway clinic` : t("home_book_visit_body")}
            </span>
          </span>
          <ArrowRight3 size={22} color="rgba(var(--vc-navy-rgb),0.4)" />
        </button>

        <SectionHead title={t("learn_title")} action={t("view_all")} onAction={() => push("/articles")} style={{ margin: "24px 0 10px" }} />
        <LearnSection onOpenLearn={() => push("/articles")} onOpenArticle={(a) => push(`/articles/${a.id}`)} />
      </div>
    </div>
  );
}

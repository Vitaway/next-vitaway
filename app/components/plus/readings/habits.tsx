"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/plus/i18n";
import { mobileRequest } from "@/lib/plus/client/api";
import { invalidate } from "@/lib/plus/client/use-resource";
import { useInsight } from "@/lib/plus/client/insights";
import { AppBar, Skeleton, cx, useFeedback } from "../ui/vita";


type HabitType = "water_glasses" | "steps" | "sleep_hours";
type Habit = { type: HabitType; label: string; unit: string; value: number; goal: number; step: number; mode: "add" | "set"; fmt: (v: number) => string };

/** Today's date as the backend keys daily totals (Kigali, UTC+2). */
export function kigaliToday(now = new Date()): string {
  return new Date(now.getTime() + 2 * 3600_000).toISOString().slice(0, 10);
}

/** Water and steps add up through the day; sleep is one number for last night. */
export async function logHabit(type: HabitType | "mood", value: number, add: boolean) {
  const body = await mobileRequest<{ points?: { awarded?: number } }>("/api/v1/mobile/observations", { method: "POST", body: { type, value, ...(add ? { add: true } : {}) } });
  invalidate("/api/v1/mobile/insights", "/api/v1/mobile/observations", "/api/v1/mobile/points");
  return body;
}

const MOODS = ["😣", "🙁", "😐", "🙂", "😄"];

/**
 * Today's habits: water, steps, sleep and mood with the goals the care team set (or the defaults).
 * Logging any of them is the daily check-in (+5 points, once a day, within the daily cap).
 */
export function HabitsCard({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  const { toast } = useFeedback();
  const act = useInsight("activity", 7);
  const [busy, setBusy] = useState<string | null>(null);
  const today = kigaliToday();
  const d = act.data;
  if (act.loading && !d) return <Skeleton height={compact ? 220 : 280} style={{ borderRadius: 10 }} />;
  if (!d) return null;
  const day = d.days.find((x) => x.date === today) ?? { date: today, steps: null, sleep_hours: null, water_glasses: null, mood: null };

  const habits: Habit[] = [
    { type: "water_glasses", label: t("hb_water"), unit: t("hb_glasses"), value: day.water_glasses ?? 0, goal: d.goals.water, step: 1, mode: "add", fmt: (v) => String(v) },
    { type: "steps", label: t("hb_steps"), unit: t("hb_steps_unit"), value: day.steps ?? 0, goal: d.goals.steps, step: 1000, mode: "add", fmt: (v) => v.toLocaleString("en-US") },
    { type: "sleep_hours", label: t("hb_sleep"), unit: "h", value: day.sleep_hours ?? 0, goal: d.goals.sleepLow, step: 0.5, mode: "set", fmt: (v) => String(v) },
  ];
  const done = habits.filter((h) => h.value >= h.goal).length + (day.mood != null ? 1 : 0);

  const run = async (key: string, fn: () => Promise<unknown>, okText: string) => {
    setBusy(key);
    try {
      await fn();
      toast(okText);
    } catch (e) {
      toast(e instanceof Error && e.message ? e.message : t("failed_to_save_metric"), { error: true });
    }
    setBusy(null);
  };

  return (
    <section className={cx("vita-habits", compact && "compact")} data-testid="habits-card">
      <div className="vita-habits-head">
        <h2>{t("hb_title")}</h2>
        <span>{t("hb_done_of", { n: done, total: 4 })}</span>
      </div>
      {habits.map((h) => {
        const pct = Math.min(100, h.goal ? (h.value / h.goal) * 100 : 0);
        const reached = h.value >= h.goal;
        return (
          <div key={h.type} className="vita-habit">
            <div className="vita-habit-main">
              <div className="vita-habit-line">
                <b>{h.label}</b>
                <span>
                  {h.fmt(h.value)} / {h.fmt(h.goal)} {h.unit}
                </span>
              </div>
              <div className="vita-habit-bar">
                <i style={{ width: `${pct}%`, background: reached ? "#1D9E75" : "var(--vc-navy)" }} />
              </div>
            </div>
            {h.mode === "set" ? (
              <span className="vita-habit-btns">
                <button type="button" aria-label={t("hb_less", { label: h.label })} disabled={busy !== null || h.value <= 0} onClick={() => void run(h.type, () => logHabit(h.type, Math.max(0, h.value - h.step), false), t("hb_saved"))}>
                  −
                </button>
                <button type="button" aria-label={t("hb_more", { label: h.label })} disabled={busy !== null || h.value >= 24} onClick={() => void run(h.type, () => logHabit(h.type, Math.min(24, (h.value || h.goal - h.step) + h.step), false), t("hb_saved"))}>
                  +
                </button>
              </span>
            ) : (
              <button type="button" className="vita-habit-add" disabled={busy !== null} onClick={() => void run(h.type, () => logHabit(h.type, h.step, true), reached ? t("hb_saved") : h.value + h.step >= h.goal ? t("hb_goal_reached", { label: h.label }) : t("hb_saved"))}>
                {busy === h.type ? "…" : `+${h.fmt(h.step)}`}
              </button>
            )}
          </div>
        );
      })}
      <div className="vita-habit vita-habit-mood">
        <div className="vita-habit-main">
          <div className="vita-habit-line">
            <b>{t("hb_mood")}</b>
            <span>{day.mood != null ? t("hb_mood_logged") : t("hb_mood_ask")}</span>
          </div>
        </div>
        <span className="vita-moods" role="radiogroup" aria-label={t("hb_mood")}>
          {MOODS.map((m, i) => (
            <button key={m} type="button" role="radio" aria-checked={day.mood != null && Math.round(day.mood) === i + 1} aria-label={t("hb_mood_n", { n: i + 1 })} disabled={busy !== null} onClick={() => void run("mood", () => logHabit("mood", i + 1, false), t("hb_saved"))}>
              {m}
            </button>
          ))}
        </span>
      </div>
      <p className="vita-habits-note">{t("hb_note")}</p>
    </section>
  );
}

export default function HabitsScreen() {
  const { t } = useLanguage();
  return (
    <div className="vita-page w-narrow">
      <AppBar title={t("hb_title")} />
      <div className="vita-scroll" style={{ padding: "8px 16px 28px" }}>
        <HabitsCard />
      </div>
    </div>
  );
}

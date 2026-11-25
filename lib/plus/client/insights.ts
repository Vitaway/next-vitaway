"use client";

import { mobileRequest } from "./api";
import { useResource } from "./use-resource";

/** GET /api/v1/mobile/insights/:type?period=7|30|90 (backend insights.logic.ts). Text comes in both languages. */
export type Text = { en: string; rw: string };
export type Period = 7 | 30 | 90;
export type InsightType = "bp" | "glucose" | "weight" | "activity" | "meds";
export type BandChip = { id: string; chip: Text; tone: string };
export type BandSummary = { rule: null | "approved" | "pending_signoff"; counts: Array<{ id: string; chip: Text; tone: string; n: number }>; not_flagged: number };

export type BpInsight = {
  type: "bp";
  period: Period;
  count: number;
  days_measured: number;
  average: { s: number; d: number } | null;
  previous: { s: number; d: number } | null;
  change: { s: number; d: number } | null;
  morning: { s: number; d: number; n: number } | null;
  evening: { s: number; d: number; n: number } | null;
  weekly: Array<{ week_end: string; s: number; d: number; n: number }>;
  points: Array<{ at: string; s: number; d: number; band: BandChip | null }>;
  moving_average: Array<{ at: string; s: number; d: number }>;
  target: { high: number; high2: number } | null;
  in_target_pct: number | null;
  bands: BandSummary;
  headline: Text;
  notes: Text[];
};

export type GlucoseInsight = {
  type: "glucose";
  period: Period;
  count: number;
  average_mg: number | null;
  fasting_average_mg: number | null;
  after_meal_average_mg: number | null;
  in_target_pct: number | null;
  previous_in_target_pct: number | null;
  targets: { fasting_mg: { low: number; high: number } | null; after_meal_mg: { high: number } | null };
  by_meal: Array<{ meal: string; average_mg: number | null; n: number }>;
  typical_day: Array<{ id: string; label: Text; median_mg: number | null; n: number }>;
  points: Array<{ at: string; mg: number; context: string | null; meal: string | null; in_target: boolean | null; band: BandChip | null }>;
  bands: BandSummary;
  hba1c: Array<{ at: string; value: number }>;
  headline: Text;
  notes: Text[];
};

export type WeightInsight = {
  type: "weight";
  count: number;
  start: number | null;
  now: number | null;
  change: number | null;
  goal: number | null;
  to_goal: number | null;
  pct_lost: number | null;
  rate_per_week: number | null;
  five_pct_mark: number | null;
  bmi: number | null;
  bmi_start: number | null;
  points: Array<{ at: string; kg: number }>;
  moving_average: Array<{ at: string; kg: number }>;
  waist: Array<{ at: string; cm: number }>;
  headline: Text;
  notes: Text[];
};

export type ActivityInsight = {
  type: "activity";
  period: Period;
  days: Array<{ date: string; steps: number | null; sleep_hours: number | null; water_glasses: number | null; mood: number | null }>;
  goals: { steps: number; water: number; sleepLow: number };
  steps: { days_logged: number; average: number | null; active_days: number };
  sleep: { nights_logged: number; average: number | null; nights_at_goal: number };
  water: { days_logged: number; average: number | null; days_at_goal: number };
  mood: { days_logged: number; average: number | null };
  headline: Text;
};

export type MedsInsight = {
  type: "meds";
  period: Period;
  due: number;
  taken_pct: number | null;
  counts: { taken: number; missed: number; skipped: number; not_recorded: number; late: number };
  by_medicine: Array<{ id: string; name: string; dose: string | null; due: number; taken_pct: number | null }>;
  morning_pct: number | null;
  evening_pct: number | null;
  weekend_evening_pct: number | null;
  weekday_evening_pct: number | null;
  grid: Array<{ medication_id: string; name: string; slot: string; days: Array<{ date: string; status: "taken" | "missed" | "skipped" | "not_recorded" }> }>;
  headline: Text;
  notes: Text[];
};

export type Insight = BpInsight | GlucoseInsight | WeightInsight | ActivityInsight | MedsInsight;
export type InsightOf<T extends InsightType> = Extract<Insight, { type: T }>;

export function insightKey(type: InsightType, period: Period): string {
  return `/api/v1/mobile/insights/${type}?period=${period}`;
}

/** The newer /mobile routes answer `{ success, data }`; the DRF-era ones answer the body. Accept both. */
export function unwrapEnvelope<T>(body: unknown): T {
  if (body && typeof body === "object" && "success" in body && "data" in body) return (body as { data: T }).data;
  return body as T;
}

export function useInsight<T extends InsightType>(type: T, period: Period) {
  return useResource<InsightOf<T>>(insightKey(type, period), async () => unwrapEnvelope<InsightOf<T>>(await mobileRequest(`/api/v1/mobile/insights/${type}`, { query: { period } })), { maxAgeMs: 60_000 });
}

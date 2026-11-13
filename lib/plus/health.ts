/**
 * Health reading rules, ported as-is from the Flutter app
 * (utils/health_classifiers.dart and Pages/home/health_score.dart).
 */

import { bmiViewFor } from "./bmi";
export { bpFieldComplete, bpKeypadAppend } from "./bp-keypad";

export type HealthMetric = {
  unique_id: string;
  type: "glucose" | "bp" | "weight" | string;
  name: string;
  unit: string;
  systolic: number | null;
  diastolic: number | null;
  latest_value: string;
  last_updated: string;
  fullness: number;
};

export type HealthTone = "ok" | "warn" | "bad";

/** Parse the API timestamp. Dart's `DateTime.toString()` has no zone, so it is local time. */
export function parseStamp(value: string | null | undefined): Date | null {
  if (!value) return null;
  const raw = value.trim();
  const local = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,6}))?)?$/.exec(raw);
  if (local) {
    const [, y, mo, d, h, mi, s, ms] = local;
    return new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s ?? 0), Number((ms ?? "0").slice(0, 3).padEnd(3, "0")));
  }
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Same shape as Dart's `DateTime.now().toString()`: `YYYY-MM-DD HH:MM:SS.mmm`. */
export function dartStamp(date: Date): string {
  const p = (n: number, w = 2) => String(n).padStart(w, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())} ${p(date.getHours())}:${p(date.getMinutes())}:${p(date.getSeconds())}.${p(date.getMilliseconds(), 3)}`;
}

export function newUuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function latestByType(metrics: HealthMetric[]): Record<string, HealthMetric> {
  const out: Record<string, HealthMetric> = {};
  for (const metric of metrics) {
    const current = out[metric.type];
    const a = parseStamp(metric.last_updated)?.getTime() ?? 0;
    const b = current ? parseStamp(current.last_updated)?.getTime() ?? 0 : -1;
    if (!current || a > b) out[metric.type] = metric;
  }
  return out;
}

/* ───────── Blood pressure ───────── */

export type BpCategory = "checkNumbers" | "veryHigh" | "high" | "aboveTarget" | "low" | "elevated" | "normal";

export const BP_SYSTOLIC_MIN = 60;
export const BP_SYSTOLIC_MAX = 300;
export const BP_DIASTOLIC_MIN = 30;
export const BP_DIASTOLIC_MAX = 200;
export const BP_PULSE_MIN = 30;
export const BP_PULSE_MAX = 220;

/** Highest value each BP keypad field accepts: 0 top, 1 bottom, 2 pulse (health_classifiers.dart bpFieldMax). */
export function bpFieldMax(field: "top" | "bottom" | "pulse"): number {
  return field === "top" ? BP_SYSTOLIC_MAX : field === "bottom" ? BP_DIASTOLIC_MAX : BP_PULSE_MAX;
}

type Tr = (key: string, vars?: Record<string, string | number>) => string;

/** Localised form of bpValidationError (Flutter reads the same en/rw keys). */
export function bpValidationErrorText(t: Tr, systolic: number, diastolic: number): string | null {
  if (systolic < BP_SYSTOLIC_MIN || systolic > BP_SYSTOLIC_MAX) return t("bp_err_top_range", { min: BP_SYSTOLIC_MIN, max: BP_SYSTOLIC_MAX });
  if (diastolic < BP_DIASTOLIC_MIN || diastolic > BP_DIASTOLIC_MAX) return t("bp_err_bottom_range", { min: BP_DIASTOLIC_MIN, max: BP_DIASTOLIC_MAX });
  if (systolic <= diastolic) return t("bp_err_top_above_bottom");
  return null;
}

export function bpValidationError(systolic: number, diastolic: number): string | null {
  if (systolic < BP_SYSTOLIC_MIN || systolic > BP_SYSTOLIC_MAX) {
    return `The top number should be between ${BP_SYSTOLIC_MIN} and ${BP_SYSTOLIC_MAX}.`;
  }
  if (diastolic < BP_DIASTOLIC_MIN || diastolic > BP_DIASTOLIC_MAX) {
    return `The bottom number should be between ${BP_DIASTOLIC_MIN} and ${BP_DIASTOLIC_MAX}.`;
  }
  if (systolic <= diastolic) return "The top number should be higher than the bottom one.";
  return null;
}

export function classifyBP(systolic: number, diastolic: number): BpCategory {
  if (bpValidationError(systolic, diastolic) !== null) return "checkNumbers";
  if (systolic >= 180 || diastolic >= 120) return "veryHigh";
  if (systolic >= 140 || diastolic >= 90) return "high";
  if (systolic >= 130 || diastolic >= 80) return "aboveTarget";
  if (systolic < 90 || diastolic < 60) return "low";
  if (systolic >= 120) return "elevated";
  return "normal";
}

export function bpCategoryOf(metric?: HealthMetric | null): BpCategory | null {
  const systolic = metric?.systolic ?? 0;
  const diastolic = metric?.diastolic ?? 0;
  if (systolic <= 0 && diastolic <= 0) return null;
  return classifyBP(systolic, diastolic);
}

export const BP_EMPTY_TIP =
  "Sit quietly 5 minutes, feet flat, arm at heart level. Measure twice, 1 minute apart, and enter the second reading.";

export function bpHomeCaption(category: BpCategory | null): string {
  switch (category) {
    case null:
      return "Not logged yet";
    case "checkNumbers":
      return "Check this reading";
    case "veryHigh":
      return "Very high – measure again now";
    case "high":
      return "High – talk with your care team";
    case "aboveTarget":
      return "A little high";
    case "low":
      return "Low";
    default:
      return "In your target";
  }
}

export type MetricStatus = { chip: string; label: string; tone: HealthTone };

export function bpMetricsStatus(category: BpCategory | null): MetricStatus | null {
  switch (category) {
    case null:
      return null;
    case "checkNumbers":
      return { chip: "—", label: "Check this reading", tone: "warn" };
    case "veryHigh":
      return { chip: "Very high", label: "Call 912 if you have symptoms", tone: "bad" };
    case "high":
      return { chip: "High", label: "Talk with your care team", tone: "bad" };
    case "aboveTarget":
      return { chip: "Above target", label: "Slightly above target", tone: "warn" };
    case "low":
      return { chip: "Low", label: "Below normal", tone: "warn" };
    case "elevated":
      return { chip: "Elevated", label: "A little elevated", tone: "warn" };
    case "normal":
      return { chip: "Normal", label: "In a healthy range", tone: "ok" };
  }
}

/* ───────── Glucose (judged in mg/dL) ───────── */

export type GlucoseContext = "fasting" | "beforeMeal" | "afterMeal" | "bedtime" | "other";
export type GlucoseCategory =
  | "checkNumber"
  | "veryLow"
  | "low"
  | "veryHigh"
  | "highKetones"
  | "belowTarget"
  | "aboveTarget"
  | "inTarget";

export const GLUCOSE_MG_MIN = 20;
export const GLUCOSE_MG_MAX = 600;

export const GLUCOSE_CONTEXTS: GlucoseContext[] = ["fasting", "beforeMeal", "afterMeal", "bedtime", "other"];

export const GLUCOSE_CONTEXT_LABELS: Record<GlucoseContext, string> = {
  fasting: "Fasting",
  beforeMeal: "Before meal",
  afterMeal: "2 h after meal",
  bedtime: "Bedtime",
  other: "Other",
};

export function glucoseContextFullness(context: GlucoseContext): number {
  switch (context) {
    case "fasting":
      return 3;
    case "beforeMeal":
      return 0;
    case "afterMeal":
      return 2;
    default:
      return 1;
  }
}

export function glucoseContextFromFullness(fullness: number): GlucoseContext {
  switch (fullness) {
    case 3:
      return "fasting";
    case 2:
      return "afterMeal";
    case 1:
      return "other";
    default:
      return "beforeMeal";
  }
}

export function glucoseBand(context: GlucoseContext): { low: number; high: number; label: string } {
  switch (context) {
    case "fasting":
    case "beforeMeal":
      return { low: 80, high: 130, label: "80–130" };
    case "bedtime":
      return { low: 80, high: 180, label: "80–180" };
    default:
      return { low: 80, high: 180, label: "under 180" };
  }
}

export function glucoseToMg(value: number, mmol: boolean): number {
  return Math.round(mmol ? value * 18 : value);
}

export function classifyGlucoseMg(mg: number, context: GlucoseContext): GlucoseCategory {
  if (mg < GLUCOSE_MG_MIN || mg > GLUCOSE_MG_MAX) return "checkNumber";
  if (mg < 54) return "veryLow";
  if (mg < 70) return "low";
  if (mg >= 300) return "veryHigh";
  if (mg >= 250) return "highKetones";
  const band = glucoseBand(context);
  if (mg < band.low) return "belowTarget";
  if (mg > band.high) return "aboveTarget";
  return "inTarget";
}

export function glucoseCategoryOf(metric?: HealthMetric | null): GlucoseCategory | null {
  if (!metric) return null;
  const mg = Number.parseFloat(metric.latest_value) || 0;
  if (mg <= 0) return null;
  return classifyGlucoseMg(Math.round(mg), glucoseContextFromFullness(metric.fullness));
}

export function glucoseHomeCaption(category: GlucoseCategory | null): string {
  switch (category) {
    case null:
      return "Not logged yet";
    case "checkNumber":
      return "Check this reading";
    case "veryLow":
    case "low":
      return "Low – treat now";
    case "veryHigh":
      return "Very high – contact your care team";
    case "highKetones":
      return "High – check ketones if unwell";
    case "aboveTarget":
      return "Above target";
    case "belowTarget":
      return "Below target";
    case "inTarget":
      return "In your target";
  }
}

export function glucoseMetricsStatus(category: GlucoseCategory | null): MetricStatus | null {
  switch (category) {
    case null:
      return null;
    case "checkNumber":
      return { chip: "—", label: "Check this reading", tone: "warn" };
    case "veryLow":
    case "low":
      return { chip: "Low", label: "Take 15 g fast sugar", tone: "bad" };
    case "veryHigh":
      return { chip: "Very high", label: "Contact your care team today", tone: "bad" };
    case "highKetones":
      return { chip: "High", label: "Check ketones if unwell", tone: "bad" };
    case "aboveTarget":
      return { chip: "Above target", label: "Above your target", tone: "warn" };
    case "belowTarget":
      return { chip: "Below target", label: "Below your target", tone: "warn" };
    case "inTarget":
      return { chip: "In target", label: "In your target", tone: "ok" };
  }
}

/* ───────── Weight ───────── */

/** English caption; adult ranges only from 18 with a known age (BL-013). */
export function weightCaption(kg: number, heightCm: number | null | undefined, age?: number | null): string {
  const h = heightCm ?? 0;
  if (!h || h === 110 || kg <= 0) return "Latest weigh-in";
  const view = bmiViewFor(kg, h, age ?? 0);
  if (!view.band) return "Latest weigh-in";
  if (view.band === "underweight") return "Below the usual range";
  if (view.band === "healthy") return "In the usual range";
  if (view.band === "overweight") return "Above the usual range";
  return "Well above the usual range";
}

/* ───────── Score ───────── */

export type HealthScore = {
  points: number | null;
  headline: string;
  sentence: string;
  updated: Date | null;
  inRange: boolean;
};

export function healthScoreFrom(readings: {
  glucose?: HealthMetric | null;
  bloodPressure?: HealthMetric | null;
  weight?: HealthMetric | null;
}): HealthScore {
  let points = 0;
  let logged = 0;
  let inRange = false;
  const { glucose, bloodPressure, weight } = readings;
  if (glucose) {
    logged += 1;
    const category = glucoseCategoryOf(glucose);
    if (category === "inTarget") {
      points += 40;
      inRange = true;
    } else if (category === "belowTarget" || category === "aboveTarget") {
      points += 22;
    } else if (category !== null) {
      points += 10;
    }
  }
  if (bloodPressure) {
    logged += 1;
    const category = bpCategoryOf(bloodPressure);
    if (category === "normal" || category === "elevated") {
      points += 40;
      inRange = true;
    } else if (category === "aboveTarget" || category === "low") {
      points += 22;
    } else if (category !== null) {
      points += 10;
    }
  }
  if (weight && (Number.parseFloat(weight.latest_value) || 0) > 0) {
    logged += 1;
    points += 20;
  }
  let updated: Date | null = null;
  for (const metric of [glucose, bloodPressure, weight]) {
    if (!metric) continue;
    const parsed = parseStamp(metric.last_updated);
    if (parsed && (!updated || parsed > updated)) updated = parsed;
  }
  if (logged === 0) {
    return {
      points: null,
      headline: "No score yet",
      sentence: "Log glucose, blood pressure, or weight and this score fills in from those readings.",
      updated: null,
      inRange: false,
    };
  }
  const headline = points >= 80 ? "Readings in range" : points >= 50 ? "On track" : "Needs a check";
  const sentence =
    points >= 80
      ? "Your latest readings sit in a comfortable range. Keep logging them so the picture stays current."
      : points >= 50
        ? "Some readings are in range and some need another look. Your care team can help you read them."
        : "A recent reading is outside the usual target. Log it again, and talk with your care team if it stays there.";
  return { points, headline, sentence, updated, inRange };
}

/**
 * W13 (BL-146): the app config merged from the member's programmes (GET /mobile/programme-config).
 * Pure helpers only, so they run under `node --test`. With no programme (or an older server) the
 * config is the default and Home looks exactly as before.
 */

export type ReadingType = "glucose" | "bp" | "weight";
export type HomeCard = "reading_prompts" | "glucose" | "bp" | "weight" | "today" | "medicines" | "visit" | "daily_question" | "meal_tips" | "learn";
export type Text = { en: string; rw?: string };

export type ReadingSchedule = {
  type: ReadingType;
  times_per_week: number;
  days: string[];
  time_of_day: string[];
  prompt: Text | null;
  programmes: string[];
};

export type ProgrammeConfig = {
  source: "default" | "programmes";
  programmes: Array<{ code: string; name: string; version: number; status: string }>;
  readings_schedule: ReadingSchedule[];
  daily_question: { id: string; text: Text; answers: Array<{ value: string; label: Text }> } | null;
  home_cards: HomeCard[];
  meal_tips: { enabled: boolean; tips: Text[] };
  charts: { metrics: ReadingType[]; default_range_days: number };
};

export const READING_TYPES: ReadingType[] = ["glucose", "bp", "weight"];
export const KNOWN_CARDS: HomeCard[] = ["reading_prompts", "glucose", "bp", "weight", "today", "medicines", "visit", "daily_question", "meal_tips", "learn"];
export const DEFAULT_HOME_CARDS: HomeCard[] = ["glucose", "bp", "weight", "today", "medicines", "visit", "learn"];
const WEEKDAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export const DEFAULT_CONFIG: ProgrammeConfig = {
  source: "default",
  programmes: [],
  readings_schedule: [],
  daily_question: null,
  home_cards: DEFAULT_HOME_CARDS,
  meal_tips: { enabled: false, tips: [] },
  charts: { metrics: [], default_range_days: 30 },
};

const obj = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

function text(v: unknown): Text | null {
  if (typeof v === "string" && v.trim()) return { en: v.trim() };
  const o = obj(v);
  const en = typeof o.en === "string" ? o.en.trim() : "";
  if (!en) return null;
  const rw = typeof o.rw === "string" && o.rw.trim() ? o.rw.trim() : undefined;
  return rw ? { en, rw } : { en };
}

/** The member's language, falling back to English. */
export function pick(t: Text | null | undefined, lang: string): string {
  if (!t) return "";
  return lang === "rw" && t.rw ? t.rw : t.en;
}

/** Defensive parse: unknown cards (from a newer server) are skipped, never shown as blanks. */
export function parseProgrammeConfig(raw: unknown): ProgrammeConfig {
  const o = obj(raw);
  if (o.source !== "programmes") {
    return { ...DEFAULT_CONFIG, programmes: arr(o.programmes).map(obj).map((p) => ({ code: String(p.code ?? ""), name: String(p.name ?? ""), version: Number(p.version ?? 1), status: String(p.status ?? "") })) };
  }
  const cards = arr(o.home_cards).filter((c): c is HomeCard => typeof c === "string" && (KNOWN_CARDS as string[]).includes(c));
  const readings: ReadingSchedule[] = [];
  for (const r of arr(o.readings_schedule).map(obj)) {
    if (!(READING_TYPES as unknown[]).includes(r.type)) continue;
    readings.push({
      type: r.type as ReadingType,
      times_per_week: Math.max(1, Math.min(28, Number(r.times_per_week) || 1)),
      days: arr(r.days).filter((d): d is string => typeof d === "string"),
      time_of_day: arr(r.time_of_day).filter((d): d is string => typeof d === "string"),
      prompt: text(r.prompt),
      programmes: arr(r.programmes).map(String),
    });
  }
  const q = obj(o.daily_question);
  const qText = text(q.text);
  const answers = arr(q.answers)
    .map(obj)
    .map((a) => ({ value: String(a.value ?? ""), label: text(a.label) }))
    .filter((a): a is { value: string; label: Text } => Boolean(a.value && a.label));
  const tips = obj(o.meal_tips);
  const charts = obj(o.charts);
  return {
    source: "programmes",
    programmes: arr(o.programmes).map(obj).map((p) => ({ code: String(p.code ?? ""), name: String(p.name ?? ""), version: Number(p.version ?? 1), status: String(p.status ?? "") })),
    readings_schedule: readings,
    daily_question: typeof q.id === "string" && qText && answers.length >= 2 ? { id: q.id, text: qText, answers } : null,
    home_cards: cards.length ? cards : DEFAULT_HOME_CARDS,
    meal_tips: { enabled: tips.enabled === true, tips: arr(tips.tips).map(text).filter((t): t is Text => Boolean(t)) },
    charts: { metrics: arr(charts.metrics).filter((m): m is ReadingType => (READING_TYPES as unknown[]).includes(m)), default_range_days: Number(charts.default_range_days) || 30 },
  };
}

/** Monday 00:00 local of the week holding `now`. */
function weekStart(now: Date): Date {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const back = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - back);
  return d;
}

const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export type ReadingPrompt = {
  type: ReadingType;
  /** Programme-written prompt, or null to use the app's default wording. */
  text: Text | null;
  timeOfDay: string[];
  doneThisWeek: number;
  perWeek: number;
  /** "today": a set day; "this_week": any day until the weekly count is met. */
  when: "today" | "this_week";
  due: boolean;
};

/**
 * What to ask for today. With set days we prompt on those days until a reading is logged that day;
 * without days we prompt every day until the weekly count is met (one per day at most).
 */
export function readingPrompts(config: ProgrammeConfig, readings: Array<{ type: string; at: Date | null }>, now: Date): ReadingPrompt[] {
  const start = weekStart(now);
  const today = WEEKDAY_KEYS[now.getDay()];
  return config.readings_schedule.map((s) => {
    const mine = readings.filter((r) => r.type === s.type && r.at && r.at >= start && r.at <= now);
    const doneThisWeek = mine.length;
    const doneToday = mine.some((r) => r.at && sameDay(r.at, now));
    const setDays = s.days.length > 0;
    const due = setDays ? s.days.includes(today) && !doneToday : doneThisWeek < s.times_per_week && !doneToday;
    return { type: s.type, text: s.prompt, timeOfDay: s.time_of_day.filter((t) => t !== "any"), doneThisWeek, perWeek: s.times_per_week, when: setDays ? "today" : "this_week", due };
  });
}

/** Same tip all day, a different one each day. */
export function tipOfTheDay(tips: Text[], now: Date): Text | null {
  if (!tips.length) return null;
  const day = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86_400_000);
  return tips[day % tips.length];
}

/** Reading cards in config order: pairs side by side, an odd last one full width (the old Home layout). */
export function metricCardLayout(cards: HomeCard[]): Array<{ type: ReadingType; wide: boolean }> {
  const types = cards.filter((c): c is ReadingType => (READING_TYPES as string[]).includes(c));
  return types.map((type, i) => ({ type, wide: i === types.length - 1 && types.length % 2 === 1 }));
}

/**
 * Home sections in order. The three reading cards are drawn as one "This week" block where the
 * first of them appears.
 */
export function homeSections(cards: HomeCard[]): Array<HomeCard | "metrics"> {
  const out: Array<HomeCard | "metrics"> = [];
  for (const c of cards) {
    if ((READING_TYPES as string[]).includes(c)) {
      if (!out.includes("metrics")) out.push("metrics");
    } else if (!out.includes(c)) out.push(c);
  }
  return out;
}

export function dailyQuestionKey(id: string, now: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `vitaway.plus.daily-question.${id}.${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

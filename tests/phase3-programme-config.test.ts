// Phase 3 W13: programme settings drive Home (cards, reading prompts). Run: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_CONFIG,
  DEFAULT_HOME_CARDS,
  homeSections,
  metricCardLayout,
  parseProgrammeConfig,
  pick,
  readingPrompts,
  tipOfTheDay,
  dailyQuestionKey,
} from "../lib/plus/programme-config.ts";
import en from "../lib/plus/i18n/en.json" with { type: "json" };
import rw from "../lib/plus/i18n/rw.json" with { type: "json" };

const server = {
  source: "programmes",
  programmes: [{ code: "healthy_weight", name: "Healthy Weight", version: 3, status: "enrolled" }],
  readings_schedule: [
    { type: "weight", times_per_week: 1, days: [], time_of_day: ["morning"], prompt: { en: "Weigh yourself once this week", rw: "Ipime ibiro" }, programmes: ["healthy_weight"] },
    { type: "glucose", times_per_week: 7, days: ["sat"], time_of_day: ["any"], prompt: null, programmes: ["t2"] },
    { type: "pulse", times_per_week: 1, days: [], time_of_day: [], prompt: null, programmes: [] },
  ],
  daily_question: { id: "veg", text: { en: "Veg?" }, answers: [{ value: "yes", label: { en: "Yes" } }, { value: "no", label: { en: "No" } }] },
  home_cards: ["reading_prompts", "weight", "daily_question", "hologram", "meal_tips", "today"],
  meal_tips: { enabled: true, tips: [{ en: "Water" }, { en: "Beans", rw: "Ibishyimbo" }] },
  charts: { metrics: ["weight"], default_range_days: 90 },
};

test("no programme or an older server: the old Home layout", () => {
  assert.deepEqual(parseProgrammeConfig(undefined).home_cards, DEFAULT_HOME_CARDS);
  assert.deepEqual(parseProgrammeConfig({ source: "default", programmes: [{ code: "bp_pilot", name: "BP" }] }).programmes[0].code, "bp_pilot");
  assert.deepEqual(homeSections(DEFAULT_CONFIG.home_cards), ["metrics", "today", "medicines", "visit", "learn"]);
  assert.deepEqual(metricCardLayout(DEFAULT_HOME_CARDS), [
    { type: "glucose", wide: false },
    { type: "bp", wide: false },
    { type: "weight", wide: true },
  ]);
});

test("programme config: unknown cards and reading types are skipped", () => {
  const c = parseProgrammeConfig(server);
  assert.equal(c.source, "programmes");
  assert.deepEqual(c.home_cards, ["reading_prompts", "weight", "daily_question", "meal_tips", "today"]);
  assert.deepEqual(c.readings_schedule.map((r) => r.type), ["weight", "glucose"]);
  assert.deepEqual(homeSections(c.home_cards), ["reading_prompts", "metrics", "daily_question", "meal_tips", "today"]);
  assert.deepEqual(metricCardLayout(c.home_cards), [{ type: "weight", wide: true }]);
  assert.equal(c.daily_question?.id, "veg");
});

test("reading prompts: weekly count on any day, or set days until logged that day", () => {
  const c = parseProgrammeConfig(server);
  const sat = new Date(2026, 10, 14, 9, 0); // Saturday
  let p = readingPrompts(c, [], sat);
  assert.deepEqual(p.map((x) => [x.type, x.due, x.when]), [["weight", true, "this_week"], ["glucose", true, "today"]]);
  assert.deepEqual(p[0].timeOfDay, ["morning"]);
  assert.deepEqual(p[1].timeOfDay, []);
  // Weighed on Tuesday this week: the weekly weigh-in is done. Glucose logged this morning: done today.
  p = readingPrompts(c, [{ type: "weight", at: new Date(2026, 10, 10, 8) }, { type: "glucose", at: new Date(2026, 10, 14, 7) }], sat);
  assert.deepEqual(p.map((x) => x.due), [false, false]);
  assert.equal(p[0].doneThisWeek, 1);
  // Last week's weigh-in does not count (weeks start on Monday); Sunday is not a glucose day.
  const sun = new Date(2026, 10, 15, 9);
  p = readingPrompts(c, [{ type: "weight", at: new Date(2026, 10, 8, 8) }], sun);
  assert.deepEqual(p.map((x) => x.due), [true, false]);
  const mon = new Date(2026, 10, 16, 9);
  p = readingPrompts(c, [{ type: "weight", at: new Date(2026, 10, 15, 8) }], mon);
  assert.equal(p[0].due, true);
});

test("language, tip of the day and the daily question key", () => {
  assert.equal(pick({ en: "Beans", rw: "Ibishyimbo" }, "rw"), "Ibishyimbo");
  assert.equal(pick({ en: "Water" }, "rw"), "Water");
  const tips = parseProgrammeConfig(server).meal_tips.tips;
  const a = tipOfTheDay(tips, new Date(2026, 10, 14, 8));
  assert.equal(a, tipOfTheDay(tips, new Date(2026, 10, 14, 22)));
  assert.notEqual(a, tipOfTheDay(tips, new Date(2026, 10, 15, 8)));
  assert.equal(tipOfTheDay([], new Date()), null);
  assert.equal(dailyQuestionKey("veg", new Date(2026, 0, 5)), "vitaway.plus.daily-question.veg.2026-01-05");
});

test("every W13 string exists in English and Kinyarwanda", () => {
  const keys = ["home_readings_due", "readings_all_done", "reading_prompt_glucose", "reading_prompt_bp", "reading_prompt_weight", "reading_due_today", "reading_due_week", "tod_morning", "tod_before_meal", "tod_after_meal", "tod_evening", "tod_bedtime", "home_daily_question", "daily_question_thanks", "home_meal_tip"];
  for (const k of keys) {
    assert.ok((en as Record<string, string>)[k], `en ${k}`);
    assert.ok((rw as Record<string, string>)[k], `rw ${k}`);
  }
  assert.match((en as Record<string, string>).reading_due_week, /\{done\}.*\{total\}/);
});

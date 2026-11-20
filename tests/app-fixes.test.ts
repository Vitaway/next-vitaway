// Tracker v9.0 "Build now" app fixes. Run: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import { bandFor, bmiViewFor } from "../lib/plus/bmi.ts";
import { bpFieldComplete, bpKeypadAppend } from "../lib/plus/bp-keypad.ts";
import { badgesRemaining, fetchBadgeBoard, parseBadgeBoard } from "../lib/plus/badge-board.ts";
import { reminderTapPath } from "../lib/plus/reminder-tap.ts";
import { planProfileFields, planReminder, todayIso } from "../lib/plus/onboarding-plan.ts";

test("BMI: adult gets a value and a category", () => {
  const v = bmiViewFor(70, 175, 30);
  assert.ok(Math.abs((v.value ?? 0) - 22.86) < 0.01);
  assert.equal(v.band, "healthy");
});

test("BMI: under 18 never gets an adult category or number (BL-013)", () => {
  const child = bmiViewFor(72, 150, 12);
  assert.equal(child.band, null);
  assert.equal(child.value, null);
  assert.equal(child.noteKey, "bmi_under_18");
  assert.equal(bmiViewFor(60, 170, 17).band, null);
  assert.equal(bmiViewFor(60, 170, 18).band, "healthy");
});

test("BMI: unknown age, height or weight hold back", () => {
  assert.equal(bmiViewFor(70, 175, 0).noteKey, "bmi_need_age");
  assert.equal(bmiViewFor(70, 0, 30).noteKey, "bmi_need_height");
  assert.equal(bmiViewFor(null, 175, 30).noteKey, "bmi_no_weight");
  assert.equal(bandFor(18.4), "underweight");
  assert.equal(bandFor(25), "overweight");
  assert.equal(bandFor(30), "obese");
});

const type = (keys: string, max: number) => [...keys].reduce((cur, k) => bpKeypadAppend(cur, k, max), "");

test("BP keypad: no leading zero, nothing above max, 3 digits at most (BL-003)", () => {
  assert.equal(bpKeypadAppend("", "0", 300), "");
  assert.equal(type("958", 300), "95"); // the old bug gave "958"
  assert.equal(type("072", 200), "72"); // the old bug gave "072"
  assert.equal(type("1234", 300), "123");
  assert.equal(type("25", 220), "25");
  assert.equal(bpKeypadAppend("25", "0", 220), "25"); // 250 > pulse max
  assert.equal(bpKeypadAppend("12", "x", 300), "12");
});

test("BP keypad: 2-digit readings move on, 12 waits for 120", () => {
  assert.equal(bpFieldComplete("95", 300), true);
  assert.equal(bpFieldComplete("80", 200), true);
  assert.equal(bpFieldComplete("72", 220), true);
  assert.equal(bpFieldComplete("12", 300), false);
  assert.equal(bpFieldComplete("120", 300), true);
  assert.equal(bpFieldComplete("", 300), false);
});

test("Badges: new endpoint lists earned and locked with progress", async () => {
  const board = parseBadgeBoard({
    earned_count: 1,
    total: 3,
    badges: [
      { code: "log_7", name: "Week", earned: false, progress: { current: 2, target: 7 } },
      { code: "first_log", name: "First", earned: true },
      { code: "lesson_5", name: "Lessons", earned: false, progress: { current: 4, target: 5 } },
    ],
  });
  assert.deepEqual(board.badges.map((b) => b.code), ["first_log", "lesson_5", "log_7"]);
  assert.equal(board.earnedCount, 1);
  assert.equal(badgesRemaining(board), 2);
  assert.equal(board.legacy, false);
});

test("Badges: falls back to /badges/ on 404 only", async () => {
  const calls: string[] = [];
  const board = await fetchBadgeBoard(async (path) => {
    calls.push(path);
    if (path.includes("/mobile/points/badges")) throw Object.assign(new Error("nf"), { status: 404 });
    return { badges: [{ id: 1, name: "Article" }], badge_number: 4 };
  });
  assert.deepEqual(calls, ["/api/v1/mobile/points/badges", "/badges/"]);
  assert.equal(board.legacy, true);
  assert.equal(board.badges[0].earned, true);
  await assert.rejects(
    fetchBadgeBoard(async () => {
      throw Object.assign(new Error("down"), { status: 500 });
    }),
  );
});

test("Reminder taps: medicine opens Pillbox (BL-122)", () => {
  assert.equal(reminderTapPath("med", "a"), "/medications");
  assert.equal(reminderTapPath("bp", "a"), "/log/bp");
  assert.equal(reminderTapPath("glucose", "a"), "/log/glucose");
  assert.equal(reminderTapPath("plan", "a"), "/home");
  assert.equal(reminderTapPath("other", "a b"), "/reminders/a%20b");
});

test("Onboarding plan fields match the backend contract (BL-151)", () => {
  const now = new Date(2026, 10, 13, 9, 0);
  const plan = { dailyGoal: 5, reminder: { hour: 7, minute: 5 }, streakGoal: 14 };
  assert.deepEqual(planProfileFields(plan, now), { daily_goal_minutes: 5, reminder_time: "07:05", streak_goal_days: 14, plan_started_on: "2026-11-13" });
  assert.equal(todayIso(now), "2026-11-13");
  const r = planReminder("Daily check-in", plan, now);
  assert.deepEqual(r.times, ["7:5"]);
  assert.deepEqual(r.repeatDays, ["Daily"]);
});

// Phase 3 W16 (BL-082, BL-087/096): member Rewards screen. Run: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { byDay, levelProgress, normalizeHistory, normalizeSummary, normalizeWays, signed, worthRwf } from "../lib/plus/rewards.ts";

const summary = {
  balance: 140, lifetime_earned: 260,
  level: { name: "Bronze", number: 2, min_points: 200, next_level: "Silver", next_at: 600, points_to_next: 340 },
  today: { earned: 10, logging_earned: 10, daily_cap: 30, cap_remaining: 20, cap_reached: false, message: null },
  streak: { current_days: 4, longest_days: 9, active_today: true },
  value_per_point_rwf: 2, eligible: true, ineligible_reason: null, weight_points: false, proposal: true, settings_version: 3,
};

test("summary reads balance, level progress, worth and the weight flag", () => {
  const s = normalizeSummary(summary);
  assert.equal(s.balance, 140);
  assert.equal(levelProgress(s), 15); // (260-200)/(600-200)
  assert.equal(worthRwf(s), 280);
  assert.equal(s.weightPoints, false);
  assert.equal(s.proposal, true);
  assert.equal(s.streak.current, 4);
});

test("top level shows full progress; older servers count as proposal", () => {
  const s = normalizeSummary({ ...summary, level: { name: "Platinum", number: 5, min_points: 3000, next_level: null, next_at: null, points_to_next: 0 }, proposal: undefined });
  assert.equal(levelProgress(s), 100);
  assert.equal(s.proposal, true);
  assert.equal(normalizeSummary({ ...summary, proposal: false }).proposal, false);
});

test("ways to earn keep the server's values and notes", () => {
  const w = normalizeWays({ proposal: false, daily_cap: 30, actions: [{ action: "log_reading", label: "Log a reading", description: "d", points: 5, counts_toward_daily_cap: true, note: "Weight readings do not earn points in your plan." }], streak_milestones: [{ days: 7, points: 10 }], levels: [{ name: "Starter", min_points: 0 }] });
  assert.equal(w.proposal, false);
  assert.deepEqual(w.actions[0], { action: "log_reading", label: "Log a reading", description: "d", points: 5, countsTowardCap: true, note: "Weight readings do not earn points in your plan." });
  assert.deepEqual(w.streakMilestones, [{ days: 7, points: 10 }]);
});

test("history groups by day and marks corrections", () => {
  const h = normalizeHistory({ results: [
    { id: 3, type: "adjustment", action: null, label: "Correction", points: -10, capped: false, reason: "Duplicate meal", day: "2026-11-14", event_at: "2026-11-14T10:00:00Z" },
    { id: 2, type: "award", action: "log_meal", label: "Log a meal", points: 5, capped: false, day: "2026-11-14", event_at: "2026-11-14T08:00:00Z" },
    { id: 1, type: "award", action: "daily_check_in", label: "Daily check-in", points: 0, capped: true, day: "2026-11-13", event_at: "2026-11-13T08:00:00Z" },
  ], next_before: "1" });
  assert.equal(h.nextBefore, "1");
  assert.equal(h.entries[0].correction, true);
  assert.deepEqual(byDay(h.entries).map((g) => [g.day, g.entries.length]), [["2026-11-14", 2], ["2026-11-13", 1]]);
  assert.deepEqual([signed(5), signed(-10), signed(0)], ["+5", "-10", "0"]);
});

test("every rewards string exists in English and Kinyarwanda", () => {
  const en = JSON.parse(readFileSync("lib/plus/i18n/en.json", "utf8"));
  const rw = JSON.parse(readFileSync("lib/plus/i18n/rw.json", "utf8"));
  const src = readFileSync("app/components/plus/rewards/screens.tsx", "utf8");
  const keys = [...new Set([...src.matchAll(/t\("(rewards_[a-z_]+)"/g)].map((m) => m[1]))];
  assert.ok(keys.length > 15);
  for (const k of [...keys, "rewards_menu_body", "rewards_action_log_meal"]) {
    assert.ok(en[k], `en ${k}`);
    assert.ok(rw[k], `rw ${k}`);
  }
  assert.match(en.rewards_proposal, /pending MD sign-off/);
});

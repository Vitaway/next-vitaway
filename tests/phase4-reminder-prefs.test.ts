import { test } from "node:test";
import assert from "node:assert/strict";
import { isGranted, needsRenewal, parseSettings, shortDue, validTime } from "../lib/plus/reminder-prefs-logic.ts";

test("W27 parses settings and clamps the daily cap to 3", () => {
  const s = parseSettings({ notice: { version: "v2" }, preferences: { quiet_start: "21:00:00", daily_cap: 9 }, purposes: ["meal_photos"], consents: [{ purpose: "meal_photos", channel: "push", status: "granted", notice_version: "v1" }], recent: [{ id: "4", rule_key: "x", rule_version: 1, status: "suppressed", suppression_reason: "consent_withdrawn", reason_label: "Consent withdrawn" }] });
  assert.equal(s.preferences.daily_cap, 3);
  assert.equal(s.preferences.quiet_start, "21:00");
  assert.equal(s.recent[0].id, 4);
  assert.equal(isGranted(s.consents, "meal_photos", "push"), true);
  assert.equal(isGranted(s.consents, "meal_photos", "sms"), false);
  assert.equal(needsRenewal(s.consents, "v2"), true);
  assert.equal(needsRenewal(s.consents, "v1"), false);
});

test("W27 time and due helpers", () => {
  assert.equal(validTime("07:00"), true);
  assert.equal(validTime("24:00"), false);
  assert.equal(shortDue("2026-11-15 13:00:00"), "15 Nov 13:00");
});

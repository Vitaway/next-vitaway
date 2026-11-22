import { test } from "node:test";
import assert from "node:assert/strict";
import { joinTimes, medicineReminderSummary } from "../lib/plus/medication.ts";

test("a saved medicine reminds at its dose times by itself", () => {
  assert.deepEqual(medicineReminderSummary({ times: ["20:00", "8:00"], reminders_enabled: true }), { enabled: true, times: ["08:00", "20:00"] });
  assert.deepEqual(medicineReminderSummary({ times: [], frequency: 2 }), { enabled: true, times: ["08:00", "20:00"] });
  assert.deepEqual(medicineReminderSummary({ times: ["08:00"], reminders_enabled: false }), { enabled: false, times: [] });
});

test("the server summary wins when it is sent", () => {
  assert.deepEqual(medicineReminderSummary({ times: ["08:00"], reminders: { enabled: true, times: ["09:00"] } }), { enabled: true, times: ["09:00"] });
  assert.deepEqual(medicineReminderSummary({ times: ["08:00"], reminders: { enabled: false, times: [] } }), { enabled: false, times: [] });
});

test("times read naturally in the confirmation", () => {
  assert.equal(joinTimes(["08:00"], "and"), "08:00");
  assert.equal(joinTimes(["08:00", "20:00"], "and"), "08:00 and 20:00");
  assert.equal(joinTimes(["08:00", "14:00", "20:00"], "na"), "08:00, 14:00 na 20:00");
});

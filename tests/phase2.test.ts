// Phase 2 (W6, W7, W8). Run: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import { NO_APPROVED_RULES, emergencyView, parseClinicalConfig } from "../lib/plus/clinical-rules.ts";
import { appointmentCardText } from "../lib/plus/appointment-text.ts";
import { duplicateOf } from "../lib/plus/medicine-duplicate.ts";

test("W6: 112 and 114 are listed after the 912 emergency number", () => {
  const v = emergencyView(NO_APPROVED_RULES, "en");
  assert.deepEqual(v.numbers.map((n) => n.dial), ["912"]);
  assert.deepEqual(v.helplines.map((n) => n.dial), ["112", "114"]);
  assert.match(emergencyView(NO_APPROVED_RULES, "rw").helplines[0].label, /Polisi/);
});

test("W6: a helpline the approved rule already lists is not shown twice", () => {
  const T = (en: string) => ({ en, rw: en });
  const c = parseClinicalConfig({ switched_off: false, rules: { emergency_instruction: { id: 1, version: 1, ca_ref: "CA-01", approved_at: "2026-11-13T08:00:00Z", content: { instruction: T("Call"), numbers: [{ dial: "912", label: T("A") }, { dial: "114", label: T("B") }] } } } });
  assert.deepEqual(emergencyView(c, "en").helplines.map((n) => n.dial), ["112"]);
});

test("W8: appointment card text, placeholders hidden", () => {
  const start = new Date(2026, 10, 10, 10, 0);
  assert.deepEqual(appointmentCardText({ start, firstName: "Grace", speciality: { id: null, name: "nutritionist" }, clinic: true, lang: "en" }), { title: "Tue 10 Nov · 10:00", subtitle: "Grace, nutritionist · clinic" });
  assert.equal(appointmentCardText({ start, firstName: "Platform", speciality: null, clinic: false, lang: "en" }).subtitle, "Your care team · call or video");
  assert.equal(appointmentCardText({ start, firstName: "Grace", speciality: "registered_nurse", clinic: true, lang: "rw" }).subtitle, "Grace, umuforomo · ku ivuriro");
});

test("W7: duplicate_of answer", () => {
  assert.deepEqual(duplicateOf({ duplicate_of: { id: 2, name: "Metformin 500mg" } }), { id: 2, name: "Metformin 500mg" });
  assert.equal(duplicateOf({ duplicate_of: null }), null);
  assert.equal(duplicateOf("x"), null);
});

// Phase 3 W7 staff-confirm: the medicine serializer and the "Care team will check" chip rule.
import { needsCareTeamCheck, normalizeMedication } from "../lib/plus/medication.ts";
import en from "../lib/plus/i18n/en.json" with { type: "json" };
import rw from "../lib/plus/i18n/rw.json" with { type: "json" };

test("W7 staff-confirm: medicines carry added_by / staff_confirmed and show the chip until confirmed", () => {
  const waiting = normalizeMedication({ id: 3, name: "Metformin", times: ["08:00"], added_by: "member", staff_confirmed: false, staff_confirmed_at: null });
  assert.equal(waiting.added_by, "member");
  assert.equal(waiting.staff_confirmed, false);
  assert.equal(needsCareTeamCheck(waiting), true);
  const checked = normalizeMedication({ id: 4, name: "Amlodipine", times: ["08:00"], added_by: "member", staff_confirmed: true, staff_confirmed_at: "2026-11-14T08:13:04.146Z" });
  assert.equal(checked.staff_confirmed_at, "2026-11-14T08:13:04.146Z");
  assert.equal(needsCareTeamCheck(checked), false);
  assert.equal(needsCareTeamCheck(normalizeMedication({ id: 5, name: "X", added_by: "staff", staff_confirmed: false })), false);
});

test("W7 staff-confirm: an older server without the fields shows no chip", () => {
  assert.equal(needsCareTeamCheck({ id: 1, name: "Old" }), false);
  assert.equal(normalizeMedication({ id: 1, name: "Old" }).staff_confirmed, null);
  assert.equal(needsCareTeamCheck(normalizeMedication({ id: 1, name: "Old" })), false);
});

test("W7 staff-confirm: chip strings exist in en and rw", () => {
  assert.equal((en as Record<string, string>).medicine_care_team_check, "Care team will check");
  assert.ok((rw as Record<string, string>).medicine_care_team_check);
});

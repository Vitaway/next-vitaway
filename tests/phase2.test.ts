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

// Tracker v9.0 safety items, built but switched off. Run: node --test tests/
// Bands below are TEST-ONLY examples, not clinical values.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  EMERGENCY_FALLBACK,
  NO_APPROVED_RULES,
  bpStatus,
  emergencyView,
  gatedHealthScore,
  glucoseStatus,
  healthScoreAllowed,
  lowGlucoseWarning,
  parseClinicalConfig,
  ruleGlucoseContext,
} from "../lib/plus/clinical-rules.ts";

const T = (en: string) => ({ en, rw: `${en} (rw)` });
const rule = (content: unknown, version = 1, ca = "CA-0x") => ({ id: version, version, ca_ref: ca, approved_at: "2026-11-13T08:00:00Z", content });
const bp = rule({ unit: "mmHg", repeat_rule: null, bands: [
  { id: "test_high", level: "clinical_review", tone: "bad", chip: T("Test high"), message: T("Test high message"), when: { any: [{ field: "systolic", op: "gte", value: 150 }, { field: "diastolic", op: "gte", value: 100 }] } },
  { id: "test_ok", level: "routine", tone: "ok", chip: T("Test ok"), message: T("Test ok message"), when: { all: [{ field: "systolic", op: "lt", value: 150 }] } },
] }, 2, "CA-03");
const glucose = rule({ unit: "mg/dL", low_warning: { below_mg_dl: 60, title: T("Test low title"), message: T("Test low message") }, bands: [
  { id: "test_fasting_high", level: "clinical_review", tone: "warn", chip: T("Test fasting high"), message: T("m"), when: { all: [{ field: "context", op: "eq", value: "fasting" }, { field: "mg_dl", op: "gte", value: 150 }] } },
  { id: "test_any_ok", level: "routine", tone: "ok", chip: T("Test ok"), message: T("m"), when: { all: [{ field: "mg_dl", op: "gte", value: 60 }] } },
] }, 1, "CA-04");
const emergency = rule({ instruction: T("Test approved instruction"), numbers: [{ dial: "912", label: T("Ambulance") }, { dial: "114", label: T("Test line") }], nearest_service: T("Nearest test") }, 1, "CA-01");
const flags = rule({ intro: T("Test intro"), symptoms: [T("Symptom A"), T("Symptom B")], action: null }, 1, "CA-02");
const composite = rule({ show_score: true, method: T("Test method") }, 1, "CA-15");

const body = (rules: Record<string, unknown>, switched_off = false) => ({ generated_at: "x", switched_off, rules: { emergency_instruction: null, red_flags: null, bp_ranges: null, glucose_ranges: null, triage_rules: null, composite_score: null, ...rules } });

test("no approved rules: nothing is interpreted anywhere", () => {
  const c = parseClinicalConfig(body({}));
  for (const [s, d] of [[200, 120], [90, 60], [120, 80], [300, 200]]) assert.equal(bpStatus(c, s, d, "en"), null);
  for (const mg of [20, 40, 55, 69, 100, 250, 600]) {
    for (const ctx of ["fasting", "beforeMeal", "afterMeal", "bedtime", "other"]) assert.equal(glucoseStatus(c, mg, ctx, "en"), null);
    assert.equal(lowGlucoseWarning(c, mg, "en"), null, `no low warning at ${mg}`);
  }
  assert.equal(healthScoreAllowed(c), false);
  assert.equal(gatedHealthScore(c, { weightLogged: true }), null);
});

test("no approved rules: emergency screen shows only the 912 fallback, no red-flag list", () => {
  const en = emergencyView(NO_APPROVED_RULES, "en");
  assert.equal(en.approved, false);
  assert.equal(en.instruction, EMERGENCY_FALLBACK.en);
  assert.deepEqual(en.numbers.map((n) => n.dial), ["912"]);
  assert.equal(en.redFlags, null);
  assert.equal(en.source, null);
  const rw = emergencyView(NO_APPROVED_RULES, "rw");
  assert.equal(rw.instruction, EMERGENCY_FALLBACK.rw);
  assert.match(rw.instruction, /912/);
});

test("garbage, errors and the kill switch all mean nothing approved", () => {
  for (const b of [null, undefined, "x", 42, [], {}, { rules: [] }, { rules: { bp_ranges: { version: 1, content: { bands: [] } } } }]) {
    const c = parseClinicalConfig(b);
    assert.equal(c.rules.bp_ranges, null);
    assert.equal(bpStatus(c, 200, 120, "en"), null);
  }
  const off = parseClinicalConfig(body({ bp_ranges: bp, glucose_ranges: glucose, emergency_instruction: emergency }, true));
  assert.equal(bpStatus(off, 200, 120, "en"), null);
  assert.equal(emergencyView(off, "en").approved, false);
});

test("approved CA-03 rule: BP uses only the approved bands, with the rule version", () => {
  const c = parseClinicalConfig(body({ bp_ranges: bp }));
  assert.deepEqual(bpStatus(c, 160, 90, "en"), { chip: "Test high", label: "Test high message", tone: "bad", level: "clinical_review", rule: "bp_ranges v2" });
  assert.equal(bpStatus(c, 120, 80, "rw")?.chip, "Test ok (rw)");
  assert.equal(glucoseStatus(c, 40, "fasting", "en"), null, "BP approval does not unlock glucose");
});

test("approved CA-04 rule: glucose bands by context and the low warning below the approved threshold only", () => {
  const c = parseClinicalConfig(body({ glucose_ranges: glucose }));
  assert.equal(glucoseStatus(c, 160, "fasting", "en")?.chip, "Test fasting high");
  assert.equal(glucoseStatus(c, 160, "afterMeal", "en")?.chip, "Test ok");
  assert.equal(lowGlucoseWarning(c, 59, "en")?.title, "Test low title");
  assert.equal(lowGlucoseWarning(c, 60, "en"), null);
  assert.equal(lowGlucoseWarning(c, 65, "en"), null, "the old hard-coded 70 is gone");
  assert.equal(ruleGlucoseContext("beforeMeal"), "before_meal");
});

test("score only with CA-15 plus both range rules", () => {
  assert.equal(healthScoreAllowed(parseClinicalConfig(body({ composite_score: composite }))), false);
  assert.equal(healthScoreAllowed(parseClinicalConfig(body({ composite_score: composite, bp_ranges: bp }))), false);
  const c = parseClinicalConfig(body({ composite_score: composite, bp_ranges: bp, glucose_ranges: glucose }));
  assert.equal(healthScoreAllowed(c), true);
  assert.equal(gatedHealthScore(c, { bp: bpStatus(c, 120, 80, "en"), glucose: glucoseStatus(c, 100, "other", "en"), weightLogged: true }), 100);
});

test("approved CA-01/CA-02: emergency screen uses approved text, numbers and red flags", () => {
  const v = emergencyView(parseClinicalConfig(body({ emergency_instruction: emergency, red_flags: flags })), "rw");
  assert.equal(v.approved, true);
  assert.equal(v.instruction, "Test approved instruction (rw)");
  assert.deepEqual(v.numbers.map((n) => n.dial), ["912", "114"]);
  assert.deepEqual(v.redFlags?.symptoms, ["Symptom A (rw)", "Symptom B (rw)"]);
  assert.equal(v.source, "emergency_instruction v1 (CA-01), red_flags v1 (CA-02)");
});

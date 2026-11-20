// F04–F06: five safety questions in the join flow. Run: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  EMPTY_SAFETY,
  canPay,
  localSafetyOutcome,
  normalizeEnrolment,
  normalizeProgramme,
  safetyComplete,
  safetyNotes,
  safetyPayload,
  safetyQuestions,
  waitingForLead,
} from "../lib/plus/programmes.ts";

const CLEAR = { pregnant: "no", under18: "no", eatingDisorder: "no", kidneyDisease: "no", insulin: "no" } as const;

test("all five safety questions are always asked, including insulin", () => {
  assert.deepEqual(safetyQuestions().map((q) => q.field), ["pregnant", "under18", "eatingDisorder", "kidneyDisease", "insulin"]);
  assert.deepEqual(safetyQuestions(false).map((q) => q.field), ["pregnant", "under18", "eatingDisorder", "kidneyDisease", "insulin"]);
  assert.equal(normalizeProgramme({ code: "hw", pathway: "healthy_weight", asks_insulin: false }).asksInsulin, true);
});

test("continue is allowed only when every question has an answer", () => {
  assert.equal(safetyComplete(EMPTY_SAFETY), false);
  assert.equal(safetyComplete({ ...CLEAR, insulin: "" }), false);
  assert.equal(safetyComplete({ ...CLEAR }), true);
});

test("payload always sends the five booleans", () => {
  assert.deepEqual(safetyPayload({ ...CLEAR, pregnant: "yes", insulin: "yes" }), {
    pregnant: true,
    under_18: false,
    eating_disorder_history: false,
    kidney_disease: false,
    uses_insulin: true,
  });
});

test("stop answers and insulin produce the right notes; payment is blocked", () => {
  assert.equal(localSafetyOutcome(CLEAR), "ok");
  assert.equal(localSafetyOutcome({ ...CLEAR, pregnant: "yes" }), "stopped");
  assert.equal(localSafetyOutcome({ ...CLEAR, insulin: "yes" }), "needs_approval");
  assert.deepEqual(safetyNotes({ ...CLEAR, kidneyDisease: "yes" }), ["safety_referral_kidney"]);
  assert.deepEqual(safetyNotes({ ...CLEAR, insulin: "yes" }), ["safety_note_insulin"]);
  const stopped = normalizeEnrolment({
    id: 1,
    status: "trial",
    payment_state: "none",
    eligibility: { answered: true, outcome: "stopped", payment_allowed: false, flags: ["pregnant"], message: "not the right fit" },
  });
  assert.equal(canPay(stopped), false);
  const insulin = normalizeEnrolment({
    id: 2,
    status: "trial",
    payment_state: "none",
    eligibility: { answered: true, outcome: "needs_approval", payment_allowed: false, lead_approval_needed: true },
  });
  assert.equal(canPay(insulin), false);
  assert.equal(waitingForLead(insulin), true);
  const clear = normalizeEnrolment({
    id: 3,
    status: "trial",
    payment_state: "none",
    eligibility: { answered: true, outcome: "ok", payment_allowed: true },
  });
  assert.equal(canPay(clear), true);
});

test("every F04 safety string exists in English and Kinyarwanda", () => {
  const en = JSON.parse(readFileSync("lib/plus/i18n/en.json", "utf8"));
  const rw = JSON.parse(readFileSync("lib/plus/i18n/rw.json", "utf8"));
  const keys = [
    ...safetyQuestions().map((q) => q.key),
    "safety_title",
    "safety_intro",
    "safety_yes",
    "safety_no",
    "safety_continue",
    "safety_continue_referral",
    "safety_referral_pregnant",
    "safety_referral_under_18",
    "safety_referral_eating_disorder",
    "safety_referral_kidney",
    "safety_note_insulin",
    "safety_note_pending",
    "care_step_lead",
    "stage_body_lead_review",
  ];
  for (const k of keys) {
    assert.ok(typeof en[k] === "string" && en[k].length > 0, `en ${k}`);
    assert.ok(typeof rw[k] === "string" && rw[k].length > 0, `rw ${k}`);
  }
});

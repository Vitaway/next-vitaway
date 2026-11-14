// Phase 3 W15 (BL-147): safety questions in the join flow. Run: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  EMPTY_SAFETY,
  normalizeEnrolment,
  normalizeProgramme,
  safetyComplete,
  safetyNotes,
  safetyPayload,
  safetyQuestions,
  waitingForDoctor,
} from "../lib/plus/programmes.ts";

test("insulin is asked only where the programme asks it (diabetes)", () => {
  assert.deepEqual(safetyQuestions(false).map((q) => q.field), ["pregnant", "eatingDisorder"]);
  assert.deepEqual(safetyQuestions(true).map((q) => q.field), ["pregnant", "eatingDisorder", "insulin"]);
  assert.equal(normalizeProgramme({ code: "t2", pathway: "diabetes" }).asksInsulin, true);
  assert.equal(normalizeProgramme({ code: "hw", pathway: "healthy_weight", asks_insulin: false }).asksInsulin, false);
});

test("continue is allowed only when every shown question has an answer", () => {
  assert.equal(safetyComplete(EMPTY_SAFETY, false), false);
  assert.equal(safetyComplete({ pregnant: "no", eatingDisorder: "no", insulin: "" }, false), true);
  assert.equal(safetyComplete({ pregnant: "no", eatingDisorder: "no", insulin: "" }, true), false);
  assert.equal(safetyComplete({ pregnant: "no", eatingDisorder: "yes", insulin: "no" }, true), true);
});

test("payload sends booleans and leaves insulin out where it is not asked", () => {
  assert.deepEqual(safetyPayload({ pregnant: "yes", eatingDisorder: "no", insulin: "yes" }, false), { pregnant: true, eating_disorder_history: false });
  assert.deepEqual(safetyPayload({ pregnant: "no", eatingDisorder: "no", insulin: "yes" }, true), { pregnant: false, eating_disorder_history: false, uses_insulin: true });
});

test("notes explain no weight points and the doctor check", () => {
  assert.deepEqual(safetyNotes({ pregnant: "no", eatingDisorder: "no", insulin: "no" }, true), []);
  assert.deepEqual(safetyNotes({ pregnant: "yes", eatingDisorder: "no", insulin: "" }, false), ["safety_note_no_weight_points"]);
  assert.deepEqual(safetyNotes({ pregnant: "no", eatingDisorder: "yes", insulin: "yes" }, true), ["safety_note_no_weight_points", "safety_note_doctor"]);
  assert.deepEqual(safetyNotes({ pregnant: "no", eatingDisorder: "no", insulin: "yes" }, false), []);
});

test("enrolment care block carries doctor wait and safety flag", () => {
  const e = normalizeEnrolment({ id: 1, status: "enrolled", care: { waiting_for: ["doctor_approval"], safety_questions_answered: true } });
  assert.deepEqual(e.care.waitingFor, ["doctor_approval"]);
  assert.equal(e.care.safetyAnswered, true);
});

test("every W15 string exists in English and Kinyarwanda", () => {
  const en = JSON.parse(readFileSync("lib/plus/i18n/en.json", "utf8"));
  const rw = JSON.parse(readFileSync("lib/plus/i18n/rw.json", "utf8"));
  const keys = [...safetyQuestions(true).map((q) => q.key), "safety_title", "safety_intro", "safety_yes", "safety_no", "safety_continue",
    "safety_note_no_weight_points", "safety_note_doctor", "care_step_doctor", "stage_body_doctor_review"];
  for (const k of keys) {
    assert.ok(typeof en[k] === "string" && en[k].length > 0, `en ${k}`);
    assert.ok(typeof rw[k] === "string" && rw[k].length > 0, `rw ${k}`);
  }
});

test("doctor check is shown only after payment or during a trial", () => {
  const care = { waiting_for: ["doctor_approval"] };
  assert.equal(waitingForDoctor(normalizeEnrolment({ id: 1, status: "pending_payment", care })), false);
  assert.equal(waitingForDoctor(normalizeEnrolment({ id: 1, status: "enrolled", care })), true);
  assert.equal(waitingForDoctor(normalizeEnrolment({ id: 1, status: "trial", care })), true);
  assert.equal(waitingForDoctor(normalizeEnrolment({ id: 1, status: "enrolled", care: { waiting_for: ["intake"] } })), false);
});

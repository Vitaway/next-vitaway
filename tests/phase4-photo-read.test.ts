import { test } from "node:test";
import assert from "node:assert/strict";
import { certaintyKey, draftFrom, draftProblem, observationBody, parsePhotoRead, readType } from "../lib/plus/photo-read-logic.ts";

test("W30 parses a photo read and builds the confirm draft", () => {
  const r = parsePhotoRead({ photo_token: "abc", type: "blood_pressure", reader: { available: true }, suggestion: { systolic: 132, diastolic: 84, pulse: 71, certainty: "found" } });
  assert.equal(r.certainty, "found");
  assert.deepEqual(draftFrom(r), { systolic: "132", diastolic: "84", pulse: "71", value: "", unit: "mmol/L" });
  assert.equal(readType("weight"), "weight");
  assert.equal(readType("nope"), "blood_pressure");
  assert.equal(certaintyKey("none"), "pr_none");
});

test("W30 checks the member's numbers before saving", () => {
  const d = { systolic: "132", diastolic: "84", pulse: "", value: "", unit: "mmol/L" };
  assert.equal(draftProblem("blood_pressure", d), null);
  assert.equal(draftProblem("blood_pressure", { ...d, diastolic: "140" }), "pr_bp_range");
  assert.equal(draftProblem("blood_pressure", { ...d, systolic: "" }), "pr_need_bp");
  assert.equal(draftProblem("glucose", { ...d, value: "6.8" }), null);
  assert.equal(draftProblem("glucose", { ...d, value: "123" }), "pr_glucose_range");
  assert.equal(draftProblem("glucose", { ...d, value: "123", unit: "mg/dL" }), null);
  assert.equal(draftProblem("weight", { ...d, value: "97.3" }), null);
  assert.equal(draftProblem("weight", { ...d, value: "" }), "pr_need_value");
});

test("W30 saves as device_photo with the photo token", () => {
  const b = observationBody("weight", { systolic: "", diastolic: "", pulse: "", value: "97.3", unit: "kg" }, "tok", "2026-11-14T13:00:00.000Z");
  assert.deepEqual(b, { source: "device_photo", photo_token: "tok", effective_at: "2026-11-14T13:00:00.000Z", type: "weight", value: 97.3, unit: "kg" });
});

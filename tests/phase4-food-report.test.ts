import { test } from "node:test";
import assert from "node:assert/strict";
import { checkpointKey, formatChange, formatValue, parseFoodReport, periodLabel } from "../lib/plus/food-report-logic.ts";

test("W29 parses an issued food report", () => {
  const r = parseFoodReport({ id: "3", enrolment_id: 7, programme: { code: "hw", name: "Healthy Weight" }, checkpoint: "week_12", baseline: { from: "2026-08-03", to: "2026-08-09", meals: 4 }, now: { from: "2026-10-19", to: "2026-10-25", meals: 4 }, enough_meals: true, metrics: [{ key: "kcal_per_meal", label_en: "Energy per meal", unit: "kcal", baseline: 805, now: 480, change: -325 }], nutritionist_note: "Good", issued_by_name: "N", issued_at: "2026-11-14T12:00:00Z" });
  assert.equal(r.id, 3);
  assert.equal(r.metrics[0].label_rw, "Energy per meal");
  assert.equal(checkpointKey(r.checkpoint), "fr_week_12");
  assert.equal(parseFoodReport({ checkpoint: "odd" }).checkpoint, "interim");
});

test("W29 formats values, changes and periods", () => {
  assert.deepEqual(formatChange(-325, "kcal"), { text: "−325 kcal", dir: "down" });
  assert.deepEqual(formatChange(4, "g"), { text: "+4 g", dir: "up" });
  assert.equal(formatChange(null, "g").text, "—");
  assert.equal(formatValue(null, "g"), "—");
  assert.equal(formatValue(4, ""), "4");
  assert.equal(periodLabel({ from: "2026-08-03", to: "2026-08-09" }), "3–9 Aug");
  assert.equal(periodLabel({ from: "2026-09-28", to: "2026-10-04" }), "28 Sep – 4 Oct");
});

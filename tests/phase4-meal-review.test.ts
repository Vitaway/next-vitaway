// Phase 4 W23 (BL-106/110/130/133/135): member meal review logic. Run: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  itemFromFood,
  itemFromRecognised,
  itemFromTyped,
  needsCheck,
  portionText,
  quantityLabel,
  reviewTotals,
  setPortion,
  setPreparation,
  stepGrams,
  toSubmission,
  type FoodOption,
} from "../lib/plus/meal-review-logic.ts";
import { DEFAULT_CONFIG, parseProgrammeConfig } from "../lib/plus/programme-config.ts";

const rice: FoodOption = {
  food_key: "mf:F20",
  name: "Rice, white, cooked",
  name_rw: "Umuceri",
  category: "Staples",
  preparation: "Boiled",
  per_100g: { kcal: 130, protein_g: 2.7, carbs_g: 28.2, fat_g: 0.3, fibre_g: 0.4 },
  source: "mirafood",
  verified: true,
  label: null,
  dataset_version: "d1",
  portions: [
    { unit_key: "cup", label: "cup", label_rw: "ikirahuri", grams: 160 },
    { unit_key: "serving_spoon", label: "serving spoon", label_rw: "ikiyiko kinini", grams: 40 },
  ],
};

test("'Please check' only for photo suggestions under the threshold, until the member changes them", () => {
  const isombe = itemFromRecognised({ food_key: "mf:F1", name: "Isombe", name_rw: "Isombe", confidence: 0.48, grams: 100, preparation: "Stewed", portion: null }, null);
  assert.equal(needsCheck(isombe), true);
  assert.equal(needsCheck(isombe, 40), false);
  assert.equal(needsCheck({ ...isombe, confidence: 0.6 }), false, "60% exactly is not flagged");
  assert.equal(needsCheck(setPreparation(isombe, "Boiled")), false, "a member edit clears it");
  assert.equal(needsCheck(itemFromFood(rice)), false, "searched foods are never flagged");
});

test("portion sheet: units with fractions, or grams in 10 g steps within 10-2000 g", () => {
  const item = itemFromFood(rice);
  assert.equal(item.grams, 160);
  assert.equal(portionText(item), "1 cup · 160 g");
  const oneHalf = setPortion(item, "cup", 1.5);
  assert.equal(oneHalf.grams, 240);
  assert.equal(portionText(oneHalf, "rw"), "1½ ikirahuri · 240 g");
  const more = stepGrams(oneHalf, 1);
  assert.equal(more.grams, 250);
  assert.equal(more.unit_key, null);
  assert.equal(portionText(more), "250 g");
  assert.equal(stepGrams({ ...more, grams: 243 }, -1).grams, 240, "snaps to the 10 g step");
  assert.equal(stepGrams({ ...more, grams: 10 }, -1).grams, 10, "never below 10 g");
  assert.deepEqual(["0.25", "0.5", "0.75", "1", "1.5", "3"].map((q) => quantityLabel(Number(q))), ["¼", "½", "¾", "1", "1½", "3"]);
});

test("live totals add up, and say when a typed-in food has no figures", () => {
  const items = [setPortion(itemFromFood(rice), "cup", 1.5), itemFromTyped("Grandma's sauce")];
  const totals = reviewTotals(items);
  assert.equal(totals.kcal, 312);
  assert.equal(totals.protein_g, 6.5);
  assert.equal(totals.partial, true);
  assert.equal(reviewTotals([]).kcal, null);
});

test("what is sent: food id, portion, grams, preparation, confidence, origin; never nutrients", () => {
  const rec = itemFromRecognised({ food_key: "mf:F20", name: "Rice", name_rw: null, confidence: 0.92, grams: 240, preparation: "Boiled", portion: { unit_key: "cup", quantity: 1.5 } }, rice);
  const [sent] = toSubmission([rec]);
  assert.deepEqual(sent, { name: "Rice, white, cooked", name_rw: "Umuceri", food_id: "mf:F20", portion: "1½ cup", unit_key: "cup", quantity: 1.5, grams: 240, preparation: "Boiled", confidence: 0.92, origin: "recognised", member_changed: false });
  assert.equal("kcal" in sent || "nutrients" in sent, false);
});

test("the threshold comes from programme config, default 60%", () => {
  assert.equal(DEFAULT_CONFIG.meal_review.confidence_percent, 60);
  assert.equal(parseProgrammeConfig({ source: "default" }).meal_review.confidence_percent, 60);
  assert.equal(parseProgrammeConfig({ source: "programmes", meal_review: { confidence_percent: 75 } }).meal_review.confidence_percent, 75);
  assert.equal(parseProgrammeConfig({ source: "programmes", meal_review: { confidence_percent: 5 } }).meal_review.confidence_percent, 60);
});

test("the Submit bar is sticky at the bottom of the review page, outside the scroll area", () => {
  const src = readFileSync(new URL("../app/components/plus/meals/meal-photos.tsx", import.meta.url), "utf8");
  assert.match(src, /data-testid="submit-bar" style=\{\{ position: "sticky", bottom: 0/);
  assert.match(src, /env\(safe-area-inset-bottom\)/);
});

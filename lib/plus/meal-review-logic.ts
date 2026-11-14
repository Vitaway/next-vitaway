/**
 * W23 (BL-106/110/130/133/135): the member's meal review after a photo. Pure helpers (run under node --test)
 * plus the API calls live in meal-review.ts. Nutrient figures shown here are estimates; the server stores its own snapshot on submit.
 */

export type Per100g = { kcal: number | null; protein_g: number | null; carbs_g: number | null; fat_g: number | null; fibre_g: number | null };
export type PortionUnit = { unit_key: string; label: string; label_rw: string | null; grams: number };
export type FoodOption = {
  food_key: string;
  name: string;
  name_rw: string | null;
  category: string | null;
  preparation: string | null;
  per_100g: Per100g;
  source: "mirafood" | "fallback";
  verified: boolean;
  label: "unverified" | null;
  dataset_version: string | null;
  portions?: PortionUnit[];
};
export type Recognised = { food_key: string; name: string; name_rw: string | null; confidence: number; grams: number | null; preparation: string | null; portion: { unit_key: string; quantity: number } | null };
export type Recognition = { available: boolean; reason: string | null; request_id: string | null; model_version: string | null; dataset_version: string | null; items: Recognised[] };

export type ReviewItem = {
  uid: string;
  food_key: string | null;
  name: string;
  name_rw: string | null;
  origin: "recognised" | "search" | "manual";
  confidence: number | null;
  grams: number;
  unit_key: string | null;
  quantity: number | null;
  preparation: string | null;
  per_100g: Per100g | null;
  verified: boolean;
  portions: PortionUnit[];
  member_changed: boolean;
};

export const PREPARATIONS = ["Raw", "Boiled", "Steamed", "Fried", "Stewed", "Roasted", "Baked", "Grilled"] as const;
export const QUANTITIES = [0.25, 0.5, 0.75, 1, 1.5, 2, 3] as const;
export const GRAM_STEP = 10;
export const MIN_GRAMS = 10;
export const MAX_GRAMS = 2000;
export const DEFAULT_CONFIDENCE_PERCENT = 60;

let seq = 0;
const uid = () => `i${Date.now().toString(36)}${(seq++).toString(36)}`;

/** "Please check": the photo check suggested this item and was less sure than the programme's threshold. */
export function needsCheck(item: Pick<ReviewItem, "origin" | "confidence" | "member_changed">, thresholdPercent = DEFAULT_CONFIDENCE_PERCENT): boolean {
  return item.origin === "recognised" && !item.member_changed && item.confidence != null && item.confidence * 100 < thresholdPercent;
}

const FRACTION: Record<string, string> = { "0.25": "¼", "0.5": "½", "0.75": "¾" };
export function quantityLabel(q: number): string {
  const whole = Math.floor(q);
  const rest = Math.round((q - whole) * 100) / 100;
  const frac = FRACTION[String(rest)] ?? (rest ? String(rest).replace(/^0/, "") : "");
  return whole ? `${whole}${frac}` : frac || "0";
}

export function unitLabel(unit: PortionUnit | undefined, lang: string): string {
  if (!unit) return "";
  return lang === "rw" && unit.label_rw ? unit.label_rw : unit.label;
}

/** "1½ cup · 240 g" or "240 g" when the member set grams directly. */
export function portionText(item: ReviewItem, lang = "en"): string {
  const unit = item.portions.find((p) => p.unit_key === item.unit_key);
  if (unit && item.quantity) return `${quantityLabel(item.quantity)} ${unitLabel(unit, lang)} · ${item.grams} g`;
  return `${item.grams} g`;
}

const clampGrams = (g: number) => Math.min(MAX_GRAMS, Math.max(MIN_GRAMS, Math.round(g)));

export function setPortion(item: ReviewItem, unitKey: string, quantity: number): ReviewItem {
  const unit = item.portions.find((p) => p.unit_key === unitKey);
  if (!unit || !(quantity > 0)) return item;
  return { ...item, unit_key: unitKey, quantity, grams: clampGrams(unit.grams * quantity), member_changed: item.member_changed || item.origin === "recognised" };
}

/** −/+ buttons: move in 10 g steps, snapping to the step; the portion becomes plain grams. */
export function stepGrams(item: ReviewItem, direction: 1 | -1): ReviewItem {
  const snapped = direction > 0 ? Math.floor(item.grams / GRAM_STEP) * GRAM_STEP + GRAM_STEP : Math.ceil(item.grams / GRAM_STEP) * GRAM_STEP - GRAM_STEP;
  return { ...item, grams: clampGrams(snapped), unit_key: null, quantity: null, member_changed: item.member_changed || item.origin === "recognised" };
}

export function setPreparation(item: ReviewItem, preparation: string): ReviewItem {
  if (!(PREPARATIONS as readonly string[]).includes(preparation)) return item;
  return { ...item, preparation, member_changed: item.member_changed || item.origin === "recognised" };
}

export function itemNutrients(item: ReviewItem) {
  const per = item.per_100g;
  const s = (v: number | null | undefined, dp: number) => (per && v != null ? Math.round(((v * item.grams) / 100) * 10 ** dp) / 10 ** dp : null);
  return { kcal: s(per?.kcal, 0), protein_g: s(per?.protein_g, 1), carbs_g: s(per?.carbs_g, 1), fat_g: s(per?.fat_g, 1) };
}

/** Live totals while the member edits. `partial` when a food has no figures. */
export function reviewTotals(items: ReviewItem[]) {
  const parts = items.map(itemNutrients);
  const sum = (key: "kcal" | "protein_g" | "carbs_g" | "fat_g", dp: number) => {
    const vals = parts.map((p) => p[key]).filter((v): v is number => typeof v === "number");
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) * 10 ** dp) / 10 ** dp : null;
  };
  return { kcal: sum("kcal", 0), protein_g: sum("protein_g", 1), carbs_g: sum("carbs_g", 1), fat_g: sum("fat_g", 1), partial: parts.some((p) => p.kcal == null), count: items.length };
}

function defaultPortion(portions: PortionUnit[]): { unit_key: string | null; quantity: number | null; grams: number } {
  const first = portions[0];
  return first ? { unit_key: first.unit_key, quantity: 1, grams: clampGrams(first.grams) } : { unit_key: null, quantity: null, grams: 100 };
}

export function itemFromFood(food: FoodOption): ReviewItem {
  const portions = food.portions ?? [];
  return {
    uid: uid(),
    food_key: food.food_key,
    name: food.name,
    name_rw: food.name_rw,
    origin: "search",
    confidence: null,
    ...defaultPortion(portions),
    preparation: (PREPARATIONS as readonly string[]).includes(food.preparation ?? "") ? food.preparation : null,
    per_100g: food.per_100g,
    verified: food.verified,
    portions,
    member_changed: false,
  };
}

export function itemFromTyped(name: string): ReviewItem {
  return { uid: uid(), food_key: null, name: name.trim().slice(0, 120), name_rw: null, origin: "manual", confidence: null, grams: 100, unit_key: null, quantity: null, preparation: null, per_100g: null, verified: false, portions: [], member_changed: false };
}

/** A photo suggestion, with the food's figures and units when the detail call worked. */
export function itemFromRecognised(rec: Recognised, food: FoodOption | null): ReviewItem {
  const portions = food?.portions ?? [];
  const unit = rec.portion ? portions.find((p) => p.unit_key === rec.portion!.unit_key) : undefined;
  const grams = rec.grams ?? (unit && rec.portion ? unit.grams * rec.portion.quantity : defaultPortion(portions).grams);
  return {
    uid: uid(),
    food_key: rec.food_key,
    name: food?.name ?? rec.name,
    name_rw: food?.name_rw ?? rec.name_rw,
    origin: "recognised",
    confidence: rec.confidence,
    grams: clampGrams(grams),
    unit_key: unit ? unit.unit_key : null,
    quantity: unit && rec.portion ? rec.portion.quantity : null,
    preparation: (PREPARATIONS as readonly string[]).includes(rec.preparation ?? "") ? rec.preparation : null,
    per_100g: food?.per_100g ?? null,
    verified: food?.verified ?? false,
    portions,
    member_changed: false,
  };
}

/** What POST /mobile/meal-photos receives in `foods`. No nutrients: the server adds its own. */
export function toSubmission(items: ReviewItem[], lang = "en") {
  return items.map((item) => ({
    name: item.name,
    name_rw: item.name_rw,
    food_id: item.food_key,
    portion: portionText(item, lang).split(" · ")[0],
    unit_key: item.unit_key,
    quantity: item.quantity,
    grams: item.grams,
    preparation: item.preparation,
    confidence: item.confidence,
    origin: item.origin,
    member_changed: item.member_changed,
  }));
}


const obj = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});

export function parseFood(raw: unknown): FoodOption {
  const o = obj(raw);
  const per = obj(o.per_100g);
  const n = (v: unknown) => (v == null || !Number.isFinite(Number(v)) ? null : Number(v));
  return {
    food_key: String(o.food_key ?? ""),
    name: String(o.name ?? ""),
    name_rw: o.name_rw == null ? null : String(o.name_rw),
    category: o.category == null ? null : String(o.category),
    preparation: o.preparation == null ? null : String(o.preparation),
    per_100g: { kcal: n(per.kcal), protein_g: n(per.protein_g), carbs_g: n(per.carbs_g), fat_g: n(per.fat_g), fibre_g: n(per.fibre_g) },
    source: o.source === "mirafood" ? "mirafood" : "fallback",
    verified: o.verified === true,
    label: o.label === "unverified" ? "unverified" : null,
    dataset_version: o.dataset_version == null ? null : String(o.dataset_version),
    portions: Array.isArray(o.portions)
      ? o.portions.map(obj).filter((p) => Number(p.grams) > 0).map((p) => ({ unit_key: String(p.unit_key), label: String(p.label ?? p.unit_key), label_rw: p.label_rw == null ? null : String(p.label_rw), grams: Number(p.grams) }))
      : undefined,
  };
}


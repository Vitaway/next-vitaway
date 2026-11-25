/**
 * W23 (BL-106/110/130/133/135): the member's meal review after a photo. Pure helpers (run under node --test)
 * plus the API calls live in meal-review.ts. Nutrient figures shown here are estimates; the server stores its own snapshot on submit.
 * 24 Nov 2026: the MiraFood master food database (1,108 foods, household portions, trust per food) feeds the picker.
 */

export type Per100g = { kcal: number | null; protein_g: number | null; carbs_g: number | null; fat_g: number | null; fibre_g: number | null; sodium_mg?: number | null; sugars_g?: number | null };
export type PortionStatus = "standard" | "draft" | "tanzania" | "usa" | "label" | "weighed";
export type PortionUnit = { unit_key: string; label: string; label_rw: string | null; grams: number; status?: PortionStatus };
export type FoodTrust = "source" | "close" | "label" | "provisional" | "proxy" | "flagged" | "none";
export type FoodLabel = "unverified" | "provisional" | null;
export type FoodOption = {
  food_key: string;
  name: string;
  name_rw: string | null;
  category: string | null;
  group_code?: string | null;
  preparation: string | null;
  per_100g: Per100g;
  source: "mirafood" | "fallback";
  verified: boolean;
  label: FoodLabel;
  trust?: FoodTrust | null;
  source_name?: string | null;
  is_core?: boolean;
  image_url?: string | null;
  image_attribution?: string | null;
  dataset_version: string | null;
  portions?: PortionUnit[];
};
export type FoodGroup = { code: string; name: string; name_rw: string | null; foods: number };
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
  label: FoodLabel;
  source_name: string | null;
  group_code: string | null;
  image_url: string | null;
  portions: PortionUnit[];
  member_changed: boolean;
};

export const PREPARATIONS = ["Raw", "Boiled", "Steamed", "Fried", "Stewed", "Roasted", "Baked", "Grilled"] as const;
export const QUANTITIES = [0.25, 0.5, 0.75, 1, 1.5, 2, 3] as const;
export const GRAM_STEP = 10;
export const MIN_GRAMS = 10;
export const MAX_GRAMS = 2000;
export const DEFAULT_CONFIDENCE_PERCENT = 60;

/** The master database's 15 food groups (Kenya 2018 groups): copy key and a colour for the picker. */
export const FOOD_GROUPS: Record<string, { key: string; color: string; emoji: string }> = {
  "01": { key: "fg_01", color: "#e9c46a", emoji: "🌾" },
  "02": { key: "fg_02", color: "#d9a066", emoji: "🍠" },
  "03": { key: "fg_03", color: "#b5651d", emoji: "🫘" },
  "04": { key: "fg_04", color: "#5ca84d", emoji: "🥬" },
  "05": { key: "fg_05", color: "#f08a4b", emoji: "🍍" },
  "06": { key: "fg_06", color: "#9ec5e8", emoji: "🥛" },
  "07": { key: "fg_07", color: "#c9655a", emoji: "🍗" },
  "08": { key: "fg_08", color: "#4e8fb8", emoji: "🐟" },
  "09": { key: "fg_09", color: "#f2c14e", emoji: "🫒" },
  "10": { key: "fg_10", color: "#a67c52", emoji: "🥜" },
  "11": { key: "fg_11", color: "#e38fb0", emoji: "🍬" },
  "12": { key: "fg_12", color: "#6fc3c0", emoji: "🥤" },
  "13": { key: "fg_13", color: "#b58de0", emoji: "🧂" },
  "14": { key: "fg_14", color: "#8c8c6a", emoji: "🦗" },
  "15": { key: "fg_15", color: "#e85a2e", emoji: "🍲" },
};
/** Groups shown as quick-pick sections, in the order a Rwandan plate is built: starch, beans, vegetables, protein, fruit, drinks. */
export const QUICK_GROUP_ORDER = ["01", "02", "03", "04", "07", "08", "15", "05", "06", "12", "10", "11", "09", "13", "14"];

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

export type ItemNutrients = { kcal: number | null; protein_g: number | null; carbs_g: number | null; fat_g: number | null; fibre_g: number | null; sodium_mg: number | null };

export function itemNutrients(item: Pick<ReviewItem, "per_100g" | "grams">): ItemNutrients {
  const per = item.per_100g;
  const s = (v: number | null | undefined, dp: number) => (per && v != null ? Math.round(((v * item.grams) / 100) * 10 ** dp) / 10 ** dp : null);
  return { kcal: s(per?.kcal, 0), protein_g: s(per?.protein_g, 1), carbs_g: s(per?.carbs_g, 1), fat_g: s(per?.fat_g, 1), fibre_g: s(per?.fibre_g, 1), sodium_mg: s(per?.sodium_mg, 0) };
}

/** Salt in grams from sodium (sodium × 2.5 ÷ 1000, as in the MiraFood database). */
export const saltGrams = (sodiumMg: number | null) => (sodiumMg == null ? null : Math.round((sodiumMg * 2.5) / 100) / 10);

/** Live totals while the member edits. `partial` when a food has no figures. */
export function reviewTotals(items: ReviewItem[]) {
  const parts = items.map(itemNutrients);
  const sum = (key: keyof ItemNutrients, dp: number) => {
    const vals = parts.map((p) => p[key]).filter((v): v is number => typeof v === "number");
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) * 10 ** dp) / 10 ** dp : null;
  };
  const sodium = sum("sodium_mg", 0);
  return {
    kcal: sum("kcal", 0),
    protein_g: sum("protein_g", 1),
    carbs_g: sum("carbs_g", 1),
    fat_g: sum("fat_g", 1),
    fibre_g: sum("fibre_g", 1),
    sodium_mg: sodium,
    salt_g: saltGrams(sodium),
    partial: parts.some((p) => p.kcal == null),
    count: items.length,
  };
}

function defaultPortion(portions: PortionUnit[]): { unit_key: string | null; quantity: number | null; grams: number } {
  const first = portions[0];
  return first ? { unit_key: first.unit_key, quantity: 1, grams: clampGrams(first.grams) } : { unit_key: null, quantity: null, grams: 100 };
}

/** "1 ladle · 150 g · ~190 kcal": the line under a food in the picker, from its first (household) portion. */
export function defaultPortionText(food: FoodOption, lang = "en"): string {
  const first = food.portions?.[0];
  const grams = first ? first.grams : 100;
  const kcal = food.per_100g.kcal == null ? null : Math.round((food.per_100g.kcal * grams) / 100);
  const head = first ? `1 ${unitLabel(first, lang)} · ${grams} g` : `100 g`;
  return kcal == null ? head : `${head} · ~${kcal} kcal`;
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
    label: food.label ?? (food.verified ? null : "unverified"),
    source_name: food.source_name ?? null,
    group_code: food.group_code ?? null,
    image_url: food.image_url ?? null,
    portions,
    member_changed: false,
  };
}

export function itemFromTyped(name: string): ReviewItem {
  return { uid: uid(), food_key: null, name: name.trim().slice(0, 120), name_rw: null, origin: "manual", confidence: null, grams: 100, unit_key: null, quantity: null, preparation: null, per_100g: null, verified: false, label: "unverified", source_name: null, group_code: null, image_url: null, portions: [], member_changed: false };
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
    label: food ? (food.label ?? (food.verified ? null : "unverified")) : "unverified",
    source_name: food?.source_name ?? null,
    group_code: food?.group_code ?? null,
    image_url: food?.image_url ?? null,
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
const PORTION_STATUSES: readonly string[] = ["standard", "draft", "tanzania", "usa", "label", "weighed"];
const TRUSTS: readonly string[] = ["source", "close", "label", "provisional", "proxy", "flagged", "none"];

export function parseFood(raw: unknown): FoodOption {
  const o = obj(raw);
  const per = obj(o.per_100g);
  const n = (v: unknown) => (v == null || !Number.isFinite(Number(v)) ? null : Number(v));
  const str = (v: unknown) => (v == null ? null : String(v));
  return {
    food_key: String(o.food_key ?? ""),
    name: String(o.name ?? ""),
    name_rw: str(o.name_rw),
    category: str(o.category),
    group_code: str(o.group_code),
    preparation: str(o.preparation),
    per_100g: { kcal: n(per.kcal), protein_g: n(per.protein_g), carbs_g: n(per.carbs_g), fat_g: n(per.fat_g), fibre_g: n(per.fibre_g), sodium_mg: n(per.sodium_mg), sugars_g: n(per.sugars_g) },
    source: o.source === "mirafood" ? "mirafood" : "fallback",
    verified: o.verified === true,
    label: o.label === "unverified" || o.label === "provisional" ? o.label : null,
    trust: TRUSTS.includes(String(o.trust)) ? (o.trust as FoodTrust) : null,
    source_name: str(o.source_name),
    is_core: o.is_core === true,
    image_url: str(o.image_url),
    image_attribution: str(o.image_attribution),
    dataset_version: str(o.dataset_version),
    portions: Array.isArray(o.portions)
      ? o.portions
          .map(obj)
          .filter((p) => Number(p.grams) > 0)
          .map((p) => ({ unit_key: String(p.unit_key), label: String(p.label ?? p.unit_key), label_rw: str(p.label_rw), grams: Number(p.grams), status: PORTION_STATUSES.includes(String(p.status)) ? (p.status as PortionStatus) : undefined }))
      : undefined,
  };
}

export function parseGroup(raw: unknown): FoodGroup {
  const o = obj(raw);
  return { code: String(o.code ?? ""), name: String(o.name ?? ""), name_rw: o.name_rw == null ? null : String(o.name_rw), foods: Number(o.foods ?? 0) };
}

/** Quick picks grouped for the picker, in plate order; groups with nothing are left out. */
export function groupQuickPicks(foods: FoodOption[]): Array<{ code: string; foods: FoodOption[] }> {
  const byCode = new Map<string, FoodOption[]>();
  for (const f of foods) {
    const code = f.group_code ?? "15";
    byCode.set(code, [...(byCode.get(code) ?? []), f]);
  }
  return QUICK_GROUP_ORDER.filter((c) => byCode.has(c)).map((code) => ({ code, foods: byCode.get(code)! }));
}

// ---------------------------------------------------------------- W24 detail page

/** While a meal waits for its check, the detail page asks again every 20 s so "Checked by" shows within a minute. */
export const MEAL_POLL_MS = 20_000;

export function mealPollMs(status: string): number | null {
  return status === "submitted" || status === "in_review" ? MEAL_POLL_MS : null;
}

/** The translation key and values for one "What changed" line. */
export function changeLine(change: { kind: "added" | "removed" | "changed"; name: string; from: string | null; to: string | null }): { key: string; vars: Record<string, string> } {
  if (change.kind === "added") return { key: "mr_change_added", vars: { name: change.to ? `${change.name} (${change.to})` : change.name } };
  if (change.kind === "removed") return { key: "mr_change_removed", vars: { name: change.name } };
  return { key: "mr_change_changed", vars: { name: change.name, from: change.from ?? "—", to: change.to ?? "—" } };
}

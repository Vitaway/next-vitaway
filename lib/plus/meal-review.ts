/** W23 API calls for the meal review screen. The pure helpers are in meal-review-logic.ts (node --test). */
import { mobileRequest } from "./client/api";
import { parseFood, parseGroup, type FoodGroup, type FoodOption, type Recognition } from "./meal-review-logic";
import { prepareImageForUpload } from "./upload-image";

export * from "./meal-review-logic";

const obj = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
const FOODS = "/api/v1/mobile/foods";

/** Search by any word a member uses: English, Kinyarwanda, French, Swahili or a brand. `group` (01–15) browses a food group. */
export async function searchFoods(q: string, lang: string, group?: string | null): Promise<FoodOption[]> {
  const params = new URLSearchParams({ q, lang: lang === "rw" ? "rw" : "en", limit: "20" });
  if (group) params.set("group", group);
  const body = await mobileRequest<{ results?: unknown[] }>(`${FOODS}/search?${params.toString()}`);
  return (body?.results ?? []).map(parseFood).filter((f) => f.food_key);
}

/** The core Rwandan foods (quick picks when the search box is empty). */
export async function commonFoods(): Promise<FoodOption[]> {
  const body = await mobileRequest<{ results?: unknown[] }>(`${FOODS}/common`);
  return (body?.results ?? []).map(parseFood).filter((f) => f.food_key);
}

/** This member's most-logged foods, each with its portions already loaded. */
export async function recentFoods(): Promise<FoodOption[]> {
  const body = await mobileRequest<{ results?: unknown[] }>(`${FOODS}/recent`);
  return (body?.results ?? []).map(parseFood).filter((f) => f.food_key);
}

export async function foodGroups(): Promise<FoodGroup[]> {
  const body = await mobileRequest<{ results?: unknown[] }>(`${FOODS}/groups`);
  return (body?.results ?? []).map(parseGroup).filter((g) => g.code);
}

export async function getFood(key: string): Promise<FoodOption> {
  return parseFood(await mobileRequest(`${FOODS}/${encodeURIComponent(key)}`));
}

export async function recognizeMeal(file: File): Promise<Recognition> {
  const form = new FormData();
  form.append("image", await prepareImageForUpload(file));
  const o = obj(await mobileRequest(`${FOODS}/recognize`, { method: "POST", form }));
  return {
    available: o.available === true,
    reason: o.reason == null ? null : String(o.reason),
    request_id: o.request_id == null ? null : String(o.request_id),
    model_version: o.model_version == null ? null : String(o.model_version),
    dataset_version: o.dataset_version == null ? null : String(o.dataset_version),
    items: Array.isArray(o.items)
      ? o.items.map(obj).map((i) => ({
          food_key: String(i.food_key ?? ""),
          name: String(i.name ?? ""),
          name_rw: i.name_rw == null ? null : String(i.name_rw),
          confidence: Number(i.confidence ?? 0),
          grams: i.grams == null ? null : Number(i.grams),
          preparation: i.preparation == null ? null : String(i.preparation),
          portion: i.portion && typeof i.portion === "object" ? { unit_key: String(obj(i.portion).unit_key), quantity: Number(obj(i.portion).quantity) } : null,
        }))
      : [],
  };
}

/** "Ask MiraFood to add it": tells the food team a member looked for a food we do not have (counted once per member, word and day). */
export async function askToAdd(term: string, source: "search" | "typed" = "search"): Promise<void> {
  await mobileRequest(`${FOODS}/requests`, { method: "POST", body: { term, source } });
}

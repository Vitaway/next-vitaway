/** W23 API calls for the meal review screen. The pure helpers are in meal-review-logic.ts (node --test). */
import { mobileRequest } from "./client/api";
import { parseFood, type FoodOption, type Recognition } from "./meal-review-logic";

export * from "./meal-review-logic";

const obj = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});

export async function searchFoods(q: string, lang: string): Promise<FoodOption[]> {
  const body = await mobileRequest<{ results?: unknown[] }>(`/api/v1/mobile/foods/search?q=${encodeURIComponent(q)}&lang=${lang === "rw" ? "rw" : "en"}`);
  return (body?.results ?? []).map(parseFood).filter((f) => f.food_key);
}

export async function getFood(key: string): Promise<FoodOption> {
  return parseFood(await mobileRequest(`/api/v1/mobile/foods/${encodeURIComponent(key)}`));
}

export async function recognizeMeal(file: File): Promise<Recognition> {
  const form = new FormData();
  form.append("image", file);
  const o = obj(await mobileRequest(`/api/v1/mobile/foods/recognize`, { method: "POST", form }));
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

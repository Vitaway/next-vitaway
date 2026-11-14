/**
 * Meal photos (BL-141), same contract as Flutter lib/models/meal_photo.dart.
 * GET/POST /api/v1/mobile/meal-photos, GET /api/v1/mobile/meal-photos/:id(/image)
 */
import { apiUrl, mobileRequest } from "./client/api";
import { loadPlusSession } from "./session";

export const MEAL_PHOTOS_PATH = "/api/v1/mobile/meal-photos";
export const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack", "other"] as const;
export type MealType = (typeof MEAL_TYPES)[number];

export type MealPhotoReview = {
  checked_by: string | null;
  checked_at: string | null;
  note: string | null;
};

export type MealPhotoPoints = {
  awarded: boolean;
  points: number;
  reason: string | null;
  message: string | null;
};

/** W23: a food as stored by the server (with its own snapshot and nutrients). */
export type MealPhotoFood = {
  name: string;
  name_rw: string | null;
  portion: string | null;
  grams: number | null;
  preparation: string | null;
  origin: string | null;
  verified: boolean;
  kcal: number | null;
};
export type MealPhotoTotals = { kcal: number | null; protein_g: number | null; carbs_g: number | null; fat_g: number | null; partial: boolean; unverified: boolean };

export type MealPhoto = {
  foods: MealPhotoFood[];
  totals: MealPhotoTotals | null;
  id: number;
  meal_type: string;
  eaten_at: string;
  note: string | null;
  status: string;
  status_label: string;
  review: MealPhotoReview | null;
  retake_of: number | null;
  image_url: string;
  thumb_url: string;
  created_at: string;
  points?: MealPhotoPoints | null;
  /** W17: kudos from the care team (once per checked photo). */
  kudos?: { message: string; by: string; at: string } | null;
};

export function parseMealPhoto(raw: unknown): MealPhoto {
  const json = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const review = json.review && typeof json.review === "object" ? (json.review as Record<string, unknown>) : null;
  const points = json.points && typeof json.points === "object" ? (json.points as Record<string, unknown>) : null;
  const kudos = json.kudos && typeof json.kudos === "object" ? (json.kudos as Record<string, unknown>) : null;
  const totals = json.totals && typeof json.totals === "object" ? (json.totals as Record<string, unknown>) : null;
  const num = (v: unknown) => (v == null || !Number.isFinite(Number(v)) ? null : Number(v));
  return {
    foods: Array.isArray(json.foods)
      ? json.foods
          .filter((f): f is Record<string, unknown> => !!f && typeof f === "object")
          .map((f) => ({
            name: String(f.name ?? ""),
            name_rw: f.name_rw == null ? null : String(f.name_rw),
            portion: f.portion == null ? null : String(f.portion),
            grams: num(f.grams),
            preparation: f.preparation == null ? null : String(f.preparation),
            origin: f.origin == null ? null : String(f.origin),
            verified: f.verified === true,
            kcal: num((f.nutrients as Record<string, unknown> | null | undefined)?.kcal),
          }))
      : [],
    totals: totals ? { kcal: num(totals.kcal), protein_g: num(totals.protein_g), carbs_g: num(totals.carbs_g), fat_g: num(totals.fat_g), partial: totals.partial === true, unverified: totals.unverified === true } : null,
    id: Number(json.id ?? 0),
    meal_type: String(json.meal_type ?? "other"),
    eaten_at: String(json.eaten_at ?? ""),
    note: json.note == null ? null : String(json.note),
    status: String(json.status ?? "submitted"),
    status_label: String(json.status_label ?? ""),
    review: review
      ? {
          checked_by: review.checked_by == null ? null : String(review.checked_by),
          checked_at: review.checked_at == null ? null : String(review.checked_at),
          note: review.note == null ? null : String(review.note),
        }
      : null,
    retake_of: json.retake_of == null ? null : Number(json.retake_of),
    image_url: String(json.image_url ?? ""),
    thumb_url: String(json.thumb_url ?? ""),
    created_at: String(json.created_at ?? ""),
    kudos: kudos && kudos.message ? { message: String(kudos.message), by: String(kudos.by ?? ""), at: String(kudos.at ?? "") } : null,
    points: points
      ? {
          awarded: points.awarded === true,
          points: Number(points.points ?? 0),
          reason: points.reason == null ? null : String(points.reason),
          message: points.message == null ? null : String(points.message),
        }
      : null,
  };
}

export async function listMealPhotos(): Promise<MealPhoto[]> {
  const body = await mobileRequest<{ results?: unknown[] }>(MEAL_PHOTOS_PATH);
  return (body?.results ?? []).map(parseMealPhoto);
}

export async function getMealPhoto(id: number): Promise<MealPhoto> {
  return parseMealPhoto(await mobileRequest(`${MEAL_PHOTOS_PATH}/${id}`));
}

export async function uploadMealPhoto(input: {
  file: File;
  mealType: string;
  note?: string;
  retakeOf?: number | null;
  /** W23: reviewed foods (toSubmission) and the recognition versions, when the member reviewed them. */
  foods?: unknown[];
  mirafoodRequestId?: string | null;
  modelVersion?: string | null;
  datasetVersion?: string | null;
}): Promise<MealPhoto> {
  const form = new FormData();
  form.append("image", input.file);
  form.append("meal_type", input.mealType);
  form.append("eaten_at", new Date().toISOString());
  if (input.note?.trim()) form.append("note", input.note.trim());
  if (input.retakeOf) form.append("retake_of", String(input.retakeOf));
  if (input.foods?.length) form.append("foods", JSON.stringify(input.foods));
  if (input.mirafoodRequestId) form.append("mirafood_request_id", input.mirafoodRequestId);
  if (input.modelVersion) form.append("model_version", input.modelVersion);
  if (input.datasetVersion) form.append("dataset_version", input.datasetVersion);
  return parseMealPhoto(await mobileRequest(MEAL_PHOTOS_PATH, { method: "POST", form }));
}

/** Meal photos are private: fetch with the member token, never as a public URL. */
export async function mealPhotoImageBlob(id: number, thumb = false): Promise<Blob> {
  const token = loadPlusSession()?.mobileToken ?? "";
  const path = `${MEAL_PHOTOS_PATH}/${id}/image${thumb ? "?size=thumb" : ""}`;
  const response = await fetch(apiUrl(path), {
    headers: { Authorization: token ? `Token ${token}` : "", Accept: "image/*" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`image ${response.status}`);
  return response.blob();
}

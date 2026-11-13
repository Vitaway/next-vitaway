/**
 * BMI rules (tracker BL-003 / BL-013), same as Flutter lib/utils/bmi_rules.dart.
 * Adult BMI categories only from age 18. Under 18, or when the age is unknown,
 * no category and no number: a neutral note instead (children are judged on growth charts).
 */

export const ADULT_BMI_MIN_AGE = 18;

export type BmiBand = "underweight" | "healthy" | "overweight" | "obese";

export type BmiView = {
  /** The BMI number, or null when it must not be shown. */
  value: number | null;
  /** Adult category, or null when none may be shown. */
  band: BmiBand | null;
  /** Translation key explaining why there is no category. */
  noteKey: string | null;
};

export function bmiFrom(weightKg: number | null | undefined, heightCm: number | null | undefined): number | null {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
  const m = heightCm / 100;
  return weightKg / (m * m);
}

export function bandFor(bmi: number): BmiBand {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "healthy";
  if (bmi < 30) return "overweight";
  return "obese";
}

/** `age` in whole years; 0, null or negative means unknown. */
export function bmiViewFor(weightKg: number | null | undefined, heightCm: number | null | undefined, age: number | null | undefined): BmiView {
  if (!weightKg || !Number.isFinite(weightKg) || weightKg <= 0) return { value: null, band: null, noteKey: "bmi_no_weight" };
  if (!heightCm || !Number.isFinite(heightCm) || heightCm <= 0) return { value: null, band: null, noteKey: "bmi_need_height" };
  const years = Number(age ?? 0) || 0;
  if (years <= 0) return { value: null, band: null, noteKey: "bmi_need_age" };
  if (years < ADULT_BMI_MIN_AGE) return { value: null, band: null, noteKey: "bmi_under_18" };
  const bmi = bmiFrom(weightKg, heightCm)!;
  return { value: bmi, band: bandFor(bmi), noteKey: null };
}

export const BMI_BAND_LABEL_KEY: Record<BmiBand, string> = {
  underweight: "bmi_band_underweight",
  healthy: "bmi_band_healthy",
  overweight: "bmi_band_overweight",
  obese: "bmi_band_obese",
};

export const BMI_HOME_CAPTION_KEY: Record<BmiBand, string> = {
  underweight: "weight_caption_below",
  healthy: "weight_caption_usual",
  overweight: "weight_caption_above",
  obese: "weight_caption_well_above",
};

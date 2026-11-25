/** W30: pure helpers for "read from a photo" (node --test). The member always confirms; nothing is saved automatically. */
export type PhotoReadType = "blood_pressure" | "glucose" | "weight";
export type Certainty = "found" | "unsure" | "none";
export type PhotoRead = {
  photo_token: string;
  type: PhotoReadType;
  reader_available: boolean;
  certainty: Certainty;
  systolic: number | null;
  diastolic: number | null;
  pulse: number | null;
  value: number | null;
  unit: string | null;
};

const obj = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
const num = (v: unknown) => (v == null || v === "" || Number.isNaN(Number(v)) ? null : Number(v));

export function readType(raw: string | null | undefined): PhotoReadType {
  return raw === "glucose" || raw === "weight" ? raw : "blood_pressure";
}

export function parsePhotoRead(raw: unknown): PhotoRead {
  const o = obj(raw);
  const s = obj(o.suggestion);
  const c = String(s.certainty);
  return {
    photo_token: String(o.photo_token ?? ""),
    type: readType(String(o.type ?? "")),
    reader_available: obj(o.reader).available === true,
    certainty: c === "found" || c === "unsure" ? c : "none",
    systolic: num(s.systolic),
    diastolic: num(s.diastolic),
    pulse: num(s.pulse),
    value: num(s.value),
    unit: s.unit == null ? null : String(s.unit),
  };
}

export type Draft = { systolic: string; diastolic: string; pulse: string; value: string; unit: string };

export function draftFrom(r: PhotoRead): Draft {
  const s = (n: number | null) => (n == null ? "" : String(n));
  return { systolic: s(r.systolic), diastolic: s(r.diastolic), pulse: s(r.pulse), value: s(r.value), unit: r.type === "weight" ? "kg" : r.unit ?? "mmol/L" };
}

/** Plain-words checks before saving. Returns a translation key, or null when the numbers can be saved. */
export function draftProblem(type: PhotoReadType, d: Draft): string | null {
  const n = (v: string) => (v.trim() === "" ? NaN : Number(v));
  if (type === "blood_pressure") {
    const sys = n(d.systolic);
    const dia = n(d.diastolic);
    if (!Number.isInteger(sys) || !Number.isInteger(dia)) return "pr_need_bp";
    if (sys < 60 || sys > 260 || dia < 30 || dia > 160 || dia >= sys) return "pr_bp_range";
    if (d.pulse.trim() && (!Number.isInteger(n(d.pulse)) || n(d.pulse) < 30 || n(d.pulse) > 230)) return "pr_pulse_range";
    return null;
  }
  const v = n(d.value);
  if (!Number.isFinite(v)) return "pr_need_value";
  if (type === "glucose") return d.unit === "mg/dL" ? (v >= 20 && v <= 600 ? null : "pr_glucose_range") : v >= 1.1 && v <= 33.3 ? null : "pr_glucose_range";
  return v >= 2 && v <= 300 ? null : "pr_weight_range";
}

/** Body for POST /mobile/observations (source device_photo + photo_token). */
export function observationBody(type: PhotoReadType, d: Draft, token: string, effectiveAt: string) {
  const base = { source: "device_photo", photo_token: token, effective_at: effectiveAt };
  if (type === "blood_pressure") return { ...base, type: "blood_pressure", systolic: Number(d.systolic), diastolic: Number(d.diastolic), unit: "mmHg" };
  if (type === "glucose") return { ...base, type: "glucose", value: Number(d.value), unit: d.unit === "mg/dL" ? "mg/dL" : "mmol/L" };
  return { ...base, type: "weight", value: Number(d.value), unit: "kg" };
}

export function certaintyKey(c: Certainty) {
  return c === "found" ? "pr_found" : c === "unsure" ? "pr_unsure" : "pr_none";
}

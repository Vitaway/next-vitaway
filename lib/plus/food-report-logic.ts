/** W29: pure helpers for the food report screen (node --test). Same layout as the EHR report. */
export type FoodMetric = { key: string; label_en: string; label_rw: string; unit: string; baseline: number | null; now: number | null; change: number | null };
export type FoodReport = {
  id: number;
  enrolment_id: number;
  programme: { code: string; name: string } | null;
  checkpoint: "interim" | "week_6" | "week_12";
  baseline: { from: string; to: string; meals: number };
  now: { from: string; to: string; meals: number };
  enough_meals: boolean;
  metrics: FoodMetric[];
  nutritionist_note: string;
  issued_by_name: string;
  issued_at: string;
};

const obj = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
const num = (v: unknown) => (v == null || v === "" || Number.isNaN(Number(v)) ? null : Number(v));
const period = (v: unknown) => {
  const p = obj(v);
  return { from: String(p.from ?? ""), to: String(p.to ?? ""), meals: Number(p.meals ?? 0) };
};

export function parseFoodReport(raw: unknown): FoodReport {
  const o = obj(raw);
  const prog = obj(o.programme);
  const cp = String(o.checkpoint);
  return {
    id: Number(o.id),
    enrolment_id: Number(o.enrolment_id),
    programme: prog.name ? { code: String(prog.code ?? ""), name: String(prog.name) } : null,
    checkpoint: cp === "week_6" || cp === "week_12" ? cp : "interim",
    baseline: period(o.baseline),
    now: period(o.now),
    enough_meals: o.enough_meals === true,
    metrics: Array.isArray(o.metrics)
      ? o.metrics.map(obj).map((m) => ({ key: String(m.key), label_en: String(m.label_en ?? m.key), label_rw: String(m.label_rw ?? m.label_en ?? m.key), unit: String(m.unit ?? ""), baseline: num(m.baseline), now: num(m.now), change: num(m.change) }))
      : [],
    nutritionist_note: String(o.nutritionist_note ?? ""),
    issued_by_name: String(o.issued_by_name ?? ""),
    issued_at: String(o.issued_at ?? ""),
  };
}

export function checkpointKey(cp: FoodReport["checkpoint"]) {
  return cp === "week_6" ? "fr_week_6" : cp === "week_12" ? "fr_week_12" : "fr_interim";
}

export function formatValue(v: number | null, unit: string) {
  if (v == null) return "—";
  return unit ? `${v} ${unit}` : String(v);
}

/** "+4 g" / "−279 kcal" / "no change" key. */
export function formatChange(v: number | null, unit: string): { text: string; dir: "up" | "down" | "same" | "none" } {
  if (v == null) return { text: "—", dir: "none" };
  if (v === 0) return { text: "0", dir: "same" };
  const sign = v > 0 ? "+" : "−";
  return { text: `${sign}${Math.abs(v)}${unit ? ` ${unit}` : ""}`, dir: v > 0 ? "up" : "down" };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function periodLabel(p: { from: string; to: string }) {
  const f = /^(\d{4})-(\d{2})-(\d{2})$/.exec(p.from);
  const t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(p.to);
  if (!f || !t) return `${p.from} – ${p.to}`;
  const fm = MONTHS[Number(f[2]) - 1];
  const tm = MONTHS[Number(t[2]) - 1];
  return fm === tm ? `${Number(f[3])}–${Number(t[3])} ${tm}` : `${Number(f[3])} ${fm} – ${Number(t[3])} ${tm}`;
}

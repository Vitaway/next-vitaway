/**
 * W19 (BL-169): take-home plans from signed Vitaway+ clinic visits.
 * GET /api/v1/mobile/visit-plans/ and /:id. Both languages come from the server; the app shows its own.
 */
export const VISIT_PLANS_PATH = "/api/v1/mobile/visit-plans/";

export type PlanSection = { heading: string; items: string[] };
export type PlanBody = { title: string; draftNote: string | null; sections: PlanSection[] };
export type VisitPlan = {
  id: number;
  visitDate: string | null;
  nextVisit: string | null;
  title: { en: string; rw: string };
  clinician: string | null;
  read: boolean;
  plan: { en: PlanBody; rw: PlanBody } | null;
};

const str = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);
const iso = (v: unknown): string | null => {
  const m = typeof v === "string" ? /^(\d{4}-\d{2}-\d{2})/.exec(v) : null;
  return m ? m[1] : null;
};

function body(raw: unknown): PlanBody {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const sections = (Array.isArray(r.sections) ? r.sections : [])
    .filter((s) => s && typeof s === "object")
    .map((s) => {
      const x = s as Record<string, unknown>;
      return { heading: String(x.heading ?? ""), items: (Array.isArray(x.items) ? x.items : []).map((i) => String(i ?? "").trim()).filter(Boolean) };
    })
    .filter((s) => s.heading);
  return { title: str(r.title) ?? "", draftNote: str(r.draft_note), sections };
}

export function normalizeVisitPlan(raw: unknown): VisitPlan {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const title = (r.title && typeof r.title === "object" ? r.title : {}) as Record<string, unknown>;
  const plan = r.plan && typeof r.plan === "object" ? (r.plan as Record<string, unknown>) : null;
  return {
    id: Number(r.id) || 0,
    visitDate: iso(r.visit_date),
    nextVisit: iso(r.next_visit),
    title: { en: str(title.en) ?? "Your plan from today's visit", rw: str(title.rw) ?? "Gahunda yawe y'uyu munsi" },
    clinician: str(r.clinician),
    read: r.read === true,
    plan: plan ? { en: body(plan.en), rw: body(plan.rw) } : null,
  };
}

export function normalizeVisitPlans(raw: unknown): VisitPlan[] {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const list = Array.isArray(raw) ? raw : Array.isArray(r.results) ? r.results : [];
  return list.map(normalizeVisitPlan).filter((p) => p.id > 0);
}

/** The plan in the app language; Kinyarwanda falls back to English when a section is empty there. */
export function planIn(plan: VisitPlan, language: string): PlanBody | null {
  if (!plan.plan) return null;
  return language === "rw" ? plan.plan.rw : plan.plan.en;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** 11 Dec 2026 (day and month names stay English short form, as elsewhere in the app). */
export function planDate(isoDate: string | null): string {
  const m = isoDate ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate) : null;
  return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : "";
}

/** Items that are a bare ISO date (next visit, goal "by") read as a date. */
export function planItem(item: string): string {
  return item
    .split(" · ")
    .map((part) => (/^\d{4}-\d{2}-\d{2}$/.test(part) ? planDate(part) : part))
    .join(" · ");
}

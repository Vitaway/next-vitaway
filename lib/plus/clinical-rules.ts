/**
 * Tracker v9.0 safety items (BL-010, BL-012, BL-021, BL-148), built but switched off.
 *
 * The app shows NO reading interpretation, no low-glucose threshold and no
 * health score unless the backend returns an APPROVED clinical rule for it
 * (GET /api/v1/mobile/clinical-config). A rule only becomes approved when a
 * named clinical lead, who is not its author, approves it (CA-01 to CA-05,
 * CA-15). Nothing here holds a clinical number: every range, chip and message
 * comes from the approved rule. With no approved rules the app falls back to
 * neutral text plus the emergency instruction.
 *
 * Pure module (no React, no fetch) so it can be unit-tested with node --test.
 */

export type Lang = "en" | "rw";
export type Text = { en: string; rw: string };
export type Tone = "ok" | "warn" | "bad";
export type AlertLevel = "urgent" | "clinical_review" | "routine";

export type Condition = { field: string; op: "lt" | "lte" | "gt" | "gte" | "eq" | "in"; value: number | string | Array<number | string> };
export type Band = { id: string; level: AlertLevel; tone: Tone; chip: Text; message: Text; when: { any?: Condition[]; all?: Condition[] } };

export type EmergencyContent = { instruction: Text; numbers: Array<{ dial: string; label: Text }>; nearest_service: Text | null };
export type RedFlagsContent = { intro: Text; symptoms: Text[]; action: Text | null };
export type BpContent = { unit: "mmHg"; bands: Band[]; repeat_rule: Text | null };
export type GlucoseContent = { unit: "mg/dL"; bands: Band[]; low_warning: { below_mg_dl: number; title: Text; message: Text } | null };
export type CompositeContent = { show_score: true; method: Text };

export type ApprovedRule<T> = { id: number; version: number; ca_ref: string; approved_at: string; content: T };

export type ClinicalConfig = {
  generated_at: string | null;
  switched_off: boolean;
  rules: {
    emergency_instruction: ApprovedRule<EmergencyContent> | null;
    red_flags: ApprovedRule<RedFlagsContent> | null;
    bp_ranges: ApprovedRule<BpContent> | null;
    glucose_ranges: ApprovedRule<GlucoseContent> | null;
    triage_rules: ApprovedRule<unknown> | null;
    composite_score: ApprovedRule<CompositeContent> | null;
  };
};

/** Everything off: what the app uses before the first fetch and when the API is unreachable with no cache. */
export const NO_APPROVED_RULES: ClinicalConfig = {
  generated_at: null,
  switched_off: true,
  rules: { emergency_instruction: null, red_flags: null, bp_ranges: null, glucose_ranges: null, triage_rules: null, composite_score: null },
};

/**
 * Minimal safe fallback while CA-01 is not approved. Uses the emergency number
 * the app already shows (912). Wording is a boss question (tracker A7 says the
 * clinical lead supplies it); the Kinyarwanda line needs a native-speaker check.
 */
export const EMERGENCY_FALLBACK: Text = {
  en: "If this is an emergency, call 912 or go to the nearest health facility.",
  rw: "Niba ari ikibazo cyihutirwa, hamagara 912 cyangwa ujye ku kigo nderabuzima kikwegereye.",
};
export const FALLBACK_NUMBERS: Array<{ dial: string; label: Text }> = [{ dial: "912", label: { en: "Emergency", rw: "Ubutabazi bwihuse" } }];

/** W6: Rwanda public helplines shown under the main number(s). Boss to confirm (docs/member-safety/DECISIONS.md D2). */
export const FALLBACK_HELPLINES: Array<{ dial: string; label: Text }> = [
  { dial: "112", label: { en: "Police and emergencies", rw: "Polisi n’ubutabazi" } },
  { dial: "114", label: { en: "RBC health hotline (free)", rw: "Umurongo wa RBC w’ubuzima (ni ubuntu)" } },
];

/** Template A8 (CA-01, CA-10): shown after every BP or glucose save while no range rule is approved. */
export const CARE_TEAM_WILL_REVIEW: Text = {
  en: "Thank you for recording this. Your care team will review it. If you feel unwell now, follow the emergency instructions in the app.",
  rw: "Murakoze kwandika iki gipimo. Itsinda ribitaho rizakireba. Niba wumva utameze neza ubu, kurikiza amabwiriza y'ubutabazi ari muri porogaramu.",
};

export const pick = (text: Text | null | undefined, lang: Lang): string => (text ? (lang === "rw" ? text.rw || text.en : text.en || text.rw) : "");

function isObj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

/** Defensive parse of the API body: anything unexpected is treated as "not approved". */
export function parseClinicalConfig(body: unknown): ClinicalConfig {
  if (!isObj(body) || !isObj(body.rules)) return NO_APPROVED_RULES;
  const rules = body.rules as Record<string, unknown>;
  const take = <T,>(key: string, ok: (c: Record<string, unknown>) => boolean): ApprovedRule<T> | null => {
    const r = rules[key];
    if (!isObj(r) || !isObj(r.content) || typeof r.version !== "number") return null;
    if (!ok(r.content)) return null;
    return { id: Number(r.id), version: r.version, ca_ref: String(r.ca_ref ?? ""), approved_at: String(r.approved_at ?? ""), content: r.content as T };
  };
  const hasBands = (c: Record<string, unknown>) => Array.isArray(c.bands) && c.bands.length > 0;
  const switchedOff = body.switched_off === true;
  if (switchedOff) return { ...NO_APPROVED_RULES, generated_at: String(body.generated_at ?? "") };
  return {
    generated_at: typeof body.generated_at === "string" ? body.generated_at : null,
    switched_off: false,
    rules: {
      emergency_instruction: take<EmergencyContent>("emergency_instruction", (c) => isObj(c.instruction) && Array.isArray(c.numbers)),
      red_flags: take<RedFlagsContent>("red_flags", (c) => Array.isArray(c.symptoms)),
      bp_ranges: take<BpContent>("bp_ranges", hasBands),
      glucose_ranges: take<GlucoseContent>("glucose_ranges", hasBands),
      triage_rules: take<unknown>("triage_rules", () => true),
      composite_score: take<CompositeContent>("composite_score", (c) => c.show_score === true),
    },
  };
}

function test(cond: Condition, values: Record<string, number | string | null | undefined>): boolean {
  const v = values[cond.field];
  if (v === null || v === undefined) return false;
  switch (cond.op) {
    case "lt": return typeof v === "number" && v < Number(cond.value);
    case "lte": return typeof v === "number" && v <= Number(cond.value);
    case "gt": return typeof v === "number" && v > Number(cond.value);
    case "gte": return typeof v === "number" && v >= Number(cond.value);
    case "eq": return v === cond.value;
    case "in": return Array.isArray(cond.value) && cond.value.includes(v);
    default: return false;
  }
}

/** First band whose conditions match, same semantics as the backend's matchBand. */
export function matchBand(bands: Band[] | null | undefined, values: Record<string, number | string | null | undefined>): Band | null {
  for (const band of bands ?? []) {
    const all = band.when?.all ?? [];
    const any = band.when?.any ?? [];
    if (!all.length && !any.length) continue;
    if (all.length && !all.every((c) => test(c, values))) continue;
    if (any.length && !any.some((c) => test(c, values))) continue;
    return band;
  }
  return null;
}

export type ReadingStatus = { chip: string; label: string; tone: Tone; level: AlertLevel; rule: string };

const statusOf = (band: Band | null, lang: Lang, rule: string): ReadingStatus | null =>
  band ? { chip: pick(band.chip, lang), label: pick(band.message, lang), tone: band.tone, level: band.level, rule } : null;

/** Approved BP band for a reading, or null (no interpretation) when CA-03 is not approved or nothing matches. */
export function bpStatus(config: ClinicalConfig, systolic: number | null | undefined, diastolic: number | null | undefined, lang: Lang): ReadingStatus | null {
  const rule = config.rules.bp_ranges;
  if (!rule || !systolic || !diastolic) return null;
  return statusOf(matchBand(rule.content.bands, { systolic, diastolic }), lang, `bp_ranges v${rule.version}`);
}

/** App glucose contexts mapped to the rule's context values. */
export function ruleGlucoseContext(context: string): string {
  switch (context) {
    case "beforeMeal": return "before_meal";
    case "afterMeal": return "after_meal";
    case "fasting":
    case "bedtime":
    case "other":
      return context;
    default: return "other";
  }
}

/** Approved glucose band for a reading, or null when CA-04 is not approved. */
export function glucoseStatus(config: ClinicalConfig, mgDl: number | null | undefined, context: string, lang: Lang): ReadingStatus | null {
  const rule = config.rules.glucose_ranges;
  if (!rule || !mgDl || mgDl <= 0) return null;
  return statusOf(matchBand(rule.content.bands, { mg_dl: mgDl, context: ruleGlucoseContext(context) }), lang, `glucose_ranges v${rule.version}`);
}

/** BL-148: the approved low-glucose warning, only when CA-04 (with low_warning) is approved and the reading is below it. */
export function lowGlucoseWarning(config: ClinicalConfig, mgDl: number, lang: Lang): { title: string; message: string; belowMgDl: number } | null {
  const low = config.rules.glucose_ranges?.content.low_warning;
  if (!low || !(mgDl > 0) || !(mgDl < low.below_mg_dl)) return null;
  return { title: pick(low.title, lang), message: pick(low.message, lang), belowMgDl: low.below_mg_dl };
}

/** CA-15: no score at all unless the composite score AND both range rules are approved. */
export function healthScoreAllowed(config: ClinicalConfig): boolean {
  return !!(config.rules.composite_score && config.rules.bp_ranges && config.rules.glucose_ranges);
}

/**
 * Score from approved bands only (tone ok/warn/bad = 40/22/10 per reading, weight logged = 20,
 * the app's existing weighting). Null when not allowed or nothing is logged.
 */
export function gatedHealthScore(config: ClinicalConfig, readings: { bp?: ReadingStatus | null; glucose?: ReadingStatus | null; weightLogged?: boolean }): number | null {
  if (!healthScoreAllowed(config)) return null;
  const weight = (s: ReadingStatus | null | undefined) => (!s ? 0 : s.tone === "ok" ? 40 : s.tone === "warn" ? 22 : 10);
  const any = !!(readings.bp || readings.glucose || readings.weightLogged);
  if (!any) return null;
  return weight(readings.bp) + weight(readings.glucose) + (readings.weightLogged ? 20 : 0);
}

export type EmergencyView = {
  approved: boolean;
  instruction: string;
  numbers: Array<{ dial: string; label: string }>;
  /** W6: 112/114, minus any the approved list already shows. */
  helplines: Array<{ dial: string; label: string }>;
  nearest: string | null;
  redFlags: { intro: string; symptoms: string[]; action: string | null } | null;
  source: string | null;
};

/** BL-010: emergency screen content. Approved CA-01/CA-02 text when present, else the minimal fallback and no red-flag list. */
export function emergencyView(config: ClinicalConfig, lang: Lang): EmergencyView {
  const em = config.rules.emergency_instruction;
  const rf = config.rules.red_flags;
  const main = em ? em.content.numbers : FALLBACK_NUMBERS;
  return {
    approved: !!em,
    instruction: em ? pick(em.content.instruction, lang) : pick(EMERGENCY_FALLBACK, lang),
    numbers: main.map((n) => ({ dial: n.dial, label: pick(n.label, lang) })),
    helplines: FALLBACK_HELPLINES.filter((h) => !main.some((n) => n.dial === h.dial)).map((n) => ({ dial: n.dial, label: pick(n.label, lang) })),
    nearest: em?.content.nearest_service ? pick(em.content.nearest_service, lang) : null,
    redFlags: rf ? { intro: pick(rf.content.intro, lang), symptoms: rf.content.symptoms.map((s) => pick(s, lang)), action: rf.content.action ? pick(rf.content.action, lang) : null } : null,
    source: [em ? `emergency_instruction v${em.version} (${em.ca_ref})` : null, rf ? `red_flags v${rf.version} (${rf.ca_ref})` : null].filter(Boolean).join(", ") || null,
  };
}

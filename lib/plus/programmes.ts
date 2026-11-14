/**
 * W12 member programme screens (BL-146/071/072): types and pure helpers over
 * /mobile/programmes and /mobile/enrolments. Kept free of React so node --test can import it.
 */

export type MemberStage =
  | "on_trial"
  | "needs_payment"
  | "payment_processing"
  | "waiting_for_care_team"
  | "active"
  | "paused"
  | "completed"
  | "withdrawn"
  | "expired";

const STAGES: MemberStage[] = ["on_trial", "needs_payment", "payment_processing", "waiting_for_care_team", "active", "paused", "completed", "withdrawn", "expired"];

export type Money = { amount: number; currency: string };

export type Programme = {
  code: string;
  name: string;
  pathway: string;
  description: string;
  price: Money;
  durationWeeks: number;
  trialDays: number;
  needsTriage: boolean;
  pilot: boolean;
  trialAvailable: boolean;
  /** W15: the join flow asks "do you use insulin?" only where it changes the rules (diabetes). */
  asksInsulin: boolean;
  myEnrolment: Enrolment | null;
};

export type Receipt = {
  number: string;
  issuer: { name: string; country: string };
  description: string;
  amount: number;
  currency: string;
  paidAt: string | null;
  method: string | null;
  reference: string;
  invoiceNumber: string | null;
};

export type ProgrammePayment = {
  reference: string;
  status: "initiated" | "paid" | "failed" | "cancelled" | "refunded";
  amount: number;
  currency: string;
  checkoutUrl: string | null;
  testPayment: boolean;
  createdAt: string | null;
  paidAt: string | null;
  refundedAt: string | null;
  receipt: Receipt | null;
};

export type Enrolment = {
  id: number;
  programme: { code: string; name: string; pathway: string; durationWeeks: number };
  status: string;
  paymentState: string;
  stage: MemberStage;
  trial: { startedAt: string; endsAt: string; daysLeft: number } | null;
  care: { active: boolean; careTeamAssigned: boolean; intakeDone: boolean; waitingFor: string[]; safetyAnswered: boolean };
  startDate: string | null;
  reviewDate: string | null;
  price: Money;
  payments: ProgrammePayment[];
};

type Raw = Record<string, unknown>;
const obj = (v: unknown): Raw => (v && typeof v === "object" && !Array.isArray(v) ? (v as Raw) : {});
const str = (v: unknown): string => (typeof v === "string" ? v : v == null ? "" : String(v));
const num = (v: unknown, d = 0): number => {
  const n = typeof v === "number" ? v : Number.parseFloat(str(v));
  return Number.isFinite(n) ? n : d;
};
const strOrNull = (v: unknown): string | null => (typeof v === "string" && v ? v : null);

function money(v: unknown): Money {
  const m = obj(v);
  return { amount: Math.round(num(m.amount)), currency: str(m.currency) || "RWF" };
}

/** The server sends `stage` (W12). Older servers do not, so derive it the same way the backend does. */
export function stageOf(raw: Raw): MemberStage {
  const given = str(raw.stage) as MemberStage;
  if (STAGES.includes(given)) return given;
  const status = str(raw.status);
  const pay = str(raw.payment_state);
  switch (status) {
    case "trial":
      return "on_trial";
    case "pending_payment":
      return pay === "pending" ? "payment_processing" : "needs_payment";
    case "enrolled":
      return "waiting_for_care_team";
    case "active_care":
      return "active";
    case "paused":
    case "completed":
    case "withdrawn":
    case "expired":
      return status;
    default:
      return "needs_payment";
  }
}

export function normalizeReceipt(v: unknown): Receipt | null {
  const r = obj(v);
  if (!r.number) return null;
  const issuer = obj(r.issuer);
  return {
    number: str(r.number),
    issuer: { name: str(issuer.name) || "Vitaway Health Ltd", country: str(issuer.country) || "Rwanda" },
    description: str(r.description),
    amount: Math.round(num(r.amount)),
    currency: str(r.currency) || "RWF",
    paidAt: strOrNull(r.paid_at),
    method: strOrNull(r.method),
    reference: str(r.reference),
    invoiceNumber: strOrNull(r.invoice_number),
  };
}

export function normalizePayment(v: unknown): ProgrammePayment {
  const p = obj(v);
  const status = str(p.status);
  return {
    reference: str(p.reference),
    status: (["initiated", "paid", "failed", "cancelled", "refunded"].includes(status) ? status : "initiated") as ProgrammePayment["status"],
    amount: Math.round(num(p.amount)),
    currency: str(p.currency) || "RWF",
    checkoutUrl: strOrNull(p.checkout_url),
    testPayment: p.test_payment === true,
    createdAt: strOrNull(p.created_at),
    paidAt: strOrNull(p.paid_at),
    refundedAt: strOrNull(p.refunded_at),
    receipt: normalizeReceipt(p.receipt),
  };
}

export function normalizeEnrolment(v: unknown): Enrolment {
  const e = obj(v);
  const prog = obj(e.programme);
  const trial = obj(e.trial);
  const care = obj(e.care);
  return {
    id: Math.round(num(e.id)),
    programme: { code: str(prog.code), name: str(prog.name), pathway: str(prog.pathway), durationWeeks: Math.round(num(prog.duration_weeks, 12)) },
    status: str(e.status),
    paymentState: str(e.payment_state),
    stage: stageOf(e),
    trial: trial.ends_at ? { startedAt: str(trial.started_at), endsAt: str(trial.ends_at), daysLeft: Math.max(0, Math.round(num(trial.days_left))) } : null,
    care: {
      active: care.active === true,
      careTeamAssigned: care.care_team_assigned === true,
      intakeDone: care.intake_done === true,
      waitingFor: Array.isArray(care.waiting_for) ? care.waiting_for.map(str) : [],
      safetyAnswered: care.safety_questions_answered === true,
    },
    startDate: strOrNull(e.start_date),
    reviewDate: strOrNull(e.review_date),
    price: money(e.price),
    payments: Array.isArray(e.payments) ? e.payments.map(normalizePayment) : [],
  };
}

export function normalizeProgramme(v: unknown): Programme {
  const p = obj(v);
  return {
    code: str(p.code),
    name: str(p.name),
    pathway: str(p.pathway),
    description: str(p.description),
    price: money(p.price),
    durationWeeks: Math.round(num(p.duration_weeks, 12)),
    trialDays: Math.round(num(p.trial_days, 14)),
    needsTriage: p.needs_triage === true,
    pilot: p.pilot === true,
    trialAvailable: p.trial_available === true,
    asksInsulin: p.asks_insulin === true || (p.asks_insulin === undefined && str(p.pathway) === "diabetes"),
    myEnrolment: p.my_enrolment ? normalizeEnrolment(p.my_enrolment) : null,
  };
}

/* ───────── W15 safety questions (BL-147) ───────── */

export type YesNo = "yes" | "no" | "";
export type SafetyAnswers = { pregnant: YesNo; eatingDisorder: YesNo; insulin: YesNo };
export const EMPTY_SAFETY: SafetyAnswers = { pregnant: "", eatingDisorder: "", insulin: "" };

/** The questions to show for one programme, in order (i18n keys). */
export function safetyQuestions(asksInsulin: boolean): Array<{ field: keyof SafetyAnswers; key: string }> {
  const qs: Array<{ field: keyof SafetyAnswers; key: string }> = [
    { field: "pregnant", key: "safety_q_pregnant" },
    { field: "eatingDisorder", key: "safety_q_eating_disorder" },
  ];
  if (asksInsulin) qs.push({ field: "insulin", key: "safety_q_insulin" });
  return qs;
}

export function safetyComplete(a: SafetyAnswers, asksInsulin: boolean): boolean {
  return safetyQuestions(asksInsulin).every((q) => a[q.field] === "yes" || a[q.field] === "no");
}

/** Body for POST /mobile/programmes/:code/{trial|enrol|redeem}. */
export function safetyPayload(a: SafetyAnswers, asksInsulin: boolean): Record<string, boolean> {
  return {
    pregnant: a.pregnant === "yes",
    eating_disorder_history: a.eatingDisorder === "yes",
    ...(asksInsulin ? { uses_insulin: a.insulin === "yes" } : {}),
  };
}

/** What the member should know after answering (i18n keys), shown before they continue. */
export function safetyNotes(a: SafetyAnswers, asksInsulin: boolean): string[] {
  const notes: string[] = [];
  if (a.pregnant === "yes" || a.eatingDisorder === "yes") notes.push("safety_note_no_weight_points");
  if (asksInsulin && a.insulin === "yes") notes.push("safety_note_doctor");
  return notes;
}

export function listOf(body: unknown): unknown[] {
  if (Array.isArray(body)) return body;
  const results = obj(body).results;
  return Array.isArray(results) ? results : [];
}

/** "60,000 RWF" */
export function formatMoney(m: Money | { amount: number; currency?: string }): string {
  return `${Math.round(m.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${m.currency || "RWF"}`;
}

/** Kigali date and time, "14 Nov 2026, 10:20" (the app is used in Rwanda; no DST). */
export function kigaliDateTime(iso: string | null): string {
  if (!iso) return "";
  const at = new Date(iso);
  if (Number.isNaN(at.getTime())) return "";
  const k = new Date(at.getTime() + 2 * 3_600_000);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${k.getUTCDate()} ${months[k.getUTCMonth()]} ${k.getUTCFullYear()}, ${String(k.getUTCHours()).padStart(2, "0")}:${String(k.getUTCMinutes()).padStart(2, "0")}`;
}

/** Stage colour on the member screens. Paid-but-not-started is amber, never green (BL-071). */
export function stageTone(stage: MemberStage): "teal" | "amber" | "orange" | "grey" | "green" {
  switch (stage) {
    case "active":
      return "green";
    case "on_trial":
      return "teal";
    case "waiting_for_care_team":
    case "payment_processing":
      return "amber";
    case "needs_payment":
    case "expired":
      return "orange";
    default:
      return "grey";
  }
}

/** The member can pay from these stages. */
export function canPay(e: Pick<Enrolment, "stage" | "paymentState">): boolean {
  if (["paid", "sponsored", "waived"].includes(e.paymentState)) return false;
  return e.stage === "on_trial" || e.stage === "needs_payment" || e.stage === "payment_processing" || e.stage === "expired";
}

/** Polling stops once the payment left "initiated". */
export function paymentSettled(p: Pick<ProgrammePayment, "status">): boolean {
  return p.status !== "initiated";
}

/** Next poll delay: every 3 s for the first minute, then every 10 s; stop after 15 minutes. */
export function nextPollMs(elapsedMs: number): number | null {
  if (elapsedMs >= 15 * 60_000) return null;
  return elapsedMs < 60_000 ? 3_000 : 10_000;
}

/** Only payments with a receipt number can open the receipt screen. */
export function receiptPayments(e: Pick<Enrolment, "payments">): ProgrammePayment[] {
  return e.payments.filter((p) => p.receipt && (p.status === "paid" || p.status === "refunded"));
}

/** Payment method in words. */
export function methodLabel(method: string | null, testPayment: boolean): string {
  if (testPayment || method === "mock") return "test";
  if (!method) return "IremboPay";
  return method.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** The doctor check only means something once payment is done (or during a trial). */
export function waitingForDoctor(e: Enrolment): boolean {
  return (e.stage === "waiting_for_care_team" || e.stage === "on_trial") && e.care.waitingFor.includes("doctor_approval");
}

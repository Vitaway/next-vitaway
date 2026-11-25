/** W27: pure helpers for the reminder preferences and consent screen (node --test). */
export type ReminderPurpose = "medicines" | "meal_photos" | "readings" | "visits" | "programme";
export type ReminderChannel = "push" | "sms";
export type Consent = { purpose: ReminderPurpose; channel: ReminderChannel; status: "granted" | "withdrawn"; notice_version: string };
export type Preferences = { quiet_start: string; quiet_end: string; daily_cap: number; opted_out: boolean; timezone: string };
export type RecentJob = { id: number; rule_key: string; rule_version: number; purpose: string; channel: string; due_local: string; status: string; suppression_reason: string | null; reason_label: string | null };
export type ReminderSettings = {
  notice: { version: string; text_en: string; text_rw: string };
  preferences: Preferences;
  purposes: ReminderPurpose[];
  consents: Consent[];
  recent: RecentJob[];
  sms_live: boolean;
};

export const MAX_CAP = 3;
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});

export function parseSettings(raw: unknown): ReminderSettings {
  const o = obj(raw);
  const n = obj(o.notice);
  const p = obj(o.preferences);
  return {
    notice: { version: String(n.version ?? ""), text_en: String(n.text_en ?? ""), text_rw: String(n.text_rw ?? "") },
    preferences: {
      quiet_start: String(p.quiet_start ?? "21:00").slice(0, 5),
      quiet_end: String(p.quiet_end ?? "07:00").slice(0, 5),
      daily_cap: Math.max(0, Math.min(MAX_CAP, Number(p.daily_cap ?? MAX_CAP))),
      opted_out: p.opted_out === true,
      timezone: String(p.timezone ?? "Africa/Kigali"),
    },
    purposes: Array.isArray(o.purposes) ? (o.purposes.map(String) as ReminderPurpose[]) : [],
    consents: Array.isArray(o.consents) ? o.consents.map(obj).map((c) => ({ purpose: String(c.purpose) as ReminderPurpose, channel: String(c.channel) as ReminderChannel, status: c.status === "granted" ? "granted" : "withdrawn", notice_version: String(c.notice_version ?? "") })) : [],
    recent: Array.isArray(o.recent)
      ? o.recent.map(obj).map((j) => ({ id: Number(j.id), rule_key: String(j.rule_key), rule_version: Number(j.rule_version), purpose: String(j.purpose), channel: String(j.channel), due_local: String(j.due_local ?? ""), status: String(j.status), suppression_reason: j.suppression_reason == null ? null : String(j.suppression_reason), reason_label: j.reason_label == null ? null : String(j.reason_label) }))
      : [],
    sms_live: o.sms_live === true,
  };
}

export function isGranted(consents: Consent[], purpose: ReminderPurpose, channel: ReminderChannel) {
  return consents.some((c) => c.purpose === purpose && c.channel === channel && c.status === "granted");
}

/** A granted consent given under an older notice should be shown as needing a fresh yes. */
export function needsRenewal(consents: Consent[], version: string) {
  return consents.some((c) => c.status === "granted" && c.notice_version && c.notice_version !== version);
}

export function validTime(v: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
}

/** "2026-11-15 13:00:00" -> "15 Nov 13:00" */
export function shortDue(dueLocal: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(dueLocal);
  if (!m) return dueLocal;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${Number(m[3])} ${months[Number(m[2]) - 1]} ${m[4]}:${m[5]}`;
}

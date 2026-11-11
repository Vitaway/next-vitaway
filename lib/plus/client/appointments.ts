"use client";

import { appointmentEnd, appointmentStart, type Appointment } from "./data";
import { MONTHS_SHORT } from "../format";

export type FullAppointment = Appointment & {
  user?: number;
  coach?: number;
  user_profile?: { first_name?: string; last_name?: string; profile_picture?: string; email?: string; medical_record_number?: string; height?: number | null } | null;
  coach_profile?: { first_name?: string; last_name?: string; profile_picture?: string; email?: string } | null;
  user_metrics?: { blood_pressure?: string | number | null; blood_glucose?: string | number | null; weight?: string | number | null } | null;
  medications?: Array<{ name?: string }> | null;
  user_documents?: Array<Record<string, unknown>> | null;
};

export const appointmentKey = (a: Appointment) => `${a.kind === "clinic" ? "clinic" : "coaching"}-${a.id}`;
export const isClinic = (a: Appointment) => a.kind === "clinic";
export const isLive = (a: Appointment) => Boolean(a.meeting_id && String(a.meeting_id).trim());

export function isUpcoming(a: Appointment): boolean {
  if (a.status !== "PENDING") return false;
  if (isLive(a)) return true;
  return appointmentEnd(a).getTime() >= Date.now();
}

export function isMissed(a: Appointment): boolean {
  if (a.status === "NO_SHOW") return true;
  if (a.status !== "PENDING") return false;
  if (isLive(a)) return false;
  return appointmentEnd(a).getTime() < Date.now();
}

export const isClosed = (a: Appointment) => ["COMPLETED", "CANCELED", "EXPIRED", "RESCHEDULED"].includes(a.status);

/** MMM dd, y */
export function fmtMMMddY(raw: string): string {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return `${MONTHS_SHORT[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}, ${d.getFullYear()}`;
}

/** DateFormat.Hm of the local clock. */
export function fmtClock(raw: string): string {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "";
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export { appointmentStart, appointmentEnd };

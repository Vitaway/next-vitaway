"use client";

import { mobileRequest } from "./api";
import { unwrapEnvelope } from "./insights";
import { invalidate, useResource } from "./use-resource";
import type { CareProfessional } from "./care-team";

export type VisitQuestion = { id: string; body: string; created_at: string; answered_at: string | null; answered_by: string | null };

const QKEY = "/api/v1/mobile/visit-questions/";

/** Questions the member saves for the next visit (the care team sees them on the record). */
export function useVisitQuestions() {
  const r = useResource<VisitQuestion[]>(QKEY, async () => unwrapEnvelope<{ questions: VisitQuestion[] }>(await mobileRequest(QKEY)).questions ?? []);
  return { ...r, list: r.data ?? [] };
}

export async function addVisitQuestion(body: string) {
  await mobileRequest(QKEY, { method: "POST", body: { body } });
  invalidate(QKEY);
}

export async function removeVisitQuestion(id: string) {
  await mobileRequest(`${QKEY}${encodeURIComponent(id)}`, { method: "DELETE" });
  invalidate(QKEY);
}

/**
 * Sends a report summary as a chat message to the member's main care-team contact (no public link:
 * the report stays inside Vitaway, where the care team already sees the same readings). Answers the room id.
 */
export async function shareWithCareTeam(pro: CareProfessional, text: string): Promise<number | null> {
  const res = unwrapEnvelope<{ conversation?: { room_id?: number } } | null>(await mobileRequest("/api/v1/mobile/care/conversations", { method: "POST", body: { professional_id: pro.id } }));
  const room = res?.conversation?.room_id ?? null;
  if (!room) return null;
  const form = new FormData();
  form.append("body", text);
  await mobileRequest(`/api/v1/mobile/chat/rooms/${room}/messages`, { method: "POST", form });
  invalidate("chat:");
  return room;
}

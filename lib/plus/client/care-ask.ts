"use client";

import { mobileRequest } from "./api";
import { unwrapEnvelope } from "./insights";
import { invalidate } from "./use-resource";

/**
 * POST /mobile/care/ask: routes a topic to whoever is on duty (food → nutritionist, medicines → pharmacist,
 * readings and symptoms → nurse). Answers the chat room to open, or null when nobody could be reached.
 */
export async function askCareTeam(topic: "food" | "medicines" | "sugar" | "bp" | "symptoms" | "other"): Promise<number | null> {
  const res = unwrapEnvelope<{ conversation?: { room_id?: number } } | null>(await mobileRequest("/api/v1/mobile/care/ask", { method: "POST", body: { topic } }));
  invalidate("chat:");
  return res?.conversation?.room_id ?? null;
}

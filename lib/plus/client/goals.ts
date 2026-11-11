"use client";

import { asList, mobileRequest } from "./api";
import { invalidate, useResource } from "./use-resource";

export type Goal = { id: number; user: number; type: string; systolic: number | null; diastolic: number | null; value: number | null };

function normalizeGoal(raw: Record<string, unknown>): Goal {
  const num = (v: unknown) => (v === null || v === undefined || v === "" ? null : Number.isFinite(Number(v)) ? Number(v) : null);
  return { id: Number(raw.id) || 0, user: Number(raw.user) || 0, type: String(raw.type ?? "weight"), systolic: num(raw.systolic), diastolic: num(raw.diastolic), value: num(raw.value) };
}

export function useGoals() {
  const res = useResource<Goal[]>("/health-goals/", async () => asList<Record<string, unknown>>(await mobileRequest("/health-goals/")).map(normalizeGoal));
  const goals = res.data ?? [];
  const weightGoal = [...goals].reverse().find((g) => g.type === "weight") ?? null;
  return { ...res, goals, weightGoal };
}

/** SetGoalModal._save: update the existing weight goal or create one. */
export async function saveWeightGoal(userId: number, existing: Goal | null, value: number): Promise<void> {
  if (existing && existing.id > 0) {
    await mobileRequest(`/health-goals/${existing.id}/`, { method: "PUT", body: { user: existing.user, type: "weight", systolic: null, diastolic: null, value } });
  } else {
    await mobileRequest("/health-goals/", { method: "POST", body: { user: userId, type: "weight", systolic: null, diastolic: null, value } });
  }
  invalidate("/health-goals/");
}

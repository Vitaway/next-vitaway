"use client";

import { asList, mobileRequest } from "./api";
import { invalidate, useResource } from "./use-resource";
import {
  normalizeAdherence,
  normalizeMedication,
  withEffectiveTodaySlots,
  type Medication,
  type MedicationAdherence,
  type MedicationDayHistory,
} from "../medication";

export function useMedications() {
  const r = useResource<Medication[]>("/medications/", async () => asList<Record<string, unknown>>(await mobileRequest("/medications/")).map(normalizeMedication));
  return { ...r, list: r.data ?? [] };
}

export function useTodayMedications() {
  const r = useResource<Medication[]>("/medications/today/", async () =>
    asList<Record<string, unknown>>(await mobileRequest("/medications/today/")).map(normalizeMedication),
  );
  return { ...r, list: (r.data ?? []).map((m) => withEffectiveTodaySlots(m)) };
}

export function useAdherence(days = 7) {
  const key = `/medications/adherence/?days=${days}`;
  return useResource<MedicationAdherence>(key, async () => normalizeAdherence((await mobileRequest<Record<string, unknown>>(key)) ?? {}));
}

export function useMedicationHistory(id: number | null, days = 30) {
  const key = id ? `/medications/${id}/history/?days=${days}` : null;
  return useResource<MedicationDayHistory[]>(key, async () => {
    const body = await mobileRequest<{ days?: Array<{ date?: string; slots?: Array<Record<string, unknown>> }> }>(key as string);
    return (body?.days ?? []).map((d) => ({
      date: String(d.date ?? ""),
      slots: (d.slots ?? []).map((s) => ({ time: String(s.time ?? ""), status: String(s.status ?? "upcoming"), taken_at: s.taken_at ? String(s.taken_at) : null })),
    }));
  });
}

export function refreshMedications(): void {
  invalidate("/medications");
}

export async function markDose(medicationId: number, date: string, time: string, status: "taken" | "missed"): Promise<void> {
  await mobileRequest(`/medications/${medicationId}/doses/`, { method: "POST", body: { date, time, status } });
  refreshMedications();
}

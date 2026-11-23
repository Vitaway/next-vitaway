"use client";

import { mobileRequest } from "./api";
import { useResource } from "./use-resource";

/** One professional from GET /api/v1/mobile/care-team (care team plan CT2). */
export type CareProfessional = {
  id: string;
  account_id: number | null;
  name: string;
  avatar_url: string | null;
  discipline: string;
  role_label: { en: string; rw: string };
  clinician: boolean;
  council: string | null;
  council_name: string | null;
  licence_number: string | null;
  verified: boolean;
  languages: string[];
  helps_with: string | null;
  status: "online" | "busy" | "off";
  eta: { en: string; rw: string };
  mine: boolean;
  can_message: boolean;
};

export type CareTeam = { mine: CareProfessional[]; on_duty: CareProfessional[]; online_count: number };

/**
 * The care team with licence, languages and Online/Busy/Off. The Support cards and the profile sheet read it by
 * app account id. A failure is quiet: the cards still work from the chat directory, just without status.
 */
export function useCareTeam() {
  const resource = useResource<CareTeam>("chat:care-team", async () => {
    try {
      return await mobileRequest<CareTeam>("/api/v1/mobile/care-team");
    } catch {
      return { mine: [], on_duty: [], online_count: 0 };
    }
  }, { maxAgeMs: 60_000, pollMs: 60_000 });
  const byAccount = new Map<number, CareProfessional>();
  for (const pro of [...(resource.data?.mine ?? []), ...(resource.data?.on_duty ?? [])]) {
    if (pro.account_id != null) byAccount.set(pro.account_id, pro);
  }
  return { ...resource, byAccount };
}

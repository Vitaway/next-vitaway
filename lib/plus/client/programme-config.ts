"use client";

import { useResource } from "./use-resource";
import { mobileRequest } from "./api";
import { DEFAULT_CONFIG, parseProgrammeConfig, type ProgrammeConfig } from "../programme-config";

export const PROGRAMME_CONFIG_KEY = "/api/v1/mobile/programme-config";

/**
 * W13: what Home shows, from the member's programmes. Until it loads, or if the server is older or
 * offline, Home keeps its usual layout. Not cached on the device: programme names are health information.
 */
export function useProgrammeConfig(): { config: ProgrammeConfig; loading: boolean } {
  const { data, loading } = useResource<ProgrammeConfig>(
    PROGRAMME_CONFIG_KEY,
    async () => {
      try {
        return parseProgrammeConfig(await mobileRequest<unknown>(PROGRAMME_CONFIG_KEY + "/"));
      } catch {
        return DEFAULT_CONFIG;
      }
    },
    { maxAgeMs: 60_000 },
  );
  return { config: data ?? DEFAULT_CONFIG, loading };
}

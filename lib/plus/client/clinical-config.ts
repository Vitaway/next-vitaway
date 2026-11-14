"use client";

import { useResource } from "./use-resource";
import { mobileRequest } from "./api";
import { NO_APPROVED_RULES, parseClinicalConfig, type ClinicalConfig } from "../clinical-rules";

const CACHE_KEY = "vitaway.plus.clinical-config";

function cached(): ClinicalConfig | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? parseClinicalConfig(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

async function fetchConfig(): Promise<ClinicalConfig> {
  try {
    const body = await mobileRequest<unknown>("/api/v1/mobile/clinical-config", { anonymous: true });
    try {
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(body));
    } catch {
      /* storage full or blocked: fine, just no offline copy */
    }
    return parseClinicalConfig(body);
  } catch {
    // Offline: last approved config we saw (BL-010 "works offline once loaded"), else everything off.
    return cached() ?? NO_APPROVED_RULES;
  }
}

/** Approved clinical rules. Until loaded, and on any failure without a cache, nothing is approved. */
export function useClinicalConfig(): ClinicalConfig {
  const { data } = useResource<ClinicalConfig>("clinical-config", fetchConfig, { maxAgeMs: 60_000 });
  return data ?? NO_APPROVED_RULES;
}

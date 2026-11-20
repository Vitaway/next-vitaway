"use client";

import { mobileRequest } from "./api";
import { invalidate } from "./use-resource";
import { dartStamp, newUuid } from "../health";

export type NewReading = {
  type: "glucose" | "bp" | "weight";
  name: string;
  unit: string;
  systolic: number;
  diastolic: number;
  latestValue: string;
  stamp: Date;
  fullness: number;
};

/** POST the canonical metrics path so a cookie session reaches the API through the /api/v1 rewrite. */
export async function saveReading(reading: NewReading): Promise<void> {
  await mobileRequest("/api/v1/mobile/health/metrics", {
    method: "POST",
    body: {
      unique_id: newUuid(),
      type: reading.type,
      name: reading.name,
      unit: reading.unit,
      systolic: reading.systolic,
      diastolic: reading.diastolic,
      latestValue: reading.latestValue,
      lastUpdated: dartStamp(reading.stamp),
      fullness: reading.fullness,
    },
  });
  invalidate("/api/v1/mobile/health/metrics");
}

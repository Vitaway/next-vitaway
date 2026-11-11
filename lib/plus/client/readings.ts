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

/** POST /health-metrics/ with the same body HealthMetric.toJson() sends. */
export async function saveReading(reading: NewReading): Promise<void> {
  await mobileRequest("/health-metrics/", {
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
  invalidate("/health-metrics/");
}

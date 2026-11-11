"use client";

import { useCallback, useEffect, useState } from "react";

export type GlucoseUnit = "mg" | "mmol";
const KEY = "vitaway.plus.glucoseUnit";
const listeners = new Set<(unit: GlucoseUnit) => void>();

function read(): GlucoseUnit {
  if (typeof window === "undefined") return "mg";
  return window.localStorage.getItem(KEY) === "mmol" ? "mmol" : "mg";
}

/** Preferred glucose unit (UnitProvider.preferredGlucoseMetric). Defaults to mg/dL. */
export function useGlucoseUnit(): [GlucoseUnit, (unit: GlucoseUnit) => void] {
  const [unit, setUnit] = useState<GlucoseUnit>("mg");
  useEffect(() => {
    setUnit(read());
    listeners.add(setUnit);
    return () => {
      listeners.delete(setUnit);
    };
  }, []);
  const update = useCallback((next: GlucoseUnit) => {
    window.localStorage.setItem(KEY, next);
    listeners.forEach((listener) => listener(next));
  }, []);
  return [unit, update];
}

export function glucoseUnitLabel(unit: GlucoseUnit): string {
  return unit === "mg" ? "mg/dL" : "mmol/L";
}

export function formatGlucose(mg: number, unit: GlucoseUnit): string {
  return unit === "mg" ? mg.toFixed(0) : (mg / 18).toFixed(1);
}

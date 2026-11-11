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

/* Height, weight and A1c display units (UnitProvider), kept on this device like the app does. */
export type HeightUnit = "cm" | "in";
export type WeightUnit = "kg" | "lbs";
export type A1cUnit = "percent" | "mmol";
const prefListeners = new Map<string, Set<(v: string) => void>>();

function usePref<T extends string>(key: string, allowed: readonly T[], fallback: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(fallback);
  useEffect(() => {
    const saved = window.localStorage.getItem(key) as T | null;
    setValue(saved && allowed.includes(saved) ? saved : fallback);
    const set = prefListeners.get(key) ?? new Set();
    const listener = (v: string) => setValue(v as T);
    set.add(listener);
    prefListeners.set(key, set);
    return () => {
      set.delete(listener);
    };
  }, [key, allowed, fallback]);
  const update = useCallback(
    (next: T) => {
      window.localStorage.setItem(key, next);
      prefListeners.get(key)?.forEach((l) => l(next));
    },
    [key],
  );
  return [value, update];
}

const HEIGHTS = ["cm", "in"] as const;
const WEIGHTS = ["kg", "lbs"] as const;
const A1CS = ["percent", "mmol"] as const;
export const useHeightUnit = () => usePref<HeightUnit>("vitaway.plus.heightUnit", HEIGHTS, "cm");
export const useWeightUnit = () => usePref<WeightUnit>("vitaway.plus.weightUnit", WEIGHTS, "kg");
export const useA1cUnit = () => usePref<A1cUnit>("vitaway.plus.a1cUnit", A1CS, "percent");
export const convertHeight = (cm: number, unit: HeightUnit) => (unit === "in" ? cm * 0.393701 : cm);
export const convertWeight = (kg: number, unit: WeightUnit) => (unit === "lbs" ? kg * 2.20462 : kg);

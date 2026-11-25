"use client";

import { FOOD_GROUPS } from "@/lib/plus/meal-review-logic";

export type PlateFood = { grams: number | null; group_code: string | null };

/** Drinks (milk and dairy drinks, beverages) are drawn as a glass at the edge instead of on the plate. */
const isDrink = (g: string | null) => g === "12" || g === "06";

/**
 * A plate drawn from what was eaten (one coloured circle per food, sized by weight): the picture for a meal typed in
 * without a photo. Colours come from the MiraFood food groups, the same ones the food picker uses.
 */
export function PlateDrawing({ foods, size = 64 }: { foods: PlateFood[]; size?: number }) {
  const onPlate = foods.filter((f) => !isDrink(f.group_code));
  const drinks = foods.filter((f) => isDrink(f.group_code));
  const n = onPlate.length;
  return (
    <svg viewBox="0 0 160 160" width={size} height={size} aria-hidden="true" style={{ display: "block", maxWidth: "100%", maxHeight: "100%" }}>
      <circle cx="80" cy="85" r="72" fill="rgba(0,0,0,.08)" />
      <circle cx="80" cy="80" r="72" fill="#fff" stroke="#D5DAD2" />
      <circle cx="80" cy="80" r="56" fill="#F7F8F5" stroke="#E6E9E3" />
      {onPlate.map((f, i) => {
        const g = f.grams ?? 100;
        const r = Math.min(30, 9 + Math.sqrt(g) * 1.25);
        const a = (i / Math.max(n, 1)) * Math.PI * 2 - Math.PI / 2;
        const d = n > 1 ? 27 : 0;
        const color = FOOD_GROUPS[f.group_code ?? ""]?.color ?? "#B5B7AE";
        return <circle key={i} cx={(80 + Math.cos(a) * d).toFixed(1)} cy={(80 + Math.sin(a) * d).toFixed(1)} r={r.toFixed(1)} fill={color} stroke="rgba(0,0,0,.14)" />;
      })}
      {drinks.length ? <rect x="130" y="8" width="22" height="32" rx="5" fill="#BFE3F5" stroke="#8DBFD8" /> : null}
    </svg>
  );
}

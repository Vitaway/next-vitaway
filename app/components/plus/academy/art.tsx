"use client";

import { PLATE_SVG, PROGRAMME_ART, RECIPE_ART, SCENES, SCENE_BG, WEEK_ART } from "./art-data";

/** A flat illustration scene (16:9.5). Static, trusted SVG from the Academy design. */
export function Art({ scene, label, play = false, className }: { scene: string; label?: string; play?: boolean; className?: string }) {
  const body = SCENES[scene] ?? SCENES.plate;
  const bg = SCENE_BG[scene] ?? "#FFF3E2";
  const overlay = play ? '<circle cx="160" cy="95" r="30" fill="rgba(0,62,72,.85)"/><path d="M152 80v30l24-15z" fill="#fff"/>' : "";
  return (
    <svg
      viewBox="0 0 320 190"
      className={className ?? "ac-art"}
      role="img"
      aria-label={label || "Illustration"}
      preserveAspectRatio="xMidYMid slice"
      dangerouslySetInnerHTML={{ __html: `<rect width="320" height="190" fill="${bg}"/>${body}${overlay}` }}
    />
  );
}

export const weekScene = (week: number | null | undefined) => WEEK_ART[Math.max(0, Math.min(11, (week || 1) - 1))];
export const programmeScene = (course: string) => PROGRAMME_ART[course] ?? "plate";
export const recipeScene = (type: string) => RECIPE_ART[type] ?? "pot";

/** The plate used by tap-to-reveal tips (numbers are positioned over it). */
export function PlateArt() {
  return <div className="ac-plate" dangerouslySetInnerHTML={{ __html: PLATE_SVG }} />;
}

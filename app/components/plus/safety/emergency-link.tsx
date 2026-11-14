"use client";

import { Call } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";

/** BL-010: one tap to the emergency screen from BP entry, glucose entry, care and home. */
export function EmergencyLink({ style }: { style?: React.CSSProperties }) {
  const t = useT();
  const { push } = usePlusPaths();
  return (
    <button
      type="button"
      onClick={() => push("/emergency")}
      data-testid="emergency-link"
      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 999, background: "var(--vc-danger-soft)", color: "#C62828", fontSize: 13, fontWeight: 800, ...style }}
    >
      <Call size={15} variant="Bold" color="currentColor" /> {t("emergency_open")}
    </button>
  );
}

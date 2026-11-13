"use client";

import { Call } from "iconsax-react";
import { useLanguage } from "@/lib/plus/i18n";
import { useTheme } from "@/lib/plus/theme";
import { emergencyView } from "@/lib/plus/clinical-rules";
import { useClinicalConfig } from "@/lib/plus/client/clinical-config";
import { ActionButton } from "../ui/vita";

/**
 * BL-148 low-glucose warning. Only reachable when an approved CA-04 rule carries a
 * low_warning and the saved reading is below its threshold. Title and message are the
 * approved text; the call buttons are the approved CA-01 numbers (or the 912 fallback).
 */
export default function LowGlucoseCrisis({ mgDl, title, message, onDone }: { mgDl: number; title: string; message: string; onDone: () => void }) {
  const { dark } = useTheme();
  const { t, language } = useLanguage();
  const emergency = emergencyView(useClinicalConfig(), language);
  const danger = dark ? "#F08A7C" : "#C62828";
  const tint = dark ? "#3A1D19" : "#FCE8E8";
  return (
    <div className="vita-page" data-testid="low-glucose-warning" style={{ padding: "calc(env(safe-area-inset-top) + 12px) 20px calc(env(safe-area-inset-bottom) + 16px)" }}>
      <div style={{ flex: 1 }}>
        <div style={{ padding: 18, borderRadius: 8, background: tint, color: danger }}>
          <p style={{ margin: 0, fontWeight: 800, fontSize: 24, lineHeight: 1.15 }}>{title}</p>
          <p style={{ margin: "8px 0 0", fontWeight: 900, fontSize: 40, lineHeight: 1.05 }}>{mgDl} mg/dL</p>
        </div>
        <div style={{ marginTop: 14, padding: 18, borderRadius: 8, background: "var(--vc-surface)", color: "var(--vc-navy)", fontSize: 15, lineHeight: 1.45, fontWeight: 600, whiteSpace: "pre-line" }}>{message}</div>
        <div style={{ marginTop: 12, padding: 14, borderRadius: 8, background: tint, border: `1px solid ${danger}59`, color: "var(--vc-navy)", fontSize: 14, lineHeight: 1.4, fontWeight: 600 }}>{emergency.instruction}</div>
      </div>
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {emergency.numbers.map((n) => (
          <ActionButton key={n.dial} full tone="danger" label={`${n.label} ${n.dial}`} icon={<Call size={16} color="currentColor" />} onClick={() => void (window.location.href = `tel:${n.dial}`)} />
        ))}
        <ActionButton full tone="white" label={t("done")} onClick={onDone} />
      </div>
    </div>
  );
}

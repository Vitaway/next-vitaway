"use client";

import { TickCircle } from "iconsax-react";
import { useLanguage } from "@/lib/plus/i18n";
import { CARE_TEAM_WILL_REVIEW, pick, type ReadingStatus } from "@/lib/plus/clinical-rules";
import { ActionButton } from "../ui/vita";
import { EmergencyLink } from "./emergency-link";

/**
 * BL-012 after a BP or glucose save. No approved rule: template A8 (no interpretation).
 * Approved CA-03/CA-04 rule: that rule's band message.
 */
export default function ReadingSaved({ value, status, onDone }: { value: string; status: ReadingStatus | null; onDone: () => void }) {
  const { t, language } = useLanguage();
  const fg = !status ? "var(--vc-navy)" : status.tone === "bad" ? "#C62828" : status.tone === "warn" ? "#7A4A00" : "#0B6A4C";
  return (
    <div className="vita-page" data-testid="reading-saved" style={{ padding: "calc(env(safe-area-inset-top) + 24px) 20px calc(env(safe-area-inset-bottom) + 16px)" }}>
      <div style={{ flex: 1 }}>
        <span style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--vc-tile-mint)", color: "#0B6A4C", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <TickCircle size={30} variant="Bold" color="currentColor" />
        </span>
        <p style={{ margin: "16px 0 0", fontSize: 24, fontWeight: 800, color: "var(--vc-ink)" }}>{t("health_metric_saved")}</p>
        <p style={{ margin: "6px 0 0", fontSize: 30, fontWeight: 900, color: "var(--vc-ink)" }}>{value}</p>
        <div style={{ marginTop: 16, padding: 16, borderRadius: 8, background: "var(--vc-surface)", color: fg }}>
          {status ? <p style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 15 }}>{status.chip}</p> : null}
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.45, fontWeight: 600, color: "var(--vc-navy)" }}>{status ? status.label : pick(CARE_TEAM_WILL_REVIEW, language)}</p>
          {status ? <p style={{ margin: "8px 0 0", fontSize: 11, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.5)" }}>{t("approved_rule_source", { rule: status.rule })}</p> : null}
        </div>
        <EmergencyLink style={{ marginTop: 16 }} />
      </div>
      <ActionButton full label={t("done")} onClick={onDone} />
    </div>
  );
}

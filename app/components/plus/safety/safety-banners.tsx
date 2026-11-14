"use client";

import { Call, Danger } from "iconsax-react";
import { useLanguage } from "@/lib/plus/i18n";
import { emergencyView } from "@/lib/plus/clinical-rules";
import { useClinicalConfig } from "@/lib/plus/client/clinical-config";
import { usePlusPaths } from "@/lib/plus/plus-paths";

/** The first emergency number: the approved CA-01 one, else 912. */
export function useEmergencyDial() {
  const { language } = useLanguage();
  return emergencyView(useClinicalConfig(), language).numbers[0]?.dial ?? "912";
}

/** safety_banners.dart ChatSafetyBanner: members only, above the chat messages. */
export function ChatSafetyBanner() {
  const { t } = useLanguage();
  const { push } = usePlusPaths();
  const dial = useEmergencyDial();
  return (
    <button
      type="button"
      data-testid="chat-safety-banner"
      onClick={() => push("/emergency")}
      style={{ flex: "none", width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "var(--vc-danger-soft)", textAlign: "left" }}
    >
      <Danger size={20} variant="Bold" color="#C62828" style={{ flex: "none" }} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 13, fontWeight: 800, color: "#C62828" }}>{t("chat_safety_title", { number: dial })}</span>
        <span style={{ display: "block", marginTop: 2, fontSize: 12, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.7)" }}>{t("chat_safety_reply")}</span>
      </span>
    </button>
  );
}

/** safety_banners.dart SupportUrgentBanner: members only, at the top of Support. */
export function SupportUrgentBanner() {
  const { t } = useLanguage();
  const { push } = usePlusPaths();
  const dial = useEmergencyDial();
  return (
    <div style={{ padding: "12px 16px 0", flex: "none" }}>
      <button
        type="button"
        data-testid="support-urgent-banner"
        onClick={() => push("/emergency")}
        className="vita-tap"
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: "var(--vc-danger-soft)", textAlign: "left" }}
      >
        <span style={{ width: 36, height: 36, borderRadius: 999, background: "#C62828", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          <Call size={18} variant="Bold" color="currentColor" />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 14, fontWeight: 800, color: "#C62828" }}>{t("support_urgent_title")}</span>
          <span style={{ display: "block", marginTop: 2, fontSize: 12.5, fontWeight: 600, lineHeight: 1.35, color: "rgba(var(--vc-navy-rgb),0.75)" }}>{t("support_urgent_body", { number: dial })}</span>
        </span>
      </button>
    </div>
  );
}

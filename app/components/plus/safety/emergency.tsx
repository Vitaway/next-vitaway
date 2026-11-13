"use client";

import { Call, Danger, Hospital } from "iconsax-react";
import { useLanguage } from "@/lib/plus/i18n";
import { useTheme } from "@/lib/plus/theme";
import { emergencyView } from "@/lib/plus/clinical-rules";
import { useClinicalConfig } from "@/lib/plus/client/clinical-config";
import { AppBar, Page } from "../ui/vita";

/**
 * BL-010 emergency screen (English and Kinyarwanda). Text and numbers come from the
 * approved CA-01 rule and the red-flag list from the approved CA-02 rule. Until they are
 * approved it shows only the minimal fallback with the 912 number and no symptom list.
 * Content is cached on the device so it works offline once loaded.
 */
export default function EmergencyScreen() {
  const { t, language, setLanguage } = useLanguage();
  const { dark } = useTheme();
  const view = emergencyView(useClinicalConfig(), language);
  const danger = dark ? "#F08A7C" : "#C62828";
  const tint = dark ? "#3A1D19" : "#FCE8E8";
  return (
    <Page backdrop>
      <AppBar title={t("emergency_title")} />
      <div className="vita-scroll" data-testid="emergency-screen" data-approved={view.approved ? "yes" : "no"} style={{ padding: "16px 18px calc(env(safe-area-inset-bottom) + 32px)" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
          {(["en", "rw"] as const).map((code) => (
            <button key={code} type="button" onClick={() => setLanguage(code)} style={{ padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 800, background: language === code ? "var(--vc-teal)" : "var(--vc-surface)", color: language === code ? "#fff" : "var(--vc-ink)" }}>
              {code === "en" ? "English" : "Kinyarwanda"}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: 18, borderRadius: 10, background: tint, color: danger, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <Danger size={26} variant="Bold" color="currentColor" style={{ flex: "none" }} />
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.4, fontWeight: 800, color: "var(--vc-ink)" }}>{view.instruction}</p>
        </div>
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          {view.numbers.map((n) => (
            <a
              key={n.dial}
              href={`tel:${n.dial}`}
              data-testid={`call-${n.dial}`}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderRadius: 10, background: danger, color: "#fff", textDecoration: "none" }}
            >
              <Call size={22} variant="Bold" color="currentColor" />
              <span style={{ flex: 1, fontSize: 16, fontWeight: 800 }}>{n.label}</span>
              <span style={{ fontSize: 22, fontWeight: 900 }}>{t("emergency_call", { number: n.dial })}</span>
            </a>
          ))}
        </div>
        {view.nearest ? (
          <div style={{ marginTop: 14, padding: 16, borderRadius: 10, background: "var(--vc-surface)", display: "flex", gap: 12, alignItems: "flex-start", color: "var(--vc-navy)" }}>
            <Hospital size={22} color="currentColor" style={{ flex: "none" }} />
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.45, fontWeight: 600 }}>{view.nearest}</p>
          </div>
        ) : null}
        {view.redFlags ? (
          <div data-testid="red-flags" style={{ marginTop: 18, padding: 16, borderRadius: 10, background: "var(--vc-surface)" }}>
            <p style={{ margin: 0, fontSize: 15.5, fontWeight: 800, color: "var(--vc-ink)" }}>{view.redFlags.intro}</p>
            <ul style={{ margin: "10px 0 0", paddingLeft: 20, color: "var(--vc-navy)", fontSize: 14.5, lineHeight: 1.5, fontWeight: 600 }}>
              {view.redFlags.symptoms.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            {view.redFlags.action ? <p style={{ margin: "10px 0 0", fontSize: 14, fontWeight: 700, color: danger }}>{view.redFlags.action}</p> : null}
          </div>
        ) : null}
        {view.source ? (
          <p style={{ margin: "18px 0 0", fontSize: 11, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.45)" }}>{t("approved_rule_source", { rule: view.source })}</p>
        ) : null}
      </div>
    </Page>
  );
}

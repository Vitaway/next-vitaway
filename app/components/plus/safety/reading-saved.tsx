"use client";

import { useState } from "react";
import { Call, Chart, Messages2, Refresh, TickCircle } from "@/lib/plus/icons";
import { useLanguage } from "@/lib/plus/i18n";
import { useTheme } from "@/lib/plus/theme";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { CARE_TEAM_WILL_REVIEW, emergencyView, pick, type ReadingStatus } from "@/lib/plus/clinical-rules";
import { useClinicalConfig } from "@/lib/plus/client/clinical-config";
import { askCareTeam } from "@/lib/plus/client/care-ask";
import { ActionButton, useFeedback } from "../ui/vita";
import { EmergencyLink } from "./emergency-link";

export type SavedKind = "bp" | "glucose" | "weight";

/**
 * After every saved reading (BL-012). No approved rule: template A8 (no interpretation).
 * Approved CA-03/CA-04 rule: that rule's band. An urgent band gets its own path: measure again,
 * call the approved emergency numbers, or reach the nurse on duty, instead of a quiet "Done".
 */
export default function ReadingSaved({
  value,
  status,
  kind,
  note,
  onDone,
  onMeasureAgain,
}: {
  value: string;
  status: ReadingStatus | null;
  kind?: SavedKind;
  /** Plain line shown when there is no rule to apply (e.g. weight: change since the last reading). */
  note?: { title: string; body: string } | null;
  onDone: () => void;
  onMeasureAgain?: () => void;
}) {
  const { t, language } = useLanguage();
  const { dark } = useTheme();
  const { push } = usePlusPaths();
  const { toast } = useFeedback();
  const emergency = emergencyView(useClinicalConfig(), language);
  const [asking, setAsking] = useState(false);
  const urgent = status?.level === "urgent";
  const danger = dark ? "#F08A7C" : "#C62828";
  const tint = dark ? "#3A1D19" : "#FCE8E8";
  const fg = !status ? "var(--vc-navy)" : status.tone === "bad" ? danger : status.tone === "warn" ? (dark ? "#E9B65C" : "#7A4A00") : dark ? "#6FD3A6" : "#0B6A4C";

  const messageNurse = async () => {
    setAsking(true);
    try {
      const room = await askCareTeam(kind === "glucose" ? "sugar" : "bp");
      if (room) push(`/chat/${room}`);
      else push("/care");
    } catch {
      toast(t("rs_nurse_failed"), { error: true });
      push("/care");
    }
    setAsking(false);
  };

  return (
    <div className="vita-page w-narrow" data-testid={urgent ? "reading-urgent" : "reading-saved"} style={{ padding: "calc(env(safe-area-inset-top) + 24px) 20px calc(env(safe-area-inset-bottom) + 16px)" }}>
      <div style={{ flex: 1 }}>
        {urgent ? (
          <div style={{ padding: 18, borderRadius: 8, background: tint, color: danger }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 22, lineHeight: 1.2 }}>{status!.chip}</p>
            <p style={{ margin: "8px 0 0", fontWeight: 900, fontSize: 38, lineHeight: 1.05 }}>{value}</p>
            <p style={{ margin: "6px 0 0", fontSize: 13, fontWeight: 700, opacity: 0.85 }}>{t("rs_saved_shared")}</p>
          </div>
        ) : (
          <>
            <span style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--vc-tile-mint)", color: "#0B6A4C", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TickCircle size={30} variant="Bold" color="currentColor" />
            </span>
            <p style={{ margin: "16px 0 0", fontSize: 24, fontWeight: 800, color: "var(--vc-ink)" }}>{t("health_metric_saved")}</p>
            <p style={{ margin: "6px 0 0", fontSize: 30, fontWeight: 900, color: "var(--vc-ink)" }}>{value}</p>
          </>
        )}
        <div style={{ marginTop: 16, padding: 16, borderRadius: 8, background: "var(--vc-surface)", color: fg }}>
          {status ? <p style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 15 }}>{urgent ? t("rs_what_to_do") : status.chip}</p> : note ? <p style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 15 }}>{note.title}</p> : null}
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.45, fontWeight: 600, color: "var(--vc-navy)", whiteSpace: "pre-line" }}>{status ? status.label : note ? note.body : pick(CARE_TEAM_WILL_REVIEW, language)}</p>
          {status ? <p style={{ margin: "8px 0 0", fontSize: 13, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.5)" }}>{t("approved_rule_source", { rule: status.rule })}</p> : null}
        </div>
        {urgent ? (
          <div style={{ marginTop: 12, padding: 14, borderRadius: 8, background: tint, border: `1px solid ${danger}59`, color: "var(--vc-navy)", fontSize: 14, lineHeight: 1.4, fontWeight: 600 }}>{emergency.instruction}</div>
        ) : (
          <EmergencyLink style={{ marginTop: 16 }} />
        )}
      </div>
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {urgent ? (
          <>
            {emergency.numbers.map((n) => (
              <ActionButton key={n.dial} full tone="danger" label={`${n.label} ${n.dial}`} icon={<Call size={16} color="currentColor" />} onClick={() => void (window.location.href = `tel:${n.dial}`)} />
            ))}
            <ActionButton full tone="white" label={t("rs_message_nurse")} icon={<Messages2 size={16} color="currentColor" />} loading={asking} onClick={() => void messageNurse()} />
            {onMeasureAgain ? <ActionButton full tone="white" label={t("rs_measure_again")} icon={<Refresh size={16} color="currentColor" />} onClick={onMeasureAgain} /> : null}
            <ActionButton full tone="white" label={t("done")} onClick={onDone} />
          </>
        ) : (
          <>
            {kind ? <ActionButton full label={t("rs_see_trend")} icon={<Chart size={16} color="currentColor" />} onClick={() => push(`/metrics/${kind}`)} /> : null}
            <ActionButton full tone={kind ? "white" : undefined} label={t("done")} onClick={onDone} />
          </>
        )}
      </div>
    </div>
  );
}

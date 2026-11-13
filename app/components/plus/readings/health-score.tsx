"use client";

import { useState } from "react";
import { Heart, MessageQuestion } from "iconsax-react";
import { useMetrics } from "@/lib/plus/client/data";
import { glucoseContextFromFullness, latestByType, parseStamp } from "@/lib/plus/health";
import { bpStatus, gatedHealthScore, glucoseStatus, healthScoreAllowed, pick } from "@/lib/plus/clinical-rules";
import { useClinicalConfig } from "@/lib/plus/client/clinical-config";
import { useLanguage } from "@/lib/plus/i18n";
import { EmergencyLink } from "../safety/emergency-link";
import { fmtDMMMHm } from "@/lib/plus/format";
import { ActionButton, AppBar, CircleButton, Modal } from "../ui/vita";

function Ring({ progress }: { progress: number }) {
  const size = 280;
  const r = size / 2 - 16;
  const c = size / 2;
  const start = Math.PI * 0.75;
  const sweep = Math.PI * 1.5;
  const arc = (frac: number) => {
    const end = start + sweep * Math.min(1, Math.max(0, frac));
    const x1 = c + r * Math.cos(start);
    const y1 = c + r * Math.sin(start);
    const x2 = c + r * Math.cos(end);
    const y2 = c + r * Math.sin(end);
    const large = end - start > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: "absolute", inset: 0, margin: "auto" }} aria-hidden>
      <path d={arc(1)} fill="none" stroke="var(--vc-tile-mint)" strokeWidth={18} strokeLinecap="round" />
      {progress > 0 ? <path d={arc(progress)} fill="none" stroke="var(--vc-teal-ink)" strokeWidth={18} strokeLinecap="round" /> : null}
    </svg>
  );
}

/** CA-15: no wellness score until the composite score and both range rules are approved. */
export default function HealthScoreScreen() {
  const { t, language } = useLanguage();
  const clinical = useClinicalConfig();
  const { metrics } = useMetrics();
  const [help, setHelp] = useState(false);
  const latest = latestByType(metrics);
  const allowed = healthScoreAllowed(clinical);
  const mg = Math.round(Number.parseFloat(latest.glucose?.latest_value ?? "") || 0);
  const glucoseView = latest.glucose ? glucoseStatus(clinical, mg, glucoseContextFromFullness(latest.glucose.fullness), language) : null;
  const bpView = latest.bp ? bpStatus(clinical, latest.bp.systolic, latest.bp.diastolic, language) : null;
  const points = gatedHealthScore(clinical, { bp: bpView, glucose: glucoseView, weightLogged: (Number.parseFloat(latest.weight?.latest_value ?? "") || 0) > 0 });
  let updatedAt: Date | null = null;
  for (const m of [latest.glucose, latest.bp, latest.weight]) {
    const d = m ? parseStamp(m.last_updated) : null;
    if (d && (!updatedAt || d > updatedAt)) updatedAt = d;
  }
  const method = pick(clinical.rules.composite_score?.content.method, language);

  if (!allowed) {
    return (
      <div className="vita-page" data-testid="health-score-hidden">
        <AppBar title={t("health_score")} bubbles={false} />
        <div className="vita-scroll" style={{ padding: "28px 22px 32px", textAlign: "center" }}>
          <span style={{ margin: "0 auto", width: 64, height: 64, borderRadius: "50%", background: "var(--vc-mint)", color: "var(--vc-teal)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Heart size={28} variant="Bold" color="currentColor" />
          </span>
          <p style={{ margin: "18px 0 0", fontSize: 20, fontWeight: 800, color: "var(--vc-ink)" }}>{t("health_score_hidden_title")}</p>
          <p style={{ margin: "10px 0 0", fontSize: 14.5, lineHeight: 1.45, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.7)" }}>{t("health_score_hidden_body")}</p>
          <EmergencyLink style={{ marginTop: 22 }} />
        </div>
      </div>
    );
  }

  const updated = updatedAt ? `Last updated ${fmtDMMMHm(updatedAt)}` : "Not logged yet";
  return (
    <div className="vita-page">
      <AppBar
        title={t("health_score")}
        bubbles={false}
        actions={
          <CircleButton label="How this score works" onClick={() => setHelp(true)} background="transparent" color="#fff">
            <MessageQuestion size={22} color="currentColor" />
          </CircleButton>
        }
      />
      <div className="vita-scroll" style={{ padding: "12px 22px 32px" }}>
        <div style={{ position: "relative", height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ring progress={(points ?? 0) / 100} />
          <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: 64, lineHeight: 1, fontWeight: 800, color: "var(--vc-ink)", letterSpacing: -1.5 }}>{points === null ? "—" : points}</span>
            <span style={{ marginTop: 6, fontWeight: 700, fontSize: 14, color: "rgba(var(--vc-navy-rgb),0.55)" }}>Out of 100</span>
          </div>
        </div>
        <p style={{ margin: 0, textAlign: "center", fontWeight: 600, fontSize: 13, color: "rgba(var(--vc-navy-rgb),0.55)" }}>{updated}</p>
        <p style={{ margin: "12px 0 0", textAlign: "center", fontSize: 13, lineHeight: 1.4, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.62)" }}>{method}</p>
      </div>
      <Modal open={help} title="How this score works" compact onClose={() => setHelp(false)} actions={<ActionButton small label="Close" onClick={() => setHelp(false)} />}>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45, color: "var(--vc-navy)" }}>{method}</p>
      </Modal>
    </div>
  );
}

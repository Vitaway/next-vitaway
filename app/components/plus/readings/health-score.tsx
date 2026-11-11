"use client";

import { useState } from "react";
import { Heart, MessageQuestion } from "iconsax-react";
import { useMetrics } from "@/lib/plus/client/data";
import { healthScoreFrom, latestByType } from "@/lib/plus/health";
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

function Band({ range, title, open, body }: { range: string; title: string; open: boolean; body: string }) {
  return (
    <div style={{ padding: 16, borderRadius: 8, background: "var(--vc-surface)" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: open ? "var(--vc-mint)" : "var(--vc-action)" }} />
        <span style={{ marginLeft: 8, fontWeight: 800, fontSize: 14, color: "var(--vc-ink)" }}>{range}</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontWeight: 700, fontSize: 14, color: "rgba(var(--vc-navy-rgb),0.7)" }}>{title}</span>
      </div>
      {open ? <p style={{ margin: "10px 0 0", color: "rgba(var(--vc-navy-rgb),0.7)", lineHeight: 1.35, fontSize: 13.5 }}>{body}</p> : null}
    </div>
  );
}

export default function HealthScoreScreen() {
  const { metrics } = useMetrics();
  const [help, setHelp] = useState(false);
  const latest = latestByType(metrics);
  const score = healthScoreFrom({ glucose: latest.glucose, bloodPressure: latest.bp, weight: latest.weight });
  const points = score.points;
  const updated = score.updated ? `Last updated ${fmtDMMMHm(score.updated)}` : "Not logged yet";
  return (
    <div className="vita-page">
      <AppBar
        title="Health score"
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
            <span style={{ marginTop: 10, width: 36, height: 36, borderRadius: "50%", background: "var(--vc-mint)", color: "var(--vc-teal)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Heart size={18} variant="Bold" color="currentColor" />
            </span>
          </div>
        </div>
        <p style={{ margin: 0, textAlign: "center", fontWeight: 600, fontSize: 13, color: "rgba(var(--vc-navy-rgb),0.55)" }}>{updated}</p>
        <p style={{ margin: "18px 0 0", textAlign: "center", fontSize: 18, lineHeight: 1.35, fontWeight: 700, color: "var(--vc-ink)" }}>{score.sentence}</p>
        <p style={{ margin: "12px 0 0", textAlign: "center", fontSize: 13, lineHeight: 1.4, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.62)" }}>
          This score only summarizes readings you logged. It is not a diagnosis or a substitute for your care team.
        </p>
        <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 10 }}>
          <Band range="80 – 100" title="Readings in range" open={points !== null && points >= 80} body="Latest glucose and blood pressure are in a comfortable range." />
          <Band range="50 – 79" title="On track" open={points !== null && points >= 50 && points < 80} body="Some readings are in range. Keep logging so the score can move." />
          <Band range="0 – 49" title="Needs a check" open={points !== null && points < 50} body="A recent reading is outside the usual target. Your care team can help you read it." />
        </div>
      </div>
      <Modal open={help} title="How this score works" compact onClose={() => setHelp(false)} actions={<ActionButton small label="Close" onClick={() => setHelp(false)} />}>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45, color: "var(--vc-navy)" }}>
          The score uses the glucose, blood pressure, and weight you have logged. It is not a diagnosis or medical advice.
        </p>
      </Modal>
    </div>
  );
}

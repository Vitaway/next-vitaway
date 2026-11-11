"use client";

import { Alarm, Call } from "iconsax-react";
import { useTheme } from "@/lib/plus/theme";
import { ActionButton } from "../ui/vita";

function Step({ n, text }: { n: number; text: string }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#003E48", color: "#fff", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{n}</span>
      <span style={{ flex: 1, color: "var(--vc-navy)", fontSize: 14, lineHeight: 1.4, fontWeight: 600 }}>{text}</span>
    </div>
  );
}

/** GlucoseLowCrisisPage: shown after saving a reading under 70 mg/dL. */
export default function LowGlucoseCrisis({ mgDl, onDone }: { mgDl: number; onDone: () => void }) {
  const { dark } = useTheme();
  const danger = dark ? "#F08A7C" : "#C62828";
  const tint = dark ? "#3A1D19" : "#FCE8E8";
  return (
    <div className="vita-page" style={{ padding: "calc(env(safe-area-inset-top) + 12px) 20px calc(env(safe-area-inset-bottom) + 16px)" }}>
      <div style={{ flex: 1 }}>
        <div style={{ padding: 18, borderRadius: 8, background: tint, color: danger }}>
          <p style={{ margin: 0, fontWeight: 800, fontSize: 13, letterSpacing: 0.6 }}>ACT NOW</p>
          <p style={{ margin: "6px 0 0", fontWeight: 800, fontSize: 24, lineHeight: 1.15 }}>Your glucose is low</p>
          <p style={{ margin: "8px 0 0", fontWeight: 900, fontSize: 40, lineHeight: 1.05 }}>{mgDl} mg/dL</p>
        </div>
        <div style={{ marginTop: 14, padding: 18, borderRadius: 8, background: "var(--vc-surface)", display: "flex", flexDirection: "column", gap: 14 }}>
          <Step n={1} text="Have 15 g of fast sugar now: half a glass of juice or soda, or 3 teaspoons of sugar in water." />
          <Step n={2} text="Sit down and rest. Check again in 15 minutes." />
          <Step n={3} text="Still under 70? Repeat once, then call the clinic." />
        </div>
        <p style={{ margin: "12px 0 0", color: "rgba(var(--vc-navy-rgb),0.72)", fontSize: 13, lineHeight: 1.4, fontWeight: 600 }}>
          This is first-aid guidance for a low reading you logged. It is not a diagnosis. If you are unsure, or you feel worse, call emergency services.
        </p>
        <div style={{ marginTop: 12, padding: 14, borderRadius: 8, background: tint, border: `1px solid ${danger}59`, color: "var(--vc-navy)", fontSize: 14, lineHeight: 1.4, fontWeight: 600 }}>
          Call <span style={{ color: danger, fontWeight: 800 }}>912</span> now if you feel confused, very drowsy, faint, or cannot eat or drink.
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <ActionButton full label="Remind me to recheck in 15 min" icon={<Alarm size={16} color="currentColor" />} onClick={onDone} />
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <ActionButton full tone="white" label="Clinic +250 795 767 405" icon={<Call size={16} color="currentColor" />} onClick={() => void (window.location.href = "tel:+250795767405")} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <ActionButton full tone="danger" label="Emergency 912" icon={<Call size={16} color="currentColor" />} onClick={() => void (window.location.href = "tel:912")} />
          </div>
        </div>
      </div>
    </div>
  );
}

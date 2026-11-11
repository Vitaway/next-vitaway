"use client";

import { ArrowRight3, Calendar1 } from "iconsax-react";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { AppBar, Page } from "../ui/vita";
import { VisitReportsList } from "./visit-reports";

const TABS = [
  { label: "Visit summaries", path: "" },
  { label: "Progress notes", path: "/notes" },
  { label: "Meal plans", path: "/meal-plans" },
  { label: "Documents", path: "/documents" },
];

/** MyCarePage — visit summaries, progress notes, meal plans, documents. */
export default function MyCareScreen() {
  const { push } = usePlusPaths();
  const tab = 0;
  return (
    <Page backdrop>
      <AppBar title="My care" back={false} />
      <div className="vita-scroll with-dock" style={{ padding: "16px 18px calc(env(safe-area-inset-bottom) + 104px)" }}>
        <p style={{ margin: 0, fontSize: 14, color: "rgba(var(--vc-navy-rgb),0.6)" }}>Your clinic plan, visits, and documents.</p>
        <div style={{ marginTop: 18, padding: 16, borderRadius: 10, background: "var(--vc-surface)", boxShadow: "var(--vc-card-shadow)", display: "flex", alignItems: "center" }}>
          <span style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--vc-teal)", color: "var(--vc-mint)", fontWeight: 800, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>V</span>
          <div style={{ marginLeft: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: "var(--vc-ink)" }}>Vitaway Nutrition Clinic</div>
            <div style={{ fontSize: 12.5, color: "rgba(var(--vc-navy-rgb),0.55)" }}>Kicukiro · your clinic record</div>
          </div>
        </div>
        <div className="vita-hide-scroll" style={{ marginTop: 16, display: "flex", gap: 8, overflowX: "auto" }}>
          {TABS.map((t, i) => {
            const on = tab === i;
            return (
              <button
                key={t.label}
                type="button"
                onClick={() => (i === 0 ? undefined : push(t.path))}
                style={{ flex: "none", padding: "8px 14px", borderRadius: 8, fontSize: 12.5, fontWeight: 700, background: on ? "var(--vc-teal)" : "var(--vc-surface)", color: on ? "#fff" : "var(--vc-ink)", border: `1px solid ${on ? "var(--vc-teal)" : "rgba(var(--vc-navy-rgb),0.12)"}` }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <div style={{ height: 14 }} />
        <VisitReportsList embedded />
        <div style={{ height: 8 }} />
        <button type="button" className="vita-tap" onClick={() => push("/appointments")} style={{ width: "100%", textAlign: "left", marginBottom: 10, padding: 14, borderRadius: 10, background: "var(--vc-surface)", display: "flex", alignItems: "center", color: "var(--vc-navy)" }}>
          <span style={{ width: 40, height: 40, borderRadius: 8, background: "var(--vc-wash)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <Calendar1 size={20} color="currentColor" />
          </span>
          <span style={{ marginLeft: 12, flex: 1 }}>
            <span style={{ display: "block", fontWeight: 800, fontSize: 15, color: "var(--vc-ink)" }}>Appointments</span>
            <span style={{ display: "block", fontSize: 12.5, color: "rgba(var(--vc-navy-rgb),0.55)" }}>Upcoming and past visits</span>
          </span>
          <span style={{ color: "rgba(var(--vc-navy-rgb),0.35)", display: "inline-flex" }}>
            <ArrowRight3 size={22} color="currentColor" />
          </span>
        </button>
      </div>
    </Page>
  );
}

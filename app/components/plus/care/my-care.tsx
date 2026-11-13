"use client";

import { ArrowRight3, Calendar1, Health } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { AppBar, Page } from "../ui/vita";
import { VisitReportsList } from "./visit-reports";
import { EmergencyLink } from "../safety/emergency-link";

const TABS = [
  { label: "care_tab_visit_summaries", path: "" },
  { label: "care_tab_progress_notes", path: "/notes" },
  { label: "care_tab_meal_plans", path: "/meal-plans" },
  { label: "care_tab_meal_photos", path: "/meal-photos" },
  { label: "care_tab_documents", path: "/documents" },
];

function LinkRow({ icon, title, subtitle, onClick }: { icon: React.ReactNode; title: string; subtitle: string; onClick: () => void }) {
  return (
    <button type="button" className="vita-tap" onClick={onClick} style={{ width: "100%", textAlign: "left", marginBottom: 10, padding: 14, borderRadius: 10, background: "var(--vc-surface)", display: "flex", alignItems: "center", color: "var(--vc-navy)" }}>
      <span style={{ width: 40, height: 40, borderRadius: 8, background: "var(--vc-wash)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{icon}</span>
      <span style={{ marginLeft: 12, flex: 1 }}>
        <span style={{ display: "block", fontWeight: 800, fontSize: 15, color: "var(--vc-ink)" }}>{title}</span>
        <span style={{ display: "block", fontSize: 12.5, color: "rgba(var(--vc-navy-rgb),0.55)" }}>{subtitle}</span>
      </span>
      <span style={{ color: "rgba(var(--vc-navy-rgb),0.35)", display: "inline-flex" }}>
        <ArrowRight3 size={22} color="currentColor" />
      </span>
    </button>
  );
}

/** MyCarePage — visit summaries, progress notes, meal plans, documents. */
export default function MyCareScreen() {
  const t = useT();
  const { push } = usePlusPaths();
  const tab = 0;
  return (
    <Page backdrop>
      <AppBar title={t("my_care")} back={false} />
      <div className="vita-scroll with-dock" style={{ padding: "16px 18px calc(env(safe-area-inset-bottom) + 104px)" }}>
        <p style={{ margin: 0, fontSize: 14, color: "rgba(var(--vc-navy-rgb),0.6)" }}>{t("my_care_subtitle")}</p>
        <div style={{ marginTop: 12 }}>
          <EmergencyLink />
        </div>
        <div style={{ marginTop: 18, padding: 16, borderRadius: 10, background: "var(--vc-surface)", boxShadow: "var(--vc-card-shadow)", display: "flex", alignItems: "center" }}>
          <span style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--vc-teal)", color: "var(--vc-mint)", fontWeight: 800, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>V</span>
          <div style={{ marginLeft: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: "var(--vc-ink)" }}>{t("my_care_clinic_name")}</div>
            <div style={{ fontSize: 12.5, color: "rgba(var(--vc-navy-rgb),0.55)" }}>{t("my_care_clinic_record")}</div>
          </div>
        </div>
        <div className="vita-hide-scroll" style={{ marginTop: 16, display: "flex", gap: 8, overflowX: "auto" }}>
          {TABS.map((tabItem, i) => {
            const on = tab === i;
            return (
              <button
                key={tabItem.label}
                type="button"
                onClick={() => (i === 0 ? undefined : push(tabItem.path))}
                style={{ flex: "none", padding: "8px 14px", borderRadius: 8, fontSize: 12.5, fontWeight: 700, background: on ? "var(--vc-teal)" : "var(--vc-surface)", color: on ? "#fff" : "var(--vc-ink)", border: `1px solid ${on ? "var(--vc-teal)" : "rgba(var(--vc-navy-rgb),0.12)"}` }}
              >
                {t(tabItem.label)}
              </button>
            );
          })}
        </div>
        <div style={{ height: 14 }} />
        <VisitReportsList embedded />
        <div style={{ height: 8 }} />
        {/* BL-122: the Pillbox is reachable from the Care card (Flutter my_care_page.dart). */}
        <LinkRow icon={<Health size={20} color="currentColor" />} title={t("pillbox")} subtitle={t("pillbox_subtitle")} onClick={() => push("/medications")} />
        <LinkRow icon={<Calendar1 size={20} color="currentColor" />} title={t("appointments_title")} subtitle={t("appointments_subtitle")} onClick={() => push("/appointments")} />
      </div>
    </Page>
  );
}

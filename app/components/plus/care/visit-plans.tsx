"use client";

import { ArrowRight3, Printer, TaskSquare } from "iconsax-react";
import { useLanguage } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { mobileRequest } from "@/lib/plus/client/api";
import { useResource } from "@/lib/plus/client/use-resource";
import { normalizeVisitPlan, normalizeVisitPlans, planDate, planIn, planItem, VISIT_PLANS_PATH, type VisitPlan } from "@/lib/plus/visit-plans";
import { AppBar, CenterSpinner, EmptyState } from "../ui/vita";

const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;

export function useVisitPlans() {
  return useResource<VisitPlan[]>(VISIT_PLANS_PATH, async () => normalizeVisitPlans(await mobileRequest(VISIT_PLANS_PATH)));
}

/** W19: take-home plans, shown above the visit reports (and under My care). Hidden when there are none. */
export function VisitPlansList() {
  const { t, language } = useLanguage();
  const { push } = usePlusPaths();
  const r = useVisitPlans();
  const plans = r.data ?? [];
  if (!plans.length) return null;
  return (
    <div data-testid="visit-plans" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0.4, color: navyA(0.6) }}>{t("visit_plans_title", undefined, "Take-home plans")}</div>
      {plans.map((p) => (
        <button
          key={p.id}
          type="button"
          className="vita-tap"
          onClick={() => push(`/visit-reports/plans/${p.id}`)}
          style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", padding: 18, borderRadius: 10, background: "var(--vc-surface)", border: "1.4px solid color-mix(in srgb, var(--vc-teal) 40%, transparent)", color: "var(--vc-navy)" }}
        >
          <span style={{ width: 44, height: 44, borderRadius: 8, background: "var(--vc-tile-mint)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <TaskSquare size={21} color="currentColor" />
          </span>
          <span style={{ marginLeft: 14, flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontSize: 16, fontWeight: 800 }}>{language === "rw" ? p.title.rw : p.title.en}</span>
            <span style={{ display: "block", marginTop: 4, fontSize: 12, fontWeight: 600, color: navyA(0.55) }}>
              {[planDate(p.visitDate), p.clinician].filter(Boolean).join(" · ")}
            </span>
            {p.nextVisit ? <span style={{ display: "block", marginTop: 2, fontSize: 12, fontWeight: 700, color: "var(--vc-teal)" }}>{t("visit_plans_next", { date: planDate(p.nextVisit) }, `Next visit: ${planDate(p.nextVisit)}`)}</span> : null}
          </span>
          {!p.read ? <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--vc-action)", marginRight: 6 }} /> : null}
          <span style={{ color: navyA(0.35), display: "inline-flex" }}>
            <ArrowRight3 size={22} color="currentColor" />
          </span>
        </button>
      ))}
    </div>
  );
}

const TINTS = ["var(--vc-tile-mint)", "var(--vc-tile-sage)", "var(--vc-surface)", "var(--vc-tile-peach)"];

export function VisitPlanScreen({ id }: { id: number }) {
  const { t, language } = useLanguage();
  const r = useResource<VisitPlan>(`${VISIT_PLANS_PATH}${id}`, async () => normalizeVisitPlan(await mobileRequest(`${VISIT_PLANS_PATH}${id}`)));
  const plan = r.data;
  const body = plan ? planIn(plan, language) : null;
  return (
    <div className="vita-page">
      <AppBar title={t("visit_plan_screen_title", undefined, "Your take-home plan")} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        {r.error && !plan ? (
          <EmptyState title={t("visit_plan_load_failed", undefined, "Could not open this plan")} subtitle={t("network_error")} />
        ) : !plan || !body ? (
          <CenterSpinner />
        ) : (
          <div style={{ padding: "8px 20px 32px" }} data-testid="visit-plan">
            <div style={{ marginBottom: 14, padding: 20, borderRadius: 10, background: "var(--vc-teal)" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{body.title}</div>
              <div style={{ marginTop: 6, fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
                {[planDate(plan.visitDate), plan.clinician ? t("visit_plan_with", { name: plan.clinician }, `with ${plan.clinician}`) : null].filter(Boolean).join(" · ")}
              </div>
            </div>
            {body.draftNote ? (
              <div style={{ marginBottom: 12, padding: "10px 14px", borderRadius: 10, background: "var(--vc-chip-amber, var(--vc-tile-peach))", fontSize: 12.5, lineHeight: 1.4, color: "var(--vc-ink)" }}>{body.draftNote}</div>
            ) : null}
            {body.sections.map((s, i) => (
              <div key={s.heading} style={{ marginBottom: 12, padding: 16, borderRadius: 10, background: TINTS[i % TINTS.length], border: TINTS[i % TINTS.length] === "var(--vc-surface)" ? `1px solid ${navyA(0.06)}` : undefined }}>
                <div style={{ fontSize: 11, letterSpacing: 0.6, fontWeight: 700, color: navyA(0.6) }}>{s.heading.toUpperCase()}</div>
                {s.items.length ? (
                  <ul style={{ margin: "8px 0 0", paddingLeft: s.items.length > 1 ? 18 : 0, listStyle: s.items.length > 1 ? "disc" : "none" }}>
                    {s.items.map((item) => (
                      <li key={item} style={{ fontSize: 15, lineHeight: 1.5, color: "var(--vc-navy)", marginTop: 2 }}>{planItem(item)}</li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ marginTop: 8, fontSize: 14, color: navyA(0.5) }}>{t("visit_plan_none", undefined, "Nothing this visit")}</div>
                )}
              </div>
            ))}
            <p style={{ margin: "14px 0 0", fontSize: 12.5, lineHeight: 1.45, color: navyA(0.55), display: "flex", gap: 8 }}>
              <Printer size={16} color="currentColor" style={{ flex: "none", marginTop: 1 }} />
              {t("visit_plan_paper_note", undefined, "Your care team can also print this plan for you at the clinic.")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

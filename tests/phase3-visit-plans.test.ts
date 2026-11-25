// Phase 3 W19 (BL-169): take-home plans in the PWA. Run: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { normalizeVisitPlan, normalizeVisitPlans, planDate, planIn, planItem } from "../lib/plus/visit-plans.ts";

const detail = {
  id: 1, visit_id: 1, visit_date: "2026-11-13", next_visit: "2026-12-11", clinician: "Grace", read: false, language: "rw",
  title: { en: "Your plan from today's visit", rw: "Gahunda yawe y'uyu munsi" },
  plan: {
    en: { title: "Your plan from today's visit", draft_note: null, sections: [{ heading: "Your goals", items: ["Water not soda · 2026-12-01"] }, { heading: "Next visit", items: ["2026-12-11"] }, { heading: "", items: ["dropped"] }] },
    rw: { title: "Gahunda yawe y'uyu munsi", draft_note: "Draft (CA-22)", sections: [{ heading: "Intego zawe", items: ["Amazi", "  "] }] },
  },
};

test("list and detail parse; list items carry no plan body", () => {
  const list = normalizeVisitPlans({ results: [{ ...detail, plan: undefined }, { id: 0 }] });
  assert.equal(list.length, 1);
  assert.equal(list[0].plan, null);
  assert.equal(list[0].nextVisit, "2026-12-11");
  const p = normalizeVisitPlan(detail);
  assert.equal(p.plan?.en.sections.length, 2, "sections without a heading are dropped");
  assert.deepEqual(p.plan?.rw.sections[0].items, ["Amazi"]);
});

test("the app language picks the plan; dates read as dates", () => {
  const p = normalizeVisitPlan(detail);
  assert.equal(planIn(p, "rw")?.draftNote, "Draft (CA-22)");
  assert.equal(planIn(p, "en")?.title, "Your plan from today's visit");
  assert.equal(planDate("2026-12-11"), "11 Dec 2026");
  assert.equal(planItem("Water not soda · 2026-12-01"), "Water not soda · 1 Dec 2026");
});

test("visit reports show the plans first, and the new strings exist in en and rw", () => {
  const ui = readFileSync("app/components/plus/care/visit-reports.tsx", "utf8");
  assert.match(ui, /<VisitPlansList \/>/);
  for (const lang of ["en", "rw"]) {
    const d = JSON.parse(readFileSync(`lib/plus/i18n/${lang}.json`, "utf8"));
    for (const k of ["visit_plans_title", "visit_plans_next", "visit_plan_screen_title", "visit_plan_load_failed", "visit_plan_with", "visit_plan_none", "visit_plan_paper_note"]) assert.ok(d[k], `${lang} ${k}`);
  }
});

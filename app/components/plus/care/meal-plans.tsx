"use client";

import { useState } from "react";
import { ArrowRight3, Calendar1, DocumentText1, InfoCircle, NoteText, Reserve } from "iconsax-react";
import { MEAL_DAY_NAMES, MEAL_SLOT_LABELS, mealPlanPdf, mealPlanUploaded, useMealPlans, type MealPlan } from "@/lib/plus/client/care";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { ActionButton, AppBar, Card, CenterSpinner, EmptyState } from "../ui/vita";
import { useDocumentReader } from "../ui/document-reader";

const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;

function PlanCard({ plan, onOpen }: { plan: MealPlan; onOpen: () => void }) {
  const uploaded = mealPlanUploaded(plan);
  const hasDates = Boolean(plan.startDate || plan.endDate);
  return (
    <button type="button" className="vita-tap" onClick={onOpen} style={{ width: "100%", textAlign: "left", padding: 18, borderRadius: 10, background: "var(--vc-surface)", border: `1px solid ${navyA(0.06)}`, color: "var(--vc-navy)" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ width: 44, height: 44, borderRadius: 8, background: uploaded ? "var(--vc-tile-peach)" : "var(--vc-tile-mint)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          {uploaded ? <DocumentText1 size={21} color="currentColor" /> : <Reserve size={21} color="currentColor" />}
        </span>
        <span style={{ marginLeft: 14, flex: 1, fontSize: 16, lineHeight: 1.3, fontWeight: 800, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{plan.title}</span>
        <span style={{ color: navyA(0.35), display: "inline-flex" }}>
          <ArrowRight3 size={22} color="currentColor" />
        </span>
      </div>
      {hasDates ? (
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: navyA(0.5) }}>
          <Calendar1 size={13} color="currentColor" />
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{`${plan.startDate}  –  ${plan.endDate}`}</span>
        </div>
      ) : null}
      {plan.notes ? <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.45, color: navyA(0.6), display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{plan.notes}</div> : null}
      <span style={{ display: "inline-block", marginTop: 14, padding: "7px 12px", borderRadius: 999, background: navyA(0.05), fontSize: 11, fontWeight: 700, color: navyA(0.6) }}>{uploaded ? "Uploaded document" : `${plan.items.length} meal entries`}</span>
    </button>
  );
}

export function MealPlansScreen() {
  const { plans, loading, error, reload } = useMealPlans();
  const { push } = usePlusPaths();
  return (
    <div className="vita-page">
      <AppBar title="Meal plans" />
      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <CenterSpinner />
        ) : error && !plans.length ? (
          <EmptyState title="Could not load meal plans" subtitle="Check your connection and try again." actionLabel="Try again" onAction={reload} />
        ) : !plans.length ? (
          <EmptyState title="No meal plans yet" subtitle="Your coach has not assigned a meal plan yet. Check back soon." />
        ) : (
          <div style={{ padding: "8px 20px 32px", display: "flex", flexDirection: "column", gap: 12 }}>
            {plans.map((p) => (
              <PlanCard key={p.id} plan={p} onOpen={() => push(`/meal-plans/${p.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", color: "var(--vc-navy)" }}>
      <span style={{ display: "inline-flex", flex: "none" }}>{icon}</span>
      <span style={{ marginLeft: 10, fontSize: 13, lineHeight: 1.45, fontWeight: 500, whiteSpace: "pre-wrap", color: navyA(0.7) }}>{text}</span>
    </div>
  );
}

function DayTable({ dayIndex, slots }: { dayIndex: number; slots: Map<number, string> }) {
  const rows = [0, 1, 2, 3, 4, 5].filter((i) => (slots.get(i) ?? "") !== "");
  if (!rows.length) return null;
  const name = dayIndex >= 0 && dayIndex < 7 ? MEAL_DAY_NAMES[dayIndex] : `Day ${dayIndex}`;
  const th = { padding: "9px 10px", fontSize: 11, fontWeight: 800, letterSpacing: 0.3, color: "var(--vc-navy)" };
  return (
    <div style={{ marginBottom: 16, borderRadius: 10, overflow: "hidden", background: "var(--vc-surface)", border: `1px solid ${navyA(0.06)}` }}>
      <div style={{ background: "var(--vc-teal)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.7)" }}>
        <Calendar1 size={13} color="currentColor" />
        <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: 0.2 }}>{name}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "max-content 1fr" }}>
        <div style={{ ...th, background: "var(--vc-tile-mint)" }}>Time</div>
        <div style={{ ...th, background: "var(--vc-tile-mint)" }}>Meal</div>
        {rows.map((slot, ri) => {
          const bg = ri % 2 === 0 ? "var(--vc-surface)" : "var(--vc-canvas)";
          const line = `1px solid ${navyA(0.06)}`;
          return [
            <div key={`t${slot}`} style={{ background: bg, borderTop: line, padding: 10, fontSize: 11, fontWeight: 700, color: navyA(0.55) }}>{MEAL_SLOT_LABELS[slot]}</div>,
            <div key={`m${slot}`} style={{ background: bg, borderTop: line, padding: 10, fontSize: 13, lineHeight: 1.45, fontWeight: 500, color: navyA(0.78), whiteSpace: "pre-wrap" }}>{slots.get(slot)}</div>,
          ];
        })}
      </div>
    </div>
  );
}

export function MealPlanScreen({ id }: { id: number }) {
  const { plans, loading } = useMealPlans();
  const plan = plans.find((p) => p.id === id);
  const reader = useDocumentReader();
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  if (loading) return <div className="vita-page"><AppBar title="Meal plans" /><CenterSpinner /></div>;
  if (!plan) return <div className="vita-page"><AppBar title="Meal plans" /><EmptyState title="No meal plans yet" subtitle="Your coach has not assigned a meal plan yet. Check back soon." /></div>;
  const meta = (
    <Card>
      {plan.startDate || plan.endDate ? <InfoRow icon={<Calendar1 size={16} color="currentColor" />} text={`${plan.startDate}  –  ${plan.endDate}`} /> : null}
      {plan.notes ? <div style={{ marginTop: 8 }}><InfoRow icon={<NoteText size={16} color="currentColor" />} text={plan.notes} /></div> : null}
      {plan.guidelines ? <div style={{ marginTop: 8 }}><InfoRow icon={<InfoCircle size={16} color="currentColor" />} text={plan.guidelines} /></div> : null}
    </Card>
  );
  const openPdf = async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      await reader.open({ title: plan.title, filename: `meal_plan_${plan.id}.pdf`, load: () => mealPlanPdf(plan.id) });
    } catch {
      setDownloadError("Could not load document. Please try again.");
    } finally {
      setDownloading(false);
    }
  };
  const grid = new Map<number, Map<number, string>>();
  for (const item of plan.items) {
    if (!item.mealDescription) continue;
    if (!grid.has(item.dayIndex)) grid.set(item.dayIndex, new Map());
    grid.get(item.dayIndex)!.set(item.slotIndex, item.mealDescription);
  }
  const days = [...grid.keys()].sort((a, b) => a - b);
  return (
    <div className="vita-page">
      <AppBar title={plan.title} />
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 24px" }}>
        {meta}
        <div style={{ height: 20 }} />
        {mealPlanUploaded(plan) ? (
          <Card padding={24}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <span style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--vc-tile-peach)", color: "var(--vc-navy)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <DocumentText1 size={32} color="currentColor" />
              </span>
              <div style={{ marginTop: 16, fontSize: 16, fontWeight: 800, color: "var(--vc-navy)" }}>PDF document</div>
              <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.45, color: navyA(0.55) }}>Your meal plan is an uploaded document.</div>
              {downloadError ? <div style={{ marginTop: 14, width: "100%", padding: "10px 12px", borderRadius: 8, background: "var(--vc-danger-soft)", color: "var(--vc-danger)", fontSize: 13, fontWeight: 600 }}>{downloadError}</div> : null}
              <div style={{ marginTop: 22, width: "100%" }}>
                <ActionButton full label={downloading ? "Loading…" : "View PDF"} loading={downloading} icon={<DocumentText1 size={18} color="currentColor" />} onClick={openPdf} />
              </div>
            </div>
          </Card>
        ) : days.length === 0 ? (
          <div style={{ padding: "40px 0" }}>
            <EmptyState title="No meal entries in this plan" />
          </div>
        ) : (
          days.map((d) => <DayTable key={d} dayIndex={d} slots={grid.get(d)!} />)
        )}
      </div>
    </div>
  );
}

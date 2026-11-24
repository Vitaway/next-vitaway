"use client";

import { useLanguage } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { mobileRequest } from "@/lib/plus/client/api";
import { unwrapEnvelope } from "@/lib/plus/client/insights";
import { useResource } from "@/lib/plus/client/use-resource";
import { MEAL_SLOT_LABELS, useMealPlans } from "@/lib/plus/client/care";
import type { MealPhoto } from "@/lib/plus/meal-photos";

type Target = { kind: string; goal: number | null; source: string };

function useFoodTargets() {
  const r = useResource<Target[]>("/api/v1/mobile/targets/", async () => unwrapEnvelope<{ targets: Target[] }>(await mobileRequest("/api/v1/mobile/targets/")).targets ?? [], { maxAgeMs: 300_000 });
  const of = (k: string) => r.data?.find((x) => x.kind === k) ?? null;
  return { protein: of("protein"), fibre: of("fibre") };
}

const sameDay = (iso: string, d = new Date()) => {
  const x = new Date(iso);
  return x.getFullYear() === d.getFullYear() && x.getMonth() === d.getMonth() && x.getDate() === d.getDate();
};

/**
 * Nutrition · Today vs your targets: protein and fibre from today's meals (never calories, never a score).
 * Numbers are estimates until the nutritionist checks the meal; the card says so.
 */
export function FoodTargetsCard({ rows }: { rows: MealPhoto[] }) {
  const { t } = useLanguage();
  const { protein, fibre } = useFoodTargets();
  const today = rows.filter((m) => sameDay(m.eaten_at || m.created_at));
  const sum = (k: "protein_g" | "fibre_g") => Math.round(today.reduce((a, m) => a + (m.totals?.[k] ?? 0), 0));
  const p = sum("protein_g"), f = sum("fibre_g");
  const estimate = today.some((m) => m.status !== "reviewed" || m.totals?.unverified);
  const bars: Array<{ label: string; value: number; goal: number | null; color: string }> = [
    { label: t("ft_protein"), value: p, goal: protein?.goal ?? null, color: "var(--vc-navy)" },
    { label: t("ft_fibre"), value: f, goal: fibre?.goal ?? null, color: "var(--vc-action)" },
  ];
  const fibreLow = fibre?.goal != null && f < fibre.goal;
  return (
    <section className="vita-ft" data-testid="food-targets">
      <div className="vita-ft-head">
        <h2>{t("ft_title")}</h2>
        <span>{protein?.source === "care_team" || fibre?.source === "care_team" ? t("ft_set_by_team") : t("ft_default")}</span>
      </div>
      {bars.map((b) => (
        <div key={b.label} className="vita-ft-row">
          <div className="vita-ft-line">
            <b>{b.label}</b>
            <span>{b.goal != null ? `${b.value} / ${b.goal} g` : `${b.value} g`}</span>
          </div>
          {b.goal != null ? (
            <div className="vita-habit-bar">
              <i style={{ width: `${Math.min(100, (b.value / b.goal) * 100)}%`, background: b.value >= b.goal ? "#1D9E75" : b.color }} />
            </div>
          ) : (
            <p className="vita-ft-note">{t("ft_no_protein_goal")}</p>
          )}
        </div>
      ))}
      <p className="vita-ft-note">
        {!today.length ? t("ft_none_today") : fibreLow ? t("ft_fibre_low") : t("ft_ok")}
        {today.length && estimate ? ` ${t("ft_estimate")}` : ""}
      </p>
    </section>
  );
}

const SLOT_MEAL = ["breakfast", "breakfast", "snack", "lunch", "snack", "dinner"];

/** Today's meals from the current meal plan, each with a shortcut to log it (opens the meal log, filled in). */
export function PlanTodayCard() {
  const { t } = useLanguage();
  const { push } = usePlusPaths();
  const plans = useMealPlans();
  const now = new Date();
  const ymd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const list = plans.data ?? [];
  const plan = list.find((p) => p.items.length && (!p.startDate || p.startDate.slice(0, 10) <= ymd) && (!p.endDate || p.endDate.slice(0, 10) >= ymd)) ?? null;
  if (!plan) return null;
  const dayIndex = (now.getDay() + 6) % 7; // Monday = 0, as the plan grid
  const items = plan.items.filter((i) => i.dayIndex === dayIndex && i.mealDescription.trim()).sort((a, b) => a.slotIndex - b.slotIndex);
  if (!items.length) return null;
  const nextSlot = now.getHours() < 10 ? 1 : now.getHours() < 12 ? 2 : now.getHours() < 15 ? 3 : now.getHours() < 18 ? 4 : 5;
  return (
    <section className="vita-ft" data-testid="plan-today">
      <div className="vita-ft-head">
        <h2>{t("ft_plan_today")}</h2>
        <span>{plan.title}</span>
      </div>
      {items.map((i) => {
        const meal = SLOT_MEAL[i.slotIndex] ?? "other";
        const current = i.slotIndex === nextSlot;
        return (
          <div key={i.id} className={`vita-ft-plan${current ? " now" : ""}`}>
            <span className="vita-ft-plan-tx">
              <small>{MEAL_SLOT_LABELS[i.slotIndex] ?? ""}</small>
              <b>{i.mealDescription}</b>
            </span>
            <button type="button" onClick={() => push(`/meal-photos/new?meal=${meal}&note=${encodeURIComponent(i.mealDescription.slice(0, 300))}`)}>
              {t("ft_log_this")}
            </button>
          </div>
        );
      })}
      <p className="vita-ft-note">{t("ft_plan_note")}</p>
    </section>
  );
}

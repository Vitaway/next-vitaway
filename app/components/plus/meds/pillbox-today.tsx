"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/plus/i18n";
import { useTheme } from "@/lib/plus/theme";
import { markDose, useAdherence, useMedicationHistory, useTodayMedications } from "@/lib/plus/client/meds";
import { DOSE_COLORS, canMarkDoseTaken, doseLabel, ymd, type Medication } from "@/lib/plus/medication";
import { useFeedback } from "../ui/vita";

const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;
const card: React.CSSProperties = { padding: "14px 16px", background: "var(--vc-surface)", borderRadius: 10, boxShadow: "var(--vc-card-shadow)", border: `1px solid ${navyA(0.06)}` };

function Tag({ status, label }: { status: string; label: string }) {
  const { dark } = useTheme();
  const c = DOSE_COLORS[status];
  const [bg, fg] = c ? (dark ? c.dark : c.light) : ["var(--vc-surface-muted)", "var(--vc-muted)"];
  return <span style={{ padding: "4px 10px", borderRadius: 999, background: bg, color: fg, fontWeight: 800, fontSize: 12.5, whiteSpace: "nowrap" }}>{label}</span>;
}

type Row = { med: Medication; time: string; status: string };

function DoseButton({ label, primary, busy, onClick }: { label: string; primary?: boolean; busy?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={busy}
      onClick={onClick}
      style={{
        minHeight: 36,
        padding: "0 12px",
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 800,
        background: primary ? "var(--vc-action)" : "var(--vc-surface-muted)",
        color: primary ? "#fff" : "var(--vc-navy)",
        opacity: busy ? 0.6 : 1,
      }}
    >
      {label}
    </button>
  );
}

/**
 * Pillbox · Today: every dose in time order. A dose whose time has passed can be marked Taken or Skipped;
 * a later dose is "Due", never "Missed", until its time comes.
 */
export function TodayDosesCard() {
  const { t } = useLanguage();
  const { toast } = useFeedback();
  const today = useTodayMedications();
  const [busy, setBusy] = useState<string | null>(null);
  const date = ymd(new Date());
  const rows: Row[] = today.list
    .flatMap((med) => med.slots.map((s) => ({ med, time: s.time, status: s.status })))
    .sort((a, b) => a.time.localeCompare(b.time));
  if (!rows.length) return null;
  const done = rows.filter((r) => r.status === "taken").length;

  const act = async (r: Row, status: "taken" | "skipped") => {
    const key = `${r.med.id}|${r.time}`;
    setBusy(key);
    try {
      await markDose(r.med.id, date, r.time, status);
      toast(status === "taken" ? t("pb_marked_taken") : t("pb_marked_skipped"));
    } catch {
      toast(t("failed_to_save_metric"), { error: true });
    }
    setBusy(null);
  };

  return (
    <section style={card} data-testid="pillbox-today">
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <h2 style={{ margin: 0, flex: 1, fontSize: 17, fontWeight: 800, color: "var(--vc-navy)" }}>{t("hm_today")}</h2>
        <span style={{ fontSize: 13, fontWeight: 700, color: navyA(0.5) }}>{t("pb_taken_of", { n: done, total: rows.length })}</span>
      </div>
      <div style={{ marginTop: 6 }}>
        {rows.map((r, i) => {
          const key = `${r.med.id}|${r.time}`;
          const open = r.status === "missed" || r.status === "due";
          const early = r.status === "upcoming" && canMarkDoseTaken(date, r.time);
          return (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderTop: i ? `1px solid ${navyA(0.06)}` : 0 }}>
              <span style={{ width: 48, flex: "none", fontSize: 13, fontWeight: 800, color: navyA(0.55) }}>{r.time}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <b style={{ display: "block", fontSize: 14.5, color: "var(--vc-ink)" }}>
                  {r.med.name} <span style={{ fontWeight: 600, color: navyA(0.5) }}>{doseLabel(r.med)}</span>
                </b>
                <span style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: navyA(0.5) }}>
                  {r.status === "missed" ? t("pb_missed_hint") : r.status === "skipped" ? t("pb_skipped_hint") : r.status === "taken" ? t("pb_taken") : t("pb_due_at", { time: r.time })}
                </span>
              </span>
              {open ? (
                <span style={{ display: "flex", gap: 6, flex: "none" }}>
                  <DoseButton primary label={t("pb_taken")} busy={busy === key} onClick={() => void act(r, "taken")} />
                  <DoseButton label={t("pb_skip")} busy={busy === key} onClick={() => void act(r, "skipped")} />
                </span>
              ) : early ? (
                <DoseButton label={t("pb_take_now")} busy={busy === key} onClick={() => void act(r, "taken")} />
              ) : (
                <Tag status={r.status === "upcoming" ? "due" : r.status} label={r.status === "taken" ? t("pb_taken") : r.status === "skipped" ? t("pb_skipped") : t("pb_due_at", { time: r.time })} />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function WeekRow({ med, days }: { med: Medication; days: string[] }) {
  const { dark } = useTheme();
  const history = useMedicationHistory(med.id, 7);
  const byDate = new Map((history.data ?? []).map((d) => [d.date, d.slots]));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) repeat(7, minmax(0,1fr))", gap: 4, alignItems: "center" }}>
      <span style={{ fontSize: 13, fontWeight: 800, color: "var(--vc-navy)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{med.name}</span>
      {days.map((d) => {
        const slots = byDate.get(d) ?? [];
        const taken = slots.filter((s) => s.status === "taken").length;
        const closed = slots.filter((s) => s.status === "taken" || s.status === "missed" || s.status === "skipped").length;
        const status = !slots.length ? "none" : taken === slots.length ? "taken" : closed < slots.length ? "open" : slots.some((s) => s.status === "missed") ? "missed" : "skipped";
        const c = DOSE_COLORS[status];
        const [bg, fg] = c ? (dark ? c.dark : c.light) : ["transparent", navyA(0.45)];
        return (
          <span
            key={d}
            title={`${d}: ${taken}/${slots.length}`}
            style={{ height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, background: bg, color: fg, border: status === "open" ? `1px dashed ${navyA(0.3)}` : 0 }}
          >
            {slots.length ? `${taken}/${slots.length}` : "–"}
          </span>
        );
      })}
    </div>
  );
}

/** Pillbox · This week: one row per medicine, so a pattern (an evening dose, the weekend) is easy to spot. */
export function WeekByMedicineCard({ meds }: { meds: Medication[] }) {
  const { t, language } = useLanguage();
  const adherence = useAdherence(7);
  if (!meds.length) return null;
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    return ymd(d);
  });
  const label = (d: string, i: number) => (i === 6 ? t("hm_today") : new Date(`${d}T12:00:00`).toLocaleDateString(language === "rw" ? "rw-RW" : "en-GB", { weekday: "short" }));
  return (
    <section style={card} data-testid="pillbox-week">
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 12 }}>
        <h2 style={{ margin: 0, flex: 1, fontSize: 17, fontWeight: 800, color: "var(--vc-navy)" }}>{t("pb_week_title")}</h2>
        {adherence.data ? (
          <>
            <span style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, color: "var(--vc-navy)" }}>{adherence.data.percent}%</span>
            <span style={{ marginBottom: 3, fontSize: 12.5, fontWeight: 700, color: navyA(0.5) }}>{t("pb_doses_of", { n: adherence.data.taken, total: adherence.data.expected })}</span>
          </>
        ) : null}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) repeat(7, minmax(0,1fr))", gap: 4, marginBottom: 6 }}>
        <span />
        {days.map((d, i) => (
          <span key={d} style={{ textAlign: "center", fontSize: 11.5, fontWeight: i === 6 ? 800 : 600, color: navyA(i === 6 ? 0.85 : 0.45) }}>
            {label(d, i)}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {meds.map((m) => (
          <WeekRow key={m.id} med={m} days={days} />
        ))}
      </div>
      <p style={{ margin: "10px 0 0", fontSize: 12.5, fontWeight: 600, color: navyA(0.5) }}>{t("pb_week_note")}</p>
    </section>
  );
}

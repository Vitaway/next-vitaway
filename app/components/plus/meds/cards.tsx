"use client";

import { Clock, Health, TickSquare } from "iconsax-react";
import { useTheme } from "@/lib/plus/theme";
import {
  DOSE_COLORS,
  adherenceRowTimes,
  doseLabel,
  reminderTimes,
  scheduleLabel,
  ymd,
  type Medication,
  type MedicationAdherence,
  type MedicationSlot,
} from "@/lib/plus/medication";
import { ActionButton } from "../ui/vita";

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dMMM(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;
  return `${Number(match[3])} ${SHORT_MONTHS[Number(match[2]) - 1]}`;
}

export function MedicationListCard({ medication, onClick }: { medication: Medication; onClick: () => void }) {
  const { dark } = useTheme();
  const meta = ["Since " + dMMM(medication.date_added), "ongoing", medication.instructions?.trim() || ""].filter(Boolean).join(" · ");
  return (
    <button
      type="button"
      onClick={onClick}
      className="vita-tap"
      style={{
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        width: "100%",
        textAlign: "left",
        marginBottom: 12,
        padding: 14,
        background: "var(--vc-surface)",
        borderRadius: 10,
        border: "1px solid rgba(var(--vc-navy-rgb),0.08)",
        boxShadow: "var(--vc-card-shadow)",
      }}
    >
      <span style={{ width: 44, height: 44, borderRadius: 8, background: "var(--vc-tile-sky)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", color: "var(--vc-navy)" }}>
        <Health size={22} color="currentColor" />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ flex: 1, minWidth: 0, fontWeight: 800, fontSize: 16, color: "var(--vc-navy)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {medication.name} {doseLabel(medication)}
          </span>
          {medication.reminders_enabled ? (
            <span style={{ padding: "4px 10px", borderRadius: 10, background: dark ? "#12352A" : "#E4F7E8", color: dark ? "#6FD3A6" : "#2F8F4E", fontWeight: 700, fontSize: 11 }}>
              • Reminders
            </span>
          ) : null}
        </span>
        <span style={{ display: "block", marginTop: 4, color: "rgba(var(--vc-navy-rgb),0.55)", fontWeight: 600, fontSize: 13 }}>{scheduleLabel(medication)}</span>
        <span style={{ display: "block", marginTop: 4, color: "rgba(var(--vc-navy-rgb),0.45)", fontWeight: 500, fontSize: 12 }}>{meta}</span>
      </span>
    </button>
  );
}

export function DoseBadge({ slot, onClick }: { slot: MedicationSlot; onClick?: () => void }) {
  const { dark } = useTheme();
  const colors = DOSE_COLORS[slot.status];
  const [bg, fg] = colors ? (dark ? colors.dark : colors.light) : ["var(--vc-surface-muted)", "var(--vc-muted)"];
  const label =
    slot.status === "taken"
      ? `${slot.time} taken`
      : slot.status === "due" || slot.status === "pending"
        ? `${slot.time} due`
        : slot.status === "missed"
          ? `${slot.time} missed`
          : slot.time;
  const style: React.CSSProperties = { padding: "5px 10px", borderRadius: 10, background: bg, color: fg, fontWeight: 700, fontSize: 12, display: "inline-block" };
  if (onClick) {
    return (
      <button type="button" style={style} onClick={onClick}>
        {label}
      </button>
    );
  }
  return <span style={style}>{label}</span>;
}

export function TodayMedicineCard({ medication, onClick }: { medication: Medication; onClick: () => void }) {
  const slots = medication.slots.length ? medication.slots : reminderTimes(medication).map((time) => ({ time, status: "upcoming" }));
  return (
    <button
      type="button"
      onClick={onClick}
      className="vita-tap"
      style={{ display: "block", width: "100%", textAlign: "left", background: "var(--vc-surface)", borderRadius: 8, padding: "12px 14px" }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ flex: 1, fontWeight: 800, fontSize: 15, color: "var(--vc-ink)" }}>{medication.name}</span>
        <span style={{ fontWeight: 600, fontSize: 13, color: "rgba(var(--vc-navy-rgb),0.45)" }}>{doseLabel(medication)}</span>
      </span>
      <span style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
        {slots.map((slot) => (
          <DoseBadge key={slot.time} slot={slot} />
        ))}
      </span>
    </button>
  );
}

function StatusDot({ status }: { status: string }) {
  if (status === "empty") {
    return <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(var(--vc-navy-rgb),0.06)", display: "inline-block" }} />;
  }
  let bg = "rgba(var(--vc-navy-rgb),0.08)";
  let fg = "rgba(var(--vc-navy-rgb),0.4)";
  let icon: React.ReactNode = <path d="M6 12h12" />;
  if (status === "taken") {
    bg = "#3CB371";
    fg = "#fff";
    icon = <path d="M5 12.5l4.2 4.2L19 7" />;
  } else if (status === "missed") {
    bg = "#F2A0A8";
    fg = "#B42318";
    icon = <path d="M7 7l10 10M17 7L7 17" />;
  } else if (status === "pending") {
    bg = "#F5A623";
    fg = "#fff";
    return (
      <span style={{ width: 26, height: 26, borderRadius: "50%", background: bg, display: "inline-flex", alignItems: "center", justifyContent: "center", color: fg }}>
        <Clock size={15} color="currentColor" />
      </span>
    );
  }
  return (
    <span style={{ width: 26, height: 26, borderRadius: "50%", background: bg, display: "inline-flex", alignItems: "center", justifyContent: "center", color: fg }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        {icon}
      </svg>
    </span>
  );
}

export function AdherenceSummaryCard({
  adherence,
  onMarkTaken,
  marking = false,
}: {
  adherence: MedicationAdherence;
  onMarkTaken?: () => Promise<void> | void;
  marking?: boolean;
}) {
  const today = ymd(new Date());
  const dayLabel = (date: string) => {
    if (date === today) return "Today";
    const d = new Date(`${date}T00:00:00`);
    return Number.isNaN(d.getTime()) ? date : SHORT_DAYS[d.getDay()];
  };
  const statusFor = (date: string, time: string) => adherence.cells.find((c) => c.date === date && c.time === time)?.status ?? "empty";
  const rows = adherenceRowTimes(adherence);
  const rowLabel = (time: string) => (time === "morning" ? "Morning" : time === "evening" ? "Evening" : time);
  return (
    <div style={{ padding: "16px 16px 14px", background: "var(--vc-surface)", borderRadius: 10, boxShadow: "var(--vc-card-shadow)", border: "1px solid rgba(var(--vc-navy-rgb),0.06)" }}>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <span style={{ fontSize: 34, fontWeight: 800, color: "var(--vc-navy)", lineHeight: 1 }}>{adherence.percent}%</span>
        <span style={{ marginLeft: 6, marginBottom: 4, fontSize: 15, fontWeight: 700, color: "var(--vc-navy)" }}>taken</span>
        <span style={{ flex: 1 }} />
        <span style={{ marginBottom: 4, fontSize: 13, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.45)" }}>
          {adherence.taken} of {adherence.expected} doses
        </span>
      </div>
      <div style={{ display: "flex", marginTop: 16 }}>
        <span style={{ width: 52, flex: "none" }} />
        {adherence.days.map((day) => (
          <span key={day} style={{ flex: 1, textAlign: "center" }}>
            <span style={{ display: "block", fontSize: 11, fontWeight: day === today ? 800 : 600, color: `rgba(var(--vc-navy-rgb),${day === today ? 0.9 : 0.45})` }}>{dayLabel(day)}</span>
            {day === today ? <span style={{ display: "block", margin: "2px auto 0", height: 2, width: 28, background: "var(--vc-navy)" }} /> : <span style={{ display: "block", height: 4 }} />}
          </span>
        ))}
      </div>
      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map((time) => (
          <div key={time} style={{ display: "flex", alignItems: "center" }}>
            <span style={{ width: 52, flex: "none", fontSize: 12, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.5)" }}>{rowLabel(time)}</span>
            {adherence.days.map((day) => (
              <span key={day} style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <StatusDot status={statusFor(day, time)} />
              </span>
            ))}
          </div>
        ))}
      </div>
      {adherence.next_due && onMarkTaken ? (
        <div style={{ marginTop: 16 }}>
          <ActionButton full tone="teal" label={adherence.next_due.label} loading={marking} onClick={onMarkTaken} icon={<TickSquare size={16} color="currentColor" />} />
        </div>
      ) : null}
    </div>
  );
}

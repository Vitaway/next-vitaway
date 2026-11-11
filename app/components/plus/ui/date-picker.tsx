"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

/** widgets/vita_pickers.dart showVitaDatePicker: day, month and year boxes plus a calendar, month or year grid. */
export type VitaDateMode = "day" | "month" | "year";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;
const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function dateOnly(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

export function todayLocal(): Date {
  return dateOnly(new Date());
}

export function yearsAgoFromToday(years: number): Date {
  const today = todayLocal();
  return new Date(today.getFullYear() - years, today.getMonth(), today.getDate());
}

export function toIsoDate(value: Date): string {
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
}

export function parseIsoDate(value: string): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

export function formatSlashDate(value: string): string {
  const date = parseIsoDate(value);
  if (!date) return "";
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function clampDate(day: Date, first: Date, last: Date): Date {
  const value = dateOnly(day);
  if (value.getTime() < first.getTime()) return first;
  if (value.getTime() > last.getTime()) return last;
  return value;
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function allowed(day: Date, first: Date, last: Date): boolean {
  const value = dateOnly(day).getTime();
  return value >= first.getTime() && value <= last.getTime();
}

type DatePickerModalProps = {
  open: boolean;
  value: string;
  /** Used when the field is empty. Flutter onboarding opens the picker 30 years ago. */
  initialDate?: Date;
  firstDate?: Date;
  lastDate?: Date;
  initialMode?: VitaDateMode;
  cancelLabel?: string;
  okLabel?: string;
  onClose: () => void;
  onPick: (iso: string) => void;
};

export function DatePickerModal({
  open,
  value,
  initialDate,
  firstDate,
  lastDate,
  initialMode = "day",
  cancelLabel = "Cancel",
  okLabel = "OK",
  onClose,
  onPick,
}: DatePickerModalProps) {
  const today = todayLocal();
  const firstMs = dateOnly(firstDate ?? new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())).getTime();
  const lastMs = dateOnly(lastDate ?? today).getTime();
  const first = new Date(firstMs);
  const last = new Date(lastMs);
  const openMs = clampDate(parseIsoDate(value) ?? initialDate ?? today, first, last).getTime();

  const [selected, setSelected] = useState(() => new Date(openMs));
  const [view, setView] = useState(() => {
    const current = new Date(openMs);
    return new Date(current.getFullYear(), current.getMonth(), 1);
  });
  const [mode, setMode] = useState<VitaDateMode>(initialMode);
  const yearListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const current = new Date(openMs);
    setSelected(current);
    setView(new Date(current.getFullYear(), current.getMonth(), 1));
    setMode(initialMode);
  }, [open, openMs, initialMode]);

  const years = useMemo(() => {
    const list: number[] = [];
    for (let year = new Date(lastMs).getFullYear(); year >= new Date(firstMs).getFullYear(); year -= 1) list.push(year);
    return list;
  }, [firstMs, lastMs]);

  useEffect(() => {
    if (!open || mode !== "year") return;
    const index = years.indexOf(selected.getFullYear());
    if (index < 0 || !yearListRef.current) return;
    const rowExtent = 52;
    yearListRef.current.scrollTop = Math.max(0, Math.floor(index / 4) * rowExtent - 96);
  }, [open, mode, selected, years]);

  if (!open) return null;

  const jump = (year: number, month: number) => {
    const next = clampDate(new Date(year, month, Math.min(selected.getDate(), daysInMonth(year, month))), first, last);
    setSelected(next);
    setView(new Date(next.getFullYear(), next.getMonth(), 1));
    return next;
  };

  const shift = (months: number) => {
    const next = new Date(view.getFullYear(), view.getMonth() + months, 1);
    const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0);
    if (lastDay.getTime() < first.getTime() || next.getTime() > last.getTime()) return;
    setView(next);
  };

  const pickDay = (date: Date) => {
    onPick(toIsoDate(date));
    onClose();
  };

  const confirm = () => {
    onPick(toIsoDate(selected));
    onClose();
  };

  return (
    <div className="vita-modal-scrim" onClick={onClose} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Select date"
        className="vita-date-picker"
        onClick={(event) => event.stopPropagation()}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <Segment text={pad(selected.getDate())} label="Day" active={mode === "day"} flex={3} onClick={() => setMode("day")} />
          <Segment text={MONTHS_SHORT[selected.getMonth()]} label="Month" active={mode === "month"} flex={4} onClick={() => setMode("month")} />
          <Segment text={`${selected.getFullYear()}`} label="Year" active={mode === "year"} flex={4} onClick={() => setMode("year")} />
        </div>
        <div style={{ height: 282, marginTop: 14, minHeight: 0 }}>
          {mode === "day" ? (
            <DayGrid
              view={view}
              selected={selected}
              first={first}
              last={last}
              onShift={shift}
              onOpenMonth={() => setMode("month")}
              onPick={pickDay}
            />
          ) : null}
          {mode === "month" ? (
            <MonthGrid
              year={selected.getFullYear()}
              month={selected.getMonth()}
              first={first}
              last={last}
              onPrevYear={() => {
                if (selected.getFullYear() - 1 >= first.getFullYear()) jump(selected.getFullYear() - 1, selected.getMonth());
              }}
              onNextYear={() => {
                if (selected.getFullYear() + 1 <= last.getFullYear()) jump(selected.getFullYear() + 1, selected.getMonth());
              }}
              onOpenYear={() => setMode("year")}
              onPickMonth={(month) => {
                jump(selected.getFullYear(), month);
                setMode("day");
              }}
            />
          ) : null}
          {mode === "year" ? (
            <div ref={yearListRef} style={{ height: "100%", overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {years.map((year) => {
                const active = year === selected.getFullYear();
                return (
                  <Chip
                    key={year}
                    label={`${year}`}
                    active={active}
                    enabled
                    onClick={() => {
                      jump(year, selected.getMonth());
                      setMode("month");
                    }}
                  />
                );
              })}
            </div>
          ) : null}
        </div>
        <p style={{ margin: "8px 0 0", textAlign: "center", fontSize: 12, color: "var(--vc-muted)" }}>
          {mode === "day" ? "Tap a day" : mode === "month" ? "Tap a month" : "Tap a year"}
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 4, paddingTop: 12 }}>
          <button type="button" className="vita-date-picker-text" onClick={onClose}>
            {cancelLabel}
          </button>
          <button type="button" className="vita-date-picker-text ok" onClick={confirm}>
            {okLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function Segment({
  text,
  label,
  active,
  flex,
  onClick,
}: {
  text: string;
  label: string;
  active: boolean;
  flex: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      style={{
        flex,
        minWidth: 0,
        padding: "8px 4px",
        borderRadius: 10,
        background: active ? "var(--vc-picker-well)" : "var(--vc-surface-muted)",
        color: active ? "var(--vc-picker-ink)" : "var(--vc-body)",
        fontSize: 30,
        fontWeight: 500,
        lineHeight: 1.1,
        fontVariantNumeric: "tabular-nums",
        fontFamily: "inherit",
      }}
    >
      {text}
    </button>
  );
}

function Arrow({ label, onClick }: { label: string; onClick: () => void }) {
  const back = label.toLowerCase().includes("previous");
  return (
    <button type="button" aria-label={label} onClick={onClick} style={{ width: 32, height: 32, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--vc-body)" }}>
      {back ? <MdChevronLeft size={20} /> : <MdChevronRight size={20} />}
    </button>
  );
}

function DayGrid({
  view,
  selected,
  first,
  last,
  onShift,
  onOpenMonth,
  onPick,
}: {
  view: Date;
  selected: Date;
  first: Date;
  last: Date;
  onShift: (months: number) => void;
  onOpenMonth: () => void;
  onPick: (date: Date) => void;
}) {
  const year = view.getFullYear();
  const month = view.getMonth();
  const lead = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = daysInMonth(year, month);
  const cells: { date: Date; outside: boolean }[] = [];
  for (let i = 0; i < lead; i += 1) cells.push({ date: new Date(year, month, i - lead + 1), outside: true });
  for (let day = 1; day <= days; day += 1) cells.push({ date: new Date(year, month, day), outside: false });
  while (cells.length % 7 !== 0) {
    const lastCell = cells[cells.length - 1].date;
    cells.push({ date: new Date(lastCell.getFullYear(), lastCell.getMonth(), lastCell.getDate() + 1), outside: true });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Arrow label="Previous month" onClick={() => onShift(-1)} />
        <button type="button" onClick={onOpenMonth} style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "var(--vc-ink)", fontFamily: "inherit" }}>
          {MONTHS_LONG[month]} {year}
        </button>
        <Arrow label="Next month" onClick={() => onShift(1)} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginTop: 6 }}>
        {WEEKDAYS.map((day) => (
          <div key={day} style={{ padding: "4px 0", textAlign: "center", fontSize: 11, color: "var(--vc-muted)" }}>
            {day}
          </div>
        ))}
        {cells.map((cell, index) => {
          const disabled = cell.outside || !allowed(cell.date, first, last);
          const active = !cell.outside && sameDay(cell.date, selected);
          return (
            <div key={`${cell.date.getTime()}-${index}`} style={{ display: "flex", justifyContent: "center" }}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onPick(cell.date)}
                style={{
                  width: 34,
                  height: 34,
                  margin: "1px 0",
                  borderRadius: "50%",
                  background: active ? "var(--vc-teal)" : "transparent",
                  color: active ? "#fff" : disabled ? "var(--vc-faint)" : "var(--vc-ink)",
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  fontVariantNumeric: "tabular-nums",
                  fontFamily: "inherit",
                }}
              >
                {cell.date.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MonthGrid({
  year,
  month,
  first,
  last,
  onPrevYear,
  onNextYear,
  onOpenYear,
  onPickMonth,
}: {
  year: number;
  month: number;
  first: Date;
  last: Date;
  onPrevYear: () => void;
  onNextYear: () => void;
  onOpenYear: () => void;
  onPickMonth: (month: number) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Arrow label="Previous year" onClick={onPrevYear} />
        <button type="button" onClick={onOpenYear} style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "var(--vc-ink)", fontFamily: "inherit" }}>
          {year}
        </button>
        <Arrow label="Next year" onClick={onNextYear} />
      </div>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 10 }}>
        {MONTHS_SHORT.map((label, index) => {
          const monthEnd = new Date(year, index + 1, 0);
          const monthStart = new Date(year, index, 1);
          const enabled = monthEnd.getTime() >= first.getTime() && monthStart.getTime() <= last.getTime();
          return (
            <Chip key={label} label={label} active={index === month} enabled={enabled} onClick={() => onPickMonth(index)} />
          );
        })}
      </div>
    </div>
  );
}

function Chip({ label, active, enabled, onClick }: { label: string; active: boolean; enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={!enabled}
      onClick={onClick}
      style={{
        height: 44,
        borderRadius: 10,
        background: active ? "var(--vc-teal)" : "var(--vc-surface-muted)",
        color: active ? "#fff" : enabled ? "var(--vc-ink)" : "var(--vc-faint)",
        fontSize: 14,
        fontWeight: active ? 600 : 500,
        fontVariantNumeric: "tabular-nums",
        fontFamily: "inherit",
      }}
    >
      {label}
    </button>
  );
}

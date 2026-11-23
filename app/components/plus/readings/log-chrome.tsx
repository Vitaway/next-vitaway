"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, Danger, InfoCircle, TickCircle } from "@/lib/plus/icons";
import { useMetrics } from "@/lib/plus/client/data";
import { parseStamp, type HealthMetric } from "@/lib/plus/health";
import { fmtListTime } from "@/lib/plus/format";
import { useTheme } from "@/lib/plus/theme";
import { MONTHS, WEEKDAYS_SHORT, fmtLongDay, startOfDay } from "@/lib/plus/format";
import { ActionButton, AppBar, CircleButton, Modal } from "../ui/vita";
import { Camera } from "@/lib/plus/icons";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { useT } from "@/lib/plus/i18n";

export const FUTURE_TIME_MESSAGE = "That time hasn’t happened yet.";

export function MetricLogScaffold({
  title,
  saveLabel,
  loading,
  onSave,
  children,
  photoType,
  metricType,
  saveHint,
}: {
  title: string;
  /** Kept for callers; the header button is now History. */
  icon?: React.ReactNode;
  saveLabel: string;
  loading: boolean;
  onSave?: () => void | Promise<void>;
  children: React.ReactNode;
  /** W30: show "Read it from a photo" for this reading type. */
  photoType?: "blood_pressure" | "glucose" | "weight";
  /** Adds the History button and, on wide screens, a "Recent readings" column. */
  metricType?: "bp" | "glucose" | "weight";
  /** Says why Save is greyed out (shown only while it is). */
  saveHint?: string | null;
}) {
  const { push } = usePlusPaths();
  const t = useT();
  return (
    <div className="vita-page w-narrow vita-log-page">
      <AppBar
        title={title}
        actions={
          metricType ? (
            <CircleButton label={t("log_history")} onClick={() => push(`/metrics/${metricType}`)}>
              <Clock size={18} color="currentColor" />
            </CircleButton>
          ) : null
        }
      />
      <div className="vita-log-body" style={{ flex: 1, overflowY: "auto" }}>
      <div className="vita-log-main">
        {photoType ? (
          <button type="button" data-testid="pr-link" onClick={() => push(`/log/photo?type=${photoType}`)} style={{ display: "flex", alignItems: "center", gap: 8, width: "calc(100% - 40px)", margin: "12px 20px 0", padding: "10px 14px", borderRadius: 10, border: "1px dashed var(--vc-teal)", background: "transparent", fontSize: 14, fontWeight: 800, color: "var(--vc-teal-ink)" }}>
            <Camera size={18} color="currentColor" />
            {t("pr_open")}
          </button>
        ) : null}
        {children}
      </div>
      {metricType ? (
        <aside className="vita-log-aside">
          <RecentReadings type={metricType} />
        </aside>
      ) : null}
      </div>
      <div className="vita-bottom-bar" style={{ position: "sticky", bottom: 0, padding: "8px 20px calc(12px + env(safe-area-inset-bottom))", background: "var(--vc-canvas)" }}>
        <ActionButton
          full
          label={saveLabel}
          loading={loading}
          disabled={!onSave}
          onClick={onSave}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16a3 3 0 110-6 3 3 0 010 6zm3-10H5V5h10v4z" />
            </svg>
          }
        />
        {!onSave && saveHint ? <p className="vita-save-hint">{saveHint}</p> : null}
      </div>
    </div>
  );
}

/** Readings of one type, newest first (the readings list already holds every saved reading). */
export function useRecentReadings(type: "bp" | "glucose" | "weight", count = 3) {
  const { metrics } = useMetrics();
  return metrics
    .filter((m) => m.type === type)
    .map((m) => ({ m, at: parseStamp(m.last_updated) }))
    .filter((row): row is { m: HealthMetric; at: Date } => row.at !== null)
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, count);
}

export function readingText(m: HealthMetric) {
  if (m.type === "bp") return `${m.systolic ?? "–"}/${m.diastolic ?? "–"} mmHg`;
  if (m.type === "glucose") return `${m.latest_value} mg/dL`;
  if (m.type === "weight") return `${m.latest_value} kg`;
  return `${m.latest_value} ${m.unit ?? ""}`.trim();
}

/** "Last time: 132/84 mmHg · Fri" under the fields, on every width. */
export function LastReadingLine({ type }: { type: "bp" | "glucose" | "weight" }) {
  const t = useT();
  const [last] = useRecentReadings(type, 1);
  if (!last) return null;
  return <p className="vita-last-reading">{t("log_last_time", { value: readingText(last.m), when: fmtListTime(last.at) })}</p>;
}

function RecentReadings({ type }: { type: "bp" | "glucose" | "weight" }) {
  const t = useT();
  const { push } = usePlusPaths();
  const rows = useRecentReadings(type, 3);
  return (
    <div className="vita-log-recent">
      <h2>{t("log_recent")}</h2>
      {rows.length ? (
        <ul>
          {rows.map(({ m, at }) => (
            <li key={m.unique_id}>
              <b>{readingText(m)}</b>
              <span>{fmtListTime(at)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">{t("log_recent_empty")}</p>
      )}
      <button type="button" onClick={() => push(`/metrics/${type}`)}>{t("log_history")} →</button>
    </div>
  );
}

export type FeedbackKind = "ok" | "warn" | "bad" | "info";

export function MetricFeedbackBox({ kind, title, body }: { kind: FeedbackKind; title: string; body: string }) {
  const { dark } = useTheme();
  const palette = {
    ok: { bg: "var(--vc-tile-mint)", fg: dark ? "#6FD3A6" : "#0B6A4C", icon: <TickCircle size={18} color="currentColor" /> },
    warn: { bg: "var(--vc-tile-peach)", fg: dark ? "#E9B65C" : "#7A4A00", icon: <InfoCircle size={18} color="currentColor" /> },
    bad: { bg: "var(--vc-danger-soft)", fg: "#D64545", icon: <Danger size={18} color="currentColor" /> },
    info: { bg: "var(--vc-tile-sky)", fg: "var(--vc-navy)", icon: <InfoCircle size={18} color="currentColor" /> },
  }[kind];
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px 12px 12px", borderRadius: 8, background: palette.bg, color: palette.fg }}>
      <span style={{ flex: "none", marginTop: 1 }}>{palette.icon}</span>
      <span style={{ flex: 1 }}>
        {title ? <span style={{ display: "block", fontSize: 14.5, fontWeight: 800 }}>{title}</span> : null}
        <span style={{ display: "block", fontSize: 13, fontWeight: 600, lineHeight: 1.35, opacity: title ? 0.85 : 0.9 }}>{body}</span>
      </span>
    </div>
  );
}

export function NumericKeypad({
  onKey,
  showDecimal = false,
  onNext,
  onSubmit,
}: {
  onKey: (key: string) => void;
  showDecimal?: boolean;
  /** Tab on a keyboard: move to the next box. */
  onNext?: () => void;
  /** Enter on a keyboard: save. */
  onSubmit?: () => void;
}) {
  const t = useT();
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", showDecimal ? "." : "", "0", "del"];
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (/^[0-9]$/.test(event.key)) onKey(event.key);
      else if (event.key === "Backspace") onKey("del");
      else if (event.key === "." && showDecimal) onKey(".");
      else if (event.key === "Tab" && onNext && !event.shiftKey && !(event.target instanceof HTMLButtonElement)) {
        event.preventDefault();
        onNext();
      } else if (event.key === "Enter" && onSubmit && !(event.target instanceof HTMLButtonElement)) {
        event.preventDefault();
        onSubmit();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKey, showDecimal, onNext, onSubmit]);
  return (
    <>
    <p className="vita-type-hint">
      <span aria-hidden>⌨</span> {onNext ? t("log_type_hint_fields") : t("log_type_hint")}
    </p>
    <div className="vita-keypad" style={{ padding: "0 18px" }}>
      {keys.map((key, i) =>
        !key ? (
          <span key={i} />
        ) : key === "del" ? (
          <button key={i} type="button" aria-label="Delete" onClick={() => onKey("del")} style={{ aspectRatio: "1.85", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vc-navy)", borderRadius: 8 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
              <path d="M21 5H9l-6 7 6 7h12a1 1 0 001-1V6a1 1 0 00-1-1z" />
              <path d="M12 9l6 6M18 9l-6 6" />
            </svg>
          </button>
        ) : (
          <button key={i} type="button" className="vita-key" onClick={() => onKey(key)} style={{ fontSize: 24, color: "var(--vc-ink)" }}>
            {key}
          </button>
        ),
      )}
    </div>
    </>
  );
}

export function BlinkCursor({ height = 44 }: { height?: number }) {
  return <span className="vita-cursor" style={{ height, width: 3, marginLeft: 4 }} aria-hidden />;
}

/** Time picker sheet (showVitaTimePicker). */
export function TimePickerModal({
  open,
  value,
  onClose,
  onPick,
}: {
  open: boolean;
  value: { hour: number; minute: number };
  onClose: () => void;
  onPick: (value: { hour: number; minute: number }) => void;
}) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (open) setText(`${String(value.hour).padStart(2, "0")}:${String(value.minute).padStart(2, "0")}`);
  }, [open, value.hour, value.minute]);
  return (
    <Modal
      open={open}
      compact
      title="Pick a time"
      onClose={onClose}
      actions={
        <>
          <ActionButton small tone="white" label="Cancel" onClick={onClose} icon={<span />} />
          <ActionButton
            small
            tone="teal"
            label="OK"
            onClick={() => {
              const [h, m] = text.split(":").map((n) => Number.parseInt(n, 10));
              if (Number.isFinite(h) && Number.isFinite(m)) onPick({ hour: h, minute: m });
              onClose();
            }}
          />
        </>
      }
    >
      <input type="time" className="vita-input" value={text} onChange={(e) => setText(e.target.value)} style={{ fontSize: 22, fontWeight: 800, textAlign: "center" }} />
    </Modal>
  );
}

export function TimeChip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 999, background: "#003E48", color: "#fff", fontWeight: 700, fontSize: 15 }}>
      <Clock size={16} color="currentColor" />
      {label}
    </button>
  );
}

/** Horizontal day strip (EasyDateTimeLine): no future days. */
export function DateLine({ value, onChange }: { value: Date; onChange: (d: Date) => void }) {
  const today = startOfDay(new Date());
  const days = Array.from({ length: 45 }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - (44 - i)));
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scroller.current?.scrollTo({ left: scroller.current.scrollWidth });
  }, []);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 16, fontWeight: 800, color: "var(--vc-navy)" }}>{fmtLongDay(value)}</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.5)" }}>
          {MONTHS[value.getMonth()]} {value.getFullYear()}
        </span>
      </div>
      <div ref={scroller} className="vita-hide-scroll" style={{ display: "flex", gap: 8, overflowX: "auto" }}>
        {days.map((day) => {
          const active = startOfDay(value).getTime() === day.getTime();
          const isToday = day.getTime() === today.getTime();
          return (
            <button
              key={day.getTime()}
              type="button"
              onClick={() => onChange(day)}
              style={{
                width: 56,
                height: 72,
                flex: "none",
                borderRadius: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                background: active ? "#003E48" : isToday ? "var(--vc-tile-mint)" : "var(--vc-surface)",
                border: active ? "none" : "1px solid rgba(var(--vc-navy-rgb),0.08)",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: active ? "rgba(255,255,255,0.78)" : "rgba(var(--vc-navy-rgb),0.4)" }}>{WEEKDAYS_SHORT[day.getDay()]}</span>
              <span style={{ fontSize: 18, fontWeight: active ? 800 : 700, color: active ? "#fff" : "var(--vc-navy)" }}>{day.getDate()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function FieldLabelCenter({ text, required }: { text: string; required?: boolean }) {
  return (
    <p style={{ margin: 0, textAlign: "center", fontSize: 13, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.7)" }}>
      {text}
      {required ? <span style={{ color: "#D64545", fontWeight: 700 }}> *</span> : null}
    </p>
  );
}

export function fmtTimeOfDay(value: { hour: number; minute: number }): string {
  const h = value.hour % 12 || 12;
  return `${h}:${String(value.minute).padStart(2, "0")} ${value.hour < 12 ? "AM" : "PM"}`;
}

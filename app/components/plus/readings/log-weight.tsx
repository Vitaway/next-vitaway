"use client";

import { useCallback, useMemo, useState } from "react";
import { Weight } from "@/lib/plus/icons";
import { useT } from "@/lib/plus/i18n";
import { useBack } from "@/lib/plus/nav";
import { latestByType } from "@/lib/plus/health";
import { useMetrics } from "@/lib/plus/client/data";
import { saveReading } from "@/lib/plus/client/readings";
import { MobileApiError } from "@/lib/plus/client/api";
import { useFeedback } from "../ui/vita";
import ReadingSaved from "../safety/reading-saved";
import { DateLine, FUTURE_TIME_MESSAGE, LastReadingLine, MetricFeedbackBox, MetricLogScaffold, NumericKeypad, TimeChip, TimePickerModal, type FeedbackKind } from "./log-chrome";

/** Keypad entry for kilograms: up to 3 digits and one decimal place (82.4). */
export function weightKeypadAppend(current: string, key: string): string {
  if (key === "del") return current.slice(0, -1);
  if (key === ".") return current.includes(".") || !current ? current : `${current}.`;
  if (current === "0") return current;
  const next = current + key;
  const [whole, frac] = next.split(".");
  if (whole.length > 3 || (frac !== undefined && frac.length > 1)) return current;
  return next;
}

/** More than 3 kg from the last reading usually means a typo or a different scale. */
export const WEIGHT_JUMP_KG = 3;

export default function LogWeightScreen() {
  const t = useT();
  const back = useBack();
  const { toast } = useFeedback();
  const { metrics } = useMetrics();
  const [day, setDay] = useState(() => new Date());
  const [time, setTime] = useState(() => ({ hour: new Date().getHours(), minute: new Date().getMinutes() }));
  const [picking, setPicking] = useState(false);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<{ value: string; note: { title: string; body: string } | null } | null>(null);

  const previous = Number.parseFloat(latestByType(metrics).weight?.latest_value ?? "") || null;
  const kg = useMemo(() => {
    const parsed = Number.parseFloat(text);
    if (!Number.isFinite(parsed) || parsed < 20 || parsed > 250) return null;
    return parsed;
  }, [text]);
  const stamp = new Date(day.getFullYear(), day.getMonth(), day.getDate(), time.hour, time.minute);
  const timeLabel = `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`;
  const change = kg !== null && previous ? Math.round((kg - previous) * 10) / 10 : null;
  const fmtChange = (c: number) => `${c > 0 ? "+" : c < 0 ? "−" : ""}${Math.abs(c).toFixed(1)} kg`;

  const feedback = ((): { kind: FeedbackKind; title: string; body: string } => {
    if (!text) return { kind: "info", title: "", body: t("wt_empty_tip") };
    if (kg === null) return { kind: "bad", title: t("check_the_numbers"), body: t("wt_range") };
    if (stamp.getTime() > Date.now()) return { kind: "bad", title: t("check_the_numbers"), body: FUTURE_TIME_MESSAGE };
    if (change !== null && Math.abs(change) > WEIGHT_JUMP_KG) return { kind: "warn", title: t("wt_jump_title"), body: t("wt_jump_body", { change: fmtChange(change), last: previous!.toFixed(1) }) };
    return { kind: "ok", title: t("wt_ready"), body: change !== null ? t("wt_change_since", { change: fmtChange(change) }) : t("wt_first") };
  })();
  const canSave = kg !== null && stamp.getTime() <= Date.now();

  const onKey = useCallback((key: string) => setText((cur) => weightKeypadAppend(cur, key)), []);

  const save = async () => {
    if (saving || kg === null) return;
    if (stamp.getTime() > Date.now()) {
      toast(FUTURE_TIME_MESSAGE, { error: true });
      return;
    }
    setSaving(true);
    const stored = kg === Math.round(kg) ? kg.toFixed(0) : kg.toFixed(1);
    try {
      await saveReading({ type: "weight", name: "Weight", unit: "Kg", systolic: 0, diastolic: 0, latestValue: stored, stamp, fullness: 0 });
      setSaved({ value: `${kg.toFixed(1)} kg`, note: change !== null ? { title: fmtChange(change), body: t("wt_saved_change", { last: previous!.toFixed(1) }) } : { title: t("wt_saved_first_title"), body: t("wt_saved_first") } });
    } catch (error) {
      setSaving(false);
      toast(error instanceof MobileApiError && error.status === 0 ? error.message : t("failed_to_save_metric"), { error: true });
    }
  };

  if (saved) return <ReadingSaved kind="weight" value={saved.value} status={null} note={saved.note} onDone={back} />;

  return (
    <MetricLogScaffold photoType="weight" metricType="weight" title={t("add_weight")} icon={<Weight size={17} color="currentColor" />} saveLabel={t("save")} loading={saving} onSave={canSave ? save : undefined}>
      <div style={{ padding: "8px 0 12px" }}>
        <div style={{ padding: "0 18px" }}>
          <DateLine value={day} onChange={setDay} />
          <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
            <TimeChip label={timeLabel} onClick={() => setPicking(true)} />
          </div>
          <div
            aria-live="polite"
            aria-label={`${t("your_weight")}${text ? `: ${text} kg` : ""}`}
            style={{ marginTop: 14, padding: "12px 4px 14px", borderRadius: 8, background: "var(--vc-surface)", border: "2.5px solid var(--vc-navy)", boxShadow: "0 6px 14px rgba(var(--vc-navy-rgb),0.18)", textAlign: "center" }}
          >
            <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: -1, color: text ? "var(--vc-ink)" : "rgba(var(--vc-navy-rgb),0.2)" }}>{text || "--.-"}</span>
            <span style={{ marginLeft: 6, fontSize: 18, fontWeight: 700, color: "rgba(var(--vc-navy-rgb),0.45)" }}>kg</span>
          </div>
          <LastReadingLine type="weight" />
        </div>
        <div style={{ padding: "12px 18px 0" }}>
          <MetricFeedbackBox {...feedback} />
        </div>
        <div style={{ height: 12 }} />
        <NumericKeypad showDecimal onKey={onKey} onSubmit={canSave ? () => void save() : undefined} />
      </div>
      <TimePickerModal open={picking} value={time} onClose={() => setPicking(false)} onPick={setTime} />
    </MetricLogScaffold>
  );
}

"use client";

import { useCallback, useMemo, useState } from "react";
import { Activity, Heart } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { useBack } from "@/lib/plus/nav";
import { BP_EMPTY_TIP, BP_PULSE_MAX, BP_PULSE_MIN, bpValidationError, classifyBP, type BpCategory } from "@/lib/plus/health";
import { saveReading } from "@/lib/plus/client/readings";
import { MobileApiError } from "@/lib/plus/client/api";
import { useFeedback } from "../ui/vita";
import { FUTURE_TIME_MESSAGE, MetricFeedbackBox, MetricLogScaffold, NumericKeypad, TimePickerModal, fmtTimeOfDay, type FeedbackKind } from "./log-chrome";

type Field = "top" | "bottom" | "pulse";

const CATEGORIES: Array<[BpCategory, string, string]> = [
  ["low", "Low", "#F6CF8B"],
  ["normal", "Normal", "#8FD3B9"],
  ["elevated", "Elevated", "#B9E2C7"],
  ["aboveTarget", "Above", "#F6CF8B"],
  ["high", "High", "#F4A77C"],
  ["veryHigh", "Very high", "#E8766A"],
];

function FieldTile({ value, placeholder, label, required, selected, onClick }: { value: string; placeholder: string; label: string; required?: boolean; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        padding: "10px 4px 12px",
        borderRadius: 8,
        background: "var(--vc-surface)",
        border: `${selected ? 2.5 : 1.5}px solid ${selected ? "var(--vc-navy)" : "rgba(var(--vc-navy-rgb),0.1)"}`,
        boxShadow: selected ? "0 6px 14px rgba(var(--vc-navy-rgb),0.18)" : "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: "border 0.16s, box-shadow 0.16s",
      }}
    >
      <span style={{ fontSize: 32, fontWeight: 800, lineHeight: 1, letterSpacing: -0.8, color: value ? "var(--vc-ink)" : "rgba(var(--vc-navy-rgb),0.2)" }}>{value || placeholder}</span>
      <span style={{ marginTop: 6, fontSize: 10, fontWeight: 800, letterSpacing: 0.6, color: "rgba(var(--vc-navy-rgb),0.45)" }}>
        {label.toUpperCase()}
        {required ? <span style={{ color: "#D64545" }}> *</span> : null}
      </span>
    </button>
  );
}

export default function LogBpScreen() {
  const t = useT();
  const back = useBack();
  const { toast } = useFeedback();
  const [top, setTop] = useState("");
  const [bottom, setBottom] = useState("");
  const [pulse, setPulse] = useState("");
  const [focus, setFocus] = useState<Field>("top");
  const [time, setTime] = useState(() => ({ hour: new Date().getHours(), minute: new Date().getMinutes() }));
  const [picking, setPicking] = useState(false);
  const [saving, setSaving] = useState(false);

  const stamp = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), time.hour, time.minute);
  }, [time]);
  const systolic = top ? Number.parseInt(top, 10) : null;
  const diastolic = bottom ? Number.parseInt(bottom, 10) : null;

  const validationError = useMemo(() => {
    if (!top || !bottom) return null;
    if (systolic === null || diastolic === null || Number.isNaN(systolic) || Number.isNaN(diastolic)) return "Check the numbers.";
    const pair = bpValidationError(systolic, diastolic);
    if (pair) return pair;
    const p = pulse ? Number.parseInt(pulse, 10) : null;
    if (pulse && (p === null || Number.isNaN(p) || p < BP_PULSE_MIN || p > BP_PULSE_MAX)) return `Pulse is usually between ${BP_PULSE_MIN} and ${BP_PULSE_MAX}.`;
    if (stamp.getTime() > Date.now()) return FUTURE_TIME_MESSAGE;
    return null;
  }, [top, bottom, pulse, systolic, diastolic, stamp]);

  const canSave = Boolean(top && bottom) && validationError === null && systolic !== null && diastolic !== null;
  const category = systolic !== null && diastolic !== null && validationError === null && top && bottom ? classifyBP(systolic, diastolic) : null;
  const activeIndex = category ? CATEGORIES.findIndex(([c]) => c === category) : -1;

  const feedback = ((): { kind: FeedbackKind; title: string; body: string } => {
    if (validationError) return { kind: "bad", title: "Check the numbers", body: validationError };
    if (!top || !bottom || !category) return { kind: "info", title: "", body: BP_EMPTY_TIP };
    switch (category) {
      case "veryHigh":
        return { kind: "bad", title: "Very high", body: "Sit quietly for 5 minutes and measure again. If it’s still this high, or you have chest pain, a severe headache, weakness, confusion or a change in your vision, call 912 now." };
      case "high":
        return { kind: "warn", title: "High", body: "Rest for 5 minutes and measure again. Your care team will see this reading." };
      case "aboveTarget":
        return { kind: "warn", title: "Slightly above target", body: "Your target is below 130/80 mmHg." };
      case "low":
        return { kind: "warn", title: "Low", body: "If you feel dizzy, sit or lie down and drink some water. Tell your care team if it happens again." };
      case "checkNumbers":
        return { kind: "bad", title: "Check the numbers", body: "Check the numbers." };
      default:
        return { kind: "ok", title: "In your target", body: "Your target is below 130/80 mmHg." };
    }
  })();

  const onKey = useCallback(
    (key: string) => {
      const get = focus === "top" ? top : focus === "bottom" ? bottom : pulse;
      const set = focus === "top" ? setTop : focus === "bottom" ? setBottom : setPulse;
      if (key === "del") return set(get.slice(0, -1));
      if (get.length >= 3) return;
      const next = get + key;
      set(next);
      if (focus === "top" && next.length === 3) setFocus("bottom");
      else if (focus === "bottom" && next.length === 3) setFocus("pulse");
    },
    [focus, top, bottom, pulse],
  );

  const save = async () => {
    if (!canSave || saving || systolic === null || diastolic === null) return;
    setSaving(true);
    try {
      await saveReading({ type: "bp", name: "Blood pressure", unit: "mmHg", systolic, diastolic, latestValue: "0", stamp, fullness: 0 });
      toast(t("health_metric_saved"));
      back();
    } catch (error) {
      setSaving(false);
      toast(error instanceof MobileApiError && error.status === 0 ? error.message : t("failed_to_save_metric"), { error: true });
    }
  };

  return (
    <MetricLogScaffold title={t("add_blood_pressure")} icon={<Activity size={17} color="currentColor" />} saveLabel="Save reading" loading={saving} onSave={canSave ? save : undefined}>
      <div style={{ padding: "8px 0 12px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", padding: "0 18px" }}>
          <div style={{ flex: 1 }}>
            <FieldTile value={top} placeholder="---" label="Top" required selected={focus === "top"} onClick={() => setFocus("top")} />
          </div>
          <span style={{ padding: "0 4px 28px", fontSize: 28, fontWeight: 800, color: "var(--vc-navy)" }}>/</span>
          <div style={{ flex: 1 }}>
            <FieldTile value={bottom} placeholder="---" label="Bottom" required selected={focus === "bottom"} onClick={() => setFocus("bottom")} />
          </div>
          <span style={{ padding: "0 4px 30px", color: "#E85A2E", display: "inline-flex" }}>
            <Heart size={16} variant="Bold" color="currentColor" />
          </span>
          <div style={{ flex: 1 }}>
            <FieldTile value={pulse} placeholder="--" label="Pulse" selected={focus === "pulse"} onClick={() => setFocus("pulse")} />
          </div>
        </div>
        <div style={{ padding: "18px 18px 0" }}>
          <div style={{ display: "flex", gap: 3 }}>
            {CATEGORIES.map(([, , color], i) => (
              <span
                key={i}
                style={{
                  flex: 1,
                  height: 10,
                  background: color,
                  borderRadius: `${i === 0 ? 5 : 3}px ${i === CATEGORIES.length - 1 ? 5 : 3}px ${i === CATEGORIES.length - 1 ? 5 : 3}px ${i === 0 ? 5 : 3}px`,
                  boxShadow: activeIndex === i ? "inset 0 0 0 2.5px var(--vc-ink)" : "none",
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
            {CATEGORIES.map(([, name], i) => (
              <span key={i} style={{ flex: 1, textAlign: "center", fontSize: 9.5, fontWeight: 800, lineHeight: 1.15, color: activeIndex === i ? "var(--vc-ink)" : "rgba(var(--vc-navy-rgb),0.4)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {name}
              </span>
            ))}
          </div>
        </div>
        <div style={{ padding: "14px 18px 0" }}>
          <MetricFeedbackBox {...feedback} />
        </div>
        <div style={{ display: "flex", alignItems: "center", padding: "14px 18px 0", fontSize: 13 }}>
          <span style={{ fontWeight: 700, color: "rgba(var(--vc-navy-rgb),0.55)" }}>Today · {fmtTimeOfDay(time)}</span>
          <span style={{ color: "rgba(var(--vc-navy-rgb),0.35)" }}>&nbsp;·&nbsp;</span>
          <button type="button" onClick={() => setPicking(true)} style={{ fontWeight: 800, color: "var(--vc-navy)", textDecoration: "underline", textDecorationThickness: 1.5 }}>
            Change time
          </button>
        </div>
        <div style={{ height: 12 }} />
        <NumericKeypad onKey={onKey} />
      </div>
      <TimePickerModal open={picking} value={time} onClose={() => setPicking(false)} onPick={setTime} />
    </MetricLogScaffold>
  );
}

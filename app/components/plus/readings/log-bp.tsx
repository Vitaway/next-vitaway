"use client";

import { useCallback, useMemo, useState } from "react";
import { Activity, Heart } from "@/lib/plus/icons";
import { useLanguage } from "@/lib/plus/i18n";
import { useBack } from "@/lib/plus/nav";
import { BP_PULSE_MAX, BP_PULSE_MIN, bpFieldComplete, bpFieldMax, bpKeypadAppend, bpValidationErrorText } from "@/lib/plus/health";
import { bpStatus, type ReadingStatus } from "@/lib/plus/clinical-rules";
import { useClinicalConfig } from "@/lib/plus/client/clinical-config";
import ReadingSaved from "../safety/reading-saved";
import { EmergencyLink } from "../safety/emergency-link";
import { saveReading } from "@/lib/plus/client/readings";
import { MobileApiError } from "@/lib/plus/client/api";
import { useFeedback } from "../ui/vita";
import { FUTURE_TIME_MESSAGE, LastReadingLine, MetricFeedbackBox, MetricLogScaffold, NumericKeypad, TimePickerModal, fmtTimeOfDay, useRecentReadings, type FeedbackKind } from "./log-chrome";

type Field = "top" | "bottom" | "pulse";

function FieldTile({ value, placeholder, label, unit, selected, onClick }: { value: string; placeholder: string; label: string; unit: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label}${value ? `: ${value} ${unit}` : ""}`}
      aria-pressed={selected}
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
      <span style={{ marginTop: 7, fontSize: 13.5, fontWeight: 800, color: selected ? "var(--vc-navy)" : "rgba(var(--vc-navy-rgb),0.6)" }}>{label}</span>
      <span style={{ marginTop: 1, fontSize: 12, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.42)" }}>{unit}</span>
    </button>
  );
}

export default function LogBpScreen() {
  const { t, language } = useLanguage();
  const clinical = useClinicalConfig();
  const back = useBack();
  const [saved, setSaved] = useState<{ value: string; status: ReadingStatus | null } | null>(null);
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
    if (systolic === null || diastolic === null || Number.isNaN(systolic) || Number.isNaN(diastolic)) return t("check_the_numbers_body");
    const pair = bpValidationErrorText(t, systolic, diastolic);
    if (pair) return pair;
    const p = pulse ? Number.parseInt(pulse, 10) : null;
    if (pulse && (p === null || Number.isNaN(p) || p < BP_PULSE_MIN || p > BP_PULSE_MAX)) return t("bp_err_pulse_range", { min: BP_PULSE_MIN, max: BP_PULSE_MAX });
    if (stamp.getTime() > Date.now()) return FUTURE_TIME_MESSAGE;
    return null;
  }, [top, bottom, pulse, systolic, diastolic, stamp, t]);

  const canSave = Boolean(top && bottom) && validationError === null && systolic !== null && diastolic !== null;
  // Tracker v9.0 BL-012: no interpretation unless CA-03 (bp_ranges) is approved.
  const status = canSave ? bpStatus(clinical, systolic, diastolic, language) : null;

  const feedback = ((): { kind: FeedbackKind; title: string; body: string } => {
    if (validationError) return { kind: "bad", title: t("check_the_numbers"), body: validationError };
    if (!top || !bottom) return { kind: "info", title: "", body: t("bp_empty_tip") };

    if (!status) return { kind: "info", title: t("reading_review_title"), body: t("reading_no_interpretation") };
    return { kind: status.tone, title: status.chip, body: status.label };
  })();

  const nextField = useCallback(() => setFocus((f) => (f === "top" ? "bottom" : f === "bottom" ? "pulse" : "top")), []);
  // After a few readings the measuring tip folds into a "How to measure" link.
  const seenEnough = useRecentReadings("bp", 3).length >= 3;
  const [showTip, setShowTip] = useState(false);

  const onKey = useCallback(
    (key: string) => {
      const get = focus === "top" ? top : focus === "bottom" ? bottom : pulse;
      const set = focus === "top" ? setTop : focus === "bottom" ? setBottom : setPulse;
      if (key === "del") return set(get.slice(0, -1));
      // BL-003 BP picker fix (mirrors Flutter _onKey): no leading zero, nothing above the
      // field's maximum, and move on as soon as no further digit could be valid.
      const max = bpFieldMax(focus);
      const next = bpKeypadAppend(get, key, max);
      if (next === get) return;
      set(next);
      if (!bpFieldComplete(next, max)) return;
      if (focus === "top") setFocus("bottom");
      else if (focus === "bottom") setFocus("pulse");
    },
    [focus, top, bottom, pulse],
  );

  const save = async () => {
    if (!canSave || saving || systolic === null || diastolic === null) return;
    setSaving(true);
    try {
      await saveReading({ type: "bp", name: "Blood pressure", unit: "mmHg", systolic, diastolic, latestValue: "0", stamp, fullness: 0 });
      setSaved({ value: `${systolic}/${diastolic} mmHg`, status: bpStatus(clinical, systolic, diastolic, language) });
    } catch (error) {
      setSaving(false);
      toast(error instanceof MobileApiError && error.status === 0 ? error.message : t("failed_to_save_metric"), { error: true });
    }
  };

  if (saved)
    return (
      <ReadingSaved
        kind="bp"
        value={saved.value}
        status={saved.status}
        onDone={back}
        onMeasureAgain={() => {
          // Urgent path: rest 5 minutes, then a fresh entry (the first reading stays saved).
          setSaved(null);
          setSaving(false);
          setTop("");
          setBottom("");
          setPulse("");
          setFocus("top");
          const now = new Date();
          setTime({ hour: now.getHours(), minute: now.getMinutes() });
        }}
      />
    );

  return (
    <MetricLogScaffold
      photoType="blood_pressure"
      metricType="bp"
      title={t("add_blood_pressure")}
      icon={<Activity size={17} color="currentColor" />}
      saveLabel={t("save_reading")}
      loading={saving}
      onSave={canSave ? save : undefined}
      saveHint={!top || !bottom ? t("bp_save_hint") : null}
    >
      <div style={{ padding: "8px 0 12px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", padding: "0 18px" }}>
          <div style={{ flex: 1 }}>
            <FieldTile value={top} placeholder="---" label={t("bp_top_number")} unit="mmHg" selected={focus === "top"} onClick={() => setFocus("top")} />
          </div>
          <span style={{ padding: "0 4px 28px", fontSize: 28, fontWeight: 800, color: "var(--vc-navy)" }}>/</span>
          <div style={{ flex: 1 }}>
            <FieldTile value={bottom} placeholder="---" label={t("bp_bottom_number")} unit="mmHg" selected={focus === "bottom"} onClick={() => setFocus("bottom")} />
          </div>
          <span style={{ padding: "0 4px 30px", color: "#E85A2E", display: "inline-flex" }}>
            <Heart size={16} variant="Bold" color="currentColor" />
          </span>
          <div style={{ flex: 1 }}>
            <FieldTile value={pulse} placeholder="--" label={t("bp_pulse_optional")} unit="bpm" selected={focus === "pulse"} onClick={() => setFocus("pulse")} />
          </div>
        </div>
        <div style={{ padding: "0 18px" }}>
          <LastReadingLine type="bp" />
        </div>
        <div style={{ padding: "12px 18px 0" }}>
          {!top && !bottom && seenEnough && !showTip ? (
            <button type="button" className="vita-howto" onClick={() => setShowTip(true)}>
              {t("log_how_to_measure")}
            </button>
          ) : (
            <MetricFeedbackBox {...feedback} />
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "6px 0", padding: "12px 18px 0", fontSize: 13 }}>
          <span style={{ fontWeight: 700, color: "rgba(var(--vc-navy-rgb),0.55)" }}>{t("hm_today")} · {fmtTimeOfDay(time)}</span>
          <span style={{ color: "rgba(var(--vc-navy-rgb),0.35)" }}>&nbsp;·&nbsp;</span>
          <button type="button" onClick={() => setPicking(true)} style={{ fontWeight: 800, color: "var(--vc-navy)", textDecoration: "underline", textDecorationThickness: 1.5 }}>
            {t("change_time")}
          </button>
          <span style={{ flex: 1 }} />
          <EmergencyLink />
        </div>
        <div style={{ height: 12 }} />
        <NumericKeypad onKey={onKey} onNext={nextField} onSubmit={canSave ? () => void save() : undefined} />
      </div>
      <TimePickerModal open={picking} value={time} onClose={() => setPicking(false)} onPick={setTime} />
    </MetricLogScaffold>
  );
}

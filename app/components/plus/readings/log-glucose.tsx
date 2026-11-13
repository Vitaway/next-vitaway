"use client";

import { useCallback, useMemo, useState } from "react";
import { Bluetooth } from "iconsax-react";
import { useLanguage } from "@/lib/plus/i18n";
import { useBack } from "@/lib/plus/nav";
import { glucoseUnitLabel, useGlucoseUnit } from "@/lib/plus/units";
import {
  GLUCOSE_CONTEXT_LABELS,
  GLUCOSE_CONTEXTS,
  GLUCOSE_MG_MAX,
  GLUCOSE_MG_MIN,
  glucoseContextFullness,
  glucoseToMg,
  type GlucoseContext,
} from "@/lib/plus/health";
import { saveReading } from "@/lib/plus/client/readings";
import { MobileApiError } from "@/lib/plus/client/api";
import { useFeedback } from "../ui/vita";
import {
  BlinkCursor,
  FUTURE_TIME_MESSAGE,
  MetricFeedbackBox,
  MetricLogScaffold,
  NumericKeypad,
  TimePickerModal,
  fmtTimeOfDay,
  type FeedbackKind,
} from "./log-chrome";
import LowGlucoseCrisis from "./low-glucose";
import { glucoseStatus, lowGlucoseWarning, type ReadingStatus } from "@/lib/plus/clinical-rules";
import { useClinicalConfig } from "@/lib/plus/client/clinical-config";
import ReadingSaved from "../safety/reading-saved";
import { EmergencyLink } from "../safety/emergency-link";

function suggestContext(now: Date): GlucoseContext {
  const mins = now.getHours() * 60 + now.getMinutes();
  if (mins < 9 * 60 + 30) return "fasting";
  if (mins >= 21 * 60) return "bedtime";
  if ((mins >= 13 * 60 + 45 && mins < 15 * 60 + 30) || (mins >= 19 * 60 + 45 && mins < 21 * 60)) return "afterMeal";
  return "beforeMeal";
}

export default function LogGlucoseScreen() {
  const { t, language } = useLanguage();
  const clinical = useClinicalConfig();
  const back = useBack();
  const [saved, setSaved] = useState<{ value: string; status: ReadingStatus | null } | null>(null);
  const { toast } = useFeedback();
  const [unit, setUnit] = useGlucoseUnit();
  const isMmol = unit === "mmol";
  const [digits, setDigits] = useState("");
  const [context, setContext] = useState<GlucoseContext>(() => suggestContext(new Date()));
  const [yesterday, setYesterday] = useState(false);
  const [time, setTime] = useState(() => ({ hour: new Date().getHours(), minute: new Date().getMinutes() }));
  const [picking, setPicking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [crisis, setCrisis] = useState<{ mgDl: number; title: string; message: string } | null>(null);
  const suggested = suggestContext(new Date());

  const stamp = useMemo(() => {
    const now = new Date();
    const day = yesterday ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1) : now;
    return new Date(day.getFullYear(), day.getMonth(), day.getDate(), time.hour, time.minute);
  }, [yesterday, time]);

  const mgValue = useMemo(() => {
    if (!digits) return null;
    const v = Number.parseFloat(digits);
    if (!Number.isFinite(v)) return null;
    return glucoseToMg(v, isMmol);
  }, [digits, isMmol]);

  const validationError = useMemo(() => {
    if (mgValue === null) return null;
    if (mgValue < GLUCOSE_MG_MIN || mgValue > GLUCOSE_MG_MAX) {
      return isMmol ? "Meters read between 1.1 and 33.3 mmol/L." : "Meters read between 20 and 600 mg/dL.";
    }
    if (stamp.getTime() > Date.now()) return FUTURE_TIME_MESSAGE;
    return null;
  }, [mgValue, isMmol, stamp]);

  const canSave = digits !== "" && validationError === null && mgValue !== null;

  // Tracker v9.0 BL-012: no interpretation unless CA-04 (glucose_ranges) is approved.
  const feedback = useMemo((): { kind: FeedbackKind; title: string; body: string } => {
    if (validationError) return { kind: "bad", title: "Check the number", body: validationError };
    if (mgValue === null) return { kind: "info", title: "", body: t("glucose_empty_tip_neutral") };
    const status = glucoseStatus(clinical, Math.round(mgValue), context, language);
    if (!status) return { kind: "info", title: t("reading_review_title"), body: t("reading_no_interpretation") };
    return { kind: status.tone, title: status.chip, body: status.label };
  }, [validationError, mgValue, context, clinical, language, t]);

  const onKey = useCallback(
    (key: string) => {
      setDigits((current) => {
        if (key === "del") return current.slice(0, -1);
        if (key === ".") {
          if (!isMmol || current.includes(".")) return current;
          return current ? `${current}.` : "0.";
        }
        const maxLen = isMmol ? 4 : 3;
        if (current.replace(".", "").length >= maxLen) return current;
        if (isMmol && current.includes(".") && current.split(".")[1]) return current;
        return current + key;
      });
    },
    [isMmol],
  );

  const toggleUnit = () => {
    if (digits) {
      const n = Number.parseFloat(digits);
      if (Number.isFinite(n)) setDigits(isMmol ? String(Math.round(n * 18)) : (n / 18).toFixed(1));
    }
    setUnit(isMmol ? "mg" : "mmol");
  };

  const save = async () => {
    if (!canSave || saving || mgValue === null) return;
    setSaving(true);
    const mg = Math.round(mgValue);
    try {
      await saveReading({ type: "glucose", name: "glucose", unit: "mg/dL", systolic: 0, diastolic: 0, latestValue: String(mg), stamp, fullness: glucoseContextFullness(context) });
      // BL-148: the low-glucose warning only exists once CA-04 with a low_warning is approved; no threshold is hard-coded.
      const low = lowGlucoseWarning(clinical, mg, language);
      if (low) {
        setCrisis({ mgDl: mg, title: low.title, message: low.message });
        return;
      }
      setSaved({ value: `${mg} mg/dL`, status: glucoseStatus(clinical, mg, context, language) });
    } catch (error) {
      setSaving(false);
      toast(error instanceof MobileApiError && error.status === 0 ? error.message : t("failed_to_save_metric"), { error: true });
    }
  };

  if (crisis !== null) return <LowGlucoseCrisis mgDl={crisis.mgDl} title={crisis.title} message={crisis.message} onDone={back} />;
  if (saved) return <ReadingSaved value={saved.value} status={saved.status} onDone={back} />;


  return (
    <MetricLogScaffold title={t("add_blood_glucose")} icon={<Bluetooth size={17} color="currentColor" />} saveLabel="Save reading" loading={saving} onSave={canSave ? save : undefined}>
      <div style={{ padding: "4px 0 12px" }}>
        <div className="vita-hide-scroll" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "0 18px", height: 44, alignItems: "center" }}>
          {GLUCOSE_CONTEXTS.map((value) => {
            const selected = value === context;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setContext(value)}
                style={{
                  flex: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 14px",
                  borderRadius: 999,
                  background: selected ? "#003E48" : "var(--vc-surface)",
                  border: `1px solid ${selected ? "#003E48" : "rgba(var(--vc-navy-rgb),0.12)"}`,
                  fontSize: 13,
                  fontWeight: 800,
                  color: selected ? "#fff" : "rgba(var(--vc-navy-rgb),0.75)",
                }}
              >
                {value === suggested ? <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#E85A2E" }} /> : null}
                {GLUCOSE_CONTEXT_LABELS[value]}
              </button>
            );
          })}
        </div>
        <p style={{ margin: "10px 18px 0", fontSize: 13, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.7)" }}>
          Reading<span style={{ color: "#D64545", fontWeight: 700 }}> *</span>
        </p>
        <div style={{ marginTop: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 56, fontWeight: 800, lineHeight: 1, letterSpacing: -1.5, color: digits ? "var(--vc-ink)" : "rgba(var(--vc-navy-rgb),0.18)" }}>{digits || (isMmol ? "0.0" : "000")}</span>
            <BlinkCursor />
          </div>
          <button type="button" onClick={toggleUnit} style={{ marginTop: 8, padding: "6px 12px", borderRadius: 6, background: "var(--vc-tile-sky)", fontSize: 13, fontWeight: 800, color: "var(--vc-navy)" }}>
            {glucoseUnitLabel(unit)} ⇄
          </button>
        </div>
        <div style={{ padding: "12px 18px 0" }}>
          <MetricFeedbackBox {...feedback} />
          <EmergencyLink style={{ marginTop: 10 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", padding: "14px 18px 0" }}>
          <button type="button" onClick={() => setPicking(true)} style={{ fontSize: 13, fontWeight: 800, color: "var(--vc-navy)" }}>
            {yesterday ? "Yesterday" : "Today"} · {fmtTimeOfDay(time)}
          </button>
          <span style={{ flex: 1 }} />
          <button type="button" onClick={() => setYesterday((v) => !v)} style={{ fontSize: 13, fontWeight: 800, color: "var(--vc-navy)", textDecoration: "underline", textDecorationThickness: 1.5 }}>
            {yesterday ? "It was today" : "It was yesterday"}
          </button>
        </div>
        <div style={{ height: 10 }} />
        <NumericKeypad showDecimal={isMmol} onKey={onKey} />
      </div>
      <TimePickerModal open={picking} value={time} onClose={() => setPicking(false)} onPick={setTime} />
    </MetricLogScaffold>
  );
}

"use client";

import { useCallback, useMemo, useState } from "react";
import { Bluetooth } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { useBack } from "@/lib/plus/nav";
import { useTheme } from "@/lib/plus/theme";
import { glucoseUnitLabel, useGlucoseUnit } from "@/lib/plus/units";
import {
  GLUCOSE_CONTEXT_LABELS,
  GLUCOSE_CONTEXTS,
  GLUCOSE_MG_MAX,
  GLUCOSE_MG_MIN,
  classifyGlucoseMg,
  glucoseBand,
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

const PHONE = "+250 795 767 405";
const EMERGENCY = "912";

function suggestContext(now: Date): GlucoseContext {
  const mins = now.getHours() * 60 + now.getMinutes();
  if (mins < 9 * 60 + 30) return "fasting";
  if (mins >= 21 * 60) return "bedtime";
  if ((mins >= 13 * 60 + 45 && mins < 15 * 60 + 30) || (mins >= 19 * 60 + 45 && mins < 21 * 60)) return "afterMeal";
  return "beforeMeal";
}

function RangeBar({ valueMg, context, displayLabel }: { valueMg: number | null; context: GlucoseContext; displayLabel: string }) {
  const { dark } = useTheme();
  const min = 40;
  const max = 300;
  const band = glucoseBand(context);
  const hi = band.high;
  const pct = (v: number) => (Math.min(max, Math.max(min, v)) - min) / (max - min);
  const zones: Array<[number, number, string]> = [
    [min, 70, "#F2A59A"],
    [70, band.low, "#F6CF8B"],
    [band.low, hi, "#8FD3B9"],
    [hi, 250, "#F6CF8B"],
    [250, max, "#F2A59A"],
  ];
  return (
    <div style={{ paddingTop: 28 }}>
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden" }}>
          {zones.map(([a, b, color], i) => (
            <span key={i} style={{ flex: Math.max(1, Math.round((pct(b) - pct(a)) * 1000)), background: color }} />
          ))}
        </div>
        {valueMg !== null ? (
          <div style={{ position: "absolute", left: `calc(${pct(valueMg) * 100}% - 20px)`, top: -26, width: 40, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ padding: "2px 7px", borderRadius: 7, background: dark ? "#003E48" : "var(--vc-ink)", color: "#fff", fontSize: 11, fontWeight: 800, whiteSpace: "nowrap" }}>
              {displayLabel || Math.round(valueMg)}
            </span>
            <span style={{ marginTop: 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", border: "4px solid var(--vc-ink)", boxShadow: "0 2px 4px rgba(0,0,0,0.18)" }} />
          </div>
        ) : null}
      </div>
      <div style={{ position: "relative", height: 16, marginTop: 6 }}>
        {[band.low, band.high].map((tick) => (
          <span key={tick} style={{ position: "absolute", left: `calc(${pct(tick) * 100}% - 12px)`, fontSize: 10.5, fontWeight: 700, color: "rgba(var(--vc-navy-rgb),0.45)" }}>
            {tick}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function LogGlucoseScreen() {
  const t = useT();
  const back = useBack();
  const { toast } = useFeedback();
  const [unit, setUnit] = useGlucoseUnit();
  const isMmol = unit === "mmol";
  const [digits, setDigits] = useState("");
  const [context, setContext] = useState<GlucoseContext>(() => suggestContext(new Date()));
  const [yesterday, setYesterday] = useState(false);
  const [time, setTime] = useState(() => ({ hour: new Date().getHours(), minute: new Date().getMinutes() }));
  const [picking, setPicking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [crisisMg, setCrisisMg] = useState<number | null>(null);
  const suggested = suggestContext(new Date());
  const label = GLUCOSE_CONTEXT_LABELS[context];

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

  const feedback = useMemo((): { kind: FeedbackKind; title: string; body: string } => {
    if (validationError) return { kind: "bad", title: "Check the number", body: validationError };
    if (mgValue === null) return { kind: "info", title: "", body: `Type the number on your meter. We compare it with your ${label.toLowerCase()} target.` };
    const band = glucoseBand(context);
    const where = label.toLowerCase();
    switch (classifyGlucoseMg(Math.round(mgValue), context)) {
      case "veryLow":
        return { kind: "bad", title: "Very low", body: `Take 15 g of fast sugar now (half a glass of juice). Check again in 15 minutes. If you feel confused or faint, call ${EMERGENCY} or the clinic at ${PHONE}.` };
      case "low":
        return { kind: "bad", title: "Low", body: `Take 15 g of fast sugar now, such as half a glass of juice. Check again in 15 minutes. Clinic: ${PHONE}.` };
      case "veryHigh":
        return { kind: "bad", title: "Very high", body: `Drink water and contact your care team today. If you are vomiting, very drowsy or confused, call ${EMERGENCY}.` };
      case "highKetones":
        return { kind: "bad", title: "High", body: "Your sugar is high. If you feel sick, take insulin or have type 1 diabetes, check urine ketones and contact your care team today." };
      case "belowTarget":
        return { kind: "warn", title: "Below your target", body: `Your ${where} target is ${band.label} mg/dL. Have your next meal on time.` };
      case "aboveTarget":
        return { kind: "warn", title: "Above your target", body: `Your ${where} target is ${band.label} mg/dL. One reading isn’t a diagnosis. Your care team watches the trend.` };
      case "checkNumber":
        return { kind: "bad", title: "Check the number", body: "Check the number." };
      default:
        return { kind: "ok", title: "In your target", body: `Your ${where} target is ${band.label} mg/dL.` };
    }
  }, [validationError, mgValue, context, label]);

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
      toast(t("health_metric_saved"));
      if (mg < 70) {
        setCrisisMg(mg);
        return;
      }
      back();
    } catch (error) {
      setSaving(false);
      toast(error instanceof MobileApiError && error.status === 0 ? error.message : t("failed_to_save_metric"), { error: true });
    }
  };

  if (crisisMg !== null) return <LowGlucoseCrisis mgDl={crisisMg} onDone={back} />;

  const display = digits ? (isMmol ? (Number.parseFloat(digits).toFixed(1) === "NaN" ? digits : Number.parseFloat(digits).toFixed(1)) : digits) : "";

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
        <div style={{ padding: "8px 18px 0" }}>
          <RangeBar valueMg={validationError !== null && mgValue === null ? null : mgValue} context={context} displayLabel={display} />
        </div>
        <div style={{ padding: "12px 18px 0" }}>
          <MetricFeedbackBox {...feedback} />
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

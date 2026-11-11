"use client";

import { useEffect, useMemo, useState } from "react";
import { Weight } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { useBack } from "@/lib/plus/nav";
import { latestByType } from "@/lib/plus/health";
import { useMetrics } from "@/lib/plus/client/data";
import { saveReading } from "@/lib/plus/client/readings";
import { MobileApiError } from "@/lib/plus/client/api";
import { useFeedback } from "../ui/vita";
import { DateLine, FUTURE_TIME_MESSAGE, MetricLogScaffold, TimeChip, TimePickerModal } from "./log-chrome";

function StepButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--vc-tile-mint)", color: "var(--vc-navy)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
      {children}
    </button>
  );
}

export default function LogWeightScreen() {
  const t = useT();
  const back = useBack();
  const { toast } = useFeedback();
  const { metrics, loading } = useMetrics();
  const [day, setDay] = useState(() => new Date());
  const [time, setTime] = useState(() => ({ hour: new Date().getHours(), minute: new Date().getMinutes() }));
  const [picking, setPicking] = useState(false);
  const [text, setText] = useState("70.0");
  const [seeded, setSeeded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (seeded || loading) return;
    const previous = Number.parseFloat(latestByType(metrics).weight?.latest_value ?? "") || 0;
    const seed = previous > 0 ? Math.min(250, Math.max(20, previous)) : 70;
    setText(seed.toFixed(1));
    setSeeded(true);
  }, [metrics, loading, seeded]);

  const kg = useMemo(() => {
    const parsed = Number.parseFloat(text.trim().replace(",", "."));
    if (!Number.isFinite(parsed) || parsed < 20 || parsed > 250) return null;
    return parsed;
  }, [text]);

  const write = (value: number) => setText(Math.min(250, Math.max(20, value)).toFixed(1));
  const step = (delta: number) => write(Math.round(((kg ?? 70) + delta) * 2) / 2);
  const stamp = new Date(day.getFullYear(), day.getMonth(), day.getDate(), time.hour, time.minute);
  const timeLabel = `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`;

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
      toast(t("health_metric_saved"));
      back();
    } catch (error) {
      setSaving(false);
      toast(error instanceof MobileApiError && error.status === 0 ? error.message : t("failed_to_save_metric"), { error: true });
    }
  };

  return (
    <MetricLogScaffold title={t("add_weight")} icon={<Weight size={17} color="currentColor" />} saveLabel={t("save")} loading={saving} onSave={kg === null ? undefined : save}>
      <div style={{ padding: "8px 16px 24px" }}>
        <DateLine value={day} onChange={setDay} />
        <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
          <TimeChip label={timeLabel} onClick={() => setPicking(true)} />
        </div>
        <p style={{ margin: "28px 0 0", textAlign: "center", fontSize: 22, fontWeight: 800, color: "var(--vc-ink)" }}>
          {t("your_weight")}
          <span style={{ color: "#D64545", fontWeight: 700 }}> *</span>
        </p>
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <StepButton label="Less" onClick={() => step(-0.5)}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14" /></svg>
          </StepButton>
          <label style={{ flex: 1, display: "flex", alignItems: "baseline", justifyContent: "center", minWidth: 0 }}>
            <input
              inputMode="decimal"
              value={text}
              onChange={(e) => setText(e.target.value.replace(/[^0-9.,]/g, ""))}
              aria-label={t("your_weight")}
              style={{ width: "100%", minWidth: 0, textAlign: "center", fontSize: 56, fontWeight: 800, color: "var(--vc-ink)", background: "transparent", border: 0, outline: "none" }}
            />
            <span style={{ fontSize: 18, fontWeight: 700, color: "rgba(var(--vc-navy-rgb),0.45)", marginLeft: -24 }}>kg</span>
          </label>
          <StepButton label="More" onClick={() => step(0.5)}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14M12 5v14" /></svg>
          </StepButton>
        </div>
        <input type="range" className="vita-range" min={20} max={250} step={0.5} value={Math.min(250, Math.max(20, kg ?? 70))} onChange={(e) => write(Number.parseFloat(e.target.value))} style={{ marginTop: 12 }} />
        <p style={{ margin: "8px 0 0", textAlign: "center", fontSize: 13, fontWeight: 600, color: kg === null ? "#D64545" : "rgba(var(--vc-navy-rgb),0.55)" }}>
          {kg === null ? "Enter a weight between 20 and 250 kg." : "Type it, tap + or −, or drag the line. Each tap is 0.5 kg."}
        </p>
      </div>
      <TimePickerModal open={picking} value={time} onClose={() => setPicking(false)} onPick={setTime} />
    </MetricLogScaffold>
  );
}

"use client";

import { requestNotificationPermission } from "@/lib/plus/web-notifications";
import { useState } from "react";
import { ArrowDown2, Calendar1, Edit, Health, NoteText, Refresh, Repeat, Trash } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { useMe } from "@/lib/plus/client/data";
import { mobileRequest } from "@/lib/plus/client/api";
import { markDose, refreshMedications, useAdherence, useMedicationHistory, useMedications } from "@/lib/plus/client/meds";
import { DOSE_COLORS, canMarkDoseTaken, defaultTimesForFrequency, effectiveSlotStatus, type MedicationSlot } from "@/lib/plus/medication";
import { useTheme } from "@/lib/plus/theme";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { useBack } from "@/lib/plus/nav";
import { ActionButton, AppBar, Card, CenterSpinner, CircleButton, EmptyState, Modal, useFeedback } from "../ui/vita";
import { AuthField, FieldCaption, SelectRow } from "../ui/fields";
import { MetricLogScaffold, TimePickerModal } from "../readings/log-chrome";
import { AdherenceSummaryCard, MedicationListCard } from "./cards";

const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;
const plus = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>;

/** medication_page.dart */
export function MedicationsScreen() {
  const t = useT();
  const { push } = usePlusPaths();
  const meds = useMedications();
  const adherence = useAdherence(7);
  const [marking, setMarking] = useState(false);
  const loading = (meds.loading && !meds.data) || (adherence.loading && !adherence.data);
  const failed = (meds.error && !meds.data) || (adherence.error && !adherence.data);
  const next = adherence.data?.next_due ?? null;
  const canMark = next ? canMarkDoseTaken(next.date, next.time) : false;
  const markNext = async () => {
    if (!next || !canMark) return;
    setMarking(true);
    try {
      await markDose(next.medication_id, next.date, next.time, "taken");
    } catch {
      /* Flutter stays quiet */
    }
    setMarking(false);
  };
  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={t("medications_title")} actions={<CircleButton label={t("add_medication")} onClick={() => push("/medications/add")}>{plus}</CircleButton>} />
      {loading ? (
        <CenterSpinner />
      ) : failed ? (
        <div style={{ paddingTop: 120 }}>
          <EmptyState title={t("network_error")} subtitle={t("coaches_load_failed_body")} actionLabel={t("retry")} onAction={() => refreshMedications()} actionIcon={<Refresh size={16} color="currentColor" />} />
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 28px" }}>
          {adherence.data && meds.list.length ? (
            <div style={{ marginBottom: 16 }}>
              <AdherenceSummaryCard adherence={adherence.data} marking={marking} onMarkTaken={!next || !canMark ? undefined : markNext} />
            </div>
          ) : null}
          {!meds.list.length ? (
            <EmptyState title={t("no_medications")} subtitle={t("no_medications_body")} />
          ) : (
            <>
              {meds.list.map((m) => (
                <MedicationListCard key={m.id} medication={m} onClick={() => push(`/medications/${m.id}`)} />
              ))}
              <p style={{ margin: "8px 0 0", textAlign: "center", fontSize: 12, fontWeight: 500, color: navyA(0.4) }}>Add only medicines your doctor prescribed. Your care team sees this list.</p>
            </>
          )}
          <div style={{ height: 20 }} />
          <ActionButton full label={t("add_medication")} icon={plus} onClick={() => push("/medications/add")} />
        </div>
      )}
    </div>
  );
}

function HistoryBadge({ slot }: { slot: MedicationSlot }) {
  const { dark } = useTheme();
  const colors = DOSE_COLORS[slot.status];
  const [bg, fg] = colors ? (dark ? colors.dark : colors.light) : ["var(--vc-surface-muted)", "var(--vc-muted)"];
  const label = slot.status === "taken" ? `${slot.time} taken` : slot.status === "due" || slot.status === "pending" ? `${slot.time} due` : slot.status === "missed" ? `${slot.time} missed` : slot.time;
  return <span style={{ padding: "6px 10px", borderRadius: 10, background: bg, color: fg, fontWeight: 700, fontSize: 12 }}>{label}</span>;
}

/** medication_detail_page.dart */
export function MedicationDetailScreen({ id }: { id: number }) {
  const t = useT();
  const goBack = useBack("/medications");
  const { toast, confirm } = useFeedback();
  const meds = useMedications();
  const history = useMedicationHistory(id, 30);
  const med = meds.list.find((m) => m.id === id);
  if (!med) return <div className="vita-page" style={{ background: "var(--vc-canvas)" }}><AppBar title={t("medications_title")} />{meds.loading ? <CenterSpinner /> : <EmptyState title={t("no_medications")} />}</div>;

  const remove = async () => {
    const ok = await confirm({ title: "Remove medicine", message: `Remove ${med.name} from your list?`, confirmLabel: "Delete", cancelLabel: "Cancel", destructive: true });
    if (!ok) return;
    try {
      await mobileRequest(`/medications/${med.id}/`, { method: "DELETE" });
      refreshMedications();
      goBack();
    } catch {
      /* Flutter stays quiet */
    }
  };
  const mark = async (date: string, time: string, status: "taken" | "missed") => {
    try {
      await markDose(med.id, date, time, status);
      await history.reload();
    } catch {
      /* quiet */
    }
  };
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const y = new Date(today);
  y.setDate(today.getDate() - 1);
  const yKey = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, "0")}-${String(y.getDate()).padStart(2, "0")}`;
  const dayTitle = (date: string) => {
    if (date === todayKey) return "Today";
    if (date === yKey) return "Yesterday";
    const d = new Date(`${date}T00:00:00`);
    if (Number.isNaN(d.getTime())) return date;
    return `${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()]} ${d.getDate()} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()]}`;
  };
  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={med.name} actions={<CircleButton label="Delete" onClick={remove}><Trash size={18} color="currentColor" /></CircleButton>} />
      {history.loading && !history.data ? (
        <CenterSpinner />
      ) : history.error && !history.data ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ActionButton label="Retry" icon={<Refresh size={16} color="currentColor" />} onClick={() => void history.reload()} />
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 28px" }}>
          <MedicationListCard medication={med} onClick={() => undefined} />
          <h3 style={{ margin: "8px 0 0", fontSize: 18, fontWeight: 800, color: "var(--vc-navy)" }}>Dose history</h3>
          <p style={{ margin: "4px 0 12px", fontSize: 13, fontWeight: 500, color: navyA(0.5) }}>Every day you took — or missed — this medicine.</p>
          {!history.data?.length ? (
            <p style={{ margin: 0, fontWeight: 600, color: navyA(0.5) }}>No history yet. Mark doses from Medicines.</p>
          ) : (
            history.data.map((day) => (
              <div key={day.date} style={{ marginBottom: 10, padding: "12px 14px", borderRadius: 8, background: "var(--vc-surface)", border: `1px solid ${navyA(0.06)}` }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "var(--vc-navy)" }}>{dayTitle(day.date)}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                  {day.slots.map((slot) => {
                    const display = { ...slot, status: effectiveSlotStatus(slot.status, day.date, slot.time) };
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => {
                          if (display.status === "taken") return void mark(day.date, slot.time, "missed");
                          if (!canMarkDoseTaken(day.date, slot.time, slot.status)) return toast(`You can mark this dose from 30 minutes before ${slot.time}.`);
                          void mark(day.date, slot.time, "taken");
                        }}
                      >
                        <HistoryBadge slot={display} />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const UNITS = ["mg", "ml", "tablet", "drops", "capsule", "IU"];
const PRESETS: Array<[number | null, string]> = [
  [1, "Once a day"],
  [2, "Twice a day"],
  [3, "3 times a day"],
  [4, "4 times a day"],
  [5, "5 times a day"],
  [6, "6 times a day"],
  [null, "Custom"],
];
type Hm = { hour: number; minute: number };
const toHm = (s: string): Hm => {
  const [h, m] = s.split(":");
  return { hour: Number.parseInt(h, 10) || 8, minute: Number.parseInt(m ?? "0", 10) || 0 };
};
const fmt = (t: Hm) => `${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}`;
const fmtLong = (d: Date) => `${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()]} ${d.getDate()} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()]} ${d.getFullYear()}`;
const ymdOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function UnderlineButton({ children, onClick, error = false, width }: { children: React.ReactNode; onClick: () => void; error?: boolean; width?: number }) {
  return (
    <button type="button" onClick={onClick} style={{ width: width ?? "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: `1px solid ${error ? "var(--vc-danger)" : navyA(0.55)}`, textAlign: "left" }}>
      {children}
    </button>
  );
}

/** add_medication.dart */
export function AddMedicationScreen() {
  const t = useT();
  const goBack = useBack("/medications");
  const { toast } = useFeedback();
  const { user } = useMe();
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [unit, setUnit] = useState("mg");
  const [preset, setPreset] = useState<number | null>(2);
  const [custom, setCustom] = useState(false);
  const [customText, setCustomText] = useState("");
  const [times, setTimes] = useState<Hm[]>([{ hour: 8, minute: 0 }, { hour: 20, minute: 0 }]);
  const [start, setStart] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [instructions, setInstructions] = useState("");
  const [touched, setTouched] = useState({ name: false, dose: false, freq: false, custom: false });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [sheet, setSheet] = useState<null | "unit" | "freq" | "date" | { time: number }>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const n = name.trim();
  const dosage = dose.trim() ? (/^\d+$/.test(dose.trim()) ? Number.parseInt(dose.trim(), 10) : null) : null;
  const resolvedFreq = custom ? (customText.trim() && /^\d+$/.test(customText.trim()) ? Number.parseInt(customText.trim(), 10) : null) : preset;
  const hasFreq = custom || preset !== null;
  const future = start.getTime() > today.getTime();
  const nameError = !touched.name && !n ? null : !n ? "Enter the medication name" : n.length < 2 ? "Name should be at least 2 characters" : null;
  const doseRaw = dose.trim();
  const doseError = !touched.dose && !doseRaw ? null : !doseRaw ? "Enter the dose" : dosage === null ? "Dose must be a whole number" : dosage < 1 ? "Dose must be at least 1" : dosage > 100000 ? "That dose looks too high" : null;
  const customError = !custom ? null : !touched.custom && !customText.trim() ? null : !customText.trim() ? "Enter times per day" : resolvedFreq === null ? "Use a whole number" : resolvedFreq < 1 || resolvedFreq > 24 ? "Choose between 1 and 24 times a day" : null;
  const freqError = touched.freq && !hasFreq ? "Choose how often to take it" : null;
  const canSave = !saving && !future && n.length >= 2 && dosage !== null && dosage >= 1 && dosage <= 100000 && hasFreq && resolvedFreq !== null && resolvedFreq >= 1 && resolvedFreq <= 24;
  const freqLabel = !hasFreq ? "Select frequency" : custom ? (customText.trim() ? `${customText.trim()} times a day` : "Custom") : PRESETS.find((p) => p[0] === preset)?.[1] ?? "Select frequency";
  const applyDefaults = (f: number) => setTimes(defaultTimesForFrequency(f).map(toHm));

  const save = async () => {
    setTouched({ name: true, dose: true, freq: true, custom: custom });
    if (future) return setSubmitError(t("medication_start_date_future"));
    if (!canSave) return;
    setSaving(true);
    setSubmitError(null);
    // Like add_medication.dart scheduling reminders: ask while we still have the tap.
    const permission = requestNotificationPermission();
    try {
      await mobileRequest("/medications/", {
        method: "POST",
        body: { user: user?.id ?? null, name: n, date_added: ymdOf(start), dosage, frequency: resolvedFreq, unit, times: times.map(fmt), instructions: instructions.trim() || null, reminders_enabled: true },
      });
      refreshMedications();
      await permission;
      toast(t("medication_saved"));
      goBack();
    } catch {
      setSaving(false);
      setSubmitError(t("failed_to_save_metric"));
    }
  };

  const lineText = (s: string, muted = false) => <span style={{ flex: 1, fontSize: 16, fontWeight: 500, color: muted ? navyA(0.32) : "var(--vc-ink)" }}>{s}</span>;
  const caret = (error = false) => <ArrowDown2 size={20} color={error ? "var(--vc-danger)" : navyA(0.55)} />;
  const timeIndex = typeof sheet === "object" && sheet ? sheet.time : -1;

  return (
    <MetricLogScaffold title={t("add_medication")} icon={<Health size={20} color="currentColor" />} saveLabel={t("save_medication")} loading={saving} onSave={saving ? undefined : save}>
      <div style={{ padding: "8px 16px 24px" }}>
        <Card>
          <AuthField label={t("medication_name")} required hint={t("medication_name")} icon={<Health size={20} color="currentColor" />} value={name} onChange={(v) => { setName(v); setSubmitError(null); setTouched((x) => ({ ...x, name: true })); }} error={nameError} />
          <div style={{ height: 14 }} />
          <FieldCaption text="Dose" required />
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ flex: 2, minWidth: 0 }}>
              <input
                inputMode="numeric"
                value={dose}
                placeholder="250"
                onChange={(e) => { setDose(e.target.value); setSubmitError(null); setTouched((x) => ({ ...x, dose: true })); }}
                style={{ width: "100%", padding: "14px 0", border: 0, borderBottom: `1px solid ${doseError ? "var(--vc-danger)" : navyA(0.55)}`, outline: "none", background: "transparent", fontSize: 16, fontWeight: 500, color: "var(--vc-ink)" }}
              />
              {doseError ? <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.3, color: "var(--vc-danger)" }}>{doseError}</div> : null}
            </div>
            <div style={{ flex: 3, minWidth: 0 }}>
              <UnderlineButton onClick={() => setSheet("unit")}>
                {lineText(unit)}
                {caret()}
              </UnderlineButton>
            </div>
          </div>
          <div style={{ height: 14 }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: freqError ? "var(--vc-danger)" : navyA(0.7), marginBottom: 8 }}>How often<span style={{ color: "var(--vc-danger)" }}> *</span></div>
          <UnderlineButton onClick={() => setSheet("freq")} error={Boolean(freqError)}>
            <Repeat size={22} color={freqError ? "var(--vc-danger)" : navyA(0.55)} />
            {lineText(freqLabel, !hasFreq)}
            {caret(Boolean(freqError))}
          </UnderlineButton>
          {freqError ? <div style={{ marginTop: 6, fontSize: 12, color: "var(--vc-danger)" }}>{freqError}</div> : null}
          {custom ? (
            <>
              <div style={{ height: 14 }} />
              <AuthField
                label={t("frequency_per_day")}
                required
                hint="e.g. 8"
                icon={<Edit size={20} color="currentColor" />}
                inputMode="numeric"
                value={customText}
                error={customError}
                onChange={(v) => {
                  setCustomText(v);
                  setTouched((x) => ({ ...x, custom: true }));
                  const k = Number.parseInt(v.trim(), 10);
                  if (k >= 1 && k <= 12) applyDefaults(k);
                }}
              />
            </>
          ) : null}
          <div style={{ height: 14 }} />
          <FieldCaption text="Reminder times" required />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px" }}>
            {times.map((tm, i) => (
              <UnderlineButton key={i} width={72} onClick={() => setSheet({ time: i })}>
                <span style={{ flex: 1, textAlign: "center", fontWeight: 600, fontSize: 16, color: "var(--vc-ink)" }}>{fmt(tm)}</span>
              </UnderlineButton>
            ))}
          </div>
          <div style={{ height: 14 }} />
          <AuthField label={t("start_date")} required hint={t("start_date")} icon={<Calendar1 size={20} color="currentColor" />} value={fmtLong(start)} onClick={() => setSheet("date")} readOnly error={future ? t("medication_start_date_future") : null} />
          <div style={{ height: 14 }} />
          <AuthField label="Instructions (optional)" hint="e.g. Take with food" icon={<NoteText size={20} color="currentColor" />} value={instructions} onChange={setInstructions} />
          {submitError ? <p style={{ margin: "12px 0 0", color: "var(--vc-danger)", fontSize: 13, fontWeight: 600 }}>{submitError}</p> : null}
        </Card>
      </div>
      <Modal open={sheet === "unit"} title="Unit" onClose={() => setSheet(null)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {UNITS.map((u) => (
            <SelectRow key={u} label={u} selected={unit === u} onClick={() => { setUnit(u); setSheet(null); }} />
          ))}
        </div>
      </Modal>
      <Modal open={sheet === "freq"} title="How often" onClose={() => setSheet(null)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {PRESETS.map(([v, label]) => (
            <SelectRow
              key={label}
              label={label}
              selected={v === null ? custom : !custom && preset === v}
              onClick={() => {
                setTouched((x) => ({ ...x, freq: true }));
                setCustom(v === null);
                setPreset(v);
                setSubmitError(null);
                if (v !== null) {
                  setCustomText("");
                  setTouched((x) => ({ ...x, custom: false }));
                  applyDefaults(v);
                }
                setSheet(null);
              }}
            />
          ))}
        </div>
      </Modal>
      <Modal open={sheet === "date"} compact title={t("start_date")} onClose={() => setSheet(null)}>
        <input
          type="date"
          className="vita-input"
          max={ymdOf(today)}
          min="2020-01-01"
          value={ymdOf(start)}
          onChange={(e) => {
            const [yy, mm, dd] = e.target.value.split("-").map(Number);
            if (!yy) return;
            const d = new Date(yy, mm - 1, dd);
            if (d.getTime() > today.getTime()) return;
            setStart(d);
            setSubmitError(null);
          }}
          style={{ fontSize: 18, fontWeight: 700, textAlign: "center" }}
        />
      </Modal>
      <TimePickerModal
        open={timeIndex >= 0}
        value={times[timeIndex] ?? { hour: 8, minute: 0 }}
        onClose={() => setSheet(null)}
        onPick={(v) => setTimes((list) => list.map((x, i) => (i === timeIndex ? v : x)).sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute)))}
      />
    </MetricLogScaffold>
  );
}

"use client";

import { requestNotificationPermission } from "@/lib/plus/web-notifications";
import { useState } from "react";
import { Alarm, Calendar1, Health, NoteText, Refresh, Trash } from "@/lib/plus/icons";
import { useT } from "@/lib/plus/i18n";
import { useMe } from "@/lib/plus/client/data";
import { mobileRequest } from "@/lib/plus/client/api";
import { duplicateOf } from "@/lib/plus/medicine-duplicate";
import { markDose, refreshMedications, useAdherence, useMedicationHistory, useMedications } from "@/lib/plus/client/meds";
import { DOSE_COLORS, canMarkDoseTaken, defaultTimesForFrequency, effectiveSlotStatus, joinTimes, medicineReminderSummary, type Medication, type MedicationSlot } from "@/lib/plus/medication";
import { useTheme } from "@/lib/plus/theme";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { useBack } from "@/lib/plus/nav";
import { ActionButton, AppBar, CenterSpinner, CircleButton, EmptyState, Modal, useFeedback } from "../ui/vita";
import { MetricLogScaffold, TimePickerModal } from "../readings/log-chrome";
import { MedicationListCard } from "./cards";
import { TodayDosesCard, WeekByMedicineCard } from "./pillbox-today";

const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;
const plus = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>;

/** medication_page.dart */
export function MedicationsScreen() {
  const t = useT();
  const { push } = usePlusPaths();
  const meds = useMedications();
  const adherence = useAdherence(7);
  const loading = (meds.loading && !meds.data) || (adherence.loading && !adherence.data);
  const failed = (meds.error && !meds.data) || (adherence.error && !adherence.data);
  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={t("pillbox")} actions={<CircleButton label={t("add_medication")} onClick={() => push("/medications/add")}>{plus}</CircleButton>} />
      {loading ? (
        <CenterSpinner />
      ) : failed ? (
        <div style={{ paddingTop: 120 }}>
          <EmptyState title={t("network_error")} subtitle={t("coaches_load_failed_body")} actionLabel={t("retry")} onAction={() => refreshMedications()} actionIcon={<Refresh size={16} color="currentColor" />} />
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 28px" }}>
          {meds.list.length ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>
              <TodayDosesCard />
              <WeekByMedicineCard meds={meds.list} />
            </div>
          ) : null}
          {!meds.list.length ? (
            <EmptyState title={t("no_medications")} subtitle={t("no_medications_body")} />
          ) : (
            <>
              <div className="vita-flex-list">
                {meds.list.map((m) => (
                  <MedicationListCard key={m.id} medication={m} onClick={() => push(`/medications/${m.id}`)} />
                ))}
              </div>
              <p style={{ margin: "8px 0 0", textAlign: "center", fontSize: 13, fontWeight: 500, color: navyA(0.4) }}>Add only medicines your doctor prescribed. Your care team sees this list.</p>
            </>
          )}
          <div style={{ height: 20 }} />
          <div className="vita-inline-cta">
            <ActionButton full label={t("add_medication")} icon={plus} onClick={() => push("/medications/add")} />
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryBadge({ slot }: { slot: MedicationSlot }) {
  const { dark } = useTheme();
  const colors = DOSE_COLORS[slot.status];
  const [bg, fg] = colors ? (dark ? colors.dark : colors.light) : ["var(--vc-surface-muted)", "var(--vc-muted)"];
  const label = slot.status === "taken" ? `${slot.time} taken` : slot.status === "due" || slot.status === "pending" ? `${slot.time} due` : slot.status === "missed" ? `${slot.time} missed` : slot.status === "skipped" ? `${slot.time} skipped` : slot.time;
  return <span style={{ padding: "6px 10px", borderRadius: 10, background: bg, color: fg, fontWeight: 700, fontSize: 13 }}>{label}</span>;
}

/** medication_detail_page.dart */
export function MedicationDetailScreen({ id }: { id: number }) {
  const t = useT();
  const goBack = useBack("/medications");
  const { toast, confirm } = useFeedback();
  const meds = useMedications();
  const history = useMedicationHistory(id, 30);
  const med = meds.list.find((m) => m.id === id);
  if (!med) return <div className="vita-page w-narrow" style={{ background: "var(--vc-canvas)" }}><AppBar title={t("medications_title")} />{meds.loading ? <CenterSpinner /> : <EmptyState title={t("no_medications")} />}</div>;

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
    <div className="vita-page w-narrow" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={med.name} actions={<CircleButton label="Delete" onClick={remove}><Trash size={18} color="currentColor" /></CircleButton>} />
      {history.loading && !history.data ? (
        <CenterSpinner />
      ) : history.error && !history.data ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ActionButton label="Retry" icon={<Refresh size={16} color="currentColor" />} onClick={() => void history.reload()} />
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 28px" }}>
          <MedicineRemindersCard med={med} />
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
type Hm = { hour: number; minute: number };
const toHm = (s: string): Hm => {
  const [h, m] = s.split(":");
  return { hour: Number.parseInt(h, 10) || 8, minute: Number.parseInt(m ?? "0", 10) || 0 };
};
const fmt = (t: Hm) => `${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}`;
const fmtLong = (d: Date) => `${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()]} ${d.getDate()} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()]} ${d.getFullYear()}`;
const ymdOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;


/** Common long-term medicines, offered as one-tap names (the member can still type any name). */
const COMMON_MEDS = ["Metformin", "Amlodipine", "Losartan", "Atorvastatin", "Hydrochlorothiazide", "Gliclazide", "Insulin", "Aspirin"];
const QUICK_FREQ: Array<[number, string]> = [[1, "med_freq_1"], [2, "med_freq_2"], [3, "med_freq_3"], [4, "med_freq_4"]];
const INSTRUCTION_CHIPS = ["med_instr_with_food", "med_instr_before_food", "med_instr_bedtime", "med_instr_empty_stomach", "med_instr_water"];
const COUNTABLE_UNITS = new Set(["tablet", "capsule", "drops"]);
const INSTRUCTIONS_MAX = 200;

function partOfDay(t: Hm): string {
  const m = t.hour * 60 + t.minute;
  if (m < 4 * 60) return "med_time_night";
  if (m < 12 * 60) return "med_time_morning";
  if (m < 17 * 60) return "med_time_afternoon";
  if (m < 21 * 60) return "med_time_evening";
  return "med_time_night";
}

function MedSection({ step, title, done, children, optional }: { step: number; title: string; done: boolean; optional?: string; children: React.ReactNode }) {
  return (
    <section className={`vita-med-section${done ? " done" : ""}`}>
      <header>
        <span className="num" aria-hidden>{done ? "✓" : step}</span>
        <h2>{title}</h2>
        {optional ? <span className="opt">{optional}</span> : null}
      </header>
      {children}
    </section>
  );
}

function FieldNote({ error, warn, ok }: { error?: string | null; warn?: string | null; ok?: string | null }) {
  if (error) return <p className="vita-med-note error" role="alert">{error}</p>;
  if (warn) return <p className="vita-med-note warn">{warn}</p>;
  if (ok) return <p className="vita-med-note ok">{ok}</p>;
  return null;
}

/** add_medication.dart, redesigned (24 Nov 2026): numbered sections, chips instead of dropdowns, live checks. */
export function AddMedicationScreen() {
  const t = useT();
  const goBack = useBack("/medications");
  const { toast } = useFeedback();
  const { user } = useMe();
  const { push } = usePlusPaths();
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [unit, setUnit] = useState("mg");
  const [freq, setFreq] = useState<number>(2);
  const [custom, setCustom] = useState(false);
  const [times, setTimes] = useState<Hm[]>([{ hour: 8, minute: 0 }, { hour: 20, minute: 0 }]);
  const [start, setStart] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [instructions, setInstructions] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [sheet, setSheet] = useState<null | "date" | { time: number }>(null);
  // W7: name of the medicine this looks like, while the warning is open.
  const [duplicate, setDuplicate] = useState<string | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today.getTime() - 86_400_000);
  const n = name.trim();
  const doseRaw = dose.trim();
  const dosage = /^\d+$/.test(doseRaw) ? Number.parseInt(doseRaw, 10) : null;

  // ── live checks: shown as soon as something is typed, or for everything after a save attempt ──
  const nameError = !n ? (attempted ? t("med_err_name_empty") : null) : n.length < 2 ? t("med_err_name_short") : !/\p{L}/u.test(n) ? t("med_err_name_letters") : n.length > 60 ? t("med_err_name_long") : null;
  const doseError = !doseRaw
    ? attempted ? t("med_err_dose_empty") : null
    : /[.,]/.test(doseRaw) ? t("med_err_dose_whole") : dosage === null ? t("med_err_dose_number") : dosage < 1 ? t("med_err_dose_min") : dosage > 100000 ? t("med_err_dose_max") : null;
  const doseWarn = !doseError && dosage !== null && COUNTABLE_UNITS.has(unit) && dosage > 10 ? t("med_warn_dose_many", { n: dosage, unit: t(`med_unit_${unit}`) }) : null;
  const freqError = freq < 1 || freq > 24 ? t("med_err_freq") : null;
  const sorted = [...times].sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));
  const dupTime = sorted.some((x, i) => i > 0 && fmt(x) === fmt(sorted[i - 1]));
  const timesError = dupTime ? t("med_err_times_same") : null;
  const future = start.getTime() > today.getTime();
  const startError = future ? t("medication_start_date_future") : null;
  const instrError = instructions.length > INSTRUCTIONS_MAX ? t("med_err_instructions_long", { max: INSTRUCTIONS_MAX }) : null;

  const nameOk = Boolean(n) && !nameError;
  const doseOk = dosage !== null && !doseError;
  const valid = nameOk && doseOk && !freqError && !timesError && !startError && !instrError;
  const missing = !nameOk ? (n ? t("med_hint_fix_name") : t("med_hint_add_name")) : !doseOk ? (doseRaw ? t("med_hint_fix_dose") : t("med_hint_add_dose")) : timesError ? t("med_hint_fix_times") : instrError ? t("med_hint_fix_instructions") : startError ? startError : null;

  const setFrequency = (f: number) => {
    const k = Math.max(1, Math.min(24, f));
    setFreq(k);
    setTimes(defaultTimesForFrequency(k).map(toHm));
    setSubmitError(null);
  };
  const stepDose = (d: number) => {
    const cur = dosage ?? 0;
    setDose(String(Math.max(1, cur + d)));
    setSubmitError(null);
  };
  const addInstruction = (key: string) => {
    const text = t(key);
    setInstructions((cur) => {
      if (cur.toLowerCase().includes(text.toLowerCase())) return cur;
      return cur.trim() ? `${cur.trim().replace(/[.,;]$/, "")}, ${text.toLowerCase()}` : text;
    });
  };

  const startLabel = start.getTime() === today.getTime() ? t("med_start_today") : start.getTime() === yesterday.getTime() ? t("med_start_yesterday") : fmtLong(start);
  const freqWords = freq === 1 ? t("med_freq_1") : freq === 2 ? t("med_freq_2") : t("med_freq_n", { n: freq });
  const summary = nameOk && doseOk
    ? t("med_summary", { name: n, dose: `${dosage} ${t(`med_unit_${unit}`)}`, freq: freqWords.toLowerCase(), times: joinTimes(sorted.map(fmt), t("list_and")), start: startLabel.toLowerCase() })
    : null;

  const save = async (confirmed = false) => {
    setAttempted(true);
    if (!valid || saving) return;
    setSaving(true);
    setSubmitError(null);
    if (!confirmed) {
      // W7: advice only; a failed check never blocks saving.
      const dup = duplicateOf(await mobileRequest("/medications/check-duplicate/", { method: "POST", body: { name: n } }).catch(() => null));
      if (dup) {
        setSaving(false);
        setDuplicate(dup.name);
        return;
      }
    }
    // Like add_medication.dart scheduling reminders: ask while we still have the tap.
    const permission = requestNotificationPermission();
    try {
      const body = { user: user?.id ?? null, name: n, date_added: ymdOf(start), dosage, frequency: freq, unit, times: sorted.map(fmt), instructions: instructions.trim() || null, reminders_enabled: true };
      const saved = await mobileRequest<Record<string, unknown>>("/medications/", { method: "POST", body });
      refreshMedications();
      await permission;
      // The medicine's own reminders are on from the start: say when they will ring.
      const reminders = medicineReminderSummary(saved && typeof saved === "object" ? saved : body);
      toast(reminders.enabled ? `${t("medication_saved")} · ${t("med_reminders_set", { times: joinTimes(reminders.times, t("list_and")) })}` : t("medication_saved"));
      goBack();
    } catch {
      setSaving(false);
      setSubmitError(t("failed_to_save_metric"));
    }
  };

  const timeIndex = typeof sheet === "object" && sheet ? sheet.time : -1;
  const showSuggestions = !n || (n.length < 12 && !COMMON_MEDS.some((m) => m.toLowerCase() === n.toLowerCase()));
  const suggestions = COMMON_MEDS.filter((m) => !n || m.toLowerCase().startsWith(n.toLowerCase())).slice(0, 6);

  return (
    <MetricLogScaffold
      title={t("add_medication")}
      icon={<Health size={20} color="currentColor" />}
      saveLabel={t("save_medication")}
      loading={saving}
      onSave={valid && !saving ? () => void save() : undefined}
      saveHint={missing}
    >
      <div className="vita-med-form">
        <MedSection step={1} title={t("med_section_name")} done={nameOk}>
          <label className={`vita-med-input${nameError ? " bad" : nameOk ? " good" : ""}`}>
            <Health size={22} color="currentColor" />
            <input
              value={name}
              autoComplete="off"
              autoCapitalize="words"
              placeholder={t("med_name_placeholder")}
              aria-label={t("medication_name")}
              aria-invalid={Boolean(nameError)}
              maxLength={80}
              onChange={(e) => { setName(e.target.value); setSubmitError(null); }}
              onKeyDown={(e) => { if (e.key === "Enter") (document.getElementById("med-dose") as HTMLInputElement | null)?.focus(); }}
            />
            {nameOk ? <span className="tick" aria-hidden>✓</span> : null}
          </label>
          <FieldNote error={nameError} />
          {showSuggestions && suggestions.length ? (
            <div className="vita-med-chips" aria-label={t("med_common")}>
              {suggestions.map((m) => (
                <button key={m} type="button" className="vita-med-chip" onClick={() => { setName(m); setSubmitError(null); }}>
                  {m}
                </button>
              ))}
            </div>
          ) : null}
        </MedSection>

        <MedSection step={2} title={t("med_section_dose")} done={doseOk}>
          <div className="vita-med-dose">
            <button type="button" className="step" aria-label={t("med_less")} onClick={() => stepDose(COUNTABLE_UNITS.has(unit) ? -1 : -50)} disabled={!dosage || dosage <= 1}>−</button>
            <label className={`vita-med-input center${doseError ? " bad" : doseOk ? " good" : ""}`}>
              <input
                id="med-dose"
                inputMode="numeric"
                value={dose}
                placeholder={COUNTABLE_UNITS.has(unit) ? "1" : "500"}
                aria-label={t("med_section_dose")}
                aria-invalid={Boolean(doseError)}
                maxLength={6}
                onChange={(e) => { setDose(e.target.value.replace(/[^\d.,]/g, "")); setSubmitError(null); }}
              />
              <span className="unit">{t(`med_unit_${unit}`)}</span>
            </label>
            <button type="button" className="step" aria-label={t("med_more")} onClick={() => stepDose(COUNTABLE_UNITS.has(unit) ? 1 : 50)}>+</button>
          </div>
          <FieldNote error={doseError} warn={doseWarn} />
          <div className="vita-med-chips" role="radiogroup" aria-label={t("med_unit")}>
            {UNITS.map((u) => (
              <button key={u} type="button" role="radio" aria-checked={unit === u} className={`vita-med-chip${unit === u ? " on" : ""}`} onClick={() => setUnit(u)}>
                {t(`med_unit_${u}`)}
              </button>
            ))}
          </div>
        </MedSection>

        <MedSection step={3} title={t("med_section_often")} done={!freqError}>
          <div className="vita-med-chips" role="radiogroup" aria-label={t("med_section_often")}>
            {QUICK_FREQ.map(([f, key]) => (
              <button key={f} type="button" role="radio" aria-checked={!custom && freq === f} className={`vita-med-chip big${!custom && freq === f ? " on" : ""}`} onClick={() => { setCustom(false); setFrequency(f); }}>
                {t(key)}
              </button>
            ))}
            <button type="button" role="radio" aria-checked={custom} className={`vita-med-chip big${custom ? " on" : ""}`} onClick={() => { setCustom(true); if (freq < 5) setFrequency(5); }}>
              {t("med_freq_other")}
            </button>
          </div>
          {custom ? (
            <div className="vita-med-dose small">
              <button type="button" className="step" aria-label={t("med_less")} onClick={() => setFrequency(freq - 1)} disabled={freq <= 1}>−</button>
              <span className="count">{t("med_freq_n", { n: freq })}</span>
              <button type="button" className="step" aria-label={t("med_more")} onClick={() => setFrequency(freq + 1)} disabled={freq >= 24}>+</button>
            </div>
          ) : null}
          <FieldNote error={freqError} />
        </MedSection>

        <MedSection step={4} title={t("med_section_times")} done={!timesError}>
          <div className="vita-med-times">
            {times.map((tm, i) => (
              <button key={i} type="button" className={`vita-med-time${timesError && sorted.filter((x) => fmt(x) === fmt(tm)).length > 1 ? " bad" : ""}`} onClick={() => setSheet({ time: i })} aria-label={`${t(partOfDay(tm))} ${fmt(tm)}`}>
                <Alarm size={18} color="currentColor" />
                <b>{fmt(tm)}</b>
                <small>{t(partOfDay(tm))}</small>
              </button>
            ))}
          </div>
          <FieldNote error={timesError} ok={!timesError ? t("med_times_note") : null} />
        </MedSection>

        <MedSection step={5} title={t("med_section_start")} done={!startError}>
          <div className="vita-med-chips" role="radiogroup" aria-label={t("start_date")}>
            <button type="button" role="radio" aria-checked={start.getTime() === today.getTime()} className={`vita-med-chip big${start.getTime() === today.getTime() ? " on" : ""}`} onClick={() => setStart(today)}>{t("med_start_today")}</button>
            <button type="button" role="radio" aria-checked={start.getTime() === yesterday.getTime()} className={`vita-med-chip big${start.getTime() === yesterday.getTime() ? " on" : ""}`} onClick={() => setStart(yesterday)}>{t("med_start_yesterday")}</button>
            <button type="button" role="radio" aria-checked={start.getTime() < yesterday.getTime()} className={`vita-med-chip big${start.getTime() < yesterday.getTime() ? " on" : ""}`} onClick={() => setSheet("date")}>
              <Calendar1 size={16} color="currentColor" />
              {start.getTime() < yesterday.getTime() ? fmtLong(start) : t("med_start_pick")}
            </button>
          </div>
          <FieldNote error={startError} />
        </MedSection>

        <MedSection step={6} title={t("med_section_instructions")} done={Boolean(instructions.trim()) && !instrError} optional={t("med_optional")}>
          <div className="vita-med-chips">
            {INSTRUCTION_CHIPS.map((key) => (
              <button key={key} type="button" className={`vita-med-chip${instructions.toLowerCase().includes(t(key).toLowerCase()) ? " on" : ""}`} onClick={() => addInstruction(key)}>
                {t(key)}
              </button>
            ))}
          </div>
          <label className={`vita-med-input area${instrError ? " bad" : ""}`}>
            <NoteText size={20} color="currentColor" />
            <textarea value={instructions} rows={2} placeholder={t("med_instructions_placeholder")} aria-label={t("med_section_instructions")} onChange={(e) => setInstructions(e.target.value)} />
          </label>
          <p className={`vita-med-count${instrError ? " bad" : ""}`}>{instructions.length}/{INSTRUCTIONS_MAX}</p>
          <FieldNote error={instrError} />
        </MedSection>

        <div className={`vita-med-summary${summary ? " ready" : ""}`} aria-live="polite">
          <b>{t("med_summary_title")}</b>
          <p>{summary ?? t("med_summary_empty")}</p>
        </div>
        {submitError ? <p className="vita-med-note error" role="alert">{submitError}</p> : null}
      </div>
      <Modal
        open={duplicate !== null}
        compact
        title={t("duplicate_medicine_title")}
        onClose={() => setDuplicate(null)}
        actions={
          <>
            <ActionButton small tone="white" label={t("duplicate_medicine_pharmacist")} onClick={() => { setDuplicate(null); push("/support"); }} />
            <ActionButton small label={t("duplicate_medicine_add_anyway")} onClick={() => { setDuplicate(null); void save(true); }} />
          </>
        }
      >
        <p data-testid="duplicate-medicine" style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--vc-body)" }}>{t("duplicate_medicine_body", { name: duplicate ?? "" })}</p>
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
            setSheet(null);
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

/** The reminders this medicine sets by itself, with an on/off switch (times follow the medicine). */
function MedicineRemindersCard({ med }: { med: Medication }) {
  const t = useT();
  const { toast } = useFeedback();
  const { push } = usePlusPaths();
  const [busy, setBusy] = useState(false);
  const summary = medicineReminderSummary(med);
  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await mobileRequest(`/medications/${med.id}/`, { method: "PATCH", body: { reminders_enabled: !med.reminders_enabled } });
      refreshMedications();
    } catch {
      toast(t("failed_to_save_metric"), { error: true });
    } finally {
      setBusy(false);
    }
  };
  return (
    <div data-testid="med-reminders" style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0 14px", padding: "12px 14px", borderRadius: 10, background: "var(--vc-surface)" }}>
      <span style={{ width: 40, height: 40, borderRadius: "50%", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--vc-tile-peach)", color: "var(--vc-navy)" }}>
        <Alarm size={20} color="currentColor" />
      </span>
      <button type="button" onClick={() => push("/reminders")} style={{ flex: 1, minWidth: 0, textAlign: "left", minHeight: 44 }}>
        <span style={{ display: "block", fontSize: 15, fontWeight: 800, color: "var(--vc-ink)" }}>
          {summary.enabled ? t("med_reminders_set", { times: joinTimes(summary.times, t("list_and")) }) : t("med_reminders_off")}
        </span>
        <span style={{ display: "block", marginTop: 2, fontSize: 13, color: "var(--vc-muted)" }}>{t("med_reminders_section_body")}</span>
      </button>
      <button
        type="button"
        role="switch"
        aria-checked={med.reminders_enabled}
        aria-label={t("med_reminders_toggle")}
        disabled={busy}
        onClick={() => void toggle()}
        style={{ width: 50, height: 30, borderRadius: 999, padding: 3, flex: "none", background: med.reminders_enabled ? "var(--vc-mint)" : "rgba(var(--vc-navy-rgb),0.12)" }}
      >
        <span style={{ display: "block", width: 24, height: 24, borderRadius: "50%", background: med.reminders_enabled ? "var(--vc-teal)" : "#fff", transform: `translateX(${med.reminders_enabled ? 20 : 0}px)`, transition: "transform 160ms", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
      </button>
    </div>
  );
}

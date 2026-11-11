"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar1, Call, NoteText } from "iconsax-react";
import { useMe } from "@/lib/plus/client/data";
import { MobileApiError, mobileRequest } from "@/lib/plus/client/api";
import { invalidate } from "@/lib/plus/client/use-resource";
import { MONTHS_SHORT, WEEKDAYS, WEEKDAYS_SHORT } from "@/lib/plus/format";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { ActionButton, AppBar, Modal, useFeedback } from "../ui/vita";
import { AuthField, DropdownField, SelectRow } from "../ui/fields";

const CLINIC_PHONE = "+250 795 767 405";
type Slot = { start: string; available: boolean };
const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;
const p2 = (n: number) => String(n).padStart(2, "0");
const dateKey = (d: Date) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
const parseDay = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const sameDay = (a: Date, b: Date) => dateKey(a) === dateKey(b);
const fmtEEEdMMM = (d: Date) => `${WEEKDAYS_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
const fmtEEEcdMMM = (d: Date) => `${WEEKDAYS_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
const fmtEEEEdMMM = (d: Date) => `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
const rwf = (v: unknown) => {
  const n = typeof v === "number" ? Math.round(v) : Number.parseInt(String(v ?? ""), 10) || 0;
  return `${n.toLocaleString("en-US")} RWF`;
};

function StepProgress({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i <= step ? "var(--vc-teal-ink)" : navyA(0.12), transition: "background 220ms" }} />
      ))}
    </div>
  );
}

function ModeChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{ flex: 1, padding: "14px 12px", borderRadius: 8, background: selected ? "var(--vc-teal)" : "var(--vc-wash)", color: selected ? "#fff" : "var(--vc-navy)", fontWeight: 700, fontSize: 14 }}>
      {label}
    </button>
  );
}

function ReadonlyChip({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--vc-navy)", marginBottom: 8 }}>{label}</div>
      <div style={{ padding: "14px 16px", borderRadius: 8, background: "var(--vc-wash)", fontSize: 15, fontWeight: 700, color: navyA(0.75) }}>{value}</div>
    </div>
  );
}

const h1 = (text: string) => <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, lineHeight: 1.2, color: "var(--vc-navy)" }}>{text}</h2>;
const sub = (text: string) => <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.4, fontWeight: 500, color: navyA(0.55) }}>{text}</p>;

export function BookVisitScreen() {
  const { push, replace } = usePlusPaths();
  const { toast } = useFeedback();
  const { user } = useMe();
  const name = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"clinic" | "call">("clinic");
  const [day, setDay] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const phoneSeeded = useRef(false);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [existingVisit, setExistingVisit] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [availability, setAvailability] = useState<Record<string, Slot[]>>({});
  const [quote, setQuote] = useState<Record<string, unknown> | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [sheet, setSheet] = useState<"day" | "time" | null>(null);

  useEffect(() => {
    if (phoneSeeded.current || !user) return;
    phoneSeeded.current = true;
    setPhone(user.profile?.phone_number ?? "");
  }, [user]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const body = await mobileRequest<Record<string, unknown>>("/api/v1/mobile/ehr/visit-availability");
        if (!alive) return;
        const mapped: Record<string, Slot[]> = {};
        for (const [date, raw] of Object.entries(body ?? {})) {
          if (!Array.isArray(raw)) continue;
          mapped[date] = raw
            .filter((r): r is Record<string, unknown> => Boolean(r) && typeof r === "object")
            .map((r) => {
              const s = String(r.start_time ?? "").trim();
              return { start: s.length >= 5 ? s.slice(0, 5) : "", available: r.available === true };
            })
            .filter((s) => /^\d{2}:\d{2}$/.test(s.start));
        }
        setAvailability(mapped);
        const first = Object.keys(mapped).sort().find((k) => mapped[k].some((s) => s.available));
        setDay((d) => d ?? (first ? parseDay(first) : null));
      } catch {
        // Flutter keeps the form usable and shows no free days.
      }
      if (alive) setLoadingSlots(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const days = Object.keys(availability).sort().filter((k) => availability[k].some((s) => s.available)).map(parseDay);
  const offersFor = (d: Date) => availability[dateKey(d)] ?? [];
  const freeFor = (d: Date) => offersFor(d).filter((s) => s.available).map((s) => s.start);
  const slots = day ? freeFor(day) : [];
  const whenReady = Boolean(day && time && freeFor(day).includes(time));
  const detailsReady = phone.trim().length >= 8;
  const whenLabel = !day ? "Pick a day" : time ? `${fmtEEEdMMM(day)} · ${time}` : fmtEEEdMMM(day);
  const modeLabel = mode === "call" ? "On a call" : "In clinic";

  const pickDay = () => {
    if (loadingSlots) return toast("Loading free times…");
    if (!days.length) return toast("No free days left to book right now", { error: true });
    setSheet("day");
  };
  const pickTime = () => {
    if (!day) return toast("Pick a day first", { error: true });
    if (!offersFor(day).length) return toast("No times this day. Pick another day.", { error: true });
    setSheet("time");
  };

  const loadQuote = async () => {
    const email = (user?.email ?? "").trim();
    const realEmail = email.includes("@") && !email.endsWith("@phone.vitaway.local");
    setQuoteLoading(true);
    setQuote(null);
    try {
      const body = await mobileRequest<Record<string, unknown>>("/api/v1/public/appointments/quote", { anonymous: true, query: { phone: phone.trim(), email: realEmail ? email : undefined } });
      if (body?.data && typeof body.data === "object") setQuote(body.data as Record<string, unknown>);
    } catch {
      // The booking can still be sent. The price line stays empty.
    }
    setQuoteLoading(false);
  };

  const submit = async (confirmNear: boolean) => {
    const p = phone.trim();
    if (!day || !time) return toast("Pick a day and a time", { error: true });
    if (p.length < 8) return toast("Add a phone number the clinic can call", { error: true });
    const n = note.trim();
    const message = [mode === "call" ? "On a call." : null, n || null, mode !== "call" && !n ? "Clinic visit requested from the app." : null].filter(Boolean).join(" ").trim();
    setSaving(true);
    try {
      await mobileRequest("/api/v1/mobile/ehr/visits", {
        method: "POST",
        body: { appointment_date: dateKey(day), appointment_time: time, phone: p, message, name, ...(confirmNear ? { confirm_near: true } : {}) },
      });
      toast("Visit requested. The clinic will confirm it.");
      invalidate("appointments:");
      replace("/appointments");
      return;
    } catch (error) {
      if (!(error instanceof MobileApiError) || !error.status) {
        toast("Could not reach Vitaway", { error: true });
        setSaving(false);
        return;
      }
      let msg = "Could not send the visit request. Try again.";
      let existing: string | null = null;
      const body = error.body;
      if (body && typeof body === "object") {
        const rec = body as Record<string, unknown>;
        if (rec.code === "near_appointment") {
          existing = typeof rec.when_label === "string" && rec.when_label.trim() ? rec.when_label.trim() : "your upcoming visit";
        }
        for (const key of ["error", "message", "detail"]) {
          const v = rec[key];
          if (typeof v === "string" && v.trim()) {
            msg = v.trim();
            break;
          }
        }
      }
      if (existing) {
        setExistingVisit(existing);
      } else {
        if (/not configured|firebase/i.test(msg) || msg.includes("Exception")) msg = `The clinic could not take this request yet. Call ${CLINIC_PHONE}.`;
        toast(msg, { error: true });
      }
    }
    setSaving(false);
  };

  const goNext = () => {
    if (step === 0) {
      if (!whenReady) return toast(day ? "Pick a time" : "Pick a day", { error: true });
      return setStep(1);
    }
    if (step === 1) {
      if (!detailsReady) return toast("Add a phone number the clinic can call", { error: true });
      setStep(2);
      void loadQuote();
      return;
    }
    void submit(false);
  };

  const benefits = Array.isArray(quote?.benefits)
    ? (quote.benefits as unknown[]).filter((b): b is Record<string, unknown> => Boolean(b) && typeof b === "object").map((b) => [String(b.name ?? "Service"), `Covered ${rwf(b.covered_amount)} · ${rwf(b.amount)}`] as [string, string])
    : [];
  const rows: Array<[string, string]> = [
    ["Visit", modeLabel],
    ["When", whenLabel],
    ...(name ? [["Name", name] as [string, string]] : []),
    ["Phone", phone.trim()],
    ...(note.trim() ? [["Note", note.trim()] as [string, string]] : []),
    ...(quote && !benefits.length && Number(quote.discount_pct ?? 0) !== 0 ? [["Covered", `${String(quote.organization_name ?? "Partner")} · ${String(quote.discount_pct)}%`] as [string, string]] : []),
    ...benefits,
    ...(quote ? [["You pay", rwf(quote.amount)] as [string, string]] : []),
  ];

  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title="Book a visit" />
      <div style={{ padding: "4px 20px 0" }}>
        <StepProgress step={step} total={3} />
      </div>
      <div key={step} className="vita-step-in" style={{ flex: 1, overflowY: "auto", padding: "18px 20px 16px" }}>
        {step === 0 ? (
          <>
            {h1("When should we see you?")}
            {sub("Pick a day and a time at least one hour from now.")}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <ModeChip label="In clinic" selected={mode === "clinic"} onClick={() => setMode("clinic")} />
              <ModeChip label="On a call" selected={mode === "call"} onClick={() => setMode("call")} />
            </div>
            <div style={{ height: 18 }} />
            <DropdownField label="Day" required value={day ? fmtEEEcdMMM(day) : null} placeholder="Select a day" onClick={pickDay} />
            <div style={{ height: 14 }} />
            <DropdownField label="Time" required value={time} placeholder={!day ? "Pick a day first" : !slots.length ? "No times left today" : "Select a time"} enabled={Boolean(day) && slots.length > 0} onClick={pickTime} />
            {day && !slots.length ? <p style={{ margin: "10px 0 0", fontSize: 12, fontWeight: 500, color: navyA(0.55) }}>Times need to be at least one hour from now.</p> : null}
          </>
        ) : step === 1 ? (
          <>
            {h1("A few details")}
            {sub("Name and phone are enough. The clinic uses these to confirm.")}
            <button type="button" onClick={() => setStep(0)} style={{ marginTop: 8, padding: 0, color: "var(--vc-action)", fontWeight: 700, fontSize: 13, textAlign: "left" }}>
              {`Change day or time · ${whenLabel}`}
            </button>
            <div style={{ height: 16 }} />
            {name ? (
              <>
                <ReadonlyChip label="Name" value={name} />
                <div style={{ height: 14 }} />
              </>
            ) : null}
            <AuthField label="Phone" required hint="Phone the clinic can call" icon={<Call size={20} color="currentColor" />} type="tel" inputMode="tel" value={phone} onChange={setPhone} autoComplete="tel" />
            <div style={{ height: 14 }} />
            <AuthField label="Note" hint="Anything we should know? (optional)" icon={<NoteText size={20} color="currentColor" />} multiline value={note} onChange={setNote} />
          </>
        ) : (
          <>
            {h1("Check this is right")}
            {sub("We’ll only send the request after you confirm.")}
            <div style={{ marginTop: 18, padding: "16px 18px", borderRadius: 10, background: "var(--vc-wash)", display: "flex", flexDirection: "column", gap: 14 }}>
              {rows.map(([k, v], i) => (
                <div key={`${k}-${i}`} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: navyA(0.5) }}>{k}</span>
                  <span style={{ flex: 1, textAlign: "right", fontSize: 14, fontWeight: 700, color: "var(--vc-navy)", wordBreak: "break-word" }}>{v}</span>
                </div>
              ))}
            </div>
            {quoteLoading ? <p style={{ margin: "12px 0 0", fontSize: 13, color: navyA(0.55) }}>Working out the partner price…</p> : null}
            {existingVisit ? (
              <>
                <p style={{ margin: "16px 0 12px", fontSize: 15, fontWeight: 700, lineHeight: 1.35, color: "var(--vc-navy)" }}>{`You already have a visit on ${existingVisit}.`}</p>
                <ActionButton full tone="white" label="Reschedule" icon={<Calendar1 size={16} color="currentColor" />} disabled={saving} onClick={() => push("/appointments")} />
                <div style={{ height: 8 }} />
                <ActionButton full label="Book this time anyway" disabled={saving} onClick={() => void submit(true)} />
              </>
            ) : null}
          </>
        )}
      </div>
      <div style={{ display: "flex", gap: 10, padding: "8px 20px calc(16px + env(safe-area-inset-bottom))" }}>
        {step > 0 ? (
          <ActionButton tone="white" iconFirst label="Back" disabled={saving} onClick={() => setStep((s) => s - 1)} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>} />
        ) : null}
        <div style={{ flex: 1, minWidth: 0 }}>
          <ActionButton
            full
            label={step === 2 ? "Confirm booking" : "Continue"}
            loading={saving}
            onClick={goNext}
            icon={step === 2 ? <Calendar1 size={16} color="currentColor" /> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>}
          />
        </div>
      </div>
      <Modal open={sheet === "day"} title="Day" onClose={() => setSheet(null)}>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: navyA(0.55) }}>Only days with a free clinic slot are listed.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {days.map((d) => (
            <SelectRow
              key={dateKey(d)}
              label={fmtEEEEdMMM(d)}
              selected={Boolean(day && sameDay(d, day))}
              onClick={() => {
                setDay(d);
                if (time && !freeFor(d).includes(time)) setTime(null);
                setSheet(null);
              }}
            />
          ))}
        </div>
      </Modal>
      <Modal open={sheet === "time"} title="Time" onClose={() => setSheet(null)}>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: navyA(0.55) }}>Free times are highlighted. Taken times stay greyed out.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {(day ? offersFor(day) : []).map((s) => (
            <SelectRow
              key={s.start}
              label={s.available ? s.start : `${s.start} · taken`}
              selected={time === s.start}
              disabled={!s.available}
              onClick={() => {
                setTime(s.start);
                setSheet(null);
              }}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}

"use client";

import { Select } from "../ui/select";

import { useEffect, useRef, useState } from "react";
import { Camera, TickCircle } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { useBack } from "@/lib/plus/nav";
import { MobileApiError } from "@/lib/plus/client/api";
import { certaintyKey, draftFrom, draftProblem, observationBody, readDevicePhoto, readType, saveConfirmedReading, type Draft, type PhotoRead, type PhotoReadType } from "@/lib/plus/photo-read";
import { ActionButton, AppBar, CenterSpinner, useFeedback } from "../ui/vita";

const card: React.CSSProperties = { marginBottom: 12, padding: 16, borderRadius: 14, border: "1px solid var(--vc-line)", background: "var(--vc-surface)" };
const TYPES: PhotoReadType[] = ["blood_pressure", "glucose", "weight"];
const TYPE_KEY: Record<PhotoReadType, string> = { blood_pressure: "pr_type_bp", glucose: "pr_type_glucose", weight: "pr_type_weight" };

function Field({ label, value, onChange, suffix, testId }: { label: string; value: string; onChange: (v: string) => void; suffix?: string; testId: string }) {
  return (
    <label style={{ display: "block", flex: 1, fontSize: 13, fontWeight: 700, color: "var(--vc-muted)" }}>
      {label}
      <span style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
        <input data-testid={testId} className="vita-input" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value.replace(",", "."))} style={{ fontSize: 24, fontWeight: 800 }} />
        {suffix ? <span style={{ fontSize: 13, fontWeight: 700, color: "var(--vc-ink)" }}>{suffix}</span> : null}
      </span>
    </label>
  );
}

/** W30 (BL-156): photo of the device screen → the server reads it → the member checks and confirms → saved as "from photo, checked by you". */
export function PhotoReadScreen({ initialType }: { initialType: string | null }) {
  const t = useT();
  const back = useBack();
  const { toast } = useFeedback();
  const input = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<PhotoReadType>(readType(initialType));
  const [preview, setPreview] = useState<string | null>(null);
  const [reading, setReading] = useState(false);
  const [read, setRead] = useState<PhotoRead | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => () => (preview ? URL.revokeObjectURL(preview) : undefined), [preview]);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setRead(null);
    setChecked(false);
    setReading(true);
    try {
      const r = await readDevicePhoto(type, file);
      setRead(r);
      setDraft(draftFrom(r));
    } catch (error) {
      toast(error instanceof MobileApiError ? error.message : t("pr_read_failed"), { error: true });
      setPreview(null);
    } finally {
      setReading(false);
    }
  };

  const problem = read && draft ? draftProblem(read.type, draft) : null;
  const save = async () => {
    if (!read || !draft || problem || !checked) return;
    setSaving(true);
    try {
      await saveConfirmedReading(observationBody(read.type, draft, read.photo_token, new Date().toISOString()));
      setSaved(true);
    } catch (error) {
      toast(error instanceof MobileApiError ? error.message : t("failed_to_save_metric"), { error: true });
    } finally {
      setSaving(false);
    }
  };
  const set = (k: keyof Draft) => (v: string) => setDraft((d) => (d ? { ...d, [k]: v } : d));

  if (saved && read && draft) {
    return (
      <div className="vita-page w-narrow" style={{ background: "var(--vc-canvas)" }}>
        <AppBar title={t("pr_title")} bubbles={false} />
        <div style={{ padding: "32px 20px", maxWidth: 560, width: "100%", margin: "0 auto", textAlign: "center" }} data-testid="pr-saved">
          <TickCircle size={56} color="var(--vc-teal)" variant="Bold" />
          <p style={{ margin: "12px 0 4px", fontSize: 18, fontWeight: 800, color: "var(--vc-ink)" }}>{t("pr_saved")}</p>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "var(--vc-teal-ink)" }}>
            {read.type === "blood_pressure" ? `${draft.systolic}/${draft.diastolic} mmHg` : `${draft.value} ${draft.unit}`}
          </p>
          <span style={{ display: "inline-block", marginTop: 10, padding: "4px 10px", borderRadius: 999, background: "var(--vc-mint)", color: "#0f3a3a", fontSize: 13, fontWeight: 800 }}>{t("pr_label")}</span>
          <div style={{ marginTop: 24 }}>
            <ActionButton full label={t("done")} onClick={back} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vita-page w-narrow" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={t("pr_title")} bubbles={false} />
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px calc(env(safe-area-inset-bottom) + 32px)", maxWidth: 560, width: "100%", margin: "0 auto" }}>
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--vc-muted)", marginBottom: 8 }}>{t("pr_what")}</div>
          <div style={{ display: "flex", gap: 8 }}>
            {TYPES.map((x) => (
              <button key={x} type="button" aria-pressed={type === x} disabled={Boolean(read) || reading} onClick={() => setType(x)} style={{ flex: 1, padding: "10px 4px", borderRadius: 10, fontSize: 13, fontWeight: 800, border: `1px solid ${type === x ? "var(--vc-teal)" : "var(--vc-line)"}`, background: type === x ? "var(--vc-mint)" : "transparent", color: type === x ? "#0f3a3a" : "var(--vc-ink)" }}>
                {t(TYPE_KEY[x])}
              </button>
            ))}
          </div>
          <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--vc-muted)" }}>{t("pr_tip")}</p>
          <input ref={input} data-testid="pr-file" type="file" accept="image/*" capture="environment" hidden onChange={(e) => void pick(e.target.files?.[0])} />
          <div style={{ marginTop: 12 }}>
            <ActionButton full tone={read ? "white" : undefined} label={read ? t("pr_retake") : t("pr_take")} icon={<Camera size={16} color="currentColor" />} onClick={() => { setRead(null); input.current?.click(); }} />
          </div>
        </div>

        {preview ? (
          <div style={{ ...card, padding: 8 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt={t("pr_photo_alt")} style={{ display: "block", width: "100%", maxHeight: 280, objectFit: "contain", borderRadius: 10, background: "#000" }} />
          </div>
        ) : null}
        {reading ? <CenterSpinner label={t("pr_reading")} /> : null}

        {read && draft ? (
          <div style={card} data-testid="pr-confirm">
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--vc-navy)" }}>{t("pr_check_title")}</div>
            <p style={{ margin: "6px 0 12px", fontSize: 13, fontWeight: 700, color: read.certainty === "found" ? "var(--vc-teal-ink)" : "var(--vc-danger)" }} data-testid="pr-certainty">
              {read.reader_available ? t(certaintyKey(read.certainty)) : t("pr_reader_off")}
            </p>
            {read.type === "blood_pressure" ? (
              <div style={{ display: "flex", gap: 10 }}>
                <Field testId="pr-sys" label={t("pr_sys")} value={draft.systolic} onChange={set("systolic")} />
                <Field testId="pr-dia" label={t("pr_dia")} value={draft.diastolic} onChange={set("diastolic")} />
                <Field testId="pr-pulse" label={t("pr_pulse")} value={draft.pulse} onChange={set("pulse")} />
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <Field testId="pr-value" label={t(TYPE_KEY[read.type])} value={draft.value} onChange={set("value")} suffix={read.type === "weight" ? "kg" : undefined} />
                {read.type === "glucose" ? (
                  <Select compact label={t("settings_units")} value={draft.unit} onChange={(v) => set("unit")(v)} options={[{ value: "mmol/L", label: "mmol/L" }, { value: "mg/dL", label: "mg/dL" }]} style={{ width: 130 }} />
                ) : null}
              </div>
            )}
            {problem ? <p style={{ margin: "10px 0 0", fontSize: 13, fontWeight: 700, color: "var(--vc-danger)" }}>{t(problem)}</p> : null}
            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 14, fontSize: 14, color: "var(--vc-ink)" }}>
              <input data-testid="pr-checked" type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} style={{ width: 20, height: 20, marginTop: 1 }} />
              <span>{t("pr_i_checked")}</span>
            </label>
            <p style={{ margin: "10px 0 0", fontSize: 13, color: "var(--vc-muted)" }}>{t("pr_label_help")}</p>
            <div style={{ marginTop: 14 }}>
              <ActionButton full label={t("pr_save")} loading={saving} disabled={Boolean(problem) || !checked} onClick={() => void save()} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown2, ArrowRight3, Call, Camera, Clock, DocumentDownload, Edit2, FolderOpen, Location, Sms, Weight } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { useBack } from "@/lib/plus/nav";
import { asList, fetchProtectedBlob, mobileRequest } from "@/lib/plus/client/api";
import { useMetrics } from "@/lib/plus/client/data";
import { saveReading } from "@/lib/plus/client/readings";
import { useResource } from "@/lib/plus/client/use-resource";
import { latestByType } from "@/lib/plus/health";
import { convertHeight, convertWeight, useA1cUnit, useGlucoseUnit, useHeightUnit, useWeightUnit } from "@/lib/plus/units";
import { ActionButton, AppBar, Avatar, Card, CenterSpinner, Modal, Page, useFeedback } from "../ui/vita";
import { CountryPicker, FieldSheet, LanguageOptions, SOCIALS, VITAWAY_CONTACT, failureText, navyA, updateProfile, useAccountActions, useProfile } from "./shared";

const heightKnown = (h: number | null | undefined) => h != null && h > 0 && h !== 110;
const ageKnown = (a: number) => a > 0 && a !== 10;
const PLACEHOLDERS = new Set(["", "null", "no country", "no city", "no id", "no phone", "no bio", "no doc"]);
const filled = (v?: string | null) => {
  const text = (v ?? "").trim();
  return PLACEHOLDERS.has(text.toLowerCase()) ? "" : text;
};

function BottomSave({ label, loading, onClick }: { label: string; loading: boolean; onClick: () => void }) {
  return (
    <div style={{ position: "sticky", bottom: 0, padding: "8px 20px calc(12px + env(safe-area-inset-bottom))", background: "var(--vc-canvas)" }}>
      <ActionButton full label={label} loading={loading} onClick={onClick} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>} />
    </div>
  );
}

/** my_profile.dart */
export function MyProfileScreen() {
  const t = useT();
  const { push } = usePlusPaths();
  const { toast } = useFeedback();
  const { p, loading } = useProfile();
  const { metrics } = useMetrics();
  const [heightUnit] = useHeightUnit();
  const [weightUnit] = useWeightUnit();
  const transactions = useResource<unknown[]>("/transactions/", async () => asList(await mobileRequest("/transactions/")));
  const weight = Number.parseFloat(latestByType(metrics).weight?.latest_value ?? "0") || 0;
  const [sheet, setSheet] = useState<null | "age" | "height" | "weight" | "country" | "city" | "id" | "mrn" | "phone">(null);
  const [cm, setCm] = useState(170);
  const [savingHeight, setSavingHeight] = useState(false);

  const patch = async (fields: Record<string, unknown>): Promise<boolean> => {
    try {
      await updateProfile(fields);
      toast(t("profile_updated"));
      return true;
    } catch {
      toast(t("profile_update_failed"), { error: true });
      return false;
    }
  };
  if (loading && !p.firstName) return <div className="vita-page"><AppBar title={t("my_profile")} /><CenterSpinner /></div>;
  const hUnit = heightUnit === "in" ? "In" : "cm";
  const wUnit = weightUnit === "kg" ? "Kg" : "lbs";
  const height = p.height != null ? convertHeight(Number(p.height), heightUnit).toFixed(1) : "N/A";

  const stat = (label: string, value: string, known: boolean, onClick: () => void) => (
    <button type="button" onClick={onClick} style={{ flex: 1, padding: "14px 8px", borderRadius: 8, background: "var(--vc-surface)", border: `1px solid ${navyA(0.08)}`, textAlign: "center" }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: navyA(0.55) }}>{label}</div>
      <div style={{ marginTop: 4, fontSize: 16, fontWeight: 800, color: known ? "var(--vc-navy)" : "var(--vc-action)" }}>{known ? value : t("add")}</div>
    </button>
  );
  const row = (label: string, value: string, onClick: () => void) => (
    <button type="button" onClick={onClick} style={{ width: "100%", display: "flex", alignItems: "center", padding: "14px 18px", textAlign: "left" }}>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: navyA(0.55) }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: value ? "var(--vc-navy)" : "var(--vc-action)" }}>{value || t("add")}</span>
    </button>
  );
  const fullName = `${p.firstName} ${p.lastName}`.trim();

  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={t("my_profile")} />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 32px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ padding: 3, borderRadius: "50%", border: "2.5px solid var(--vc-mint)" }}>
          <Avatar url={p.photo} size={100} />
        </div>
        <div style={{ marginTop: 10, fontSize: 18, fontWeight: 800, color: "var(--vc-navy)" }}>{fullName}</div>
        {p.mrn?.trim() ? <div style={{ marginTop: 4, fontSize: 13, fontWeight: 600, color: navyA(0.55) }}>{p.mrn.trim()}</div> : null}
        <div style={{ height: 10 }} />
        <ActionButton tone="white" label={t("edit_account")} icon={<Edit2 size={18} color="currentColor" />} onClick={() => push("/account/edit")} />
        {p.type === "normal" ? (
          <div style={{ display: "flex", gap: 10, width: "100%", marginTop: 16 }}>
            {stat(t("hm_weight"), `${convertWeight(weight, weightUnit).toFixed(0)} ${wUnit}`, weight > 0, () => setSheet("weight"))}
            {stat(t("age"), String(p.age), ageKnown(p.age), () => setSheet("age"))}
            {stat(t("ap_height"), `${height} ${hUnit}`, heightKnown(p.height), () => {
              setCm(heightKnown(p.height) ? Number(p.height) : 170);
              setSheet("height");
            })}
          </div>
        ) : null}
        {p.type === "coach" ? (
          <div style={{ width: "100%", marginTop: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--vc-navy)" }}>{t("my_bio")}</div>
            <p style={{ margin: "6px 0 0", color: "var(--vc-ink)" }}>{p.bio || "N/A"}</p>
          </div>
        ) : null}
        <div style={{ width: "100%", maxWidth: 350, marginTop: 16, borderRadius: 8, background: "var(--vc-surface)", border: `1px solid ${navyA(0.08)}`, paddingTop: 14 }}>
          <div style={{ padding: "0 18px 4px", fontSize: 16, fontWeight: 800, color: "var(--vc-navy)" }}>{t("amakuru_yanjye")}</div>
          {row(t("country"), filled(p.country), () => setSheet("country"))}
          {row(t("city"), filled(p.city), () => setSheet("city"))}
          {row(t("id_number"), filled(p.idNumber), () => setSheet("id"))}
          {row("MRN", filled(p.mrn), () => setSheet("mrn"))}
          {row(t("phone"), filled(p.phone), () => setSheet("phone"))}
          <div style={{ display: "flex", padding: "14px 18px" }}>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: navyA(0.55) }}>Transactions</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--vc-navy)" }}>{transactions.loading ? "..." : String(transactions.data?.length ?? 0)}</span>
          </div>
          <div style={{ padding: "4px 18px 18px" }}>
            <ActionButton full tone="white" label={t("my_documents")} icon={<FolderOpen size={18} color="currentColor" />} onClick={() => push("/documents")} />
          </div>
        </div>
      </div>

      <FieldSheet
        open={sheet === "age"}
        title={t("age")}
        initial={ageKnown(p.age) ? String(p.age) : ""}
        inputMode="numeric"
        digitsOnly
        validate={(v) => {
          const n = Number.parseInt(v, 10);
          return !Number.isFinite(n) || n < 1 || n > 120 ? t("profile_update_failed") : null;
        }}
        onSave={(v) => patch({ age: Number.parseInt(v, 10) || 0 })}
        onClose={() => setSheet(null)}
      />
      <FieldSheet
        open={sheet === "weight"}
        title={t("hm_weight")}
        label={`${t("hm_weight")} (Kg)`}
        initial={(weight > 0 ? Math.min(250, Math.max(20, weight)) : 70).toFixed(1)}
        inputMode="decimal"
        validate={(v) => {
          const kg = Number.parseFloat(v.replace(",", "."));
          return !Number.isFinite(kg) || kg < 20 || kg > 250 ? t("failed_to_save_metric") : null;
        }}
        onSave={async (v) => {
          const kg = Number.parseFloat(v.replace(",", "."));
          try {
            await saveReading({ type: "weight", name: "Weight", unit: "Kg", systolic: 0, diastolic: 0, latestValue: kg === Math.round(kg) ? kg.toFixed(0) : kg.toFixed(1), stamp: new Date(), fullness: 0 });
            toast(t("health_metric_saved"));
            return true;
          } catch {
            toast(t("failed_to_save_metric"), { error: true });
            return false;
          }
        }}
        onClose={() => setSheet(null)}
      />
      <FieldSheet open={sheet === "city"} title={t("city")} initial={filled(p.city)} onSave={(v) => patch({ city: v })} onClose={() => setSheet(null)} />
      <FieldSheet
        open={sheet === "id"}
        title={t("id_number")}
        initial={filled(p.idNumber)}
        inputMode="numeric"
        digitsOnly
        validate={(v) => (v && (v.length !== 16 || !/^\d+$/.test(v)) ? t("invalid_id") : null)}
        onSave={(v) => patch({ id_number: v })}
        onClose={() => setSheet(null)}
      />
      <FieldSheet open={sheet === "mrn"} title="MRN" initial={filled(p.mrn)} onSave={(v) => patch({ medical_record_number: v.toUpperCase() })} onClose={() => setSheet(null)} />
      <FieldSheet
        open={sheet === "phone"}
        title={t("phone")}
        initial={filled(p.phone)}
        inputMode="tel"
        validate={(v) => {
          if (!v) return null;
          const digits = v.replace(/\D/g, "");
          return digits.length < 8 || digits.length > 15 ? t("invalid_phone") : null;
        }}
        onSave={(v) => patch({ phone_number: v })}
        onClose={() => setSheet(null)}
      />
      <CountryPicker open={sheet === "country"} onClose={() => setSheet(null)} onPick={(name) => void patch({ country: name })} />
      <Modal
        open={sheet === "height"}
        title={t("ap_height")}
        onClose={savingHeight ? undefined : () => setSheet(null)}
        actions={
          <>
            <ActionButton small tone="white" label={t("cancel")} onClick={savingHeight ? undefined : () => setSheet(null)} />
            <ActionButton
              small
              label={t("save")}
              loading={savingHeight}
              onClick={async () => {
                setSavingHeight(true);
                const ok = await patch({ height: Math.round(cm) });
                setSavingHeight(false);
                if (ok) setSheet(null);
              }}
            />
          </>
        }
      >
        <div style={{ textAlign: "center", fontSize: 32, fontWeight: 800, color: "var(--vc-navy)" }}>{heightUnit === "in" ? `${convertHeight(cm, "in").toFixed(1)} In` : `${cm.toFixed(0)} cm`}</div>
        <input type="range" min={100} max={230} step={1} value={Math.min(230, Math.max(100, cm))} onChange={(e) => setCm(Number(e.target.value))} style={{ width: "100%", accentColor: "#2BB3A3", marginTop: 12 }} />
      </Modal>
    </div>
  );
}

function ProfileField({ label, value, onChange, inputMode, multiline = false, error }: { label: string; value: string; onChange: (v: string) => void; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]; multiline?: boolean; error?: string | null }) {
  const style: React.CSSProperties = { width: "100%", border: 0, outline: "none", background: "transparent", fontSize: 16, fontWeight: 600, color: "var(--vc-ink)", padding: "6px 0 0", resize: "none", fontFamily: "inherit" };
  return (
    <label style={{ display: "block", padding: "12px 0" }}>
      <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: navyA(0.55) }}>{label}</span>
      {multiline ? <textarea rows={4} value={value} placeholder={label} onChange={(e) => onChange(e.target.value)} style={style} /> : <input value={value} placeholder={label} inputMode={inputMode} onChange={(e) => onChange(e.target.value)} style={style} />}
      {error ? <span style={{ display: "block", marginTop: 4, fontSize: 12, lineHeight: 1.3, color: "var(--vc-danger)" }}>{error}</span> : null}
    </label>
  );
}
const Rule = () => <div style={{ height: 1, background: navyA(0.06) }} />;

/** edit_profile.dart: name, contact, photo. */
export function EditProfileScreen() {
  const t = useT();
  const goBack = useBack("/profile");
  const { toast } = useFeedback();
  const { p, user } = useProfile();
  const [form, setForm] = useState({ first: "", last: "", bio: "", city: "", id: "", phone: "" });
  const [loaded, setLoaded] = useState(false);
  const [image, setImage] = useState<Blob | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string | null; id?: string | null }>({});
  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!loaded && user) {
      setForm({ first: p.firstName, last: p.lastName, bio: p.bio ?? "", city: p.city ?? "", id: p.idNumber ?? "", phone: p.phone ?? "" });
      setLoaded(true);
    }
  }, [loaded, user, p]);
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  /** Square crop like ImageCropper with a 1:1 lock, then JPEG. */
  const pick = async (file: File) => {
    try {
      const bitmap = await createImageBitmap(file);
      const side = Math.min(bitmap.width, bitmap.height);
      const size = Math.min(side, 1080);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      canvas.getContext("2d")?.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, size, size);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
      if (!blob) return;
      setImage(blob);
      setPreview(URL.createObjectURL(blob));
    } catch {
      toast(t("profile_update_failed"), { error: true });
    }
  };

  const save = async () => {
    const digits = form.phone.replace(/\D/g, "");
    const phoneErr = digits && (digits.length < 8 || digits.length > 15) ? t("invalid_phone") : null;
    const idText = form.id.trim();
    const idErr = idText && (idText.length !== 16 || !/^\d+$/.test(idText)) ? t("invalid_id") : null;
    setErrors({ phone: phoneErr, id: idErr });
    if (phoneErr || idErr) return;
    const or = (v: string, fallback: string) => (v.trim() ? v.trim() : fallback);
    const fields: Record<string, string> = {
      first_name: or(form.first, p.firstName),
      last_name: or(form.last, p.lastName),
      bio: or(form.bio, p.bio ?? ""),
      city: or(form.city, p.city ?? ""),
      id_number: or(form.id, p.idNumber ?? ""),
      phone_number: or(form.phone, p.phone ?? ""),
    };
    setSaving(true);
    try {
      if (image) {
        const fd = new FormData();
        Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
        fd.append("profile_picture", image, "image.jpg");
        await updateProfile(fd);
      } else await updateProfile(fields);
      toast(t("profile_updated"));
      goBack();
    } catch (error) {
      toast(failureText(error, t("profile_update_failed")), { error: true });
    } finally {
      setSaving(false);
    }
  };
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={t("edit_account")} />
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 20px" }}>
        <p style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 500, lineHeight: 1.4, color: navyA(0.6) }}>{t("edit_account_body")}</p>
        <Card>
          <button type="button" onClick={() => fileRef.current?.click()} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ position: "relative", padding: 3, borderRadius: "50%", border: "2.5px solid var(--vc-mint)" }}>
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="" width={96} height={96} style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", display: "block" }} />
              ) : (
                <Avatar url={p.photo} size={96} />
              )}
              <span style={{ position: "absolute", right: -2, bottom: 2, width: 34, height: 34, borderRadius: "50%", background: "var(--vc-teal)", border: "2px solid var(--vc-surface)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Camera size={16} color="#fff" />
              </span>
            </span>
            <span style={{ marginTop: 10, fontSize: 14, fontWeight: 700, color: "#2BB3A3" }}>{t("change_photo")}</span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void pick(f);
              e.target.value = "";
            }}
          />
        </Card>
        <div style={{ height: 12 }} />
        <Card>
          <ProfileField label={t("first_name")} value={form.first} onChange={set("first")} />
          <Rule />
          <ProfileField label={t("last_name")} value={form.last} onChange={set("last")} />
          <Rule />
          <ProfileField label={t("city")} value={form.city} onChange={set("city")} />
          <Rule />
          <ProfileField label={t("phone")} value={form.phone} onChange={set("phone")} inputMode="tel" error={errors.phone} />
          <Rule />
          <ProfileField label={t("id_number")} value={form.id} onChange={set("id")} inputMode="numeric" error={errors.id} />
        </Card>
        {p.type === "coach" ? (
          <>
            <div style={{ height: 12 }} />
            <Card>
              <ProfileField label={t("write_bio")} value={form.bio} onChange={set("bio")} multiline />
            </Card>
          </>
        ) : null}
      </div>
      <BottomSave label={t("save")} loading={saving} onClick={() => void save()} />
    </div>
  );
}

/** edit_health_details.dart: sex, age, height. */
export function HealthDetailsScreen() {
  const t = useT();
  const goBack = useBack("/profile");
  const { push } = usePlusPaths();
  const { toast } = useFeedback();
  const { p, user } = useProfile();
  const [heightUnit] = useHeightUnit();
  const [gender, setGender] = useState<"M" | "F">("M");
  const [height, setHeight] = useState(170);
  const [age, setAge] = useState("");
  const [ageError, setAgeError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!loaded && user) {
      setGender(p.gender === "F" ? "F" : "M");
      setHeight(heightKnown(p.height) ? Number(p.height) : 170);
      setAge(ageKnown(p.age) ? String(p.age) : "");
      setLoaded(true);
    }
  }, [loaded, user, p]);
  const save = async () => {
    const a = age.trim();
    if (a) {
      const n = Number.parseInt(a, 10);
      if (!Number.isFinite(n) || n < 1 || n > 120) return setAgeError("Enter a valid age");
    }
    setAgeError(null);
    setSaving(true);
    try {
      await updateProfile({ gender, height: Math.trunc(height), ...(a ? { age: Number.parseInt(a, 10) || p.age } : {}) });
      toast(t("profile_updated"));
      goBack();
    } catch {
      toast(t("profile_update_failed"), { error: true });
    } finally {
      setSaving(false);
    }
  };
  const chip = (value: "M" | "F", label: string) => (
    <button type="button" onClick={() => setGender(value)} style={{ flex: 1, padding: "14px 0", borderRadius: 8, background: gender === value ? "var(--vc-teal)" : "var(--vc-canvas)", color: gender === value ? "#fff" : "var(--vc-navy)", fontSize: 15, fontWeight: 700 }}>
      {label}
    </button>
  );
  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={t("health_details")} />
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 500, lineHeight: 1.4, color: navyA(0.6) }}>{t("health_details_body")}</p>
        <Card>
          <div style={{ fontSize: 15, fontWeight: 800, color: "var(--vc-navy)", marginBottom: 12 }}>{t("q3")}</div>
          <div style={{ display: "flex", gap: 10 }}>
            {chip("M", t("male"))}
            {chip("F", t("female"))}
          </div>
        </Card>
        <Card>
          <ProfileField label={t("age")} value={age} inputMode="numeric" onChange={(v) => setAge(v.replace(/\D/g, ""))} error={ageError} />
        </Card>
        <Card>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ flex: 1, fontSize: 15, fontWeight: 800, color: "var(--vc-navy)" }}>{t("ap_height")}</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: "var(--vc-navy)" }}>
              {convertHeight(height, heightUnit).toFixed(1)} {heightUnit === "in" ? "In" : "cm"}
            </span>
          </div>
          <input type="range" min={110} max={250} step={1} value={Math.min(250, Math.max(110, height))} onChange={(e) => setHeight(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--vc-navy)", marginTop: 12 }} />
        </Card>
        <button type="button" onClick={() => push("/log/weight")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px", borderRadius: 10, background: "var(--vc-tile-mint)", color: "var(--vc-navy)", textAlign: "left" }}>
          <Weight size={22} color="currentColor" />
          <span style={{ flex: 1, fontSize: 14, fontWeight: 700 }}>{t("log_weight_here")}</span>
          <ArrowRight3 size={20} color="currentColor" style={{ opacity: 0.4 }} />
        </button>
      </div>
      <BottomSave label={t("save")} loading={saving} onClick={() => void save()} />
    </div>
  );
}

type Txn = { id: number | string; name?: string | null; amount?: unknown; status?: string; created_at?: string };

/** payments_page.dart: list and receipts. */
export function PaymentsScreen() {
  const { toast } = useFeedback();
  const rows = useResource<Txn[]>("/transactions/", async () => asList<Txn>(await mobileRequest("/transactions/")));
  const [savingId, setSavingId] = useState<string | null>(null);
  const money = (v: unknown) => {
    const raw = String(v ?? "").split(".")[0].replace(/[^0-9]/g, "");
    return (Number.parseInt(raw, 10) || 0).toLocaleString("en-US");
  };
  const when = (v?: string) => {
    const d = v ? new Date(v) : null;
    if (!d || Number.isNaN(d.getTime())) return "";
    return `${d.getDate()} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()]} ${d.getFullYear()}`;
  };
  const download = async (row: Txn) => {
    const id = String(row.id);
    if (savingId) return;
    setSavingId(id);
    try {
      const blob = await fetchProtectedBlob([`/transactions/${id}/receipt/`]);
      if (!blob || !blob.size) throw new Error("empty");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Vitaway-receipt-${id}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch {
      toast("The receipt could not be downloaded.");
    } finally {
      setSavingId(null);
    }
  };
  const list = rows.data ?? [];
  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title="Payments" />
      {rows.loading && !rows.data ? (
        <CenterSpinner />
      ) : !list.length ? (
        <p style={{ margin: "120px 20px 0", textAlign: "center", fontSize: 15, fontWeight: 600, color: navyA(0.5) }}>No payments yet.</p>
      ) : (
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 28px", display: "flex", flexDirection: "column", gap: 10 }}>
          {list.map((row) => {
            const id = String(row.id);
            const paid = row.status === "completed";
            const name = (row.name ?? "").trim();
            return (
              <div key={id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 10px 14px 16px", borderRadius: 10, background: "var(--vc-surface)" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "var(--vc-navy)" }}>{name || "Vitaway payment"}</div>
                  <div style={{ marginTop: 3, fontSize: 13, fontWeight: 500, color: navyA(0.55) }}>
                    {money(row.amount)} RWF · {when(row.created_at)}
                    {paid ? "" : " · waiting"}
                  </div>
                </div>
                <button type="button" aria-label="Download receipt" disabled={!paid || savingId === id} onClick={() => void download(row)} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vc-navy)", opacity: paid ? 1 : 0.3 }}>
                  {savingId === id ? <span className="vita-mini-ring" /> : <DocumentDownload size={22} color="currentColor" />}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SettingsCard({ children }: { children: React.ReactNode }) {
  return <div style={{ marginBottom: 14, padding: 16, borderRadius: 10, background: "var(--vc-surface)" }}>{children}</div>;
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={value} onClick={() => onChange(!value)} style={{ width: "100%", display: "flex", alignItems: "center", padding: "10px 0", textAlign: "left" }}>
      <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: "var(--vc-ink)" }}>{label}</span>
      <span style={{ width: 50, height: 30, borderRadius: 999, padding: 3, background: value ? "var(--vc-mint)" : navyA(0.12), transition: "background 160ms" }}>
        <span style={{ display: "block", width: 24, height: 24, borderRadius: "50%", background: value ? "var(--vc-teal)" : "#fff", transform: `translateX(${value ? 20 : 0}px)`, transition: "transform 160ms", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
      </span>
    </button>
  );
}

function SelectBox({ label, value, options, onChange }: { label: string; value: string; options: Array<[string, string]>; onChange: (v: string) => void }) {
  return (
    <label style={{ display: "block", position: "relative", marginBottom: 12, padding: "8px 14px", borderRadius: 8, border: `1px solid ${navyA(0.12)}`, background: "var(--vc-surface)" }}>
      <span style={{ display: "block", fontSize: 12, fontWeight: 600, color: navyA(0.55) }}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", appearance: "none", border: 0, outline: "none", background: "transparent", fontSize: 15, fontWeight: 700, color: "var(--vc-ink)", padding: "4px 0" }}>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      <ArrowDown2 size={18} color={navyA(0.55)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
    </label>
  );
}

/** settings.dart */
export function SettingsScreen() {
  const t = useT();
  const { push } = usePlusPaths();
  const { toast } = useFeedback();
  const { p } = useProfile();
  const { deleteAccount } = useAccountActions();
  const [glucose, setGlucose] = useGlucoseUnit();
  const [heightUnit, setHeightUnit] = useHeightUnit();
  const [weightUnit, setWeightUnit] = useWeightUnit();
  const [a1c, setA1c] = useA1cUnit();
  const [messages, setMessages] = useState(true);
  const [reports, setReports] = useState(false);
  const [country, setCountry] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const name = [p.firstName, p.lastName].filter(Boolean).join(" ");
  const subtitle = p.email.includes("@phone.vitaway.local") ? p.phone ?? "" : p.email;
  const shownCountry = country ?? (p.country && p.country !== "no country" ? p.country : t("select_country"));
  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={t("settings")} bubbles={false} />
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px calc(env(safe-area-inset-bottom) + 32px)" }}>
        <button type="button" onClick={() => push("/account/my-profile")} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: 14, marginBottom: 14, borderRadius: 10, background: "var(--vc-surface)", textAlign: "left" }}>
          <Avatar url={p.photo} size={48} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontSize: 16, fontWeight: 800, color: "var(--vc-ink)" }}>{name || t("account_menu")}</span>
            {subtitle.trim() ? <span style={{ display: "block", marginTop: 2, fontSize: 13, color: navyA(0.55), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{subtitle}</span> : null}
          </span>
          <ArrowRight3 size={20} color={navyA(0.3)} />
        </button>
        <SettingsCard>
          <div style={{ fontSize: 16, fontWeight: 800, color: "var(--vc-navy)" }}>{t("language")}</div>
          <p style={{ margin: "6px 0 12px", fontSize: 13, color: navyA(0.55) }}>{t("select_language")}</p>
          <LanguageOptions />
        </SettingsCard>
        <SettingsCard>
          <div style={{ fontSize: 14, fontWeight: 700, color: navyA(0.7), marginBottom: 8 }}>{t("Country")}</div>
          <button type="button" onClick={() => setPicking(true)} style={{ width: "100%", display: "flex", alignItems: "center", padding: 16, borderRadius: 8, border: `1px solid ${navyA(0.12)}`, textAlign: "left" }}>
            <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: "var(--vc-ink)" }}>{shownCountry}</span>
            <ArrowDown2 size={18} color={navyA(0.55)} />
          </button>
        </SettingsCard>
        <SettingsCard>
          <SelectBox label="Glucose" value={glucose === "mg" ? "mg/dL" : "mmol/L"} options={[["mmol/L", "mmol/L"], ["mg/dL", "mg/dL"]]} onChange={(v) => setGlucose(v === "mmol/L" ? "mmol" : "mg")} />
          <SelectBox label={t("ap_height")} value={heightUnit === "cm" ? "Cm" : "In"} options={[["Cm", "Cm"], ["In", "In"]]} onChange={(v) => setHeightUnit(v === "In" ? "in" : "cm")} />
          <SelectBox label={t("hm_weight")} value={weightUnit === "kg" ? "Kg" : "lbs"} options={[["Kg", "Kg"], ["lbs", "lbs"]]} onChange={(v) => setWeightUnit(v === "lbs" ? "lbs" : "kg")} />
          <SelectBox label="A1c" value={a1c === "percent" ? "Percent" : "Ac1 unit"} options={[["Percent", "Percent"], ["Ac1 unit", "Ac1 unit"]]} onChange={(v) => setA1c(v === "Percent" ? "percent" : "mmol")} />
        </SettingsCard>
        <SettingsCard>
          <Toggle
            label={t("message_notifications")}
            value={messages}
            onChange={(v) => {
              setMessages(v);
              toast(`${t("message_notifications")}: ${v}`);
            }}
          />
          <div style={{ height: 1, marginLeft: 0, background: navyA(0.06) }} />
          <Toggle
            label={t("health_reports")}
            value={reports}
            onChange={(v) => {
              setReports(v);
              toast(`${t("health_reports")}: ${v}`);
            }}
          />
        </SettingsCard>
        <ActionButton full label={t("save_changes")} onClick={() => toast(t("settings_saved"))} />
        <button type="button" onClick={() => void deleteAccount()} style={{ display: "block", margin: "16px auto 0", padding: 8, fontSize: 14, fontWeight: 700, color: "var(--vc-danger)" }}>
          {t("delete_account")}
        </button>
      </div>
      <CountryPicker
        open={picking}
        onClose={() => setPicking(false)}
        onPick={(n) => {
          setCountry(n);
          updateProfile({ country: n })
            .then(() => toast(" Country updated successfully"))
            .catch(() => toast(t("profile_update_failed"), { error: true }));
        }}
      />
    </div>
  );
}

function SocialRow() {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
      {SOCIALS.map((s) => (
        <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.name} style={{ width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--vc-surface)", border: `1px solid ${navyA(0.08)}`, color: s.name === "X" ? "var(--vc-ink)" : s.color, fontWeight: 900, fontSize: 15 }}>
          {s.name === "Facebook" ? "f" : s.name === "X" ? "𝕏" : s.name === "Instagram" ? "◎" : "in"}
        </a>
      ))}
    </div>
  );
}

/** contact_us.dart */
export function ContactScreen() {
  const t = useT();
  const rows: Array<{ icon: React.ReactNode; label: string; value: string; href?: string }> = [
    { icon: <Call size={20} color="currentColor" />, label: t("contact_call"), value: VITAWAY_CONTACT.phoneDisplay, href: VITAWAY_CONTACT.phoneUri },
    { icon: <span style={{ fontWeight: 900, fontSize: 16 }}>✆</span>, label: t("contact_whatsapp"), value: VITAWAY_CONTACT.phoneDisplay, href: VITAWAY_CONTACT.whatsAppUri },
    { icon: <Sms size={20} color="currentColor" />, label: t("email"), value: VITAWAY_CONTACT.email, href: VITAWAY_CONTACT.emailUri },
    { icon: <Location size={20} color="currentColor" />, label: t("contact_visit"), value: VITAWAY_CONTACT.address, href: VITAWAY_CONTACT.mapUri },
    { icon: <Clock size={20} color="currentColor" />, label: t("contact_hours"), value: VITAWAY_CONTACT.hours },
  ];
  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={t("contact_us_title")} />
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px calc(env(safe-area-inset-bottom) + 32px)" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/plus-assets/empty.svg" alt="" width={160} height={120} style={{ width: 160, height: "auto" }} />
        </div>
        <h2 style={{ margin: "10px 0 0", textAlign: "center", fontSize: 22, fontWeight: 800, color: "var(--vc-navy)" }}>{t("get_in_touch")}</h2>
        <p style={{ margin: "8px 0 18px", textAlign: "center", fontSize: 14, lineHeight: 1.45, color: navyA(0.6) }}>{t("feedback_text")}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rows.map((r) => {
            const body = (
              <>
                <span style={{ width: 44, height: 44, borderRadius: "50%", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--vc-tile-mint)", color: "var(--vc-navy)" }}>{r.icon}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 12, fontWeight: 600, color: navyA(0.5) }}>{r.label}</span>
                  <span style={{ display: "block", marginTop: 2, fontSize: 14, fontWeight: 700, color: "var(--vc-navy)", whiteSpace: "pre-line" }}>{r.value}</span>
                </span>
              </>
            );
            const style: React.CSSProperties = { display: "flex", alignItems: "center", gap: 14, padding: 14, borderRadius: 10, background: "var(--vc-surface)", textDecoration: "none" };
            return r.href ? (
              <a key={r.label} href={r.href} target={r.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={style}>
                {body}
              </a>
            ) : (
              <div key={r.label} style={style}>
                {body}
              </div>
            );
          })}
        </div>
        <h3 style={{ margin: "22px 0 12px", fontSize: 16, fontWeight: 800, color: "var(--vc-navy)" }}>{t("follow_us")}</h3>
        <SocialRow />
      </div>
    </div>
  );
}

/** about.dart */
export function AboutScreen() {
  const t = useT();
  const block = (title: string | null, body: string) => (
    <div style={{ marginTop: 14 }}>
      {title ? <div style={{ fontSize: 16, fontWeight: 800, color: "var(--vc-navy)", marginBottom: 4 }}>{title}</div> : null}
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "var(--vc-body)" }}>{body}</p>
    </div>
  );
  return (
    <Page backdrop>
      <AppBar title={t("about_this_app")} />
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px calc(env(safe-area-inset-bottom) + 32px)" }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "center", padding: "6px 0 4px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/plus-assets/vitaway-logo.png" alt="Vitaway" style={{ height: 56, width: "auto" }} />
          </div>
          {block(null, t("intro_text"))}
          {block(null, t("nutrition_text"))}
          {block(null, t("care_text"))}
          {block(t("seamless_care_title"), t("seamless_care_text"))}
          {block(t("personal_care_title"), t("personal_care_text"))}
          {block(null, t("subscription_text"))}
          {block(t("secure_confidential_title"), t("secure_confidential_text"))}
          {block(null, t("stay_on_top_text"))}
          {block(t("support_title"), t("feedback_text"))}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 18px", marginTop: 12 }}>
            <a href={VITAWAY_CONTACT.emailUri} style={{ fontWeight: 700, color: "var(--vc-teal)" }}>
              {VITAWAY_CONTACT.email}
            </a>
            <a href={VITAWAY_CONTACT.phoneUri} style={{ fontWeight: 700, color: "var(--vc-teal)" }}>
              {VITAWAY_CONTACT.phoneDisplay}
            </a>
          </div>
          <div style={{ margin: "18px 0 10px", textAlign: "center", fontSize: 15, fontWeight: 800, color: "var(--vc-navy)" }}>{t("follow_us")}</div>
          <SocialRow />
        </Card>
      </div>
    </Page>
  );
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** coach_availability.dart */
export function CoachAvailabilityScreen() {
  const t = useT();
  const goBack = useBack("/profile");
  const { toast } = useFeedback();
  const { p } = useProfile();
  const [enabled, setEnabled] = useState<Record<string, boolean>>(Object.fromEntries(DAYS.map((d) => [d, false])));
  const [ranges, setRanges] = useState<Record<string, [number, number]>>(Object.fromEntries(DAYS.map((d) => [d, [8, 16]])));
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    if (p.type !== "coach") return toast("Only coach can set availability");
    const payload = DAYS.filter((d) => enabled[d]).map((d) => ({ day_of_week: DAYS.indexOf(d), start_time: `${ranges[d][0]}:00`, end_time: `${ranges[d][1]}:00` }));
    setSaving(true);
    try {
      await mobileRequest("/api/coach/availability/add/", { method: "POST", body: payload });
      toast("Saved successfully");
      goBack();
    } catch (error) {
      const status = (error as { status?: number }).status ?? 0;
      toast(`Failed to save (${status})`, { error: true });
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={t("set_availability")} />
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 20px" }}>
        <p style={{ margin: "0 4px 12px", fontSize: 14, fontWeight: 600, color: navyA(0.6) }}>{t("choose_availability")}</p>
        {DAYS.map((d) => (
          <div key={d} style={{ marginBottom: 10 }}>
            <div style={{ padding: "4px 16px", borderRadius: 10, background: "var(--vc-surface)", border: `1px solid ${navyA(0.06)}` }}>
              <Toggle label={d} value={enabled[d]} onChange={(v) => setEnabled((x) => ({ ...x, [d]: v }))} />
            </div>
            {enabled[d] ? (
              <div style={{ padding: "8px 16px 0" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--vc-navy)" }}>
                  Available from {ranges[d][0]}:00 to {ranges[d][1]}:00
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input type="range" min={0} max={24} step={1} value={ranges[d][0]} onChange={(e) => setRanges((x) => ({ ...x, [d]: [Math.min(Number(e.target.value), x[d][1]), x[d][1]] }))} style={{ flex: 1, accentColor: "var(--vc-navy)" }} />
                  <input type="range" min={0} max={24} step={1} value={ranges[d][1]} onChange={(e) => setRanges((x) => ({ ...x, [d]: [x[d][0], Math.max(Number(e.target.value), x[d][0])] }))} style={{ flex: 1, accentColor: "var(--vc-navy)" }} />
                </div>
              </div>
            ) : null}
          </div>
        ))}
        <div style={{ padding: "20px 4px" }}>
          <ActionButton full label={`${t("save")} ${t("set_availability")}`} loading={saving} onClick={() => void submit()} />
        </div>
      </div>
    </div>
  );
}


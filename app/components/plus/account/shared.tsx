"use client";

import { useState } from "react";
import { mobileRequest, MobileApiError } from "@/lib/plus/client/api";
import { useMe, type MeUser } from "@/lib/plus/client/data";
import { invalidate } from "@/lib/plus/client/use-resource";
import { usePlusAuth } from "@/lib/plus/auth-context";
import { useLanguage, useT } from "@/lib/plus/i18n";
import { useTheme, type ThemeMode } from "@/lib/plus/theme";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { ActionButton, Modal, useFeedback } from "../ui/vita";

export const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;

export const VITAWAY_CONTACT = {
  email: "support@vitaway.org",
  phoneDisplay: "+250 795 767 405",
  phoneUri: "tel:+250795767405",
  emailUri: "mailto:support@vitaway.org",
  whatsAppUri: "https://wa.me/250795767405",
  address: "CPR-Unit House, 1st Floor, KK21 Ave, Niboye, Kicukiro, Kigali",
  hours: "Mon–Fri 09:00–19:00\nSat–Sun 09:00–17:00",
  get mapUri() {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.address)}`;
  },
};

export const SOCIALS = [
  { name: "Facebook", url: "https://www.facebook.com/VitawayEClinic", color: "#1877F2" },
  { name: "X", url: "https://x.com/Vitawayeclinic", color: "#000000" },
  { name: "Instagram", url: "https://www.instagram.com/vitawayeclinic", color: "#E4405F" },
  { name: "LinkedIn", url: "https://rw.linkedin.com/in/vitaway-e-clinic-ba1009206", color: "#0A66C2" },
];

/** UserProvider fields read the way storeUserData() maps /me/. */
export function profileOf(user?: MeUser | null) {
  const p = user?.profile ?? {};
  const raw = user as (MeUser & { height?: number | null; mrn?: string | null }) | undefined;
  return {
    firstName: (user?.first_name ?? p.first_name ?? "").trim(),
    lastName: (user?.last_name ?? p.last_name ?? "").trim(),
    email: (user?.email ?? p.email ?? "").trim(),
    photo: p.profile_picture ?? null,
    bio: p.bio ?? null,
    city: p.city ?? null,
    country: p.country ?? null,
    idNumber: p.id_number ?? null,
    phone: p.phone_number ?? null,
    mrn: p.medical_record_number ?? raw?.mrn ?? null,
    height: p.height ?? raw?.height ?? null,
    age: Number(user?.age ?? p.age ?? 0) || 0,
    gender: user?.gender ?? null,
    handle: (p.community_handle ?? "").trim(),
    type: user?.user_type ?? "normal",
  };
}

/** POST /update_profile/ (JSON or multipart), then refresh /me/. */
export async function updateProfile(fields: Record<string, unknown> | FormData): Promise<void> {
  if (fields instanceof FormData) await mobileRequest("/update_profile/", { method: "POST", form: fields });
  else await mobileRequest("/update_profile/", { method: "POST", body: fields });
  invalidate("/me/");
}

/** Detail text the API sent, or the generic message when it is long or empty. */
export function failureText(error: unknown, fallback: string): string {
  if (error instanceof MobileApiError) {
    const body = error.body as { detail?: unknown; error?: unknown } | string | undefined;
    const text = typeof body === "string" ? body : String(body?.detail ?? body?.error ?? "");
    if (text.trim() && text.length <= 180) return text.trim();
  }
  return fallback;
}

export function useAccountActions() {
  const t = useT();
  const { confirm, toast } = useFeedback();
  const { signOut } = usePlusAuth();
  const { replace } = usePlusPaths();
  const [deleting, setDeleting] = useState(false);

  const logout = async () => {
    const ok = await confirm({ title: t("logout_title"), message: t("logout_body"), confirmLabel: t("logout_title"), cancelLabel: t("cancel"), destructive: true });
    if (!ok) return;
    await signOut();
    replace("/signin");
  };

  /** utils/delete_account.dart: DELETE /api/v1/mobile/auth/me, then clear local state. */
  const deleteAccount = async () => {
    if (deleting) return;
    const ok = await confirm({ title: t("delete_account"), message: t("delete_account_body"), confirmLabel: t("delete_account"), cancelLabel: t("cancel"), destructive: true });
    if (!ok) return;
    setDeleting(true);
    try {
      await mobileRequest("/api/v1/mobile/auth/me", { method: "DELETE" });
      await signOut();
      replace("/signin");
    } catch {
      toast(t("delete_account_failed"), { error: true });
    } finally {
      setDeleting(false);
    }
  };
  return { logout, deleteAccount };
}

function OptionRow({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{ width: "100%", display: "flex", alignItems: "center", padding: "14px 16px", borderRadius: 8, background: selected ? "var(--vc-tile-mint)" : "var(--vc-canvas)", textAlign: "left" }}>
      <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: "var(--vc-ink)" }}>{label}</span>
      {selected ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--vc-navy)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg> : null}
    </button>
  );
}

/** language_picker_sheet.dart: also syncs {language} to the profile. */
export function LanguageOptions({ onPicked }: { onPicked?: () => void }) {
  const { language, setLanguage } = useLanguage();
  const { session } = usePlusAuth();
  const pick = (code: "en" | "rw") => {
    setLanguage(code);
    if (session) void updateProfile({ language: code }).catch(() => undefined);
    onPicked?.();
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <OptionRow label="English" selected={language === "en"} onClick={() => pick("en")} />
      <OptionRow label="Ikinyarwanda" selected={language === "rw"} onClick={() => pick("rw")} />
    </div>
  );
}

export function themeModeName(t: ReturnType<typeof useT>, mode: ThemeMode): string {
  return mode === "light" ? t("theme_light") : mode === "dark" ? t("theme_dark") : t("theme_system");
}

/** theme_mode_section.dart: three segments. */
export function AppearanceSegments({ onPicked }: { onPicked?: () => void }) {
  const t = useT();
  const { mode, setMode } = useTheme();
  const options: Array<[ThemeMode, string, string]> = [
    ["system", t("theme_system"), "M12 3a9 9 0 1 0 0 18V3z"],
    ["light", t("theme_light"), "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"],
    ["dark", t("theme_dark"), "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"],
  ];
  return (
    <div style={{ display: "flex", padding: 4, gap: 4, borderRadius: 10, background: "var(--vc-surface)", border: "1px solid var(--vc-line)" }}>
      {options.map(([value, label, d]) => {
        const on = mode === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={on}
            onClick={() => {
              setMode(value);
              onPicked?.();
            }}
            style={{ flex: 1, height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: on ? "var(--vc-teal)" : "transparent", color: on ? "#fff" : "var(--vc-body)", fontWeight: 700, fontSize: 13, transition: "background 180ms" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d={d} /></svg>
            {label}
          </button>
        );
      })}
    </div>
  );
}

const REGIONS =
  "AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HK HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG KP MK NO OM PK PW PS PA PG PY PE PH PL PT PR QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA KR SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW".split(" ");

/** country_picker: searchable list of country names. */
export function CountryPicker({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (name: string) => void }) {
  const [query, setQuery] = useState("");
  const names = (() => {
    try {
      const dn = new Intl.DisplayNames(["en"], { type: "region" });
      return REGIONS.map((c) => ({ code: c, name: dn.of(c) ?? c }));
    } catch {
      return REGIONS.map((c) => ({ code: c, name: c }));
    }
  })().sort((a, b) => a.name.localeCompare(b.name));
  const q = query.trim().toLowerCase();
  const list = q ? names.filter((n) => n.name.toLowerCase().includes(q) || n.code.toLowerCase() === q) : names;
  const flag = (code: string) => String.fromCodePoint(...[...code].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65));
  return (
    <Modal open={open} title="Select country" onClose={onClose}>
      <input className="vita-input" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} style={{ marginBottom: 10 }} />
      <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
        {list.map((c) => (
          <button
            key={c.code}
            type="button"
            onClick={() => {
              onPick(c.name);
              setQuery("");
              onClose();
            }}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 6px", borderBottom: `1px solid ${navyA(0.06)}`, textAlign: "left", color: "var(--vc-ink)", fontSize: 15, fontWeight: 600 }}
          >
            <span style={{ fontSize: 20 }}>{flag(c.code)}</span>
            {c.name}
          </button>
        ))}
      </div>
    </Modal>
  );
}

/** _ProfileFieldSheet: one field, cancel / save. */
export function FieldSheet({
  open,
  title,
  label,
  initial,
  inputMode,
  digitsOnly = false,
  validate,
  onSave,
  onClose,
}: {
  open: boolean;
  title: string;
  label?: string;
  initial: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  digitsOnly?: boolean;
  validate?: (value: string) => string | null;
  onSave: (value: string) => Promise<boolean>;
  onClose: () => void;
}) {
  const t = useT();
  const { toast } = useFeedback();
  const [value, setValue] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [seen, setSeen] = useState(open);
  if (open !== seen) {
    setSeen(open);
    if (open) {
      setValue(initial);
      setSaving(false);
    }
  }
  const save = async () => {
    if (saving) return;
    const v = value.trim();
    const error = validate?.(v);
    if (error) return toast(error, { error: true });
    setSaving(true);
    const ok = await onSave(v);
    setSaving(false);
    if (ok) onClose();
  };
  return (
    <Modal
      open={open}
      title={title}
      onClose={saving ? undefined : onClose}
      actions={
        <>
          <ActionButton small tone="white" label={t("cancel")} onClick={saving ? undefined : onClose} />
          <ActionButton small label={t("save")} loading={saving} onClick={save} />
        </>
      }
    >
      <label style={{ display: "block", padding: "8px 14px", borderRadius: 8, background: "var(--vc-canvas)" }}>
        <span style={{ display: "block", fontSize: 12, fontWeight: 600, color: navyA(0.55) }}>{label ?? title}</span>
        <input
          autoFocus
          inputMode={inputMode}
          value={value}
          onChange={(e) => setValue(digitsOnly ? e.target.value.replace(/\D/g, "") : e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void save();
          }}
          style={{ width: "100%", border: 0, outline: "none", background: "transparent", fontSize: 16, fontWeight: 600, color: "var(--vc-ink)", padding: "4px 0" }}
        />
      </label>
    </Modal>
  );
}

export function useProfile() {
  const me = useMe();
  return { ...me, p: profileOf(me.user) };
}

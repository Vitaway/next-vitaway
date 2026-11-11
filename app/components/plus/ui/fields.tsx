"use client";

import { ArrowDown2 } from "iconsax-react";

const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;

/** VitaFieldLabel with the red required star. */
export function FieldCaption({ text, required = false, dimmed = false }: { text: string; required?: boolean; dimmed?: boolean }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 600, color: dimmed ? navyA(0.4) : navyA(0.7), marginBottom: 8 }}>
      {text}
      {required ? <span style={{ color: "var(--vc-danger)" }}> *</span> : null}
    </div>
  );
}

/** AuthField: underlined input with a leading icon. */
export function AuthField({
  label,
  hint,
  icon,
  value,
  onChange,
  type = "text",
  inputMode,
  required = false,
  disabled = false,
  readOnly = false,
  multiline = false,
  error,
  autoComplete,
  onClick,
  suffix,
  maxLength,
}: {
  label?: string;
  hint: string;
  icon: React.ReactNode;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  multiline?: boolean;
  error?: string | null;
  autoComplete?: string;
  onClick?: () => void;
  suffix?: React.ReactNode;
  maxLength?: number;
}) {
  const dimmed = disabled || (readOnly && !onClick);
  const line = error ? "var(--vc-danger)" : dimmed ? navyA(0.12) : navyA(0.55);
  const common = {
    value,
    placeholder: hint,
    disabled,
    readOnly: readOnly || Boolean(onClick),
    onClick,
    maxLength,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange?.(e.target.value),
    style: { flex: 1, minWidth: 0, border: 0, outline: "none", background: "transparent", fontSize: 16, fontWeight: 500, color: dimmed ? navyA(0.38) : "var(--vc-ink)", padding: "14px 0", fontFamily: "inherit", resize: "none" as const, cursor: onClick ? "pointer" : undefined },
  };
  return (
    <div style={{ opacity: dimmed ? 0.72 : 1 }}>
      {label ? <FieldCaption text={label} required={required} dimmed={dimmed} /> : null}
      <label className="vita-auth-field" style={{ display: "flex", alignItems: multiline ? "flex-start" : "center", gap: 12, borderBottom: `1px solid ${line}` }}>
        <span style={{ display: "inline-flex", color: dimmed ? navyA(0.28) : navyA(0.55), paddingTop: multiline ? 14 : 0, paddingLeft: 12 }}>{icon}</span>
        {multiline ? <textarea rows={1} {...common} /> : <input type={type} inputMode={inputMode} autoComplete={autoComplete} {...common} />}
        {suffix}
      </label>
      {error ? <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.3, color: "var(--vc-danger)" }}>{error}</div> : null}
    </div>
  );
}

/** book_visit.dart _DropdownField: a wash box that opens a picker. */
export function DropdownField({ label, required = false, value, placeholder, enabled = true, onClick }: { label: string; required?: boolean; value: string | null; placeholder: string; enabled?: boolean; onClick: () => void }) {
  const has = Boolean(value);
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--vc-navy)", marginBottom: 8 }}>
        {required ? <span style={{ color: "var(--vc-action)" }}>* </span> : null}
        {label}
      </div>
      <button
        type="button"
        onClick={enabled ? onClick : undefined}
        style={{ width: "100%", height: 52, padding: "0 16px", borderRadius: 8, display: "flex", alignItems: "center", background: "var(--vc-wash)", opacity: enabled ? 1 : 0.6, cursor: enabled ? "pointer" : "default", textAlign: "left" }}
      >
        <span style={{ flex: 1, fontSize: 15, fontWeight: has ? 700 : 500, color: has ? "var(--vc-navy)" : navyA(enabled ? 0.4 : 0.28) }}>{has ? value : placeholder}</span>
        <span style={{ color: navyA(enabled ? 0.45 : 0.25), display: "inline-flex" }}>
          <ArrowDown2 size={22} color="currentColor" />
        </span>
      </button>
    </div>
  );
}

/** Rows used by the select sheets (wash tiles, teal when chosen). */
export function SelectRow({ label, selected, disabled = false, onClick }: { label: string; selected: boolean; disabled?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{ width: "100%", padding: "14px 16px", borderRadius: 8, display: "flex", alignItems: "center", textAlign: "left", background: disabled ? "color-mix(in srgb, var(--vc-wash) 55%, transparent)" : selected ? "var(--vc-teal)" : "var(--vc-wash)", cursor: disabled ? "default" : "pointer" }}
    >
      <span style={{ flex: 1, fontWeight: 700, fontSize: 15, color: disabled ? navyA(0.35) : selected ? "#fff" : "var(--vc-ink)" }}>{label}</span>
      {selected && !disabled ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
      ) : null}
    </button>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown2, ArrowLeft, Eye, EyeSlash, InfoCircle } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { DIAL_COUNTRIES, type DialCountry } from "@/lib/plus/dial-countries";
import { ActionButton, BubbleBackdrop, DotSpinner, Modal } from "../ui/vita";
import { MdCheck, MdClose } from "react-icons/md";

const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;

/**
 * Brand side of the wide (>=1024px) auth layout: logo, onboarding art, headline and a short line.
 * Hidden by CSS on phones and tablets, so the phone layout is unchanged.
 */
export function AuthBrandPanel({ image = "intro.png", title, body }: { image?: string; title?: string; body?: string }) {
  const t = useT();
  return (
    <aside className="vita-auth-brand" aria-hidden>
      <div className="vita-auth-brand-inner">
        <span className="vita-auth-brand-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/plus-assets/vitaway-logo.png" alt="" width={56} height={56} />
        </span>
        <div className="vita-auth-brand-art">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/plus-assets/onboarding/${image}`} alt="" />
        </div>
        <h2 className="vita-auth-brand-title">{title ?? t("onboarding1")}</h2>
        <p className="vita-auth-brand-body">{body ?? t("onboarding1_subtitle")}</p>
      </div>
    </aside>
  );
}

/**
 * AuthScaffold + AuthCard: bubble backdrop, 24px gutters, a 440px column that fills the screen height.
 * From 768px the column becomes a centred card on a full-bleed brand background, and from 1024px a
 * brand panel sits on the left (see .vita-wide in plus.css). Below 768px it renders exactly as before.
 */
export function AuthScreen({ children, onBack }: { children: React.ReactNode; onBack?: () => void }) {
  return (
    <div className="vita-page vita-auth vita-wide vita-fullbleed" style={{ position: "relative", minHeight: "100dvh" }}>
      <BubbleBackdrop />
      <AuthBrandPanel />
      <div className="vita-auth-main">
        {onBack ? (
          <div className="vita-auth-back-wrap">
            <button type="button" aria-label="Back" onClick={onBack} className="vita-auth-back">
              <ArrowLeft size={18} color="currentColor" />
            </button>
          </div>
        ) : null}
        <div className={onBack ? "vita-auth-body with-back" : "vita-auth-body"}>
          <div className="vita-auth-card">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function AuthInlineError({
  message,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}: {
  message: string;
  actionLabel?: string | null;
  onAction?: (() => void) | null;
  secondaryLabel?: string | null;
  onSecondary?: (() => void) | null;
}) {
  return (
    <div role="alert" style={{ width: "100%", padding: "12px 14px 8px", borderRadius: 8, background: "rgba(244,67,54,0.12)" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ display: "inline-flex", color: "var(--vc-danger)", flexShrink: 0 }}>
          <InfoCircle size={18} color="currentColor" />
        </span>
        <span style={{ fontSize: 13, lineHeight: 1.4, fontWeight: 600, color: "var(--vc-danger)" }}>{message}</span>
      </div>
      {actionLabel && onAction ? (
        <button type="button" className="vita-auth-text" onClick={onAction} style={{ marginTop: 8, color: "var(--vc-danger)", fontWeight: 800 }}>
          {actionLabel}
        </button>
      ) : null}
      {secondaryLabel && onSecondary ? (
        <div>
          <button type="button" className="vita-auth-text" onClick={onSecondary} style={{ color: "var(--vc-navy)", fontWeight: 700 }}>
            {secondaryLabel}
          </button>
        </div>
      ) : null}
      {!actionLabel && !secondaryLabel ? <div style={{ height: 4 }} /> : null}
    </div>
  );
}

/** AuthHeader: logo, 32px title, optional subtitle and inline error. */
export function AuthHeader({
  title,
  subtitle,
  error,
  errorAction,
  onErrorAction,
  errorSecondary,
  onErrorSecondary,
}: {
  title: string;
  subtitle?: string;
  error?: string | null;
  errorAction?: string | null;
  onErrorAction?: (() => void) | null;
  errorSecondary?: string | null;
  onErrorSecondary?: (() => void) | null;
}) {
  return (
    <div>
      <div style={{ height: 44 }} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/plus-assets/vitaway-logo.png" alt="Vitaway" width={84} height={84} style={{ width: 84, height: 84, borderRadius: 8, objectFit: "cover", display: "block" }} />
      </div>
      <div style={{ height: 22 }} />
      <h1 style={{ margin: 0, textAlign: "center", fontSize: 32, fontWeight: 800, lineHeight: 1.12, letterSpacing: -0.8, color: "var(--vc-navy)" }}>{title}</h1>
      {subtitle && subtitle.trim() ? (
        <p style={{ margin: "8px 0 0", textAlign: "center", fontSize: 15, lineHeight: 1.45, color: "var(--vc-ink)" }}>{subtitle}</p>
      ) : null}
      {error && error.trim() ? (
        <div style={{ marginTop: 16 }}>
          <AuthInlineError
            message={error}
            actionLabel={errorAction}
            onAction={onErrorAction}
            secondaryLabel={errorSecondary}
            onSecondary={onErrorSecondary}
          />
        </div>
      ) : null}
    </div>
  );
}

export function AuthOrDivider({ label }: { label: string }) {
  const line = navyA(0.12);
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={{ flex: 1, height: 1, background: line }} />
      <span style={{ padding: "0 12px", fontSize: 13, fontWeight: 500, color: navyA(0.4) }}>{label}</span>
      <span style={{ flex: 1, height: 1, background: line }} />
    </div>
  );
}

export function AuthSwitchRow({ prompt, action, onClick }: { prompt: string; action: string; onClick: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
      <span style={{ fontSize: 14, color: navyA(0.55) }}>{prompt}</span>
      <button type="button" className="vita-auth-text" onClick={onClick} style={{ padding: "0 6px", fontSize: 14, fontWeight: 700, color: "var(--vc-navy)" }}>
        {action}
      </button>
    </div>
  );
}

export function EyeToggle({ visible, onToggle }: { visible: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-label={visible ? "Hide password" : "Show password"}
      onClick={(event) => {
        event.preventDefault();
        onToggle();
      }}
      style={{ display: "inline-flex", padding: 12, color: "var(--vc-ink)", background: "transparent", border: 0, cursor: "pointer" }}
    >
      {visible ? <Eye size={22} color="currentColor" /> : <EyeSlash size={22} color="currentColor" />}
    </button>
  );
}

/** CountryDialButton: "+250 ⌄" inside the phone field; opens the country picker. */
export function CountryDialButton({ country, onChange }: { country: DialCountry; onChange: (next: DialCountry) => void }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(country.iso);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setSelected(country.iso);
    const id = window.requestAnimationFrame(() => {
      listRef.current?.querySelector<HTMLElement>('[data-on="1"]')?.scrollIntoView({ block: "center" });
    });
    return () => window.cancelAnimationFrame(id);
  }, [open, country.iso]);

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          setOpen(true);
        }}
        style={{ display: "inline-flex", alignItems: "center", padding: "0 8px 0 2px", background: "transparent", border: 0, cursor: "pointer", color: "var(--vc-ink)" }}
      >
        <span style={{ fontSize: 16, fontWeight: 700 }}>+{country.dial}</span>
        <ArrowDown2 size={18} color="currentColor" />
      </button>
      <Modal
        open={open}
        title={t("select_country", undefined, "Select Country")}
        onClose={() => setOpen(false)}
        actions={
          <>
            <ActionButton label={t("cancel", undefined, "Cancel")} tone="white" small icon={<MdClose size={16} />} onClick={() => setOpen(false)} />
            <ActionButton
              label={t("confirm", undefined, "Confirm")}
              small
              icon={<MdCheck size={16} />}
              onClick={() => {
                onChange(DIAL_COUNTRIES.find((item) => item.iso === selected) ?? country);
                setOpen(false);
              }}
            />
          </>
        }
      >
        <div ref={listRef} style={{ height: 216, overflowY: "auto", margin: "0 -4px" }}>
          {DIAL_COUNTRIES.map((item) => {
            const on = item.iso === selected;
            return (
              <button
                key={item.iso}
                type="button"
                data-on={on ? "1" : undefined}
                onClick={() => setSelected(item.iso)}
                onDoubleClick={() => {
                  onChange(item);
                  setOpen(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  height: 36,
                  textAlign: "center",
                  border: 0,
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: on ? 700 : 400,
                  color: on ? "var(--vc-ink)" : navyA(0.55),
                  background: on ? navyA(0.06) : "transparent",
                  whiteSpace: "pre",
                }}
              >
                {`${item.name}    +${item.dial}`}
              </button>
            );
          })}
        </div>
      </Modal>
    </>
  );
}

/** apple_sign_in_button.dart _SocialAuthButton: 54px outlined white button. */
export function SocialAuthButton({
  label,
  icon,
  loading = false,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  loading?: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" className="vita-social-btn" disabled={loading} aria-busy={loading || undefined} onClick={onClick}>
      {loading ? (
        <DotSpinner small color="var(--vc-navy)" />
      ) : (
        <>
          {icon}
          <span style={{ marginLeft: 8, fontSize: 15, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
        </>
      )}
    </button>
  );
}

export function GoogleGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

/** The 6-digit field from verification.dart: centered, 28px, letter-spaced, underlined. */
export function CodeField({
  value,
  onChange,
  onEnter,
  error,
}: {
  value: string;
  onChange: (next: string) => void;
  onEnter?: () => void;
  error?: string | null;
}) {
  return (
    <div>
      <input
        className={error ? "vita-code-field error" : "vita-code-field"}
        value={value}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        placeholder="000000"
        aria-label="6-digit code"
        onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, 6))}
        onKeyDown={(event) => {
          if (event.key === "Enter" && onEnter) {
            event.preventDefault();
            onEnter();
          }
        }}
      />
      {error ? <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.3, color: "var(--vc-danger)" }}>{error}</div> : null}
    </div>
  );
}

export function AuthTextButton({ label, onClick, disabled, busy }: { label: string; onClick: () => void; disabled?: boolean; busy?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <button type="button" className="vita-auth-text" disabled={disabled} onClick={onClick} style={{ padding: "10px 12px", fontSize: 14, fontWeight: 600, color: "var(--vc-navy)" }}>
        {busy ? <DotSpinner small color="var(--vc-navy)" /> : label}
      </button>
    </div>
  );
}

export function Gap({ h }: { h: number }) {
  return <div style={{ height: h, flexShrink: 0 }} />;
}

/** friendlyAuthError from _auth_widgets.dart. */
export function friendlyAuthError(t: ReturnType<typeof useT>, raw: string, fallbackKey = "signup_failed"): string {
  const lower = raw.toLowerCase();
  if (lower.includes("already exists") || lower.includes("already registered") || lower.includes("already taken")) {
    return t("email_already_exists");
  }
  if (
    lower.includes("invalid credentials") ||
    lower.includes("unable to log in") ||
    lower.includes("incorrect password") ||
    lower.includes("invalid password") ||
    lower.includes("no active account") ||
    lower.includes("password incorrect")
  ) {
    return t("invalid_credentials");
  }
  if (lower === "network" || lower.includes("socket") || lower.includes("timeout") || lower.includes("network") || lower.includes("connection") || lower.includes("failed to fetch")) {
    return t("network_error");
  }
  const fallback = t(fallbackKey);
  return fallback === fallbackKey ? raw : fallback;
}

/** Hands the typed email/phone to the next auth screen (no passwords, no tokens). */
export type AuthPrefill = { phoneMode: boolean; value: string; country: string };
const PREFILL_KEY = "vitaway.plus.authPrefill";

export function savePrefill(prefill: AuthPrefill): void {
  try {
    window.sessionStorage.setItem(PREFILL_KEY, JSON.stringify(prefill));
  } catch {
    /* ignore */
  }
}

export function takePrefill(): AuthPrefill | null {
  try {
    const raw = window.sessionStorage.getItem(PREFILL_KEY);
    window.sessionStorage.removeItem(PREFILL_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthPrefill>;
    return { phoneMode: parsed.phoneMode === true, value: typeof parsed.value === "string" ? parsed.value : "", country: typeof parsed.country === "string" ? parsed.country : "RW" };
  } catch {
    return null;
  }
}

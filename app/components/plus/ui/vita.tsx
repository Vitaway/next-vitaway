"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "iconsax-react";
import { useBack } from "@/lib/plus/nav";
import { mediaUrl } from "@/lib/plus/client/api";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* ───────── App bar ───────── */

export function AppBarBubbles() {
  return (
    <div className="vita-bubbles" aria-hidden>
      <i style={{ left: "-4%", top: "8%", width: 62, height: 62, transform: "translate(-50%,-50%)", background: "rgba(255,255,255,0.10)" }} />
      <i style={{ left: "108%", top: "-8%", width: 70, height: 70, transform: "translate(-50%,-50%)", background: "rgba(255,255,255,0.14)" }} />
      <i style={{ left: "78%", top: "42%", width: 20, height: 20, transform: "translate(-50%,-50%)", background: "var(--vc-bubble-accent)" }} />
    </div>
  );
}

export function CircleButton({
  onClick,
  children,
  label,
  size = 40,
  background,
  color,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  label: string;
  size?: number;
  background?: string;
  color?: string;
}) {
  return (
    <button
      type="button"
      className="vita-circle-btn"
      aria-label={label}
      onClick={onClick}
      style={{ width: size, height: size, background, color }}
    >
      {children}
    </button>
  );
}

export function AppBar({
  title,
  back = true,
  backTo,
  onBack,
  actions,
  bottom,
  bubbles = true,
}: {
  title: string;
  back?: boolean;
  backTo?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  bottom?: React.ReactNode;
  bubbles?: boolean;
}) {
  const goBack = useBack(backTo);
  return (
    <header className="vita-appbar">
      {bubbles ? <AppBarBubbles /> : null}
      <div className="vita-appbar-inner">
        {back ? (
          <div className="vita-appbar-lead">
            <CircleButton label="Back" onClick={onBack ?? goBack}>
              <ArrowLeft size={18} color="currentColor" />
            </CircleButton>
          </div>
        ) : null}
        <h1 className="vita-appbar-title">{title}</h1>
        {actions ? <div className="vita-appbar-trail">{actions}</div> : null}
      </div>
      {bottom ? <div className="vita-appbar-bottom">{bottom}</div> : null}
    </header>
  );
}

/* ───────── Backdrop (VitaBubbleBackdrop) ───────── */

export function BubbleBackdrop() {
  return (
    <div className="vita-blobs" aria-hidden>
      <i style={{ left: "112%", top: "-2%", width: "92vmin", height: "92vmin", maxWidth: 442, maxHeight: 442, transform: "translate(-50%,-50%)", background: "var(--vc-blob-1)" }} />
      <i style={{ left: "-10%", top: "2%", width: "48vmin", height: "48vmin", maxWidth: 230, maxHeight: 230, transform: "translate(-50%,-50%)", background: "var(--vc-blob-2)" }} />
      <i style={{ left: "108%", top: "94%", width: "64vmin", height: "64vmin", maxWidth: 307, maxHeight: 307, transform: "translate(-50%,-50%)", background: "var(--vc-blob-3)" }} />
      <i style={{ left: "-8%", top: "102%", width: "80vmin", height: "80vmin", maxWidth: 384, maxHeight: 384, transform: "translate(-50%,-50%)", background: "var(--vc-blob-4)" }} />
    </div>
  );
}

export function Page({
  children,
  backdrop = false,
}: {
  children: React.ReactNode;
  backdrop?: boolean;
}) {
  return (
    <div className="vita-page" style={{ position: "relative" }}>
      {backdrop ? <BubbleBackdrop /> : null}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", flex: 1 }}>{children}</div>
    </div>
  );
}

export function Scroll({
  children,
  dock = false,
  style,
  className,
}: {
  children: React.ReactNode;
  dock?: boolean;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div className={cx("vita-scroll", dock && "with-dock", className)} style={style}>
      {children}
    </div>
  );
}

/* ───────── Buttons ───────── */

export type Tone = "primary" | "teal" | "white" | "danger";

export function ActionButton({
  label,
  onClick,
  tone = "primary",
  icon,
  loading = false,
  disabled = false,
  full = false,
  small = false,
  iconFirst = false,
  type = "button",
  style,
}: {
  label: string;
  onClick?: () => void | Promise<void>;
  tone?: Tone;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  full?: boolean;
  small?: boolean;
  iconFirst?: boolean;
  type?: "button" | "submit";
  style?: React.CSSProperties;
}) {
  const [busy, setBusy] = useState(false);
  const showLoading = loading || busy;
  return (
    <button
      type={type}
      className={cx("vita-btn", tone, full && "full", small && "small", iconFirst && "icon-first")}
      disabled={disabled || showLoading}
      aria-busy={showLoading || undefined}
      style={style}
      onClick={
        onClick
          ? async () => {
              const result = onClick();
              if (result && typeof (result as Promise<void>).then === "function") {
                setBusy(true);
                try {
                  await result;
                } finally {
                  setBusy(false);
                }
              }
            }
          : undefined
      }
    >
      <span className="label">{label}</span>
      <span className="icon">{showLoading ? <DotSpinner small /> : icon ?? <ArrowRight size={16} color="currentColor" />}</span>
    </button>
  );
}

export function DotSpinner({ small = false, color }: { small?: boolean; color?: string }) {
  return (
    <span className="vita-dots" style={{ color, transform: small ? "scale(0.75)" : undefined }} aria-label="Loading">
      <i />
      <i />
      <i />
    </span>
  );
}

export function CenterSpinner({ label }: { label?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "56px 0", color: "var(--vc-navy)", gap: 12 }}>
      <DotSpinner />
      {label ? <p style={{ fontSize: 13, color: "var(--vc-muted)", margin: 0 }}>{label}</p> : null}
    </div>
  );
}

/* ───────── Cards and sections ───────── */

export function Card({
  children,
  padding,
  style,
  onClick,
  className,
}: {
  children: React.ReactNode;
  padding?: number | string;
  style?: React.CSSProperties;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cx("vita-card", onClick && "vita-tap", className)}
      style={{ padding, ...style }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (event) => (event.key === "Enter" ? onClick() : undefined) : undefined}
    >
      {children}
    </div>
  );
}

export function SectionHead({
  title,
  action,
  onAction,
  style,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <div className="vita-section-head" style={style}>
      <h2 className="vita-section-title" style={{ margin: 0 }}>
        {title}
      </h2>
      {action && onAction ? (
        <button type="button" className="vita-section-action" onClick={onAction}>
          {action}
        </button>
      ) : null}
    </div>
  );
}

export function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--vc-navy)" }}>
      {icon}
      <span style={{ fontSize: 15, fontWeight: 800 }}>{label}</span>
    </div>
  );
}

/* ───────── Empty / error ───────── */

export function EmptyState({
  title,
  subtitle,
  actionLabel,
  onAction,
  actionIcon,
  compact = false,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void | Promise<void>;
  actionIcon?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: compact ? "12px 24px" : "32px 32px" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/plus-assets/empty.svg" alt="" width={220} height={168} style={{ width: compact ? 160 : 220, height: compact ? 122 : 168, objectFit: "contain" }} />
      <p style={{ margin: "8px 0 0", fontSize: 17, fontWeight: 800, color: "var(--vc-navy)" }}>{title}</p>
      {subtitle ? (
        <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.45, color: "rgba(var(--vc-navy-rgb),0.55)" }}>{subtitle}</p>
      ) : null}
      {actionLabel && onAction ? (
        <div style={{ marginTop: 20 }}>
          <ActionButton label={actionLabel} tone="teal" onClick={onAction} icon={actionIcon} />
        </div>
      ) : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void | Promise<void> }) {
  return <EmptyState title="Couldn't load this" subtitle={message} actionLabel={onRetry ? "Try again" : undefined} onAction={onRetry} />;
}

/* ───────── Photos ───────── */

export function vitaImageUrl(path: string | null | undefined): string | null {
  const raw = (path ?? "").trim();
  if (!raw || raw === "null" || raw === "undefined" || raw === "/" || raw.endsWith("/null")) return null;
  if (raw.endsWith("/media/default.png") || raw === "default.png") return null;
  return mediaUrl(raw);
}

export function Photo({ url, size, style }: { url?: string | null; size?: number; style?: React.CSSProperties }) {
  const resolved = vitaImageUrl(url);
  const [failed, setFailed] = useState(false);
  const src = !resolved || failed ? "/plus-assets/no-photo.png" : resolved;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      onError={() => setFailed(true)}
      style={{ width: size ?? "100%", height: size ?? "100%", objectFit: "cover", display: "block", ...style }}
    />
  );
}

export function Avatar({ url, size = 44 }: { url?: string | null; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        flex: "none",
        background: "var(--vc-tile-mint)",
        border: "1px solid rgba(var(--vc-navy-rgb),0.06)",
      }}
    >
      <Photo url={url} size={size} />
    </div>
  );
}

export function initials(name?: string | null): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* ───────── Tabs ───────── */

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  onBar = false,
}: {
  tabs: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  onBar?: boolean;
}) {
  return (
    <div className={cx("vita-tabs", onBar && "on-bar")} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={tab.value === value}
          className={cx(tab.value === value && "on")}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/* ───────── Fields ───────── */

export function FieldLabel({ text, required = false }: { text: string; required?: boolean }) {
  return (
    <span className="vita-label">
      {text}
      {required ? <span className="req"> *</span> : null}
    </span>
  );
}

/* ───────── Modal ───────── */

export function Modal({
  open,
  title,
  onClose,
  children,
  actions,
  compact = false,
}: {
  open: boolean;
  title: string;
  onClose?: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
  compact?: boolean;
}) {
  useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="vita-modal-scrim" onClick={onClose} role="presentation">
      <div
        className={cx("vita-modal", compact && "compact")}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="vita-modal-head">
          <h2>{title}</h2>
          {onClose ? (
            <button type="button" className="vita-modal-close" aria-label="Close" onClick={onClose}>
              <svg width={compact ? 12 : 15} height={compact ? 12 : 15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          ) : null}
        </div>
        <div className="vita-modal-body">{children}</div>
        {actions ? <div className="vita-modal-foot">{actions}</div> : null}
      </div>
    </div>
  );
}

/* ───────── Toasts and confirm ───────── */

type ToastItem = { id: number; text: string; error?: boolean };
type ConfirmRequest = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  resolve: (ok: boolean) => void;
};

type FeedbackValue = {
  toast: (text: string, options?: { error?: boolean }) => void;
  confirm: (options: Omit<ConfirmRequest, "resolve">) => Promise<boolean>;
  alert: (title: string, message: string) => Promise<void>;
};

const FeedbackContext = createContext<FeedbackValue | null>(null);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [request, setRequest] = useState<ConfirmRequest | null>(null);
  const [alertOnly, setAlertOnly] = useState(false);
  const counter = useRef(0);

  const toast = useCallback((text: string, options?: { error?: boolean }) => {
    counter.current += 1;
    const id = counter.current;
    setToasts((list) => [...list, { id, text, error: options?.error }]);
    window.setTimeout(() => setToasts((list) => list.filter((item) => item.id !== id)), 3200);
  }, []);

  const confirm = useCallback(
    (options: Omit<ConfirmRequest, "resolve">) =>
      new Promise<boolean>((resolve) => {
        setAlertOnly(false);
        setRequest({ ...options, resolve });
      }),
    [],
  );

  const alert = useCallback(
    (title: string, message: string) =>
      new Promise<void>((resolve) => {
        setAlertOnly(true);
        setRequest({ title, message, confirmLabel: "OK", resolve: () => resolve() });
      }),
    [],
  );

  const close = (ok: boolean) => {
    request?.resolve(ok);
    setRequest(null);
  };

  const value = useMemo(() => ({ toast, confirm, alert }), [toast, confirm, alert]);

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <div className="vita-toast-wrap" aria-live="polite">
        {toasts.slice(-1).map((item) => (
          <div key={item.id} className={cx("vita-toast", item.error && "error")}>
            {item.text}
          </div>
        ))}
      </div>
      <Modal
        open={Boolean(request)}
        compact
        title={request?.title ?? ""}
        onClose={() => close(false)}
        actions={
          <>
            {alertOnly ? null : (
              <ActionButton small tone="white" label={request?.cancelLabel ?? "Cancel"} onClick={() => close(false)} icon={<span />} />
            )}
            <ActionButton
              small
              tone={request?.destructive ? "danger" : "teal"}
              label={request?.confirmLabel ?? "OK"}
              onClick={() => close(true)}
            />
          </>
        }
      >
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "var(--vc-body)" }}>{request?.message}</p>
      </Modal>
    </FeedbackContext.Provider>
  );
}

export function useFeedback(): FeedbackValue {
  const value = useContext(FeedbackContext);
  if (!value) throw new Error("useFeedback must be used within FeedbackProvider");
  return value;
}

/* ───────── Skeleton ───────── */

export function Skeleton({ height, style }: { height: number; style?: React.CSSProperties }) {
  return <div className="vita-skel" style={{ height, ...style }} />;
}

export function Pill({ on, children, onClick }: { on: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" className={cx("vita-pill", on && "on")} onClick={onClick} aria-pressed={on}>
      {children}
    </button>
  );
}

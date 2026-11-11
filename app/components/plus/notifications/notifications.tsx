"use client";

import { useCallback, useEffect, useState } from "react";
import { Calendar1, ClipboardText, DocumentText, Message, Notification, Reserve, Setting2, Stickynote, TickCircle, Trash, Warning2 } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { mobileRequest } from "@/lib/plus/client/api";
import { useMe, useNotifications, type NotificationItem } from "@/lib/plus/client/data";
import { invalidate } from "@/lib/plus/client/use-resource";
import { TimePickerModal } from "../readings/log-chrome";
import { ActionButton, AppBar, CenterSpinner, CircleButton, EmptyState, Modal, useFeedback } from "../ui/vita";
import { REMINDER_SETTINGS_EVENT } from "@/lib/plus/web-notifications";
import { BrowserNotificationRow } from "../reminders/notification-permission";

const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;

/* ───────── Notification settings (NotificationSettings, kept on this device like SharedPreferences) ───────── */

type Kind = "medicines" | "appointments" | "messages" | "care";
type Delivery = { lockScreen: boolean; sound: boolean; vibration: boolean };
export type NotificationSettings = {
  medicineRemindersEnabled: boolean;
  quietHoursEnabled: boolean;
  quietStartMinutes: number;
  quietEndMinutes: number;
  delivery: Record<Kind, Delivery>;
};
const KINDS: Array<[Kind, string]> = [
  ["medicines", "Medicines"],
  ["appointments", "Appointments"],
  ["messages", "Messages"],
  ["care", "Care & documents"],
];
const SETTINGS_KEY = "vitaway.plus.notificationSettings";
const fullDelivery = (): Delivery => ({ lockScreen: true, sound: true, vibration: true });
const DEFAULTS: NotificationSettings = {
  medicineRemindersEnabled: true,
  quietHoursEnabled: false,
  quietStartMinutes: 22 * 60,
  quietEndMinutes: 7 * 60,
  delivery: { medicines: fullDelivery(), appointments: fullDelivery(), messages: fullDelivery(), care: fullDelivery() },
};

export function loadNotificationSettings(): NotificationSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = JSON.parse(window.localStorage.getItem(SETTINGS_KEY) ?? "null") as Partial<NotificationSettings> | null;
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...raw, delivery: { ...DEFAULTS.delivery, ...(raw.delivery ?? {}) } };
  } catch {
    return DEFAULTS;
  }
}

const minutesLabel = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

/* ───────── Helpers ported from notifications.dart / live_notifications.dart ───────── */

function noticeIcon(type: string) {
  const p = { size: 19, color: "var(--vc-navy)" } as const;
  switch (type) {
    case "chat":
      return <Message {...p} />;
    case "meal_plan":
      return <Reserve {...p} />;
    case "visit_report":
    case "clinic_link":
      return <ClipboardText {...p} />;
    case "appointment":
    case "apt":
      return <Calendar1 {...p} />;
    case "note":
      return <Stickynote {...p} />;
    case "art":
      return <DocumentText {...p} />;
    default:
      return <Notification {...p} />;
  }
}

function noticeTint(type: string): string {
  switch (type) {
    case "chat":
      return "var(--vc-tile-peach)";
    case "meal_plan":
      return "var(--vc-tile-sage)";
    case "appointment":
    case "apt":
      return "var(--vc-tile-sky)";
    case "visit_report":
    case "clinic_link":
      return "var(--vc-tile-lilac)";
    default:
      return "var(--vc-tile-mint)";
  }
}

/** formatDeltaString from health_metrics.dart. */
function formatDelta(value: string, t: (k: string) => string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const now = new Date();
  const hours = Math.floor((now.getTime() - parsed.getTime()) / 3_600_000);
  if (hours >= 0 && hours < 24) return `${hours} ${t("hm_hours_ago")}`;
  return parsed.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

/* ───────── Screen ───────── */

export function NotificationsScreen() {
  const t = useT();
  const { push, replace } = usePlusPaths();
  const { toast, confirm } = useFeedback();
  const { user } = useMe();
  const res = useNotifications();
  const [readIds, setReadIds] = useState<Set<number>>(new Set());
  const [cleared, setCleared] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(typeof navigator === "undefined" ? true : navigator.onLine);
    if (typeof navigator !== "undefined" && !navigator.onLine) toast(t("no_internet"), { error: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items: NotificationItem[] = cleared ? [] : res.list.map((n) => (readIds.has(n.id) ? { ...n, read: true } : n));
  const unreadCount = items.filter((n) => !n.read).length;

  const retry = useCallback(async () => {
    const ok = typeof navigator === "undefined" ? true : navigator.onLine;
    setOnline(ok);
    if (!ok) return toast(t("no_internet"), { error: true });
    setCleared(false);
    await res.reload();
  }, [res, t, toast]);

  const markRead = (n: NotificationItem) => {
    if (n.read) return;
    setReadIds((prev) => new Set(prev).add(n.id));
    void mobileRequest(`/api/v1/mobile/activity/notifications/${n.id}/read`, { method: "POST" })
      .then(() => invalidate("/notifications/"))
      .catch(() => undefined);
  };

  const markAllRead = async () => {
    if (unreadCount === 0) return toast("Everything is already read.");
    setReadIds(new Set(items.map((n) => n.id)));
    try {
      await mobileRequest("/api/v1/mobile/activity/notifications/read-all", { method: "POST" });
      invalidate("/notifications/");
    } catch {
      /* Flutter ignores this failure too */
    }
    toast("All notifications marked read");
  };

  const clearAll = async () => {
    const ok = await confirm({ title: "Clear all notifications?", message: "They are removed from this list on all your devices.", confirmLabel: "Clear all", destructive: true });
    if (!ok) return;
    try {
      const data = await mobileRequest<{ message?: unknown }>("/notifications/clear/", { method: "POST" });
      toast(typeof data?.message === "string" ? data.message : t("notifications_cleared", undefined, "Notifications cleared"));
      setCleared(true);
      invalidate("/notifications/");
    } catch {
      /* Flutter swallows a failed clear */
    }
  };

  /** openNotificationTarget from notification_links.dart. */
  const open = (n: NotificationItem) => {
    markRead(n);
    const type = n.type ?? "";
    const entity = n.entity == null ? "" : String(n.entity);
    switch (type) {
      case "chat": {
        const room = entity.startsWith("chat:") ? entity.slice(5) : "";
        return room ? push(`/chat/${encodeURIComponent(room)}`) : replace("/support");
      }
      case "meal_plan":
        return push("/meal-plans");
      case "visit_report":
        return push(entity ? `/visit-reports/${encodeURIComponent(entity)}` : "/visit-reports");
      case "clinic_link":
        return push("/visit-reports");
      case "appointment":
      case "apt":
        return user?.user_type && user.user_type !== "normal" ? replace("/reminders") : push("/appointments");
      case "note":
        return push("/notes");
      case "art":
        return entity ? push(`/articles/${encodeURIComponent(entity)}`) : undefined;
      default:
        return undefined;
    }
  };

  const describe = (n: NotificationItem): [string, string] => {
    const content = n.content ?? "";
    switch (n.type) {
      case "apt":
        return ["Appointment", content.includes("canceled") ? `Coach ${content}` : `${t("you_have_apt")} ${content}`];
      case "note":
        return ["New note", `${n.other_user_profile?.first_name ?? "Your coach"} left you a note`];
      case "chat":
        return ["Care team message", content];
      case "meal_plan":
        return ["Meal plan", content];
      case "visit_report":
        return ["Visit report", content];
      case "clinic_link":
        return ["Clinic records", content];
      case "art":
        return ["New article", content];
      default:
        return ["Vitaway", content];
    }
  };

  const loading = res.loading && !res.data;
  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar
        bubbles
        title={t("notifications_title")}
        actions={
          <CircleButton label="Notification settings" onClick={() => setSettingsOpen(true)}>
            <Setting2 size={20} color="currentColor" />
          </CircleButton>
        }
      />
      {loading ? (
        <CenterSpinner />
      ) : !online ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24 }}>
          <Warning2 size={24} color="var(--vc-danger)" style={{ opacity: 0.6 }} />
          <p style={{ margin: 0, fontSize: 16, color: navyA(0.55), textAlign: "center" }}>{t("no_internet")}</p>
          <ActionButton label={t("retry")} tone="teal" onClick={retry} />
        </div>
      ) : (
        <>
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 16px", maxWidth: 720, width: "100%", margin: "0 auto" }}>
            {items.length === 0 ? (
              <div style={{ paddingTop: 48 }}>
                <EmptyState title={t("notifications_empty")} subtitle={t("notifications_empty_body")} />
              </div>
            ) : (
              items.map((n) => {
                const unread = !n.read;
                const [title, body] = describe(n);
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => open(n)}
                    style={{ display: "flex", gap: 12, width: "100%", textAlign: "left", marginBottom: 8, padding: 12, borderRadius: 8, background: unread ? "var(--vc-surface)" : "color-mix(in srgb, var(--vc-surface) 60%, transparent)", border: `1px solid ${unread ? "rgba(232,93,47,0.35)" : "var(--vc-line)"}` }}
                  >
                    <span style={{ width: 38, height: 38, flex: "0 0 38px", borderRadius: 6, background: noticeTint(n.type ?? ""), display: "flex", alignItems: "center", justifyContent: "center" }}>{noticeIcon(n.type ?? "")}</span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ flex: 1, fontSize: 13, fontWeight: 800, color: "var(--vc-navy)" }}>{title}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: navyA(0.45) }}>{formatDelta(n.date_time, t)}</span>
                        {unread ? <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--vc-action)" }} /> : null}
                      </span>
                      <span style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", marginTop: 3, fontSize: 13, lineHeight: 1.4, fontWeight: unread ? 600 : 400, color: navyA(unread ? 0.85 : 0.6) }}>{body}</span>
                    </span>
                  </button>
                );
              })
            )}
          </div>
          {items.length ? (
            <div style={{ display: "flex", gap: 10, padding: "12px 16px calc(env(safe-area-inset-bottom) + 12px)", maxWidth: 720, width: "100%", margin: "0 auto" }}>
              <ActionButton full tone="white" label="Mark all read" icon={<TickCircle size={18} color="currentColor" />} onClick={markAllRead} style={{ flex: 1 }} />
              <ActionButton full tone="teal" label={t("clear_all")} icon={<Trash size={18} color="currentColor" />} onClick={clearAll} style={{ flex: 1 }} />
            </div>
          ) : null}
        </>
      )}
      <NotificationSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

function NotificationSettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [s, setS] = useState<NotificationSettings>(DEFAULTS);
  const [picking, setPicking] = useState<null | "start" | "end">(null);
  useEffect(() => {
    if (open) setS(loadNotificationSettings());
  }, [open]);
  const save = (next: NotificationSettings) => {
    setS(next);
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch {
      /* storage full or blocked */
    }
    window.dispatchEvent(new Event(REMINDER_SETTINGS_EVENT));
  };
  const chip = (on: boolean, label: string, onClick: () => void) => (
    <button type="button" aria-pressed={on} onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: `1px solid ${on ? "transparent" : navyA(0.2)}`, background: on ? "var(--vc-mint)" : "transparent", color: "var(--vc-navy)" }}>
      {on ? "✓ " : ""}
      {label}
    </button>
  );
  const sw = (title: string, subtitle: string, value: boolean, onChange: (v: boolean) => void) => (
    <button type="button" role="switch" aria-checked={value} onClick={() => onChange(!value)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 0", textAlign: "left" }}>
      <span style={{ flex: 1 }}>
        <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: "var(--vc-navy)" }}>{title}</span>
        <span style={{ display: "block", fontSize: 12, color: navyA(0.5) }}>{subtitle}</span>
      </span>
      <span style={{ width: 50, height: 30, borderRadius: 999, padding: 3, background: value ? "var(--vc-mint)" : navyA(0.12) }}>
        <span style={{ display: "block", width: 24, height: 24, borderRadius: "50%", background: value ? "var(--vc-teal)" : "#fff", transform: `translateX(${value ? 20 : 0}px)`, transition: "transform 160ms", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
      </span>
    </button>
  );
  const quiet = (label: string, value: number, onClick: () => void) => (
    <button type="button" onClick={onClick} style={{ flex: 1, textAlign: "left", padding: 12, borderRadius: 8, background: "var(--vc-canvas)" }}>
      <span style={{ display: "block", fontSize: 11, fontWeight: 600, color: navyA(0.45) }}>{label}</span>
      <span style={{ display: "block", marginTop: 2, fontSize: 16, fontWeight: 800, color: "var(--vc-navy)" }}>{minutesLabel(value)}</span>
    </button>
  );
  const pickedValue = picking === "start" ? s.quietStartMinutes : s.quietEndMinutes;
  return (
    <>
      <Modal open={open} title="Notification settings" onClose={onClose} actions={<ActionButton small tone="teal" label="Done" onClick={onClose} />}>
        <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 500, color: navyA(0.6) }}>Choose lock screen, sound and vibration for each type.</p>
        {KINDS.map(([kind, label]) => {
          const d = s.delivery[kind];
          const set = (patch: Partial<Delivery>) => save({ ...s, delivery: { ...s.delivery, [kind]: { ...d, ...patch } } });
          return (
            <div key={kind} style={{ marginBottom: 8, padding: 12, borderRadius: 8, background: "var(--vc-wash)" }}>
              <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 800, color: "var(--vc-navy)" }}>{label}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {chip(d.lockScreen, "Lock screen", () => set({ lockScreen: !d.lockScreen }))}
                {chip(d.sound, "Sound", () => set({ sound: !d.sound }))}
                {chip(d.vibration, "Vibration", () => set({ vibration: !d.vibration }))}
              </div>
            </div>
          );
        })}
        <BrowserNotificationRow />
        <div style={{ height: 8 }} />
        {sw("Medicine reminders", "Notify me when it is time to take a dose", s.medicineRemindersEnabled, (v) => save({ ...s, medicineRemindersEnabled: v }))}
        {sw("Quiet hours", "Hold reminders until quiet hours end", s.quietHoursEnabled, (v) => save({ ...s, quietHoursEnabled: v }))}
        {s.quietHoursEnabled ? (
          <div style={{ display: "flex", gap: 10 }}>
            {quiet("From", s.quietStartMinutes, () => setPicking("start"))}
            {quiet("Until", s.quietEndMinutes, () => setPicking("end"))}
          </div>
        ) : null}
      </Modal>
      <TimePickerModal
        open={picking !== null}
        value={{ hour: Math.floor(pickedValue / 60) % 24, minute: pickedValue % 60 }}
        onClose={() => setPicking(null)}
        onPick={({ hour, minute }) => save(picking === "start" ? { ...s, quietStartMinutes: hour * 60 + minute } : { ...s, quietEndMinutes: hour * 60 + minute })}
      />
    </>
  );
}

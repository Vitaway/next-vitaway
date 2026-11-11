"use client";

import { useEffect, useState } from "react";
import { NOTIFICATION_STATE_EVENT, notificationState, requestNotificationPermission, type NotificationState } from "@/lib/plus/web-notifications";
import { WEB_PUSH_STATE_EVENT, sendTestWebPush, webPushActive } from "@/lib/plus/web-push";
import { ActionButton, useFeedback } from "../ui/vita";

const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;

export function useNotificationState(): NotificationState | null {
  const [state, setState] = useState<NotificationState | null>(null);
  useEffect(() => {
    const read = () => setState(notificationState());
    read();
    window.addEventListener(NOTIFICATION_STATE_EVENT, read);
    document.addEventListener("visibilitychange", read);
    return () => {
      window.removeEventListener(NOTIFICATION_STATE_EVENT, read);
      document.removeEventListener("visibilitychange", read);
    };
  }, []);
  return state;
}

/** Whether this browser's push subscription is saved, so alerts arrive with the app closed. */
export function useWebPushActive(): boolean {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const read = () => setActive(webPushActive());
    read();
    window.addEventListener(WEB_PUSH_STATE_EVENT, read);
    window.addEventListener(NOTIFICATION_STATE_EVENT, read);
    return () => {
      window.removeEventListener(WEB_PUSH_STATE_EVENT, read);
      window.removeEventListener(NOTIFICATION_STATE_EVENT, read);
    };
  }, []);
  return active;
}

const PUSH_ON = "On for this device. Reminders and messages arrive even when Vitaway is closed.";

const COPY: Record<NotificationState, string> = {
  granted: "On for this device. Reminders show while Vitaway is open.",
  default: "Turn on notifications so reminders can alert you on this device.",
  denied: "Notifications are blocked. Allow them for this site in your browser settings.",
  "needs-install": "On iPhone and iPad, add Vitaway to your Home Screen first, then turn on notifications.",
  unsupported: "This browser cannot show notifications. Reminders appear inside the app instead.",
};

/** The browser permission, shown where Flutter asks with NotificationPermissions. */
export function BrowserNotificationRow({ compact = false }: { compact?: boolean }) {
  const state = useNotificationState();
  const pushOn = useWebPushActive();
  const { toast } = useFeedback();
  const [asking, setAsking] = useState(false);
  const [testing, setTesting] = useState(false);
  if (!state || (compact && state === "granted")) return null;
  return (
    <div style={{ marginTop: compact ? 0 : 8, padding: 12, borderRadius: 8, background: state === "granted" ? "var(--vc-wash)" : "var(--vc-tile-peach)", display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ flex: 1 }}>
        <span style={{ display: "block", fontSize: 14, fontWeight: 800, color: "var(--vc-navy)" }}>Device notifications</span>
        <span style={{ display: "block", marginTop: 2, fontSize: 12, lineHeight: 1.4, color: navyA(0.6) }}>{state === "granted" && pushOn ? PUSH_ON : COPY[state]}</span>
      </span>
      {state === "default" ? (
        <ActionButton
          small
          tone="teal"
          label="Turn on"
          loading={asking}
          onClick={async () => {
            setAsking(true);
            await requestNotificationPermission();
            setAsking(false);
          }}
        />
      ) : state === "granted" && pushOn && !compact ? (
        <ActionButton
          small
          tone="teal"
          label="Test"
          loading={testing}
          onClick={async () => {
            setTesting(true);
            try {
              const sent = await sendTestWebPush();
              toast(sent ? "Test notification sent." : "No device is set up for notifications yet.", { error: !sent });
            } catch {
              toast("Could not send a test notification.", { error: true });
            }
            setTesting(false);
          }}
        />
      ) : null}
    </div>
  );
}

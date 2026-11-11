"use client";

/**
 * Browser notifications for reminders. The web has no scheduled local
 * notifications (Flutter's zonedSchedule), so reminders fire from timers while
 * the app is open; the service worker only shows them.
 */

export type NotificationState = "unsupported" | "needs-install" | "default" | "granted" | "denied";

function isIosBrowserTab(): boolean {
  if (typeof navigator === "undefined") return false;
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const standalone = window.matchMedia?.("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return ios && !standalone;
}

export function notificationState(): NotificationState {
  if (typeof window === "undefined") return "unsupported";
  if (!("Notification" in window)) return isIosBrowserTab() ? "needs-install" : "unsupported";
  return Notification.permission as NotificationState;
}

/** NotificationPermissions.requestIfNeeded: ask once; call it from a tap (Safari requires that). */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  try {
    const result = await Notification.requestPermission();
    window.dispatchEvent(new Event(NOTIFICATION_STATE_EVENT));
    return result === "granted";
  } catch {
    return false;
  }
}

export const NOTIFICATION_STATE_EVENT = "vitaway:notification-state";
export const REMINDER_SETTINGS_EVENT = "vitaway:reminder-settings";

export type WebNotice = { title: string; body: string; tag: string; url: string; silent?: boolean; vibrate?: boolean };

/** Shows through the service worker (needed on Android and installed iOS apps), else the page API. */
export async function showWebNotification(notice: WebNotice): Promise<boolean> {
  if (notificationState() !== "granted") return false;
  const options: NotificationOptions & { vibrate?: number[]; renotify?: boolean } = {
    body: notice.body,
    tag: notice.tag,
    icon: "/web-app-manifest-192x192.png",
    badge: "/web-app-manifest-192x192.png",
    data: { url: notice.url },
    silent: notice.silent ?? false,
    renotify: true,
    ...(notice.vibrate === false ? {} : { vibrate: [200, 100, 200] }),
  };
  try {
    const registration = "serviceWorker" in navigator ? await navigator.serviceWorker.getRegistration() : undefined;
    if (registration) {
      await registration.showNotification(notice.title, options);
      return true;
    }
    const n = new Notification(notice.title, options);
    n.onclick = () => {
      window.focus();
      window.location.assign(notice.url);
      n.close();
    };
    return true;
  } catch {
    return false;
  }
}

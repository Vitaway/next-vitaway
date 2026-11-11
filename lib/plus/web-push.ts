"use client";

/**
 * Web Push for the installed PWA: the web twin of the Flutter app's FCM token.
 * Once notifications are allowed, the browser's PushSubscription is saved on
 * core-backend with this device's reminder schedule, so reminders and care-team
 * alerts arrive even when Vitaway is closed.
 *
 * iOS/iPadOS deliver Web Push only to a Home Screen app (16.4+), so there the
 * permission has to be asked from the installed app.
 */
import { apiUrl, mobileRequest } from "./client/api";
import { loadPlusSession } from "./session";

const ACTIVE_KEY = "vitaway.plus.webPush";
export const WEB_PUSH_STATE_EVENT = "vitaway:web-push-state";

export type DeliveryPrefs = { lockScreen: boolean; sound: boolean; vibration: boolean };

/** One daily alert core-backend fires at local `time` (HH:MM) in this device's timezone. */
export type PushReminder = {
  key: string;
  kind: "medicine_early" | "medicine_due" | "reminder";
  time: string;
  title: string;
  body: string;
  tag: string;
  /** Page under the app root, without the /app prefix. */
  path: string;
  medication_id?: number;
  slot?: string;
};

export function webPushSupported(): boolean {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

export function isInstalledApp(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

/** True once this browser's subscription is saved on the server; reminders then come from there. */
export function webPushActive(): boolean {
  if (!webPushSupported() || Notification.permission !== "granted") return false;
  try {
    return Boolean(window.localStorage.getItem(ACTIVE_KEY));
  } catch {
    return false;
  }
}

function setActive(endpoint: string | null) {
  try {
    if (endpoint) window.localStorage.setItem(ACTIVE_KEY, endpoint);
    else window.localStorage.removeItem(ACTIVE_KEY);
  } catch {
    /* storage blocked */
  }
  window.dispatchEvent(new Event(WEB_PUSH_STATE_EVENT));
}

let cachedKey: string | null = null;

async function vapidPublicKey(): Promise<string | null> {
  const fromEnv = (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "").trim();
  if (fromEnv) return fromEnv;
  if (cachedKey) return cachedKey;
  try {
    const body = await mobileRequest<{ enabled?: boolean; public_key?: string | null }>("/api/v1/mobile/web-push/public-key", { anonymous: true });
    cachedKey = body?.enabled && body.public_key ? body.public_key : null;
  } catch {
    cachedKey = null;
  }
  return cachedKey;
}

function keyBytes(base64url: string): Uint8Array<ArrayBuffer> {
  const padded = `${base64url}${"=".repeat((4 - (base64url.length % 4)) % 4)}`.replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(padded);
  const out = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i += 1) out[i] = raw.charCodeAt(i);
  return out;
}

function sameKey(current: ArrayBuffer | null | undefined, expected: Uint8Array): boolean {
  if (!current) return false;
  const a = new Uint8Array(current);
  return a.length === expected.length && a.every((v, i) => v === expected[i]);
}

async function registration(): Promise<ServiceWorkerRegistration | null> {
  try {
    const existing = await navigator.serviceWorker.getRegistration();
    if (existing) return existing;
    return await Promise.race([
      navigator.serviceWorker.ready,
      new Promise<null>((resolve) => window.setTimeout(() => resolve(null), 5000)),
    ]);
  } catch {
    return null;
  }
}

/**
 * Subscribes (or reuses / renews the subscription) and saves it with the
 * schedule. Only runs when signed in and notifications are already allowed,
 * so it never prompts by itself.
 */
export async function syncWebPush(opts: { reminders: PushReminder[]; delivery: Record<string, DeliveryPrefs> }): Promise<boolean> {
  if (!webPushSupported() || Notification.permission !== "granted") return false;
  if (!loadPlusSession()?.mobileToken) return false;
  const key = await vapidPublicKey();
  const reg = key ? await registration() : null;
  if (!key || !reg) return false;
  try {
    const expected = keyBytes(key);
    let sub = await reg.pushManager.getSubscription();
    if (sub && !sameKey(sub.options.applicationServerKey, expected)) {
      await sub.unsubscribe().catch(() => undefined);
      sub = null;
    }
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: expected });
    await mobileRequest("/api/v1/mobile/web-push/subscriptions", {
      method: "POST",
      body: {
        subscription: sub.toJSON(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        delivery: opts.delivery,
        reminders: opts.reminders,
      },
    });
    setActive(sub.endpoint);
    return true;
  } catch {
    setActive(null);
    return false;
  }
}

/** Sign-out: forget this browser on the server, then drop the subscription. */
export async function removeWebPush(mobileToken: string | null | undefined): Promise<void> {
  if (!webPushSupported()) return;
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = reg ? await reg.pushManager.getSubscription() : null;
    if (sub && mobileToken) {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 4000);
      await fetch(apiUrl("/api/v1/mobile/web-push/subscriptions/remove"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Token ${mobileToken}` },
        body: JSON.stringify({ endpoint: sub.endpoint }),
        signal: controller.signal,
      })
        .catch(() => undefined)
        .finally(() => window.clearTimeout(timer));
    }
    // Without the subscription the push service answers 410 and the server drops the row.
    await sub?.unsubscribe().catch(() => undefined);
  } catch {
    /* nothing to undo */
  }
  setActive(null);
}

/** Sends a test alert to every device this account subscribed (Notification settings). */
export async function sendTestWebPush(): Promise<number> {
  const body = await mobileRequest<{ sent?: number }>("/api/v1/mobile/web-push/test", { method: "POST", body: {} });
  return Number(body?.sent ?? 0);
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { useReminders, type Reminder } from "@/lib/plus/reminders";
import { useTodayMedications } from "@/lib/plus/client/meds";
import { doseLabel, reminderTimes, type Medication } from "@/lib/plus/medication";
import { REMINDER_SETTINGS_EVENT, showWebNotification, type WebNotice } from "@/lib/plus/web-notifications";
import { loadNotificationSettings, type NotificationSettings } from "../notifications/notifications";
import { useFeedback } from "../ui/vita";

const HORIZON_MS = 26 * 60 * 60 * 1000;
const LATE_OK_MS = 30 * 60 * 1000;
const FIRED_KEY = "vitaway.plus.remindersFired";

type Planned = WebNotice & { at: number; key: string; medId?: number; slot?: string; followUp?: boolean };

const parseHm = (s: string): [number, number] | null => {
  const m = /^(\d{1,2}):(\d{2})/.exec(s.trim());
  if (!m) return null;
  let hour = Number(m[1]);
  const minute = Number(m[2]);
  if (/pm/i.test(s) && hour < 12) hour += 12;
  if (/am/i.test(s) && hour === 12) hour = 0;
  return [hour, minute];
};

/** NotificationSettings.isInQuietHours / adjustForQuietHours. */
function adjustForQuietHours(s: NotificationSettings, at: Date): Date {
  if (!s.quietHoursEnabled || s.quietStartMinutes === s.quietEndMinutes) return at;
  const mins = at.getHours() * 60 + at.getMinutes();
  const inQuiet = s.quietStartMinutes < s.quietEndMinutes ? mins >= s.quietStartMinutes && mins < s.quietEndMinutes : mins >= s.quietStartMinutes || mins < s.quietEndMinutes;
  if (!inQuiet) return at;
  const out = new Date(at.getFullYear(), at.getMonth(), at.getDate(), Math.floor(s.quietEndMinutes / 60) % 24, s.quietEndMinutes % 60);
  if (s.quietStartMinutes > s.quietEndMinutes && mins >= s.quietStartMinutes) out.setDate(out.getDate() + 1);
  return out;
}

const alreadyLogged = (med: Medication, time: string) => med.slots.some((slot) => slot.time === time && ["taken", "missed", "skipped"].includes(slot.status));

/** Next time today/tomorrow, like MedicationReminderScheduler._nextFire. */
function nextFire(at: Date, now: Date, skipToday: boolean): Date {
  if (skipToday || at.getTime() <= now.getTime()) return new Date(at.getTime() + 24 * 60 * 60 * 1000);
  return at;
}

function readFired(): Record<string, number> {
  try {
    return JSON.parse(window.localStorage.getItem(FIRED_KEY) ?? "{}") as Record<string, number>;
  } catch {
    return {};
  }
}

function markFired(key: string) {
  const fired = readFired();
  const cutoff = Date.now() - 2 * 24 * 60 * 60 * 1000;
  for (const [k, v] of Object.entries(fired)) if (v < cutoff) delete fired[k];
  fired[key] = Date.now();
  try {
    window.localStorage.setItem(FIRED_KEY, JSON.stringify(fired));
  } catch {
    /* storage blocked */
  }
}

/**
 * Fires medicine and personal reminders as browser notifications while the app
 * is open, following medication_reminders.dart (a 5-minute warning, then a
 * dose-time follow-up) and add_reminder.dart (daily at each time).
 */
export function WebReminderScheduler() {
  const t = useT();
  const { href } = usePlusPaths();
  const { toast } = useFeedback();
  const meds = useTodayMedications();
  const { list: reminders } = useReminders();
  const medsRef = useRef<Medication[]>([]);
  const [tick, setTick] = useState(0);
  medsRef.current = meds.list;
  const medsKey = JSON.stringify(meds.list.map((m) => [m.id, m.name, m.times, m.frequency, m.reminders_enabled, m.dosage, m.unit, m.instructions, m.slots.map((s) => [s.time, s.status])]));

  // Re-plan when settings change, the tab wakes up, and every hour.
  useEffect(() => {
    const bump = () => setTick((n) => n + 1);
    const onVisible = () => {
      if (document.visibilityState === "visible") bump();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key && /notificationSettings|reminders$/.test(e.key)) bump();
    };
    window.addEventListener(REMINDER_SETTINGS_EVENT, bump);
    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisible);
    const hourly = window.setInterval(bump, 60 * 60 * 1000);
    return () => {
      window.removeEventListener(REMINDER_SETTINGS_EVENT, bump);
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisible);
      window.clearInterval(hourly);
    };
  }, []);

  useEffect(() => {
    const now = new Date();
    const settings = loadNotificationSettings();
    const planned: Planned[] = [];
    const day = (h: number, m: number) => new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
    const stamp = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}T${d.getHours()}:${d.getMinutes()}`;

    if (settings.medicineRemindersEnabled) {
      const delivery = settings.delivery.medicines;
      for (const med of medsRef.current) {
        if (!med.reminders_enabled) continue;
        const label = `${doseLabel(med)}${med.instructions ? ` · ${med.instructions}` : ""}`;
        reminderTimes(med).forEach((time) => {
          const hm = parseHm(time);
          if (!hm) return;
          const dose = day(hm[0], hm[1]);
          const taken = alreadyLogged(med, time);
          const early = adjustForQuietHours(settings, nextFire(new Date(dose.getTime() - 5 * 60_000), now, taken));
          const follow = adjustForQuietHours(settings, nextFire(dose, now, taken));
          const base = { url: href("/medications"), silent: !delivery.sound, vibrate: delivery.vibration, medId: med.id, slot: time };
          planned.push({ ...base, at: early.getTime(), key: `med:${med.id}:${time}:early@${stamp(early)}`, tag: `med-${med.id}-${time}-early`, title: `Coming up: ${med.name}`, body: `In 5 minutes, take ${label}.` });
          planned.push({ ...base, at: follow.getTime(), key: `med:${med.id}:${time}:due@${stamp(follow)}`, tag: `med-${med.id}-${time}-due`, title: `Log ${med.name}`, body: "You haven't logged this dose. We'll mark it as not taken in 2 minutes.", followUp: true });
        });
      }
    }

    const heyThere = `${t("hey_there")} 🤗, ${t("its_time")}`;
    for (const reminder of reminders as Reminder[]) {
      if (!reminder.active || !reminder.isNotificationEnabled) continue;
      const title =
        reminder.type === "glucose" ? `⏰ ${t("glucose_reminder")}!` : reminder.type === "bp" ? `⏰ ${t("bp_reminder")}!` : reminder.type === "med" ? `💊 ${t("med_reminder")} 💊` : `⏰ ${t("your_reminder")}: ${reminder.name}`;
      const body = reminder.type === "med" || reminder.type === "other" ? `${heyThere}, ${t("take")} ${reminder.name}!` : `${heyThere}, ${t("for")} ${title}!`;
      reminder.times.forEach((time, i) => {
        if (reminder.timeEnabled?.[i] === false) return;
        const hm = parseHm(time);
        if (!hm) return;
        const at = nextFire(day(hm[0], hm[1]), now, false);
        planned.push({ at: at.getTime(), key: `rem:${reminder.id}:${i}@${stamp(at)}`, tag: `rem-${reminder.id}-${i}`, title, body, url: href(`/reminders/${encodeURIComponent(reminder.id)}`) });
      });
    }

    const timers: number[] = [];
    const fire = (p: Planned) => {
      if (readFired()[p.key]) return;
      if (Date.now() - p.at > LATE_OK_MS) return;
      if (p.followUp && p.medId !== undefined) {
        const med = medsRef.current.find((m) => m.id === p.medId);
        if (med && p.slot && alreadyLogged(med, p.slot)) return;
      }
      markFired(p.key);
      void showWebNotification(p).then((shown) => {
        if (!shown && document.visibilityState === "visible") toast(`${p.title} — ${p.body}`);
      });
    };
    for (const p of planned) {
      const delay = p.at - Date.now();
      if (delay > HORIZON_MS || delay < -LATE_OK_MS) continue;
      timers.push(window.setTimeout(() => fire(p), Math.max(0, delay)));
    }
    return () => timers.forEach((id) => window.clearTimeout(id));
    // Re-plan on data, reminders, settings or wake-up (tick).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medsKey, reminders, tick, href]);

  // Nothing to render; the permission prompt lives on the reminders and settings screens.
  return null;
}

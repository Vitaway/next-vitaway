"use client";

import { asList, mobileRequest } from "./api";
import { useResource } from "./use-resource";
import type { HealthMetric } from "../health";

/* ───────── Me ───────── */

export type MeProfile = {
  first_name?: string | null;
  last_name?: string | null;
  age?: number | null;
  email?: string | null;
  profile_picture?: string | null;
  bio?: string | null;
  height?: number | null;
  country?: string | null;
  city?: string | null;
  language?: string | null;
  id_number?: string | null;
  phone_number?: string | null;
  badges?: unknown[];
  profile_badges?: unknown[];
  speciality?: string | null;
  medical_record_number?: string | null;
  community_handle?: string | null;
};

export type MeUser = {
  id: number;
  user_identifier?: string;
  is_verified?: boolean;
  has_completed_profile?: boolean;
  free_trial?: boolean;
  email?: string;
  gender?: string | null;
  age?: number | null;
  first_name?: string;
  last_name?: string;
  user_type?: "normal" | "coach" | "dietitian" | string;
  coach_account_id?: number | null;
  profile?: MeProfile;
  other_chronic_condition?: string | null;
  health_goals?: unknown;
  other_health_goal?: string | null;
  chronic_conditions?: unknown;
  needs_contact?: boolean;
  organization?: { name?: string | null; discount_pct?: number | null } | null;
};

export function useMe() {
  const resource = useResource<{ user: MeUser }>("/me/");
  return { ...resource, user: resource.data?.user };
}

export function displayName(user?: MeUser | null): string {
  return [user?.first_name, user?.last_name].map((part) => (part ?? "").trim()).filter(Boolean).join(" ");
}

/* ───────── Readings ───────── */

export function useMetrics() {
  const resource = useResource<HealthMetric[]>("/health-metrics/", async () => asList<HealthMetric>(await mobileRequest("/health-metrics/")));
  return { ...resource, metrics: resource.data ?? [] };
}

/* ───────── Subscription ───────── */

export type SubscriptionRow = {
  id?: number;
  plan?: number;
  plan_id?: number;
  start_date: string;
  end_date: string;
  is_active?: boolean | number | string;
  remaining_days?: number | string;
};

export type SubscriptionState = {
  loading: boolean;
  active: boolean;
  onTrial: boolean;
  canTrial: boolean;
  daysLeft: number;
  current: SubscriptionRow | null;
  reload: () => Promise<void>;
};

function asBool(value: unknown): boolean {
  return value === true || value === 1 || value === "1" || (typeof value === "string" && value.toLowerCase() === "true");
}

function endOfDay(value: string): Date {
  const d = new Date(value);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
}

export function subscriptionActive(row: SubscriptionRow): boolean {
  if (!asBool(row.is_active)) return false;
  if (Number(row.remaining_days ?? 0) > 0) return true;
  return Date.now() <= endOfDay(row.end_date).getTime();
}

function daysLeft(row: SubscriptionRow): number {
  const remaining = Number(row.remaining_days ?? 0);
  if (remaining > 0) return remaining;
  const diff = Math.floor((endOfDay(row.end_date).getTime() - Date.now()) / 86_400_000);
  return diff < 0 ? 0 : diff;
}

export function useSubscription(): SubscriptionState {
  const { user } = useMe();
  const resource = useResource<SubscriptionRow[]>("/subscriptions/", async () => asList<SubscriptionRow>(await mobileRequest("/subscriptions/")));
  const staff = user?.user_type === "coach" || user?.user_type === "dietitian";
  const rows = [...(resource.data ?? [])].sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
  const current = rows.find(subscriptionActive) ?? rows[0] ?? null;
  const active = staff || (current ? subscriptionActive(current) : false);
  const planId = Number(current?.plan ?? current?.plan_id ?? 0);
  return {
    loading: resource.loading,
    active,
    onTrial: active && Boolean(current) && planId === 1,
    canTrial: !staff && !active && !user?.free_trial,
    daysLeft: current && subscriptionActive(current) ? daysLeft(current) : 0,
    current,
    reload: resource.reload,
  };
}

/* ───────── Notifications ───────── */

export type NotificationItem = {
  id: number;
  type?: string;
  content?: string;
  owner?: number;
  owner_profile?: { first_name?: string; last_name?: string; profile_picture?: string } | null;
  other_user_profile?: { first_name?: string; last_name?: string; profile_picture?: string } | null;
  date_time: string;
  entity?: number | string | null;
  read?: boolean;
};

export function useNotifications() {
  const resource = useResource<NotificationItem[]>("/notifications/", async () => asList<NotificationItem>(await mobileRequest("/notifications/")), { pollMs: 60_000 });
  const list = resource.data ?? [];
  return { ...resource, list, unread: list.filter((item) => !item.read).length };
}

/* ───────── Appointments ───────── */

export type Appointment = {
  id: number | string;
  reservation_day: string;
  start_time: string;
  end_time: string;
  status: string;
  kind?: "clinic" | "coaching" | string;
  coach_profile?: { first_name?: string; last_name?: string; profile_picture?: string } | null;
  meeting_id?: string | null;
  status_label?: string | null;
  change_note?: string | null;
  notes?: string | null;
  subject?: string | null;
  cancel_reason?: string | null;
};

/** Mirrors `_appointmentStart`: the day from reservation_day, the clock from start_time. */
export function appointmentStart(item: Appointment): Date {
  const clock = new Date(item.start_time);
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(item.reservation_day ?? "");
  if (!match || Number.isNaN(clock.getTime())) return clock;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), clock.getHours(), clock.getMinutes());
}

export function appointmentEnd(item: Appointment): Date {
  const clock = new Date(item.end_time);
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(item.reservation_day ?? "");
  if (!match || Number.isNaN(clock.getTime())) return clock;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), clock.getHours(), clock.getMinutes());
}

export function useAppointments() {
  const resource = useResource<Appointment[]>(
    "appointments:all",
    async () => {
      const results = await Promise.allSettled([
        mobileRequest("/api/user-reservations/"),
        mobileRequest("/api/v1/mobile/ehr/visits"),
      ]);
      const ok = results.filter((r): r is PromiseFulfilledResult<unknown> => r.status === "fulfilled");
      if (!ok.length) throw (results[0] as PromiseRejectedResult).reason;
      const all = ok.flatMap((r) => asList<Appointment>(r.value));
      all.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
      return all;
    },
    { pollMs: 50_000 },
  );
  return { ...resource, all: resource.data ?? [] };
}

/* ───────── Articles ───────── */

export type Article = {
  id: number;
  title: string;
  image?: string | null;
  content?: string;
  author?: string;
  created_at?: string;
  category?: number | null;
  language?: string;
};

export function useArticles(language: string) {
  const key = `/api/articles/?language=${language}`;
  const resource = useResource<Article[]>(key, async () => asList<Article>(await mobileRequest("/api/articles/", { query: { language } })));
  return { ...resource, articles: resource.data ?? [] };
}

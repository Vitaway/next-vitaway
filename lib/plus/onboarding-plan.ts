/**
 * Onboarding plan (tracker BL-151), same as Flutter onboarding_quiz.dart:
 * a daily goal (2/5/10 minutes), a reminder time, a streak promise (7/14/30 days), then "Your plan is ready".
 * The choices go to /update_profile/ (core-backend validates the same values; older servers ignore them)
 * and are kept on this device too, so Home and reminders work either way.
 */
import type { Reminder } from "./reminders";

export const PLAN_GOAL_MINUTES = [2, 5, 10] as const;
export const PLAN_STREAK_DAYS = [7, 14, 30] as const;
export const PLAN_DEFAULT_TIME = { hour: 8, minute: 0 };
export const PLAN_STORAGE_KEY = "vitaway.plus.plan";
export const PLAN_REMINDER_ID = "plan-daily-check-in";

export type PlanChoices = { dailyGoal: number; reminder: { hour: number; minute: number }; streakGoal: number };

const pad = (n: number) => String(n).padStart(2, "0");

export function planHhmm(t: { hour: number; minute: number }): string {
  return `${pad(t.hour)}:${pad(t.minute)}`;
}

export function todayIso(now: Date = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Fields sent with /update_profile/ (names match the Flutter app and core-backend). */
export function planProfileFields(plan: PlanChoices, now: Date = new Date()) {
  return {
    daily_goal_minutes: plan.dailyGoal,
    reminder_time: planHhmm(plan.reminder),
    streak_goal_days: plan.streakGoal,
    plan_started_on: todayIso(now),
  };
}

export function savePlanLocally(plan: PlanChoices, now: Date = new Date()): void {
  try {
    window.localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(planProfileFields(plan, now)));
  } catch {
    /* storage full or blocked: the profile copy still holds the plan */
  }
}

export function loadPlanMinutes(): number {
  try {
    const raw = JSON.parse(window.localStorage.getItem(PLAN_STORAGE_KEY) ?? "null") as { daily_goal_minutes?: number } | null;
    const n = Number(raw?.daily_goal_minutes);
    return (PLAN_GOAL_MINUTES as readonly number[]).includes(n) ? n : 5;
  } catch {
    return 5;
  }
}

/** The daily reminder the plan promises (type "other" so the reminders list shows it; taps open Home). */
export function planReminder(name: string, plan: PlanChoices, now: Date = new Date()): Reminder {
  return {
    id: PLAN_REMINDER_ID,
    type: "other",
    name,
    times: [`${plan.reminder.hour}:${plan.reminder.minute}`],
    timeEnabled: [true],
    active: true,
    recurring: true,
    repeat: false,
    repeatDays: ["Daily"],
    isNotificationEnabled: true,
    dateCreated: now.toISOString(),
  };
}

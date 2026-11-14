/**
 * Where a tapped reminder opens (BL-122), same as Flutter reminderTapPath in lib/utils/reminders.dart:
 * medicine reminders open the Pillbox, BP and glucose reminders open their log screen,
 * the onboarding plan reminder opens Home, anything else opens that reminder.
 */
export function reminderTapPath(type: string | null | undefined, reminderId?: string | number | null): string {
  switch ((type ?? "").trim()) {
    case "med":
      return "/medications";
    case "bp":
      return "/log/bp";
    case "glucose":
      return "/log/glucose";
    case "plan":
      return "/home";
    default:
      return reminderId == null || reminderId === "" ? "/reminders" : `/reminders/${encodeURIComponent(String(reminderId))}`;
  }
}

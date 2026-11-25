/** W27 API calls for reminder preferences and consent. Pure helpers are in reminder-prefs-logic.ts. */
import { mobileRequest } from "./client/api";
import { parseSettings, type Preferences, type ReminderChannel, type ReminderPurpose } from "./reminder-prefs-logic";

export * from "./reminder-prefs-logic";

export async function getReminderSettings() {
  return parseSettings(await mobileRequest(`/api/v1/mobile/reminders/settings`));
}

export async function saveReminderPreferences(prefs: Partial<Preferences>) {
  return parseSettings(await mobileRequest(`/api/v1/mobile/reminders/preferences`, { method: "PUT", body: prefs }));
}

export async function setReminderConsent(purpose: ReminderPurpose, channel: ReminderChannel, granted: boolean) {
  return parseSettings(await mobileRequest(`/api/v1/mobile/reminders/consents`, { method: "POST", body: { purpose, channel, granted } }));
}

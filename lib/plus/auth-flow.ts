import type { PlusSession } from "./session";
import { isStaffPrimaryDoor } from "./session";

/**
 * The Flutter router's redirect order for a signed-in account (main.dart):
 * unverified → /verify-code, phone sign-up without a name → /account-details,
 * quiz not done → /onboarding-quiz, otherwise /home.
 *
 * Flutter defaults hasCompletedProfile to false and then refreshes it from
 * GET /me/. A missing flag must not skip the quiz for a mobile client session.
 * Staff-only or older phone-code sessions without a mobile key still skip it
 * until /me fills the flags in.
 */
export function nextAuthPath(session: PlusSession): string {
  if (session.verified === false) return "/verify-code";
  if (session.needsContact === true) return "/account-details";
  if (session.hasCompletedProfile === true) return "/home";
  if (session.hasCompletedProfile === false) return "/onboarding-quiz";
  const mobileClient = Boolean(session.mobileToken) && !isStaffPrimaryDoor(session.primaryDoor);
  return mobileClient ? "/onboarding-quiz" : "/home";
}

import type { PlusSession } from "./session";

/**
 * The Flutter router's redirect order for a signed-in account (main.dart):
 * unverified → /verify-code, phone sign-up without a name → /account-details,
 * quiz not done → /onboarding-quiz, otherwise /home. Flags are only known for
 * password/sign-up sessions; older phone-code sessions skip the gates.
 */
export function nextAuthPath(session: PlusSession): string {
  if (session.verified === false) return "/verify-code";
  if (session.needsContact === true) return "/account-details";
  if (session.hasCompletedProfile === false) return "/onboarding-quiz";
  return "/home";
}

export type AppDoor = "client_app" | "care_console" | "partner_portal";

export type PlusSessionUser = {
  id: string;
  email?: string | null;
  displayName?: string | null;
  role?: string | null;
};

export type PlusSession = {
  token: string;
  /**
   * DRF-style key the mobile endpoints expect as `Authorization: Token …`.
   * Empty for staff accounts that have no client profile.
   */
  mobileToken: string;
  user: PlusSessionUser;
  roles: string[];
  doors: AppDoor[];
  primaryDoor: AppDoor | null;
  /** Phone used at sign-in. Stored locally so we can show the account without a synthetic email. */
  phone?: string | null;
  /** Mobile account flags from /login, /signup and /me (storeUserData in Flutter). */
  verified?: boolean;
  needsContact?: boolean;
  hasCompletedProfile?: boolean;
  /** user.organization from the mobile payload (account_details.dart subtitle). */
  organizationName?: string;
  organizationDiscount?: number;
};

export const PLUS_SESSION_KEY = "vitaway.plus.session";

const DOORS: AppDoor[] = ["client_app", "care_console", "partner_portal"];

function isDoor(value: unknown): value is AppDoor {
  return typeof value === "string" && (DOORS as string[]).includes(value);
}

export function isStaffPrimaryDoor(door: AppDoor | null | undefined): boolean {
  return door === "care_console" || door === "partner_portal";
}

export function displayAccountName(session: PlusSession | null): string {
  if (!session) return "Signed in";
  const name = session.user.displayName?.trim();
  if (name && name.toLowerCase() !== "vitaway member") return name;
  if (session.phone) return formatPhoneForDisplay(session.phone);
  return name || "Vitaway member";
}

export function formatPhoneForDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("250") && digits.length === 12) {
    return `+250 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  return phone;
}

/** True when an older saved session exists that lacks the mobile key. */
export function hasStaleSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(PLUS_SESSION_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as Partial<PlusSession>;
    return Boolean(parsed?.token) && typeof parsed?.mobileToken !== "string";
  } catch {
    return false;
  }
}

export function loadPlusSession(): PlusSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PLUS_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PlusSession>;
    if (!parsed || typeof parsed.token !== "string") return null;
    // Password sign-in (Flutter /login) only returns the mobile key, so the web token may be empty.
    if (!parsed.token && !(typeof parsed.mobileToken === "string" && parsed.mobileToken)) return null;
    if (!parsed.user || typeof parsed.user !== "object" || typeof parsed.user.id !== "string") {
      return null;
    }
    // Sessions saved before the client app needed the mobile key must sign in again.
    if (typeof parsed.mobileToken !== "string") return null;
    const doors = Array.isArray(parsed.doors) ? parsed.doors.filter(isDoor) : [];
    const primaryDoor = isDoor(parsed.primaryDoor) ? parsed.primaryDoor : null;
    return {
      token: parsed.token,
      mobileToken: parsed.mobileToken,
      user: {
        id: parsed.user.id,
        email: parsed.user.email ?? null,
        displayName: parsed.user.displayName ?? null,
        role: parsed.user.role ?? null,
      },
      roles: Array.isArray(parsed.roles) ? parsed.roles.filter((role) => typeof role === "string") : [],
      doors,
      primaryDoor,
      phone: typeof parsed.phone === "string" ? parsed.phone : null,
      verified: typeof parsed.verified === "boolean" ? parsed.verified : undefined,
      needsContact: typeof parsed.needsContact === "boolean" ? parsed.needsContact : undefined,
      hasCompletedProfile: typeof parsed.hasCompletedProfile === "boolean" ? parsed.hasCompletedProfile : undefined,
      organizationName: typeof parsed.organizationName === "string" ? parsed.organizationName : undefined,
      organizationDiscount: typeof parsed.organizationDiscount === "number" ? parsed.organizationDiscount : undefined,
    };
  } catch {
    return null;
  }
}

export function savePlusSession(session: PlusSession): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PLUS_SESSION_KEY, JSON.stringify(session));
}

export function clearPlusSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PLUS_SESSION_KEY);
}

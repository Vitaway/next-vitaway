import { APIError } from "@/lib/api/client";
import { apiBase } from "./auth-api";
import type { PlusSession } from "./session";

/**
 * The Flutter app's sign-in, sign-up, password reset and account verification
 * calls (login.dart, register.dart, forgot_password.dart, verification.dart,
 * reset.dart, account_verification_code_input.dart), against the same legacy
 * mobile routes on core-backend. Tokens stay in memory or localStorage only.
 */

type Json = Record<string, unknown>;

export type Identifier = { email: string } | { phone_number: string };

export type AccountExists = { next: string; mirafood: boolean };

export class MobileAuthError extends APIError {
  accountExists: AccountExists | null;
  constructor(message: string, status?: number, data?: unknown, accountExists: AccountExists | null = null) {
    super(message, status, data);
    this.accountExists = accountExists;
  }
}

function pickError(data: unknown): string {
  if (!data || typeof data !== "object") return typeof data === "string" ? data : "";
  const body = data as Json;
  for (const key of ["error", "detail", "message", "email", "phone_number", "password", "non_field_errors"]) {
    const value = body[key];
    if (typeof value === "string" && value) return value;
    if (Array.isArray(value) && value.length) return value.map(String).join(" ");
  }
  const nested = body.data as Json | undefined;
  if (nested && typeof nested.message === "string") return nested.message;
  return "";
}

function accountExistsOf(data: unknown): AccountExists | null {
  if (!data || typeof data !== "object") return null;
  const body = data as Json;
  const source = (body.account_exists === true ? body : (body.data as Json | undefined)) ?? null;
  if (!source || source.account_exists !== true) return null;
  const known = source.known_on;
  return {
    next: typeof source.next === "string" ? source.next : "login_to_link",
    mirafood: Array.isArray(known) && known.map(String).includes("mirafood"),
  };
}

async function call<T = Json>(
  path: string,
  body: Json,
  options: { token?: string; form?: boolean; timeoutMs?: number } = {},
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 30_000);
  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.token) headers.Authorization = `Token ${options.token}`;
  let payload: string;
  if (options.form) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    payload = new URLSearchParams(Object.entries(body).map(([k, v]) => [k, String(v ?? "")])).toString();
  } else {
    headers["Content-Type"] = "application/json; charset=UTF-8";
    payload = JSON.stringify(body);
  }
  let response: Response;
  try {
    response = await fetch(`${apiBase()}${path}`, { method: "POST", headers, body: payload, signal: controller.signal });
  } catch {
    throw new MobileAuthError("network", 0);
  } finally {
    clearTimeout(timer);
  }
  const text = await response.text();
  let data: unknown = text;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    /* keep text */
  }
  if (!response.ok) {
    throw new MobileAuthError(pickError(data) || `HTTP ${response.status}`, response.status, data, accountExistsOf(data));
  }
  // Raw DRF bodies; tolerate an envelope just in case.
  if (data && typeof data === "object" && "data" in (data as Json) && (data as Json).success !== undefined) {
    return (data as Json).data as T;
  }
  return data as T;
}

function str(value: unknown): string {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

/** storeUserData: turn a mobileAuthPayload into the PWA session. */
export function sessionFromMobilePayload(payload: Json): PlusSession {
  const token = str(payload.token);
  const user = (payload.user as Json | undefined) ?? {};
  const profile = ((user.profile as Json | undefined) ?? (payload.profile as Json | undefined)) ?? {};
  if (!token || user.id == null) throw new MobileAuthError("Sign-in did not return a session. Please try again.");
  const name = [str(user.first_name), str(user.last_name)].filter(Boolean).join(" ").trim();
  const org = user.organization && typeof user.organization === "object" ? (user.organization as Json) : null;
  return {
    token: "",
    mobileToken: token,
    user: {
      id: str(user.id),
      email: str(user.email) || null,
      displayName: name || null,
      role: str(user.user_type) || "normal",
    },
    roles: [],
    doors: ["client_app"],
    primaryDoor: "client_app",
    phone: str(profile.phone_number) || null,
    verified: user.is_verified === true,
    needsContact: user.needs_contact === true,
    hasCompletedProfile: user.has_completed_profile === true,
    organizationName: org ? str(org.name).trim() : "",
    organizationDiscount: org && typeof org.discount_pct === "number" ? Math.round(org.discount_pct) : 0,
  };
}

/** Merge GET /me/ (Flutter refreshGateFromServer) into a saved PWA session. */
export function applyMobileUserToSession(session: PlusSession, payload: Json): PlusSession {
  const user = ((payload.user as Json | undefined) ?? payload) as Json;
  if (!user || typeof user !== "object" || user.id == null) return session;
  const profile = ((user.profile as Json | undefined) ?? {}) as Json;
  const name = [str(user.first_name), str(user.last_name)].filter(Boolean).join(" ").trim();
  const org = user.organization && typeof user.organization === "object" ? (user.organization as Json) : null;
  return {
    ...session,
    user: {
      ...session.user,
      id: str(user.id) || session.user.id,
      email: str(user.email) || session.user.email,
      displayName: name || session.user.displayName,
      role: str(user.user_type) || session.user.role,
    },
    phone: str(profile.phone_number) || session.phone,
    verified: user.is_verified === true,
    needsContact: user.needs_contact === true,
    hasCompletedProfile: user.has_completed_profile === true,
    organizationName: org ? str(org.name).trim() : session.organizationName,
    organizationDiscount: org && typeof org.discount_pct === "number" ? Math.round(org.discount_pct) : session.organizationDiscount,
  };
}

/**
 * Re-read account flags from the API. Returns null on a 401 so the session can
 * be dropped; any other failure keeps the local session.
 */
export async function refreshSessionFromMe(session: PlusSession, timeoutMs = 8_000): Promise<PlusSession | null> {
  if (!session.mobileToken) return session;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${apiBase()}/me/`, {
      method: "GET",
      headers: { Accept: "application/json", Authorization: `Token ${session.mobileToken}` },
      signal: controller.signal,
      cache: "no-store",
    });
    if (response.status === 401) return null;
    if (!response.ok) return session;
    const text = await response.text();
    let data: unknown = text;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      return session;
    }
    const body =
      data && typeof data === "object" && "data" in (data as Json) && (data as Json).success !== undefined
        ? ((data as Json).data as Json)
        : (data as Json);
    return applyMobileUserToSession(session, body);
  } catch {
    return session;
  } finally {
    clearTimeout(timer);
  }
}

export async function passwordLogin(id: Identifier, password: string): Promise<PlusSession> {
  return sessionFromMobilePayload(await call("/login", { ...id, password }, { form: true }));
}

export async function linkMirafood(id: Identifier, password: string): Promise<PlusSession> {
  return sessionFromMobilePayload(await call("/api/v1/mobile/auth/link-mirafood", { ...id, password }));
}

export async function signup(
  id: Identifier,
  password: string,
): Promise<{ session: PlusSession; codeSent: boolean; onPhone: boolean }> {
  const data = await call<Json>("/signup/", { ...id, password });
  const channel = str(data.verification_channel);
  return {
    session: sessionFromMobilePayload(data),
    codeSent: data.verification_email_sent === true,
    onPhone: channel === "sms" || channel === "whatsapp" || channel === "sms_whatsapp",
  };
}

export async function googleSignIn(accessToken: string): Promise<PlusSession> {
  return sessionFromMobilePayload(await call("/auth/google/", { accessToken }));
}

/** Returns the reset token the next two steps need. Kept in memory only. */
export async function requestPasswordReset(id: Identifier): Promise<string> {
  const data = await call<Json>("/password-reset/", id, { timeoutMs: 45_000 });
  return str(data.token);
}

export async function validateResetCode(code: string): Promise<void> {
  await call("/validate-code/", { validation_code: code }, { form: true });
}

export async function confirmPasswordReset(token: string, password: string, confirm: string): Promise<void> {
  await call("/password-reset-confirm/", { new_password: password, confirm_password: confirm, token }, { form: true });
}

export async function resendAccountVerification(mobileToken: string, email: string): Promise<{ alreadyVerified: boolean }> {
  const data = await call<Json>("/account-verification/", { email }, { token: mobileToken });
  return { alreadyVerified: data.is_verified === true };
}

export async function confirmAccountVerification(mobileToken: string, code: string): Promise<void> {
  await call("/account-verification-success/", { validation_code: code }, { token: mobileToken });
}

import axios from "axios";
import { APIError } from "@/lib/api/client";
import type { AppDoor, PlusSession, PlusSessionUser } from "./session";

type OtpRequestResponse = {
  ok?: boolean;
  message?: string;
  debugCode?: string;
};

type SessionUserPayload = {
  id?: string;
  email?: string | null;
  displayName?: string | null;
  role?: string | null;
  roles?: string[];
  doors?: string[];
  primaryDoor?: string | null;
};

type SessionPayload = {
  token?: string;
  mobile_token?: string | null;
  created?: boolean;
  roles?: string[];
  doors?: string[];
  primaryDoor?: string | null;
  user?: SessionUserPayload;
  staffSetupRequired?: "second_factor";
  challengeToken?: string;
  message?: string;
};

export type VerifyOtpResult =
  | { kind: "session"; session: PlusSession }
  | { kind: "staff_setup"; challengeToken: string; message: string };

export function apiBase(): string {
  return (process.env.NEXT_PUBLIC_ENVENTORY_API_URL || "https://care-api.vitaway.org").replace(/\/$/, "");
}

type Envelope<T> = { success?: boolean; data?: T; message?: string; error?: string };

function unwrap<T>(payload: T | Envelope<T>): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    const envelope = payload as Envelope<T>;
    if (envelope.data !== undefined && envelope.success !== false) {
      return envelope.data;
    }
  }
  return payload as T;
}

function errorText(data: unknown, fallback: string): string {
  if (data && typeof data === "object") {
    const body = data as { message?: string; error?: string; data?: { message?: string } };
    return body.message || body.error || body.data?.message || fallback;
  }
  return fallback;
}

function axiosMessage(error: unknown, fallback: string): never {
  if (error instanceof APIError) throw error;
  if (axios.isAxiosError(error)) {
    throw new APIError(errorText(error.response?.data, fallback), error.response?.status, error.response?.data);
  }
  throw error;
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function asSession(payload: SessionPayload, phone: string | null): PlusSession | null {
  if (!payload.token || !payload.user?.id) return null;
  const user: PlusSessionUser = {
    id: payload.user.id,
    email: payload.user.email ?? null,
    displayName: payload.user.displayName ?? null,
    role: payload.user.role ?? null,
  };
  return {
    token: payload.token,
    mobileToken: typeof payload.mobile_token === "string" ? payload.mobile_token : "",
    user,
    roles: stringList(payload.roles).length ? stringList(payload.roles) : stringList(payload.user.roles),
    doors: stringList(payload.doors).length
      ? (stringList(payload.doors) as AppDoor[])
      : (stringList(payload.user.doors) as AppDoor[]),
    primaryDoor: (payload.primaryDoor ?? payload.user.primaryDoor ?? null) as AppDoor | null,
    phone,
  };
}

/**
 * Request a sign-in code. The API may include debugCode in local development;
 * that value is intentionally not returned to the UI.
 */
export async function requestPhoneOtp(phone: string): Promise<{ message: string }> {
  try {
    const response = await axios.post<OtpRequestResponse | Envelope<OtpRequestResponse>>(
      `${apiBase()}/api/v1/auth/otp/request`,
      { phone },
      { headers: { "Content-Type": "application/json", Accept: "application/json" }, timeout: 20_000 },
    );
    const data = unwrap(response.data);
    return {
      message: data?.message || "A sign-in code was sent. Enter it below to continue.",
    };
  } catch (error) {
    axiosMessage(error, "Could not send the sign-in code. Please try again.");
  }
}

export async function verifyPhoneOtp(phone: string, code: string): Promise<VerifyOtpResult> {
  try {
    const response = await axios.post<SessionPayload | Envelope<SessionPayload>>(
      `${apiBase()}/api/v1/auth/otp/verify`,
      { phone, code },
      { headers: { "Content-Type": "application/json", Accept: "application/json" }, timeout: 20_000 },
    );
    const data = unwrap(response.data);
    if (data?.staffSetupRequired === "second_factor" && data.challengeToken) {
      return {
        kind: "staff_setup",
        challengeToken: data.challengeToken,
        message: data.message || "Enter the second sign-in code sent to your phone.",
      };
    }
    const session = asSession(data, phone);
    if (!session) {
      throw new APIError("Sign-in did not return a session. Please try again.");
    }
    return { kind: "session", session };
  } catch (error) {
    axiosMessage(error, "Could not verify that code. Please try again.");
  }
}

export async function confirmStaffSecondFactor(
  challengeToken: string,
  code: string,
  phone: string | null,
): Promise<PlusSession> {
  try {
    const response = await axios.post<SessionPayload | Envelope<SessionPayload>>(
      `${apiBase()}/api/v1/auth/otp/second-factor`,
      { challengeToken, code },
      { headers: { "Content-Type": "application/json", Accept: "application/json" }, timeout: 20_000 },
    );
    const session = asSession(unwrap(response.data), phone);
    if (!session) {
      throw new APIError("Sign-in did not return a session. Please try again.");
    }
    return session;
  } catch (error) {
    axiosMessage(error, "Could not verify the second code. Please try again.");
  }
}

export async function logoutPlus(token: string): Promise<void> {
  try {
    await axios.post(
      `${apiBase()}/api/v1/auth/logout`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 10_000,
      },
    );
  } catch {
    // Local sign-out still proceeds if the server call fails.
  }
}

/**
 * Client for the mobile endpoints the Flutter app uses. They take the
 * DRF-style key as `Authorization: Token …` and answer without an envelope.
 */
import { apiBase } from "../auth-api";
import { loadPlusSession } from "../session";

export class MobileApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

function mobileToken(): string {
  return loadPlusSession()?.mobileToken ?? "";
}

export function apiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${apiBase()}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Absolute URL for media the API returns as a relative path. */
export function mediaUrl(value: string | null | undefined): string | null {
  const raw = (value ?? "").trim();
  if (!raw) return null;
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw;
  return apiUrl(raw);
}

export function errorMessage(body: unknown, fallback: string): string {
  if (typeof body === "string" && body.trim() && body.length < 300 && !body.trim().startsWith("<")) {
    return body.trim();
  }
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    for (const key of ["message", "detail", "error"]) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
    const data = record.data;
    if (data && typeof data === "object") {
      const message = (data as Record<string, unknown>).message;
      if (typeof message === "string" && message.trim()) return message.trim();
    }
    for (const value of Object.values(record)) {
      if (Array.isArray(value) && typeof value[0] === "string") return value[0];
    }
  }
  return fallback;
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  form?: FormData;
  query?: Record<string, string | number | boolean | null | undefined>;
  signal?: AbortSignal;
  /** Skip the Token header (public endpoints). */
  anonymous?: boolean;
};

export async function mobileRequest<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(apiUrl(path));
  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== null && value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  const headers: Record<string, string> = { Accept: "application/json" };
  const token = options.anonymous ? "" : mobileToken();
  if (token) headers.Authorization = `Token ${token}`;
  let body: BodyInit | undefined;
  if (options.form) {
    body = options.form;
  } else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }
  let response: Response;
  try {
    response = await fetch(url.toString(), {
      method: options.method ?? (body ? "POST" : "GET"),
      headers,
      body,
      signal: options.signal,
      cache: "no-store",
    });
  } catch (error) {
    if ((error as Error)?.name === "AbortError") throw error;
    throw new MobileApiError("You seem to be offline. Check your connection and try again.", 0, null);
  }
  const text = await response.text();
  let parsed: unknown = text;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  } else {
    parsed = null;
  }
  if (response.status === 401 && token) {
    unauthorizedHandler?.();
  }
  if (!response.ok) {
    throw new MobileApiError(
      errorMessage(parsed, `Something went wrong (${response.status}). Please try again.`),
      response.status,
      parsed,
    );
  }
  return parsed as T;
}

/** Fetch a protected file (PDF) and open it in a new tab. */
export async function openProtectedFile(path: string, filename: string): Promise<void> {
  const headers: Record<string, string> = {};
  const token = mobileToken();
  if (token) headers.Authorization = `Token ${token}`;
  const popup = typeof window !== "undefined" ? window.open("", "_blank") : null;
  try {
    const response = await fetch(apiUrl(path), { headers, cache: "no-store" });
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      let parsed: unknown = text;
      try {
        parsed = JSON.parse(text);
      } catch {
        /* keep text */
      }
      throw new MobileApiError(errorMessage(parsed, "Could not open the file."), response.status, parsed);
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    if (popup) {
      popup.location.href = url;
    } else {
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
    }
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch (error) {
    popup?.close();
    throw error;
  }
}

export function asList<T = Record<string, unknown>>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of ["results", "data", "items"]) {
      if (Array.isArray(record[key])) return record[key] as T[];
    }
  }
  return [];
}

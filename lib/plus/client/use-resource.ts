"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { mobileRequest } from "./api";

type Entry = { data?: unknown; error?: Error; at: number; inflight?: Promise<unknown> };

const cache = new Map<string, Entry>();
const listeners = new Map<string, Set<() => void>>();

function emit(key: string) {
  listeners.get(key)?.forEach((listener) => listener());
}

function subscribe(key: string, listener: () => void) {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(listener);
  return () => set?.delete(listener);
}

async function load(key: string, fetcher: () => Promise<unknown>): Promise<unknown> {
  const existing = cache.get(key);
  if (existing?.inflight) return existing.inflight;
  const inflight = fetcher()
    .then((data) => {
      cache.set(key, { data, at: Date.now() });
      emit(key);
      return data;
    })
    .catch((error: Error) => {
      cache.set(key, { data: existing?.data, error, at: Date.now() });
      emit(key);
      throw error;
    });
  cache.set(key, { ...(existing ?? { at: 0 }), inflight });
  emit(key);
  return inflight;
}

/** Re-fetch every cached resource whose key starts with one of the prefixes. */
export function invalidate(...prefixes: string[]): void {
  for (const key of Array.from(cache.keys())) {
    if (prefixes.some((prefix) => key.startsWith(prefix))) {
      const entry = cache.get(key);
      cache.set(key, { ...(entry ?? {}), at: 0 });
      emit(key);
    }
  }
}

export function clearResourceCache(): void {
  cache.clear();
}

export type Resource<T> = {
  data: T | undefined;
  error: Error | undefined;
  loading: boolean;
  reload: () => Promise<void>;
};

/**
 * Small stale-while-revalidate hook over the mobile API. `key` null skips.
 * Data stays cached across screens so tabs open instantly.
 */
export function useResource<T>(
  key: string | null,
  fetcher?: () => Promise<T>,
  options: { maxAgeMs?: number; pollMs?: number } = {},
): Resource<T> {
  const fetchRef = useRef(fetcher);
  fetchRef.current = fetcher;
  const maxAge = options.maxAgeMs ?? 30_000;

  const snapshot = useSyncExternalStore(
    useCallback((listener) => (key ? subscribe(key, listener) : () => undefined), [key]),
    () => (key ? cache.get(key) : undefined),
    () => undefined,
  );

  const run = useCallback(async () => {
    if (!key) return;
    const fn = fetchRef.current ?? (() => mobileRequest<T>(key));
    await load(key, fn).catch(() => undefined);
  }, [key]);

  useEffect(() => {
    if (!key) return;
    const entry = cache.get(key);
    if (!entry || (!entry.inflight && Date.now() - entry.at > maxAge)) {
      void run();
    }
  }, [key, run, maxAge, snapshot?.at]);

  useEffect(() => {
    if (!key || !options.pollMs) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void run();
    }, options.pollMs);
    return () => window.clearInterval(timer);
  }, [key, run, options.pollMs]);

  const [, force] = useState(0);
  const reload = useCallback(async () => {
    await run();
    force((n) => n + 1);
  }, [run]);

  return {
    data: snapshot?.data as T | undefined,
    error: snapshot?.error,
    loading: Boolean(key) && (snapshot?.data === undefined) && !snapshot?.error,
    reload,
  };
}

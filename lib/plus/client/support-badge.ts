"use client";

import { useEffect, useRef, useState } from "react";
import { apiBase } from "../auth-api";
import { loadPlusSession } from "../session";
import { asList, mobileRequest } from "./api";
import { invalidate } from "./use-resource";

const ROOMS_POLL_MS = 60_000;
const RECONNECT_S = [2, 4, 8, 15, 30, 60];

function totalUnread(payload: unknown): number {
  return asList<Record<string, unknown>>(payload).reduce((sum, room) => {
    const n = Number(room.unread ?? 0);
    return sum + (Number.isFinite(n) && n > 0 ? n : 0);
  }, 0);
}

/**
 * The Support tab dot (scafold_with_nav.dart supportBadgeNotifier): it lights
 * when a chat notice arrives on /ws/notifications and goes out when Support is
 * opened. With no push on the web, unread counts on the rooms list also light it.
 */
export function useSupportBadge(path: string): boolean {
  const [badge, setBadge] = useState(false);
  const onSupport = path === "/support" || path.startsWith("/chat/");
  const onSupportRef = useRef(onSupport);
  const seenUnread = useRef(0);
  const lastUnread = useRef(0);

  useEffect(() => {
    onSupportRef.current = onSupport;
    if (onSupport) {
      setBadge(false);
      seenUnread.current = lastUnread.current;
    }
  }, [onSupport]);

  // Rooms poll: unread that rose since Support was last open.
  useEffect(() => {
    let alive = true;
    const check = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const total = totalUnread(await mobileRequest("/api/rooms/"));
        if (!alive) return;
        lastUnread.current = total;
        if (onSupportRef.current || total <= seenUnread.current) {
          if (total < seenUnread.current) seenUnread.current = total;
          return;
        }
        setBadge(true);
      } catch {
        /* the dot is a hint; a failed poll changes nothing */
      }
    };
    void check();
    const timer = window.setInterval(() => void check(), ROOMS_POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") void check();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      alive = false;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  // Live notices, like LiveNotifications in Flutter.
  useEffect(() => {
    const token = loadPlusSession()?.mobileToken ?? "";
    if (!token || typeof WebSocket === "undefined") return;
    let closed = false;
    let attempt = 0;
    let retry: number | undefined;
    let ws: WebSocket | null = null;
    const connect = () => {
      if (closed) return;
      try {
        ws = new WebSocket(`${apiBase().replace(/^http/i, "ws")}/ws/notifications?token=${encodeURIComponent(token)}`);
      } catch {
        schedule();
        return;
      }
      ws.onopen = () => {
        attempt = 0;
      };
      ws.onmessage = (event) => {
        if (typeof event.data !== "string") return;
        try {
          const notice = JSON.parse(event.data) as Record<string, unknown>;
          invalidate("/notifications/");
          if (notice.type === "chat") {
            invalidate("chat:rooms");
            if (!onSupportRef.current) setBadge(true);
          }
        } catch {
          /* not a notice */
        }
      };
      ws.onclose = () => schedule();
      ws.onerror = () => ws?.close();
    };
    const schedule = () => {
      if (closed) return;
      window.clearTimeout(retry);
      retry = window.setTimeout(connect, RECONNECT_S[Math.min(attempt++, RECONNECT_S.length - 1)] * 1000);
    };
    connect();
    return () => {
      closed = true;
      window.clearTimeout(retry);
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
    };
  }, []);

  return badge && !onSupport;
}

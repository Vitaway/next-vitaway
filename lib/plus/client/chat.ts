"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MobileApiError, apiUrl, asList, errorMessage, mobileRequest } from "./api";
import { useResource } from "./use-resource";
import { apiBase } from "../auth-api";
import { loadPlusSession } from "../session";

/* ───────── Rooms (support_page.dart Room) ───────── */

export type RoomPerson = { first_name: string; last_name: string; email: string; profile_picture: string; type: string };
export type Room = {
  id: number;
  name: string;
  type: string;
  image: string;
  description: string;
  other: RoomPerson & { bio: string; mrn: string; speciality: string | null; age: number | null; height: number | null };
  members: RoomPerson[] | null;
  lastMessage: { content: string; preview: string; at: Date | null } | null;
  unread: number;
  careTeam: boolean;
};

const str = (v: unknown) => (v === null || v === undefined ? "" : String(v));
const num = (v: unknown) => (typeof v === "number" ? v : Number.parseInt(str(v), 10) || 0);
const rec = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});

function person(raw: unknown): RoomPerson {
  const j = rec(raw);
  return { first_name: str(j.first_name), last_name: str(j.last_name), email: str(j.email), profile_picture: str(j.profile_picture), type: str(j.type) };
}

export function parseRoom(raw: unknown): Room {
  const j = rec(raw);
  const o = rec(j.other_user_profile);
  const sp = o.speciality;
  const membersRaw = j.group_users_profiles ?? j.group_users_profile ?? j.users_profiles ?? j.members;
  const last = j.last_message && typeof j.last_message === "object" ? rec(j.last_message) : null;
  const stamp = last ? new Date(str(last.timestamp)) : null;
  return {
    id: num(j.id),
    name: str(j.name),
    type: str(j.type),
    image: str(j.image),
    description: str(j.description),
    other: {
      ...person(o),
      bio: str(o.bio),
      mrn: str(o.mrn),
      speciality: sp && typeof sp === "object" ? str(rec(sp).name) || null : sp !== null && sp !== undefined ? String(sp) : null,
      age: typeof o.age === "number" ? Math.round(o.age) : null,
      height: typeof o.height === "number" ? o.height : null,
    },
    members: Array.isArray(membersRaw) ? membersRaw.filter((m) => m && typeof m === "object").map(person) : null,
    lastMessage: last ? { content: str(last.content), preview: str(last.preview ?? last.content), at: stamp && !Number.isNaN(stamp.getTime()) ? stamp : null } : null,
    unread: num(j.unread),
    careTeam: j.care_team === true,
  };
}

export const roomDisplayName = (r: Room) => (r.type === "normal" || r.type === "peer" ? `${r.other.first_name} ${r.other.last_name}`.trim() : r.name);
export function roomPicture(r: Room): string {
  const raw = (r.type === "normal" ? r.other.profile_picture : r.image).trim();
  if (!raw || raw === "null" || raw === "undefined") return "";
  return raw.startsWith("http") ? raw : apiUrl(raw);
}

export function useRooms() {
  const resource = useResource<Room[]>("chat:rooms", async () => {
    try {
      const payload = await mobileRequest("/api/rooms/");
      return asList<Record<string, unknown>>(payload)
        .filter((e) => ["normal", "group", "community", "peer"].includes(str(e.type)))
        .map(parseRoom);
    } catch (error) {
      if (error instanceof MobileApiError && error.status === 401) throw error;
      throw new Error("We could not load your chats. Pull to try again.");
    }
  });
  return { ...resource, rooms: resource.data ?? [] };
}

export function useRoom(id: string) {
  return useResource<Room>(`chat:room:${id}`, async () => parseRoom(await mobileRequest(`/api/rooms/${encodeURIComponent(id)}/`)));
}

/* ───────── Directory ───────── */

export type Coach = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  profile: { profile_picture: string | null; speciality: string | null; bio: string | null; medicaldoc: string | null; [k: string]: unknown };
  raw: Record<string, unknown>;
};
export type CommunityPerson = { id: number; handle: string };
export type Directory = { coaches: Coach[]; dietitians: Coach[]; admins: Coach[]; community: CommunityPerson[]; assignedCoachId: number | null };

export function parseCoach(raw: unknown): Coach {
  const j = rec(raw);
  const p = rec(j.profile);
  const spRaw = p.speciality ?? j.speciality;
  const speciality = spRaw && typeof spRaw === "object" ? str(rec(spRaw).name) : spRaw ? String(spRaw) : null;
  return {
    id: num(j.id),
    email: str(j.email),
    first_name: str(j.first_name),
    last_name: str(j.last_name),
    user_type: str(j.user_type ?? j.type),
    profile: { ...p, profile_picture: (p.profile_picture ?? j.profile_picture ?? null) as string | null, speciality, bio: (p.bio ?? null) as string | null, medicaldoc: (p.medicaldoc ?? null) as string | null },
    raw: j,
  };
}

export function useDirectory() {
  const resource = useResource<Directory>("chat:directory", async () => {
    let body: Record<string, unknown>;
    try {
      body = rec(await mobileRequest("/api/v1/mobile/chat/directory"));
    } catch (error) {
      if (error instanceof MobileApiError && error.status === 401) throw error;
      throw new Error("Could not load coaches");
    }
    const people = (key: string) => (Array.isArray(body[key]) ? (body[key] as unknown[]).filter((x) => x && typeof x === "object").map(parseCoach) : []);
    const community = Array.isArray(body.community) ? (body.community as unknown[]).map((x) => ({ id: num(rec(x).id), handle: str(rec(x).handle) })) : [];
    let assignedCoachId: number | null = null;
    try {
      const mine = rec(await mobileRequest("/api/v1/mobile/coaching/my-coach"));
      const v = mine.coach_account_id;
      assignedCoachId = typeof v === "number" ? v : Number.parseInt(str(v), 10) || null;
    } catch {
      /* no assigned coach */
    }
    return { coaches: people("coaches"), dietitians: people("dietitians"), admins: people("admins"), community, assignedCoachId };
  });
  return resource;
}

export type CommunityReport = { id: number; roomName: string; preview: string };
export function useCommunityReports(enabled: boolean) {
  return useResource<CommunityReport[]>(enabled ? "chat:reports" : null, async () => {
    try {
      return asList<Record<string, unknown>>(await mobileRequest("/api/v1/mobile/chat/community-reports")).map((j) => {
        const room = j.room;
        const message = j.message;
        const content = message && typeof message === "object" ? str(rec(message).content) : "";
        return {
          id: num(j.id),
          roomName: room && typeof room === "object" ? str(rec(room).name ?? "Community") || "Community" : "Community",
          preview: content.trim() ? content : str(j.reason ?? "Reported post") || "Reported post",
        };
      });
    } catch {
      return [];
    }
  });
}

/** POST /api/create-room/ and return the room. */
export async function createRoom(members: Array<Record<string, unknown>>): Promise<Room> {
  return parseRoom(await mobileRequest("/api/create-room/", { method: "POST", body: members }));
}

/** room_time in support_page.dart */
export function roomTime(at: Date): string {
  const now = new Date();
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (same(at, now)) return `${at.getHours() % 12 || 12}:${String(at.getMinutes()).padStart(2, "0")} ${at.getHours() < 12 ? "AM" : "PM"}`;
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  if (same(at, y)) return "Yesterday";
  if ((now.getTime() - at.getTime()) / 86_400_000 < 7) return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][at.getDay()];
  return `${at.getDate()} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][at.getMonth()]}`;
}

/* ───────── Messages (chat_models.dart) ───────── */

export type ChatSender = { id: number; email: string; first_name: string; last_name: string; image: string; staff: boolean };
export type ChatQuote = { id: number; sender: string; body: string; deleted: boolean };
export type ChatReaction = { emoji: string; count: number; mine: boolean };
export type ChatAttachment = { kind: string; name: string; mime: string; url: string };
export type ChatMessage = {
  id: number;
  sender: ChatSender;
  content: string;
  legacyImage: string | null;
  at: Date;
  replyTo: ChatQuote | null;
  reactions: ChatReaction[];
  attachment: ChatAttachment | null;
  deleted: boolean;
  pending?: boolean;
  failed?: boolean;
};

export const senderName = (s: ChatSender) => `${s.first_name} ${s.last_name}`.trim() || s.email;
export const hasText = (m: ChatMessage) => m.content.trim().length > 0;
export function messagePreview(m: ChatMessage): string {
  if (m.deleted) return "Message deleted";
  if (hasText(m)) return m.content.trim();
  if (m.attachment) return m.attachment.kind === "image" ? "Photo" : m.attachment.name;
  if (m.legacyImage) return "Photo";
  return "";
}
export const stillDeletable = (m: ChatMessage) => !m.deleted && !m.pending && (Date.now() - m.at.getTime()) / 60_000 < 30;

function parseDate(v: unknown): Date {
  const raw = str(v);
  if (!raw) return new Date();
  const d = new Date(raw.includes("T") || raw.endsWith("Z") ? raw : `${raw.replace(" ", "T")}Z`);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

export function parseMessage(raw: unknown): ChatMessage {
  const j = rec(raw);
  const s = j.sender;
  const reply = j.reply_to;
  const att = j.attachment;
  const image = str(j.image).trim();
  return {
    id: num(j.id),
    sender:
      s && typeof s === "object"
        ? { id: num(rec(s).id), email: str(rec(s).email), first_name: str(rec(s).first_name), last_name: str(rec(s).last_name), image: str(rec(s).image), staff: rec(s).staff === true }
        : { id: num(j.user), email: str(s), first_name: str(s), last_name: "", image: "", staff: false },
    content: str(j.content),
    legacyImage: !image || image === "null" ? null : image,
    at: parseDate(j.at ?? j.timestamp),
    replyTo: reply && typeof reply === "object" ? { id: num(rec(reply).id), sender: str(rec(reply).sender), body: str(rec(reply).body), deleted: rec(reply).deleted === true } : null,
    reactions: Array.isArray(j.reactions) ? (j.reactions as unknown[]).map((r) => ({ emoji: str(rec(r).emoji), count: num(rec(r).count), mine: rec(r).mine === true })) : [],
    attachment: att && typeof att === "object" ? { kind: str(rec(att).kind ?? "file") || "file", name: str(rec(att).name ?? "File") || "File", mime: str(rec(att).mime), url: str(rec(att).url) } : null,
    deleted: j.deleted === true,
  };
}

const POLL_MS = 4000;
const SOCKET_POLL_MS = 20_000;
const RECONNECT_S = [1, 2, 4, 8, 15, 30];

/** wss://…/ws/chat/<room>/ on the API host. Browsers cannot set headers on a socket, so the key rides in ?token=. */
function chatSocketUrl(roomId: string, token: string): string {
  const base = apiBase().replace(/^http/i, "ws");
  return `${base}/ws/chat/${encodeURIComponent(roomId)}/?token=${encodeURIComponent(token)}`;
}

/**
 * ChatController: the room socket carries new messages, typing and online
 * status like Flutter; REST polling keeps working when the socket is down.
 */
export function useChatRoom(roomId: string) {
  const api = `/api/v1/mobile/chat/rooms/${encodeURIComponent(roomId)}`;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState<ChatMessage[]>([]);
  const outbox = useRef(new Map<number, { fields: Record<string, string>; file?: File }>());
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasMessages = useRef(false);
  const alive = useRef(true);
  const socket = useRef<WebSocket | null>(null);
  const [socketOpen, setSocketOpen] = useState(false);
  const [typingName, setTypingName] = useState<string | null>(null);
  const [otherOnline, setOtherOnline] = useState(false);
  const typingTimer = useRef<number | undefined>(undefined);
  const lastTyping = useRef(0);

  const refresh = useCallback(async () => {
    try {
      const list = await mobileRequest<unknown>(`${api}/messages`);
      if (!alive.current) return;
      const parsed = Array.isArray(list) ? list.map(parseMessage) : [];
      hasMessages.current = parsed.length > 0;
      setMessages(parsed);
      setPending((p) => p.filter((m) => m.failed));
      setConnected(true);
      setError(null);
    } catch (e) {
      if (!alive.current) return;
      setConnected(false);
      if (!hasMessages.current) {
        setError(e instanceof MobileApiError && e.status ? errorMessage(e.body, "This chat could not be loaded.") : "No connection. Pull down to try again.");
      }
    } finally {
      if (alive.current) setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    alive.current = true;
    void refresh();
    let last = Date.now();
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      const every = socket.current?.readyState === WebSocket.OPEN ? SOCKET_POLL_MS : POLL_MS;
      if (Date.now() - last < every - 100) return;
      last = Date.now();
      void refresh();
    }, POLL_MS);
    return () => {
      alive.current = false;
      window.clearInterval(timer);
    };
  }, [refresh]);

  // Live socket, reconnecting with the same back-off as Flutter.
  useEffect(() => {
    const token = loadPlusSession()?.mobileToken ?? "";
    if (!token || typeof WebSocket === "undefined") return;
    let closed = false;
    let attempt = 0;
    let retry: number | undefined;
    const connect = () => {
      if (closed) return;
      let ws: WebSocket;
      try {
        ws = new WebSocket(chatSocketUrl(roomId, token));
      } catch {
        schedule();
        return;
      }
      socket.current = ws;
      ws.onopen = () => {
        attempt = 0;
        setSocketOpen(true);
      };
      ws.onmessage = (event) => {
        if (typeof event.data !== "string") return;
        let data: unknown;
        try {
          data = JSON.parse(event.data);
        } catch {
          return;
        }
        if (Array.isArray(data)) {
          const parsed = data.map(parseMessage);
          hasMessages.current = parsed.length > 0;
          setMessages(parsed);
          setPending((p) => p.filter((m) => m.failed));
          setTypingName(null);
          setLoading(false);
          setError(null);
          setConnected(true);
          return;
        }
        if (!data || typeof data !== "object") return;
        const body = data as Record<string, unknown>;
        if (body.type === "typing") {
          setTypingName(`${String(body.first_name ?? "")} ${String(body.last_name ?? "")}`.trim());
          window.clearTimeout(typingTimer.current);
          typingTimer.current = window.setTimeout(() => setTypingName(null), 4000);
        } else if (body.type === "user_status") {
          setOtherOnline(body.status === "online");
        } else if (body.type === "error" && typeof body.error === "string") {
          setError(body.error);
        }
      };
      ws.onclose = () => {
        if (socket.current === ws) socket.current = null;
        setSocketOpen(false);
        schedule();
      };
      ws.onerror = () => ws.close();
    };
    const schedule = () => {
      if (closed) return;
      window.clearTimeout(retry);
      const seconds = RECONNECT_S[Math.min(attempt, RECONNECT_S.length - 1)];
      attempt++;
      retry = window.setTimeout(connect, seconds * 1000);
    };
    connect();
    return () => {
      closed = true;
      window.clearTimeout(retry);
      window.clearTimeout(typingTimer.current);
      const ws = socket.current;
      socket.current = null;
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
      setSocketOpen(false);
      setTypingName(null);
      setOtherOnline(false);
    };
  }, [roomId]);

  /** Tells the room you are typing, at most every 2 seconds, like Flutter. */
  const sendTyping = useCallback(() => {
    const ws = socket.current;
    const token = loadPlusSession()?.mobileToken ?? "";
    if (!ws || ws.readyState !== WebSocket.OPEN || !token) return;
    const now = Date.now();
    if (now - lastTyping.current < 2000) return;
    lastTyping.current = now;
    ws.send(JSON.stringify({ type: "typing", token }));
  }, []);

  const fail = (draft: ChatMessage, msg: string) => {
    setPending((p) => p.map((m) => (m.id === draft.id ? { ...m, pending: false, failed: true } : m)));
    setError(msg);
  };

  const post = async (draft: ChatMessage, fields: Record<string, string>, file?: File) => {
    outbox.current.set(draft.id, { fields, file });
    const form = new FormData();
    for (const [k, v] of Object.entries(fields)) form.append(k, v);
    if (file) form.append("file", file);
    try {
      const saved = await mobileRequest<unknown>(`${api}/messages`, { method: "POST", form });
      setPending((p) => p.filter((m) => m.id !== draft.id));
      outbox.current.delete(draft.id);
      if (saved && typeof saved === "object" && !Array.isArray(saved)) {
        const m = parseMessage(saved);
        if (m.id !== 0) setMessages((list) => (list.some((x) => x.id === m.id) ? list : [...list, m]));
      }
      void refresh();
    } catch (e) {
      if (e instanceof MobileApiError && e.status) {
        fail(draft, e.status === 413 ? "That file is too large. Files can be up to 10 MB." : errorMessage(e.body, "Your message was not sent."));
      } else {
        fail(draft, "Your message was not sent. Check your connection.");
      }
    }
  };

  const draft = (me: ChatSender, body: string, replyTo: ChatMessage | null): ChatMessage => ({
    id: -Date.now() * 1000 - Math.floor(Math.random() * 1000),
    sender: me,
    content: body,
    legacyImage: null,
    at: new Date(),
    replyTo: replyTo ? { id: replyTo.id, sender: senderName(replyTo.sender), body: messagePreview(replyTo), deleted: false } : null,
    reactions: [],
    attachment: null,
    deleted: false,
    pending: true,
  });

  const sendText = async (text: string, me: ChatSender, replyTo: ChatMessage | null) => {
    const body = text.trim();
    if (!body) return;
    const d = draft(me, body, replyTo);
    setPending((p) => [...p, d]);
    setError(null);
    await post(d, { body, ...(replyTo ? { reply_to: String(replyTo.id) } : {}) });
  };

  const sendFile = async (file: File, me: ChatSender, caption: string, replyTo: ChatMessage | null) => {
    const d = draft(me, caption.trim(), replyTo);
    setPending((p) => [...p, d]);
    setError(null);
    await post(d, { ...(caption.trim() ? { body: caption.trim() } : {}), ...(replyTo ? { reply_to: String(replyTo.id) } : {}) }, file);
  };

  const retry = async (m: ChatMessage) => {
    const job = outbox.current.get(m.id);
    if (!job) return;
    const again = { ...m, pending: true, failed: false };
    setPending((p) => p.map((x) => (x.id === m.id ? again : x)));
    setError(null);
    await post(again, job.fields, job.file);
  };

  const discard = (m: ChatMessage) => {
    setPending((p) => p.filter((x) => x.id !== m.id));
    outbox.current.delete(m.id);
  };

  const toggleReaction = (messageId: number, emoji: string) => {
    setMessages((list) =>
      list.map((m) => {
        if (m.id !== messageId) return m;
        const previous = m.reactions.filter((r) => r.mine);
        const next: ChatReaction[] = [];
        for (const r of m.reactions) {
          const count = r.mine ? r.count - 1 : r.count;
          if (count > 0) next.push({ emoji: r.emoji, count, mine: false });
        }
        const removing = previous.length > 0 && previous[0].emoji === emoji;
        if (!removing) {
          const i = next.findIndex((r) => r.emoji === emoji);
          if (i >= 0) next[i] = { emoji, count: next[i].count + 1, mine: true };
          else next.push({ emoji, count: 1, mine: true });
        }
        return { ...m, reactions: next };
      }),
    );
  };

  const call = async (fn: () => Promise<unknown>, fallback: string, reload = true): Promise<string | null> => {
    try {
      await fn();
      if (reload) void refresh();
      return null;
    } catch (e) {
      if (reload) void refresh();
      return e instanceof MobileApiError && e.status ? errorMessage(e.body, fallback) : fallback;
    }
  };

  return {
    messages: [...messages, ...pending],
    loading,
    connected: connected || socketOpen,
    live: socketOpen,
    typingName,
    otherOnline,
    sendTyping,
    error,
    clearError: () => setError(null),
    refresh,
    sendText,
    sendFile,
    retry,
    discard,
    react: (m: ChatMessage, emoji: string) => {
      toggleReaction(m.id, emoji);
      return call(() => mobileRequest(`${api}/messages/${m.id}/reactions`, { method: "POST", body: { emoji } }), "That reaction was not saved.");
    },
    report: (m: ChatMessage) => call(() => mobileRequest(`${api}/messages/${m.id}/report`, { method: "POST", body: { reason: "Reported" } }), "That report was not sent.", false),
    block: (accountId: number) => call(() => mobileRequest("/api/v1/mobile/chat/blocks", { method: "POST", body: { account_id: accountId } }), "That person was not blocked.", false),
    remove: (m: ChatMessage) => call(() => mobileRequest(`${api}/messages/${m.id}`, { method: "DELETE" }), "That message was not deleted."),
    attachmentUrl: (m: ChatMessage) => (m.attachment ? apiUrl(m.attachment.url) : ""),
  };
}

/* ───────── Guidelines + community handle ───────── */

const GUIDELINES_KEY = "vitaway.plus.chatGuidelinesAccepted";
export const guidelinesAccepted = () => typeof window !== "undefined" && window.localStorage.getItem(GUIDELINES_KEY) === "true";
export const acceptGuidelines = () => window.localStorage.setItem(GUIDELINES_KEY, "true");
export const HANDLE_PATTERN = /^[A-Za-z0-9_]{3,20}$/;

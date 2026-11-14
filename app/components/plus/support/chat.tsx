"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, Camera, Copy, DocumentText, Flag, Forbidden, Gallery, GallerySlash, Message, Paperclip2, Refresh, Slash, Trash, Warning2 } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { useMe } from "@/lib/plus/client/data";
import { fetchUrlBlob, mediaUrl } from "@/lib/plus/client/api";
import { hasText, messagePreview, roomPicture, senderName, stillDeletable, useChatRoom, useRoom, type ChatMessage, type ChatSender, type Room } from "@/lib/plus/client/chat";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { useBack } from "@/lib/plus/nav";
import { ActionButton, Avatar, CircleButton, DotSpinner, Modal, useFeedback } from "../ui/vita";
import { ChatSafetyBanner, useEmergencyDial } from "../safety/safety-banners";
import { matchSafetyWords } from "@/lib/plus/safety-words";

const NAVY = "var(--vc-navy)";
const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;
const ORANGE = "var(--vc-action)";
const MINE_BUBBLE = "#00262E";
const LINE = "var(--vc-line)";
const QUICK = ["👍", "❤️", "😂", "😮", "😢", "🙏"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
const hma = (d: Date) => `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")} ${d.getHours() < 12 ? "AM" : "PM"}`;

export function readStashedRoom(id: string): Room | null {
  try {
    const raw = sessionStorage.getItem(`vitaway.plus.room.${id}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Room;
    return { ...parsed, lastMessage: null };
  } catch {
    return null;
  }
}

/** Fetches a protected image with the Token header and shows it. */
function AuthImage({ url, mine, size = 220, contain = false, onClick }: { url: string; mine: boolean; size?: number; contain?: boolean; onClick?: () => void }) {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let revoke: string | null = null;
    let alive = true;
    fetchUrlBlob(url)
      .then((blob) => {
        if (!alive) return;
        revoke = URL.createObjectURL(blob);
        setSrc(revoke);
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [url]);
  if (failed) return <BrokenImage mine={mine} />;
  if (!src)
    return (
      <div style={{ width: size, height: size, background: mine ? "rgba(255,255,255,0.1)" : "var(--vc-canvas)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6 }}>
        <DotSpinner color={mine ? "#fff" : NAVY} />
      </div>
    );
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" onClick={onClick} style={contain ? { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" } : { width: size, height: size, objectFit: "cover", borderRadius: 6, display: "block", cursor: onClick ? "pointer" : undefined }} />;
}

function BrokenImage({ mine }: { mine: boolean }) {
  return (
    <div style={{ width: 220, height: 120, background: mine ? "rgba(255,255,255,0.1)" : "var(--vc-canvas)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <GallerySlash size={26} color={mine ? "rgba(255,255,255,0.5)" : navyA(0.5)} />
    </div>
  );
}

function FileCard({ name, mine, onClick }: { name: string; mine: boolean; onClick?: () => void }) {
  const fg = mine ? "#fff" : NAVY;
  const ext = name.includes(".") ? name.split(".").pop()!.toUpperCase() : "FILE";
  return (
    <div onClick={onClick} style={{ minWidth: 200, padding: 10, borderRadius: 6, background: mine ? "rgba(255,255,255,0.1)" : "var(--vc-surface)", border: mine ? undefined : `1px solid ${LINE}`, display: "flex", alignItems: "center", cursor: onClick ? "pointer" : undefined }}>
      <span style={{ width: 36, height: 36, borderRadius: 6, background: mine ? "rgba(255,255,255,0.16)" : "var(--vc-surface)", border: mine ? undefined : `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
        <DocumentText size={18} color={fg} />
      </span>
      <span style={{ marginLeft: 10, minWidth: 0 }}>
        <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontSize: 13, fontWeight: 700, color: fg }}>{name}</span>
        <span style={{ display: "block", marginTop: 2, fontSize: 11, color: mine ? "rgba(255,255,255,0.55)" : navyA(0.55) }}>{onClick ? `${ext} · Tap to open` : ext}</span>
      </span>
    </div>
  );
}

function SheetRow({ icon, label, danger = false, onClick }: { icon: React.ReactNode; label: string; danger?: boolean; onClick: () => void }) {
  const color = danger ? "#9F3A2F" : NAVY;
  return (
    <button type="button" onClick={onClick} style={{ width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "10px 12px", borderRadius: 6, textAlign: "left" }}>
      <span style={{ width: 36, height: 36, borderRadius: 6, background: danger ? "var(--vc-danger-soft)" : "var(--vc-canvas)", display: "flex", alignItems: "center", justifyContent: "center", color }}>{icon}</span>
      <span style={{ fontSize: 15, fontWeight: 700, color }}>{label}</span>
    </button>
  );
}

function DaySeparator({ day }: { day: Date }) {
  const now = new Date();
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  const label = sameDay(day, now) ? "Today" : sameDay(day, y) ? "Yesterday" : day.getFullYear() === now.getFullYear() ? `${DAYS[day.getDay()]} ${day.getDate()} ${MONTHS[day.getMonth()]}` : `${day.getDate()} ${MONTHS[day.getMonth()]} ${day.getFullYear()}`;
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "14px 20px" }}>
      <span style={{ flex: 1, height: 1, background: LINE }} />
      <span style={{ padding: "0 10px", fontSize: 11, fontWeight: 700, color: navyA(0.5) }}>{label}</span>
      <span style={{ flex: 1, height: 1, background: LINE }} />
    </div>
  );
}

/** Long press (touch), right click, swipe right to reply, double tap to like. */
function useGestures({ onLongPress, onTap, onDoubleTap, onSwipeReply, swipeEnabled }: { onLongPress: () => void; onTap?: () => void; onDoubleTap?: () => void; onSwipeReply: () => void; swipeEnabled: boolean }) {
  const [dx, setDx] = useState(0);
  const start = useRef<{ x: number; y: number; t: number } | null>(null);
  const timer = useRef<number | null>(null);
  const lastTap = useRef(0);
  const longFired = useRef(false);
  const clear = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  };
  return {
    dx,
    handlers: {
      onPointerDown: (e: React.PointerEvent) => {
        start.current = { x: e.clientX, y: e.clientY, t: Date.now() };
        longFired.current = false;
        clear();
        timer.current = window.setTimeout(() => {
          longFired.current = true;
          setDx(0);
          onLongPress();
        }, 480);
      },
      onPointerMove: (e: React.PointerEvent) => {
        if (!start.current) return;
        const mx = e.clientX - start.current.x;
        const my = e.clientY - start.current.y;
        if (Math.abs(mx) > 8 || Math.abs(my) > 8) clear();
        if (swipeEnabled && mx > 0 && Math.abs(my) < 30) setDx(Math.min(mx, 72));
      },
      onPointerUp: () => {
        clear();
        const s = start.current;
        start.current = null;
        if (dx >= 56) onSwipeReply();
        const moved = dx > 8;
        setDx(0);
        if (longFired.current || moved || !s) return;
        const now = Date.now();
        if (onDoubleTap && now - lastTap.current < 300) {
          lastTap.current = 0;
          onDoubleTap();
          return;
        }
        lastTap.current = now;
        onTap?.();
      },
      onPointerCancel: () => {
        clear();
        start.current = null;
        setDx(0);
      },
      onContextMenu: (e: React.MouseEvent) => {
        e.preventDefault();
        clear();
        onLongPress();
      },
    },
  };
}

function MessageRow({
  message,
  mine,
  showName,
  showAvatar,
  tight,
  flashing,
  showLike,
  attachmentUrl,
  onLongPress,
  onTap,
  onDoubleTap,
  onSwipeReply,
  onOpenQuote,
  onOpenAttachment,
  onToggleReaction,
}: {
  message: ChatMessage;
  mine: boolean;
  showName: boolean;
  showAvatar: boolean;
  tight: boolean;
  flashing: boolean;
  showLike: boolean;
  attachmentUrl: string;
  onLongPress: () => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onSwipeReply: () => void;
  onOpenQuote: (id: number) => void;
  onOpenAttachment: () => void;
  onToggleReaction: (emoji: string) => void;
}) {
  const { dx, handlers } = useGestures({ onLongPress, onTap, onDoubleTap, onSwipeReply, swipeEnabled: !message.deleted && !message.pending });
  const fg = mine ? "#fff" : "var(--vc-ink)";
  const att = message.attachment;
  const sendingFile = Boolean(message.pending && !att && !hasText(message));
  let bubble: React.ReactNode;
  if (message.deleted) {
    bubble = (
      <div style={{ padding: "9px 12px", borderRadius: 8, border: `1px solid ${LINE}`, background: "color-mix(in srgb, var(--vc-surface) 60%, transparent)", display: "flex", alignItems: "center", gap: 6 }}>
        <Forbidden size={14} color={navyA(0.4)} />
        <span style={{ fontSize: 13, fontStyle: "italic", color: navyA(0.5) }}>Message deleted</span>
      </div>
    );
  } else {
    bubble = (
      <div style={{ background: mine ? MINE_BUBBLE : "var(--vc-surface-muted)", borderRadius: 6, border: message.failed ? "1.2px solid var(--vc-danger)" : undefined, padding: 4 }}>
        {message.replyTo ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (!message.replyTo!.deleted) onOpenQuote(message.replyTo!.id);
            }}
            style={{ marginBottom: 4, padding: "6px 10px", borderRadius: 6, background: mine ? "rgba(255,255,255,0.1)" : "var(--vc-surface)", borderLeft: `3px solid ${ORANGE}`, cursor: "pointer" }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: mine ? "#fff" : ORANGE, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{message.replyTo.sender}</div>
            <div style={{ marginTop: 2, fontSize: 12, lineHeight: 1.3, fontStyle: message.replyTo.deleted ? "italic" : "normal", color: mine ? "rgba(255,255,255,0.7)" : navyA(0.7), display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{message.replyTo.deleted ? "Message deleted" : message.replyTo.body}</div>
          </div>
        ) : null}
        {att && att.kind === "image" ? <AuthImage url={attachmentUrl} mine={mine} onClick={onOpenAttachment} /> : null}
        {att && att.kind !== "image" ? <FileCard name={att.name} mine={mine} onClick={onOpenAttachment} /> : null}
        {!att && message.legacyImage ? <LegacyImage path={message.legacyImage} mine={mine} /> : null}
        {hasText(message) || sendingFile ? (
          <div style={{ padding: "4px 8px", fontSize: 15, lineHeight: 1.4, fontWeight: 500, fontStyle: sendingFile ? "italic" : "normal", color: fg, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{sendingFile ? "Sending file…" : message.content}</div>
        ) : null}
      </div>
    );
  }
  const label = message.failed ? "Not sent · Tap to retry" : message.pending ? "Sending…" : hma(message.at);
  return (
    <div style={{ padding: `${tight ? 2 : 8}px 14px 2px`, background: flashing ? "color-mix(in srgb, var(--vc-action) 10%, transparent)" : "transparent", transition: "background 500ms", display: "flex", justifyContent: mine ? "flex-end" : "flex-start", alignItems: "flex-end" }} data-mid={message.id}>
      {!mine ? <span style={{ width: 30, marginRight: 4, flex: "none" }}>{showAvatar ? <Avatar url={message.sender.image} size={26} /> : null}</span> : null}
      <div style={{ maxWidth: "74%", display: "flex", flexDirection: "column", alignItems: mine ? "flex-end" : "flex-start", minWidth: 0 }}>
        {showName ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 0 4px 2px", maxWidth: "100%" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: navyA(0.7), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{senderName(message.sender)}</span>
            {message.sender.staff ? (
              <span style={{ padding: "2px 6px", borderRadius: 4, background: "var(--vc-tile-mint)", display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: NAVY }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/plus-assets/logo.png" alt="" height={10} style={{ height: 10 }} />
                Coach
              </span>
            ) : null}
          </div>
        ) : null}
        <div {...handlers} style={{ transform: dx ? `translateX(${dx}px)` : undefined, transition: dx ? undefined : "transform 160ms", touchAction: "pan-y", userSelect: "none", WebkitUserSelect: "none", cursor: "default", maxWidth: "100%" }}>
          {bubble}
        </div>
        {showLike && !message.deleted && !message.pending ? (
          <button type="button" onClick={() => onToggleReaction("❤️")} style={{ padding: "6px 8px", fontSize: 14, fontWeight: 600, color: "var(--vc-teal-ink)" }}>
            {message.reactions.some((r) => r.mine && r.emoji === "❤️") ? "Liked" : "Like"}
          </button>
        ) : null}
        {message.reactions.length && !message.deleted ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "0 4px", marginTop: -6 }}>
            {message.reactions.map((r) => (
              <button key={r.emoji} type="button" onClick={() => onToggleReaction(r.emoji)} style={{ padding: "3px 7px", borderRadius: 999, background: r.mine ? "#E7F3F5" : "var(--vc-surface)", border: `1px solid ${r.mine ? "color-mix(in srgb, var(--vc-teal-ink) 40%, transparent)" : LINE}`, boxShadow: "0 1px 2px rgba(0,0,0,0.06)", display: "inline-flex", alignItems: "center", gap: 3 }}>
                <span style={{ fontSize: 13 }}>{r.emoji}</span>
                {r.count > 1 ? <span style={{ fontSize: 11, fontWeight: 700, color: r.mine ? "var(--vc-teal-ink)" : "var(--vc-body)" }}>{r.count}</span> : null}
              </button>
            ))}
          </div>
        ) : null}
        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 2px 0" }}>
          <span style={{ fontSize: 11, fontWeight: message.failed ? 700 : 500, color: message.failed ? "var(--vc-danger)" : "var(--vc-faint)" }}>{label}</span>
          {mine ? (
            message.failed ? (
              <Warning2 size={13} color="var(--vc-danger)" />
            ) : message.pending ? (
              <span className="vita-mini-ring" />
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--vc-faint)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12.5l4.5 4.5L15 8.5M9.5 16.5l1 1L22 6" /></svg>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}

function LegacyImage({ path, mine }: { path: string; mine: boolean }) {
  const [failed, setFailed] = useState(false);
  const url = mediaUrl(path) ?? path;
  if (failed) return <BrokenImage mine={mine} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" onError={() => setFailed(true)} style={{ width: 220, height: 220, objectFit: "cover", borderRadius: 6, display: "block" }} />;
}

export function ChatScreen({ roomId }: { roomId: string }) {
  const t = useT();
  const { push } = usePlusPaths();
  const goBack = useBack("/support");
  const { toast, confirm } = useFeedback();
  const { user } = useMe();
  const roomRes = useRoom(roomId);
  const [stashed, setStashed] = useState<Room | null>(null);
  useEffect(() => setStashed(readStashedRoom(roomId)), [roomId]);
  const room = roomRes.data ?? stashed;
  const chat = useChatRoom(roomId);
  const [text, setText] = useState("");
  const [replying, setReplying] = useState<ChatMessage | null>(null);
  const [flash, setFlash] = useState<number | null>(null);
  const [sendingFile, setSendingFile] = useState(false);
  const [sheet, setSheet] = useState<null | { kind: "attach" } | { kind: "actions"; message: ChatMessage } | { kind: "failed"; message: ChatMessage } | { kind: "file"; file: File; image: boolean; preview: string | null; caption: string } | { kind: "safety" }>(null);
  const [viewer, setViewer] = useState<{ url: string; name: string } | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const seen = useRef(0);

  const type = room?.type ?? null;
  const isGroup = type === "group" || type === "community";
  const isStaff = user?.user_type === "coach" || user?.user_type === "admin";
  const title = room ? (isGroup ? room.name : `${room.other.first_name} ${room.other.last_name}`.trim()) : "";
  const avatarUrl = room ? (type === "normal" || !type ? roomPicture({ ...room, type: "normal" }) : roomPicture(room)) : "";

  const dial = useEmergencyDial();
  const me = (): ChatSender => ({ id: user?.id ?? 0, email: user?.email ?? "", first_name: user?.first_name ?? "", last_name: user?.last_name ?? "", image: user?.profile?.profile_picture ?? "", staff: (user?.user_type ?? "normal") !== "normal" });
  const isMine = (m: ChatMessage) => {
    if (m.pending) return true;
    if (user?.id && m.sender.id !== 0) return m.sender.id === user.id;
    return m.sender.email === user?.email;
  };

  // Toast errors once there are messages on screen (as _onChat).
  useEffect(() => {
    if (chat.error && chat.messages.length) {
      toast(chat.error, { error: true });
      chat.clearError();
    }
  }, [chat.error]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    const el = scroller.current;
    const count = chat.messages.length;
    if (el && count > seen.current) {
      const last = chat.messages[count - 1];
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 160;
      if (seen.current === 0 || nearBottom || (last && isMine(last))) el.scrollTo({ top: el.scrollHeight, behavior: seen.current === 0 ? "auto" : "smooth" });
    }
    seen.current = count;
  });

  const send = async () => {
    const body = text.trim();
    if (!body) return;
    const replyTo = replying;
    setText("");
    setReplying(null);
    // W6: warning-sign words (built-in list, pending CA-02). Members only. The message is still sent unchanged;
    // the sheet points to the emergency screen. The care team sees a "Support needed" row on Today (never Urgent).
    if (!isStaff && matchSafetyWords(body).matched) setSheet({ kind: "safety" });
    await chat.sendText(body, me(), replyTo);
  };

  const reply = (m: ChatMessage) => {
    if (m.deleted || m.pending) return;
    setReplying(m);
    input.current?.focus();
  };

  const jumpTo = (id: number) => {
    const el = scroller.current?.querySelector(`[data-mid="${id}"]`);
    if (!el) return toast("That message is further up the chat.");
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setFlash(id);
    window.setTimeout(() => setFlash((f) => (f === id ? null : f)), 1400);
  };

  const pickFile = (file: File | undefined, image: boolean) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return toast("That file is too large. Files can be up to 10 MB.", { error: true });
    setSheet({ kind: "file", file, image, preview: image ? URL.createObjectURL(file) : null, caption: text.trim() });
  };

  const sendPicked = async () => {
    if (sheet?.kind !== "file") return;
    const { file, caption, preview } = sheet;
    if (preview) URL.revokeObjectURL(preview);
    setSheet(null);
    const replyTo = replying;
    setSendingFile(true);
    setReplying(null);
    setText("");
    await chat.sendFile(file, me(), caption, replyTo);
    setSendingFile(false);
  };

  const runAction = async (action: string, m: ChatMessage) => {
    setSheet(null);
    if (action.startsWith("react:")) {
      const err = await chat.react(m, action.slice(6));
      if (err) toast(err, { error: true });
    } else if (action === "reply") reply(m);
    else if (action === "copy") {
      await navigator.clipboard?.writeText(m.content).catch(() => undefined);
      toast("Message copied");
    } else if (action === "report") {
      const err = await chat.report(m);
      toast(err ?? "Reported. A coach will review it.", { error: Boolean(err) });
    } else if (action === "block") {
      const ok = await confirm({ title: "Block this person?", message: "You will not get new messages from them, and they will not get new messages from you.", confirmLabel: "Block", destructive: true });
      if (!ok) return;
      const err = await chat.block(m.sender.id);
      if (err) toast(err, { error: true });
      else goBack();
    } else if (action === "delete" || action === "remove") {
      const ok = await confirm({ title: "Delete this message?", message: "It is removed for everyone in this chat, including the care team.", confirmLabel: "Delete", destructive: true });
      if (!ok) return;
      const err = await chat.remove(m);
      if (err) toast(err, { error: true });
    }
  };

  const openAttachment = async (m: ChatMessage) => {
    const att = m.attachment;
    if (!att) return;
    const url = chat.attachmentUrl(m);
    if (att.kind === "image") return setViewer({ url, name: att.name });
    toast(`Opening ${att.name}…`);
    try {
      const blob = await fetchUrlBlob(url);
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = att.name.replace(/[^\w.\- ]/g, "_");
      a.click();
      window.setTimeout(() => URL.revokeObjectURL(href), 30_000);
    } catch {
      toast("That file could not be opened.", { error: true });
    }
  };

  // Presence, as message.dart _Presence: typing, connecting, group, online.
  let presence: { label: string; dot: string } | null = null;
  if (chat.typingName !== null) presence = { label: "typing…", dot: "#fff" };
  else if (!chat.connected) presence = { label: "Connecting…", dot: "rgba(255,255,255,0.45)" };
  else if (isGroup) presence = { label: "Group chat", dot: "rgba(255,255,255,0.45)" };
  else if (chat.otherOnline) presence = { label: "Online", dot: "#2FBF71" };

  const rows: React.ReactNode[] = [];
  const list = chat.messages;
  for (let i = 0; i < list.length; i++) {
    const m = list[i];
    const prev = i > 0 ? list[i - 1] : null;
    const next = i + 1 < list.length ? list[i + 1] : null;
    if (!prev || !sameDay(prev.at, m.at)) rows.push(<DaySeparator key={`d-${m.id}`} day={m.at} />);
    const startsGroup = !prev || !sameDay(prev.at, m.at) || prev.sender.id !== m.sender.id || isMine(prev) !== isMine(m) || (m.at.getTime() - prev.at.getTime()) / 60_000 > 5;
    const endsGroup = !next || !sameDay(next.at, m.at) || next.sender.id !== m.sender.id || isMine(next) !== isMine(m) || (next.at.getTime() - m.at.getTime()) / 60_000 > 5;
    const mine = isMine(m);
    rows.push(
      <MessageRow
        key={m.id}
        message={m}
        mine={mine}
        showName={startsGroup && !mine && (isGroup || m.sender.staff)}
        showAvatar={endsGroup && !mine}
        tight={!startsGroup}
        flashing={flash === m.id}
        showLike={type === "community"}
        attachmentUrl={chat.attachmentUrl(m)}
        onLongPress={() => {
          if (m.pending) return;
          setSheet(m.failed ? { kind: "failed", message: m } : { kind: "actions", message: m });
        }}
        onTap={m.failed ? () => setSheet({ kind: "failed", message: m }) : undefined}
        onDoubleTap={
          m.pending || m.failed || m.deleted
            ? undefined
            : async () => {
                const err = await chat.react(m, "❤️");
                if (err) toast(err, { error: true });
              }
        }
        onSwipeReply={() => reply(m)}
        onOpenQuote={jumpTo}
        onOpenAttachment={() => void openAttachment(m)}
        onToggleReaction={async (emoji) => {
          const err = await chat.react(m, emoji);
          if (err) toast(err, { error: true });
        }}
      />,
    );
  }

  const canSend = text.trim().length > 0;
  const actionMessage = sheet?.kind === "actions" ? sheet.message : null;
  const mineAction = actionMessage ? isMine(actionMessage) : false;

  return (
    <div className="vita-page" style={{ background: "var(--vc-surface)", height: "100dvh", display: "flex", flexDirection: "column" }}>
      <header className="vita-appbar" style={{ flex: "none" }}>
        <div style={{ height: 64, display: "flex", alignItems: "center", padding: "0 12px 0 8px", gap: 10, position: "relative" }}>
          <CircleButton label="Back" onClick={goBack}>
            <ArrowLeft size={18} color="currentColor" />
          </CircleButton>
          <button type="button" onClick={() => room && push(`/chat/${roomId}/info`)} style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 10, textAlign: "left", color: "#fff" }}>
            <Avatar url={avatarUrl} size={38} />
            <span style={{ minWidth: 0, flex: 1 }}>
              <span style={{ display: "block", fontSize: 15, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title || "Chat"}</span>
              {presence ? (
                <span style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: presence.dot }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{presence.label}</span>
                </span>
              ) : null}
            </span>
          </button>
        </div>
      </header>
      {(user?.user_type ?? "normal") === "normal" ? <ChatSafetyBanner /> : null}
      {!chat.connected && !chat.loading && chat.messages.length ? (
        <div style={{ background: "var(--vc-tile-peach)", padding: "8px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <DotSpinner small color={NAVY} />
          <span style={{ fontSize: 12, fontWeight: 600, color: NAVY }}>Reconnecting. New messages will appear shortly.</span>
        </div>
      ) : null}
      <div ref={scroller} style={{ flex: 1, overflowY: "auto", padding: "12px 0", overscrollBehavior: "contain" }}>
        {chat.loading && !chat.messages.length ? (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: NAVY }}>
            <DotSpinner color={NAVY} />
            <span style={{ fontSize: 13, fontWeight: 600, color: navyA(0.6) }}>Loading messages</span>
          </div>
        ) : !chat.messages.length ? (
          <div style={{ padding: "80px 32px 24px", textAlign: "center" }}>
            {chat.error ? <Refresh size={36} color={navyA(0.3)} /> : <Message size={36} color={navyA(0.3)} />}
            <div style={{ marginTop: 12, fontSize: 16, fontWeight: 800, color: NAVY }}>{chat.error ?? "No messages yet"}</div>
            <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.4, color: navyA(0.55) }}>{chat.error ? "Pull down to try again." : "Say hello. Your care team will answer here."}</div>
            {chat.error ? (
              <div style={{ marginTop: 16 }}>
                <ActionButton small tone="white" label={t("retry")} onClick={() => void chat.refresh()} icon={<Refresh size={14} color="currentColor" />} />
              </div>
            ) : null}
          </div>
        ) : (
          rows
        )}
      </div>
      {chat.typingName !== null ? (
        <div style={{ padding: "0 20px 6px 48px", display: "flex", alignItems: "center", gap: 8, flex: "none" }} aria-live="polite">
          <span style={{ padding: "8px 10px", borderRadius: 8, background: "var(--vc-surface)", border: `1px solid ${LINE}`, display: "inline-flex" }}>
            <DotSpinner small color={navyA(0.55)} />
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: navyA(0.5), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{chat.typingName ? `${chat.typingName} is typing…` : "Typing…"}</span>
        </div>
      ) : null}
      <div style={{ background: "var(--vc-surface)", borderTop: `1px solid ${LINE}`, paddingBottom: "env(safe-area-inset-bottom)", flex: "none" }}>
        {replying ? (
          <div style={{ margin: "10px 12px 0", padding: "8px 4px 8px 10px", borderRadius: 6, background: "var(--vc-canvas)", borderLeft: `3px solid ${ORANGE}`, display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" /></svg>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 12, fontWeight: 800, color: NAVY }}>{`Replying to ${isMine(replying) ? "yourself" : senderName(replying.sender)}`}</span>
              <span style={{ display: "block", fontSize: 12, color: navyA(0.6), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{messagePreview(replying)}</span>
            </span>
            <button type="button" aria-label="Cancel reply" onClick={() => setReplying(null)} style={{ padding: 8, color: NAVY }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
        ) : null}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, padding: "10px 12px" }}>
          <button type="button" aria-label="Add an attachment" disabled={sendingFile} onClick={() => setSheet({ kind: "attach" })} style={{ width: 44, height: 44, borderRadius: 6, border: `1px solid ${LINE}`, background: "var(--vc-surface)", display: "flex", alignItems: "center", justifyContent: "center", color: NAVY, flex: "none" }}>
            {sendingFile ? <DotSpinner small color={NAVY} /> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>}
          </button>
          <textarea
            ref={input}
            rows={1}
            value={text}
            placeholder={t("type_message")}
            onChange={(e) => {
              setText(e.target.value);
              if (e.target.value.trim()) chat.sendTyping();
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && window.matchMedia("(pointer: fine)").matches) {
                e.preventDefault();
                void send();
              }
            }}
            style={{ flex: 1, minWidth: 0, resize: "none", padding: "12px 14px", borderRadius: 6, border: `1px solid ${LINE}`, background: "var(--vc-surface)", fontSize: 15, fontWeight: 500, color: NAVY, outline: "none", fontFamily: "inherit", lineHeight: 1.35, maxHeight: 120 }}
          />
          <button type="button" aria-label="Send" disabled={!canSend} onClick={() => void send()} style={{ width: 44, height: 44, borderRadius: 6, background: canSend ? ORANGE : "color-mix(in srgb, var(--vc-action) 35%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", transition: "background 180ms" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" style={{ transform: "rotate(-28deg) translateX(2px)" }}><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
          </button>
        </div>
      </div>

      <input ref={photoInput} type="file" accept="image/*" hidden onChange={(e) => { pickFile(e.target.files?.[0], true); e.target.value = ""; }} />
      <input ref={cameraInput} type="file" accept="image/*" capture="environment" hidden onChange={(e) => { pickFile(e.target.files?.[0], true); e.target.value = ""; }} />
      <input ref={fileInput} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt" hidden onChange={(e) => { pickFile(e.target.files?.[0], false); e.target.value = ""; }} />

      <Modal open={sheet?.kind === "attach"} title="Add an attachment" onClose={() => setSheet(null)}>
        <SheetRow icon={<Gallery size={18} color="currentColor" />} label="Photo from library" onClick={() => { setSheet(null); photoInput.current?.click(); }} />
        <SheetRow icon={<Camera size={18} color="currentColor" />} label="Take a photo" onClick={() => { setSheet(null); cameraInput.current?.click(); }} />
        <SheetRow icon={<Paperclip2 size={18} color="currentColor" />} label="File (PDF, Word, Excel, text)" onClick={() => { setSheet(null); fileInput.current?.click(); }} />
      </Modal>

      <Modal open={sheet?.kind === "actions"} title="Message" onClose={() => setSheet(null)}>
        {actionMessage ? (
          <>
            {!actionMessage.deleted ? (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 12px 10px" }}>
                {QUICK.map((emoji) => {
                  const selected = actionMessage.reactions.some((r) => r.mine && r.emoji === emoji);
                  return (
                    <button key={emoji} type="button" onClick={() => void runAction(`react:${emoji}`, actionMessage)} style={{ width: 44, height: 44, borderRadius: 8, background: selected ? "color-mix(in srgb, var(--vc-action) 12%, transparent)" : "var(--vc-canvas)", border: `1px solid ${selected ? ORANGE : "transparent"}`, fontSize: 22 }}>
                      {emoji}
                    </button>
                  );
                })}
              </div>
            ) : null}
            {!actionMessage.deleted ? <SheetRow icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" /></svg>} label="Reply" onClick={() => void runAction("reply", actionMessage)} /> : null}
            {hasText(actionMessage) ? <SheetRow icon={<Copy size={18} color="currentColor" />} label="Copy text" onClick={() => void runAction("copy", actionMessage)} /> : null}
            {!mineAction && !actionMessage.deleted ? <SheetRow icon={<Flag size={18} color="currentColor" />} label="Report" onClick={() => void runAction("report", actionMessage)} /> : null}
            {!mineAction && actionMessage.sender.id > 0 ? <SheetRow danger icon={<Slash size={18} color="currentColor" />} label="Block" onClick={() => void runAction("block", actionMessage)} /> : null}
            {mineAction && stillDeletable(actionMessage) ? <SheetRow danger icon={<Trash size={18} color="currentColor" />} label="Delete for everyone" onClick={() => void runAction("delete", actionMessage)} /> : null}
            {type === "community" && isStaff && !actionMessage.deleted ? <SheetRow danger icon={<Trash size={18} color="currentColor" />} label="Remove post" onClick={() => void runAction("remove", actionMessage)} /> : null}
          </>
        ) : null}
      </Modal>

      <Modal open={sheet?.kind === "safety"} title={t("chat_words_title")} onClose={() => setSheet(null)}>
        <div data-testid="chat-safety-words-sheet">
          <p style={{ margin: "0 0 14px", fontSize: 14, lineHeight: 1.45, color: "rgba(var(--vc-navy-rgb),0.8)" }}>{t("chat_words_body")}</p>
          <a
            href={`tel:${dial}`}
            data-testid="chat-safety-call"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "13px 16px", borderRadius: 10, background: "#C62828", color: "#fff", fontSize: 15, fontWeight: 800, textDecoration: "none" }}
          >
            <Warning2 size={18} variant="Bold" color="currentColor" /> {t("chat_words_call", { number: dial })}
          </a>
          <button
            type="button"
            data-testid="chat-safety-emergency"
            onClick={() => { setSheet(null); push("/emergency"); }}
            style={{ marginTop: 10, width: "100%", padding: "12px 16px", borderRadius: 10, background: "var(--vc-danger-soft)", color: "#C62828", fontSize: 14, fontWeight: 800 }}
          >
            {t("chat_words_emergency")}
          </button>
          <button type="button" onClick={() => setSheet(null)} style={{ marginTop: 10, width: "100%", padding: "12px 16px", borderRadius: 10, background: "transparent", color: NAVY, fontSize: 14, fontWeight: 700, border: `1px solid ${LINE}` }}>
            {t("chat_words_ok")}
          </button>
          <p style={{ margin: "12px 0 0", fontSize: 12, color: "rgba(var(--vc-navy-rgb),0.6)", textAlign: "center" }}>{t("chat_words_noted")}</p>
        </div>
      </Modal>

      <Modal open={sheet?.kind === "failed"} title="Message not sent" onClose={() => setSheet(null)}>
        {sheet?.kind === "failed" ? (
          <>
            <SheetRow icon={<Refresh size={18} color="currentColor" />} label="Send again" onClick={() => { const m = sheet.message; setSheet(null); void chat.retry(m); }} />
            <SheetRow danger icon={<Trash size={18} color="currentColor" />} label="Remove" onClick={() => { const m = sheet.message; setSheet(null); chat.discard(m); }} />
          </>
        ) : null}
      </Modal>

      <Modal
        open={sheet?.kind === "file"}
        title={sheet?.kind === "file" && sheet.image ? "Send photo" : "Send file"}
        onClose={() => setSheet(null)}
        actions={
          <>
            <ActionButton small tone="white" label="Cancel" onClick={() => setSheet(null)} icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>} />
            <ActionButton small label="Send" onClick={sendPicked} icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>} />
          </>
        }
      >
        {sheet?.kind === "file" ? (
          <>
            {sheet.image && sheet.preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={sheet.preview} alt="" style={{ width: "100%", maxHeight: 320, objectFit: "cover", borderRadius: 8, display: "block" }} />
            ) : (
              <FileCard name={sheet.file.name} mine={false} />
            )}
            <textarea
              rows={1}
              value={sheet.caption}
              placeholder="Add a caption"
              onChange={(e) => setSheet({ ...sheet, caption: e.target.value })}
              style={{ marginTop: 14, width: "100%", padding: "12px 14px", borderRadius: 6, border: `1px solid ${LINE}`, fontSize: 15, color: NAVY, background: "var(--vc-surface)", outline: "none", resize: "none", fontFamily: "inherit" }}
            />
          </>
        ) : null}
      </Modal>

      {viewer ? (
        <div style={{ position: "fixed", inset: 0, zIndex: 80, background: "#000", display: "flex", flexDirection: "column" }}>
          <div style={{ height: 56, display: "flex", alignItems: "center", gap: 12, padding: "env(safe-area-inset-top) 12px 0", color: "#fff" }}>
            <button type="button" aria-label="Back" onClick={() => setViewer(null)} style={{ padding: 8, color: "#fff" }}>
              <ArrowLeft size={22} color="currentColor" />
            </button>
            <span style={{ fontSize: 15, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{viewer.name}</span>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "auto", touchAction: "pinch-zoom" }}>
            <AuthImage url={viewer.url} mine contain />
          </div>
        </div>
      ) : null}
    </div>
  );
}


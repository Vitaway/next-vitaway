"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { roomDisplayName, roomPicture, useRooms, type Room } from "@/lib/plus/client/chat";
import { Avatar, cx } from "../ui/vita";

function when(at: Date | null, lang: string) {
  if (!at) return "";
  const now = new Date();
  if (at.toDateString() === now.toDateString()) return at.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const days = Math.floor((now.getTime() - at.getTime()) / 86_400_000);
  if (days < 7) return at.toLocaleDateString(lang === "rw" ? "rw-RW" : "en-GB", { weekday: "short" });
  return at.toLocaleDateString(lang === "rw" ? "rw-RW" : "en-GB", { day: "numeric", month: "short" });
}

/** Desktop: the member's conversations beside the open chat, like any messaging app. Hidden on phones. */
export function ChatSidebar({ activeId }: { activeId: string }) {
  const { t, language } = useLanguage();
  const { push } = usePlusPaths();
  const { rooms, loading } = useRooms();
  const [q, setQ] = useState("");
  const list = rooms
    .filter((r) => !q.trim() || roomDisplayName(r).toLowerCase().includes(q.trim().toLowerCase()))
    .sort((a, b) => (b.lastMessage?.at?.getTime() ?? 0) - (a.lastMessage?.at?.getTime() ?? 0));
  const name = (r: Room) => roomDisplayName(r) || t("chat_care_team");
  return (
    <aside className="vita-chat-side" aria-label={t("chat_conversations")}>
      <div className="vita-chat-side-head">
        <h2>{t("chat_conversations")}</h2>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("chat_search")} aria-label={t("chat_search")} />
      </div>
      <div className="vita-chat-side-list">
        {loading && !rooms.length ? <p className="vita-chat-side-empty">…</p> : null}
        {!loading && !list.length ? <p className="vita-chat-side-empty">{t("chat_none")}</p> : null}
        {list.map((r) => (
          <button key={r.id} type="button" className={cx("vita-chat-side-row", String(r.id) === activeId && "on")} onClick={() => push(`/chat/${r.id}`)}>
            <Avatar url={roomPicture(r)} size={40} />
            <span className="tx">
              <span className="top">
                <b>{name(r)}</b>
                <small>{when(r.lastMessage?.at ?? null, language)}</small>
              </span>
              <span className="bot">
                <span>{r.lastMessage?.preview || t("chat_no_messages_short")}</span>
                {r.unread && String(r.id) !== activeId ? <i>{r.unread > 9 ? "9+" : r.unread}</i> : null}
              </span>
            </span>
          </button>
        ))}
      </div>
      <button type="button" className="vita-chat-side-new" onClick={() => push("/care")}>
        {t("chat_new_question")}
      </button>
    </aside>
  );
}

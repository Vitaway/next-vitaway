"use client";

import { useState } from "react";
import { Add, ArrowRight3, Message, Refresh } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { useMe, useSubscription } from "@/lib/plus/client/data";
import { mobileRequest } from "@/lib/plus/client/api";
import { invalidate } from "@/lib/plus/client/use-resource";
import { createRoom, roomDisplayName, roomPicture, roomTime, useCommunityReports, useDirectory, useRooms, type Coach, type Room } from "@/lib/plus/client/chat";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { ActionButton, AppBar, Avatar, CenterSpinner, DotSpinner, EmptyState, Modal, Page, Tabs, useFeedback } from "../ui/vita";
import { useChatGate } from "./sheets";

type Kind = "coaches" | "dietitians" | "admins";
const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;

/** Remember the room between the list and /chat/[id] so the header paints at once. */
export function stashRoom(room: Room) {
  try {
    sessionStorage.setItem(`vitaway.plus.room.${room.id}`, JSON.stringify({ ...room, lastMessage: null }));
  } catch {
    /* private mode */
  }
}

export function stashCoach(coach: Coach) {
  try {
    sessionStorage.setItem(`vitaway.plus.coach.${coach.id}`, JSON.stringify(coach));
  } catch {
    /* private mode */
  }
}

function ProviderCard({ coach, isYours, messaging, chatLoading, onOpen, onChat, onBook }: { coach: Coach; isYours: boolean; messaging: boolean; chatLoading: boolean; onOpen: () => void; onChat: () => void; onBook: () => void }) {
  const t = useT();
  const name = `${coach.first_name} ${coach.last_name}`.trim();
  const subtitle = [(coach.profile.speciality ?? "").trim(), (coach.profile.bio ?? "").trim()].filter(Boolean).join(" · ");
  const verified = Boolean((coach.profile.medicaldoc ?? "").trim());
  return (
    <div role="button" tabIndex={0} onClick={onOpen} className="vita-tap" style={{ display: "flex", alignItems: "center", padding: 14, borderRadius: 12, background: "var(--vc-surface)", border: isYours ? "1.4px solid color-mix(in srgb, var(--vc-teal) 55%, transparent)" : `1px solid ${navyA(0.08)}`, cursor: "pointer" }}>
      <Avatar url={coach.profile.profile_picture} size={48} />
      <div style={{ flex: 1, minWidth: 0, marginLeft: 12 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 6px" }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: "var(--vc-navy)" }}>{name || "—"}</span>
          {isYours ? <span style={{ padding: "2px 8px", borderRadius: 999, background: "#FFE8D6", fontSize: 11, fontWeight: 700, color: "#9A3D14" }}>{t("your_coach")}</span> : null}
        </div>
        {subtitle ? <div style={{ marginTop: 4, fontSize: 12.5, lineHeight: 1.35, fontWeight: 500, color: navyA(0.55), display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{subtitle}</div> : null}
        {verified ? <span style={{ display: "inline-block", marginTop: 6, padding: "2px 8px", borderRadius: 999, background: "#DFF5E6", fontSize: 11, fontWeight: 700, color: "#1F6B3A" }}>{t("verified_registration")}</span> : null}
      </div>
      <button
        type="button"
        disabled={messaging && chatLoading}
        onClick={(e) => {
          e.stopPropagation();
          if (messaging) onChat();
          else onBook();
        }}
        style={{ marginLeft: 10, minWidth: 64, padding: "10px 14px", borderRadius: 8, background: "var(--vc-surface)", border: "1px solid color-mix(in srgb, var(--vc-teal) 55%, transparent)", fontSize: 13, fontWeight: 800, color: "var(--vc-teal-ink)", display: "flex", justifyContent: "center" }}
      >
        {messaging && chatLoading ? <DotSpinner small color="var(--vc-teal)" /> : messaging ? t("chat") : t("book_cta")}
      </button>
    </div>
  );
}

function YourGroups({ groups, onOpen }: { groups: Room[]; onOpen: (r: Room) => void }) {
  const t = useT();
  return (
    <div style={{ padding: "12px 14px 10px", borderRadius: 12, background: "var(--vc-surface)", border: `1px solid ${navyA(0.08)}` }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: "var(--vc-navy)", marginBottom: 6 }}>{t("your_groups")}</div>
      {groups.slice(0, 4).map((room) => (
        <button key={room.id} type="button" onClick={() => onOpen(room)} style={{ width: "100%", display: "flex", alignItems: "center", padding: "8px 0", textAlign: "left" }}>
          <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 600, color: "var(--vc-navy)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{roomDisplayName(room).trim() || t("safe_space")}</span>
          {room.members?.length ? <span style={{ fontSize: 12, fontWeight: 600, color: navyA(0.45) }}>{t("members_count", { count: room.members.length })}</span> : null}
        </button>
      ))}
    </div>
  );
}

function RoomCard({ room, preview, onClick }: { room: Room; preview: string; onClick: () => void }) {
  const t = useT();
  const unread = room.unread;
  return (
    <button type="button" onClick={onClick} className="vita-tap" style={{ width: "100%", display: "flex", alignItems: "center", padding: 14, borderRadius: 10, background: "var(--vc-surface)", textAlign: "left" }}>
      <Avatar url={roomPicture(room)} size={48} />
      <span style={{ flex: 1, minWidth: 0, marginLeft: 12 }}>
        <span style={{ display: "block", fontSize: 15, fontWeight: 800, color: "var(--vc-navy)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{roomDisplayName(room).trim() || t("health_coach")}</span>
        <span style={{ display: "flex", alignItems: "center", marginTop: 3 }}>
          {room.careTeam ? <span style={{ padding: "1px 5px", borderRadius: 4, background: "var(--vc-tile-mint)", fontSize: 10, fontWeight: 700, color: "var(--vc-navy)", marginRight: 6, flex: "none" }}>Care team</span> : null}
          <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: unread > 0 ? 700 : 400, color: navyA(unread > 0 ? 0.85 : 0.45), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{preview}</span>
        </span>
      </span>
      <span style={{ marginLeft: 10, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
        {room.lastMessage?.at ? <span style={{ fontSize: 11, fontWeight: 600, color: unread > 0 ? "var(--vc-action)" : navyA(0.4) }}>{roomTime(room.lastMessage.at)}</span> : null}
        {unread > 0 ? (
          <span style={{ minWidth: 20, height: 20, padding: "0 6px", borderRadius: 999, background: "var(--vc-action)", color: "#fff", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{unread > 99 ? "99+" : unread}</span>
        ) : (
          <ArrowRight3 size={20} color={navyA(0.3)} />
        )}
      </span>
    </button>
  );
}

const listStyle: React.CSSProperties = { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, padding: "16px 16px calc(env(safe-area-inset-bottom) + 104px + 16px)" };

export function SupportScreen() {
  const t = useT();
  const { push } = usePlusPaths();
  const { toast, confirm } = useFeedback();
  const { user } = useMe();
  const type = user?.user_type ?? "normal";
  const staff = type === "coach" || type === "admin";
  const dietitian = type === "dietitian";
  const isPatient = type === "normal";
  const sub = useSubscription();
  const rooms = useRooms();
  const directory = useDirectory();
  const reports = useCommunityReports(staff);
  const gate = useChatGate();
  const [tab, setTab] = useState<string>(staff ? "chats" : "coaches");
  const [openingFor, setOpeningFor] = useState<number | null>(null);
  const [newCommunity, setNewCommunity] = useState<{ name: string; description: string } | null>(null);

  const refresh = async () => {
    invalidate("chat:");
  };

  const premium = async () => {
    const go = await confirm({ title: t("premium_feature"), message: t("premium_text"), confirmLabel: t("choose_plan"), cancelLabel: t("cancel") });
    if (go) push("/plans");
  };

  const openRoom = (room: Room) => {
    stashRoom(room);
    push(`/chat/${room.id}`);
  };

  const openChat = async (coach: Coach) => {
    if (!sub.active) return premium();
    if (!(await gate.ensureGuidelines())) return;
    setOpeningFor(coach.id);
    try {
      const room = await createRoom([{ user_email: coach.email, account_id: coach.id }]);
      openRoom(room);
      void refresh();
    } catch {
      toast(t("network_error"), { error: true });
    }
    setOpeningFor(null);
  };

  const openExistingRoom = async (room: Room) => {
    if (room.careTeam && !sub.active) return premium();
    if (!(await gate.ensureGuidelines())) return;
    openRoom(room);
  };

  const openCommunityPerson = async (id: number) => {
    if (!(await gate.ensureHandle())) return;
    if (!(await gate.ensureGuidelines())) return;
    setOpeningFor(id);
    try {
      const room = await createRoom([{ account_id: id }]);
      openRoom(room);
      void refresh();
    } catch {
      toast(t("network_error"), { error: true });
    }
    setOpeningFor(null);
  };

  const openCoach = (coach: Coach) => {
    stashCoach(coach);
    push(`/coaches/${coach.id}`);
  };

  const onTab = (value: string) => {
    setTab(value);
    if (!staff && value === "community") void gate.ensureHandle();
  };

  const createCommunity = async () => {
    const draft = newCommunity;
    setNewCommunity(null);
    if (!draft || draft.name.trim().length < 2) return;
    try {
      await mobileRequest("/api/v1/mobile/chat/communities", { method: "POST", body: { name: draft.name.trim(), description: draft.description.trim() } });
      void refresh();
    } catch {
      toast("That community was not created.", { error: true });
    }
  };

  const resolveReport = async (id: number, action: string) => {
    try {
      await mobileRequest(`/api/v1/mobile/chat/community-reports/${id}/resolve`, { method: "POST", body: { action } });
    } catch {
      /* Flutter ignores the result */
    }
    void refresh();
  };

  const renderRooms = (kind: string) => {
    if (rooms.loading && !rooms.data) return <CenterSpinner />;
    if (rooms.error && !rooms.data) return <EmptyState title={t("retry")} subtitle={rooms.error.message} actionLabel={t("retry")} onAction={() => void rooms.reload()} actionIcon={<Refresh size={16} color="currentColor" />} />;
    const list = rooms.rooms.filter((r) => r.type === kind);
    if (!list.length) return <EmptyState title={kind === "community" ? t("community_empty") : t("coaches_empty")} />;
    return (
      <div style={listStyle}>
        {list.map((room) => (
          <RoomCard key={room.id} room={room} preview={room.lastMessage?.preview ? room.lastMessage.preview : t("no_message")} onClick={() => void openExistingRoom(room)} />
        ))}
      </div>
    );
  };

  const renderCommunity = () => {
    if (directory.loading && !directory.data) return <CenterSpinner />;
    if (directory.error && !directory.data) return <EmptyState title={t("retry")} actionLabel={t("retry")} onAction={refresh} actionIcon={<Refresh size={16} color="currentColor" />} />;
    const people = directory.data?.community ?? [];
    if (!people.length) return <EmptyState title="No community names yet" />;
    return (
      <div style={listStyle}>
        {people.map((p) => (
          <button key={p.id} type="button" onClick={() => void openCommunityPerson(p.id)} className="vita-tap" style={{ display: "flex", alignItems: "center", padding: "16px", borderRadius: 12, background: "var(--vc-surface)", textAlign: "left" }}>
            <span style={{ flex: 1, fontSize: 15, fontWeight: 800, color: "var(--vc-navy)" }}>{p.handle}</span>
            {openingFor === p.id ? <DotSpinner small color="var(--vc-navy)" /> : <Message size={20} color="var(--vc-navy)" />}
          </button>
        ))}
      </div>
    );
  };

  const renderPeople = (kind: Kind) => {
    const waiting = (directory.loading && !directory.data) || (rooms.loading && !rooms.data);
    if (waiting) return <CenterSpinner />;
    if (directory.error && !directory.data) return <EmptyState title={t("coaches_load_failed")} subtitle={t("coaches_load_failed_body")} actionLabel={t("retry")} onAction={refresh} actionIcon={<Refresh size={16} color="currentColor" />} />;
    const data = directory.data!;
    const groups = kind === "coaches" ? rooms.rooms.filter((r) => r.type === "group") : [];
    const filtered = [...data[kind]].sort((a, b) => {
      const am = a.id === data.assignedCoachId ? 0 : 1;
      const bm = b.id === data.assignedCoachId ? 0 : 1;
      if (am !== bm) return am - bm;
      return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
    });
    if (!filtered.length && !groups.length) return <EmptyState title={kind === "coaches" ? t("coaches_empty") : kind === "dietitians" ? "No dietitians yet" : "No admins yet"} />;
    return (
      <div style={{ ...listStyle, padding: "12px 16px calc(env(safe-area-inset-bottom) + 104px + 20px)", gap: 10 }}>
        {!filtered.length ? (
          <p style={{ margin: 0, padding: "28px 0", textAlign: "center", fontSize: 15, fontWeight: 700, color: "var(--vc-navy)" }}>{t("support_filter_empty")}</p>
        ) : (
          filtered.map((coach) => (
            <ProviderCard
              key={coach.id}
              coach={coach}
              isYours={coach.id === data.assignedCoachId}
              messaging={sub.active}
              chatLoading={openingFor === coach.id}
              onOpen={() => openCoach(coach)}
              onChat={() => void openChat(coach)}
              onBook={() => {
                stashCoach(coach);
                push(`/coaches/${coach.id}/book`);
              }}
            />
          ))
        )}
        {groups.length ? <YourGroups groups={groups} onOpen={(r) => void openExistingRoom(r)} /> : null}
      </div>
    );
  };

  const tabs = staff
    ? [{ value: "chats", label: "Chats" }, { value: "community", label: t("community") }]
    : [{ value: "coaches", label: t("my_coach") }, { value: "dietitians", label: "Dietitians" }, { value: "admins", label: "Admins" }, { value: "community", label: t("community") }];

  let body: React.ReactNode;
  if (dietitian) body = renderRooms("normal");
  else if (staff) {
    body =
      tab === "chats" ? (
        renderRooms("normal")
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ padding: "12px 16px 0" }}>
            <ActionButton full label="New community" icon={<Add size={16} color="currentColor" />} onClick={() => setNewCommunity({ name: "", description: "" })} />
          </div>
          {reports.data?.length ? (
            <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "12px 16px 0", flex: "none" }}>
              {reports.data.map((r) => (
                <div key={r.id} style={{ width: 240, flex: "none", padding: 12, borderRadius: 12, background: "var(--vc-surface)", display: "flex", flexDirection: "column", minHeight: 136 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "var(--vc-navy)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.roomName}</div>
                  <div style={{ marginTop: 4, fontSize: 12, color: navyA(0.7), display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{r.preview}</div>
                  <div style={{ marginTop: "auto", display: "flex", gap: 8 }}>
                    <button type="button" onClick={() => void resolveReport(r.id, "dismiss")} style={{ padding: "8px", fontWeight: 600, color: "var(--vc-teal-ink)", fontSize: 14 }}>Dismiss</button>
                    <button type="button" onClick={() => void resolveReport(r.id, "remove")} style={{ padding: "8px", fontWeight: 600, color: "var(--vc-teal-ink)", fontSize: 14 }}>Remove post</button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          {renderCommunity()}
        </div>
      );
  } else {
    body = tab === "community" ? renderCommunity() : renderPeople(tab as Kind);
  }

  return (
    <Page backdrop>
      <AppBar title={t(isPatient ? "support_page_title_normal" : "support_page_title_coach")} back={false} bottom={dietitian ? undefined : <Tabs onBar tabs={tabs} value={tab} onChange={onTab} />} />
      {body}
      {gate.element}
      <Modal
        open={newCommunity !== null}
        compact
        title="New community"
        onClose={() => setNewCommunity(null)}
        actions={
          <>
            <ActionButton small tone="white" label="Cancel" onClick={() => setNewCommunity(null)} />
            <ActionButton small label="Create" onClick={createCommunity} />
          </>
        }
      >
        <input placeholder="Name" value={newCommunity?.name ?? ""} onChange={(e) => setNewCommunity((c) => (c ? { ...c, name: e.target.value } : c))} style={{ width: "100%", padding: "12px 0", border: 0, borderBottom: `1px solid ${navyA(0.3)}`, outline: "none", fontSize: 16, background: "transparent", color: "var(--vc-ink)" }} />
        <input placeholder="Description" value={newCommunity?.description ?? ""} onChange={(e) => setNewCommunity((c) => (c ? { ...c, description: e.target.value } : c))} style={{ width: "100%", padding: "12px 0", border: 0, borderBottom: `1px solid ${navyA(0.3)}`, outline: "none", fontSize: 16, background: "transparent", color: "var(--vc-ink)", marginTop: 8 }} />
      </Modal>
    </Page>
  );
}

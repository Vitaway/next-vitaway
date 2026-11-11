"use client";

import { useEffect, useState } from "react";
import { Calendar1, Edit2, InfoCircle, Logout, NoteText, People, Ruler, Trash, User } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { useMe } from "@/lib/plus/client/data";
import { asList, mobileRequest } from "@/lib/plus/client/api";
import { invalidate } from "@/lib/plus/client/use-resource";
import { parseCoach, roomPicture, useRoom, type Room } from "@/lib/plus/client/chat";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { useBack } from "@/lib/plus/nav";
import { ActionButton, AppBar, Avatar, Card, CenterSpinner, Modal, SectionLabel, useFeedback } from "../ui/vita";
import { readStashedRoom } from "./chat";
import { stashCoach } from "./support";

const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;

function StatTile({ asset, label, value, tint }: { asset: string; label: string; value: string; tint: string }) {
  return (
    <div style={{ flex: 1, padding: 16, borderRadius: 10, background: tint }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset} alt="" width={18} height={18} />
        <span style={{ fontSize: 12, fontWeight: 600, color: navyA(0.6), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
      </div>
      <div style={{ marginTop: 10, fontSize: 22, fontWeight: 800, color: "var(--vc-navy)" }}>{value}</div>
    </div>
  );
}

function InfoRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{ display: "flex", padding: "14px 0", borderBottom: last ? undefined : `1px solid ${navyA(0.06)}` }}>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: navyA(0.55) }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: "var(--vc-navy)" }}>{value}</span>
    </div>
  );
}

export function ChatInfoScreen({ roomId }: { roomId: string }) {
  const t = useT();
  const { push, replace } = usePlusPaths();
  const goBack = useBack(`/chat/${roomId}`);
  const { toast } = useFeedback();
  const { user } = useMe();
  const res = useRoom(roomId);
  const [stashed, setStashed] = useState<Room | null>(null);
  useEffect(() => setStashed(readStashedRoom(roomId)), [roomId]);
  const room = res.data ?? stashed;
  const [requesting, setRequesting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [edit, setEdit] = useState<{ name: string; description: string } | null>(null);

  if (!room) return <div className="vita-page" style={{ background: "var(--vc-canvas)" }}><AppBar title="" /><CenterSpinner /></div>;

  const type = user?.user_type ?? "normal";
  const staff = type === "coach" || type === "admin";
  const direct = room.type === "normal";
  const group = room.type === "group" || room.type === "community";
  const other = room.other;
  const title = direct ? `${other.first_name} ${other.last_name}`.trim() : room.name;
  const fail = () => toast(t("network_error"), { error: true });

  const requestAppointment = async () => {
    setRequesting(true);
    try {
      const coaches = asList(await mobileRequest("/coaches/")).map(parseCoach);
      const match = coaches.find((c) => c.email === other.email);
      if (!match) fail();
      else {
        stashCoach(match);
        push(`/coaches/${match.id}/book`);
      }
    } catch {
      fail();
    }
    setRequesting(false);
  };

  const leave = async () => {
    setBusy(true);
    try {
      await mobileRequest(`/api/v1/mobile/chat/communities/${room.id}/leave`, { method: "POST" });
      invalidate("chat:");
      replace("/support");
    } catch {
      fail();
    }
    setBusy(false);
  };

  const remove = async () => {
    try {
      await mobileRequest(`/api/v1/mobile/chat/rooms/${room.id}`, { method: "DELETE" });
      invalidate("chat:");
      replace("/support");
    } catch {
      fail();
    }
  };

  const saveEdit = async () => {
    const draft = edit;
    setEdit(null);
    if (!draft || draft.name.trim().length < 2) return;
    try {
      await mobileRequest(`/api/v1/mobile/chat/rooms/${room.id}`, { method: "PATCH", body: { name: draft.name.trim(), description: draft.description.trim() } });
      invalidate(`chat:room:${roomId}`, "chat:rooms");
      goBack();
    } catch {
      fail();
    }
  };

  const members = room.members ?? [];
  const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 0", border: 0, borderBottom: `1px solid ${navyA(0.3)}`, outline: "none", fontSize: 16, background: "transparent", color: "var(--vc-ink)" };

  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title="" />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px calc(env(safe-area-inset-bottom) + 104px)" }}>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <Avatar url={roomPicture(room)} size={108} />
        </div>
        <h2 style={{ margin: "16px 0 0", textAlign: "center", fontSize: 26, fontWeight: 800, letterSpacing: -0.6, color: "var(--vc-navy)" }}>{title || "—"}</h2>
        {direct ? <p style={{ margin: "6px 0 0", textAlign: "center", fontSize: 14, fontWeight: 600, color: navyA(0.5) }}>{other.type === "normal" ? `${t("user_mrn")} ${other.mrn}` : other.speciality ?? "Coach"}</p> : null}
        <div style={{ height: 28 }} />
        {direct && type === "coach" ? (
          <>
            <SectionLabel icon={<Ruler size={18} color="currentColor" />} label={t("biometrics")} />
            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              <StatTile asset="/plus-assets/measurement/age.png" label={t("age")} value={other.age !== null ? String(other.age) : "—"} tint="var(--vc-tile-mint)" />
              <StatTile asset="/plus-assets/measurement/height.png" label={t("ap_height")} value={other.height === null ? "—" : `${other.height.toFixed(0)} cm`} tint="var(--vc-tile-sky)" />
            </div>
            <div style={{ height: 24 }} />
            <SectionLabel icon={<InfoCircle size={18} color="currentColor" />} label={t("additional_info")} />
            <div style={{ height: 10 }} />
            <Card padding="4px 18px">
              <InfoRow label={t("language")} value={user?.profile?.language ?? "Kinyarwanda"} />
              <InfoRow label={t("account_type")} value={t("regular", undefined, "Regular")} last />
            </Card>
          </>
        ) : null}
        {direct && type === "normal" ? (
          <>
            <SectionLabel icon={<User size={18} color="currentColor" />} label="Bio" />
            <div style={{ height: 10 }} />
            <Card>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, fontWeight: 500, color: navyA(0.78), whiteSpace: "pre-wrap" }}>{other.bio.trim() || "—"}</p>
            </Card>
            {other.type === "coach" ? (
              <div style={{ marginTop: 28 }}>
                <ActionButton full label={t("request_appointment")} icon={<Calendar1 size={16} color="currentColor" />} loading={requesting} onClick={requestAppointment} />
              </div>
            ) : null}
          </>
        ) : null}
        {group ? (
          <>
            <SectionLabel icon={<NoteText size={18} color="currentColor" />} label={t("description")} />
            <div style={{ height: 10 }} />
            <Card>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, fontWeight: 500, color: navyA(0.78), whiteSpace: "pre-wrap" }}>{room.description.trim() || "—"}</p>
            </Card>
            <div style={{ height: 24 }} />
            <SectionLabel icon={<People size={18} color="currentColor" />} label={`${t("members")} (${members.length})`} />
            <div style={{ height: 10 }} />
            <Card padding={members.length ? "4px 14px" : undefined}>
              {!members.length ? (
                <span style={{ fontSize: 14, color: navyA(0.5) }}>—</span>
              ) : (
                members.map((m, i) => {
                  const name = `${m.first_name} ${m.last_name}`.trim();
                  return (
                    <div key={`${m.email}-${i}`} style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: i === members.length - 1 ? undefined : `1px solid ${navyA(0.06)}` }}>
                      <Avatar url={m.profile_picture} size={42} />
                      <div style={{ marginLeft: 12, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--vc-navy)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name || "—"}</div>
                        <div style={{ marginTop: 2, fontSize: 12, fontWeight: 600, color: navyA(0.45) }}>{m.type === "normal" ? "Member" : "Coach"}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </Card>
            {room.type === "community" ? (
              <div style={{ marginTop: 28 }}>
                <ActionButton full label="Leave community" icon={<Logout size={16} color="currentColor" />} loading={busy} onClick={leave} />
              </div>
            ) : null}
            {staff && room.type === "community" ? (
              <>
                <div style={{ marginTop: 12 }}>
                  <ActionButton full label="Edit community" icon={<Edit2 size={16} color="currentColor" />} onClick={() => setEdit({ name: room.name, description: room.description })} />
                </div>
                <div style={{ marginTop: 12 }}>
                  <ActionButton full label="Delete community" icon={<Trash size={16} color="currentColor" />} onClick={remove} />
                </div>
              </>
            ) : null}
          </>
        ) : null}
      </div>
      <Modal
        open={edit !== null}
        compact
        title="Edit community"
        onClose={() => setEdit(null)}
        actions={
          <>
            <ActionButton small tone="white" label="Cancel" onClick={() => setEdit(null)} />
            <ActionButton small label="Save" onClick={saveEdit} />
          </>
        }
      >
        <input placeholder="Name" value={edit?.name ?? ""} onChange={(e) => setEdit((c) => (c ? { ...c, name: e.target.value } : c))} style={inputStyle} />
        <input placeholder="Description" value={edit?.description ?? ""} onChange={(e) => setEdit((c) => (c ? { ...c, description: e.target.value } : c))} style={{ ...inputStyle, marginTop: 8 }} />
      </Modal>
    </div>
  );
}

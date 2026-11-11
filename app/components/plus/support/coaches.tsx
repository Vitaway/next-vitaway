"use client";

import { useEffect, useState } from "react";
import { Calendar1, CalendarRemove, Call, Clock, Message, User, UserAdd, Video } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { useMe, useSubscription } from "@/lib/plus/client/data";
import { MobileApiError, asList, mobileRequest } from "@/lib/plus/client/api";
import { invalidate } from "@/lib/plus/client/use-resource";
import { createRoom, parseCoach, useDirectory, type Coach } from "@/lib/plus/client/chat";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { useBack } from "@/lib/plus/nav";
import { ActionButton, AppBar, Avatar, Card, CenterSpinner, EmptyState, Modal, Photo, SectionLabel, useFeedback } from "../ui/vita";
import { stashCoach, stashRoom } from "./support";

const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;

/** Finds the coach passed from the list, else looks it up in the directory or /coaches/. */
export function useCoach(id: number): { coach: Coach | null; loading: boolean } {
  const [stashed, setStashed] = useState<Coach | null>(null);
  const [fallback, setFallback] = useState<Coach | null>(null);
  const [checked, setChecked] = useState(false);
  const directory = useDirectory();
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`vitaway.plus.coach.${id}`);
      if (raw) setStashed(JSON.parse(raw) as Coach);
    } catch {
      /* ignore */
    }
    setChecked(true);
  }, [id]);
  const fromDirectory = directory.data ? [...directory.data.coaches, ...directory.data.dietitians, ...directory.data.admins].find((c) => c.id === id) ?? null : null;
  const needFallback = checked && !stashed && !fromDirectory && !directory.loading;
  useEffect(() => {
    if (!needFallback || fallback) return;
    mobileRequest("/coaches/")
      .then((list) => setFallback(asList(list).map(parseCoach).find((c) => c.id === id) ?? null))
      .catch(() => undefined);
  }, [needFallback, fallback, id]);
  const coach = stashed ?? fromDirectory ?? fallback;
  return { coach, loading: !coach && (!checked || directory.loading || (needFallback && !fallback)) };
}

function Channel({ children }: { children: React.ReactNode }) {
  return <span style={{ width: 32, height: 32, borderRadius: "50%", background: "color-mix(in srgb, var(--vc-mint) 24%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vc-navy)" }}>{children}</span>;
}

export function CoachDetailsScreen({ id }: { id: number }) {
  const t = useT();
  const { push } = usePlusPaths();
  const { toast, confirm } = useFeedback();
  const sub = useSubscription();
  const { coach, loading } = useCoach(id);
  const [assigned, setAssigned] = useState<number | null>(null);
  const [choosing, setChoosing] = useState(false);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    mobileRequest<Record<string, unknown>>("/api/v1/mobile/coaching/my-coach")
      .then((b) => {
        const v = b?.coach_account_id;
        setAssigned(typeof v === "number" ? v : Number.parseInt(String(v ?? ""), 10) || null);
      })
      .catch(() => undefined);
  }, []);

  if (!coach) return <div className="vita-page" style={{ background: "var(--vc-canvas)" }}><AppBar title="" />{loading ? <CenterSpinner /> : <EmptyState title={t("coaches_load_failed")} subtitle={t("coaches_load_failed_body")} />}</div>;

  const premium = async () => {
    const go = await confirm({ title: t("premium_feature"), message: t("premium_text"), confirmLabel: t("choose_plan"), cancelLabel: t("cancel") });
    if (go) push("/plans");
  };
  const mine = assigned === coach.id;
  const choose = async () => {
    setChoosing(true);
    try {
      const b = await mobileRequest<Record<string, unknown>>("/api/v1/mobile/coaching/my-coach", { method: "PUT", body: { coach_id: mine ? null : coach.id } });
      const v = b?.coach_account_id;
      setAssigned(typeof v === "number" ? v : Number.parseInt(String(v ?? ""), 10) || null);
      invalidate("chat:directory");
      toast(mine ? "Coach cleared. You can choose another anytime." : "This is now your coach. The clinic can see the assignment too.");
    } catch (e) {
      if (e instanceof MobileApiError && e.status) {
        const m = e.body && typeof e.body === "object" ? (e.body as Record<string, unknown>).message : null;
        toast(typeof m === "string" ? m : "Could not update your coach.");
      } else toast("Could not update your coach. Try again.");
    }
    setChoosing(false);
  };
  const openChat = async () => {
    if (!sub.active) return premium();
    setOpening(true);
    try {
      const room = await createRoom([{ user_email: coach.email }]);
      stashRoom(room);
      push(`/chat/${room.id}`);
    } catch {
      toast(t("network_error"), { error: true });
    }
    setOpening(false);
  };
  const name = `${coach.first_name} ${coach.last_name}`.trim();
  const speciality = (coach.profile.speciality ?? "").trim();
  const bio = (coach.profile.bio ?? "").trim();
  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title="" />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px calc(env(safe-area-inset-bottom) + 104px)" }}>
        <div style={{ height: 280, borderRadius: 10, overflow: "hidden", marginTop: 0 }}>
          <Photo url={coach.profile.profile_picture} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <h2 style={{ margin: "20px 0 0", textAlign: "center", fontSize: 26, fontWeight: 800, letterSpacing: -0.6, color: "var(--vc-navy)" }}>{name || "—"}</h2>
        {speciality ? <p style={{ margin: "6px 0 0", textAlign: "center", fontSize: 14, fontWeight: 600, color: navyA(0.5) }}>{speciality}</p> : null}
        <div style={{ height: 20 }} />
        <Card padding="16px 18px">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#2FBF71" }} />
            <span style={{ flex: 1, marginLeft: 2, fontSize: 14, fontWeight: 700, color: "var(--vc-navy)" }}>{t("available_on", undefined, "Available on")}</span>
            <Channel><Message size={16} color="currentColor" /></Channel>
            <Channel><Video size={16} color="currentColor" /></Channel>
            <Channel><Call size={16} color="currentColor" /></Channel>
          </div>
        </Card>
        <div style={{ height: 24 }} />
        <SectionLabel icon={<User size={18} color="currentColor" />} label={t("bio")} />
        <div style={{ height: 10 }} />
        <Card>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, fontWeight: 500, color: navyA(0.78), whiteSpace: "pre-wrap" }}>{bio || "—"}</p>
        </Card>
        <div style={{ height: 28 }} />
        <ActionButton full tone={mine ? "teal" : "white"} label={mine ? "Your coach · tap to clear" : "Choose as my coach"} icon={<UserAdd size={16} color="currentColor" />} loading={choosing} onClick={choose} />
        <div style={{ height: 12 }} />
        <ActionButton
          full
          label={t("request_appointment")}
          icon={<Calendar1 size={16} color="currentColor" />}
          onClick={() => {
            if (!sub.active) return void premium();
            stashCoach(coach);
            push(`/coaches/${coach.id}/book`);
          }}
        />
        <div style={{ height: 12 }} />
        <ActionButton full tone="white" label={t("chat_with_me")} icon={<Message size={16} color="currentColor" />} loading={opening} onClick={openChat} />
      </div>
    </div>
  );
}

type Slot = { start_time: string; end_time: string };
type Held = { when: string; coach: string };

/** convertToTimeFormat in health_metrics.dart */
function hhmm(raw: string): string {
  const s = raw.trim();
  const m = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(s);
  if (m) return `${m[1].padStart(2, "0")}:${m[2]}`;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? s : `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
const p2 = (n: number) => String(n).padStart(2, "0");
const dayKey = (d: Date) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function held(row: Record<string, unknown>): Held {
  const day = String(row.reservation_day ?? "");
  const start = String(row.start_time ?? "");
  const clock = start.length >= 16 ? start.slice(11, 16) : start;
  const p = row.coach_profile && typeof row.coach_profile === "object" ? (row.coach_profile as Record<string, unknown>) : null;
  const coach = p ? `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() : "";
  return { when: `${day} · ${clock}`.trim(), coach: coach || "Your coach" };
}

export function RequestAppointmentScreen({ id }: { id: number }) {
  const t = useT();
  const { replace } = usePlusPaths();
  const goBack = useBack(`/coaches/${id}`);
  const { toast } = useFeedback();
  const { user } = useMe();
  const { coach, loading: coachLoading } = useCoach(id);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [booking, setBooking] = useState<Record<string, Slot[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState(dayKey(today));
  const [page, setPage] = useState(0);
  const [slot, setSlot] = useState<number | null>(null);
  const [session, setSession] = useState<Record<string, unknown> | null>(null);
  const [pending, setPending] = useState<Held | null>(null);
  const [last, setLast] = useState<Held | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyOpen, setAlreadyOpen] = useState(false);
  const [nonce, setNonce] = useState(0);

  const phone = (user?.profile?.phone_number ?? "").trim();
  const email = (user?.email ?? "").trim();
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const data = await mobileRequest<Record<string, unknown>>(`/api/coach/${id}/availability/`, { anonymous: true });
        const map: Record<string, Slot[]> = {};
        for (const [date, slots] of Object.entries(data ?? {})) {
          map[date.slice(0, 10)] = Array.isArray(slots) ? (slots as Record<string, unknown>[]).map((s) => ({ start_time: String(s.start_time ?? ""), end_time: String(s.end_time ?? "") })) : [];
        }
        let sess: Record<string, unknown> | null = null;
        if (phone) {
          try {
            const realEmail = email.includes("@") && !email.endsWith("@phone.vitaway.local");
            const q = await mobileRequest<Record<string, unknown>>("/api/v1/public/appointments/quote", { anonymous: true, query: { phone, email: realEmail ? email : undefined } });
            const s = q?.data && typeof q.data === "object" ? (q.data as Record<string, unknown>).session : null;
            if (s && typeof s === "object") sess = s as Record<string, unknown>;
          } catch {
            /* no price line */
          }
        }
        let p: Held | null = null;
        let c: Held | null = null;
        try {
          for (const row of asList<Record<string, unknown>>(await mobileRequest("/api/user-reservations/"))) {
            const st = String(row.status ?? "").toUpperCase();
            if (st === "PENDING" && !p) p = held(row);
            if (st === "COMPLETED" && !c) c = held(row);
          }
        } catch {
          /* ignore */
        }
        if (!alive) return;
        setBooking(map);
        setSession(sess);
        setPending(p);
        setLast(c);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "error");
      }
      if (alive) setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [id, phone, email, nonce]);

  const times = booking[selected] ?? [];
  const submit = async () => {
    if (slot === null || !coach) return;
    const s = times[slot];
    const [y, m, d] = selected.split("-").map(Number);
    const at = (clock: string) => {
      const [h, mi] = hhmm(clock).split(":").map(Number);
      return `${y}-${p2(m)}-${p2(d)}T${p2(h)}:${p2(mi)}:00`;
    };
    setSubmitting(true);
    let failure: string | null = null;
    try {
      await mobileRequest("/api/reservations/", { method: "POST", body: { coach_id: coach.id, reservation_day: selected, start_time: at(s.start_time), end_time: at(s.end_time), status: "Pending" } });
    } catch (e) {
      const b = e instanceof MobileApiError && e.body && typeof e.body === "object" ? (e.body as Record<string, unknown>) : null;
      failure = b ? String(b.detail ?? b.error ?? "Unknown error") : "Unknown error";
    }
    setSubmitting(false);
    setConfirmOpen(false);
    if (failure === null) {
      toast(t("booking_comfirmation"));
      invalidate("appointments:");
      replace("/home");
    } else if (failure.toLowerCase().includes("already have a pending")) {
      setAlreadyOpen(true);
    } else {
      toast(t("booking_failed", undefined, "Booking failed. Try again."), { error: true });
    }
  };

  // TableCalendar twoWeeks: rows of 7 starting on Sunday, from today for 30 days.
  const first = new Date(today);
  first.setDate(today.getDate() - today.getDay() + page * 14);
  const lastDay = new Date(today);
  lastDay.setDate(today.getDate() + 29);
  const cells = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(first);
    d.setDate(first.getDate() + i);
    return d;
  });
  const maxPage = Math.floor((lastDay.getTime() - (today.getTime() - today.getDay() * 86_400_000)) / (14 * 86_400_000));
  const coachName = coach ? `${coach.first_name} ${coach.last_name}`.trim() : "";
  const role = (coach?.profile.speciality ?? "").trim();
  const covered = session?.covered === true;
  const perYear = session?.per_year;
  const left = session?.remaining;
  const pay = session?.pay;

  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={t("request_appointment")} actions={<Avatar url={coach?.profile.profile_picture} size={38} />} />
      {loading || coachLoading ? (
        <CenterSpinner />
      ) : error || !coach ? (
        <EmptyState title={t("network_error")} actionLabel={t("retry")} onAction={() => setNonce((n) => n + 1)} />
      ) : (
        <>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 20px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--vc-navy)" }}>{coachName}</div>
                {role ? <div style={{ fontSize: 13, fontWeight: 600, color: navyA(0.55) }}>{role}</div> : null}
                <div style={{ fontSize: 13, fontWeight: 600, color: navyA(0.55) }}>Video call · 30 min</div>
              </div>
              <button type="button" onClick={goBack} style={{ padding: "8px 12px", fontSize: 14, fontWeight: 600, color: "var(--vc-teal-ink)" }}>Change</button>
            </div>
            {covered ? (
              <p style={{ margin: "8px 0", fontSize: 14, lineHeight: 1.4, fontWeight: 600, color: "var(--vc-navy)" }}>
                {typeof perYear === "number" ? `This session is covered. You pay 0 RWF. ${typeof left === "number" ? Math.round(left) : 0} of ${Math.round(perYear)} covered sessions left this year.` : "This session is covered. You pay 0 RWF."}
              </p>
            ) : typeof pay === "number" ? (
              <p style={{ margin: "8px 0", fontSize: 14, lineHeight: 1.4, fontWeight: 600, color: "var(--vc-navy)" }}>{`You pay ${Math.round(pay)} RWF.`}</p>
            ) : null}
            {last ? <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: navyA(0.55) }}>{`Last session · ${last.when} · ${last.coach}`}</p> : null}
            <Card padding={8}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 4px 12px" }}>
                <button type="button" aria-label="Previous" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))} style={{ padding: 6, color: "var(--vc-navy)", opacity: page === 0 ? 0.3 : 1 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 19l-7-7 7-7" /></svg>
                </button>
                <span style={{ fontSize: 16, fontWeight: 800, color: "var(--vc-navy)" }}>{`${MONTHS[cells[0].getMonth()]} ${cells[0].getFullYear()}`}</span>
                <button type="button" aria-label="Next" disabled={page >= maxPage} onClick={() => setPage((p) => Math.min(maxPage, p + 1))} style={{ padding: 6, color: "var(--vc-navy)", opacity: page >= maxPage ? 0.3 : 1 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", rowGap: 0 }}>
                {WD.map((w) => (
                  <span key={w} style={{ textAlign: "center", fontSize: 12, fontWeight: 600, color: navyA(0.4), paddingBottom: 6 }}>{w}</span>
                ))}
                {cells.map((d) => {
                  const key = dayKey(d);
                  const disabled = d < today || d > lastDay;
                  const isSel = key === selected;
                  const hasSlots = (booking[key] ?? []).length > 0;
                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        if (key !== selected) {
                          setSelected(key);
                          setSlot(null);
                        }
                      }}
                      style={{ height: 42, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <span style={{ width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: disabled ? "transparent" : isSel ? "var(--vc-teal)" : hasSlots ? "var(--vc-tile-mint)" : "transparent", fontSize: 14, fontWeight: disabled ? 400 : 700, color: disabled ? navyA(0.2) : isSel ? "#fff" : "var(--vc-navy)" }}>{d.getDate()}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
            <div style={{ height: 24 }} />
            <SectionLabel icon={<Clock size={18} color="currentColor" />} label={t("schedule_prompt")} />
            <div style={{ height: 12 }} />
            {!times.length ? (
              <Card>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <CalendarRemove size={20} color={navyA(0.4)} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: navyA(0.5) }}>{t("no_slots")}</span>
                </div>
              </Card>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {times.map((s, i) => (
                  <button key={i} type="button" onClick={() => setSlot(i)} style={{ padding: "14px 18px", borderRadius: 999, background: slot === i ? "var(--vc-teal)" : "var(--vc-surface)", border: `${slot === i ? 1.6 : 1}px solid ${slot === i ? "var(--vc-teal)" : navyA(0.1)}`, fontSize: 14, fontWeight: 700, color: slot === i ? "#fff" : "var(--vc-navy)", transition: "all 180ms" }}>
                    {`${hhmm(s.start_time)} - ${hhmm(s.end_time)}`}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{ padding: "8px 20px calc(12px + env(safe-area-inset-bottom))" }}>
            <ActionButton full label={t("book")} loading={submitting} disabled={slot === null} icon={<Calendar1 size={16} color="currentColor" />} onClick={() => setConfirmOpen(true)} />
          </div>
        </>
      )}
      <Modal
        open={confirmOpen}
        compact
        title={t("comfirm_appointment")}
        actions={
          <>
            <ActionButton small tone="white" label={t("cancel")} onClick={() => setConfirmOpen(false)} icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>} />
            <ActionButton small label={t("book")} loading={submitting} icon={<Calendar1 size={14} color="currentColor" />} onClick={submit} />
          </>
        }
      >
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: navyA(0.65) }}>{slot !== null && times[slot] ? `${t("comfirm_question")}${hhmm(times[slot].start_time)} - ${hhmm(times[slot].end_time)} ?` : ""}</p>
      </Modal>
      <Modal
        open={alreadyOpen}
        compact
        title="You already have a session booked"
        onClose={() => setAlreadyOpen(false)}
        actions={
          <>
            <ActionButton small tone="white" label="Keep it" onClick={() => { setAlreadyOpen(false); replace("/home"); }} icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>} />
            <ActionButton small label="Reschedule it" icon={<Calendar1 size={14} color="currentColor" />} onClick={() => setAlreadyOpen(false)} />
          </>
        }
      >
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "var(--vc-body)", whiteSpace: "pre-line" }}>
          {`${pending?.when ?? "Upcoming"}\nVideo call with ${pending?.coach ?? coachName} · 30 min\n\nYou can move it to another time, or keep it as it is.\nNeed two sessions? Call +250 795 767 405`}
        </p>
      </Modal>
    </div>
  );
}

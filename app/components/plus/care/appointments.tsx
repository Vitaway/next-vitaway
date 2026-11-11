"use client";

import { useState } from "react";
import { Call, CalendarTick, Drop, Heart, Message, PlayCircle, Refresh, Ruler, Weight } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { useAppointments, useSubscription } from "@/lib/plus/client/data";
import { appointmentKey, fmtClock, fmtMMMddY, isClinic, isClosed, isMissed, isUpcoming, type FullAppointment } from "@/lib/plus/client/appointments";
import { relativeDayLabel } from "@/lib/plus/client/care";
import { invalidate } from "@/lib/plus/client/use-resource";
import { mobileRequest } from "@/lib/plus/client/api";
import { createRoom } from "@/lib/plus/client/chat";
import { stashRoom } from "../support/support";
import { useGlucoseUnit } from "@/lib/plus/units";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { ActionButton, AppBar, Avatar, CenterSpinner, CircleButton, EmptyState, Modal, Page, Photo, Tabs, useFeedback } from "../ui/vita";

type Tab = "upcoming" | "missed" | "done";

function nameOf(a: FullAppointment): string {
  return `${a.coach_profile?.first_name ?? ""} ${a.coach_profile?.last_name ?? ""}`.trim();
}

function AppointmentTile({ a, onOpen }: { a: FullAppointment; onOpen: () => void }) {
  const t = useT();
  const label = a.status_label ?? null;
  let subtitle: string;
  let color: string;
  if (a.status === "PENDING") {
    if (isMissed(a)) {
      subtitle = `${label ?? t("missed_on")} ${fmtMMMddY(a.reservation_day)}`;
      color = "var(--vc-danger)";
    } else {
      const when = `${relativeDayLabel(a.reservation_day, t)}, ${fmtClock(a.start_time)}`;
      subtitle = a.meeting_id ? t("meeting_ongoing") : label ? `${label} · ${when}` : when;
      color = a.meeting_id ? "var(--vc-danger)" : "rgba(var(--vc-navy-rgb),0.45)";
    }
  } else if (a.status === "COMPLETED") {
    subtitle = `${label ?? t("completed_on")} ${fmtMMMddY(a.reservation_day)}`;
    color = "#2BB3A3";
  } else if (a.status === "EXPIRED" || a.status === "NO_SHOW") {
    subtitle = `${label ?? t("expired_on")} ${fmtMMMddY(a.reservation_day)}`;
    color = "var(--vc-danger)";
  } else {
    subtitle = `${label ?? t("canceled_on")} ${fmtMMMddY(a.reservation_day)}`;
    color = "var(--vc-danger)";
  }
  const name = nameOf(a);
  const title = isClinic(a) ? (a.subject?.trim() ? a.subject.trim() : name || "Clinic visit") : name || t("appointments");
  return (
    <button type="button" onClick={onOpen} className="vita-tap" style={{ display: "flex", alignItems: "center", width: "calc(100% - 32px)", margin: "6px 16px", padding: 14, borderRadius: 10, background: "var(--vc-surface)", textAlign: "left" }}>
      <Avatar url={a.coach_profile?.profile_picture} size={48} />
      <span style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 15, fontWeight: 700, color: "var(--vc-navy)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</span>
        <span style={{ display: "block", fontSize: 12, color, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{subtitle}</span>
        {a.change_note?.trim() || a.notes?.trim() ? (
          <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontSize: 11, color: "rgba(var(--vc-navy-rgb),0.5)" }}>{(a.change_note ?? a.notes ?? "").trim()}</span>
        ) : null}
      </span>
      <span style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--vc-tile-mint)", color: "var(--vc-navy)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
        <PlayCircle size={20} variant="Bold" color="currentColor" />
      </span>
    </button>
  );
}

export function AppointmentsScreen() {
  const t = useT();
  const { push } = usePlusPaths();
  const { all, loading, reload } = useAppointments();
  const [tab, setTab] = useState<Tab>("upcoming");
  const list = (all as FullAppointment[]).filter(tab === "upcoming" ? isUpcoming : tab === "missed" ? isMissed : isClosed);
  const emptyKey = tab === "upcoming" ? "upcoming_appointments_empty" : tab === "missed" ? "missed_appointments_empty" : "appointments_empty";
  return (
    <Page backdrop>
      <AppBar
        title={t("appointments")}
        actions={
          <CircleButton label="Refresh" onClick={() => void reload()}>
            <Refresh size={18} color="currentColor" />
          </CircleButton>
        }
        bottom={<Tabs<Tab> onBar tabs={[{ value: "upcoming", label: t("upcoming_appointments") }, { value: "missed", label: t("missed_appointments") }, { value: "done", label: t("completed_appointments") }]} value={tab} onChange={setTab} />}
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0 32px" }}>
        {loading && !all.length ? (
          <CenterSpinner />
        ) : !list.length ? (
          <EmptyState title={t(emptyKey)} subtitle={t("appointments_empty_body")} />
        ) : (
          list.map((a) => <AppointmentTile key={appointmentKey(a)} a={a} onOpen={() => push(`/appointments/${appointmentKey(a)}`)} />)
        )}
      </div>
    </Page>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "8px 16px", color: "var(--vc-navy)" }}>
      <span style={{ display: "inline-flex" }}>{icon}</span>
      <span style={{ marginLeft: 12, flex: 1, fontSize: 14 }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700 }}>{value}</span>
    </div>
  );
}

const sectionTitle = (text: string) => <h3 style={{ margin: 0, padding: "8px 16px", fontSize: 22, fontWeight: 700, color: "var(--vc-navy)" }}>{text}</h3>;

export function AppointmentDetailScreen({ appointmentKey: key }: { appointmentKey: string }) {
  const t = useT();
  const { push, replace } = usePlusPaths();
  const { toast, confirm } = useFeedback();
  const { all, loading } = useAppointments();
  const sub = useSubscription();
  const [unit] = useGlucoseUnit();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const a = (all as FullAppointment[]).find((x) => appointmentKey(x) === key);
  if (loading && !a) return <div className="vita-page"><AppBar title={t("appointment_details")} /><CenterSpinner /></div>;
  if (!a) return <div className="vita-page"><AppBar title={t("appointment_details")} /><EmptyState title={t("appointments_empty")} subtitle={t("appointments_empty_body")} /></div>;

  const premium = async () => {
    const go = await confirm({ title: t("premium_feature"), message: t("premium_text"), confirmLabel: t("choose_plan"), cancelLabel: t("cancel") });
    if (go) push("/plans");
  };
  const cancel = async () => {
    setBusy(true);
    try {
      await mobileRequest(`/appointments/${a.id}/cancel/`, { method: "POST" });
      toast(t("cancel_success"));
    } catch {
      toast(t("cancel_failed", undefined, "Could not cancel this appointment."), { error: true });
    }
    invalidate("appointments:");
    setBusy(false);
    setCancelOpen(false);
    replace("/home");
  };
  const openChat = async () => {
    if (!sub.active) return premium();
    try {
      const room = await createRoom([{ user_email: a.coach_profile?.email ?? "" }]);
      stashRoom(room);
      push(`/chat/${room.id}`);
    } catch (error) {
      toast(`Error creating chat room: ${error instanceof Error ? error.message : ""}`.trim(), { error: true });
    }
  };
  const metrics = a.user_metrics ?? {};
  const g = Number.parseFloat(String(metrics.blood_glucose ?? "0")) || 0;
  const w = Number.parseFloat(String(metrics.weight ?? "0")) || 0;
  const height = a.user_profile?.height ?? 130;
  const docs = a.user_documents ?? [];
  const meds = a.medications ?? [];

  return (
    <div className="vita-page" style={{ background: "var(--vc-surface)" }}>
      <AppBar
        title={t("appointment_details")}
        actions={
          <CircleButton label={t("appointment_details")}>
            <CalendarTick size={17} color="currentColor" />
          </CircleButton>
        }
      />
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        <div style={{ padding: 16, borderRadius: 8, background: "var(--vc-surface)", boxShadow: "0 2px 8px 2px rgba(var(--vc-navy-rgb),0.1)" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ width: 54, height: 54, borderRadius: "50%", border: `2px solid ${a.meeting_id ? "var(--vc-danger)" : "transparent"}`, overflow: "hidden", flex: "none" }}>
              <Photo url={a.coach_profile?.profile_picture} size={50} />
            </span>
            <div style={{ marginLeft: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--vc-navy)" }}>{`${t("coach")} ${a.coach_profile?.first_name ?? ""} ${a.coach_profile?.last_name ?? ""}`}</div>
              <div style={{ marginTop: 4, fontSize: 12, color: "rgba(var(--vc-navy-rgb),0.55)" }}>{a.meeting_id && a.status === "PENDING" ? t("meeting_in_progress") : relativeDayLabel(a.reservation_day, t)}</div>
            </div>
          </div>
          <div style={{ marginTop: 16, textAlign: "center", fontSize: 22, fontWeight: 700, color: "rgba(var(--vc-navy-rgb),0.55)" }}>{`${fmtClock(a.start_time)} - ${fmtClock(a.end_time)}`}</div>
        </div>
        <div style={{ height: 16 }} />
        {a.meeting_id && a.status === "PENDING" ? (
          <div style={{ maxWidth: 320, margin: "0 auto" }}>
            <ActionButton full label={t("join_call")} icon={<Call size={16} color="currentColor" />} onClick={() => toast("Video calls open in the Vitaway mobile app for now.", { error: true })} />
          </div>
        ) : null}
        <div style={{ height: 16 }} />
        {a.status === "PENDING" ? (
          <div style={{ maxWidth: 300, margin: "0 auto" }}>
            <ActionButton
              full
              tone="white"
              label={t("cancel_appointment")}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>}
              onClick={() => {
                if (isClinic(a)) toast("Clinic visits are changed at the desk. Call the clinic if you need to move this one.");
                else if (sub.active) setCancelOpen(true);
                else void premium();
              }}
            />
          </div>
        ) : null}
        <div style={{ height: 24 }} />
        {sectionTitle(t("my_health_metrics"))}
        <Metric icon={<Heart size={24} color="var(--vc-danger)" />} label={t("ap_bp")} value={`${metrics.blood_pressure ?? "N/A"} mmHg`} />
        <Metric icon={<Drop size={24} color="var(--vc-danger)" />} label={t("ap_blood_glucose")} value={`${(unit === "mmol" ? g / 18 : g).toFixed(0)} ${unit === "mmol" ? "mmol/L" : "mg/dL"}`} />
        <Metric icon={<Ruler size={24} color="currentColor" />} label={t("ap_height")} value={`${height} Cm`} />
        <Metric icon={<Weight size={24} color="currentColor" />} label={t("ap_weight")} value={`${w.toFixed(0)} Kg`} />
        <div style={{ height: 24 }} />
        {sectionTitle(t("medications_title"))}
        <div style={{ padding: "0 16px", display: "flex", flexWrap: "wrap", gap: 8 }}>
          {meds.length ? meds.map((m, i) => <span key={i} style={{ padding: "8px 12px", borderRadius: 10, background: "rgba(var(--vc-navy-rgb),0.05)", fontSize: 14, color: "var(--vc-navy)" }}>{m.name}</span>) : <span style={{ fontSize: 14, color: "rgba(var(--vc-navy-rgb),0.55)" }}>{t("no_medications")}</span>}
        </div>
        <div style={{ height: 24 }} />
        {sectionTitle(t("coach_certification"))}
        <div style={{ padding: "8px 16px", fontSize: 14, color: "rgba(var(--vc-navy-rgb),0.65)" }}>
          {docs.length ? docs.slice(0, 3).map((d, i) => <div key={i} style={{ padding: "6px 0", fontWeight: 600, color: "var(--vc-navy)" }}>{String(d.name ?? "Unknown Document")}</div>) : t("no_documents")}
        </div>
        <div style={{ height: 16 }} />
        <div style={{ maxWidth: 320, margin: "0 auto 24px" }}>
          <ActionButton full tone="teal" label={t("chat_with_me")} icon={<Message size={16} color="currentColor" />} onClick={openChat} />
        </div>
      </div>
      <Modal
        open={cancelOpen}
        compact
        title={t("cancel_appointment")}
        actions={
          <>
            <ActionButton small tone="white" label={t("cancel")} onClick={() => setCancelOpen(false)} />
            <ActionButton small tone="danger" label={t("verify")} loading={busy} onClick={cancel} />
          </>
        }
      >
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--vc-body)" }}>{t("cancel_question")}</p>
      </Modal>
    </div>
  );
}

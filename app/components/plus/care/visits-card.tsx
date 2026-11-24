"use client";

import { useState } from "react";
import { ArrowRight3, Calendar1 } from "@/lib/plus/icons";
import { useLanguage } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { useAppointments } from "@/lib/plus/client/data";
import { appointmentKey, fmtClock, isClinic, isMissed, isUpcoming, type FullAppointment } from "@/lib/plus/client/appointments";
import { relativeDayLabel } from "@/lib/plus/client/care";
import { Avatar } from "../ui/vita";

const nameOf = (a: FullAppointment) => `${a.coach_profile?.first_name ?? ""} ${a.coach_profile?.last_name ?? ""}`.trim();

function Visit({ a, onOpen }: { a: FullAppointment; onOpen: () => void }) {
  const { t } = useLanguage();
  const missed = isMissed(a);
  const when = a.status === "PENDING" && !missed ? `${relativeDayLabel(a.reservation_day, t)}, ${fmtClock(a.start_time)}` : `${a.status_label ?? a.status.toLowerCase()} · ${relativeDayLabel(a.reservation_day, t)}`;
  const name = nameOf(a);
  const title = isClinic(a) ? (a.subject?.trim() ? a.subject.trim() : name || t("care_clinic_visit")) : name || t("appointments");
  return (
    <button type="button" className="vita-visit" onClick={onOpen}>
      <Avatar url={a.coach_profile?.profile_picture} size={38} />
      <span className="tx">
        <b>{title}</b>
        <small style={missed ? { color: "var(--vc-danger)" } : undefined}>{a.meeting_id ? t("meeting_ongoing") : when}</small>
      </span>
      <ArrowRight3 size={16} color="currentColor" />
    </button>
  );
}

/**
 * Care · Your visits. Booking starts from a person (their Book button); this card is where booked visits live,
 * so Appointments needs no page of its own. Past visits fold away.
 */
export function VisitsCard() {
  const { t } = useLanguage();
  const { push } = usePlusPaths();
  const appts = useAppointments();
  const [past, setPast] = useState(false);
  const all = (appts.data ?? []) as FullAppointment[];
  const upcoming = all.filter(isUpcoming);
  const done = all.filter((a) => !isUpcoming(a)).sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
  return (
    <section className="vita-visits" data-testid="care-visits">
      <div className="vita-visits-head">
        <span className="ic"><Calendar1 size={18} color="currentColor" /></span>
        <h2>{t("care_visits_title")}</h2>
      </div>
      {upcoming.length ? (
        upcoming.slice(0, 3).map((a) => <Visit key={appointmentKey(a)} a={a} onOpen={() => push(`/appointments/${appointmentKey(a)}`)} />)
      ) : (
        <p className="vita-visits-empty">{appts.loading && !appts.data ? "…" : t("care_visits_empty")}</p>
      )}
      {done.length ? (
        <>
          <button type="button" className="vita-visits-toggle" aria-expanded={past} onClick={() => setPast((v) => !v)}>
            {past ? t("care_visits_hide_past") : t("care_visits_past", { n: done.length })}
          </button>
          {past ? done.slice(0, 6).map((a) => <Visit key={appointmentKey(a)} a={a} onOpen={() => push(`/appointments/${appointmentKey(a)}`)} />) : null}
        </>
      ) : null}
    </section>
  );
}

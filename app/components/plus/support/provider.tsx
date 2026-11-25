"use client";

import { useEffect, useRef } from "react";
import { ArrowRight3, Calendar1, Lock, Message, Messages2, ShieldTick } from "@/lib/plus/icons";
import { useLanguage, useT } from "@/lib/plus/i18n";
import { specialityLabel } from "@/lib/plus/appointment-text";
import type { Coach } from "@/lib/plus/client/chat";
import type { CareProfessional } from "@/lib/plus/client/care-team";
import { Avatar, DotSpinner, RootPortal } from "../ui/vita";

export type ProviderKind = "coaches" | "dietitians" | "admins";

/** A care-team person (GET /mobile/care-team) shaped like a directory card, so the same card and sheet show them. */
export function coachFromPro(pro: CareProfessional): Coach {
  return {
    id: pro.account_id ?? 0,
    email: "",
    first_name: pro.name,
    last_name: "",
    user_type: pro.discipline === "coach" ? "coach" : pro.discipline === "nutritionist" ? "dietitian" : "professional",
    profile: { profile_picture: pro.avatar_url, speciality: pro.discipline, bio: pro.helps_with, medicaldoc: pro.verified ? "licence-verified" : null },
    raw: {},
  };
}

export function kindFromPro(pro: CareProfessional): ProviderKind {
  return pro.discipline === "nutritionist" ? "dietitians" : "coaches";
}

const navyA = (a: number) => `rgba(var(--vc-navy-rgb), ${a})`;
const STATUS_COLOR = { online: "#22B573", busy: "#E8890C", off: "#98A2B3" } as const;

type Shared = { coach: Coach; kind: ProviderKind; pro: CareProfessional | undefined; isYours: boolean };

function useProviderText({ coach, kind, pro }: Omit<Shared, "isYours">) {
  const t = useT();
  const { language } = useLanguage();
  const rw = language === "rw";
  const name = (pro?.name || `${coach.first_name} ${coach.last_name}`).trim() || "—";
  const role =
    (pro ? (rw ? pro.role_label.rw : pro.role_label.en) : null) ??
    specialityLabel(coach.profile.speciality, rw ? "rw" : "en") ??
    (kind === "admins" ? t("support_team_role") : kind === "dietitians" ? t("dietitian_role") : t("health_coach"));
  const verified = pro ? pro.verified : Boolean((coach.profile.medicaldoc ?? "").trim());
  const eta = pro ? (rw ? pro.eta.rw : pro.eta.en) : null;
  return { t, name, role, verified, eta, status: pro?.status ?? null };
}

/** Photo with an Online/Busy/Off dot, and an orange ring for the client's own coach. */
function ProviderPhoto({ url, size, status, ring }: { url: string | null | undefined; size: number; status: CareProfessional["status"] | null; ring: boolean }) {
  const dot = Math.max(12, Math.round(size * 0.2));
  return (
    <span style={{ position: "relative", display: "inline-flex", flex: "none", borderRadius: "50%", padding: 3, background: ring ? "var(--vc-action)" : "color-mix(in srgb, var(--vc-teal) 14%, transparent)" }}>
      <span style={{ display: "flex", borderRadius: "50%", padding: 2, background: "var(--vc-surface)" }}>
        <Avatar url={url} size={size} />
      </span>
      {status ? (
        <span
          aria-hidden
          style={{ position: "absolute", right: Math.round(size * 0.04), bottom: Math.round(size * 0.04), width: dot, height: dot, borderRadius: "50%", background: STATUS_COLOR[status], border: "2.5px solid var(--vc-surface)" }}
        />
      ) : null}
    </span>
  );
}

/**
 * A photo-first card, two to a row on phones. Tapping it opens the profile sheet, where the actions are
 * (as in the care team prototype).
 */
export function ProviderCard({ coach, kind, pro, isYours, onOpen }: Shared & { onOpen: () => void }) {
  const { t, name, role, verified, eta, status } = useProviderText({ coach, kind, pro });
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${name}, ${role}${eta ? `, ${eta}` : ""}`}
      className="vita-tap vita-pro-card"
      data-yours={isYours || undefined}
    >
      {isYours ? <span className="vita-pro-flag">{t("your_coach")}</span> : null}
      <ProviderPhoto url={coach.profile.profile_picture || pro?.avatar_url} size={76} status={status} ring={isYours} />
      <span className="vita-pro-name">{name}</span>
      <span className="vita-pro-role">{role}</span>
      {verified ? (
        <span className="vita-pro-verified">
          <ShieldTick size={13} color="currentColor" />
          {t("verified_registration")}
        </span>
      ) : null}
      {eta && status ? (
        <span className="vita-pro-eta">
          <span aria-hidden style={{ width: 7, height: 7, borderRadius: "50%", background: STATUS_COLOR[status], flex: "none" }} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{eta}</span>
        </span>
      ) : null}
    </button>
  );
}

/** A wide card for the client's own care team: photo with status, role, licence check, reply time, Message. */
export function ProviderRow({ coach, kind, pro, onOpen, onMessage, onBook, busy }: Omit<Shared, "isYours"> & { onOpen: () => void; onMessage: () => void; onBook?: () => void; busy: boolean }) {
  const { t, name, role, verified, eta, status } = useProviderText({ coach, kind, pro });
  return (
    <div className="vita-pro-row" data-status={status ?? undefined}>
      <button type="button" className="vita-pro-row-main" onClick={onOpen} aria-label={`${name}, ${role}${eta ? `, ${eta}` : ""}`}>
        <ProviderPhoto url={coach.profile.profile_picture || pro?.avatar_url} size={46} status={status} ring={false} />
        <span className="tx">
          <b>{name}</b>
          <span className="role">
            {role}
            {verified ? (
              <span className="vita-pro-row-ok" title={t("verified_registration")}>
                <ShieldTick size={13} color="currentColor" />
              </span>
            ) : null}
          </span>
          {eta && status ? (
            <span className="eta">
              <i aria-hidden style={{ background: STATUS_COLOR[status] }} />
              {eta}
            </span>
          ) : null}
        </span>
      </button>
      <span className="vita-pro-row-acts">
        {onBook ? (
          <button type="button" className="vita-pro-row-book" onClick={onBook} aria-label={`${t("quick_book_visit")}: ${name}`}>
            {t("care_book_short")}
          </button>
        ) : null}
        <button type="button" className="vita-pro-row-msg" onClick={onMessage} disabled={busy} aria-label={`${t("send_message")}: ${name}`}>
          {busy ? "…" : <Messages2 size={18} variant="Bold" color="currentColor" />}
        </button>
      </span>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.45, color: "var(--vc-ink)" }}>
      <b style={{ fontWeight: 800 }}>{label}: </b>
      {children}
    </p>
  );
}

/**
 * The profile sheet: slides up from the bottom on phones, a centred card on wider screens. Licence, what they
 * help with, languages, status, then Book (people who take sessions) and Send a message.
 */
export function ProviderSheet({
  coach,
  kind,
  pro,
  isYours,
  subscribed,
  chatLoading,
  onClose,
  onMessage,
  onBook,
  onProfile,
}: Shared & { subscribed: boolean; chatLoading: boolean; onClose: () => void; onMessage: () => void; onBook: () => void; onProfile?: () => void }) {
  const { t, name, role, verified, eta, status } = useProviderText({ coach, kind, pro });
  const firstButton = useRef<HTMLButtonElement>(null);
  const bookable = kind !== "admins";
  const bio = (coach.profile.bio ?? "").trim();
  const helps = (pro?.helps_with ?? "").trim();
  const languages = pro?.languages?.length ? pro.languages.join(", ") : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstButton.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  const licence = (() => {
    if (pro && !pro.clinician) return <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: navyA(0.7) }}>{t("pro_coach_not_clinician")}</p>;
    if (pro?.council) {
      return (
        <>
          <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 800, color: pro.verified ? "#1F8A4C" : "var(--vc-navy)" }}>
            {pro.verified ? <ShieldTick size={17} color="currentColor" /> : null}
            {t(pro.verified ? "pro_licence_verified" : "pro_licence_on_file", { council: pro.council })}
          </p>
          {pro.licence_number ? (
            <p style={{ margin: "6px 0 0", fontSize: 13.5, lineHeight: 1.45, color: navyA(0.65) }}>
              {t(pro.verified ? "pro_licence_checked" : "pro_licence_number", { number: pro.licence_number, council: pro.council_name ?? pro.council })}
            </p>
          ) : null}
        </>
      );
    }
    if (verified) {
      return (
        <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 800, color: "#1F8A4C" }}>
          <ShieldTick size={17} color="currentColor" />
          {t("verified_registration")}
        </p>
      );
    }
    return null;
  })();

  return (
    <RootPortal>
      <div className="vita-pro-sheet-scrim" role="presentation" onClick={onClose}>
        <div className="vita-pro-sheet" role="dialog" aria-modal="true" aria-label={name} onClick={(e) => e.stopPropagation()}>
          <span className="vita-pro-grab" aria-hidden />
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <ProviderPhoto url={coach.profile.profile_picture || pro?.avatar_url} size={64} status={status} ring={isYours} />
            <div style={{ minWidth: 0 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, lineHeight: 1.2, color: "var(--vc-navy)" }}>{name}</h2>
              <div style={{ marginTop: 3, fontSize: 15, fontWeight: 600, color: navyA(0.6) }}>{role}</div>
              {isYours ? (
                <span style={{ display: "inline-block", marginTop: 6, padding: "2px 9px", borderRadius: 999, background: "color-mix(in srgb, var(--vc-action) 14%, transparent)", fontSize: 12, fontWeight: 800, color: "var(--vc-action)" }}>{t("your_coach")}</span>
              ) : null}
            </div>
          </div>

          {licence ? <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 14, border: `1px solid ${navyA(0.12)}` }}>{licence}</div> : null}

          <div style={{ marginTop: 8 }}>
            {helps ? <Row label={t("pro_helps_with")}>{helps}</Row> : null}
            {bio && bio !== helps ? <Row label={t("pro_about")}>{bio}</Row> : null}
            {languages ? <Row label={t("pro_languages")}>{languages}</Row> : null}
            {status ? (
              <Row label={t("pro_status")}>
                <span aria-hidden style={{ display: "inline-block", width: 9, height: 9, borderRadius: "50%", background: STATUS_COLOR[status], marginRight: 6, verticalAlign: 1 }} />
                {eta ?? t(`status_${status}`)}
              </Row>
            ) : null}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            {bookable ? (
              <button ref={firstButton} type="button" onClick={onBook} className="vita-pro-btn secondary">
                <Calendar1 size={18} color="currentColor" />
                {t("book_session")}
              </button>
            ) : null}
            <button ref={bookable ? undefined : firstButton} type="button" onClick={onMessage} disabled={chatLoading} className="vita-pro-btn primary" title={subscribed ? undefined : t("message_locked_hint")}>
              {chatLoading ? (
                <DotSpinner small color="#fff" />
              ) : (
                <>
                  {subscribed ? <Message size={18} color="currentColor" /> : <Lock size={17} color="currentColor" />}
                  {t("send_message")}
                </>
              )}
            </button>
          </div>
          {kind !== "admins" && onProfile ? (
            <button type="button" onClick={onProfile} style={{ marginTop: 12, width: "100%", minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 14, fontWeight: 700, color: "var(--vc-teal-ink)", background: "transparent", border: 0 }}>
              {t("pro_view_profile")}
              <ArrowRight3 size={16} color="currentColor" />
            </button>
          ) : null}
        </div>
      </div>
    </RootPortal>
  );
}

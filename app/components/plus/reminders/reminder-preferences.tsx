"use client";

import { useCallback, useEffect, useState } from "react";
import { useLanguage, useT } from "@/lib/plus/i18n";
import {
  MAX_CAP,
  getReminderSettings,
  isGranted,
  needsRenewal,
  saveReminderPreferences,
  setReminderConsent,
  shortDue,
  validTime,
  type ReminderChannel,
  type ReminderPurpose,
  type ReminderSettings,
} from "@/lib/plus/reminder-prefs";
import { ActionButton, AppBar, CenterSpinner, ErrorState, useFeedback } from "../ui/vita";

const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;
const card: React.CSSProperties = { marginBottom: 14, padding: 16, borderRadius: 10, background: "var(--vc-surface)" };
const PURPOSE_KEY: Record<ReminderPurpose, string> = { medicines: "rp_purpose_medicines", meal_photos: "rp_purpose_meal_photos", readings: "rp_purpose_readings", visits: "rp_purpose_visits", programme: "rp_purpose_programme" };

function Switch({ value, onChange, label, disabled }: { value: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button type="button" role="switch" aria-label={label} aria-checked={value} disabled={disabled} onClick={() => onChange(!value)} style={{ width: 46, height: 28, borderRadius: 999, padding: 3, background: value ? "var(--vc-mint)" : navyA(0.12), opacity: disabled ? 0.5 : 1, flex: "0 0 auto" }}>
      <span style={{ display: "block", width: 22, height: 22, borderRadius: "50%", background: value ? "var(--vc-teal)" : "#fff", transform: `translateX(${value ? 18 : 0}px)`, transition: "transform 160ms", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
    </button>
  );
}

export function ReminderPreferencesScreen() {
  const t = useT();
  const { language } = useLanguage();
  const { toast } = useFeedback();
  const [s, setS] = useState<ReminderSettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [quietStart, setQuietStart] = useState("21:00");
  const [quietEnd, setQuietEnd] = useState("07:00");
  const [cap, setCap] = useState(MAX_CAP);

  const apply = (next: ReminderSettings) => {
    setS(next);
    setQuietStart(next.preferences.quiet_start);
    setQuietEnd(next.preferences.quiet_end);
    setCap(next.preferences.daily_cap);
  };
  const load = useCallback(async () => {
    setError(null);
    try {
      apply(await getReminderSettings());
    } catch {
      setError(t("rp_load_failed"));
    }
  }, [t]);
  useEffect(() => {
    void load();
  }, [load]);

  if (error) return <div className="vita-page w-narrow"><AppBar title={t("rp_title")} bubbles={false} /><ErrorState message={error} onRetry={load} /></div>;
  if (!s) return <div className="vita-page w-narrow"><AppBar title={t("rp_title")} bubbles={false} /><CenterSpinner /></div>;

  const toggle = async (purpose: ReminderPurpose, channel: ReminderChannel, granted: boolean) => {
    setBusy(true);
    try {
      apply(await setReminderConsent(purpose, channel, granted));
      toast(granted ? t("rp_consent_given") : t("rp_consent_withdrawn"));
    } catch {
      toast(t("rp_save_failed"), { error: true });
    } finally {
      setBusy(false);
    }
  };
  const save = async (extra: { opted_out?: boolean } = {}) => {
    if (!validTime(quietStart) || !validTime(quietEnd)) return toast(t("rp_time_invalid"), { error: true });
    setBusy(true);
    try {
      apply(await saveReminderPreferences({ quiet_start: quietStart, quiet_end: quietEnd, daily_cap: cap, ...extra }));
      toast(t("settings_saved"));
    } catch {
      toast(t("rp_save_failed"), { error: true });
    } finally {
      setBusy(false);
    }
  };
  const off = s.preferences.opted_out;

  return (
    <div className="vita-page w-narrow" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={t("rp_title")} bubbles={false} />
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px calc(env(safe-area-inset-bottom) + 32px)", maxWidth: 640, width: "100%", margin: "0 auto" }}>
        <div style={{ ...card, borderLeft: "4px solid var(--vc-teal)" }} data-testid="rp-notice">
          <div style={{ fontSize: 15, fontWeight: 800, color: "var(--vc-navy)" }}>{t("rp_notice_title")}</div>
          <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.5, color: "var(--vc-ink)" }}>{language === "rw" ? s.notice.text_rw : s.notice.text_en}</p>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: navyA(0.5) }}>{t("rp_notice_version")} {s.notice.version}</p>
          {needsRenewal(s.consents, s.notice.version) ? <p style={{ margin: "8px 0 0", fontSize: 13, fontWeight: 700, color: "var(--vc-danger)" }}>{t("rp_notice_changed")}</p> : null}
        </div>

        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 15, fontWeight: 800, color: "var(--vc-navy)" }}>{t("rp_all_off")}</span>
              <span style={{ display: "block", fontSize: 13, color: navyA(0.55) }}>{t("rp_all_off_help")}</span>
            </span>
            <Switch label={t("rp_all_off")} value={off} disabled={busy} onChange={(v) => void save({ opted_out: v })} />
          </div>
        </div>

        <div style={{ ...card, opacity: off ? 0.55 : 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 64px 64px", alignItems: "center", rowGap: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: navyA(0.6) }}>{t("rp_what")}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: navyA(0.6), textAlign: "center" }}>{t("rp_push")}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: navyA(0.6), textAlign: "center" }}>{t("rp_sms")}</span>
            {s.purposes.map((p) => (
              <Row key={p} label={t(PURPOSE_KEY[p])}>
                {(["push", "sms"] as const).map((c) => (
                  <span key={c} style={{ display: "flex", justifyContent: "center" }}>
                    <Switch label={`${t(PURPOSE_KEY[p])} ${c}`} value={isGranted(s.consents, p, c)} disabled={busy} onChange={(v) => void toggle(p, c, v)} />
                  </span>
                ))}
              </Row>
            ))}
          </div>
          {!s.sms_live ? <p style={{ margin: "12px 0 0", fontSize: 13, color: navyA(0.5) }}>{t("rp_sms_test")}</p> : null}
        </div>

        <div style={card}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "var(--vc-navy)" }}>{t("rp_quiet")}</div>
          <p style={{ margin: "4px 0 12px", fontSize: 13, color: navyA(0.55) }}>{t("rp_quiet_help")}</p>
          <div style={{ display: "flex", gap: 12 }}>
            <label style={{ flex: 1, fontSize: 13, fontWeight: 700, color: navyA(0.7) }}>
              {t("rp_from")}
              <input className="vita-input" type="time" value={quietStart} onChange={(e) => setQuietStart(e.target.value)} style={{ marginTop: 6 }} />
            </label>
            <label style={{ flex: 1, fontSize: 13, fontWeight: 700, color: navyA(0.7) }}>
              {t("rp_to")}
              <input className="vita-input" type="time" value={quietEnd} onChange={(e) => setQuietEnd(e.target.value)} style={{ marginTop: 6 }} />
            </label>
          </div>
          <div style={{ marginTop: 16, fontSize: 15, fontWeight: 800, color: "var(--vc-navy)" }}>{t("rp_cap")}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {Array.from({ length: MAX_CAP + 1 }, (_, i) => i).map((n) => (
              <button key={n} type="button" aria-pressed={cap === n} onClick={() => setCap(n)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, fontWeight: 800, border: `1px solid ${cap === n ? "var(--vc-teal)" : navyA(0.15)}`, background: cap === n ? "var(--vc-mint)" : "transparent", color: cap === n ? "#0f3a3a" : "var(--vc-ink)" }}>
                {n}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <ActionButton full label={t("save_changes")} disabled={busy} onClick={() => void save()} />
          </div>
        </div>

        <div style={card} data-testid="rp-recent">
          <div style={{ fontSize: 15, fontWeight: 800, color: "var(--vc-navy)" }}>{t("rp_recent")}</div>
          {s.recent.length === 0 ? <p style={{ margin: "8px 0 0", fontSize: 13, color: navyA(0.55) }}>{t("rp_recent_empty")}</p> : null}
          {s.recent.map((j) => (
            <div key={j.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderTop: `1px solid ${navyA(0.06)}` }}>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: "var(--vc-ink)" }}>{t(PURPOSE_KEY[j.purpose as ReminderPurpose] ?? "reminders_title")} · {j.channel === "sms" ? t("rp_sms") : t("rp_push")}</span>
                <span style={{ display: "block", fontSize: 13, color: navyA(0.5) }}>{shortDue(j.due_local)} · {t("rp_rule")} {j.rule_key} v{j.rule_version}</span>
              </span>
              <span style={{ fontSize: 13, fontWeight: 800, padding: "4px 8px", borderRadius: 999, background: j.status === "sent" ? "var(--vc-mint)" : navyA(0.08), color: j.status === "sent" ? "#0f3a3a" : "var(--vc-ink)", textAlign: "right" }}>
                {j.status === "sent" ? t("rp_sent") : j.status === "scheduled" ? t("rp_planned") : j.status === "failed" ? t("rp_failed") : `${t("rp_not_sent")}: ${j.reason_label ?? j.suppression_reason ?? ""}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <span style={{ fontSize: 15, fontWeight: 700, color: "var(--vc-ink)" }}>{label}</span>
      {children}
    </>
  );
}

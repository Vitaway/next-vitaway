"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, DocumentDownload, Health, People, ReceiptItem, Refresh, TickCircle, Warning2 } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { fetchProtectedBlob, mobileRequest, MobileApiError } from "@/lib/plus/client/api";
import { invalidate, useResource } from "@/lib/plus/client/use-resource";
import { PROGRAMME_CONFIG_KEY } from "@/lib/plus/client/programme-config";
import {
  canPay,
  formatMoney,
  kigaliDateTime,
  listOf,
  methodLabel,
  nextPollMs,
  normalizeEnrolment,
  normalizePayment,
  normalizeProgramme,
  paymentSettled,
  receiptPayments,
  stageTone,
  type Enrolment,
  type MemberStage,
  type Programme,
  type ProgrammePayment,
} from "@/lib/plus/programmes";
import { ActionButton, AppBar, Card, CenterSpinner, EmptyState, useFeedback } from "../ui/vita";

const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;
const PROGRAMMES_KEY = "/api/v1/mobile/programmes";
const ENROLMENTS_KEY = "/api/v1/mobile/enrolments";

const TONES: Record<ReturnType<typeof stageTone>, { bg: string; fg: string }> = {
  // W12 fix: text colours come from theme tokens so the pills stay readable in dark mode.
  green: { bg: "color-mix(in srgb, #1d9e75 16%, transparent)", fg: "var(--vc-ok-ink)" },
  teal: { bg: "color-mix(in srgb, #2BB3A3 16%, transparent)", fg: "var(--vc-chip-teal-ink)" },
  amber: { bg: "var(--vc-warn-bg)", fg: "var(--vc-warn-ink)" },
  orange: { bg: "color-mix(in srgb, #E85D2F 16%, transparent)", fg: "var(--vc-chip-orange-ink)" },
  grey: { bg: navyA(0.08), fg: navyA(0.6) },
};

function useProgrammes() {
  return useResource<Programme[]>(PROGRAMMES_KEY, async () => listOf(await mobileRequest(PROGRAMMES_KEY + "/")).map(normalizeProgramme));
}

function useEnrolment(id: number) {
  const key = id ? `${ENROLMENTS_KEY}/${id}` : null;
  return useResource<Enrolment>(key, async () => normalizeEnrolment(await mobileRequest(`${ENROLMENTS_KEY}/${id}/`)));
}

function refreshProgrammeData() {
  // W13: joining, paying or leaving a programme changes what Home shows.
  invalidate(PROGRAMMES_KEY, ENROLMENTS_KEY, PROGRAMME_CONFIG_KEY);
}

export function StagePill({ stage }: { stage: MemberStage }) {
  const t = useT();
  const tone = TONES[stageTone(stage)];
  return (
    <span className="vita-chip" data-testid={`stage-${stage}`} style={{ background: tone.bg, color: tone.fg, whiteSpace: "nowrap", fontWeight: 800 }}>
      {t(`stage_${stage}`)}
    </span>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: `1px solid ${navyA(0.06)}` }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: navyA(0.55) }}>{label}</span>
      <span style={{ fontSize: strong ? 16 : 13, fontWeight: strong ? 800 : 700, color: strong ? "var(--vc-amount)" : "var(--vc-ink)", textAlign: "right", wordBreak: "break-word" }}>{value}</span>
    </div>
  );
}

function errorText(error: unknown, fallback: string) {
  return error instanceof MobileApiError && error.message ? error.message : fallback;
}

/* ───────── List ───────── */

function ProgrammeCard({ p, onOpen }: { p: Programme; onOpen: () => void }) {
  const t = useT();
  return (
    <Card onClick={onOpen} padding={16} style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{ width: 44, height: 44, flex: "none", borderRadius: 12, background: "var(--vc-tile-mint, #E6F6F3)", color: "var(--vc-navy)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Health size={22} color="currentColor" />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "var(--vc-ink)" }}>{p.name}</span>
            {p.pilot ? <span className="vita-chip" style={{ background: navyA(0.08), color: navyA(0.6) }}>{t("programme_pilot")}</span> : null}
          </span>
          <span style={{ display: "block", marginTop: 4, fontSize: 13, color: navyA(0.6), lineHeight: 1.4 }}>{p.description}</span>
          <span style={{ display: "block", marginTop: 8, fontSize: 12, fontWeight: 700, color: navyA(0.5) }}>
            {t("programme_weeks", { weeks: p.durationWeeks })} · {formatMoney(p.price)}
            {p.trialAvailable && !p.myEnrolment ? ` · ${t("programme_trial_days", { days: p.trialDays })}` : ""}
          </span>
          {p.myEnrolment ? (
            <span style={{ display: "block", marginTop: 10 }}>
              <StagePill stage={p.myEnrolment.stage} />
            </span>
          ) : null}
        </span>
      </div>
    </Card>
  );
}

export function ProgrammesScreen() {
  const t = useT();
  const { push } = usePlusPaths();
  const list = useProgrammes();
  const rows = list.data ?? [];
  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={t("programmes_title")} />
      {list.loading ? (
        <CenterSpinner />
      ) : list.error && !list.data ? (
        <div style={{ paddingTop: 100 }}>
          <EmptyState title={t("network_error")} subtitle={errorText(list.error, "")} actionLabel={t("retry")} onAction={() => list.reload()} actionIcon={<Refresh size={16} color="currentColor" />} />
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 28px" }}>
          <p style={{ margin: "4px 2px 16px", fontSize: 14, lineHeight: 1.45, color: navyA(0.6) }}>{t("programmes_intro")}</p>
          {rows.map((p) => (
            <ProgrammeCard key={p.code} p={p} onOpen={() => push(p.myEnrolment ? `/programmes/enrolments/${p.myEnrolment.id}` : `/programmes/${p.code}`)} />
          ))}
          {rows.some((p) => p.myEnrolment) ? null : <div style={{ height: 8 }} />}
          <button type="button" onClick={() => push("/programmes/mine")} style={{ width: "100%", marginTop: 8, padding: 14, borderRadius: 10, background: "var(--vc-surface)", display: "flex", alignItems: "center", gap: 10, color: "var(--vc-navy)", fontWeight: 700, fontSize: 14 }}>
            <People size={18} color="currentColor" />
            <span style={{ flex: 1, textAlign: "left" }}>{t("my_programmes")}</span>
            <span aria-hidden>›</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ───────── Detail ───────── */

export function ProgrammeDetailScreen({ code }: { code: string }) {
  const t = useT();
  const { push, replace } = usePlusPaths();
  const { toast } = useFeedback();
  const list = useProgrammes();
  const p = (list.data ?? []).find((x) => x.code === code) ?? null;

  const start = async (kind: "trial" | "enrol") => {
    try {
      const body = await mobileRequest(`/api/v1/mobile/programmes/${encodeURIComponent(code)}/${kind}`, { method: "POST", body: {} });
      const e = normalizeEnrolment(body);
      refreshProgrammeData();
      if (kind === "trial") toast(t("programme_started_trial"));
      replace(`/programmes/enrolments/${e.id}`);
    } catch (error) {
      toast(errorText(error, t("network_error")), { error: true });
      refreshProgrammeData();
    }
  };

  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={p?.name ?? t("programmes_title")} backTo="/programmes" />
      {list.loading ? (
        <CenterSpinner />
      ) : !p ? (
        <div style={{ paddingTop: 100 }}>
          <EmptyState title={t("network_error")} actionLabel={t("programmes_browse")} onAction={() => push("/programmes")} />
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 28px" }}>
          <Card padding={16} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: "var(--vc-ink)" }}>{p.name}</span>
              {p.pilot ? <span className="vita-chip" style={{ background: navyA(0.08), color: navyA(0.6) }}>{t("programme_pilot")}</span> : null}
            </div>
            <p style={{ margin: "8px 0 4px", fontSize: 14, lineHeight: 1.45, color: navyA(0.65) }}>{p.description}</p>
            <Row label={t("programme_price")} value={formatMoney(p.price)} strong />
            <Row label={t("programme_length")} value={t("programme_weeks", { weeks: p.durationWeeks })} />
            {p.trialAvailable ? <Row label={t("programme_trial")} value={t("programme_trial_days", { days: p.trialDays })} /> : null}
          </Card>
          <Card padding={16} style={{ marginBottom: 14 }}>
            <p style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 800, color: "var(--vc-navy)" }}>{t("programme_whats_included")}</p>
            {["programme_inc_coach", "programme_inc_path", "programme_inc_readings"].map((k) => (
              <div key={k} style={{ display: "flex", gap: 10, alignItems: "center", padding: "6px 0", fontSize: 14, color: "var(--vc-ink)" }}>
                <TickCircle size={18} color="#1d9e75" variant="Bold" />
                <span>{t(k)}</span>
              </div>
            ))}
          </Card>
          {p.needsTriage ? (
            <div style={{ display: "flex", gap: 10, padding: 12, marginBottom: 14, borderRadius: 10, background: "color-mix(in srgb, #2BB3A3 10%, transparent)", color: "var(--vc-navy)", fontSize: 13, lineHeight: 1.45 }}>
              <Health size={18} color="currentColor" style={{ flex: "none", marginTop: 1 }} />
              <span>{t("programme_needs_triage")}</span>
            </div>
          ) : null}
          {p.myEnrolment ? (
            <ActionButton full label={t("programme_open")} onClick={() => push(`/programmes/enrolments/${p.myEnrolment!.id}`)} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {p.trialAvailable ? <ActionButton full tone="teal" label={t("programme_start_trial", { days: p.trialDays })} onClick={() => start("trial")} /> : null}
              <ActionButton full label={t("programme_join_pay", { price: formatMoney(p.price) })} onClick={() => start("enrol")} />
              {!p.trialAvailable ? <p style={{ margin: "2px 0 0", textAlign: "center", fontSize: 12, color: navyA(0.5) }}>{t("programme_trial_used")}</p> : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ───────── Enrolment status ───────── */

function stageBody(t: ReturnType<typeof useT>, e: Enrolment) {
  return t(`stage_body_${e.stage}`, { days: e.trial?.daysLeft ?? 0 });
}

export function EnrolmentScreen({ id }: { id: number }) {
  const t = useT();
  const { push } = usePlusPaths();
  const { toast } = useFeedback();
  const res = useEnrolment(id);
  const e = res.data;

  const pay = async () => {
    if (!e) return;
    try {
      const key = `pwa-${e.id}-${Date.now().toString(36)}`;
      const body = await mobileRequest(`${ENROLMENTS_KEY}/${e.id}/payments`, { method: "POST", body: { idempotency_key: key } });
      const payment = normalizePayment(body);
      refreshProgrammeData();
      if (payment.checkoutUrl && !payment.testPayment) {
        window.open(payment.checkoutUrl, "_blank", "noopener");
      }
      push(`/programmes/enrolments/${e.id}/pay/${encodeURIComponent(payment.reference)}`);
    } catch (error) {
      toast(errorText(error, t("network_error")), { error: true });
    }
  };

  const receipts = e ? receiptPayments(e) : [];
  const open = e ? e.payments.find((p) => p.status === "initiated") : undefined;

  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={e?.programme.name ?? t("my_programmes")} backTo="/programmes/mine" />
      {res.loading ? (
        <CenterSpinner />
      ) : !e ? (
        <div style={{ paddingTop: 100 }}>
          <EmptyState title={t("network_error")} actionLabel={t("retry")} onAction={() => res.reload()} />
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 28px" }}>
          <Card padding={16} style={{ marginBottom: 14 }}>
            <StagePill stage={e.stage} />
            <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.45, fontWeight: 600, color: "var(--vc-ink)" }} data-testid="stage-body">
              {stageBody(t, e)}
            </p>
            {e.stage === "waiting_for_care_team" ? (
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                <Step done label={t("care_step_paid")} />
                <Step done={e.care.careTeamAssigned} label={t("care_step_team")} />
                <Step done={e.care.intakeDone} label={t("care_step_intake")} />
                <Step done={false} label={t("care_step_start")} />
              </div>
            ) : null}
            {e.stage === "active" && e.reviewDate ? <Row label={t("programme_review_date")} value={e.reviewDate} /> : null}
          </Card>

          {canPay(e) ? (
            <div style={{ marginBottom: 14 }}>
              {open ? (
                <ActionButton full tone="teal" label={t("payment_continue")} icon={<Clock size={16} color="currentColor" />} onClick={() => push(`/programmes/enrolments/${e.id}/pay/${encodeURIComponent(open.reference)}`)} />
              ) : (
                <ActionButton full label={t("programme_pay_now", { price: formatMoney(e.price) })} onClick={pay} />
              )}
            </div>
          ) : null}

          {receipts.length ? (
            <Card padding={16}>
              <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 800, color: "var(--vc-navy)" }}>{t("programme_payments")}</p>
              {receipts.map((p) => (
                <button
                  key={p.reference}
                  type="button"
                  onClick={() => push(`/programmes/enrolments/${e.id}/receipt/${encodeURIComponent(p.reference)}`)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 0", borderBottom: `1px solid ${navyA(0.06)}`, textAlign: "left", background: "transparent" }}
                >
                  <ReceiptItem size={20} color="var(--vc-navy)" />
                  <span style={{ flex: 1 }}>
                    <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: "var(--vc-ink)" }}>{p.receipt?.number}</span>
                    <span style={{ display: "block", fontSize: 12, color: navyA(0.5) }}>
                      {formatMoney(p)} · {kigaliDateTime(p.paidAt)}
                      {p.status === "refunded" ? ` · ${t("receipt_refunded")}` : ""}
                    </span>
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--vc-chip-teal-ink)" }}>{t("programme_view_receipt")}</span>
                </button>
              ))}
            </Card>
          ) : null}
        </div>
      )}
    </div>
  );
}

function Step({ done, label }: { done: boolean; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: done ? "var(--vc-ink)" : navyA(0.5) }}>
      <span style={{ width: 18, height: 18, borderRadius: "50%", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", background: done ? "#1d9e75" : "transparent", border: done ? "none" : `2px solid ${navyA(0.25)}` }}>
        {done ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg> : null}
      </span>
      {label}
    </div>
  );
}

/* ───────── Payment status (polling) ───────── */

export function PaymentStatusScreen({ id, reference }: { id: number; reference: string }) {
  const t = useT();
  const { push, replace } = usePlusPaths();
  const [payment, setPayment] = useState<ProgrammePayment | null>(null);
  const [enrolment, setEnrolment] = useState<Enrolment | null>(null);
  const [stopped, setStopped] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(Date.now());

  useEffect(() => {
    let live = true;
    let timer: number | undefined;
    const tick = async () => {
      try {
        const body = (await mobileRequest(`${ENROLMENTS_KEY}/${id}/payments/${encodeURIComponent(reference)}`)) as Record<string, unknown>;
        if (!live) return;
        const p = normalizePayment(body);
        setPayment(p);
        setEnrolment(body.enrolment ? normalizeEnrolment(body.enrolment) : null);
        setError(null);
        if (paymentSettled(p)) {
          refreshProgrammeData();
          return;
        }
      } catch (err) {
        if (!live) return;
        setError(errorText(err, t("network_error")));
      }
      const wait = nextPollMs(Date.now() - started.current);
      if (wait == null) {
        setStopped(true);
        return;
      }
      timer = window.setTimeout(tick, wait);
    };
    void tick();
    return () => {
      live = false;
      if (timer) window.clearTimeout(timer);
    };
  }, [id, reference, t]);

  const settled = payment ? paymentSettled(payment) : false;
  const paid = payment?.status === "paid";
  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={t("payment_status_title")} backTo={`/programmes/enrolments/${id}`} />
      {!payment && !error ? (
        <CenterSpinner label={t("payment_checking")} />
      ) : (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 28px" }}>
          <Card padding={20} style={{ textAlign: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
              {paid ? <TickCircle size={56} color="#1d9e75" variant="Bold" /> : settled ? <Warning2 size={56} color="#C2410C" variant="Bold" /> : <Clock size={56} color="#F5A623" variant="Bulk" />}
            </div>
            <p style={{ margin: 0, fontSize: 19, fontWeight: 800, color: "var(--vc-ink)" }} data-testid="payment-title">
              {paid ? t("payment_paid") : settled ? t("programme_payment_failed") : t("payment_waiting")}
            </p>
            <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.45, color: navyA(0.6) }}>
              {paid ? (enrolment ? t(`stage_body_${enrolment.stage}`, { days: enrolment.trial?.daysLeft ?? 0 }) : "") : settled ? t("payment_failed_body") : payment?.testPayment ? t("payment_test_waiting_body") : t("payment_waiting_body")}
            </p>
            {payment ? <p style={{ margin: "12px 0 0", fontSize: 22, fontWeight: 800, color: "var(--vc-amount)" }} data-testid="payment-amount">{formatMoney(payment)}</p> : null}
            {!settled && !stopped ? (
              <p style={{ margin: "10px 0 0", display: "flex", justifyContent: "center", alignItems: "center", gap: 6, fontSize: 12, color: navyA(0.5) }}>
                <span className="vita-dots" style={{ transform: "scale(0.6)" }}><i /><i /><i /></span>
                {t("payment_auto_update")}
              </p>
            ) : null}
            {paid && enrolment ? (
              <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
                <StagePill stage={enrolment.stage} />
              </div>
            ) : null}
          </Card>
          {payment?.testPayment && !settled ? (
            <div style={{ padding: 12, marginBottom: 14, borderRadius: 10, background: "var(--vc-warn-bg)", color: "var(--vc-warn-ink)", fontSize: 13, lineHeight: 1.45, fontWeight: 600 }} data-testid="test-payment-notice">
              {t("payment_test_notice")}
            </div>
          ) : null}
          {error ? <p style={{ margin: "0 0 12px", textAlign: "center", fontSize: 13, color: "var(--vc-bad-ink)" }}>{error}</p> : null}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {!settled && payment?.checkoutUrl && !payment.testPayment ? (
              <ActionButton full label={t("payment_open_irembo")} onClick={() => void window.open(payment.checkoutUrl!, "_blank", "noopener")} />
            ) : null}
            {paid ? <ActionButton full label={t("programme_view_receipt")} icon={<ReceiptItem size={16} color="currentColor" />} onClick={() => replace(`/programmes/enrolments/${id}/receipt/${encodeURIComponent(reference)}`)} /> : null}
            {settled && !paid ? <ActionButton full label={t("payment_try_again")} onClick={() => replace(`/programmes/enrolments/${id}`)} /> : null}
            {stopped && !settled ? <ActionButton full tone="teal" label={t("payment_check_again")} onClick={() => window.location.reload()} /> : null}
            <ActionButton full tone="white" label={t("my_programmes")} onClick={() => push("/programmes/mine")} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────── Receipt ───────── */

export function ReceiptScreen({ id, reference }: { id: number; reference: string }) {
  const t = useT();
  const { toast } = useFeedback();
  const res = useEnrolment(id);
  const e = res.data;
  const p = e?.payments.find((x) => x.reference === reference) ?? null;
  const r = p?.receipt ?? null;

  const download = async () => {
    try {
      const blob = await fetchProtectedBlob([`${ENROLMENTS_KEY}/${id}/payments/${encodeURIComponent(reference)}/receipt.pdf`]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vitaway-receipt-${r?.number ?? reference}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch {
      toast(t("receipt_download_failed"), { error: true });
    }
  };

  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={t("receipt_title")} backTo={`/programmes/enrolments/${id}`} />
      {res.loading ? (
        <CenterSpinner />
      ) : !p || !r ? (
        <div style={{ paddingTop: 100 }}>
          <EmptyState title={t("receipt_not_ready")} actionLabel={t("retry")} onAction={() => res.reload()} />
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 28px" }}>
          <Card padding={0} style={{ overflow: "hidden", marginBottom: 14 }}>
            <div style={{ background: "#0B4F57", color: "#fff", padding: "16px 18px" }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>Vitaway</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>{t("receipt_title")} · {r.number}</div>
            </div>
            <div style={{ padding: "6px 18px 14px" }}>
              {p.testPayment ? (
                <div style={{ margin: "10px 0 4px", padding: "8px 10px", borderRadius: 8, background: "var(--vc-warn-bg)", color: "var(--vc-warn-ink)", fontSize: 12, fontWeight: 700 }} data-testid="receipt-test-banner">{t("receipt_test")}</div>
              ) : null}
              {p.status === "refunded" ? (
                <div style={{ margin: "10px 0 4px", padding: "8px 10px", borderRadius: 8, background: "var(--vc-bad-bg)", color: "var(--vc-bad-ink)", fontSize: 12, fontWeight: 700 }}>
                  {t("receipt_refunded")} {kigaliDateTime(p.refundedAt)}
                </div>
              ) : null}
              <Row label={t("receipt_number")} value={r.number} />
              <Row label={t("receipt_programme")} value={r.description} />
              <Row label={t("receipt_amount")} value={formatMoney(r)} strong />
              <Row label={t("receipt_paid_on")} value={kigaliDateTime(r.paidAt)} />
              <Row label={t("receipt_method")} value={methodLabel(r.method, p.testPayment) === "test" ? t("receipt_method_test") : methodLabel(r.method, p.testPayment)} />
              <Row label={t("receipt_reference")} value={r.reference} />
              <Row label={t("receipt_issuer")} value={`${r.issuer.name}, ${r.issuer.country}`} />
            </div>
          </Card>
          {e ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, marginBottom: 14, borderRadius: 10, background: "var(--vc-surface)", border: "1px solid var(--vc-line)" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: navyA(0.6), flex: 1 }}>{t("receipt_programme_status")}</span>
              <StagePill stage={e.stage} />
            </div>
          ) : null}
          <ActionButton full label={t("receipt_download")} icon={<DocumentDownload size={16} color="currentColor" />} onClick={download} />
        </div>
      )}
    </div>
  );
}

/* ───────── My programmes (Account) ───────── */

export function MyProgrammesScreen() {
  const t = useT();
  const { push } = usePlusPaths();
  const res = useResource<Enrolment[]>(ENROLMENTS_KEY, async () => listOf(await mobileRequest(ENROLMENTS_KEY + "/")).map(normalizeEnrolment));
  const rows = res.data ?? [];
  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={t("my_programmes")} />
      {res.loading ? (
        <CenterSpinner />
      ) : !rows.length ? (
        <div style={{ paddingTop: 80 }}>
          <EmptyState title={t("my_programmes_empty")} actionLabel={t("programmes_browse")} onAction={() => push("/programmes")} />
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 28px" }}>
          {rows.map((e) => (
            <Card key={e.id} padding={16} style={{ marginBottom: 12 }} onClick={() => push(`/programmes/enrolments/${e.id}`)}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ flex: 1, fontSize: 16, fontWeight: 800, color: "var(--vc-ink)" }}>{e.programme.name}</span>
                <StagePill stage={e.stage} />
              </div>
              <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.45, color: navyA(0.6) }}>{stageBody(t, e)}</p>
            </Card>
          ))}
          <ActionButton full tone="white" label={t("programmes_browse")} onClick={() => push("/programmes")} />
        </div>
      )}
    </div>
  );
}

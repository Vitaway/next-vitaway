"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Clock, Crown1, ReceiptItem, TickCircle, Warning2 } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { useBack } from "@/lib/plus/nav";
import { asList, mobileRequest, MobileApiError } from "@/lib/plus/client/api";
import { useMe, useSubscription } from "@/lib/plus/client/data";
import { invalidate } from "@/lib/plus/client/use-resource";
import { ActionButton, AppBar, Card, CenterSpinner, DotSpinner, Modal, useFeedback } from "../ui/vita";

const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;
const ACCENT = "#2BB3A3";
const PAY_STASH = "vitaway.plus.payment";

type PlanOption = {
  planId: number;
  price: number;
  listPrice: number | null;
  titleKey: string;
  subtitleKey: string;
  priceSuffixKey: string;
  badgeKey?: string;
  label: string | null;
  suffixText: string | null;
  kind: "plan" | "service" | "package";
  refId: string;
  code: string;
};

const DEFAULT_PLANS: Array<Pick<PlanOption, "planId" | "price" | "titleKey" | "subtitleKey" | "priceSuffixKey" | "badgeKey">> = [
  { planId: 2, price: 5000, titleKey: "monthly", subtitleKey: "plans_renews_month", priceSuffixKey: "frw_per_month" },
  { planId: 3, price: 15000, titleKey: "quaterly", subtitleKey: "plans_renews_quarter", priceSuffixKey: "frw_per_quarter", badgeKey: "most_popular" },
  { planId: 4, price: 60000, titleKey: "yearly", subtitleKey: "plans_renews_year", priceSuffixKey: "frw_per_year", badgeKey: "plans_best_value" },
];
const APP_CODES = new Set(["monthly", "quarterly", "yearly"]);

const money = (v: unknown): number => {
  if (typeof v === "number") return Math.round(v);
  return Number.parseInt(String(v ?? "").split(".")[0].replace(/[^0-9]/g, ""), 10) || 0;
};
export const priceLabel = (n: number) => n.toLocaleString("en-US");
const monthsFor = (d: number) => (d >= 360 ? 12 : Math.min(120, Math.max(1, Math.round(d / 30))));
const suffixFor = (d: number) => (monthsFor(d) === 12 ? "frw_per_year" : monthsFor(d) === 3 ? "frw_per_quarter" : "frw_per_month");
const suffixText = (d: number) => ([1, 3, 12].includes(monthsFor(d)) ? null : `/${monthsFor(d)} months`);
const codeFor = (id: number) => (id === 2 ? "monthly" : id === 3 ? "quarterly" : id === 4 ? "yearly" : "");
const partnerName = (raw: string) => (raw.trim().toLowerCase().replace(/[\s_-]+/g, "") === "mirafood" ? "MiraFood" : raw.trim());

/** pricing.dart _applyPlanRows */
function applyPlanRows(body: Array<Record<string, unknown>>): PlanOption[] {
  const next: PlanOption[] = [];
  for (const row of body) {
    const id = Math.round(Number(row.id)) || 0;
    const price = money(row.price);
    const kind = String(row.kind ?? "plan").trim();
    const fromOrg = row.kind != null;
    const refId = String(row.ref_id ?? "").trim();
    if (price <= 0) continue;
    const code = String(row.code ?? "").trim().toLowerCase();
    const isApp = APP_CODES.has(code) || (id >= 2 && id <= 4);
    if (!fromOrg && (id === 0 || !isApp)) continue;
    if (fromOrg && kind === "plan" && id === 0) continue;
    if (fromOrg && kind !== "plan" && kind !== "service" && kind !== "package") continue;
    const list = money(row.list_price);
    const known = kind === "plan" ? DEFAULT_PLANS.find((p) => p.planId === id) : undefined;
    const name = String(row.name ?? "").trim();
    const duration = Math.round(Number(row.duration ?? 30)) || 30;
    next.push({
      planId: id,
      price,
      listPrice: list > price ? list : null,
      titleKey: known?.titleKey ?? "monthly",
      subtitleKey: known?.subtitleKey ?? "plans_renews_month",
      priceSuffixKey: known?.priceSuffixKey ?? suffixFor(duration),
      badgeKey: known?.badgeKey,
      label: (fromOrg || !known) && name ? name : null,
      suffixText: kind === "plan" ? (!known ? suffixText(duration) : null) : "",
      kind: kind as PlanOption["kind"],
      refId: refId || String(id),
      code: code || (known ? codeFor(id) : ""),
    });
  }
  return next;
}

export type PaymentRequest = { planId?: number | null; packageId?: number | null; serviceId?: string | null; price: number; planTitle?: string; renews?: string; promoCode?: string };

export function stashPayment(req: PaymentRequest) {
  try {
    sessionStorage.setItem(PAY_STASH, JSON.stringify(req));
  } catch {
    /* ignore */
  }
}

function PlanCard({ plan, selected, onClick }: { plan: PlanOption; selected: boolean; onClick: () => void }) {
  const t = useT();
  const suffix = plan.suffixText ?? t(plan.priceSuffixKey);
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ width: "100%", marginBottom: 12, padding: 14, borderRadius: 10, textAlign: "left", border: selected ? `1.8px solid ${ACCENT}` : `1px solid ${navyA(0.08)}`, background: selected ? "color-mix(in srgb, #2BB3A3 6%, var(--vc-surface))" : "var(--vc-surface)", transition: "all 220ms cubic-bezier(.2,.8,.2,1)", display: "flex", gap: 12, alignItems: "flex-start" }}
    >
      <span style={{ width: 22, height: 22, marginTop: 2, flex: "none", borderRadius: "50%", border: `2px solid ${selected ? ACCENT : navyA(0.25)}`, background: selected ? ACCENT : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {selected ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg> : null}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ flex: 1, fontSize: 16, fontWeight: 800, color: "var(--vc-ink)" }}>{plan.label ?? t(plan.titleKey)}</span>
          {plan.badgeKey ? <span style={{ padding: "3px 8px", borderRadius: 999, background: ACCENT, color: "#fff", fontSize: 10, fontWeight: 800 }}>{t(plan.badgeKey)}</span> : null}
        </span>
        {plan.kind === "plan" ? <span style={{ display: "block", marginTop: 2, fontSize: 12, fontWeight: 600, color: navyA(0.5) }}>{t(plan.subtitleKey)}</span> : null}
      </span>
      <span style={{ textAlign: "right", flex: "none" }}>
        {plan.listPrice ? <span style={{ display: "block", fontSize: 12, fontWeight: 700, textDecoration: "line-through", color: navyA(0.4) }}>{priceLabel(plan.listPrice)}</span> : null}
        <span style={{ display: "block", fontSize: 18, fontWeight: 800, color: "var(--vc-ink)" }}>{priceLabel(plan.price)}</span>
        <span style={{ display: "block", fontSize: 11, fontWeight: 600, color: navyA(0.45) }}>RWF{suffix}</span>
      </span>
    </button>
  );
}

/** pricing.dart PlansPage (web: IremboPay only, no App Store). */
export function PlansScreen() {
  const t = useT();
  const { push, replace } = usePlusPaths();
  const { toast } = useFeedback();
  const { user } = useMe();
  const sub = useSubscription();
  const [plans, setPlans] = useState<PlanOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(0);
  const [startingTrial, setStartingTrial] = useState(false);

  useEffect(() => {
    let live = true;
    mobileRequest("/api/v1/mobile/activity/plans")
      .then((body) => {
        if (!live) return;
        setPlans(applyPlanRows(asList<Record<string, unknown>>(body)));
        setSelected(0);
      })
      .catch(() => undefined)
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, []);

  const orgName = partnerName(user?.organization?.name ?? "");
  const orgOff = Number(user?.organization?.discount_pct ?? 0) || 0;
  const pricedDown = plans.some((p) => (p.listPrice ?? 0) > p.price);
  const orgPrice = pricedDown || (orgOff > 0 && Boolean(orgName));
  const subscribed = sub.active;
  const onTrial = sub.onTrial;
  const paidActive = subscribed && !onTrial;
  const days = sub.daysLeft;
  const daysUnit = days === 1 ? t("day_one") : t("days");
  const current = plans.length ? plans[Math.min(selected, plans.length - 1)] : null;
  const planName = current ? current.label ?? t(current.titleKey) : "";
  const sellTrial = !orgPrice && sub.canTrial;
  const cta = paidActive ? t("plan_already_activated") : sellTrial ? t("plans_start_trial") : t("plans_continue", { plan: planName, price: priceLabel(current?.price ?? 0) });

  const subscribe = async () => {
    if (sub.active && !sub.onTrial) return toast(t("plan_already_activated"));
    if (!orgOff && sub.canTrial) {
      setStartingTrial(true);
      const today = new Date();
      const end = new Date(today.getTime() + 14 * 86_400_000);
      const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      try {
        await mobileRequest("/subscriptions/", { method: "POST", body: { plan: 1, user: user?.id, start_date: ymd(today), end_date: ymd(end) } });
        invalidate("/subscriptions/", "/me/");
        toast(t("plan_activated"));
        replace("/home");
      } catch (error) {
        await sub.reload();
        const body = error instanceof MobileApiError ? (error.body as { detail?: unknown } | undefined) : undefined;
        toast(String(body?.detail ?? "").toLowerCase().includes("already") ? t("trial_already_used") : t("trial_start_failed"), { error: true });
      } finally {
        setStartingTrial(false);
      }
      return;
    }
    if (!current) return;
    const title = current.label ?? t(current.titleKey);
    stashPayment({
      planId: current.kind === "plan" ? current.planId : null,
      packageId: current.kind === "package" ? Number.parseInt(current.refId, 10) || null : null,
      serviceId: current.kind === "service" ? current.refId : null,
      planTitle: title,
      renews: current.kind === "plan" ? t(current.subtitleKey) : title,
      price: current.price,
    });
    push("/payment");
  };

  const features = [t("consultation"), t("chat_video"), t("personal_coach"), t("safe_group")];
  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={t("plans")} />
      {loading || sub.loading ? (
        <CenterSpinner />
      ) : (
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px calc(env(safe-area-inset-bottom) + 28px)", maxWidth: 640, width: "100%", margin: "0 auto" }}>
          <h2 style={{ margin: 0, textAlign: "center", fontSize: 24, fontWeight: 800, letterSpacing: -0.6, color: "var(--vc-navy)" }}>{t("plans_elevate_title")}</h2>
          {orgName ? <p style={{ margin: "8px 0 0", textAlign: "center", fontSize: 14, fontWeight: 800, color: ACCENT }}>{orgOff > 0 ? t("org_discount", { name: orgName, percent: orgOff }) : t("org_with", { name: orgName })}</p> : null}
          <p style={{ margin: "8px 0 0", textAlign: "center", fontSize: 14, lineHeight: 1.45, color: navyA(0.55) }}>
            {onTrial ? `${t("trial_ends")}${days} ${daysUnit}` : subscribed ? `${t("sub_expires")}${days} ${daysUnit}` : orgPrice ? t("org_prices", { name: orgName }) : t("plans_elevate_body")}
          </p>
          {onTrial ? <p style={{ margin: "6px 0 0", textAlign: "center", fontSize: 13, color: navyA(0.55) }}>{t("plans_trial_stays")}</p> : null}
          <div style={{ height: 18 }} />
          {paidActive ? (
            <div style={{ padding: 16, borderRadius: 10, background: "var(--vc-tile-mint)", border: `1px solid ${navyA(0.08)}` }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "var(--vc-navy)" }}>{t("home_sub_active")}</div>
              <div style={{ marginTop: 4, fontSize: 13, fontWeight: 600, color: navyA(0.6) }}>{t("home_days_left", { days: `${days} ${daysUnit}` })}</div>
            </div>
          ) : (
            <>
              {onTrial ? (
                <div style={{ padding: 16, marginBottom: 16, borderRadius: 10, background: "var(--vc-surface)" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "var(--vc-navy)" }}>{t("home_trial_includes")}</div>
                  {features.map((f) => (
                    <div key={f} style={{ display: "flex", gap: 10, marginTop: 10, fontSize: 14, color: "var(--vc-ink)" }}>
                      <TickCircle size={18} color={ACCENT} />
                      {f}
                    </div>
                  ))}
                </div>
              ) : sellTrial ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", marginBottom: 16, borderRadius: 8, background: "color-mix(in srgb, #2BB3A3 12%, transparent)" }}>
                  <Crown1 size={20} color={ACCENT} />
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "var(--vc-navy)" }}>{t("plans_trial_included")}</span>
                </div>
              ) : null}
              {plans.length > 1 ? <div style={{ marginBottom: 10, fontSize: 15, fontWeight: 800, color: "var(--vc-navy)" }}>{t("plans_how_pay")}</div> : null}
              {!plans.length && orgName ? <p style={{ margin: "0 0 12px", textAlign: "center", fontWeight: 600, color: navyA(0.55) }}>{orgName} has not turned any prices on yet.</p> : null}
              {plans.map((p, i) => (
                <PlanCard key={`${p.kind}-${p.refId}`} plan={p} selected={selected === i} onClick={() => setSelected(i)} />
              ))}
            </>
          )}
          <p style={{ margin: "12px 0 16px", textAlign: "center", fontSize: 12, lineHeight: 1.4, color: navyA(0.4) }}>{t("plans_legal_note")}</p>
          {plans.length ? <ActionButton full label={cta} loading={startingTrial} disabled={paidActive || startingTrial} onClick={() => void subscribe()} style={{ background: ACCENT }} /> : null}
        </div>
      )}
    </div>
  );
}

type Txn = { id: number; reference?: string; amount?: unknown; status?: string; created_at?: string; plan?: { name?: string } | null };

/** payment.dart paymentSessionPayload + iremboCheckout */
function checkoutUrl(decoded: unknown): string | null {
  if (!decoded || typeof decoded !== "object") return null;
  const root = decoded as Record<string, unknown>;
  const data = (root.invoice_number != null || root.payment_url != null ? root : (root.response ?? root.data ?? root)) as Record<string, unknown>;
  const invoice = String(data.invoice_number ?? data.invoice ?? "").trim();
  if (/^\d{6,}$/.test(invoice)) return `https://checkout.irembopay.com/${invoice}`;
  const raw = String(data.payment_url ?? data.payment_link ?? "").trim();
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (u.host === "checkout.irembopay.com") {
      const last = u.pathname.split("/").filter(Boolean).pop() ?? "";
      return /^\d{6,}$/.test(last) ? `https://checkout.irembopay.com/${last}` : `${u.origin}${u.pathname}`;
    }
    for (const key of ["invoice", "invoice_number", "invoiceNumber"]) {
      const v = u.searchParams.get(key)?.trim() ?? "";
      if (/^\d{6,}$/.test(v)) return `https://checkout.irembopay.com/${v}`;
    }
  } catch {
    /* bad url */
  }
  return null;
}

/** payment.dart: create an IremboPay session, open checkout, poll /latest-transaction. */
export function PaymentScreen() {
  const t = useT();
  const goBack = useBack("/plans");
  const { replace } = usePlusPaths();
  const [req, setReq] = useState<PaymentRequest | null>(null);
  const [ready, setReady] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [checkout, setCheckout] = useState<string | null>(null);
  const [status, setStatus] = useState("Preparing payment...");
  const [polling, setPolling] = useState(false);
  const [txn, setTxn] = useState<Txn | null>(null);
  const [failed, setFailed] = useState<Txn | null>(null);
  const [openingHome, setOpeningHome] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = useRef(0);
  const MAX = 60;

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(PAY_STASH);
      if (raw) setReq(JSON.parse(raw) as PaymentRequest);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setPolling(false);
  }, []);

  const goHome = useCallback(async () => {
    stop();
    setOpeningHome(true);
    invalidate("/subscriptions/", "/me/", "/transactions/", "/api/user-reservations/", "/notifications/");
    replace("/home");
  }, [replace, stop]);

  const poll = useCallback(async () => {
    count.current += 1;
    try {
      const data = await mobileRequest<{ success?: boolean; found?: boolean; continue_polling?: boolean; transaction?: Txn }>("/latest-transaction");
      if (data?.success && data.found && data.transaction) {
        const tx = data.transaction;
        setTxn(tx);
        if (tx.status === "completed") return void goHome();
        if (tx.status === "failed") {
          setStatus("Payment failed ❌");
          setFailed(tx);
          stop();
          return;
        }
        setStatus("Payment is being processed... ⏳");
        if (!data.continue_polling) stop();
      } else {
        setStatus(`Waiting for payment confirmation... (${count.current}/${MAX})`);
        if (!data?.continue_polling || count.current >= MAX) {
          stop();
          setStatus("Payment verification timeout. Please check your payment status manually.");
        }
      }
    } catch (error) {
      if (count.current >= 5) {
        stop();
        setStatus(error instanceof MobileApiError && error.status === 0 ? "Network error. Please check your connection and payment status." : "Unable to verify payment status. Please check manually.");
      }
    }
  }, [goHome, stop]);

  const start = useCallback(() => {
    if (timer.current) return;
    count.current = 0;
    setPolling(true);
    setStatus("Checking payment status...");
    timer.current = setInterval(() => void poll(), 5000);
    void poll();
  }, [poll]);

  useEffect(() => () => stop(), [stop]);
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible" && launched && checkout) start();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [launched, checkout, start]);

  const launch = async () => {
    if (!req) return;
    setLaunched(true);
    setStatus("Preparing payment...");
    const path = req.serviceId ? `/payment/service/${req.serviceId}/create-session/` : req.packageId ? `/payment/package/${req.packageId}/create-session/` : `/payment/${req.planId}/create-session/`;
    // Open the tab inside the click so the browser allows it; point it at checkout once the session exists.
    const tab = typeof window !== "undefined" ? window.open("about:blank", "_blank") : null;
    if (tab) tab.opener = null;
    try {
      const decoded = await mobileRequest(path, { method: "POST", body: req.promoCode?.trim() ? { promo_code: req.promoCode.trim() } : {} });
      const url = checkoutUrl(decoded);
      if (!url) {
        tab?.close();
        setLaunched(false);
        setStatus("Payment could not be opened.");
        return;
      }
      setCheckout(url);
      if (tab) tab.location.href = url;
      setStatus("Complete your payment");
      setTimeout(start, 3000);
    } catch (error) {
      tab?.close();
      const body = error instanceof MobileApiError ? (error.body as { message?: unknown } | undefined) : undefined;
      const msg = error instanceof MobileApiError && error.status === 0 ? "Network error. Please check your connection." : typeof body?.message === "string" && body.message.trim() ? body.message.trim() : "Could not start payment. Please try again.";
      setStatus(msg);
    }
  };

  if (!ready) return <div className="vita-page"><AppBar title={t("payment")} /><CenterSpinner /></div>;
  const title = req?.planTitle ?? "Your plan";
  const icon = polling ? (
    <DotSpinner />
  ) : txn?.status === "completed" ? (
    <TickCircle size={52} color="#2FBF71" variant="Bold" />
  ) : txn?.status === "failed" ? (
    <Warning2 size={52} color="var(--vc-danger)" />
  ) : (
    <Clock size={52} color="var(--vc-navy)" />
  );
  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={t("payment")} actions={polling ? <span style={{ color: "#fff", display: "inline-flex" }}><DotSpinner /></span> : undefined} />
      {openingHome ? (
        <CenterSpinner />
      ) : !req ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 24 }}>
          <p style={{ margin: 0, color: navyA(0.6), fontWeight: 600 }}>Choose a plan first.</p>
          <ActionButton label={t("plans")} onClick={() => replace("/plans")} />
        </div>
      ) : !launched ? (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: navyA(0.55) }}>Your plan</span>
            <button type="button" onClick={goBack} style={{ fontSize: 14, fontWeight: 700, color: ACCENT }}>Change</button>
          </div>
          <div style={{ marginTop: 6, fontSize: 22, fontWeight: 800, color: "var(--vc-navy)" }}>{title}</div>
          <div style={{ marginTop: 4, fontSize: 18, fontWeight: 800, color: "var(--vc-navy)" }}>{req.price} RWF</div>
          {req.renews ? <div style={{ marginTop: 4, fontSize: 13, color: navyA(0.55) }}>{req.renews}. Cancel anytime.</div> : null}
          <p style={{ margin: "28px 0 12px", textAlign: "center", fontSize: 12, fontWeight: 600, color: navyA(0.45) }}>Secure payment by IremboPay</p>
          <ActionButton full label={`Pay ${req.price} RWF`} onClick={() => void launch()} />
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px", display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 640, width: "100%", margin: "0 auto" }}>
          <div style={{ width: 96, height: 96, borderRadius: "50%", background: "var(--vc-tile-mint)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vc-navy)" }}>{icon}</div>
          <p style={{ margin: "16px 0 0", textAlign: "center", fontSize: 16, fontWeight: 700, color: "var(--vc-navy)" }}>{status}</p>
          {req.promoCode?.trim() ? <p style={{ margin: "6px 0 0", fontSize: 13, color: navyA(0.7) }}>Promo {req.promoCode.trim().toUpperCase()} · {req.price} RWF</p> : null}
          {checkout ? (
            <a href={checkout} target="_blank" rel="noopener noreferrer" style={{ marginTop: 12, fontSize: 14, fontWeight: 700, color: ACCENT }}>
              Open IremboPay checkout
            </a>
          ) : null}
          {txn ? (
            <Card style={{ width: "100%", marginTop: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <ReceiptItem size={18} color="var(--vc-navy)" />
                <span style={{ fontSize: 15, fontWeight: 800, color: "var(--vc-navy)" }}>Transaction details</span>
              </div>
              {[
                ["Reference", txn.reference ?? ""],
                ["Amount", `${priceLabel(money(txn.amount))} RWF`],
                ["Status", txn.status ?? "pending"],
                ["Date", txn.created_at ? new Date(txn.created_at).toLocaleString() : ""],
                ...(txn.plan?.name ? [["Plan", txn.plan.name]] : []),
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", padding: "6px 0", fontSize: 13 }}>
                  <span style={{ flex: 1, color: navyA(0.55), fontWeight: 600 }}>{k}</span>
                  <span style={{ color: "var(--vc-ink)", fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </Card>
          ) : null}
          <div style={{ width: "100%", marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            {!checkout && !polling ? (
              <ActionButton full label="Try again" onClick={() => void launch()} />
            ) : (
              <>
                {!polling && !txn ? <ActionButton full label="Check Payment Status" onClick={start} /> : null}
                {polling ? <ActionButton full tone="white" label="Stop Checking" onClick={stop} /> : null}
                {txn?.status === "completed" ? <ActionButton full label="Continue" onClick={() => void goHome()} /> : null}
                {txn?.status === "failed" ? (
                  <>
                    <ActionButton full label="Try Again" onClick={start} />
                    <ActionButton full tone="white" label="Cancel" onClick={goBack} />
                  </>
                ) : null}
              </>
            )}
          </div>
        </div>
      )}
      <Modal
        open={Boolean(failed)}
        compact
        title="Payment failed"
        actions={
          <>
            <ActionButton small tone="white" label="Cancel" onClick={() => { setFailed(null); goBack(); }} />
            <ActionButton small label="Try again" onClick={() => setFailed(null)} />
          </>
        }
      >
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45, color: "var(--vc-ink)" }}>Your payment could not be processed. Please try again or contact support if the problem persists.</p>
        <p style={{ margin: "10px 0 0", fontSize: 13, fontWeight: 700, color: navyA(0.6) }}>Reference: {failed?.reference ?? ""}</p>
      </Modal>
    </div>
  );
}

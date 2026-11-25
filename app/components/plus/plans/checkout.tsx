"use client";

/**
 * Checkout panel (23 Nov 2026), shared by the plan payment screen and the programme enrolment screen.
 * Layout follows the boss's reference: a total-price card with dark line items, the ways to pay as
 * option cards, a "safe and secure" card and one big Continue button. Phones stack it (total first);
 * from 900px the payment options sit on the left and the total / security / button on the right.
 *
 * IremboPay's hosted checkout is where the member actually picks MoMo, Airtel Money, card or bank,
 * so the options here say what can be used there; they are not choices the app sends on.
 */
import { ArrowRight3, Bank, Card as CardIcon, Lock, Mobile } from "@/lib/plus/icons";
import { useT } from "@/lib/plus/i18n";
import { ActionButton } from "../ui/vita";

export type CheckoutLine = { label: string; amount: string; note?: string | null };

export function CheckoutPanel({
  total,
  currency = "RWF",
  lines,
  onContinue,
  onChange,
  continueLabel,
  busy = false,
  disabled = false,
}: {
  total: string;
  currency?: string;
  lines: CheckoutLine[];
  onContinue: () => void;
  onChange?: () => void;
  continueLabel?: string;
  busy?: boolean;
  disabled?: boolean;
}) {
  const t = useT();
  const methods = [
    { key: "momo", title: t("pay_method_momo"), body: t("pay_method_momo_body"), tint: "#FFF1CC", ink: "#7A5600", icon: <Mobile size={22} color="currentColor" /> },
    { key: "airtel", title: t("pay_method_airtel"), body: t("pay_method_airtel_body"), tint: "#FDE4E2", ink: "#B42318", icon: <Mobile size={22} color="currentColor" /> },
    { key: "card", title: t("pay_method_card"), body: t("pay_method_card_body"), tint: "#E1F1F6", ink: "#003E48", icon: <CardIcon size={22} color="currentColor" /> },
    { key: "bank", title: t("pay_method_bank"), body: t("pay_method_bank_body"), tint: "#E3F6F1", ink: "#003E48", icon: <Bank size={22} color="currentColor" /> },
  ];
  return (
    <div className="vita-checkout" data-testid="checkout-panel">
      <section className="vita-co-total" aria-label={t("pay_total")}>
        <p className="lbl">{t("pay_total")}</p>
        <p className="amt">
          {total} <small>{currency}</small>
        </p>
        <div className="lines">
          {lines.map((line) => (
            <div className="line" key={line.label}>
              <span className="nm">
                {line.label}
                {line.note ? <small>{line.note}</small> : null}
              </span>
              <span className="v">{line.amount}</span>
            </div>
          ))}
        </div>
        {onChange ? (
          <button type="button" className="vita-co-change" onClick={onChange}>
            {t("pay_change_plan")}
          </button>
        ) : null}
      </section>

      <section className="vita-co-methods" aria-label={t("pay_methods_title")}>
        <p className="vita-co-head">{t("pay_methods_title")}</p>
        {methods.map((m) => (
          <div className="vita-co-method" key={m.key}>
            <span className="ic" style={{ background: m.tint, color: m.ink }}>
              {m.icon}
            </span>
            <span className="tx">
              <b>{m.title}</b>
              <span>{m.body}</span>
            </span>
          </div>
        ))}
      </section>

      <section className="vita-co-secure">
        <span className="ic">
          <Lock size={30} color="currentColor" />
        </span>
        <p>{t("pay_secure_body")}</p>
      </section>

      <div className="vita-co-cta">
        <ActionButton full label={continueLabel ?? t("pay_continue_irembo")} loading={busy} disabled={disabled || busy} icon={<ArrowRight3 size={18} color="currentColor" />} onClick={onContinue} />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Sms, User } from "iconsax-react";
import { usePlusAuth } from "@/lib/plus/auth-context";
import { nextAuthPath } from "@/lib/plus/auth-flow";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { useT } from "@/lib/plus/i18n";
import { mobileRequest, MobileApiError } from "@/lib/plus/client/api";
import { sessionFromMobilePayload } from "@/lib/plus/mobile-auth";
import PlusLoading from "../plus-loading";
import { ActionButton, useFeedback } from "../ui/vita";
import { AuthField } from "../ui/fields";
import { AuthHeader, AuthScreen, Gap, friendlyAuthError } from "../auth/auth-ui";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MAILBOX = "@phone.vitaway.local";

function partnerName(raw: string): string {
  const trimmed = raw.trim();
  return trimmed.toLowerCase().replace(/[\s_-]+/g, "") === "mirafood" ? "MiraFood" : trimmed;
}

/** Pages/auth/account_details.dart: phone sign-ups add their name (and an email if they have one). */
export default function AccountDetailsScreen() {
  const t = useT();
  const { toast } = useFeedback();
  const { session, ready, completeSignIn } = usePlusAuth();
  const { replace } = usePlusPaths();
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!session) replace("/signin");
    else if (nextAuthPath(session) !== "/account-details") replace(nextAuthPath(session));
  }, [ready, session, replace]);

  useEffect(() => {
    const current = session?.user.email?.trim() ?? "";
    if (current && !current.toLowerCase().includes(MAILBOX)) setEmail(current);
    // Only seed once per account.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.id]);

  if (!ready || !session || nextAuthPath(session) !== "/account-details") return <PlusLoading label="Opening Vitaway Plus…" />;

  const nameError = tried && first.trim().length < 2 ? t("name_too_short") : null;
  const mail = email.trim();
  const emailError = mail && (!EMAIL.test(mail) || mail.toLowerCase().endsWith(MAILBOX)) ? t("invalid_email") : null;

  const org = partnerName(session.organizationName ?? "");
  const subtitle = !org
    ? t("your_details_body")
    : (session.organizationDiscount ?? 0) > 0
      ? t("org_discount").replaceAll("{name}", org).replaceAll("{percent}", String(session.organizationDiscount))
      : t("org_with").replaceAll("{name}", org);

  const save = async () => {
    setTried(true);
    if (first.trim().length < 2 || emailError || saving) return;
    setSaving(true);
    setError(null);
    try {
      const data = await mobileRequest<Record<string, unknown>>("/update_profile/", {
        method: "POST",
        body: { first_name: first.trim(), last_name: last.trim(), email: mail, contact_saved: true },
      });
      const fresh = sessionFromMobilePayload({ ...data, token: session.mobileToken });
      const next = { ...session, ...fresh, token: session.token, verified: session.verified ?? fresh.verified, needsContact: false };
      completeSignIn(next);
      replace(nextAuthPath(next));
    } catch (err) {
      const message =
        err instanceof MobileApiError && err.status === 0 ? t("network_error") : friendlyAuthError(t, err instanceof Error ? err.message : String(err), "signup_failed");
      setError(message);
      toast(message, { error: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthScreen>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <AuthHeader title={t("your_details_title")} subtitle={subtitle} error={error} />
        <Gap h={28} />
        <AuthField label={t("first_name")} required hint={t("first_name")} icon={<User size={22} color="currentColor" />} autoComplete="given-name" value={first} onChange={setFirst} error={nameError} />
        <Gap h={16} />
        <AuthField label={t("last_name")} hint={t("last_name")} icon={<User size={22} color="currentColor" />} autoComplete="family-name" value={last} onChange={setLast} />
        <Gap h={16} />
        <AuthField
          label={t("email")}
          hint={t("email")}
          icon={<Sms size={22} color="currentColor" />}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          onEnter={() => void save()}
          error={emailError}
        />
        <Gap h={36} />
        <ActionButton full type="submit" label={t("continue")} loading={saving} />
      </form>
    </AuthScreen>
  );
}

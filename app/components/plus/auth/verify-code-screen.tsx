"use client";

import { useEffect, useState } from "react";
import { MdCheck } from "react-icons/md";
import { usePlusAuth } from "@/lib/plus/auth-context";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { useT } from "@/lib/plus/i18n";
import { confirmAccountVerification, resendAccountVerification } from "@/lib/plus/mobile-auth";
import PlusLoading from "../plus-loading";
import { ActionButton, useFeedback } from "../ui/vita";
import { AuthHeader, AuthScreen, AuthTextButton, CodeField, Gap } from "./auth-ui";

/** Pages/account/account_verification_code_input.dart VerifyAccountCodeInput (/verify-code). */
export default function VerifyCodeScreen() {
  const t = useT();
  const { toast } = useFeedback();
  const { session, ready, completeSignIn, signOut } = usePlusAuth();
  const { replace } = usePlusPaths();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!session) replace("/signin");
    else if (session.verified !== false) replace("/home");
  }, [ready, session, replace]);

  if (!ready || !session || session.verified !== false) return <PlusLoading label="Opening Vitaway Plus…" />;

  const email = session.user.email ?? "";
  const onPhone = email.endsWith("@phone.vitaway.local");
  const subtitle = onPhone
    ? `${t("phone_code_body")} ${session.phone ?? ""}`
    : `${t("verification_code_body")} ${email}`;

  const goHome = () => {
    completeSignIn({ ...session, verified: true });
    replace("/home");
  };

  const goToSignIn = async () => {
    await signOut();
    replace("/signin");
  };

  const confirm = async () => {
    if (busy) return;
    if (code.trim().length !== 6) {
      toast("Please enter the full 6-digit code", { error: true });
      return;
    }
    setBusy(true);
    try {
      await confirmAccountVerification(session.mobileToken, code.trim());
      toast("Account verification successful");
      goHome();
    } catch (err) {
      toast(err instanceof Error && err.message && !err.message.startsWith("HTTP") ? err.message : "Failed to verify account, check code", { error: true });
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setResending(true);
    try {
      const result = await resendAccountVerification(session.mobileToken, email);
      if (result.alreadyVerified) {
        goHome();
        return;
      }
      toast("A new verification code has been sent");
    } catch (err) {
      toast(err instanceof Error && err.message ? err.message : "Unable to resend verification code", { error: true });
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthScreen onBack={() => void goToSignIn()}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void confirm();
        }}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <AuthHeader title={t("enter_verification_code")} subtitle={subtitle} />
        <Gap h={8} />
        <p style={{ margin: 0, textAlign: "center", fontSize: 13, color: "var(--vc-ink)", opacity: 0.6 }}>{t("code_expires")}</p>
        <Gap h={28} />
        <CodeField value={code} onChange={setCode} onEnter={() => void confirm()} />
        <Gap h={24} />
        <ActionButton full type="submit" label={t("confirm")} loading={busy} icon={<MdCheck size={16} />} />
        <Gap h={8} />
        <AuthTextButton label={t("resend_code")} busy={resending} disabled={resending || busy} onClick={() => void resend()} />
        <AuthTextButton label={t("back_to_sign_in")} onClick={() => void goToSignIn()} />
      </form>
    </AuthScreen>
  );
}

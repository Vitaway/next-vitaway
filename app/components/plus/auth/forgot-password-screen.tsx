"use client";

import { useEffect, useState } from "react";
import { Call, Lock, Mobile, Sms } from "iconsax-react";
import { MdCheck, MdSend } from "react-icons/md";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { useT } from "@/lib/plus/i18n";
import { DIAL_COUNTRIES, dialCountryByIso, isValidNationalNumber, phoneE164, type DialCountry } from "@/lib/plus/dial-countries";
import { confirmPasswordReset, MobileAuthError, requestPasswordReset, validateResetCode } from "@/lib/plus/mobile-auth";
import { useBack } from "@/lib/plus/nav";
import { ActionButton, useFeedback } from "../ui/vita";
import { AuthField } from "../ui/fields";
import { AuthHeader, AuthOrDivider, AuthScreen, AuthSwitchRow, CodeField, CountryDialButton, EyeToggle, Gap, friendlyAuthError, takePrefill } from "./auth-ui";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type Step = "request" | "code" | "reset";

/**
 * forgot_password.dart → verification.dart → reset.dart. The reset token the
 * API returns is held in component state only (never in the URL or storage).
 */
export default function ForgotPasswordScreen() {
  const t = useT();
  const { toast } = useFeedback();
  const { replace } = usePlusPaths();
  const back = useBack("/signin");
  const [step, setStep] = useState<Step>("request");
  const [phoneMode, setPhoneMode] = useState(false);
  const [country, setCountry] = useState<DialCountry>(DIAL_COUNTRIES[0]);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [token, setToken] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [hide1, setHide1] = useState(true);
  const [hide2, setHide2] = useState(true);

  useEffect(() => {
    const prefill = takePrefill();
    if (!prefill) return;
    setPhoneMode(prefill.phoneMode);
    setCountry(dialCountryByIso(prefill.country));
    setValue(prefill.value);
  }, []);

  const goBack = () => {
    if (step === "code") setStep("request");
    else if (step === "reset") setStep("code");
    else back();
  };

  /* Step 1: forgot_password.dart */
  const requestValid = phoneMode ? isValidNationalNumber(country, value) : EMAIL.test(value.trim());
  const fieldError = !value.trim()
    ? null
    : phoneMode
      ? isValidNationalNumber(country, value)
        ? null
        : t("invalid_phone")
      : EMAIL.test(value.trim())
        ? null
        : t("invalid_email");

  const readable = (reason: string): string | null => {
    const text = reason.replace(/^[a-z_]+:\s*/, "").trim();
    if (!text || text.length > 200 || text.startsWith("<") || text.startsWith("{")) return null;
    return text;
  };

  const sendCode = async () => {
    if (!requestValid || busy) return;
    setBusy(true);
    setError(null);
    const phone = phoneMode ? phoneE164(country, value) : null;
    try {
      const resetToken = await requestPasswordReset(phone ? { phone_number: phone } : { email: value.trim() });
      setToken(resetToken);
      setSentTo(phone ?? value.trim());
      setCode("");
      setCodeError(null);
      setStep("code");
    } catch (err) {
      const status = err instanceof MobileAuthError ? err.statusCode ?? 0 : 0;
      if (status === 0 || status >= 502) {
        setError(t("server_unreachable"));
      } else {
        const reason = err instanceof Error ? err.message : String(err);
        setError(
          reason.toLowerCase().includes("no user found")
            ? t(phoneMode ? "reset_no_account_phone" : "reset_no_account_email")
            : readable(reason) ?? friendlyAuthError(t, reason, "reset_failed"),
        );
      }
    } finally {
      setBusy(false);
    }
  };

  /* Step 2: verification.dart */
  const verify = async () => {
    if (busy) return;
    if (!code.trim()) {
      setCodeError(t("code_required"));
      return;
    }
    if (code.trim().length < 6) {
      setCodeError("Please enter the full 6-digit code");
      return;
    }
    setCodeError(null);
    setBusy(true);
    try {
      await validateResetCode(code.trim());
      setPassword("");
      setConfirm("");
      setStep("reset");
    } catch (err) {
      toast(err instanceof Error && err.message ? err.message : "Verification failed", { error: true });
    } finally {
      setBusy(false);
    }
  };

  /* Step 3: reset.dart */
  const resetValid = password.length >= 8 && confirm === password;
  const reset = async () => {
    if (!resetValid || busy) return;
    setBusy(true);
    try {
      await confirmPasswordReset(token, password, confirm);
      setToken("");
      toast(t("password_reset_success"));
      replace("/signin");
    } catch (err) {
      toast(err instanceof Error && err.message ? err.message : "Reset failed", { error: true });
    } finally {
      setBusy(false);
    }
  };

  if (step === "code") {
    return (
      <AuthScreen onBack={goBack}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void verify();
          }}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <AuthHeader
            title={t(phoneMode ? "check_phone" : "check_email")}
            subtitle={`${t(phoneMode ? "phone_code_body" : "verification_code_body")} ${sentTo}`}
          />
          <Gap h={28} />
          <CodeField value={code} onChange={setCode} onEnter={() => void verify()} error={codeError} />
          <Gap h={28} />
          <ActionButton full type="submit" label={t("verify")} loading={busy} icon={<MdCheck size={16} />} />
        </form>
      </AuthScreen>
    );
  }

  if (step === "reset") {
    return (
      <AuthScreen onBack={goBack}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void reset();
          }}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <AuthHeader title={t("set_new_password")} subtitle={t("set_new_password_subtitle")} />
          <Gap h={28} />
          <AuthField
            label={t("new_password")}
            required
            hint={t("new_password")}
            icon={<Lock size={22} color="currentColor" />}
            type={hide1 ? "password" : "text"}
            autoComplete="new-password"
            value={password}
            onChange={setPassword}
            error={password && password.length < 8 ? t("password_too_short") : null}
            suffix={<EyeToggle visible={!hide1} onToggle={() => setHide1((v) => !v)} />}
          />
          <Gap h={16} />
          <AuthField
            label={t("confirm_new_password")}
            required
            hint={t("confirm_new_password")}
            icon={<Lock size={22} color="currentColor" />}
            type={hide2 ? "password" : "text"}
            autoComplete="new-password"
            value={confirm}
            onChange={setConfirm}
            onEnter={() => void reset()}
            error={confirm && confirm !== password ? t("no_match") : null}
            suffix={<EyeToggle visible={!hide2} onToggle={() => setHide2((v) => !v)} />}
          />
          <Gap h={28} />
          <ActionButton full type="submit" label={t("reset_password")} loading={busy} disabled={!resetValid} icon={<MdCheck size={16} />} />
        </form>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen onBack={goBack}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void sendCode();
        }}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <AuthHeader title={t("reset_password")} subtitle={t(phoneMode ? "reset_password_phone_subtitle" : "reset_password_subtitle")} error={error} />
        <Gap h={28} />
        <ActionButton
          full
          label={phoneMode ? t("sign_up_with_email") : t("sign_in_phone")}
          icon={phoneMode ? <Sms size={16} color="currentColor" /> : <Call size={16} color="currentColor" />}
          disabled={busy}
          onClick={() => {
            setPhoneMode((v) => !v);
            setError(null);
            setValue("");
          }}
        />
        <Gap h={22} />
        <AuthOrDivider label={t("or_continue")} />
        <Gap h={22} />
        <AuthField
          key={phoneMode ? "phone" : "email"}
          label={phoneMode ? t("phone") : t("email")}
          required
          hint={phoneMode ? "788 123 456" : t("email")}
          icon={phoneMode ? <Mobile size={22} color="currentColor" /> : <Sms size={22} color="currentColor" />}
          leading={phoneMode ? <CountryDialButton country={country} onChange={setCountry} /> : undefined}
          type={phoneMode ? "tel" : "email"}
          inputMode={phoneMode ? "tel" : "email"}
          autoComplete={phoneMode ? "tel-national" : "email"}
          value={value}
          onChange={setValue}
          onEnter={() => void sendCode()}
          error={fieldError}
        />
        <Gap h={28} />
        <ActionButton full type="submit" label={t("send_reset_code")} loading={busy} disabled={!requestValid} icon={<MdSend size={16} />} />
        <Gap h={20} />
        <AuthSwitchRow prompt={t("remember_password")} action={t("sign_in")} onClick={() => back()} />
      </form>
    </AuthScreen>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Call, Lock, Mobile, Sms } from "iconsax-react";
import { MdArrowForward } from "react-icons/md";
import { usePlusAuth } from "@/lib/plus/auth-context";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { useT } from "@/lib/plus/i18n";
import { DIAL_COUNTRIES, dialCountryByIso, isValidNationalNumber, phoneE164, type DialCountry } from "@/lib/plus/dial-countries";
import { linkMirafood, MobileAuthError, passwordLogin, signup, type AccountExists, type Identifier } from "@/lib/plus/mobile-auth";
import { ActionButton, useFeedback } from "../ui/vita";
import { AuthField } from "../ui/fields";
import {
  AuthHeader,
  AuthOrDivider,
  AuthScreen,
  AuthSwitchRow,
  CountryDialButton,
  EyeToggle,
  Gap,
  friendlyAuthError,
  savePrefill,
  takePrefill,
} from "./auth-ui";
import { afterSignInPath } from "./login-screen";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Pages/auth/register.dart RegisterPage. */
export default function RegisterScreen() {
  const t = useT();
  const { toast } = useFeedback();
  const { completeSignIn } = usePlusAuth();
  const { replace, push } = usePlusPaths();
  const [usePhone, setUsePhone] = useState(false);
  const [country, setCountry] = useState<DialCountry>(DIAL_COUNTRIES[0]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [existingNext, setExistingNext] = useState<string | null>(null);
  const [emailConflict, setEmailConflict] = useState(false);

  useEffect(() => {
    const prefill = takePrefill();
    if (!prefill) return;
    setUsePhone(prefill.phoneMode);
    setCountry(dialCountryByIso(prefill.country));
    if (prefill.phoneMode) setPhone(prefill.value);
    else setEmail(prefill.value);
  }, []);

  const clearConflict = () => {
    setFormError(null);
    setExistingNext(null);
    setEmailConflict(false);
  };

  const digits = phone.replace(/\D/g, "");
  const emailError = email.trim() && !EMAIL.test(email.trim()) ? t("invalid_email") : emailConflict ? t("email_in_use") : null;
  const phoneError = digits && !isValidNationalNumber(country, digits) ? t("phone_invalid") : null;
  const passwordError = password && password.length < 8 ? t("password_too_short") : null;
  const valid = password.length >= 8 && (usePhone ? isValidNationalNumber(country, digits) : EMAIL.test(email.trim()));

  const id = (): Identifier => (usePhone ? { phone_number: phoneE164(country, digits) } : { email: email.trim() });

  const signInExisting = async (existing: AccountExists): Promise<boolean> => {
    try {
      const session = existing.mirafood ? await linkMirafood(id(), password) : await passwordLogin(id(), password);
      completeSignIn(session);
      replace(afterSignInPath(session));
      return true;
    } catch {
      return false;
    }
  };

  const showFormError = (raw: string, fallbackKey = "signup_failed") => {
    const message = friendlyAuthError(t, raw, fallbackKey);
    setFormError(message);
    toast(message, { error: true });
  };

  const submit = async () => {
    if (!valid || busy) return;
    setBusy(true);
    clearConflict();
    try {
      const result = await signup(id(), password);
      completeSignIn(result.session);
      if (result.codeSent) toast(t(result.onPhone ? "phone_code_sent" : "email_code_sent"));
      else toast(t(result.onPhone ? "phone_code_failed" : "email_code_failed"), { error: true });
      replace("/verify-code");
    } catch (err) {
      if (err instanceof MobileAuthError && err.accountExists) {
        const existing = err.accountExists;
        if (existing.next !== "set_password" && (await signInExisting(existing))) return;
        setExistingNext(existing.next);
        setEmailConflict(!usePhone);
        setFormError(
          existing.next === "set_password" ? t("clinic_account_exists") : usePhone ? t("phone_already_exists") : t("email_already_exists"),
        );
        return;
      }
      const network = err instanceof MobileAuthError && err.statusCode === 0;
      showFormError(network ? "network" : err instanceof Error ? err.message : String(err), network ? "network_error" : "signup_failed");
    } finally {
      setBusy(false);
    }
  };

  const openSignIn = () => {
    savePrefill({ phoneMode: usePhone, value: usePhone ? digits : email.trim(), country: country.iso });
    push("/signin");
  };

  const openSetPassword = () => {
    savePrefill({ phoneMode: usePhone, value: usePhone ? digits : email.trim(), country: country.iso });
    push("/forgot-password");
  };

  return (
    <AuthScreen>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <AuthHeader
          title={t("sign_up_title")}
          error={formError}
          errorAction={existingNext == null ? null : existingNext === "set_password" ? t("set_my_password") : t("sign_in_instead")}
          onErrorAction={existingNext == null ? null : existingNext === "set_password" ? openSetPassword : openSignIn}
          errorSecondary={existingNext != null && existingNext !== "set_password" ? t(usePhone ? "use_different_phone" : "use_different_email") : null}
          onErrorSecondary={
            existingNext != null && existingNext !== "set_password"
              ? () => {
                  setEmail("");
                  setPhone("");
                  clearConflict();
                }
              : null
          }
        />
        <Gap h={28} />
        <ActionButton
          full
          label={usePhone ? t("sign_up_with_email") : t("sign_up_with_phone")}
          icon={usePhone ? <Sms size={16} color="currentColor" /> : <Call size={16} color="currentColor" />}
          disabled={busy}
          onClick={() => {
            setUsePhone((value) => !value);
            clearConflict();
          }}
        />
        <Gap h={22} />
        <AuthOrDivider label={t("or_continue")} />
        <Gap h={22} />
        {usePhone ? (
          <AuthField
            key="phone"
            label={t("phone")}
            required
            hint="788 123 456"
            icon={<Mobile size={22} color="currentColor" />}
            leading={<CountryDialButton country={country} onChange={setCountry} />}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            value={phone}
            onChange={(value) => {
              setPhone(value);
              if (formError || existingNext) clearConflict();
            }}
            error={phoneError}
          />
        ) : (
          <AuthField
            key="email"
            label={t("email")}
            required
            hint={t("email")}
            icon={<Sms size={22} color="currentColor" />}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(value) => {
              setEmail(value);
              if (formError || existingNext || emailConflict) clearConflict();
            }}
            error={emailError}
          />
        )}
        <Gap h={16} />
        <AuthField
          label={t("password")}
          required
          hint={t("password")}
          icon={<Lock size={22} color="currentColor" />}
          type={hidePassword ? "password" : "text"}
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          onEnter={() => void submit()}
          error={passwordError}
          suffix={<EyeToggle visible={!hidePassword} onToggle={() => setHidePassword((value) => !value)} />}
        />
        <Gap h={36} />
        <ActionButton full type="submit" label={t("sign_up")} loading={busy} disabled={!valid} icon={<MdArrowForward size={16} />} />
        <Gap h={16} />
        <AuthSwitchRow prompt={t("have_account")} action={t("sign_in")} onClick={openSignIn} />
      </form>
    </AuthScreen>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Call, Lock, Mobile, Sms } from "iconsax-react";
import { MdLogin } from "react-icons/md";
import { usePlusAuth } from "@/lib/plus/auth-context";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { useT } from "@/lib/plus/i18n";
import { DIAL_COUNTRIES, dialCountryByIso, isValidNationalNumber, phoneE164, type DialCountry } from "@/lib/plus/dial-countries";
import { googleSignIn, linkMirafood, MobileAuthError, passwordLogin, type Identifier } from "@/lib/plus/mobile-auth";
import type { PlusSession } from "@/lib/plus/session";
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
  GoogleGlyph,
  SocialAuthButton,
  friendlyAuthError,
  savePrefill,
  takePrefill,
} from "./auth-ui";
import { googleClientId, requestGoogleAccessToken } from "./google";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Where the Flutter router sends a freshly signed-in account. */
export function afterSignInPath(session: PlusSession): string {
  if (session.verified === false) return "/verify-code";
  return "/home";
}

/** Pages/auth/login.dart LoginPage. */
export default function LoginScreen() {
  const t = useT();
  const { toast } = useFeedback();
  const { completeSignIn, signInNotice } = usePlusAuth();
  const { replace, push } = usePlusPaths();
  const [phoneMode, setPhoneMode] = useState(false);
  const [country, setCountry] = useState<DialCountry>(DIAL_COUNTRIES[0]);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  useEffect(() => {
    const prefill = takePrefill();
    if (!prefill) return;
    setPhoneMode(prefill.phoneMode);
    setCountry(dialCountryByIso(prefill.country));
    setIdentifier(prefill.value);
  }, []);

  const finish = (session: PlusSession) => {
    completeSignIn(session);
    toast(t("login_success"));
    replace(afterSignInPath(session));
  };

  const id = (): Identifier => (phoneMode ? { phone_number: phoneE164(country, identifier) } : { email: identifier.trim() });

  const handleLogin = async () => {
    if (busy) return;
    if (phoneMode) {
      if (!isValidNationalNumber(country, identifier)) {
        toast(t("phone_invalid"), { error: true });
        return;
      }
    } else if (!identifier.trim()) {
      toast(t("empty_email"));
      return;
    } else if (!EMAIL.test(identifier.trim())) {
      toast("Please enter a valid email address", { error: true });
      return;
    }
    if (!password) {
      toast(t("empty_password"));
      return;
    }
    setBusy(true);
    setFormError(null);
    try {
      finish(await passwordLogin(id(), password));
    } catch (err) {
      try {
        finish(await linkMirafood(id(), password));
        return;
      } catch {
        /* not a MiraFood account either */
      }
      const raw = err instanceof MobileAuthError ? err.message : String(err);
      const network = err instanceof MobileAuthError && err.statusCode === 0;
      const message = friendlyAuthError(t, network ? "network" : raw, network ? "network_error" : "invalid_credentials");
      setFormError(message);
      toast(message, { error: true });
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    if (!googleClientId()) {
      toast("Google sign-in isn't set up for the web app yet. Use email or phone for now.", { error: true });
      return;
    }
    setGoogleBusy(true);
    try {
      const accessToken = await requestGoogleAccessToken();
      if (!accessToken) {
        toast(t("google_sign_in_error"), { error: true });
        return;
      }
      finish(await googleSignIn(accessToken));
    } catch (err) {
      const raw = err instanceof Error ? err.message : String(err);
      toast(friendlyAuthError(t, raw, "google_sign_in_error"), { error: true });
    } finally {
      setGoogleBusy(false);
    }
  };

  const openForgot = () => {
    savePrefill({ phoneMode, value: identifier.trim(), country: country.iso });
    push("/forgot-password");
  };

  return (
    <AuthScreen>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void handleLogin();
        }}
        style={{ display: "flex", flexDirection: "column", flex: 1 }}
      >
        <AuthHeader title={t("welcome_back")} error={formError ?? signInNotice} />
        <Gap h={28} />
        <ActionButton
          full
          tone="teal"
          label={phoneMode ? t("sign_up_with_email") : t("sign_in_phone")}
          icon={phoneMode ? <Sms size={16} color="currentColor" /> : <Call size={16} color="currentColor" />}
          onClick={() => {
            setPhoneMode((value) => !value);
            setFormError(null);
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
          name={phoneMode ? "phone" : "email"}
          value={identifier}
          onChange={setIdentifier}
        />
        <Gap h={12} />
        <AuthField
          label={t("password")}
          required
          hint={t("password")}
          icon={<Lock size={22} color="currentColor" />}
          type={hidePassword ? "password" : "text"}
          autoComplete="current-password"
          name="password"
          value={password}
          onChange={setPassword}
          onEnter={() => void handleLogin()}
          suffix={<EyeToggle visible={!hidePassword} onToggle={() => setHidePassword((value) => !value)} />}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="button" className="vita-auth-text" onClick={openForgot} style={{ padding: "8px 8px", marginRight: -8, fontSize: 14, fontWeight: 600, color: "var(--vc-navy)" }}>
            {t("forgot_password")}
          </button>
        </div>
        <Gap h={28} />
        <ActionButton full type="submit" label={t("sign_in")} loading={busy} icon={<MdLogin size={16} />} />
        <div style={{ flex: 1, minHeight: 24 }} />
        <SocialAuthButton label={t("sign_in_google")} icon={<GoogleGlyph />} loading={googleBusy} onClick={() => void handleGoogle()} />
        <Gap h={20} />
        <AuthSwitchRow prompt={t("no_account")} action={t("sign_up")} onClick={() => push("/register")} />
        <Gap h={8} />
        <p style={{ margin: 0, textAlign: "center", fontSize: 12, lineHeight: 1.45, color: "rgba(var(--vc-navy-rgb),0.45)" }}>
          {t("agreements")}
          <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" style={{ color: "var(--vc-navy)", fontWeight: 600 }}>
            {t("terms_of_use")}
          </a>
          {` ${t("and")} `}
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--vc-navy)", fontWeight: 600 }}>
            {t("privacy_policy")}
          </a>
        </p>
      </form>
    </AuthScreen>
  );
}

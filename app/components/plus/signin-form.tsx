"use client";

import { FormEvent, useState } from "react";
import { APIError } from "@/lib/api/client";
import PhoneInput from "@/app/components/inputs/PhoneInput";
import {
  confirmStaffSecondFactor,
  requestPhoneOtp,
  verifyPhoneOtp,
} from "@/lib/plus/auth-api";
import { usePlusAuth } from "@/lib/plus/auth-context";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { isValidFullPhone } from "@/lib/phone";
import Logo from "@/app/components/logo";

type Step = "phone" | "code" | "second";

export default function SignInForm() {
  const { completeSignIn, signInNotice } = usePlusAuth();
  const { replace } = usePlusPaths();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [secondCode, setSecondCode] = useState("");
  const [challengeToken, setChallengeToken] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const fail = (err: unknown, fallback: string) => {
    setError(err instanceof APIError ? err.message : fallback);
  };

  const requestCode = async (event?: FormEvent) => {
    event?.preventDefault();
    setError(null);
    if (!isValidFullPhone(phone)) {
      setError("Enter a valid Rwandan mobile number.");
      return;
    }
    setPending(true);
    try {
      const result = await requestPhoneOtp(phone);
      setNotice(result.message);
      setCode("");
      setStep("code");
    } catch (err) {
      fail(err, "Could not send the sign-in code. Please try again.");
    } finally {
      setPending(false);
    }
  };

  const verifyCode = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!/^\d{6}$/.test(code.trim())) {
      setError("Enter the 6-digit code.");
      return;
    }
    setPending(true);
    try {
      const result = await verifyPhoneOtp(phone, code.trim());
      if (result.kind === "staff_setup") {
        setChallengeToken(result.challengeToken);
        setNotice(result.message);
        setSecondCode("");
        setStep("second");
        return;
      }
      completeSignIn(result.session);
      replace("/home");
    } catch (err) {
      fail(err, "Could not verify that code. Please try again.");
    } finally {
      setPending(false);
    }
  };

  const verifySecond = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!/^\d{6}$/.test(secondCode.trim())) {
      setError("Enter the 6-digit code.");
      return;
    }
    setPending(true);
    try {
      const session = await confirmStaffSecondFactor(challengeToken, secondCode.trim(), phone);
      completeSignIn(session);
      replace("/home");
    } catch (err) {
      fail(err, "Could not verify the second code. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <Logo className="h-14 w-auto" />
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-[#003E48]">
        Sign in to <span className="font-accent">Vitaway Plus</span>
      </h1>
      <p className="mt-2 text-sm text-[#003E48]/70">
        Use your Rwandan mobile number. We will send a one-time code by WhatsApp or SMS.
      </p>
      {signInNotice ? <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">{signInNotice}</p> : null}

      {step === "phone" && (
        <form onSubmit={requestCode} className="mt-6">
          <PhoneInput label="Mobile number" required value={phone} onChange={setPhone} compact />
          {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}
          <button type="submit" className="press-btn mt-6 w-full" disabled={pending}>
            {pending ? "Sending code…" : "Send code"}
          </button>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={verifyCode} className="mt-6 space-y-4">
          {notice ? <p className="text-sm text-[#003E48]/80">{notice}</p> : null}
          <label className="block">
            <span className="text-sm font-semibold text-[#003E48]">6-digit code</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{6}"
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              className="mt-2 block w-full rounded-2xl border border-transparent bg-white px-4 py-3 text-lg tracking-[0.3em] text-[#003E48] caret-[#003E48] focus:border-[#003E48] focus:outline-none"
              placeholder="••••••"
            />
          </label>
          {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
          <button type="submit" className="press-btn w-full" disabled={pending}>
            {pending ? "Verifying…" : "Continue"}
          </button>
          <button
            type="button"
            className="w-full text-sm font-semibold text-[#003E48]/70 underline-offset-2 hover:underline disabled:opacity-50"
            onClick={() => requestCode()}
            disabled={pending}
          >
            Resend code
          </button>
          <button
            type="button"
            className="w-full text-sm text-[#003E48]/60"
            onClick={() => {
              setStep("phone");
              setError(null);
              setNotice(null);
            }}
          >
            Use a different number
          </button>
        </form>
      )}

      {step === "second" && (
        <form onSubmit={verifySecond} className="mt-6 space-y-4">
          {notice ? <p className="text-sm text-[#003E48]/80">{notice}</p> : null}
          <label className="block">
            <span className="text-sm font-semibold text-[#003E48]">Second sign-in code</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{6}"
              maxLength={6}
              value={secondCode}
              onChange={(event) => setSecondCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              className="mt-2 block w-full rounded-2xl border border-transparent bg-white px-4 py-3 text-lg tracking-[0.3em] text-[#003E48] caret-[#003E48] focus:border-[#003E48] focus:outline-none"
              placeholder="••••••"
            />
          </label>
          {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
          <button type="submit" className="press-btn w-full" disabled={pending}>
            {pending ? "Verifying…" : "Finish sign-in"}
          </button>
        </form>
      )}
    </div>
  );
}

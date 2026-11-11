"use client";

import SignedOutGate from "@/app/components/plus/auth/auth-gate";
import PhoneCodeForm from "@/app/components/plus/auth/phone-code-form";

/** Phone + one-time code sign-in (staff second factor included). Not part of the Flutter login screen. */
export default function PhoneCodeSignInPage() {
  return (
    <SignedOutGate>
      <div className="flex min-h-dvh flex-col bg-[#F6F3EE] px-5 pb-24 pt-[max(2rem,env(safe-area-inset-top))]">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          <PhoneCodeForm />
        </div>
      </div>
    </SignedOutGate>
  );
}

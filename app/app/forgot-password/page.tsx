"use client";

import SignedOutGate from "@/app/components/plus/auth/auth-gate";
import ForgotPasswordScreen from "@/app/components/plus/auth/forgot-password-screen";

export default function Page() {
  return (
    <SignedOutGate>
      <ForgotPasswordScreen />
    </SignedOutGate>
  );
}

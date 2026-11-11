"use client";

import SignedOutGate from "@/app/components/plus/auth/auth-gate";
import LoginScreen from "@/app/components/plus/auth/login-screen";

export default function SignInPage() {
  return (
    <SignedOutGate>
      <LoginScreen />
    </SignedOutGate>
  );
}

"use client";

import SignedOutGate from "@/app/components/plus/auth/auth-gate";
import RegisterScreen from "@/app/components/plus/auth/register-screen";

export default function Page() {
  return (
    <SignedOutGate>
      <RegisterScreen />
    </SignedOutGate>
  );
}

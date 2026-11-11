"use client";

import SignedOutGate from "@/app/components/plus/auth/auth-gate";
import OnboardingSlides from "@/app/components/plus/onboarding/onboarding-slides";

export default function OnboardingPage() {
  return (
    <SignedOutGate>
      <OnboardingSlides />
    </SignedOutGate>
  );
}

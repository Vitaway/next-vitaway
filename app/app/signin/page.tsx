"use client";

import { useEffect } from "react";
import SignInForm from "@/app/components/plus/signin-form";
import PlusLoading from "@/app/components/plus/plus-loading";
import { usePlusAuth } from "@/lib/plus/auth-context";
import { usePlusPaths } from "@/lib/plus/plus-paths";

export default function SignInPage() {
  const { session, ready } = usePlusAuth();
  const { replace } = usePlusPaths();

  useEffect(() => {
    if (ready && session) replace("/today");
  }, [ready, session, replace]);

  if (!ready || session) {
    return <PlusLoading label="Opening sign-in…" />;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#F6F3EE] px-5 pb-24 pt-[max(2rem,env(safe-area-inset-top))]">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <SignInForm />
      </div>
    </div>
  );
}

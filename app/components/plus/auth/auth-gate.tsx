"use client";

import { useEffect } from "react";
import { usePlusAuth } from "@/lib/plus/auth-context";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import PlusLoading from "../plus-loading";
import { afterSignInPath } from "./login-screen";

/** Signed-out screens: a signed-in visitor goes on to verify-code or home, as the Flutter router does. */
export default function SignedOutGate({ children }: { children: React.ReactNode }) {
  const { session, ready } = usePlusAuth();
  const { replace } = usePlusPaths();

  useEffect(() => {
    if (ready && session) replace(afterSignInPath(session));
  }, [ready, session, replace]);

  if (!ready || session) return <PlusLoading label="Opening sign-in…" />;
  return <>{children}</>;
}

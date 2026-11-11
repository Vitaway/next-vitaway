"use client";

import { useEffect } from "react";
import { usePlusAuth } from "./auth-context";
import { nextAuthPath } from "./auth-flow";
import { usePlusPaths } from "./plus-paths";
import type { PlusSession } from "./session";

/**
 * Keep a signed-in screen on its Flutter route. Shows the page once the
 * session belongs here; otherwise replace()s away so the splash cannot linger.
 */
export function useAuthGate(expectedPath: string, signedOutPath = "/signin"): {
  session: PlusSession | null;
  ready: boolean;
  allowed: boolean;
} {
  const { session, ready } = usePlusAuth();
  const { replace } = usePlusPaths();
  const dest = !session ? signedOutPath : nextAuthPath(session);

  useEffect(() => {
    if (!ready) return;
    if (dest !== expectedPath) replace(dest);
  }, [ready, dest, expectedPath, replace]);

  return {
    session,
    ready,
    allowed: Boolean(ready && session && dest === expectedPath),
  };
}

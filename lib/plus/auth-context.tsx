"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { logoutPlus } from "./auth-api";
import { setUnauthorizedHandler } from "./client/api";
import { clearResourceCache } from "./client/use-resource";
import {
  clearPlusSession,
  hasStaleSession,
  loadPlusSession,
  savePlusSession,
  type PlusSession,
} from "./session";

type PlusAuthValue = {
  session: PlusSession | null;
  ready: boolean;
  /** Set when a saved session had to be dropped and the person must sign in again. */
  signInNotice: string | null;
  completeSignIn: (session: PlusSession) => void;
  signOut: () => Promise<void>;
};

const PlusAuthContext = createContext<PlusAuthValue | null>(null);

export function PlusAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<PlusSession | null>(null);
  const [ready, setReady] = useState(false);
  const [signInNotice, setSignInNotice] = useState<string | null>(null);

  useEffect(() => {
    if (hasStaleSession()) {
      clearPlusSession();
      setSignInNotice("Please sign in again to open the updated app.");
    }
    setSession(loadPlusSession());
    setReady(true);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearPlusSession();
      clearResourceCache();
      setSession(null);
      setSignInNotice("Your session ended. Please sign in again.");
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const completeSignIn = useCallback((next: PlusSession) => {
    savePlusSession(next);
    setSignInNotice(null);
    setSession(next);
  }, []);

  const signOut = useCallback(async () => {
    const token = session?.token;
    clearPlusSession();
    clearResourceCache();
    setSession(null);
    if (token) await logoutPlus(token);
  }, [session?.token]);

  const value = useMemo(
    () => ({ session, ready, signInNotice, completeSignIn, signOut }),
    [session, ready, signInNotice, completeSignIn, signOut],
  );

  return <PlusAuthContext.Provider value={value}>{children}</PlusAuthContext.Provider>;
}

export function usePlusAuth(): PlusAuthValue {
  const value = useContext(PlusAuthContext);
  if (!value) {
    throw new Error("usePlusAuth must be used within PlusAuthProvider");
  }
  return value;
}

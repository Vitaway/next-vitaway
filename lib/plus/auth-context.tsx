"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { logoutPlus } from "./auth-api";
import {
  clearPlusSession,
  loadPlusSession,
  savePlusSession,
  type PlusSession,
} from "./session";

type PlusAuthValue = {
  session: PlusSession | null;
  ready: boolean;
  completeSignIn: (session: PlusSession) => void;
  signOut: () => Promise<void>;
};

const PlusAuthContext = createContext<PlusAuthValue | null>(null);

export function PlusAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<PlusSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(loadPlusSession());
    setReady(true);
  }, []);

  const completeSignIn = useCallback((next: PlusSession) => {
    savePlusSession(next);
    setSession(next);
  }, []);

  const signOut = useCallback(async () => {
    const token = session?.token;
    clearPlusSession();
    setSession(null);
    if (token) await logoutPlus(token);
  }, [session?.token]);

  const value = useMemo(
    () => ({ session, ready, completeSignIn, signOut }),
    [session, ready, completeSignIn, signOut],
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

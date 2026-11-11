"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { logoutPlus } from "./auth-api";
import { setUnauthorizedHandler } from "./client/api";
import { clearResourceCache } from "./client/use-resource";
import { refreshSessionFromMe } from "./mobile-auth";
import {
  clearPlusSession,
  hasStaleSession,
  isStaffPrimaryDoor,
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

function flagsNeedServer(session: PlusSession): boolean {
  return Boolean(session.mobileToken) && !isStaffPrimaryDoor(session.primaryDoor) && typeof session.hasCompletedProfile !== "boolean";
}

export function PlusAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<PlusSession | null>(null);
  const [ready, setReady] = useState(false);
  const [signInNotice, setSignInNotice] = useState<string | null>(null);
  const generation = useRef(0);

  const dropSession = useCallback((notice: string) => {
    clearPlusSession();
    clearResourceCache();
    setSession(null);
    setSignInNotice(notice);
  }, []);

  const acceptRefresh = useCallback(
    (gen: number, refreshed: PlusSession | null) => {
      if (gen !== generation.current) return;
      if (refreshed === null) {
        dropSession("Your session ended. Please sign in again.");
        return;
      }
      let next = refreshed;
      if (flagsNeedServer(next)) next = { ...next, hasCompletedProfile: false };
      savePlusSession(next);
      setSession(next);
    },
    [dropSession],
  );

  useEffect(() => {
    let cancelled = false;
    const gen = ++generation.current;

    const boot = async () => {
      if (hasStaleSession()) {
        clearPlusSession();
        setSignInNotice("Please sign in again to open the updated app.");
      }
      const current = loadPlusSession();
      // Unknown mobile flags: wait for /me (Flutter refreshGateFromServer) so we
      // don't bounce the quiz and home, or skip the quiz for a new account.
      if (current && flagsNeedServer(current)) {
        const refreshed = await refreshSessionFromMe(current);
        if (cancelled || gen !== generation.current) return;
        if (refreshed === null) {
          dropSession("Your session ended. Please sign in again.");
        } else {
          acceptRefresh(gen, refreshed);
        }
        setReady(true);
        return;
      }

      setSession(current);
      setReady(true);
      if (!current?.mobileToken) return;
      const refreshed = await refreshSessionFromMe(current);
      if (cancelled) return;
      acceptRefresh(gen, refreshed);
    };

    void boot();
    return () => {
      cancelled = true;
    };
  }, [acceptRefresh, dropSession]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      generation.current += 1;
      dropSession("Your session ended. Please sign in again.");
    });
    return () => setUnauthorizedHandler(null);
  }, [dropSession]);

  const completeSignIn = useCallback((next: PlusSession) => {
    const gen = ++generation.current;
    savePlusSession(next);
    setSignInNotice(null);
    setSession(next);
    if (!next.mobileToken) return;
    void refreshSessionFromMe(next).then((refreshed) => acceptRefresh(gen, refreshed));
  }, [acceptRefresh]);

  const signOut = useCallback(async () => {
    const token = session?.token;
    generation.current += 1;
    dropSession("");
    setSignInNotice(null);
    if (token) await logoutPlus(token);
  }, [session?.token, dropSession]);

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

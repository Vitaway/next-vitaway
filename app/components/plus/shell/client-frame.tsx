"use client";

import { useEffect, useState } from "react";
import { usePlusAuth } from "@/lib/plus/auth-context";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { isStaffPrimaryDoor } from "@/lib/plus/session";
import PlusLoading from "../plus-loading";
import StaffDoor from "../staff-door";
import Dock, { ROOT_TABS, useAppPath } from "./dock";

const CLIENT_DOOR_KEY = "vitaway.plus.clientDoor";

/** Signed-in client app frame: auth gate, staff door, and the Flutter-style dock on tab roots. */
export default function ClientFrame({ children }: { children: React.ReactNode }) {
  const { session, ready, signOut } = usePlusAuth();
  const { replace } = usePlusPaths();
  const path = useAppPath();
  const [clientDoor, setClientDoor] = useState(false);

  useEffect(() => {
    setClientDoor(window.sessionStorage.getItem(CLIENT_DOOR_KEY) === "1");
  }, []);

  useEffect(() => {
    if (ready && !session) replace("/signin");
    // Flutter router: an unverified account stays on /verify-code.
    else if (ready && session && session.verified === false) replace("/verify-code");
  }, [ready, session, replace]);

  if (!ready || !session || session.verified === false) {
    return <PlusLoading label="Opening Vitaway Plus…" />;
  }

  const canUseClient = Boolean(session.mobileToken) && (session.doors.includes("client_app") || !isStaffPrimaryDoor(session.primaryDoor));

  if ((isStaffPrimaryDoor(session.primaryDoor) && !clientDoor) || !session.mobileToken) {
    return (
      <div style={{ minHeight: "100dvh", padding: "40px 16px", background: "var(--vc-surface-muted)" }}>
        <div style={{ maxWidth: 512, margin: "0 auto" }}>
          <StaffDoor
            session={session}
            onContinue={
              canUseClient
                ? () => {
                    window.sessionStorage.setItem(CLIENT_DOOR_KEY, "1");
                    setClientDoor(true);
                  }
                : undefined
            }
            onSignOut={async () => {
              window.sessionStorage.removeItem(CLIENT_DOOR_KEY);
              await signOut();
              replace("/signin");
            }}
          />
        </div>
      </div>
    );
  }

  const showDock = (ROOT_TABS as readonly string[]).includes(path);

  return (
    <>
      {children}
      {showDock ? <Dock /> : null}
    </>
  );
}

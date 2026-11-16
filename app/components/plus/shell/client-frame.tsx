"use client";

import { useEffect, useState } from "react";
import { usePlusAuth } from "@/lib/plus/auth-context";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { isStaffPrimaryDoor } from "@/lib/plus/session";
import { useAuthGate } from "@/lib/plus/use-auth-gate";
import PlusLoading from "../plus-loading";
import StaffDoor from "../staff-door";
import Dock, { DOCK_SCREENS, useAppPath } from "./dock";
import Sidebar from "./sidebar";
import { useSupportBadge } from "@/lib/plus/client/support-badge";
import { WebReminderScheduler } from "../reminders/web-reminder-scheduler";
import { useT } from "@/lib/plus/i18n";

const CLIENT_DOOR_KEY = "vitaway.plus.clientDoor";

/** Signed-in client app frame: auth gate, staff door, and the Flutter-style dock on tab roots. */
export default function ClientFrame({ children }: { children: React.ReactNode }) {
  const { signOut } = usePlusAuth();
  const { session, allowed } = useAuthGate("/home", "/onboarding");
  const { replace } = usePlusPaths();
  const path = useAppPath();
  const [clientDoor, setClientDoor] = useState(false);

  useEffect(() => {
    setClientDoor(window.sessionStorage.getItem(CLIENT_DOOR_KEY) === "1");
  }, []);

  if (!allowed || !session) {
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

  const showDock = (DOCK_SCREENS as readonly string[]).includes(path);

  return <AppShell path={path} showDock={showDock}>{children}</AppShell>;
}

const DESKTOP_QUERY = "(min-width: 1024px)";

/** True from 1024px: the sidebar replaces the phone dock. */
function useDesktop(): boolean {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return desktop;
}

/** Tracks navigator.onLine so every screen gets the same offline notice (F23). */
function useOnline(): boolean {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  return online;
}

/**
 * Responsive app shell. Phones and tablets keep the Flutter dock on the tab roots;
 * desktops get a persistent sidebar and a wider content area (see .vita-app in plus.css).
 * Stays mounted across pages so the Support dot survives leaving the root tabs.
 */
function AppShell({ path, showDock, children }: { path: string; showDock: boolean; children: React.ReactNode }) {
  const supportBadge = useSupportBadge(path);
  const desktop = useDesktop();
  const online = useOnline();
  const t = useT();
  const dock = showDock && !desktop;
  return (
    <div className={dock ? "vita-app vita-fullbleed has-dock" : "vita-app vita-fullbleed"}>
      {online ? null : (
        <div className="vita-offline-banner" role="status">
          {t("offline_banner")}
        </div>
      )}
      {desktop ? <Sidebar supportBadge={supportBadge} /> : null}
      <div className="vita-app-main">{children}</div>
      <WebReminderScheduler />
      {dock ? <Dock supportBadge={supportBadge} /> : null}
    </div>
  );
}

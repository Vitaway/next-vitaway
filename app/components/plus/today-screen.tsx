"use client";

import { useEffect, useState } from "react";
import { usePlusAuth } from "@/lib/plus/auth-context";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { isStaffPrimaryDoor } from "@/lib/plus/session";
import PlusLoading from "./plus-loading";
import PlusShell from "./plus-shell";
import StaffDoor from "./staff-door";

const SECTIONS = [
  {
    title: "Today's tasks",
    body: "Tasks from your care plan will appear here. Nothing is scheduled yet in this version of the app.",
  },
  {
    title: "Readings",
    body: "Health readings will show here once this feature is ready. No values are displayed yet.",
  },
  {
    title: "Meals",
    body: "Meal logging is coming next. Your food diary is empty for now.",
  },
  {
    title: "Care plan",
    body: "Your care plan and booking options will live here. They are not available in this shell yet.",
  },
  {
    title: "Chat",
    body: "Messaging with your care team is not wired up in this release.",
  },
  {
    title: "Pillbox",
    body: "Medication reminders will appear here later. No doses are listed yet.",
  },
];

export default function TodayScreen() {
  const { session, ready, signOut } = usePlusAuth();
  const { replace } = usePlusPaths();
  const [showClientToday, setShowClientToday] = useState(false);

  useEffect(() => {
    if (ready && !session) replace("/signin");
  }, [ready, session, replace]);

  if (!ready || !session) {
    return <PlusLoading label="Opening Today…" />;
  }

  if (isStaffPrimaryDoor(session.primaryDoor) && !showClientToday) {
    return (
      <div className="min-h-dvh bg-[#F6F3EE] px-4 py-10">
        <div className="mx-auto max-w-lg">
          <StaffDoor
            session={session}
            onContinue={session.doors.includes("client_app") ? () => setShowClientToday(true) : undefined}
            onSignOut={async () => {
              await signOut();
              replace("/signin");
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <PlusShell>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-[#E85A2E]">Today</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#003E48]">Your day at a glance</h1>
        <p className="mt-2 text-sm text-[#003E48]/70">
          This is the client app home. The sections below are placeholders until those features are built.
        </p>
      </div>
      <div className="mt-6 space-y-3">
        {SECTIONS.map((section) => (
          <section key={section.title} className="rounded-3xl bg-white p-4 shadow-sm">
            <h2 className="text-base font-semibold text-[#003E48]">{section.title}</h2>
            <p className="mt-1 text-sm leading-6 text-[#003E48]/70">{section.body}</p>
          </section>
        ))}
      </div>
    </PlusShell>
  );
}

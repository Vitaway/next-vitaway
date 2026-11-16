"use client";

import { useState } from "react";
import { displayAccountName, type PlusSession } from "@/lib/plus/session";

export default function StaffDoor({
  session,
  onContinue,
  onSignOut,
}: {
  session: PlusSession;
  onContinue?: () => void;
  onSignOut: () => Promise<void>;
}) {
  const [pending, setPending] = useState(false);
  const canContinueAsClient = session.doors.includes("client_app");
  const desk =
    session.primaryDoor === "partner_portal" ? "the partner portal" : "the Vitaway care console (EHR)";

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-[#E85A2E]">Staff account</p>
      <h1 className="mt-2 text-2xl font-bold text-[#003E48]">This is the client app</h1>
      <p className="mt-3 text-sm leading-6 text-[#003E48]/75">
        You signed in as {displayAccountName(session)}. This PWA is the Vitaway Plus client app
        for members. {desk[0].toUpperCase() + desk.slice(1)} stays in its own product — it is not
        available here.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {canContinueAsClient && onContinue ? (
          <button type="button" className="press-btn" onClick={onContinue}>
            Continue as a client
          </button>
        ) : null}
        <button
          type="button"
          className="rounded-full border border-[#003E48]/20 px-6 py-3 text-sm font-semibold text-[#003E48] disabled:opacity-55"
          disabled={pending}
          onClick={async () => {
            setPending(true);
            try {
              await onSignOut();
            } finally {
              setPending(false);
            }
          }}
        >
          {pending ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </section>
  );
}

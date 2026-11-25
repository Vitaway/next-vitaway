"use client";

import { useEffect } from "react";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { CenterSpinner } from "../ui/vita";

/** Appointments has no page of its own: visits live on Care, and booking starts from the person you choose. */
export function AppointmentsRedirect() {
  const { replace } = usePlusPaths();
  useEffect(() => replace("/care"), [replace]);
  return <CenterSpinner />;
}

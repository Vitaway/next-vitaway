"use client";

import { useEffect } from "react";
import PlusLoading from "@/app/components/plus/plus-loading";
import { usePlusPaths } from "@/lib/plus/plus-paths";

/** Older links pointed at /today; Home is the client app start page now. */
export default function TodayRedirect() {
  const { replace } = usePlusPaths();
  useEffect(() => replace("/home"), [replace]);
  return <PlusLoading label="Opening Home…" />;
}

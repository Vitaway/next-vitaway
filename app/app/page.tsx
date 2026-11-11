"use client";

import { useEffect } from "react";
import PlusLoading from "@/app/components/plus/plus-loading";
import { usePlusAuth } from "@/lib/plus/auth-context";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { nextAuthPath } from "@/lib/plus/auth-flow";

export default function PlusEntryPage() {
  const { session, ready } = usePlusAuth();
  const { replace } = usePlusPaths();

  useEffect(() => {
    if (!ready) return;
    replace(session ? nextAuthPath(session) : "/onboarding");
  }, [ready, session, replace]);

  return <PlusLoading label="Opening Vitaway Plus…" />;
}

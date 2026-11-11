"use client";

import { useEffect } from "react";
import PlusLoading from "@/app/components/plus/plus-loading";
import { usePlusAuth } from "@/lib/plus/auth-context";
import { usePlusPaths } from "@/lib/plus/plus-paths";

export default function PlusEntryPage() {
  const { session, ready } = usePlusAuth();
  const { replace } = usePlusPaths();

  useEffect(() => {
    if (!ready) return;
    replace(session ? "/home" : "/signin");
  }, [ready, session, replace]);

  return <PlusLoading label="Opening Vitaway Plus…" />;
}

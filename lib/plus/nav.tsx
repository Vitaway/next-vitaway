"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePlusPaths } from "./plus-paths";

let depth = 0;
let lastPath: string | null = null;

/** Counts in-app navigations so Back can fall back to Home on a cold start. */
export function NavigationTracker() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      lastPath = pathname;
      return;
    }
    if (pathname !== lastPath) {
      depth += 1;
      lastPath = pathname;
    }
  }, [pathname]);
  return null;
}

export function useBack(fallback = "/home") {
  const router = useRouter();
  const { replace } = usePlusPaths();
  return useCallback(() => {
    if (depth > 0) {
      depth = Math.max(0, depth - 2);
      router.back();
      return;
    }
    replace(fallback);
  }, [router, replace, fallback]);
}

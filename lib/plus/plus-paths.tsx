"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import { joinAppPath } from "./host";

type PlusPathsValue = {
  basePath: string;
  href: (path: string) => string;
  push: (path: string) => void;
  replace: (path: string) => void;
};

const PlusPathsContext = createContext<PlusPathsValue | null>(null);

export function PlusPathsProvider({
  basePath,
  children,
}: {
  basePath: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const href = useCallback((path: string) => joinAppPath(basePath, path), [basePath]);
  const push = useCallback((path: string) => router.push(href(path)), [router, href]);
  const replace = useCallback((path: string) => router.replace(href(path)), [router, href]);
  const value = useMemo(() => ({ basePath, href, push, replace }), [basePath, href, push, replace]);
  return <PlusPathsContext.Provider value={value}>{children}</PlusPathsContext.Provider>;
}

export function usePlusPaths(): PlusPathsValue {
  const value = useContext(PlusPathsContext);
  if (!value) {
    throw new Error("usePlusPaths must be used within PlusPathsProvider");
  }
  return value;
}

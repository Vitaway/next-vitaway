"use client";

import { PlusAuthProvider } from "@/lib/plus/auth-context";
import { PlusPathsProvider } from "@/lib/plus/plus-paths";
import InstallPrompt from "./install-prompt";
import ServiceWorkerRegister from "./service-worker-register";

export default function PlusAppProviders({
  basePath,
  children,
}: {
  basePath: string;
  children: React.ReactNode;
}) {
  return (
    <PlusPathsProvider basePath={basePath}>
      <PlusAuthProvider>
        <ServiceWorkerRegister />
        {children}
        <InstallPrompt />
      </PlusAuthProvider>
    </PlusPathsProvider>
  );
}

"use client";

import Logo from "@/app/components/logo";
import { usePlusPaths } from "@/lib/plus/plus-paths";

export default function OfflinePage() {
  const { href } = usePlusPaths();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#F6F3EE] px-6 text-center text-[#003E48]">
      <Logo className="h-14 w-auto" />
      <h1 className="mt-6 text-3xl font-bold tracking-tight">You are offline</h1>
      <p className="mt-3 max-w-sm text-sm leading-6 text-[#003E48]/70">
        Vitaway Plus cannot reach the network right now. Reconnect and open Today again. Your sign-in
        is saved on this device.
      </p>
      <a href={href("/today")} className="press-btn mt-8">
        Try Today again
      </a>
    </div>
  );
}

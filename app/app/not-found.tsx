"use client";

import Logo from "@/app/components/logo";
import { usePlusPaths } from "@/lib/plus/plus-paths";

export default function PlusNotFound() {
  const { href } = usePlusPaths();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#F6F3EE] px-6 text-center text-[#003E48]">
      <Logo className="h-14 w-auto" />
      <h1 className="mt-6 text-3xl font-bold tracking-tight">This screen is not here</h1>
      <p className="mt-3 max-w-sm text-sm text-[#003E48]/70">
        That page is not part of the Vitaway Plus client app.
      </p>
      <a href={href("/")} className="press-btn mt-8">
        Go to the app
      </a>
    </div>
  );
}

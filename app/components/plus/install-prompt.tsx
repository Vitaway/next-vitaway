"use client";

import { useEffect, useState } from "react";
import { Share, X } from "lucide-react";

const DISMISS_KEY = "vitaway.plus.installDismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  const media = window.matchMedia?.("(display-mode: standalone)")?.matches;
  const iosStandalone = "standalone" in window.navigator && Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
  return Boolean(media || iosStandalone);
}

function isIosDevice(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  const iOS = /iphone|ipad|ipod/i.test(ua);
  const iPadOs = window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1;
  return iOS || iPadOs;
}

export default function InstallPrompt() {
  const [open, setOpen] = useState(false);
  const [ios, setIos] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandaloneDisplay()) return;
    if (window.localStorage.getItem(DISMISS_KEY) === "1") return;

    setIos(isIosDevice());

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setOpen(true);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);

    // iOS Safari has no beforeinstallprompt. Show the Add to Home Screen path instead.
    if (isIosDevice()) setOpen(true);

    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!open || isStandaloneDisplay()) return null;

  const dismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setOpen(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    try {
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") {
        window.localStorage.setItem(DISMISS_KEY, "1");
        setOpen(false);
      }
    } catch {
      // User dismissed the native prompt.
    }
    setDeferred(null);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] flex justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-white/10 bg-[#003E48] p-4 text-white shadow-xl">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Install Vitaway Plus</p>
            {ios && !deferred ? (
              <p className="mt-1 text-sm text-white/80">
                On iPhone and iPad, open this page in Safari, tap the{" "}
                <Share className="inline h-3.5 w-3.5 align-text-bottom" aria-hidden /> Share button,
                then choose <span className="font-semibold">Add to Home Screen</span>.
              </p>
            ) : (
              <p className="mt-1 text-sm text-white/80">
                Add Vitaway Plus to your home screen for a full-screen app experience.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Dismiss install tip"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {deferred ? (
          <button type="button" className="press-btn press-btn--sm mt-3 w-full" onClick={install}>
            Install app
          </button>
        ) : null}
      </div>
    </div>
  );
}

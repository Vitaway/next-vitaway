"use client";

/**
 * Install ("Add to Home Screen") state for the Vitaway Plus PWA.
 *
 * Chromium (Android Chrome, desktop Chrome/Edge, Samsung Internet) fires `beforeinstallprompt`;
 * we keep that event so one tap on our button opens the browser's install dialog.
 * iOS/iPadOS has no install API at all, so there the same button opens a short visual guide.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform?: string }>;
};

/** How this browser can install the app. */
export type InstallPlatform =
  | "prompt" // Chromium: one-tap install via beforeinstallprompt
  | "ios-safari" // Safari on iPhone/iPad: Share › Add to Home Screen
  | "ios-other" // Chrome/Firefox/Edge or an in-app browser on iOS: open in Safari
  | "android-menu" // Android browser without the prompt (Firefox, some in-app browsers)
  | "desktop-menu"; // Desktop browser without the prompt (Safari, Firefox, or prompt not ready)

export type InstallInfo = {
  platform: InstallPlatform;
  /** iPad (Share button sits at the top right) vs iPhone (bottom toolbar). */
  ipad: boolean;
  /** Safari 26+ moved Share behind the ••• button next to the address bar. */
  safariMoreMenu: boolean;
  /** Instagram, Facebook, TikTok, etc. in-app browser. */
  inAppBrowser: boolean;
};

const DISMISS_KEY = "vitaway.plus.installDismissedAt";
const INSTALLED_KEY = "vitaway.plus.installed";
const DISMISS_FOR_MS = 7 * 24 * 60 * 60 * 1000;

// Chrome can fire beforeinstallprompt before React mounts; catch it as early as this module loads.
let earlyEvent: BeforeInstallPromptEvent | null = null;
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    earlyEvent = event as BeforeInstallPromptEvent;
  });
}

export function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  const media =
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
    window.matchMedia?.("(display-mode: fullscreen)")?.matches ||
    window.matchMedia?.("(display-mode: minimal-ui)")?.matches;
  const iosStandalone = Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
  return Boolean(media || iosStandalone);
}

export function detectInstallInfo(hasPrompt: boolean): InstallInfo {
  const ua = window.navigator.userAgent;
  const iPadOs = window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1;
  const ipad = /ipad/i.test(ua) || iPadOs;
  const ios = /iphone|ipod/i.test(ua) || ipad;
  const inAppBrowser = /FBAN|FBAV|FB_IAB|Instagram|Line\/|Twitter|TikTok|musical_ly|Snapchat|LinkedInApp|Pinterest|GSA\//i.test(ua);
  const otherIosBrowser = /CriOS|FxiOS|EdgiOS|OPiOS|OPT\/|YaBrowser|DuckDuckGo|Brave/i.test(ua);
  const safariVersion = Number(/Version\/(\d+)/.exec(ua)?.[1] ?? 0);

  if (ios) {
    return {
      platform: inAppBrowser || otherIosBrowser ? "ios-other" : "ios-safari",
      ipad,
      safariMoreMenu: safariVersion >= 26,
      inAppBrowser,
    };
  }
  if (hasPrompt) return { platform: "prompt", ipad: false, safariMoreMenu: false, inAppBrowser };
  return {
    platform: /android/i.test(ua) ? "android-menu" : "desktop-menu",
    ipad: false,
    safariMoreMenu: false,
    inAppBrowser,
  };
}

function dismissedRecently(): boolean {
  try {
    const at = Number(window.localStorage.getItem(DISMISS_KEY) ?? 0);
    return Boolean(at) && Date.now() - at < DISMISS_FOR_MS;
  } catch {
    return false;
  }
}

type InstallValue = {
  /** False once running as an installed app (or after a confirmed install). */
  available: boolean;
  info: InstallInfo | null;
  /** True when the browser's one-tap install dialog is ready. */
  canPrompt: boolean;
  /** The install card (auto-shown once, or opened from Account). */
  cardOpen: boolean;
  /** The iOS / browser-menu step-by-step guide. */
  guideOpen: boolean;
  openCard: () => void;
  /** Main button: native install where possible, otherwise the guide. */
  install: () => Promise<void>;
  /** Close the card and snooze the automatic card for 7 days. */
  dismiss: () => void;
  closeGuide: () => void;
};

const InstallContext = createContext<InstallValue | null>(null);

export function InstallProvider({ children }: { children: React.ReactNode }) {
  const [standalone, setStandalone] = useState(true);
  const [installed, setInstalled] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [info, setInfo] = useState<InstallInfo | null>(null);
  const [cardOpen, setCardOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    const isStandalone = isStandaloneDisplay();
    setStandalone(isStandalone);
    if (isStandalone) return;

    let wasInstalled = false;
    try {
      wasInstalled = window.localStorage.getItem(INSTALLED_KEY) === "1";
    } catch {
      /* storage blocked */
    }
    setInstalled(wasInstalled);
    setDeferred(earlyEvent);
    // Stored without the prompt; the context value switches to "prompt" while one is ready.
    const first = detectInstallInfo(false);
    setInfo(first);

    let timer: number | undefined;
    const showSoon = () => {
      if (dismissedRecently()) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setCardOpen(true), 1200);
    };

    const onPrompt = (event: Event) => {
      event.preventDefault();
      const prompt = event as BeforeInstallPromptEvent;
      earlyEvent = prompt;
      setDeferred(prompt);
      // The browser only offers install when the app is not installed, so clear a stale flag.
      try {
        window.localStorage.removeItem(INSTALLED_KEY);
      } catch {
        /* storage blocked */
      }
      setInstalled(false);
      showSoon();
    };
    const onInstalled = () => {
      earlyEvent = null;
      setDeferred(null);
      setInstalled(true);
      setCardOpen(false);
      setGuideOpen(false);
      try {
        window.localStorage.setItem(INSTALLED_KEY, "1");
      } catch {
        /* storage blocked */
      }
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    // Auto-show the card where installing is possible: Chromium with a ready prompt, or iOS.
    if (!wasInstalled && (earlyEvent || first.platform === "ios-safari" || first.platform === "ios-other")) showSoon();

    const media = window.matchMedia?.("(display-mode: standalone)");
    const onDisplayChange = () => setStandalone(isStandaloneDisplay());
    media?.addEventListener?.("change", onDisplayChange);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      media?.removeEventListener?.("change", onDisplayChange);
    };
  }, []);

  const available = !standalone && !installed && info !== null;

  const dismiss = useCallback(() => {
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* storage blocked */
    }
    setCardOpen(false);
  }, []);

  const install = useCallback(async () => {
    const event = deferred ?? earlyEvent;
    if (!event) {
      setCardOpen(false);
      setGuideOpen(true);
      return;
    }
    try {
      await event.prompt();
      const choice = await event.userChoice;
      // A prompt event can only be used once.
      earlyEvent = null;
      setDeferred(null);
      if (choice.outcome === "accepted") {
        setInstalled(true);
        setCardOpen(false);
        try {
          window.localStorage.setItem(INSTALLED_KEY, "1");
        } catch {
          /* storage blocked */
        }
      }
    } catch {
      earlyEvent = null;
      setDeferred(null);
      setCardOpen(false);
      setGuideOpen(true);
    }
  }, [deferred]);

  const value = useMemo<InstallValue>(
    () => ({
      available,
      info: deferred && info && !info.platform.startsWith("ios") ? { ...info, platform: "prompt" } : info,
      canPrompt: Boolean(deferred),
      cardOpen: available && cardOpen,
      guideOpen: available && guideOpen,
      openCard: () => setCardOpen(true),
      install,
      dismiss,
      // Closing the guide counts as "seen": snooze the automatic card too (Account still offers install).
      closeGuide: () => {
        setGuideOpen(false);
        dismiss();
      },
    }),
    [available, deferred, info, cardOpen, guideOpen, install, dismiss],
  );

  return <InstallContext.Provider value={value}>{children}</InstallContext.Provider>;
}

export function useInstall(): InstallValue {
  const value = useContext(InstallContext);
  if (!value) throw new Error("useInstall must be used within InstallProvider");
  return value;
}

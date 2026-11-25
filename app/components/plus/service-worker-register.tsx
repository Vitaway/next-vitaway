"use client";

import { useEffect } from "react";
import { appServiceWorkerPath } from "@/lib/plus/host";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    const isDev = process.env.NODE_ENV !== "production";
    if (isDev) {
      void navigator.serviceWorker.getRegistrations().then((regs) => Promise.all(regs.map((r) => r.unregister())));
      return;
    }
    const { scriptUrl, scope } = appServiceWorkerPath(window.location.host);
    navigator.serviceWorker.register(scriptUrl, { scope }).catch(() => {
      // Registration can fail on insecure origins other than localhost; the app still works online.
    });
  }, []);

  return null;
}

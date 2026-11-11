"use client";

import { useEffect } from "react";
import { appServiceWorkerPath } from "@/lib/plus/host";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    const { scriptUrl, scope } = appServiceWorkerPath(window.location.host);
    navigator.serviceWorker.register(scriptUrl, { scope }).catch(() => {
      // Registration can fail on insecure origins other than localhost; the app still works online.
    });
  }, []);

  return null;
}

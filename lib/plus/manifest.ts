import type { MetadataRoute } from "next";
import { appPath, isVitawayAppHost } from "./host";

/** Home Screen / install icons, generated from public/plus-assets/logo.png on a white tile. */
export const PLUS_ICON_192 = "/plus-assets/icons/icon-192.png";
export const PLUS_ICON_512 = "/plus-assets/icons/icon-512.png";
export const PLUS_APPLE_TOUCH_ICON = "/plus-assets/icons/apple-touch-icon.png";

export function plusManifest(hostHeader?: string | null): MetadataRoute.Manifest {
  const startUrl = appPath("/", hostHeader);
  // start_url is "/app" on www.vitaway.org, so the scope must be "/app" (not "/app/")
  // or browsers treat the start URL as out of scope and fall back to the whole site.
  const scope = isVitawayAppHost(hostHeader) ? "/" : "/app";

  return {
    id: startUrl,
    name: "Vitaway Plus",
    short_name: "Vitaway",
    description: "Your Vitaway client app. Sign in with your phone to see today.",
    start_url: startUrl,
    scope,
    display: "standalone",
    orientation: "portrait",
    background_color: "#003E48",
    theme_color: "#003E48",
    lang: "en",
    categories: ["health", "medical", "lifestyle"],
    icons: [
      { src: PLUS_ICON_192, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: PLUS_ICON_512, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/plus-assets/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/plus-assets/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

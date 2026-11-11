import type { MetadataRoute } from "next";
import { appPath, isVitawayAppHost } from "./host";

export function plusManifest(hostHeader?: string | null): MetadataRoute.Manifest {
  const startUrl = appPath("/", hostHeader);
  const scope = isVitawayAppHost(hostHeader) ? "/" : "/app/";

  return {
    name: "Vitaway Plus",
    short_name: "Vitaway",
    description: "Your Vitaway client app. Sign in with your phone to see today.",
    start_url: startUrl,
    scope,
    display: "standalone",
    background_color: "#003E48",
    theme_color: "#003E48",
    lang: "en",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

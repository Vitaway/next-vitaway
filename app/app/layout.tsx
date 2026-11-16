import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import PlusAppProviders from "@/app/components/plus/plus-app-providers";
import { appBasePathFromHost, appManifestPath } from "@/lib/plus/host";
import { PLUS_APPLE_TOUCH_ICON, PLUS_ICON_192 } from "@/lib/plus/manifest";
import "./plus.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#003E48",
};

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host");
  return {
    title: {
      default: "Vitaway Plus",
      template: "%s | Vitaway Plus",
    },
    description: "Your Vitaway client app. Sign in with your phone to see today.",
    applicationName: "Vitaway Plus",
    manifest: appManifestPath(host),
    robots: { index: false, follow: false },
    appleWebApp: {
      capable: true,
      title: "Vitaway Plus",
      statusBarStyle: "black-translucent",
    },
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: PLUS_ICON_192, sizes: "192x192", type: "image/png" },
      ],
      apple: [{ url: PLUS_APPLE_TOUCH_ICON, sizes: "180x180", type: "image/png" }],
    },
    other: {
      "mobile-web-app-capable": "yes",
    },
  };
}

export default async function PlusLayout({ children }: { children: React.ReactNode }) {
  const host = (await headers()).get("host");
  return <PlusAppProviders basePath={appBasePathFromHost(host)}>{children}</PlusAppProviders>;
}

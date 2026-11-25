import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Caveat_Brush, League_Spartan, Manrope } from "next/font/google";
import PlusAppProviders from "@/app/components/plus/plus-app-providers";
import { appBasePathFromHost, appManifestPath } from "@/lib/plus/host";
import { PLUS_APPLE_TOUCH_ICON, PLUS_ICON_192 } from "@/lib/plus/manifest";
import "./plus.css";

/** F23 web type: League Spartan headings, Manrope body (applied from 768px in plus.css; phones keep the Flutter font). */
const leagueSpartan = League_Spartan({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-league-spartan", display: "swap" });
/** Hand-written title face for the teal header band (same as the Inzu mobile app's page titles). */
const caveatBrush = Caveat_Brush({ subsets: ["latin"], weight: "400", variable: "--font-caveat-brush", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-manrope", display: "swap" });

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
  return (
    <div className={`${leagueSpartan.variable} ${manrope.variable} ${caveatBrush.variable}`} style={{ display: "contents" }}>
      <PlusAppProviders basePath={appBasePathFromHost(host)}>{children}</PlusAppProviders>
    </div>
  );
}

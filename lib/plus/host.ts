/** Host and path helpers for the Vitaway Plus PWA vs the marketing site. */

export const APP_PRODUCTION_HOST = "app.vitaway.org";
export const MARKETING_PRODUCTION_HOST = "www.vitaway.org";
export const APP_SURFACE_HEADER = "x-vitaway-surface";

export function hostnameOf(hostHeader: string | null | undefined): string {
  return (hostHeader ?? "").split(":")[0].toLowerCase();
}

export function isVitawayAppHost(hostHeader: string | null | undefined): boolean {
  return hostnameOf(hostHeader) === APP_PRODUCTION_HOST;
}

export function isLocalDevHost(hostHeader: string | null | undefined): boolean {
  const host = hostnameOf(hostHeader);
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    host === "[::1]" ||
    host === "::1" ||
    host.endsWith(".local")
  );
}

/** Empty on app.vitaway.org; `/app` on localhost and the marketing host. */
export function appBasePathFromHost(hostHeader: string | null | undefined): string {
  return isVitawayAppHost(hostHeader) ? "" : "/app";
}

export function joinAppPath(basePath: string, path: string): string {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  const base = basePath.replace(/\/$/, "");
  if (suffix === "/") return base || "/";
  return `${base}${suffix}`;
}

export function appPath(path: string, hostHeader?: string | null): string {
  return joinAppPath(appBasePathFromHost(hostHeader), path);
}

export function appManifestPath(hostHeader?: string | null): string {
  const base = appBasePathFromHost(hostHeader);
  return base ? `${base}/manifest.webmanifest` : "/manifest.webmanifest";
}

export function appServiceWorkerPath(hostHeader?: string | null): { scriptUrl: string; scope: string } {
  if (isVitawayAppHost(hostHeader)) {
    return { scriptUrl: "/sw.js", scope: "/" };
  }
  return { scriptUrl: "/app/sw.js", scope: "/app/" };
}

/**
 * Pages historically wrapped content in GuestLayout.
 * Chrome now lives in the root SiteShell so this is a passthrough —
 * keeping call sites avoids a mass page rewrite.
 */
export default function GuestLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}

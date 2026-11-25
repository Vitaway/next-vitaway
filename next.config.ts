import type { NextConfig } from "next";
import { siteRedirects } from "./content/redirect-map";

const apiRewriteBase = (process.env.PLUS_API_REWRITE || process.env.NEXT_PUBLIC_PLUS_API_URL || "")
  .trim()
  .replace(/\/$/, "");

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
  async rewrites() {
    if (!apiRewriteBase) return [];
    return [
      { source: "/api/v1/:path*", destination: `${apiRewriteBase}/api/v1/:path*` },
      { source: "/uploads/:path*", destination: `${apiRewriteBase}/uploads/:path*` },
      // Legacy Flutter aliases the PWA still calls. Proxy the path as-is so the
      // backend's alias middleware can rewrite it; needed for cookie sessions
      // which only work same-origin (apiBase is empty on localhost).
      { source: "/health-metrics", destination: `${apiRewriteBase}/health-metrics` },
      { source: "/health-metrics/", destination: `${apiRewriteBase}/health-metrics/` },
      { source: "/health-goals", destination: `${apiRewriteBase}/health-goals` },
      { source: "/health-goals/:path*", destination: `${apiRewriteBase}/health-goals/:path*` },
      // More legacy aliases the client screens call (local dev only: rewrites are off without PLUS_API_REWRITE /
      // NEXT_PUBLIC_PLUS_API_URL). Pages win over these (afterFiles), so /app routes are unaffected.
      ...["/me", "/medications", "/notifications", "/subscriptions", "/api/articles", "/api/rooms", "/api/user-reservations", "/api/visit-reports", "/api/ehr-meal-plans", "/transactions", "/coaches", "/progress-notes"].flatMap((p) => [
        { source: p, destination: `${apiRewriteBase}${p}` },
        { source: `${p}/:path*`, destination: `${apiRewriteBase}${p}/:path*` },
      ]),
    ];
  },
  async redirects() {
    return siteRedirects.map(({ source, destination, permanent }) => ({
      source,
      destination,
      permanent,
    }));
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.rareblocks.xyz",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ai-tool.nextjstemplates.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "vitaway.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "play.google.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "diplo-media.s3.eu-central-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tefconnect.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "care-api.vitaway.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "prod-api.vitaway.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "healthycanadians.gc.ca",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.goodlifeaccess.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

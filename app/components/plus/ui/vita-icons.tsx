/**
 * Vitaway icon set (23 Nov 2026), built in the same structure as the Inzu mobile app:
 *
 *  - Nav glyphs (24×24): bold rounded strokes for the tab bar / top bar. Active = the same outline
 *    with a soft tinted fill (Inzu TabNavIcon). Same props as iconsax (`size`, `color`, `variant`),
 *    so they drop into the existing tab lists.
 *  - Tile illustrations (64×64): flat, friendly drawings for option tiles, the Log menu, shortcut
 *    tiles and home cards (Inzu OptionIllustrations): Vitaway teal ink outlines (2.5px, round joins),
 *    white bodies, mint as the brand accent, peach / sky / cream as soft fills.
 *
 * Rule (as in Inzu): options and shortcut tiles use the illustrations; small list rows keep line icons.
 */
import type { CSSProperties, ReactNode } from "react";

export const ICON_INK = "#003E48";
const PAPER = "#FFFFFF";
const MINT = "#7DD9C4";
const MINT_SOFT = "#D5F3EC";
const PEACH = "#FBC9A8";
const ORANGE = "#E85A2E";
const CREAM = "#FCE7B8";

type NavProps = { size?: number | string; color?: string; variant?: string; className?: string; style?: CSSProperties };

function Nav({ size = 24, color = "currentColor", variant, className, style, children }: NavProps & { children: (p: { s: number; fill: string; fo: number; color: string }) => ReactNode }) {
  const active = variant === "Bold";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden className={className} style={style}>
      {children({ s: active ? 2.5 : 2.1, fill: active ? color : "none", fo: active ? 0.2 : 0, color })}
    </svg>
  );
}

export function NavHome(props: NavProps) {
  return (
    <Nav {...props}>
      {({ s, fill, fo, color }) => (
        <>
          <path d="M3.5 10.8 12 3.8l8.5 7v9.4a1.2 1.2 0 0 1-1.2 1.2h-5.4v-5.6h-3.8v5.6H4.7a1.2 1.2 0 0 1-1.2-1.2v-9.4Z" stroke={color} strokeWidth={s} strokeLinejoin="round" fill={fill} fillOpacity={fo} />
          <circle cx="12" cy="10.6" r="1.3" fill={color} />
        </>
      )}
    </Nav>
  );
}

export function NavHealth(props: NavProps) {
  return (
    <Nav {...props}>
      {({ s, fill, fo, color }) => (
        <>
          <path d="M12 20.2S3.2 15 3.2 8.9A4.6 4.6 0 0 1 12 6.8a4.6 4.6 0 0 1 8.8 2.1C20.8 15 12 20.2 12 20.2Z" stroke={color} strokeWidth={s} strokeLinejoin="round" fill={fill} fillOpacity={fo} />
          <path d="M6.6 11.6h2.6l1.4-2.4 2.2 4.4 1.4-2h3.2" stroke={color} strokeWidth={s * 0.8} strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </Nav>
  );
}

export function NavNutrition(props: NavProps) {
  return (
    <Nav {...props}>
      {({ s, fill, fo, color }) => (
        <>
          <path d="M3 12.2h18a9 8.4 0 0 1-18 0Z" stroke={color} strokeWidth={s} strokeLinejoin="round" fill={fill} fillOpacity={fo} />
          <path d="M8 20.4h8" stroke={color} strokeWidth={s} strokeLinecap="round" />
          <path d="M12.6 9.4c0-3.4 2.4-5.6 6-5.6 0 3.4-2.4 5.6-6 5.6Z" stroke={color} strokeWidth={s * 0.85} strokeLinejoin="round" fill={color} fillOpacity={0.25} />
          <path d="M7.4 9.2V5.6M10 9.2V7" stroke={color} strokeWidth={s * 0.85} strokeLinecap="round" />
        </>
      )}
    </Nav>
  );
}

export function NavLearn(props: NavProps) {
  return (
    <Nav {...props}>
      {({ s, fill, fo, color }) => (
        <>
          <path d="M12 6.4C9.8 4.9 6.6 4.4 3 4.8v13.6c3.6-.4 6.8.1 9 1.6 2.2-1.5 5.4-2 9-1.6V4.8c-3.6-.4-6.8.1-9 1.6Z" stroke={color} strokeWidth={s} strokeLinejoin="round" fill={fill} fillOpacity={fo} />
          <path d="M12 6.4V20" stroke={color} strokeWidth={s} strokeLinecap="round" />
          <path d="M15.4 4.6v5l1.6-1.1 1.6 1.1v-5.2" stroke={color} strokeWidth={s * 0.8} strokeLinejoin="round" fill={color} fillOpacity={0.3} />
        </>
      )}
    </Nav>
  );
}

export function NavCare(props: NavProps) {
  return (
    <Nav {...props}>
      {({ s, fill, fo, color }) => (
        <>
          <circle cx="9" cy="7.6" r="3.4" stroke={color} strokeWidth={s} fill={fill} fillOpacity={fo} />
          <path d="M2.8 20.2c0-3.6 2.8-6.2 6.2-6.2s6.2 2.6 6.2 6.2H2.8Z" stroke={color} strokeWidth={s} strokeLinejoin="round" fill={fill} fillOpacity={fo} />
          <circle cx="16.6" cy="8.6" r="2.6" stroke={color} strokeWidth={s * 0.85} />
          <path d="M17.6 13.6c2.2.4 3.8 2.4 3.8 5h-3.6" stroke={color} strokeWidth={s * 0.85} strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </Nav>
  );
}

/* ── Tile illustrations (64×64) ───────────────────────────────────────────────────── */

export type IlluName =
  | "glucose"
  | "bp"
  | "weight"
  | "meal-photo"
  | "pillbox"
  | "book-visit"
  | "appointments"
  | "messages"
  | "health-score"
  | "reminders"
  | "meal-plans"
  | "food-reports"
  | "plan"
  | "learn"
  | "badge"
  | "today"
  | "nav-home"
  | "nav-health"
  | "nav-nutrition"
  | "nav-learn"
  | "nav-care";

const S = { stroke: ICON_INK, strokeWidth: 2.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const T = { ...S, strokeWidth: 2 };

function art(name: IlluName): ReactNode {
  switch (name) {
    case "glucose":
      return (
        <>
          <path d="M28 8C28 8 13 25 13 36a15 15 0 0 0 30 0C43 25 28 8 28 8Z" fill={PEACH} {...S} />
          <path d="M20 37a8 8 0 0 0 6 7.6" fill="none" stroke={PAPER} strokeWidth={3} strokeLinecap="round" />
          <rect x="40" y="34" width="16" height="22" rx="4" fill={PAPER} {...S} />
          <rect x="43.5" y="38" width="9" height="6" rx="1.5" fill={MINT} {...T} />
          <circle cx="48" cy="50" r="1.8" fill={ICON_INK} />
        </>
      );
    case "bp":
      return (
        <>
          <circle cx="27" cy="30" r="17" fill={PAPER} {...S} />
          <path d="M16.5 30a10.5 10.5 0 0 1 21 0" fill="none" stroke={MINT} strokeWidth={4} strokeLinecap="round" />
          <path d="M27 30l6-7" {...S} />
          <circle cx="27" cy="30" r="2.6" fill={ICON_INK} />
          <path d="M27 47c0 6 6 8 12 8h4" fill="none" {...S} />
          <ellipse cx="50" cy="52" rx="7" ry="6" fill={PEACH} {...S} />
          <path d="M16 38h22" stroke={ICON_INK} strokeWidth={2} strokeLinecap="round" opacity={0.35} />
        </>
      );
    case "weight":
      return (
        <>
          <rect x="10" y="14" width="44" height="40" rx="10" fill={PAPER} {...S} />
          <path d="M20 26a12 12 0 0 1 24 0Z" fill={MINT_SOFT} {...T} />
          <path d="M32 26l4-6" {...T} />
          <circle cx="32" cy="26" r="1.8" fill={ICON_INK} />
          <rect x="18" y="38" width="10" height="9" rx="3" fill={PEACH} {...T} />
          <rect x="36" y="38" width="10" height="9" rx="3" fill={PEACH} {...T} />
        </>
      );
    case "meal-photo":
      return (
        <>
          <path d="M8 22a5 5 0 0 1 5-5h7l4-6h16l4 6h7a5 5 0 0 1 5 5v24a5 5 0 0 1-5 5H13a5 5 0 0 1-5-5Z" fill={PAPER} {...S} />
          <circle cx="32" cy="34" r="11" fill={MINT_SOFT} {...S} />
          <path d="M26 34a6 6 0 0 0 12 0Z" fill={PEACH} {...T} />
          <path d="M32 28c1-2.6 3-3.6 5-3.4-.4 2.2-2.2 3.6-5 3.4Z" fill={MINT} {...T} />
          <circle cx="49" cy="23" r="2" fill={ORANGE} />
        </>
      );
    case "pillbox":
      return (
        <>
          <g transform="rotate(-35 26 30)">
            <rect x="8" y="22" width="36" height="16" rx="8" fill={PAPER} {...S} />
            <path d="M26 22h10a8 8 0 0 1 0 16H26Z" fill={PEACH} {...S} />
          </g>
          <circle cx="45" cy="45" r="11" fill={MINT} {...S} />
          <path d="M38.5 51.5l13-13" {...S} />
          <circle cx="15" cy="49" r="2" fill={ICON_INK} opacity={0.3} />
        </>
      );
    case "book-visit":
    case "appointments":
      return (
        <>
          <rect x="8" y="12" width="42" height="40" rx="7" fill={PAPER} {...S} />
          <path d="M8 19a7 7 0 0 1 7-7h28a7 7 0 0 1 7 7v5H8Z" fill={MINT} {...S} />
          <path d="M18 8v8M40 8v8" {...S} />
          <circle cx="18" cy="33" r="2" fill={ICON_INK} />
          <circle cx="27" cy="33" r="2" fill={ICON_INK} />
          <circle cx="18" cy="42" r="2" fill={ICON_INK} />
          <circle cx="47" cy="47" r="10" fill={name === "book-visit" ? PEACH : MINT_SOFT} {...S} />
          {name === "book-visit" ? <path d="M47 42v10M42 47h10" {...S} /> : <path d="M42.5 47.2l3 3 6-6.4" fill="none" {...S} />}
        </>
      );
    case "messages":
      return (
        <>
          <path d="M8 14a6 6 0 0 1 6-6h22a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H20l-8 7v-7.4A6 6 0 0 1 8 26Z" fill={PAPER} {...S} />
          <circle cx="18" cy="20" r="2" fill={ICON_INK} />
          <circle cx="25" cy="20" r="2" fill={ICON_INK} />
          <circle cx="32" cy="20" r="2" fill={ICON_INK} />
          <path d="M26 34a6 6 0 0 1 6-6h18a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6v6l-8-6H32a6 6 0 0 1-6-6Z" fill={MINT} {...S} />
          <path d="M34 39h14" {...T} />
        </>
      );
    case "health-score":
      return (
        <>
          <path d="M32 54S9 41 9 25a12 12 0 0 1 23-5 12 12 0 0 1 23 5c0 16-23 29-23 29Z" fill={PEACH} {...S} />
          <path d="M14 31h9l4-7 6 13 4-6h13" fill="none" stroke={ICON_INK} strokeWidth={2.75} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 19a6 6 0 0 1 5-3" fill="none" stroke={PAPER} strokeWidth={3} strokeLinecap="round" />
        </>
      );
    case "reminders":
      return (
        <>
          <path d="M14 15l6-5M50 15l-6-5" {...S} />
          <circle cx="32" cy="34" r="19" fill={PAPER} {...S} />
          <path d="M18 22a19 19 0 0 1 9-6.4" fill="none" stroke={MINT} strokeWidth={4} strokeLinecap="round" />
          <path d="M32 24v10l7 5" fill="none" {...S} />
          <path d="M20 54l3-4M44 54l-3-4" {...S} />
          <circle cx="50" cy="44" r="6" fill={ORANGE} stroke={ICON_INK} strokeWidth={2.5} />
        </>
      );
    case "meal-plans":
      return (
        <>
          <rect x="12" y="10" width="36" height="46" rx="6" fill={PAPER} {...S} />
          <rect x="22" y="6" width="16" height="8" rx="3" fill={MINT} {...S} />
          <path d="M20 26h20M20 34h14M20 42h17" {...T} />
          <circle cx="47" cy="46" r="10" fill={MINT_SOFT} {...S} />
          <path d="M42 46a5 5 0 0 0 10 0Z" fill={PEACH} {...T} />
          <path d="M47 41c.8-2 2.4-2.8 4-2.6-.3 1.8-1.8 2.8-4 2.6Z" fill={MINT} {...T} />
        </>
      );
    case "food-reports":
      return (
        <>
          <path d="M12 12a5 5 0 0 1 5-5h20l11 11v34a5 5 0 0 1-5 5H17a5 5 0 0 1-5-5Z" fill={PAPER} {...S} />
          <path d="M37 7v8a3 3 0 0 0 3 3h8" fill={CREAM} {...S} />
          <path d="M20 46V38M27 46V30M34 46V35" stroke={ICON_INK} strokeWidth={4} strokeLinecap="round" />
          <circle cx="47" cy="47" r="9" fill={MINT} {...S} />
          <path d="M43 47.2l2.6 2.6 5-5.2" fill="none" {...S} />
        </>
      );
    case "plan":
      return (
        <>
          <path d="M10 22l11 9 11-17 11 17 11-9-5 26H15Z" fill={CREAM} {...S} />
          <rect x="15" y="48" width="34" height="7" rx="3" fill={MINT} {...S} />
          <circle cx="32" cy="36" r="4" fill={PEACH} {...T} />
          <circle cx="10" cy="22" r="3" fill={PAPER} {...T} />
          <circle cx="54" cy="22" r="3" fill={PAPER} {...T} />
          <circle cx="32" cy="12" r="3" fill={PAPER} {...T} />
        </>
      );
    case "learn":
      return (
        <>
          <path d="M32 18c-6-4-14-5-23-4v34c9-1 17 0 23 4 6-4 14-5 23-4V14c-9-1-17 0-23 4Z" fill={PAPER} {...S} />
          <path d="M32 18v34" {...S} />
          <path d="M15 24c4-.4 8 0 11 1.4M15 32c4-.4 8 0 11 1.4M38 32c3-1.4 7-1.8 11-1.4" {...T} />
          <path d="M40 15v14l4-3 4 3V14.4" fill={MINT} {...S} />
        </>
      );
    case "badge":
      return (
        <>
          <path d="M22 36l-6 20 9-4 5 7 4-16M42 36l6 20-9-4-5 7-4-16" fill={MINT} {...S} />
          <circle cx="32" cy="26" r="17" fill={CREAM} {...S} />
          <circle cx="32" cy="26" r="10" fill={PAPER} {...T} />
          <path d="M32 20l1.9 3.9 4.3.6-3.1 3 .7 4.3-3.8-2-3.8 2 .7-4.3-3.1-3 4.3-.6Z" fill={ORANGE} stroke={ICON_INK} strokeWidth={1.5} strokeLinejoin="round" />
        </>
      );
    case "nav-home":
      return (
        <>
          <path d="M8 31 32 11l24 20" fill="none" {...S} />
          <path d="M14 28 32 13.5 50 28v22a5 5 0 0 1-5 5H19a5 5 0 0 1-5-5Z" fill={PAPER} {...S} />
          <path d="M14 28 32 13.5 50 28" fill="none" {...S} />
          <rect x="26" y="37" width="12" height="18" rx="3" fill={MINT} {...S} />
          <rect x="40" y="8" width="6" height="10" rx="1.5" fill={PEACH} {...T} />
          <circle cx="34.5" cy="46.5" r="1.4" fill={ICON_INK} />
        </>
      );
    case "nav-health":
      return (
        <>
          <path d="M32 55S9 42 9 26a12 12 0 0 1 23-5 12 12 0 0 1 23 5c0 16-23 29-23 29Z" fill={PEACH} {...S} />
          <path d="M14 32h9l4-7 6 13 4-6h13" fill="none" stroke={ICON_INK} strokeWidth={2.75} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="49" cy="14" r="6" fill={MINT} {...T} />
        </>
      );
    case "nav-nutrition":
      return (
        <>
          <path d="M18 31a14 9 0 0 1 28 0Z" fill={PEACH} {...T} />
          <path d="M33 22c1.5-6 7-9.5 13-9-1 6-6.5 9.5-13 9Z" fill={MINT} {...T} />
          <path d="M8 31h48a24 19 0 0 1-48 0Z" fill={PAPER} {...S} />
          <path d="M24 55h16" {...S} />
          <path d="M18 12v6M24 9v9" {...T} />
        </>
      );
    case "nav-learn":
      return art("learn");
    case "nav-care":
      return (
        <>
          <circle cx="43" cy="21" r="7" fill={MINT} {...S} />
          <path d="M33 47c0-8 4.5-13 10-13s10 5 10 13Z" fill={MINT} {...S} />
          <circle cx="25" cy="23" r="9" fill={PAPER} {...S} />
          <path d="M10 54c0-10 6.5-17 15-17s15 7 15 17Z" fill={PEACH} {...S} />
        </>
      );
    case "today":
      return (
        <>
          <circle cx="30" cy="34" r="20" fill={PAPER} {...S} />
          <path d="M30 22v12h9" fill="none" {...S} />
          <circle cx="48" cy="16" r="9" fill={CREAM} {...S} />
          <path d="M48 3v3M48 26v3M35 16h3M58 16h3" {...T} />
          <circle cx="16" cy="50" r="2" fill={MINT} />
        </>
      );
  }
}

/** Soft pastel behind each illustration (Inzu tile tints, in Vitaway colours). */
export const ILLU_TINT: Record<IlluName, string> = {
  glucose: "#FDEBDD",
  bp: "#E4F4F8",
  weight: "#EAF7F3",
  "meal-photo": "#EAF7F3",
  pillbox: "#FDEBDD",
  "book-visit": "#E4F4F8",
  appointments: "#E4F4F8",
  messages: "#EAF7F3",
  "health-score": "#FDEBDD",
  reminders: "#FFF4DC",
  "meal-plans": "#EAF7F3",
  "food-reports": "#FFF4DC",
  plan: "#FFF4DC",
  learn: "#EAF7F3",
  badge: "#FFF4DC",
  today: "#FFF4DC",
  "nav-home": "#FFFFFF",
  "nav-health": "#FFFFFF",
  "nav-nutrition": "#FFFFFF",
  "nav-learn": "#FFFFFF",
  "nav-care": "#FFFFFF",
};

/** Illustrated icon for each main tab (web top bar). */
export const NAV_ILLU: Record<string, IlluName> = {
  "/home": "nav-home",
  "/metrics": "nav-health",
  "/meal-photos": "nav-nutrition",
  "/articles": "nav-learn",
  "/care": "nav-care",
};

export function Illu({ name, size = 40, title, className, style }: { name: IlluName; size?: number; title?: string; className?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role={title ? "img" : undefined} aria-hidden={title ? undefined : true} className={className} style={{ flex: "none", display: "block", ...style }}>
      {title ? <title>{title}</title> : null}
      {art(name)}
    </svg>
  );
}

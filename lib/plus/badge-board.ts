/**
 * Badge board (tracker BL-090), same as Flutter lib/models/badge_board.dart.
 * GET /api/v1/mobile/points/badges gives earned and locked habit badges with progress.
 * Older servers answer 404 there, so the app falls back to /badges/ (earned badges only).
 */

export type BadgeItem = {
  id: number | null;
  code: string | null;
  name: string;
  description: string;
  image: string | null;
  kind: string;
  earned: boolean;
  current: number | null;
  target: number | null;
  article: { id?: number; title?: string; image?: string } | null;
};

export type BadgeBoard = { badges: BadgeItem[]; earnedCount: number; total: number; legacy: boolean };

export const BADGE_BOARD_PATH = "/api/v1/mobile/points/badges";
export const LEGACY_BADGES_PATH = "/badges/";

const int = (v: unknown): number | null => {
  const n = typeof v === "number" ? v : typeof v === "string" && v.trim() ? Number(v) : NaN;
  return Number.isFinite(n) ? Math.trunc(n) : null;
};

function item(raw: Record<string, unknown>, legacy: boolean): BadgeItem {
  const progress = raw.progress && typeof raw.progress === "object" ? (raw.progress as Record<string, unknown>) : null;
  const image = raw.image == null || String(raw.image) === "" ? null : String(raw.image);
  return {
    id: int(raw.id),
    code: raw.code == null ? null : String(raw.code),
    name: String(raw.name ?? ""),
    description: String(raw.description ?? ""),
    image,
    kind: String(raw.kind ?? (legacy ? "article" : "habit")),
    // The old /badges/ list only holds badges already earned.
    earned: legacy ? true : raw.earned === true,
    current: progress ? int(progress.current) : null,
    target: progress ? int(progress.target) : null,
    article: (raw.article as BadgeItem["article"]) ?? null,
  };
}

export function badgeFraction(b: BadgeItem): number | null {
  if (b.target == null || b.current == null || b.target <= 0) return null;
  return Math.max(0, Math.min(1, b.current / b.target));
}

export function parseBadgeBoard(data: unknown): BadgeBoard {
  const d = (data ?? {}) as Record<string, unknown>;
  const list = (Array.isArray(d.badges) ? d.badges : []).filter((b) => b && typeof b === "object").map((b) => item(b as Record<string, unknown>, false));
  // Earned first, then the closest to earning.
  list.sort((a, b) => (a.earned !== b.earned ? (a.earned ? -1 : 1) : (badgeFraction(b) ?? 0) - (badgeFraction(a) ?? 0)));
  return {
    badges: list,
    earnedCount: int(d.earned_count) ?? list.filter((b) => b.earned).length,
    total: int(d.total) ?? list.length,
    legacy: false,
  };
}

export function parseLegacyBadges(data: unknown): BadgeBoard {
  const d = (data ?? {}) as Record<string, unknown>;
  const list = (Array.isArray(d.badges) ? d.badges : []).filter((b) => b && typeof b === "object").map((b) => item(b as Record<string, unknown>, true));
  return { badges: list, earnedCount: list.length, total: list.length, legacy: true };
}

/** Fetch with the 404 fallback. `request` throws an error with a numeric `status` on HTTP failure. */
export async function fetchBadgeBoard(request: (path: string) => Promise<unknown>): Promise<BadgeBoard> {
  try {
    return parseBadgeBoard(await request(BADGE_BOARD_PATH));
  } catch (err) {
    if ((err as { status?: number })?.status !== 404) throw err;
  }
  return parseLegacyBadges(await request(LEGACY_BADGES_PATH));
}

export function badgesRemaining(board: BadgeBoard): number {
  return Math.max(0, board.total - board.earnedCount);
}

/** Habit badge names come from the server in English; show the app's translation by code. */
export function badgeText(t: (key: string, vars?: Record<string, string | number>, fallback?: string) => string, b: BadgeItem): { name: string; description: string } {
  if (!b.code) return { name: b.name, description: b.description };
  return { name: t(`badge_${b.code}_name`, undefined, b.name), description: t(`badge_${b.code}_desc`, undefined, b.description) };
}

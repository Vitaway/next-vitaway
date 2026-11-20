/**
 * W16 (BL-082, BL-087/096): member Rewards screen data.
 * GET /api/v1/mobile/points/ (summary), /history and /ways-to-earn. Values come from the
 * versioned admin settings; until the MD signs them off the server sends `proposal: true`.
 */

type Raw = Record<string, unknown>;
const obj = (v: unknown): Raw => (v && typeof v === "object" && !Array.isArray(v) ? (v as Raw) : {});
const int = (v: unknown, d = 0) => {
  const n = typeof v === "number" ? v : typeof v === "string" && v.trim() ? Number(v) : NaN;
  return Number.isFinite(n) ? n : d;
};
const str = (v: unknown) => (v == null ? "" : String(v));

export const POINTS_SUMMARY_PATH = "/api/v1/mobile/points/";
export const POINTS_HISTORY_PATH = "/api/v1/mobile/points/history";
export const POINTS_WAYS_PATH = "/api/v1/mobile/points/ways-to-earn";

export type PointsSummary = {
  balance: number;
  lifetime: number;
  level: { name: string; number: number; minPoints: number; nextLevel: string | null; nextAt: number | null; pointsToNext: number };
  today: { earned: number; loggingEarned: number; cap: number; capRemaining: number; capReached: boolean; message: string | null };
  streak: { current: number; longest: number; activeToday: boolean };
  valuePerPoint: number;
  eligible: boolean;
  ineligibleReason: string | null;
  weightPoints: boolean;
  proposal: boolean;
  settingsVersion: number;
};

export function normalizeSummary(v: unknown): PointsSummary {
  const r = obj(v);
  const level = obj(r.level);
  const today = obj(r.today);
  const streak = obj(r.streak);
  return {
    balance: int(r.balance),
    lifetime: int(r.lifetime_earned),
    level: {
      name: str(level.name) || "Starter",
      number: int(level.number, 1),
      minPoints: int(level.min_points),
      nextLevel: level.next_level ? str(level.next_level) : null,
      nextAt: level.next_at == null ? null : int(level.next_at),
      pointsToNext: int(level.points_to_next),
    },
    today: {
      earned: int(today.earned),
      loggingEarned: int(today.logging_earned),
      cap: int(today.daily_cap),
      capRemaining: int(today.cap_remaining),
      capReached: today.cap_reached === true,
      message: today.message ? str(today.message) : null,
    },
    streak: { current: int(streak.current_days), longest: int(streak.longest_days), activeToday: streak.active_today === true },
    valuePerPoint: int(r.value_per_point_rwf),
    eligible: r.eligible !== false,
    ineligibleReason: r.ineligible_reason ? str(r.ineligible_reason) : null,
    weightPoints: r.weight_points !== false,
    // Older servers do not send the flag; the values were always a proposal then.
    proposal: r.proposal !== false,
    settingsVersion: int(r.settings_version),
  };
}

/** 0–100: how far from this level's start to the next level. */
export function levelProgress(s: PointsSummary): number {
  if (s.level.nextAt == null) return 100;
  const span = s.level.nextAt - s.level.minPoints;
  if (span <= 0) return 100;
  return Math.max(0, Math.min(100, Math.round(((s.lifetime - s.level.minPoints) / span) * 100)));
}

export const worthRwf = (s: PointsSummary) => Math.round(s.balance * s.valuePerPoint);

export type WayToEarn = { action: string; label: string; description: string; points: number; countsTowardCap: boolean; note: string | null };
export type WaysToEarn = { proposal: boolean; dailyCap: number; actions: WayToEarn[]; streakMilestones: Array<{ days: number; points: number }>; levels: Array<{ name: string; minPoints: number }> };

export function normalizeWays(v: unknown): WaysToEarn {
  const r = obj(v);
  const list = (x: unknown) => (Array.isArray(x) ? x : []);
  return {
    proposal: r.proposal !== false,
    dailyCap: int(r.daily_cap),
    actions: list(r.actions).map((a) => {
      const x = obj(a);
      return { action: str(x.action), label: str(x.label), description: str(x.description), points: int(x.points), countsTowardCap: x.counts_toward_daily_cap === true, note: x.note ? str(x.note) : null };
    }),
    streakMilestones: list(r.streak_milestones).map((m) => ({ days: int(obj(m).days), points: int(obj(m).points) })),
    levels: list(r.levels).map((l) => ({ name: str(obj(l).name), minPoints: int(obj(l).min_points) })),
  };
}

export type HistoryEntry = { id: number; action: string; label: string; points: number; capped: boolean; correction: boolean; reason: string | null; day: string; at: string };
export type HistoryPage = { entries: HistoryEntry[]; nextBefore: string | null };

export function normalizeHistory(v: unknown): HistoryPage {
  const r = obj(v);
  const rows = Array.isArray(r.results) ? r.results : [];
  return {
    entries: rows.map((e) => {
      const x = obj(e);
      return { id: int(x.id), action: str(x.action), label: str(x.label), points: int(x.points), capped: x.capped === true, correction: x.type === "adjustment", reason: x.reason ? str(x.reason) : null, day: str(x.day), at: str(x.event_at) };
    }),
    nextBefore: r.next_before == null ? null : str(r.next_before),
  };
}

/** "+5", "-10", "0". */
export const signed = (n: number) => (n > 0 ? `+${n}` : String(n));

/** Group history by Kigali day for the list (keeps server order: newest first). */
export function byDay(entries: HistoryEntry[]): Array<{ day: string; entries: HistoryEntry[] }> {
  const out: Array<{ day: string; entries: HistoryEntry[] }> = [];
  for (const e of entries) {
    const last = out[out.length - 1];
    if (last && last.day === e.day) last.entries.push(e);
    else out.push({ day: e.day, entries: [e] });
  }
  return out;
}

"use client";

import { useState } from "react";
import { Cup, Flash, Refresh, ShieldTick, Star1 } from "iconsax-react";
import { useLanguage } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { mobileRequest } from "@/lib/plus/client/api";
import { useResource } from "@/lib/plus/client/use-resource";
import {
  byDay,
  levelProgress,
  normalizeHistory,
  normalizeSummary,
  normalizeWays,
  POINTS_HISTORY_PATH,
  POINTS_SUMMARY_PATH,
  POINTS_WAYS_PATH,
  signed,
  worthRwf,
  type HistoryEntry,
  type PointsSummary,
  type WaysToEarn,
} from "@/lib/plus/rewards";
import { ActionButton, AppBar, Card, CenterSpinner, EmptyState } from "../ui/vita";

const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;
const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);

/** Admin wording is English; in Kinyarwanda use the app's own names for the fixed action list. */
function useActionLabel() {
  const { language, t } = useLanguage();
  return (action: string, serverLabel: string) => (language === "en" ? serverLabel : t(`rewards_action_${action}`, undefined, serverLabel));
}

function ProposalNote() {
  const { t } = useLanguage();
  return (
    <div data-testid="rewards-proposal" style={{ display: "flex", gap: 10, padding: 12, marginBottom: 12, borderRadius: 10, background: "var(--vc-warn-bg)", color: "var(--vc-warn-ink)", fontSize: 13, lineHeight: 1.45, fontWeight: 600 }}>
      <ShieldTick size={18} color="currentColor" style={{ flex: "none", marginTop: 1 }} />
      <span>{t("rewards_proposal")}</span>
    </div>
  );
}

function PointsHero({ s, onBadges }: { s: PointsSummary; onBadges: () => void }) {
  const { t } = useLanguage();
  const pct = levelProgress(s);
  return (
    <section data-testid="rewards-hero" style={{ borderRadius: 14, padding: 18, marginBottom: 12, color: "#fff", background: "linear-gradient(135deg, #003e48 0%, #0b5a63 100%)", boxShadow: "0 8px 20px rgba(0,62,72,0.22)" }}>
      <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 999, background: "rgba(232,93,47,0.95)", fontSize: 12, fontWeight: 800 }}>{t("rewards_level", { name: s.level.name })}</span>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginTop: 8 }}>
        <span data-testid="rewards-balance" style={{ fontSize: 44, fontWeight: 800, lineHeight: 1 }}>{fmt(s.balance)}</span>
        <span style={{ paddingBottom: 6, color: "#c9e3e6", fontWeight: 600 }}>{t("rewards_points")}</span>
      </div>
      {s.valuePerPoint > 0 ? <p style={{ margin: "6px 0 0", fontSize: 13, color: "#c9e3e6" }}>{t("rewards_worth", { amount: fmt(worthRwf(s)) })}</p> : null}
      <p style={{ margin: "14px 0 6px", fontSize: 13, fontWeight: 700 }}>
        {s.level.nextLevel ? t("rewards_to_next", { points: fmt(s.level.pointsToNext), level: s.level.nextLevel }) : t("rewards_top_level")}
      </p>
      <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.18)", overflow: "hidden" }}>
        <span style={{ display: "block", height: "100%", width: `${pct}%`, borderRadius: 999, background: "#ff9b73" }} />
      </div>
      <button type="button" onClick={onBadges} style={{ marginTop: 14, padding: "9px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.35)", background: "transparent", color: "#fff", fontWeight: 700, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8 }}>
        <Star1 size={16} color="currentColor" /> {t("rewards_my_badges")}
      </button>
    </section>
  );
}

function TodayCard({ s }: { s: PointsSummary }) {
  const { t } = useLanguage();
  const pct = s.today.cap > 0 ? Math.min(100, Math.round((s.today.loggingEarned / s.today.cap) * 100)) : 0;
  return (
    <Card padding={16} style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center", background: "color-mix(in srgb, #E85D2F 16%, transparent)", color: "var(--vc-chip-orange-ink)" }}>
          <Flash size={20} color="currentColor" />
        </span>
        <span style={{ flex: 1 }}>
          <b style={{ display: "block", fontSize: 15, color: "var(--vc-ink)" }}>{s.streak.current > 0 ? t("rewards_streak", { days: s.streak.current }) : t("rewards_streak_none")}</b>
          <span style={{ fontSize: 12, color: navyA(0.6) }}>{s.streak.longest === 1 ? t("rewards_longest_one") : t("rewards_longest", { days: s.streak.longest })}</span>
        </span>
      </div>
      <p style={{ margin: "14px 0 6px", fontSize: 13, fontWeight: 700, color: "var(--vc-ink)" }} data-testid="rewards-today">
        {t("rewards_today", { earned: s.today.loggingEarned, cap: s.today.cap })}
      </p>
      <div style={{ height: 6, borderRadius: 999, background: navyA(0.1), overflow: "hidden" }}>
        <span style={{ display: "block", height: "100%", width: `${pct}%`, background: "#1d9e75" }} />
      </div>
      {s.today.capReached ? <p style={{ margin: "8px 0 0", fontSize: 12, color: navyA(0.65) }}>{t("rewards_cap_reached")}</p> : null}
    </Card>
  );
}

function WaysCard({ w, s }: { w: WaysToEarn; s: PointsSummary }) {
  const { t } = useLanguage();
  const label = useActionLabel();
  return (
    <Card padding={16} style={{ marginBottom: 12 }}>
      <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 800, color: "var(--vc-ink)" }}>{t("rewards_ways")}</h3>
      {w.actions.map((a) => (
        <div key={a.action} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: `1px solid ${navyA(0.08)}` }}>
          <span style={{ flex: 1 }}>
            <b style={{ display: "block", fontSize: 14, color: "var(--vc-ink)" }}>{label(a.action, a.label)}</b>
            <span style={{ fontSize: 12, color: navyA(0.6) }}>{a.countsTowardCap ? t("rewards_counts_cap") : t("rewards_no_cap")}</span>
            {a.note ? (
              <span data-testid="rewards-way-note" style={{ display: "block", marginTop: 4, fontSize: 12, fontWeight: 700, color: "var(--vc-warn-ink)" }}>
                {a.action === "log_reading" && !s.weightPoints ? t("rewards_weight_note") : a.note}
              </span>
            ) : null}
          </span>
          <span className="vita-chip" style={{ background: "color-mix(in srgb, #E85D2F 16%, transparent)", color: "var(--vc-chip-orange-ink)", fontWeight: 800 }}>+{a.points}</span>
        </div>
      ))}
      {w.streakMilestones.length ? (
        <div style={{ paddingTop: 10 }}>
          <b style={{ display: "block", fontSize: 14, color: "var(--vc-ink)" }}>{t("rewards_streak_bonus")}</b>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
            {w.streakMilestones.map((m) => (
              <span key={m.days} className="vita-chip" style={{ background: navyA(0.06), color: "var(--vc-ink)" }}>
                {t("rewards_streak_days", { days: m.days })} · +{m.points}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      <div style={{ display: "flex", gap: 10, marginTop: 14, padding: 12, borderRadius: 10, background: "color-mix(in srgb, #2BB3A3 12%, transparent)", color: "var(--vc-chip-teal-ink)", fontSize: 13, lineHeight: 1.45, fontWeight: 600 }}>
        <ShieldTick size={18} color="currentColor" style={{ flex: "none", marginTop: 1 }} />
        <span>{t("rewards_numbers_notice")}</span>
      </div>
    </Card>
  );
}

function HistoryCard({ entries, more, loadingMore, onMore }: { entries: HistoryEntry[]; more: boolean; loadingMore: boolean; onMore: () => void }) {
  const { t } = useLanguage();
  const label = useActionLabel();
  return (
    <Card padding={16} style={{ marginBottom: 12 }}>
      <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 800, color: "var(--vc-ink)" }}>{t("rewards_history")}</h3>
      {entries.length === 0 ? <p style={{ margin: "6px 0", fontSize: 13, color: navyA(0.6) }}>{t("rewards_history_empty")}</p> : null}
      {byDay(entries).map((g) => (
        <div key={g.day} style={{ marginTop: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: navyA(0.5) }}>{g.day}</span>
          {g.entries.map((e) => (
            <div key={e.id} data-testid="rewards-history-row" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${navyA(0.06)}` }}>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: "var(--vc-ink)" }}>{e.correction ? t("rewards_correction") : e.action && e.action !== "streak_milestone" ? label(e.action, e.label) : e.label}</span>
                {e.capped ? <span style={{ fontSize: 12, color: navyA(0.6) }}>{t("rewards_capped")}</span> : null}
                {e.correction && e.reason ? <span style={{ fontSize: 12, color: navyA(0.6) }}>{e.reason}</span> : null}
              </span>
              <b style={{ fontSize: 15, color: e.points < 0 ? "var(--vc-bad-ink)" : e.points > 0 ? "var(--vc-ok-ink)" : navyA(0.5) }}>{signed(e.points)}</b>
            </div>
          ))}
        </div>
      ))}
      {more ? <ActionButton full small tone="white" label={t("rewards_load_more")} loading={loadingMore} onClick={onMore} style={{ marginTop: 12 }} /> : null}
    </Card>
  );
}

export function RewardsScreen() {
  const { t } = useLanguage();
  const { push } = usePlusPaths();
  const summary = useResource<PointsSummary>(POINTS_SUMMARY_PATH, async () => normalizeSummary(await mobileRequest(POINTS_SUMMARY_PATH)));
  const ways = useResource<WaysToEarn>(POINTS_WAYS_PATH, async () => normalizeWays(await mobileRequest(POINTS_WAYS_PATH)));
  const history = useResource(POINTS_HISTORY_PATH, async () => normalizeHistory(await mobileRequest(`${POINTS_HISTORY_PATH}?limit=20`)));
  const [older, setOlder] = useState<HistoryEntry[]>([]);
  const [cursor, setCursor] = useState<string | null | undefined>(undefined);
  const [loadingMore, setLoadingMore] = useState(false);

  const s = summary.data;
  const nextBefore = cursor === undefined ? history.data?.nextBefore ?? null : cursor;
  const loadMore = async () => {
    if (!nextBefore) return;
    setLoadingMore(true);
    try {
      const page = normalizeHistory(await mobileRequest(`${POINTS_HISTORY_PATH}?limit=20&before=${encodeURIComponent(nextBefore)}`));
      setOlder((rows) => [...rows, ...page.entries]);
      setCursor(page.nextBefore);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={t("rewards_title")} />
      {summary.loading && !s ? (
        <CenterSpinner />
      ) : !s ? (
        <div style={{ paddingTop: 100 }}>
          <EmptyState title={t("network_error")} actionLabel={t("retry")} onAction={() => summary.reload()} actionIcon={<Refresh size={16} color="currentColor" />} />
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 28px" }}>
          {s.proposal || ways.data?.proposal ? <ProposalNote /> : null}
          {!s.eligible ? (
            <Card padding={16} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", color: "var(--vc-ink)" }}>
                <Cup size={20} color="currentColor" />
                <span style={{ fontSize: 14, lineHeight: 1.45 }}>{s.ineligibleReason === "under_age" ? t("rewards_under_age") : t("rewards_not_member")}</span>
              </div>
            </Card>
          ) : null}
          <PointsHero s={s} onBadges={() => push("/badges")} />
          <TodayCard s={s} />
          {ways.data ? <WaysCard w={ways.data} s={s} /> : null}
          <HistoryCard entries={[...(history.data?.entries ?? []), ...older]} more={!!nextBefore} loadingMore={loadingMore} onMore={() => void loadMore()} />
        </div>
      )}
    </div>
  );
}

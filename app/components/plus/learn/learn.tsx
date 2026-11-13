"use client";

import { useEffect, useMemo, useState } from "react";
import { Book1, CloudCross, Crown1, Edit2, Gallery, Lock, TickCircle } from "iconsax-react";
import { badgeFraction, badgeText, fetchBadgeBoard, type BadgeBoard, type BadgeItem } from "@/lib/plus/badge-board";
import { useLanguage, useT } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { mobileRequest, mediaUrl } from "@/lib/plus/client/api";
import { useArticles, useSubscription, type Article } from "@/lib/plus/client/data";
import { invalidate, useResource } from "@/lib/plus/client/use-resource";
import { ActionButton, AppBar, CenterSpinner, EmptyState, Modal, Page, SectionLabel, Tabs, useFeedback } from "../ui/vita";
import { YourPathBlock } from "./your-path";

const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const cap = (s: string) => s.split(" ").map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(" ");
const ARTICLE_STASH = "vitaway.plus.article.";

export function stashArticle(a: Article) {
  try {
    sessionStorage.setItem(ARTICLE_STASH + a.id, JSON.stringify(a));
  } catch {
    /* private mode */
  }
}

function ArticleImage({ src, height, radius = 8 }: { src?: string | null; height: number | string; radius?: number }) {
  const [failed, setFailed] = useState(false);
  const url = src ? mediaUrl(src) : null;
  if (!url || failed)
    return (
      <div style={{ height, borderRadius: radius, background: "var(--vc-tile-mint)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Gallery size={32} color={navyA(0.35)} />
      </div>
    );
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" onError={() => setFailed(true)} style={{ width: "100%", height, objectFit: "cover", borderRadius: radius, display: "block" }} />;
}

/** article_vertical_list_tile.dart */
function ArticleTile({ article, onClick }: { article: Article; onClick: () => void }) {
  const d = article.created_at ? new Date(article.created_at) : null;
  const date = d && !Number.isNaN(d.getTime()) ? `${DAYS[d.getDay()]}, ${d.getDate()}, ${MONTHS[d.getMonth()]} ${d.getFullYear()}` : "";
  return (
    <div style={{ padding: 10 }}>
      <button type="button" onClick={onClick} style={{ width: "100%", height: 120, padding: 10, display: "flex", alignItems: "center", gap: 14, borderRadius: 10, border: `1px solid ${navyA(0.08)}`, textAlign: "left", background: "transparent" }}>
        <div style={{ height: "100%", aspectRatio: "16 / 9", flex: "none", borderRadius: 8, boxShadow: "0 3px 12px color-mix(in srgb, var(--vc-teal) 50%, transparent)" }}>
          <ArticleImage src={article.image} height="100%" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--vc-navy)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{article.title}</div>
          <div style={{ marginTop: 10, fontSize: 13, color: navyA(0.55), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{date}</div>
        </div>
      </button>
    </div>
  );
}

/** learn_page.dart: Informative · Sustaining · Earn badges. */
export function LearnScreen() {
  const t = useT();
  const { language } = useLanguage();
  const { push } = usePlusPaths();
  const { confirm } = useFeedback();
  const { active } = useSubscription();
  const { articles, loading, error, reload } = useArticles(language);
  const [tab, setTab] = useState<"1" | "2" | "3">("1");
  const filtered = articles.filter((a) => String(a.category) === tab);
  const open = async (a: Article) => {
    if (tab === "3" && !active) {
      const go = await confirm({ title: t("premium_feature"), message: t("premium_text"), confirmLabel: t("choose_plan"), cancelLabel: t("cancel") });
      if (go) push("/plans");
      return;
    }
    stashArticle(a);
    push(`/articles/${a.id}`);
  };
  return (
    <Page>
      <AppBar title={cap(t("learn_title"))} bottom={<Tabs onBar value={tab} onChange={setTab} tabs={[{ value: "1", label: cap(t("informative")) }, { value: "2", label: cap(t("sustaining")) }, { value: "3", label: cap(t("earn_badges")) }]} />} />
      <YourPathBlock />
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 24 }}>
        {loading ? (
          <CenterSpinner />
        ) : error && !articles.length ? (
          <EmptyState title="Could not load articles" subtitle="Check your connection and try again." actionLabel={t("retry")} onAction={() => void reload()} />
        ) : !articles.length ? (
          <EmptyState title="Nothing to read yet" subtitle="Articles from the care team will show up here." />
        ) : !filtered.length ? (
          <EmptyState title={t("no_articles")} subtitle={t("no_articles_body")} />
        ) : (
          filtered.map((a) => <ArticleTile key={a.id} article={a} onClick={() => void open(a)} />)
        )}
      </div>
    </Page>
  );
}

const ALLOWED = new Set(["P", "BR", "B", "STRONG", "I", "EM", "U", "UL", "OL", "LI", "H1", "H2", "H3", "H4", "H5", "H6", "BLOCKQUOTE", "A", "IMG", "SPAN", "DIV", "TABLE", "THEAD", "TBODY", "TR", "TD", "TH", "HR", "FIGURE", "FIGCAPTION", "SMALL", "SUB", "SUP", "CODE", "PRE"]);

/** flutter_html renders the article body; keep only plain content tags. */
function sanitize(html: string): string {
  if (typeof window === "undefined") return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  const walk = (node: Element) => {
    for (const child of Array.from(node.children)) {
      if (!ALLOWED.has(child.tagName)) {
        if (["SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED", "FORM", "INPUT", "BUTTON", "LINK", "META"].includes(child.tagName)) child.remove();
        else {
          walk(child);
          child.replaceWith(...Array.from(child.childNodes));
        }
        continue;
      }
      for (const attr of Array.from(child.attributes)) {
        const name = attr.name.toLowerCase();
        const keep = (child.tagName === "A" && name === "href") || (child.tagName === "IMG" && (name === "src" || name === "alt")) || name === "colspan" || name === "rowspan";
        if (!keep || /^\s*javascript:/i.test(attr.value)) child.removeAttribute(attr.name);
      }
      if (child.tagName === "A") {
        child.setAttribute("target", "_blank");
        child.setAttribute("rel", "noopener noreferrer");
      }
      walk(child);
    }
  };
  walk(doc.body);
  return doc.body.innerHTML;
}

/** article.dart Article_details: category 3 can be completed for a badge. */
export function ArticleScreen({ id }: { id: number }) {
  const [stashed, setStashed] = useState<Article | null>(null);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(ARTICLE_STASH + id);
      if (raw) setStashed(JSON.parse(raw) as Article);
    } catch {
      /* ignore */
    }
  }, [id]);
  const fetched = useResource<Article>(`/api/articles/${id}/`);
  const article = fetched.data ?? stashed;
  const isBadge = Number(article?.category) === 3;
  const completion = useResource<{ is_completed?: boolean }>(isBadge ? `/api/check_article_completion/${id}/` : null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const html = useMemo(() => sanitize(article?.content ?? ""), [article?.content]);
  const completed = !isBadge || done || Boolean(completion.data?.is_completed);

  if (!article)
    return (
      <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
        <AppBar title="" />
        {fetched.loading ? <CenterSpinner /> : <p style={{ margin: "40px 0", textAlign: "center", color: "var(--vc-ink)" }}>Article not found</p>}
      </div>
    );
  const d = article.created_at ? new Date(article.created_at) : null;
  const date = d && !Number.isNaN(d.getTime()) ? `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, '${d.getFullYear()}` : "";
  const complete = async () => {
    setLoading(true);
    try {
      await mobileRequest(`/api/articles/${id}/complete/`, { method: "POST" });
      setDone(true);
      setCelebrate(true);
      invalidate("/badges/", BADGE_BOARD_KEY, `/api/check_article_completion/${id}/`);
    } catch {
      /* Flutter stays quiet */
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title="" />
      {isBadge && completion.loading ? (
        <CenterSpinner />
      ) : isBadge && completion.error && !completion.data ? (
        <EmptyState title="Could not load this article" />
      ) : (
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 28 }}>
          <div style={{ padding: "8px 16px 0" }}>
            <ArticleImage src={article.image} height={220} radius={10} />
          </div>
          <h1 style={{ margin: "16px 20px 0", fontSize: 24, fontWeight: 800, lineHeight: 1.2, letterSpacing: -0.7, color: "var(--vc-navy)" }}>{article.title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "10px 20px 0", color: navyA(0.55), fontSize: 13, fontWeight: 600 }}>
            <Edit2 size={16} color="currentColor" />
            <span style={{ flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>By {article.author ?? ""}</span>
            <span>{date}</span>
          </div>
          <div style={{ height: 1, margin: "14px 20px", background: navyA(0.08) }} />
          <div className="vita-article" style={{ padding: "0 20px", fontSize: 15, lineHeight: 1.6, color: "var(--vc-body)" }} dangerouslySetInnerHTML={{ __html: html }} />
          {isBadge ? (
            <div style={{ padding: "20px 20px 0" }}>
              {completed ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 18px", borderRadius: 10, background: "var(--vc-tile-mint)" }}>
                  <TickCircle size={20} color="#2FBF71" variant="Bold" />
                  <span style={{ fontSize: 15, fontWeight: 800, color: "var(--vc-navy)" }}>Article completed</span>
                </div>
              ) : (
                <ActionButton full label="Complete" loading={loading} onClick={() => void complete()} />
              )}
            </div>
          ) : null}
        </div>
      )}
      <Modal open={celebrate} compact title="Congratulations!" onClose={() => setCelebrate(false)} actions={<ActionButton small tone="teal" label="Continue" onClick={() => setCelebrate(false)} />}>
        <div style={{ textAlign: "center" }}>
          <div className="vita-confetti" aria-hidden style={{ fontSize: 44 }}>🎉</div>
          <p style={{ margin: "10px 0 6px", fontSize: 16, fontWeight: 700, color: "var(--vc-ink)" }}>You&apos;ve completed the article</p>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "var(--vc-teal)" }}>You earned yourself a badge!</p>
        </div>
      </Modal>
    </div>
  );
}

const BADGE_STASH = "vitaway.plus.badge2.";
const BADGE_BOARD_KEY = "badge-board";

function BadgeImage({ src, size, locked = false }: { src?: string; size: number; locked?: boolean }) {
  const [failed, setFailed] = useState(false);
  const url = src ? mediaUrl(src) : null;
  if (!url || failed) return locked ? <Lock size={size * 0.5} color={navyA(0.35)} /> : <Crown1 size={size * 0.5} color="var(--vc-navy)" />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" width={size} height={size} onError={() => setFailed(true)} style={{ width: size, height: size, objectFit: "contain" }} />;
}

/** badges.dart: earned and locked habit badges (BL-090), falls back to /badges/ on old servers. */
function useBadgeBoard() {
  return useResource<BadgeBoard>(BADGE_BOARD_KEY, () => fetchBadgeBoard((path) => mobileRequest<unknown>(path)));
}

function ProgressBar({ value, height }: { value: number; height: number }) {
  return (
    <div style={{ width: "100%", height, borderRadius: 99, background: navyA(0.08), overflow: "hidden" }}>
      <div style={{ width: `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%`, height: "100%", background: "var(--vc-teal)", borderRadius: 99 }} />
    </div>
  );
}

function BadgeTileImage({ badge }: { badge: BadgeItem }) {
  const [failed, setFailed] = useState(false);
  const url = badge.image ? mediaUrl(badge.image) : null;
  const icon = badge.earned ? <Crown1 size={40} color="var(--vc-navy)" /> : <Lock size={40} color={navyA(0.35)} />;
  if (!url || failed) return icon;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" width={40} height={40} onError={() => setFailed(true)} style={{ width: 40, height: 40, objectFit: "contain", opacity: badge.earned ? 1 : 0.35 }} />;
}

export function BadgesScreen() {
  const t = useT();
  const { push } = usePlusPaths();
  const r = useBadgeBoard();
  const board = r.data;
  const badges = board?.badges ?? [];
  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={t("my_badges")} />
      {r.loading && !board ? (
        <CenterSpinner />
      ) : r.error && !board ? (
        <EmptyState title={t("badges_load_failed")} subtitle={t("network_error")} actionLabel={t("retry")} onAction={() => void r.reload()} actionIcon={<CloudCross size={16} color="currentColor" />} />
      ) : !badges.length ? (
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px 32px" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/plus-assets/empty.svg" alt="" style={{ width: 200, height: 150, objectFit: "contain" }} />
          </div>
          <h2 style={{ margin: "14px 0 0", textAlign: "center", fontSize: 22, fontWeight: 800, letterSpacing: -0.4, color: "var(--vc-navy)" }}>{t("badges_empty_title")}</h2>
          <p style={{ margin: "8px 0 18px", textAlign: "center", fontSize: 14, lineHeight: 1.45, color: navyA(0.6) }}>{t("badges_empty_body")}</p>
          <div style={{ padding: 16, borderRadius: 10, background: "var(--vc-surface)", border: `1px solid ${navyA(0.08)}` }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--vc-navy)", marginBottom: 12 }}>{t("badges_how_title")}</div>
            {[t("badges_how_1"), t("badges_how_2"), t("badges_how_3")].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginTop: i ? 12 : 0 }}>
                <span style={{ width: 28, height: 28, borderRadius: "50%", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--vc-tile-mint)", color: "var(--vc-navy)", fontWeight: 800, fontSize: 13 }}>{i + 1}</span>
                <span style={{ paddingTop: 4, fontSize: 14, lineHeight: 1.35, color: "var(--vc-ink)" }}>{s}</span>
              </div>
            ))}
          </div>
          <div style={{ height: 20 }} />
          <ActionButton full label={t("badges_start_learning")} onClick={() => push("/articles")} />
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 32px" }}>
          <div style={{ padding: 16, borderRadius: 10, background: "var(--vc-surface)", border: `1px solid ${navyA(0.08)}`, marginBottom: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--vc-navy)" }}>{t("badges_earned_of", { earned: board!.earnedCount, total: board!.total })}</div>
            <div style={{ marginTop: 4, fontSize: 13, lineHeight: 1.4, color: navyA(0.6) }}>{t(board!.legacy ? "badges_legacy_note" : "badges_habit_note")}</div>
            {!board!.legacy ? (
              <div style={{ marginTop: 10 }}>
                <ProgressBar value={board!.earnedCount / (board!.total > 0 ? board!.total : 1)} height={7} />
              </div>
            ) : null}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignContent: "start" }}>
            {badges.map((b, i) => {
              const text = badgeText(t, b);
              const fraction = badgeFraction(b);
              return (
                <button
                  key={b.code ?? b.id ?? i}
                  type="button"
                  aria-label={`${text.name}, ${t(b.earned ? "badge_earned" : "badge_locked")}`}
                  onClick={() => {
                    try {
                      sessionStorage.setItem(BADGE_STASH + i, JSON.stringify(b));
                    } catch {
                      /* ignore */
                    }
                    push(`/badges/${i}`);
                  }}
                  style={{
                    borderRadius: 10,
                    background: b.earned ? "var(--vc-surface)" : "var(--vc-canvas)",
                    border: b.earned ? "1.4px solid color-mix(in srgb, var(--vc-teal) 50%, transparent)" : `1px solid ${navyA(0.08)}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 12,
                    minHeight: 170,
                  }}
                >
                  <span style={{ width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: b.earned ? "var(--vc-tile-mint)" : navyA(0.05) }}>
                    <BadgeTileImage badge={b} />
                  </span>
                  <span style={{ marginTop: 8, fontSize: 14, fontWeight: 700, textAlign: "center", color: b.earned ? "var(--vc-navy)" : navyA(0.6), display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{text.name}</span>
                  <span style={{ height: 6 }} />
                  {b.earned ? (
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--vc-teal)" }}>{t("badge_earned")}</span>
                  ) : fraction != null ? (
                    <>
                      <ProgressBar value={fraction} height={5} />
                      <span style={{ marginTop: 4, fontSize: 12, fontWeight: 600, color: navyA(0.55) }}>{`${b.current} / ${b.target}`}</span>
                    </>
                  ) : (
                    <span style={{ fontSize: 12, fontWeight: 600, color: navyA(0.55) }}>{t("badge_locked")}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/** badge_details.dart */
export function BadgeDetailScreen({ index }: { index: number }) {
  const t = useT();
  const { push } = usePlusPaths();
  const r = useBadgeBoard();
  const [stashed, setStashed] = useState<BadgeItem | null>(null);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(BADGE_STASH + index);
      if (raw) setStashed(JSON.parse(raw) as BadgeItem);
    } catch {
      /* ignore */
    }
  }, [index]);
  const badge = r.data?.badges?.[index] ?? stashed;
  if (!badge) return <div className="vita-page"><AppBar title={t("my_badges")} />{r.loading ? <CenterSpinner /> : <EmptyState title={t("badges_empty_title")} />}</div>;
  const text = badgeText(t, badge);
  const status = badge.earned
    ? t("badge_earned")
    : badge.current != null && badge.target != null
      ? t("badge_progress_of", { current: badge.current, target: badge.target })
      : t("badge_locked");
  const article = badge.article ?? null;
  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={text.name} />
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: 112, height: 112, borderRadius: "50%", background: "var(--vc-tile-mint)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <BadgeImage src={badge.image ?? undefined} size={80} locked={!badge.earned} />
          </div>
        </div>
        <h2 style={{ margin: "16px 0 0", textAlign: "center", fontSize: 24, fontWeight: 800, letterSpacing: -0.5, color: "var(--vc-navy)" }}>{text.name}</h2>
        {text.description ? <p style={{ margin: "10px 0 0", textAlign: "center", fontSize: 15, lineHeight: 1.5, color: navyA(0.65) }}>{text.description}</p> : null}
        <p style={{ margin: "14px 0 0", textAlign: "center", fontSize: 14, fontWeight: 700, color: badge.earned ? "var(--vc-teal)" : navyA(0.55) }}>{status}</p>
        {article ? (
          <div style={{ marginTop: 24 }}>
            <SectionLabel icon={<Book1 size={18} color="currentColor" />} label={t("view_article")} />
            <div style={{ marginTop: 10, borderRadius: 10, background: "var(--vc-surface)", overflow: "hidden" }}>
              <ArticleImage src={article.image} height={180} radius={0} />
              <div style={{ padding: 14, fontSize: 15, fontWeight: 800, lineHeight: 1.35, color: "var(--vc-navy)" }}>{article.title ?? ""}</div>
            </div>
          </div>
        ) : null}
      </div>
      {article?.id ? (
        <div style={{ position: "sticky", bottom: 0, padding: "8px 20px calc(12px + env(safe-area-inset-bottom))", background: "var(--vc-canvas)" }}>
          <ActionButton full label={t("view_article")} onClick={() => push(`/articles/${article.id}`)} />
        </div>
      ) : null}
    </div>
  );
}

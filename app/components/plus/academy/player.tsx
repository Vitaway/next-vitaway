"use client";

/**
 * Academy course player (Harvard Health Online Learning pattern): crumb + bookmark, page progress bar,
 * pages of blocks, Back / Next at the bottom, and a course menu (Lessons, Progress, Resources, Notes,
 * Workbook, Bookmarks). The menu is a drawer on phones and a column on wide screens.
 */
import "./academy.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight3, Menu as MenuIcon } from "@/lib/plus/icons";
import {
  academyKeys, fetchItem, fetchMenu, saveProgress, setBookmark,
  type AcademyItem, type CourseMenu,
} from "@/lib/plus/academy";
import { useLanguage } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { useMe } from "@/lib/plus/client/data";
import { invalidate, useResource } from "@/lib/plus/client/use-resource";
import { MobileApiError } from "@/lib/plus/client/api";
import { AppBar, CenterSpinner, EmptyState, Page, useFeedback } from "../ui/vita";
import { BlockView, type BlockState } from "./blocks";
import { CourseSidebar, sectionLabel } from "./sidebar";
import { useAcademyText } from "./text";

export function CoursePlayer({ courseId, itemId }: { courseId: string; itemId: string }) {
  const T = useAcademyText();
  const { language } = useLanguage();
  const { push, replace } = usePlusPaths();
  const { toast } = useFeedback();
  const { user } = useMe();
  const item = useResource<AcademyItem>(academyKeys.item(itemId), () => fetchItem(itemId));
  const menu = useResource<CourseMenu>(academyKeys.menu(courseId), () => fetchMenu(courseId));
  const [page, setPage] = useState(0);
  const [state, setState] = useState<BlockState>({});
  const [drawer, setDrawer] = useState(false);
  const [wide, setWide] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const loadedFor = useRef<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const it = item.data;

  // Reset to the saved page and state when a new item loads.
  useEffect(() => {
    if (!it || loadedFor.current === it.id) return;
    loadedFor.current = it.id;
    setPage(Math.min(it.progress?.last_page ?? 0, Math.max(0, it.pages.length - 1)));
    setState((it.progress?.state as BlockState) ?? {});
    setBookmarked(it.bookmarked);
    setDrawer(false);
  }, [it]);

  const persist = useCallback(
    (nextPage: number, nextState: BlockState, completed = false) => {
      if (!it) return Promise.resolve();
      if (saveTimer.current) clearTimeout(saveTimer.current);
      return saveProgress(it.id, { last_page: nextPage, state: nextState, ...(completed ? { completed: true } : {}) })
        .then(() => {
          if (completed) invalidate(academyKeys.home, academyKeys.menu(courseId));
        })
        .catch(() => undefined);
    },
    [it, courseId],
  );

  const update = useCallback(
    (fn: (s: BlockState) => BlockState) => {
      setState((prev) => {
        const next = fn(prev);
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => void persist(page, next), 600);
        return next;
      });
    },
    [persist, page],
  );

  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
  }, []);

  const goPage = (p: number) => {
    setPage(p);
    void persist(p, state);
    if (typeof window !== "undefined") document.querySelector(".ac-main")?.scrollTo({ top: 0 });
  };

  const finish = async () => {
    if (!it) return;
    await persist(page, state, true);
    toast(T.doneToast(it.title));
    if (it.next) push(`/learn/${courseId}/${it.next}`);
    else replace("/articles");
  };

  const toggleBookmark = async () => {
    if (!it) return;
    const on = !bookmarked;
    setBookmarked(on);
    try {
      await setBookmark(it.id, on);
      invalidate(academyKeys.home);
    } catch {
      setBookmarked(!on);
    }
  };

  if (item.loading && !it) {
    return (
      <Page width="wide">
        <AppBar title={menu.data?.short ?? T.myProgramme} backTo="/articles" />
        <CenterSpinner />
      </Page>
    );
  }
  if (!it) {
    const msg = item.error instanceof MobileApiError ? String((item.error.body as { error?: string; detail?: string } | undefined)?.error ?? (item.error.body as { detail?: string } | undefined)?.detail ?? "") : "";
    return (
      <Page width="wide">
        <AppBar title={menu.data?.short ?? T.myProgramme} backTo="/articles" />
        <div style={{ paddingTop: 60 }}>
          <EmptyState title={msg || T.couldNotLoad} subtitle={msg ? undefined : T.notOpen} actionLabel={T.retry} onAction={() => void item.reload()} />
        </div>
      </Page>
    );
  }

  const pages = it.pages;
  const p = Math.min(page, pages.length - 1);
  const pg = pages[p];
  const last = p >= pages.length - 1;
  const ctx = {
    item: it,
    lang: language,
    state,
    update,
    firstName: String(user?.first_name ?? "").trim(),
    onComplete: () => void persist(p, state, true),
    onWorkbookSaved: () => {
      invalidate(academyKeys.item(it.id), academyKeys.menu(courseId), academyKeys.home);
      void item.reload();
    },
  };
  const title = language === "rw" && String(it.rw?.title ?? "").trim() ? String(it.rw.title) : it.title;

  return (
    <Page width="wide" className="ac-player-page">
      <AppBar
        title={it.course.short}
        backTo="/articles"
        actions={
          <button type="button" className="vita-circle-btn ac-menu-btn" aria-label={drawer ? T.closeMenu : T.menu} aria-expanded={drawer} onClick={() => setDrawer((v) => !v)}>
            <MenuIcon size={20} color="currentColor" />
          </button>
        }
      />
      <div className={`ac-player ${wide ? "is-wide" : ""}`}>
        <CourseSidebar
          menu={menu.data ?? null}
          current={it}
          page={p}
          drawer={drawer}
          onClose={() => setDrawer(false)}
          onHide={() => setWide(true)}
          onPage={(n) => { goPage(n); setDrawer(false); }}
          onOpen={(id) => push(`/learn/${courseId}/${id}`)}
          reloadMenu={() => void menu.reload()}
        />
        {drawer ? <div className="ac-scrim" onClick={() => setDrawer(false)} aria-hidden /> : null}

        <main className="ac-main">
          {wide ? <button type="button" className="ac-btn ac-show-menu" onClick={() => setWide(false)}><MenuIcon size={16} color="currentColor" /> {T.showMenu}</button> : null}
          <div className="ac-crumb-row">
            <p className="ac-crumb">
              {sectionLabel(it.section, T)} / <b>{title}</b>
            </p>
            <button type="button" className={`ac-bm ${bookmarked ? "on" : ""}`} aria-pressed={bookmarked} aria-label={bookmarked ? T.unbookmark : T.bookmark} onClick={() => void toggleBookmark()}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden><path d="M6 3h12v18l-6-4-6 4z" /></svg>
            </button>
          </div>
          <div className="ac-pbar" aria-hidden><i style={{ width: `${((p + 1) / pages.length) * 100}%` }} /></div>
          <div className="ac-body">
            <p className="ac-eyebrow">{pg.title}</p>
            {pg.blocks.map((b, bi) => (
              <div key={`${it.id}-${p}-${bi}`} className="ac-blk">
                <BlockView block={b} path={`pages.${p}.blocks.${bi}`} ctx={ctx} />
              </div>
            ))}
          </div>
          <nav className="ac-nav" aria-label={T.pageOf(p + 1, pages.length)}>
            <button
              type="button"
              className="ac-btn"
              disabled={!p && !it.prev}
              onClick={() => (p ? goPage(p - 1) : it.prev ? push(`/learn/${courseId}/${it.prev}`) : undefined)}
            >
              <ArrowLeft size={18} color="currentColor" /> {T.back}
            </button>
            <span className="ac-pg">{T.pageOf(p + 1, pages.length)}</span>
            <button type="button" className="ac-btn primary" onClick={() => (last ? void finish() : goPage(p + 1))}>
              {last ? T.finish : T.next} <ArrowRight3 size={18} color="currentColor" />
            </button>
          </nav>
        </main>
      </div>
    </Page>
  );
}

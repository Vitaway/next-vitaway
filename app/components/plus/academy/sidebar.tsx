"use client";

/**
 * Course sidebar for the Academy player. One look on every screen size: a column on tablet/web, a drawer on phones.
 *
 * - Teal header: progress ring, course name, "Week 2 of 12".
 * - Icon tabs (Lessons, Progress, Resources, Notes, Workbook, Saved) instead of stacked accordions.
 * - Lessons: one card per week. Only the week you are in opens by default, as a step timeline with the open
 *   lesson's pages nested under it. Finished weeks fold to a tick; locked weeks fold into one "Coming up" list.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown2, Book1, Calendar1, Chart, DocumentText, Edit2, Lock, MdChevronLeft, MdClose, NoteText, Save2, TickCircle, Trash } from "@/lib/plus/icons";
import { academyKeys, addNote, deleteNote, fetchAcademyHome, formatOpensOn, type AcademyItem, type CourseMenu, type MenuItem, type MenuSection } from "@/lib/plus/academy";
import { useLanguage } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { useResource } from "@/lib/plus/client/use-resource";
import { CenterSpinner } from "../ui/vita";
import { useAcademyText } from "./text";

type Text = ReturnType<typeof useAcademyText>;
type Tab = "lessons" | "progress" | "resources" | "notes" | "workbook" | "saved";

const ICON = 15;
export const TYPE_ICON: Record<string, React.ReactNode> = {
  lesson: <Book1 size={ICON} color="currentColor" />,
  intro: <Book1 size={ICON} color="currentColor" />,
  brief: <Book1 size={ICON} color="currentColor" />,
  recipe: <Save2 size={ICON} color="currentColor" />,
  points: <TickCircle size={ICON} color="currentColor" />,
  workbook: <Edit2 size={ICON} color="currentColor" />,
  quiz: <DocumentText size={ICON} color="currentColor" />,
  kc: <DocumentText size={ICON} color="currentColor" />,
  coach: <Calendar1 size={ICON} color="currentColor" />,
  finish: <TickCircle size={ICON} color="currentColor" />,
};

export const sectionLabel = (s: { week: number | null; title: string }, T: Text) =>
  s.week === 0 || s.week === 13 ? s.title : s.week ? `${T.week} ${s.week}` : s.title;

function Ring({ pct, size = 58 }: { pct: number; size?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <span className="acs-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="6" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ac-or)" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${(c * Math.max(0, Math.min(100, pct))) / 100} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <b>{pct}%</b>
    </span>
  );
}

type Props = {
  menu: CourseMenu | null;
  current: AcademyItem;
  page: number;
  drawer: boolean;
  onClose: () => void;
  onHide: () => void;
  onPage: (p: number) => void;
  onOpen: (id: string) => void;
  reloadMenu: () => void;
};

export function CourseSidebar({ menu, current, page, drawer, onClose, onHide, onPage, onOpen, reloadMenu }: Props) {
  const T = useAcademyText();
  const { language } = useLanguage();
  const [tab, setTab] = useState<Tab>("lessons");
  const weeks = menu?.sections.filter((s) => s.week && s.week >= 1 && s.week <= 12).length ?? 0;
  const wk = current.section.week;
  const sub = wk && wk >= 1 && wk <= 12 && weeks ? T.weekOf(wk, weeks) : current.section.title;
  const workbooks = useMemo(() => (menu ? menu.sections.flatMap((s) => s.items.filter((i) => i.type === "workbook").map((i) => ({ s, i }))) : []), [menu]);

  const tabs: { id: Tab; label: string; icon: React.ReactNode; show: boolean }[] = [
    { id: "lessons", label: T.lessons, icon: <Book1 size={18} color="currentColor" />, show: true },
    { id: "progress", label: T.progress, icon: <Chart size={18} color="currentColor" />, show: true },
    { id: "resources", label: T.resources, icon: <DocumentText size={18} color="currentColor" />, show: !!menu?.resources },
    { id: "notes", label: T.notes, icon: <NoteText size={18} color="currentColor" />, show: true },
    { id: "workbook", label: T.workbook, icon: <Edit2 size={18} color="currentColor" />, show: workbooks.length > 0 },
    { id: "saved", label: T.saved, icon: <Save2 size={18} color="currentColor" />, show: true },
  ];

  return (
    <aside className={`ac-menu acs ${drawer ? "open" : ""}`} aria-label={T.menu}>
      <header className="acs-head">
        <div className="acs-head-top">
          <span className="acs-kicker">{T.yourCourse}</span>
          <button type="button" className="acs-hbtn acs-hide" aria-label={T.collapse} title={T.collapse} onClick={onHide}>
            <MdChevronLeft size={20} color="currentColor" />
          </button>
          <button type="button" className="acs-hbtn acs-close" aria-label={T.closeMenu} onClick={onClose}>
            <MdClose size={20} color="currentColor" />
          </button>
        </div>
        <div className="acs-head-main">
          <Ring pct={menu?.totals.pct ?? 0} />
          <div className="acs-head-tx">
            <h2>{current.course.short}</h2>
            <p>{sub}</p>
            {menu ? <small>{T.itemsDone(menu.totals.done, menu.totals.total)}</small> : null}
          </div>
        </div>
      </header>

      <div className="acs-tabs" role="tablist" aria-label={T.menu}>
        {tabs.filter((t) => t.show).map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)}>
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="acs-panel" role="tabpanel">
        {!menu ? (
          <CenterSpinner />
        ) : tab === "lessons" ? (
          <LessonsPanel menu={menu} current={current} page={page} onPage={onPage} onOpen={onOpen} />
        ) : tab === "progress" ? (
          <ProgressPanel menu={menu} />
        ) : tab === "resources" ? (
          <ResourcesPanel menu={menu} onOpen={onOpen} />
        ) : tab === "notes" ? (
          <NotesPanel menu={menu} current={current} reloadMenu={reloadMenu} />
        ) : tab === "workbook" ? (
          <div className="acs-list">
            {workbooks.map(({ s, i }) => (
              <button key={i.id} type="button" className="acs-row" disabled={!s.open || !i.live} onClick={() => onOpen(i.id)}>
                <span className="acs-ic"><Edit2 size={ICON} color="currentColor" /></span>
                <span className="acs-row-tx"><b>{sectionLabel(s, T)}</b><small>{s.title}</small></span>
                <span className={`acs-chip ${i.workbook === "replied" ? "mint" : i.workbook === "complete" ? "teal" : ""}`}>
                  {!s.open ? T.opens(formatOpensOn(s.opens_on, language)) : i.workbook === "replied" ? T.wbReplied : i.workbook === "complete" ? T.wbComplete : i.live ? T.wbNone : T.soon}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <SavedPanel onOpen={onOpen} />
        )}
      </div>
    </aside>
  );
}

function stateOf(s: MenuSection, currentSectionId: string): "done" | "current" | "open" | "locked" {
  if (!s.open) return "locked";
  if (s.id === currentSectionId) return "current";
  const live = s.items.filter((i) => i.live);
  if (live.length && live.every((i) => i.done)) return "done";
  return "open";
}

function LessonsPanel({ menu, current, page, onPage, onOpen }: { menu: CourseMenu; current: AcademyItem; page: number; onPage: (p: number) => void; onOpen: (id: string) => void }) {
  const T = useAcademyText();
  const { language } = useLanguage();
  const curSec = menu.sections.find((s) => s.items.some((i) => i.id === current.id))?.id ?? "";
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set([curSec]));
  const ref = useRef<HTMLDivElement>(null);

  // Moving to a lesson in another week opens that week.
  useEffect(() => {
    if (curSec) setOpenIds((prev) => (prev.has(curSec) ? prev : new Set([...prev, curSec])));
  }, [curSec]);

  // Bring the open lesson into view inside the panel (never scroll the page).
  useEffect(() => {
    const box = ref.current?.closest<HTMLElement>(".acs-panel");
    const wk = ref.current?.querySelector<HTMLElement>(".acs-wk.current");
    const step = ref.current?.querySelector<HTMLElement>(".acs-step.cur");
    if (!box || !wk) return;
    // Show the week's header; if the open lesson would then sit below the fold, scroll just enough to show it too.
    const top = box.getBoundingClientRect().top;
    let y = box.scrollTop + wk.getBoundingClientRect().top - top - 8;
    if (step) {
      const stepBottom = box.scrollTop + step.getBoundingClientRect().bottom - top;
      if (stepBottom - y > box.clientHeight) y = stepBottom - box.clientHeight + 16;
    }
    box.scrollTop = Math.max(0, y);
  }, [current.id]);

  const toggle = (id: string) => setOpenIds((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  const openSecs = menu.sections.filter((s) => s.open);
  const locked = menu.sections.filter((s) => !s.open);

  return (
    <div ref={ref} className="acs-weeks">
      {openSecs.map((s) => {
        const st = stateOf(s, curSec);
        const live = s.items.filter((i) => i.live);
        const done = live.filter((i) => i.done).length;
        const isOpen = openIds.has(s.id);
        const pct = live.length ? Math.round((done / live.length) * 100) : 0;
        return (
          <section key={s.id} className={`acs-wk ${st} ${isOpen ? "expanded" : ""}`}>
            <button type="button" className="acs-wk-head" aria-expanded={isOpen} onClick={() => toggle(s.id)}>
              <span className="acs-badge">{st === "done" ? <TickCircle size={18} color="currentColor" variant="Bold" /> : s.week && s.week <= 12 ? s.week : <Book1 size={15} color="currentColor" />}</span>
              <span className="acs-wk-tx">
                <small>{st === "current" ? T.nowLearning : sectionLabel(s, T)}</small>
                <b>{s.title.replace(/^Week \d+:\s*/, "")}</b>
              </span>
              <span className="acs-wk-meta">
                {st === "done" ? <em className="acs-chip mint">{T.weekDone}</em> : <em className="acs-count">{done}/{live.length || s.items.length}</em>}
                <ArrowDown2 size={16} color="currentColor" />
              </span>
              {st !== "done" && live.length ? <i className="acs-wk-bar" style={{ width: `${pct}%` }} aria-hidden /> : null}
            </button>
            {isOpen ? (
              <ol className="acs-steps">
                {s.items.map((i) => (
                  <Step key={i.id} i={i} T={T} cur={i.id === current.id} current={current} page={page} onPage={onPage} onOpen={onOpen} />
                ))}
              </ol>
            ) : null}
          </section>
        );
      })}

      {locked.length ? (
        <section className="acs-soon">
          <div className="acs-soon-head">
            <span className="acs-badge"><Lock size={15} color="currentColor" /></span>
            <span className="acs-wk-tx"><b>{T.comingUp}</b><small>{T.comingUpSub}</small></span>
          </div>
          <ul>
            {locked.map((s) => (
              <li key={s.id}>
                <span className="acs-soon-n">{s.week && s.week <= 12 ? s.week : "·"}</span>
                <span className="acs-soon-t">{s.title.replace(/^Week \d+:\s*/, "")}</span>
                <span className="acs-soon-d">{s.opens_on ? formatOpensOn(s.opens_on, language) : T.locked}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function Step({ i, T, cur, current, page, onPage, onOpen }: { i: MenuItem; T: Text; cur: boolean; current: AcademyItem; page: number; onPage: (p: number) => void; onOpen: (id: string) => void }) {
  const state = i.done ? "done" : cur ? "cur" : i.started ? "part" : "";
  const n = cur ? current.pages.length : i.pages;
  return (
    <li className={`acs-step ${state} ${cur ? "cur" : ""} ${i.live ? "" : "soon"}`}>
      <span className="acs-node" aria-hidden>{i.done ? <TickCircle size={14} color="currentColor" variant="Bold" /> : null}</span>
      <button type="button" className="acs-step-btn" disabled={!i.live} aria-current={cur ? "page" : undefined} onClick={() => onOpen(i.id)}>
        <span className="acs-ic">{TYPE_ICON[i.type] ?? TYPE_ICON.lesson}</span>
        <span className="acs-row-tx">
          <b>{i.title}</b>
          <small>
            {T.typeLabel[i.type] ?? T.typeLabel.lesson}
            {!i.live ? ` · ${T.soon}` : cur && n > 1 ? ` · ${T.pageN(page + 1, n)}` : n > 1 ? ` · ${T.pagesN(n)}` : ""}
          </small>
        </span>
      </button>
      {cur && current.pages.length > 1 ? (
        <div className="acs-pages">
          {current.pages.map((pg, pi) => (
            <button key={pi} type="button" className={`acs-page ${pi === page ? "on" : pi < page ? "seen" : ""}`} aria-current={pi === page ? "step" : undefined} onClick={() => onPage(pi)}>
              <span className="acs-page-n">{pi + 1}</span>
              <span>{pg.title}</span>
            </button>
          ))}
        </div>
      ) : null}
    </li>
  );
}

function ProgressPanel({ menu }: { menu: CourseMenu }) {
  const T = useAcademyText();
  return (
    <div className="acs-prog">
      <div className="acs-prog-card">
        <b>{menu.totals.pct}%</b>
        <span>{T.itemsDone(menu.totals.done, menu.totals.total)}</span>
        <div className="ac-bar"><i style={{ width: `${menu.totals.pct}%` }} /></div>
      </div>
      {menu.sections.map((s) => {
        const d = s.items.filter((i) => i.done).length;
        const pct = s.items.length ? (d / s.items.length) * 100 : 0;
        return (
          <div key={s.id} className={`acs-hbar ${s.open ? "" : "locked"}`}>
            <span>{sectionLabel(s, T)}</span>
            <div className="ac-bar"><i style={{ width: `${pct}%` }} /></div>
            <span className="acs-count">{s.open ? `${d}/${s.items.length}` : <Lock size={12} color="currentColor" />}</span>
          </div>
        );
      })}
    </div>
  );
}

function ResourcesPanel({ menu, onOpen }: { menu: CourseMenu; onOpen: (id: string) => void }) {
  const T = useAcademyText();
  const { push } = usePlusPaths();
  return (
    <div className="acs-list">
      <p className="acs-group">{T.planAndCook}</p>
      <button type="button" className="acs-row feature" onClick={() => push(`/learn/meal-plan?course=${menu.id}`)}>
        <span className="acs-ic or"><Calendar1 size={ICON} color="currentColor" /></span>
        <span className="acs-row-tx"><b>{T.mealPlan}</b></span>
      </button>
      <button type="button" className="acs-row feature" onClick={() => push("/learn/library?f=recipes")}>
        <span className="acs-ic or"><Save2 size={ICON} color="currentColor" /></span>
        <span className="acs-row-tx"><b>{T.allRecipes}</b></span>
      </button>
      <p className="acs-group">{T.printableHandouts}</p>
      {menu.sections.filter((s) => s.open && s.week && s.week >= 1 && s.week <= 12).map((s) => {
        const pt = s.items.find((i) => i.type === "points" && i.live);
        return pt ? (
          <button key={s.id} type="button" className="acs-row" onClick={() => onOpen(pt.id)}>
            <span className="acs-ic"><DocumentText size={ICON} color="currentColor" /></span>
            <span className="acs-row-tx"><b>{T.week} {s.week}</b><small>{T.pointsToRemember}</small></span>
          </button>
        ) : null;
      })}
    </div>
  );
}

function NotesPanel({ menu, current, reloadMenu }: { menu: CourseMenu; current: AcademyItem; reloadMenu: () => void }) {
  const T = useAcademyText();
  const { language } = useLanguage();
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");
  const sec = menu.sections.find((s) => s.items.some((i) => i.id === current.id));
  return (
    <div className="acs-notes">
      <label className="ac-label" htmlFor="acs-note">{T.addNote}</label>
      <textarea id="acs-note" className="ac-input" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
      {err ? <p className="ac-error">{err}</p> : null}
      <button
        type="button"
        className="ac-btn primary small"
        onClick={async () => {
          if (!note.trim()) return setErr(T.noteEmpty);
          setErr("");
          try {
            await addNote(menu.id, sec?.id ?? null, note.trim());
            setNote("");
            reloadMenu();
          } catch {
            setErr(T.saveFailed);
          }
        }}
      >
        {T.saveNote}
      </button>
      {menu.notes.length ? (
        menu.notes.map((n) => (
          <div key={n.id} className="acs-note">
            <small>{new Date(n.created_at).toLocaleDateString(language === "rw" ? "fr-RW" : "en-GB", { day: "numeric", month: "short" })} · {menu.sections.find((s) => s.id === n.section_id)?.title ?? menu.short}</small>
            <p>{n.text}</p>
            <button type="button" className="acs-note-del" aria-label="Delete note" onClick={async () => { await deleteNote(n.id).catch(() => undefined); reloadMenu(); }}>
              <Trash size={14} color="currentColor" />
            </button>
          </div>
        ))
      ) : (
        <p className="acs-empty">{T.noNotes}</p>
      )}
    </div>
  );
}

function SavedPanel({ onOpen }: { onOpen: (id: string) => void }) {
  const T = useAcademyText();
  const home = useResource(academyKeys.home, fetchAcademyHome);
  const list = home.data?.bookmarks ?? [];
  return list.length ? (
    <div className="acs-list">
      {list.map((b) => (
        <button key={b.item_id} type="button" className="acs-row" onClick={() => onOpen(b.item_id)}>
          <span className="acs-ic">{TYPE_ICON[b.type] ?? TYPE_ICON.lesson}</span>
          <span className="acs-row-tx"><b>{b.title}</b><small>{T.typeLabel[b.type] ?? T.typeLabel.lesson}</small></span>
        </button>
      ))}
    </div>
  ) : (
    <p className="acs-empty">{T.noBookmarks}</p>
  );
}

"use client";

/**
 * Learn → My programme (Harvard learner dashboard + Omada/Noom "Today"), the Library (catalogue by format)
 * and the 4-week meal plan. Shown when the member's programme course has published lessons.
 */
import "./academy.css";
import { useMemo, useState } from "react";
import { ArrowRight3, Book1, Calendar1, Edit2, Lock, Message, TickCircle } from "@/lib/plus/icons";
import { academyKeys, fetchAcademyHome, fetchLibrary, fetchMenu, formatOpensOn, type AcademyHome, type CourseMenu, type LibraryCourse } from "@/lib/plus/academy";
import { useLanguage } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { useResource } from "@/lib/plus/client/use-resource";
import { AppBar, CenterSpinner, EmptyState, Page } from "../ui/vita";
import { Art, programmeScene, recipeScene, weekScene } from "./art";
import { useAcademyText } from "./text";

export function useAcademyHome() {
  return useResource<AcademyHome>(academyKeys.home, fetchAcademyHome);
}

/** The Learn-tab dashboard. Returns null when the member has no programme course with published lessons. */
export function MyProgrammeBlock({ home }: { home: AcademyHome }) {
  const T = useAcademyText();
  const { language } = useLanguage();
  const { push } = usePlusPaths();
  const p = home.programme;
  if (!p) return null;
  const open = (id: string, page?: number) => push(`/learn/${p.course_id}/${id}${page ? `?p=${page}` : ""}`);
  const next = p.weeks.find((w) => w.state === "locked");
  const byType = (t: string) => p.week_items.find((i) => i.type === t);
  const today: { label: string; sub: string; done: boolean; icon: React.ReactNode; go: () => void }[] = [];
  if (p.continue) today.push({ label: T.todayContinue(p.continue.title), sub: p.theme ?? "", done: false, icon: <Book1 size={18} color="currentColor" />, go: () => open(p.continue!.item_id, p.continue!.page) });
  const wb = byType("workbook");
  if (wb) today.push({ label: T.todayWorkbook, sub: wb.title ?? "", done: wb.done, icon: <Edit2 size={18} color="currentColor" />, go: () => open(wb.id) });
  const co = byType("coach");
  if (co) today.push({ label: T.todayCoach, sub: co.title ?? "", done: co.done, icon: <Message size={18} color="currentColor" />, go: () => open(co.id) });
  const qz = byType("quiz");
  if (qz) today.push({ label: T.todayQuiz, sub: qz.title ?? "", done: qz.done, icon: <TickCircle size={18} color="currentColor" />, go: () => open(qz.id) });

  return (
    <section className="ac-home" aria-label={T.myProgramme}>
      <div className="ac-hero">
        <div className="ac-hero-art"><Art scene={weekScene(p.current_week)} label={p.theme ?? p.title} /></div>
        <div className="ac-hero-tx">
          <span className="ac-hero-kicker">{T.myProgramme} · {p.title}</span>
          <h2>{p.theme ?? p.title}</h2>
          <p>{T.itemsDone(p.totals.done, p.totals.total)}</p>
          <div className="ac-bar light"><i style={{ width: `${p.totals.pct}%` }} /></div>
          {p.continue ? (
            <button type="button" className="ac-btn primary block" onClick={() => open(p.continue!.item_id, p.continue!.page)}>
              {T.continue}: {p.continue.title} <ArrowRight3 size={18} color="currentColor" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="ac-tiles">
        <div className="ac-tile"><b>{p.current_week}/12</b><span>{T.weeks}</span></div>
        <div className="ac-tile"><b>{p.totals.pct}%</b><span>{T.complete}</span></div>
        <div className="ac-tile"><b>{p.quiz_average == null ? "–" : `${p.quiz_average}%`}</b><span>{T.quizAverage}</span></div>
        <div className="ac-tile"><b>{p.status === "completed" ? "1/1" : "0/1"}</b><span>{T.certificate}</span></div>
      </div>

      <div className="ac-home-grid">
        <div>
          <h3 className="ac-sec">{T.today}</h3>
          <div className="ac-card ac-today">
            {today.map((x) => (
              <button key={x.label} type="button" className={`ac-todo ${x.done ? "done" : ""}`} onClick={x.go}>
                <span className="ac-tick">{x.done ? <TickCircle size={16} color="currentColor" variant="Bold" /> : x.icon}</span>
                <span className="ac-todo-tx"><b>{x.label}</b>{x.sub ? <small>{x.sub}</small> : null}</span>
                <ArrowRight3 size={16} color="currentColor" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="ac-sec">{T.your12}</h3>
          <div className="ac-card">
            <div className="ac-weeks">
              {p.weeks.map((w) => (
                <button
                  key={w.week}
                  type="button"
                  className={`ac-wk ${w.state}`}
                  disabled={w.state === "locked" || !w.first_item}
                  title={w.state === "locked" ? T.opens(formatOpensOn(w.opens_on, language)) : `${T.week} ${w.week}`}
                  aria-label={`${T.week} ${w.week}${w.state === "locked" ? `, ${T.opens(formatOpensOn(w.opens_on, language))}` : ""}`}
                  onClick={() => w.first_item && open(w.first_item)}
                >
                  <i>{w.state === "done" ? <TickCircle size={16} color="currentColor" variant="Bold" /> : w.state === "locked" ? <Lock size={13} color="currentColor" /> : w.week}</i>
                  <span>{w.week}</span>
                </button>
              ))}
            </div>
            <p className="ac-muted ac-small">{next ? T.nextOpens(next.week, formatOpensOn(next.opens_on, language)) : T.allOpen}</p>
          </div>
          <button type="button" className="ac-lib-row" onClick={() => push("/learn/library")}>
            <span className="ac-lib-ic"><Book1 size={22} color="currentColor" /></span>
            <span><b>{T.exploreLibrary}</b><small>{T.librarySub(home.library_count)}</small></span>
            <ArrowRight3 size={18} color="currentColor" />
          </button>
        </div>
      </div>
    </section>
  );
}

/** Video briefs that fit each programme, best first (the rest of the library follows). */
const BRIEFS_FOR: Record<string, string[]> = {
  DC: ["SH-01", "SH-04", "SH-02", "SH-03"],
  HH: ["SH-05", "SH-02", "SH-09", "SH-12"],
  HW: ["SH-06", "SH-02", "SH-08", "SH-04"],
  HL: ["SH-02", "SH-03", "SH-09", "SH-08"],
};

/** Learn page, below the programme: a few library picks (video briefs for the member's programme, then recipes). */
export function RecommendedBlock({ courseId }: { courseId?: string | null }) {
  const T = useAcademyText();
  const { push } = usePlusPaths();
  const lib = useResource<LibraryCourse[]>(academyKeys.library, fetchLibrary);
  const recipes = useResource<CourseMenu>(academyKeys.menu("RECIPES"), () => fetchMenu("RECIPES"));
  const cards = useMemo(() => {
    const order = BRIEFS_FOR[courseId ?? ""] ?? BRIEFS_FOR.HL;
    const rank = (id: string) => (order.indexOf(id) + 1 || 99);
    const briefs = (lib.data ?? [])
      .filter((c) => c.kind === "briefs" && c.first_item && c.live_items > 0)
      .sort((a, b) => rank(a.id) - rank(b.id) || a.id.localeCompare(b.id))
      .slice(0, 4)
      .map((c) => ({ key: c.id, title: c.short, sub: `${T.briefs} · ${T.itemsN(c.live_items)}`, scene: weekScene(Number(c.id.slice(3)) || 1), play: true, tag: T.briefs, go: () => push(`/learn/${c.id}/${c.first_item}`) }));
    const live = (recipes.data?.sections ?? []).flatMap((s) => s.items.filter((i) => i.live && !i.done));
    // A different pair each day, so the row does not go stale.
    const day = Math.floor(Date.now() / 86_400_000);
    const picks = live.length ? [live[day % live.length], live[(day + 7) % live.length]].filter((x, i, a) => a.indexOf(x) === i) : [];
    const art = ["pot", "salad", "snack", "cup", "glass"];
    const rec = picks.map((i, n) => ({ key: i.id, title: i.title, sub: T.recipes, scene: art[(day + n) % art.length], play: false, tag: T.recipes, go: () => push(`/learn/RECIPES/${i.id}`) }));
    return [...briefs, ...rec];
  }, [lib.data, recipes.data, courseId, push, T]);
  if (!cards.length) return null;
  return (
    <section className="ac-rec" aria-label={T.recommended}>
      <div className="ac-rec-head">
        <span><h3 className="ac-sec">{T.recommended}</h3><small>{T.recommendedSub}</small></span>
        <button type="button" className="ac-rec-all" onClick={() => push("/learn/library")}>{T.seeLibrary} <ArrowRight3 size={16} color="currentColor" /></button>
      </div>
      <div className="ac-cgrid ac-rec-grid">
        {cards.map((c) => (
          <button key={c.key} type="button" className="ac-ccard" onClick={c.go}>
            <span className="ac-ccard-art"><Art scene={c.scene} play={c.play} label={c.title} /><span className="ac-ccard-tag">{c.tag}</span></span>
            <span className="ac-ccard-tx"><b>{c.title}</b><small>{c.sub}</small></span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function LibraryScreen({ initialFilter }: { initialFilter?: string }) {
  const T = useAcademyText();
  const { push } = usePlusPaths();
  const lib = useResource<LibraryCourse[]>(academyKeys.library, fetchLibrary);
  const home = useAcademyHome();
  const recipes = useResource<CourseMenu>(academyKeys.menu("RECIPES"), () => fetchMenu("RECIPES"));
  const [f, setF] = useState(initialFilter ?? "all");
  const [q, setQ] = useState("");
  const mine = home.data?.programme?.course_id;

  const cards = useMemo(() => {
    const out: { key: string; title: string; sub: string; scene: string; play?: boolean; tag: string; go: () => void }[] = [];
    for (const c of lib.data ?? []) {
      if (c.kind === "programme" && (f === "all" || f === "prog")) {
        out.push({ key: c.id, title: c.title, sub: c.id === mine ? T.yours : T.programme12, scene: programmeScene(c.id), tag: c.id === mine ? T.yours : T.join, go: () => (c.id === mine && c.first_item ? push(`/learn/${c.id}/${c.first_item}`) : push("/programmes")) });
      }
      if (c.kind === "briefs" && (f === "all" || f === "brief") && c.first_item) {
        out.push({ key: c.id, title: c.short, sub: `${T.briefs} · ${T.itemsN(c.live_items)}`, scene: weekScene(Number(c.id.slice(3)) || 1), play: true, tag: T.briefs, go: () => push(`/learn/${c.id}/${c.first_item}`) });
      }
    }
    if (f === "all" || f === "recipes") {
      for (const s of recipes.data?.sections ?? []) for (const i of s.items.filter((x) => x.live)) {
        out.push({ key: i.id, title: i.title, sub: T.recipes, scene: recipeScene(""), tag: T.recipes, go: () => push(`/learn/RECIPES/${i.id}`) });
      }
    }
    const qq = q.trim().toLowerCase();
    return qq ? out.filter((c) => c.title.toLowerCase().includes(qq)) : out;
  }, [lib.data, recipes.data, f, q, mine, push, T]);

  return (
    <Page width="wide">
      <AppBar title={T.library} backTo="/articles" />
      <div className="ac-lib">
        <label className="ac-label" htmlFor="ac-libq">{T.search}</label>
        <input id="ac-libq" className="ac-input" value={q} placeholder={T.searchHint} onChange={(e) => setQ(e.target.value)} />
        <div className="ac-filter" role="group" aria-label={T.library}>
          {[["all", T.all], ["prog", T.programmes], ["brief", T.briefs], ["recipes", T.recipes]].map(([k, l]) => (
            <button key={k} type="button" className={f === k ? "on" : ""} aria-pressed={f === k} onClick={() => setF(k)}>{l}</button>
          ))}
        </div>
        {lib.loading && !lib.data ? (
          <CenterSpinner />
        ) : !cards.length ? (
          <EmptyState title={T.library} subtitle={T.comingSoon} />
        ) : (
          <div className="ac-cgrid">
            {cards.map((c) => (
              <button key={c.key} type="button" className="ac-ccard" onClick={c.go}>
                <span className="ac-ccard-art"><Art scene={c.scene} play={c.play} label={c.title} /><span className="ac-ccard-tag">{c.tag}</span></span>
                <span className="ac-ccard-tx"><b>{c.title}</b><small>{c.sub}</small></span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}

export function MealPlanScreen({ courseId }: { courseId: string }) {
  const T = useAcademyText();
  const menu = useResource<CourseMenu>(academyKeys.menu(courseId), () => fetchMenu(courseId));
  const [w, setW] = useState("1");
  const mp = menu.data?.resources?.meal_plan;
  const recipes = new Map((menu.data?.resources?.recipes ?? []).map((r) => [r.code, r.title]));
  const name = (s: string) => String(s).replace(/R\d\d/g, (c) => recipes.get(c) ?? c);
  const adjust = mp?.adjust?.[courseId] ?? [];
  return (
    <Page width="wide">
      <AppBar title={T.mealPlan} backTo="/articles" />
      <div className="ac-lib">
        {!mp ? (
          <CenterSpinner />
        ) : (
          <>
            <div className="ac-filter" role="group">
              {["1", "2", "3", "4"].map((n) => <button key={n} type="button" className={w === n ? "on" : ""} aria-pressed={w === n} onClick={() => setW(n)}>{T.week} {n}</button>)}
            </div>
            <p className="ac-muted">{mp.theme?.[w]}</p>
            <div className="ac-plan-grid">
              {(mp.rotation[w] ?? []).map((d, i) => (
                <div key={i} className="ac-card">
                  <b className="ac-plan-day"><Calendar1 size={16} color="currentColor" /> {mp.days?.[i]}</b>
                  <ul className="ac-plan-meals">
                    {[T.breakfast, T.lunch, T.snack, T.dinner].map((m, j) => (d[j] ? <li key={m}><span>{m}</span>{name(d[j])}</li> : null))}
                  </ul>
                </div>
              ))}
            </div>
            {adjust.length ? (
              <div className="ac-card" style={{ marginTop: 16 }}>
                <h3 className="ac-h3">{T.adjustFor}</h3>
                <ul className="ac-points">{adjust.map((a) => <li key={a}><TickCircle size={18} color="currentColor" variant="Bold" /><span>{a}</span></li>)}</ul>
              </div>
            ) : null}
            <div className="ac-card" style={{ marginTop: 16 }}>
              <h3 className="ac-h3">{T.shoppingList}</h3>
              <ul className="ac-plan-shop">{(mp.shop?.[w] ?? []).map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
          </>
        )}
      </div>
    </Page>
  );
}

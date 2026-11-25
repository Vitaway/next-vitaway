"use client";

/**
 * Academy block renderer: every block type from the Vitaway Academy design.
 * Interactive state (check answers, quiz progress, tips seen, ratings) lives in the item's progress.state
 * and is saved by the player; workbooks save through their own endpoint and go to the coach.
 */
import { useMemo, useState } from "react";
import { Add, ArrowRight3, Calendar1, Message, TickCircle } from "@/lib/plus/icons";
import { quizScore, richLines, rwText, saveWorkbook, type AcademyItem, type Block, type Question, type Recipe } from "@/lib/plus/academy";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { Art, PlateArt, recipeScene, weekScene } from "./art";
import { useAcademyText } from "./text";

export type BlockState = Record<string, unknown>;
export type BlockCtx = {
  item: AcademyItem;
  lang: string;
  state: BlockState;
  update: (fn: (s: BlockState) => BlockState) => void;
  firstName: string;
  onComplete: () => void;
  onWorkbookSaved: (answers: Record<string, unknown>, done: boolean) => void;
  preview?: boolean;
};

const S = (v: unknown) => String(v ?? "");
const SPOT_POS: [number, number][] = [[50, 20], [24, 58], [74, 60], [90, 22], [10, 24]];
const LETTERS = "ABCDE";

function Rich({ text }: { text: string }) {
  return (
    <div className="ac-rich">
      {richLines(text).map((l, i) =>
        l.kind === "p" ? <p key={i}>{l.text}</p> : (
          <ul key={i}>{l.items.map((x, j) => <li key={j}>{x}</li>)}</ul>
        ),
      )}
    </div>
  );
}

function sub(state: BlockState, key: string): Record<string, unknown> {
  return ((state[key] as Record<string, unknown>) ?? {}) as Record<string, unknown>;
}

export function BlockView({ block, path, ctx }: { block: Block; path: string; ctx: BlockCtx }) {
  const T = useAcademyText();
  const { item, lang, state, update } = ctx;
  const R = <V extends string | string[]>(field: string, en: V) => rwText(item.rw, lang, `${path}.${field}`, en);
  const { push } = usePlusPaths();

  switch (block.t) {
    case "video": {
      const url = S(lang === "rw" && block.rw_url ? block.rw_url : block.url);
      return (
        <div className="ac-video-wrap">
          {url ? (
            <video className="ac-video" controls preload="metadata" playsInline poster={S(block.poster_url) || undefined}>
              <source src={url} />
              {block.captions_url ? <track kind="captions" src={S(block.captions_url)} srcLang="en" label="English" default /> : null}
            </video>
          ) : (
            <div className="ac-video ac-video-soon">
              <Art scene={weekScene(item.section.week)} label={T.videoSoon} />
              <span className="ac-video-chip">{T.videoSoon}</span>
            </div>
          )}
          <details className="ac-transcript" open={!url}>
            <summary>{T.transcript}{block.dur ? ` · ${S(block.dur)}` : ""}</summary>
            <Rich text={R("script", S(block.script))} />
          </details>
        </div>
      );
    }
    case "text": {
      const head = R("head", S(block.head));
      return (
        <div>
          {head ? <h3 className="ac-h3">{head}</h3> : null}
          <Rich text={R("body", S(block.body))} />
        </div>
      );
    }
    case "image":
      return (
        <figure className="ac-figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {block.url ? <img src={S(block.url)} alt={S(block.alt || block.desc)} /> : <Art scene={weekScene(item.section.week)} label={S(block.desc)} />}
          {block.url ? null : <figcaption>{S(block.desc)}</figcaption>}
        </figure>
      );
    case "example":
      return (
        <div className="ac-example">
          <b>{T.localExample}</b>
          <p>{R("body", S(block.body))}</p>
        </div>
      );
    case "check":
      return <CheckBlock q={{ q: R("q", S(block.q)), o: (block.o as string[]).map((o, j) => R(`o.${j}`, o)), a: Number(block.a), why: R("why", S(block.why)) }} k={path} ctx={ctx} />;
    case "activity": {
      const did = Boolean(sub(state, "act")[path]);
      const steps = R("steps", (block.steps as string[]) ?? []);
      return (
        <div className="ac-activity">
          <h3 className="ac-h3">{R("title", S(block.title))}</h3>
          <ol className="ac-steps">{steps.map((s, i) => <li key={i}><span>{i + 1}</span>{s}</li>)}</ol>
          {block.submit === "photo" ? <p className="ac-muted">{T.photoHint}</p> : null}
          <button type="button" className={`ac-btn ${did ? "is-done" : "primary"}`} disabled={ctx.preview} onClick={() => update((s) => ({ ...s, act: { ...sub(s, "act"), [path]: !did } }))}>
            {did ? <><TickCircle size={18} color="currentColor" variant="Bold" /> {T.done}</> : T.iDidThis}
          </button>
          {block.submit === "photo" && !ctx.preview ? (
            <button type="button" className="ac-link" onClick={() => push("/meal-photos/new")}>{T.sendPhoto}</button>
          ) : null}
        </div>
      );
    }
    case "hotspot": {
      const spots = (block.spots as { label: string; text: string }[]) ?? [];
      const seen = (sub(state, "spots")[path] as number[]) ?? [];
      const open = sub(state, "spotOpen")[path] as number | undefined;
      return (
        <div>
          <div className="ac-hot">
            <PlateArt />
            {spots.map((s, i) => (
              <button
                key={i}
                type="button"
                className={`ac-spot ${seen.includes(i) ? "seen" : ""} ${open === i ? "on" : ""}`}
                style={{ left: `${SPOT_POS[i][0]}%`, top: `${SPOT_POS[i][1]}%` }}
                aria-label={R(`spots.${i}.label`, s.label)}
                onClick={() => update((st) => ({ ...st, spots: { ...sub(st, "spots"), [path]: seen.includes(i) ? seen : [...seen, i] }, spotOpen: { ...sub(st, "spotOpen"), [path]: i } }))}
              >
                {i + 1}
              </button>
            ))}
          </div>
          {open != null && spots[open] ? (
            <div className="ac-pop" role="status">
              <b>{open + 1}. {R(`spots.${open}.label`, spots[open].label)}</b>
              <p>{R(`spots.${open}.text`, spots[open].text)}</p>
            </div>
          ) : (
            <p className="ac-muted">{T.tapNumber}</p>
          )}
          <p className="ac-muted ac-small">{T.tipsSeen(seen.length, spots.length)}</p>
        </div>
      );
    }
    case "slides":
      return <Slides slides={R("slides", (block.slides as string[]) ?? [])} audio={S(block.audio_url)} />;
    case "points": {
      const items = R("items", (block.items as string[]) ?? []);
      return (
        <div>
          <h3 className="ac-h3">{T.pointsToRemember}</h3>
          <ul className="ac-points">{items.map((x, i) => <li key={i}><TickCircle size={20} color="currentColor" variant="Bold" /><span>{x}</span></li>)}</ul>
        </div>
      );
    }
    case "recipe":
      return <RecipeCard r={block.recipe as Recipe} />;
    case "workbook":
      return <WorkbookBlock block={block} path={path} ctx={ctx} />;
    case "quiz":
    case "kc":
      return (
        <QuizBlock
          k={path}
          ctx={ctx}
          kind={block.t}
          stage={S(block.stage)}
          optional={block.optional !== false}
          questions={((block.questions as Question[]) ?? []).map((q, i) => ({ q: R(`questions.${i}.q`, q.q), o: q.o.map((o, j) => R(`questions.${i}.o.${j}`, o)), a: q.a, why: R(`questions.${i}.why`, q.why) }))}
        />
      );
    case "coach": {
      const msg = R("message", S(block.message)).replace(/\{name\}/g, ctx.firstName || T.there).replace(/\{[^}]+\}/g, "…");
      return (
        <div>
          <div className="ac-coach">
            <span className="ac-avatar" aria-hidden>{T.coachInitial}</span>
            <div className="ac-bubble">
              <b>{T.yourCoach}</b>
              <p>{msg}</p>
            </div>
          </div>
          {block.milestone ? (
            <div className="ac-example">
              <b>{T.thisWeek}</b>
              <p>{S(block.milestone)}</p>
            </div>
          ) : null}
          {!ctx.preview ? (
            <div className="ac-row">
              <button type="button" className="ac-btn primary" onClick={() => push("/care")}><Calendar1 size={18} color="currentColor" /> {T.bookVisit}</button>
              <button type="button" className="ac-btn" onClick={() => push("/support")}><Message size={18} color="currentColor" /> {T.replyCare}</button>
            </div>
          ) : null}
        </div>
      );
    }
    case "rate":
      return <RateBlock questions={(block.questions as string[]) ?? []} k={path} ctx={ctx} />;
    case "cert":
      return (
        <div>
          <div className="ac-cert is-locked">
            <span className="ac-cert-seal" aria-hidden>V</span>
            <p className="ac-muted ac-small">{T.certTitle}</p>
            <p className="ac-cert-name">{item.course.short}</p>
            <p>{ctx.firstName}</p>
            <span className="ac-chip">{T.preview}</span>
          </div>
          <p className="ac-muted">{T.certRule}</p>
        </div>
      );
    case "callout":
      return (
        <div className="ac-callout">
          <p>{R("onscreen", S(block.onscreen))}</p>
          {block.action && !ctx.preview ? (
            <button type="button" className="ac-btn primary" onClick={() => push(S(block.link) || "/home")}>{R("action", S(block.action))} <ArrowRight3 size={16} color="currentColor" /></button>
          ) : null}
        </div>
      );
    default:
      return null;
  }
}

function CheckBlock({ q, k, ctx }: { q: Question; k: string; ctx: BlockCtx }) {
  const T = useAcademyText();
  const ans = sub(ctx.state, "chk")[k] as number | undefined;
  const shown = ans != null || ctx.preview;
  return (
    <div className="ac-check">
      <p className="ac-q">{q.q}</p>
      {q.o.map((o, j) => (
        <button
          key={j}
          type="button"
          className={`ac-opt ${shown ? (j === q.a ? "right" : ans === j ? "wrong" : "") : ""}`}
          disabled={shown}
          onClick={() => ctx.update((s) => ({ ...s, chk: { ...sub(s, "chk"), [k]: j } }))}
        >
          <span className="ac-let">{LETTERS[j]}</span>
          <span className="ac-opt-tx">{o}</span>
          {shown && ans === j ? <span className={`ac-mark ${j === q.a ? "g" : "o"}`}>{j === q.a ? T.correct : T.notQuite}</span> : null}
        </button>
      ))}
      {shown ? <div className="ac-why">{q.why}</div> : null}
    </div>
  );
}

function Slides({ slides, audio }: { slides: string[]; audio: string }) {
  const T = useAcademyText();
  const [i, setI] = useState(0);
  const n = slides.length;
  return (
    <div className="ac-slides">
      <div className="ac-slide" aria-live="polite">
        <span className="ac-slide-n">{i + 1}<small> / {n}</small></span>
        <p>{slides[i]}</p>
      </div>
      <div className="ac-slide-nav">
        <button type="button" className="ac-btn" disabled={!i} onClick={() => setI(i - 1)}>{T.back}</button>
        {audio ? <audio controls src={audio} className="ac-audio" /> : null}
        <button type="button" className="ac-btn" disabled={i >= n - 1} onClick={() => setI(i + 1)}>{T.next}</button>
      </div>
    </div>
  );
}

export function RecipeCard({ r }: { r: Recipe }) {
  const T = useAcademyText();
  if (!r) return null;
  return (
    <div className="ac-recipe">
      <div className="ac-recipe-art"><Art scene={recipeScene(r.type)} label={r.title} /></div>
      <p className="ac-eyebrow">{r.type} · {r.serves}</p>
      <h3 className="ac-h3">{r.title}</h3>
      {r.rw ? <p className="ac-muted ac-rw-name">{r.rw}</p> : null}
      <div className="ac-chips">{(r.tags || []).map((t) => <span key={t} className="ac-chip">{t}</span>)}</div>
      <div className="ac-recipe-grid">
        <div>
          <h4>{T.ingredients}</h4>
          <ul>{r.ing.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </div>
        <div>
          <h4>{T.steps}</h4>
          <ol>{r.steps.map((x, i) => <li key={i}>{x}</li>)}</ol>
        </div>
      </div>
      <div className="ac-example"><b>{T.onYourPlate}</b><p>{r.plate}</p></div>
    </div>
  );
}

type Field = { k: string; label: string; type: "text" | "area" | "days" | "scale"; prefill?: string; opt?: boolean };

function WorkbookBlock({ block, path, ctx }: { block: Block; path: string; ctx: BlockCtx }) {
  const T = useAcademyText();
  const fields = useMemo(() => (block.fields as Field[]) ?? [], [block.fields]);
  const R = (i: number, en: string) => rwText(ctx.item.rw, ctx.lang, `${path}.fields.${i}.label`, en);
  const saved = ctx.item.workbook;
  const initial = useMemo(() => {
    const v: Record<string, unknown> = { ...(saved?.answers ?? {}) };
    fields.forEach((f) => {
      if (v[f.k] == null && f.prefill) v[f.k] = f.prefill;
    });
    return v;
  }, [saved, fields]);
  const [v, setV] = useState<Record<string, unknown>>(initial);
  const [editing, setEditing] = useState(!saved?.completed_at);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (!editing && saved?.completed_at) {
    return (
      <div className="ac-check">
        <p className="ac-eyebrow">{T.savedInWorkbook}</p>
        {fields.map((f, i) => {
          const x = saved.answers[f.k];
          if (x == null || x === "") return null;
          const shown = f.type === "days" ? T.days.filter((_, d) => (x as number[])[d]).join(", ") || "—" : f.type === "scale" ? `${x} / 10` : String(x);
          return <p key={f.k} className="ac-answer"><span>{R(i, f.label)}</span><b>{shown}</b></p>;
        })}
        <span className="ac-chip pub"><TickCircle size={14} color="currentColor" /> {T.sharedWithCoach}</span>
        {saved.coach_reply ? (
          <div className="ac-coach" style={{ marginTop: 12 }}>
            <span className="ac-avatar" aria-hidden>{T.coachInitial}</span>
            <div className="ac-bubble"><b>{T.yourCoach}</b><p>{saved.coach_reply}</p></div>
          </div>
        ) : (
          <p className="ac-muted">{T.coachReplies}</p>
        )}
        <button type="button" className="ac-btn" onClick={() => setEditing(true)}>{T.editAnswers}</button>
      </div>
    );
  }

  const complete = async () => {
    const missing = fields.find((f) => !f.opt && f.type !== "days" && (v[f.k] == null || String(v[f.k]).trim() === ""));
    if (missing) {
      setErr(T.pleaseAnswer(R(fields.indexOf(missing), missing.label)));
      return;
    }
    setBusy(true);
    setErr("");
    try {
      await saveWorkbook(ctx.item.id, v, true);
      ctx.onWorkbookSaved(v, true);
      setEditing(false);
    } catch {
      setErr(T.saveFailed);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ac-workbook">
      {fields.map((f, i) => {
        const id = `wb-${ctx.item.id}-${f.k}`;
        const label = R(i, f.label);
        let ctl: React.ReactNode;
        if (f.type === "days") {
          const days = ((v[f.k] as number[]) ?? [0, 0, 0, 0, 0, 0, 0]).slice();
          ctl = (
            <div className="ac-days" role="group" aria-label={label}>
              {T.days.map((d, di) => (
                <button key={d} type="button" className={days[di] ? "on" : ""} aria-pressed={Boolean(days[di])} disabled={ctx.preview}
                  onClick={() => { days[di] = days[di] ? 0 : 1; setV({ ...v, [f.k]: days }); }}>
                  {d}
                </button>
              ))}
            </div>
          );
        } else if (f.type === "scale") {
          ctl = (
            <div className="ac-scale" role="group" aria-label={label}>
              {Array.from({ length: 10 }, (_, n) => (
                <button key={n} type="button" className={v[f.k] === n + 1 ? "on" : ""} aria-pressed={v[f.k] === n + 1} disabled={ctx.preview} onClick={() => setV({ ...v, [f.k]: n + 1 })}>{n + 1}</button>
              ))}
            </div>
          );
        } else if (f.type === "area") {
          ctl = <textarea id={id} className="ac-input" rows={3} value={String(v[f.k] ?? "")} disabled={ctx.preview} onChange={(e) => setV({ ...v, [f.k]: e.target.value })} />;
        } else {
          ctl = <input id={id} className="ac-input" value={String(v[f.k] ?? "")} disabled={ctx.preview} onChange={(e) => setV({ ...v, [f.k]: e.target.value })} />;
        }
        return (
          <div key={f.k} className="ac-field">
            <label htmlFor={id}>{label}{f.opt ? "" : ""}</label>
            {ctl}
          </div>
        );
      })}
      {err ? <p className="ac-error" role="alert">{err}</p> : null}
      {!ctx.preview ? (
        <button type="button" className="ac-btn primary block" disabled={busy} onClick={() => void complete()}>
          {busy ? T.saving : T.completeWorkbook}
        </button>
      ) : null}
    </div>
  );
}

type QuizState = { i: number; ans: number[]; sel: number | null; sub: boolean; done: boolean };

function QuizBlock({ k, ctx, questions, kind, stage, optional }: { k: string; ctx: BlockCtx; questions: Question[]; kind: string; stage: string; optional: boolean }) {
  const T = useAcademyText();
  const qs = (sub(ctx.state, "quiz")[k] as QuizState | undefined) ?? null;
  const n = questions.length;
  const set = (next: QuizState | null) => ctx.update((s) => ({ ...s, quiz: { ...sub(s, "quiz"), [k]: next } }));

  if (ctx.preview) {
    return (
      <div className="ac-quiz-cover">
        <span className="ac-big">{n}</span>
        <p><b>{kind === "kc" ? T.knowledgeCheck : T.quiz}</b> · {T.oneAtATime}</p>
      </div>
    );
  }

  if (!qs) {
    return (
      <div className="ac-quiz-cover">
        <span className="ac-big">{n}</span>
        <p className="ac-quiz-title">{kind === "kc" ? (stage === "start" ? T.startCheck : T.finalCheck) : T.weekQuiz}</p>
        <p className="ac-muted">{optional && kind !== "kc" ? `${T.optional} ` : ""}{kind === "kc" ? T.kcExplain : ""}{T.instantAnswer}</p>
        <button type="button" className="ac-btn primary" onClick={() => set({ i: 0, ans: [], sel: null, sub: false, done: false })}>{T.start}</button>
      </div>
    );
  }

  if (qs.done) {
    const score = quizScore(questions, qs.ans);
    const right = qs.ans.filter((a, i) => a === questions[i].a).length;
    return (
      <div>
        <div className="ac-quiz-cover">
          <span className="ac-big">{score}%</span>
          <p><b>{T.rightOf(right, n)}</b></p>
          <button type="button" className="ac-btn" onClick={() => set({ i: 0, ans: [], sel: null, sub: false, done: false })}>{T.tryAgain}</button>
        </div>
        {questions.map((q, i) => (
          <div key={i} className={`ac-review ${qs.ans[i] === q.a ? "g" : "o"}`}>
            <b>{i + 1}. {q.q}</b>
            <span>{q.why}</span>
          </div>
        ))}
      </div>
    );
  }

  const q = questions[qs.i];
  return (
    <div>
      <p className="ac-muted ac-small">{T.questionOf(qs.i + 1, n)}</p>
      <div className="ac-strip" aria-hidden>
        {questions.map((qq, j) => (
          <span key={j} className={j < qs.i ? (qs.ans[j] === qq.a ? "g" : "o") : j === qs.i ? (qs.sub ? (qs.sel === q.a ? "g" : "o") : "cur") : ""}>{j + 1}</span>
        ))}
      </div>
      <div className="ac-check">
        <p className="ac-q">{q.q}</p>
        {q.o.map((o, j) => (
          <button
            key={j}
            type="button"
            className={`ac-opt ${qs.sub ? (j === q.a ? "right" : qs.sel === j ? "wrong" : "") : qs.sel === j ? "sel" : ""}`}
            disabled={qs.sub}
            onClick={() => set({ ...qs, sel: j })}
          >
            <span className="ac-let">{LETTERS[j]}</span>
            <span className="ac-opt-tx">{o}</span>
            {qs.sub && j === qs.sel ? <span className={`ac-mark ${j === q.a ? "g" : "o"}`}>{j === q.a ? T.correct : T.notQuite}</span> : qs.sub && j === q.a ? <span className="ac-mark g">{T.rightAnswer}</span> : null}
          </button>
        ))}
        {qs.sub ? <div className="ac-why">{q.why}</div> : null}
      </div>
      {qs.sub ? (
        <button
          type="button"
          className="ac-btn primary block"
          onClick={() => {
            if (qs.i < n - 1) set({ ...qs, i: qs.i + 1, sel: null, sub: false });
            else {
              const done = { ...qs, done: true };
              ctx.update((s) => ({ ...s, quiz: { ...sub(s, "quiz"), [k]: done }, score: quizScore(questions, done.ans) }));
              ctx.onComplete();
            }
          }}
        >
          {qs.i < n - 1 ? T.nextQuestion : T.seeResults}
        </button>
      ) : (
        <button type="button" className="ac-btn primary block" disabled={qs.sel == null} onClick={() => set({ ...qs, sub: true, ans: Object.assign([...qs.ans], { [qs.i]: qs.sel as number }) })}>
          {T.submit}
        </button>
      )}
    </div>
  );
}

function RateBlock({ questions, k, ctx }: { questions: string[]; k: string; ctx: BlockCtx }) {
  const T = useAcademyText();
  const st = (sub(ctx.state, "rate")[k] as { stars?: number; ans?: Record<number, unknown>; sent?: boolean }) ?? {};
  const set = (next: typeof st) => ctx.update((s) => ({ ...s, rate: { ...sub(s, "rate"), [k]: next } }));
  if (st.sent) {
    return (
      <div className="ac-check">
        <p className="ac-q">{T.thanksRating}</p>
        <p>{T.youGave(st.stars ?? 0)}</p>
      </div>
    );
  }
  return (
    <div>
      <h3 className="ac-h3">{T.howWasIt}</h3>
      <div className="ac-stars" role="group" aria-label={T.howWasIt}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" className={(st.stars ?? 0) >= n ? "on" : ""} aria-label={`${n}`} disabled={ctx.preview} onClick={() => set({ ...st, stars: n })}>★</button>
        ))}
      </div>
      {questions.map((q, i) => {
        const m = q.match(/\(([^)]+)\)/);
        const val = st.ans?.[i];
        const put = (x: unknown) => set({ ...st, ans: { ...(st.ans ?? {}), [i]: x } });
        let ctl: React.ReactNode;
        if (m && /0–10/.test(m[1])) ctl = <div className="ac-scale ac-scale-11">{Array.from({ length: 11 }, (_, n) => <button key={n} type="button" className={val === n ? "on" : ""} onClick={() => put(n)}>{n}</button>)}</div>;
        else if (m && /1–5/.test(m[1])) ctl = <div className="ac-scale ac-scale-5">{[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" className={val === n ? "on" : ""} onClick={() => put(n)}>{n}</button>)}</div>;
        else if (m && m[1].includes("/")) ctl = <div className="ac-chips">{m[1].split("/").map((s) => s.trim()).map((s) => <button key={s} type="button" className={`ac-chip-btn ${val === s ? "on" : ""}`} onClick={() => put(s)}>{s}</button>)}</div>;
        else ctl = <textarea className="ac-input" rows={2} value={String(val ?? "")} onChange={(e) => put(e.target.value)} />;
        return (
          <div key={i} className="ac-field">
            <p className="ac-label">{q.replace(/\s*\([^)]*\)\s*/, " ").trim()}</p>
            {ctl}
          </div>
        );
      })}
      {!ctx.preview ? (
        <button type="button" className="ac-btn primary block" onClick={() => {
          if (!st.stars) return;
          set({ ...st, sent: true });
          ctx.onComplete();
        }} disabled={!st.stars}>
          <Add size={16} color="currentColor" /> {T.sendRating}
        </button>
      ) : null}
    </div>
  );
}

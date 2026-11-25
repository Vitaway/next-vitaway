/**
 * Vitaway Academy v1 (member side). Backend: core-backend src/modules/academy/course.
 * Course → section → item → page → block. Members only ever receive published versions.
 */
import { mobileRequest } from "./client/api";

const BASE = "/api/v1/mobile/academy";

export type Question = { q: string; o: string[]; a: number; why: string };
export type Block = { t: string } & Record<string, unknown>;
export type AcademyPage = { title: string; blocks: Block[] };
export type RwMap = Record<string, string | string[]>;

export type WeekDot = { week: number; state: "done" | "current" | "open" | "locked"; opens_on: string | null; first_item: string | null };
export type Totals = { total: number; done: number; pct: number };

export type AcademyHome = {
  programme: null | {
    course_id: string;
    title: string;
    current_week: number;
    start_date: string | null;
    status: "enrolled" | "completed" | "free";
    theme: string | null;
    live_items: number;
    totals: Totals;
    quiz_average: number | null;
    continue: { item_id: string; page: number; title: string } | null;
    weeks: WeekDot[];
    week_items: { id: string; type: string; title: string | null; done: boolean }[];
  };
  bookmarks: { item_id: string; title: string; type: string }[];
  library_count: number;
};

export type LibraryCourse = { id: string; kind: "programme" | "briefs" | "recipes"; title: string; short: string; programme_code: string | null; live_items: number; first_item: string | null };

export type MenuItem = { id: string; type: string; title: string; live: boolean; pages: number; done: boolean; started: boolean; last_page: number; workbook?: "none" | "complete" | "replied" };
export type MenuSection = { id: string; title: string; week: number | null; open: boolean; opens_on: string | null; items: MenuItem[] };
export type AcademyNote = { id: string; section_id: string | null; text: string; created_at: string };
export type Recipe = { code: string; title: string; rw: string; type: string; serves: string; tags: string[]; ing: string[]; steps: string[]; plate: string; tips: string };
export type CourseMenu = {
  id: string;
  kind: LibraryCourse["kind"];
  title: string;
  short: string;
  totals: Totals;
  sections: MenuSection[];
  notes: AcademyNote[];
  resources: null | { meal_plan: MealPlan; recipes: Recipe[] };
};
export type MealPlan = { rotation: Record<string, string[][]>; days: string[]; theme: Record<string, string>; adjust: Record<string, string[]>; shop: Record<string, string[]> };

export type AcademyItem = {
  id: string;
  type: string;
  version: number;
  title: string;
  pages: AcademyPage[];
  rw: RwMap;
  course: { id: string; short: string; kind: string };
  section: { id: string; title: string; week: number | null };
  progress: null | { last_page: number; state: Record<string, unknown>; completed_at: string | null };
  workbook: null | { answers: Record<string, unknown>; completed_at: string | null; coach_reply: string | null; replied_at: string | null };
  bookmarked: boolean;
  prev: string | null;
  next: string | null;
};

export const academyKeys = {
  home: `${BASE}/home`,
  library: `${BASE}/library`,
  menu: (course: string) => `${BASE}/courses/${encodeURIComponent(course)}/menu`,
  item: (id: string) => `${BASE}/items/${encodeURIComponent(id)}`,
};

export const fetchAcademyHome = () => mobileRequest<AcademyHome>(academyKeys.home);
export const fetchLibrary = () => mobileRequest<LibraryCourse[]>(academyKeys.library);
export const fetchMenu = (course: string) => mobileRequest<CourseMenu>(academyKeys.menu(course));
export const fetchItem = (id: string) => mobileRequest<AcademyItem>(academyKeys.item(id));

export const saveProgress = (id: string, body: { last_page: number; state?: Record<string, unknown>; completed?: boolean }) =>
  mobileRequest<{ ok: boolean; completed: boolean; points: { reason: string } | null }>(`${academyKeys.item(id)}/progress`, { method: "PUT", body });
export const saveWorkbook = (id: string, answers: Record<string, unknown>, complete: boolean) =>
  mobileRequest<{ ok: boolean; completed: boolean }>(`${academyKeys.item(id)}/workbook`, { method: "PUT", body: { answers, complete } });
export const setBookmark = (id: string, on: boolean) => mobileRequest(`${academyKeys.item(id)}/bookmark`, { method: on ? "PUT" : "DELETE" });
export const addNote = (course_id: string, section_id: string | null, text: string) =>
  mobileRequest<AcademyNote>(`${BASE}/notes`, { method: "POST", body: { course_id, section_id, text } });
export const deleteNote = (id: string) => mobileRequest(`${BASE}/notes/${encodeURIComponent(id)}`, { method: "DELETE" });

/** Kinyarwanda per field with English fallback ("pages.1.blocks.0.body" style paths). */
export function rwText<T extends string | string[]>(rw: RwMap | undefined, lang: string, path: string, en: T): T {
  if (lang !== "rw" || !rw) return en;
  const v = rw[path];
  if (Array.isArray(v) ? v.some((x) => String(x).trim()) : String(v ?? "").trim()) return v as T;
  return en;
}

/** "- " lines become bullets; other lines are paragraphs. */
export function richLines(text: string): Array<{ kind: "p"; text: string } | { kind: "ul"; items: string[] }> {
  const out: Array<{ kind: "p"; text: string } | { kind: "ul"; items: string[] }> = [];
  for (const raw of String(text ?? "").split("\n")) {
    const s = raw.trim();
    if (!s) continue;
    if (/^[-•] /.test(s)) {
      const last = out[out.length - 1];
      if (last && last.kind === "ul") last.items.push(s.slice(2));
      else out.push({ kind: "ul", items: [s.slice(2)] });
    } else out.push({ kind: "p", text: s });
  }
  return out;
}

export const quizScore = (questions: Question[], answers: number[]) =>
  questions.length ? Math.round((answers.filter((a, i) => a === questions[i]?.a).length / questions.length) * 100) : 0;

export function formatOpensOn(date: string | null, lang: string): string {
  if (!date) return "";
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString(lang === "rw" ? "fr-RW" : "en-GB", { weekday: "short", day: "numeric", month: "short" });
}

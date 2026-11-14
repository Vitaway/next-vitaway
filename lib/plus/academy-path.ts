/**
 * Academy path (BL-154), same contract as Flutter lib/models/academy_path.dart.
 * GET /api/v1/mobile/academy/path
 * POST /api/v1/mobile/academy/path/weeks/:week/lessons/:lessonId/complete
 */

export const ACADEMY_PATH_PATH = "/api/v1/mobile/academy/path";

export type LocaleText = { en: string; rw: string };

export type AcademyLesson = {
  id: string;
  title: LocaleText;
  aim: LocaleText;
  bodyStatus: string;
  pendingLanguageReview: boolean;
  articleId: string | null;
  completed: boolean;
  completedAt: string | null;
};

export type WeekState = "done" | "current" | "open" | "locked";

export type AcademyWeek = {
  week: number;
  unitId: string;
  title: LocaleText;
  state: WeekState;
  lockedReason: LocaleText | null;
  lessons: AcademyLesson[];
};

export type AcademyUnit = {
  id: string;
  n: number;
  title: LocaleText;
  weekNumbers: number[];
};

export type AcademyEnrolment = {
  enrolled: boolean;
  status: string;
  programmeName: string | null;
  pathway: string | null;
  careStartedOn: string | null;
  currentWeek: number;
};

export type AcademyPath = {
  catalogueVersion: string;
  placeholderNotice: LocaleText;
  enrolment: AcademyEnrolment;
  units: AcademyUnit[];
  weeks: AcademyWeek[];
  lessonsDone: number;
  lessonsTotal: number;
  currentWeek: number;
};

export type AcademyCompleteResult = {
  already: boolean;
  path: AcademyPath | null;
};

export function localeText(json: unknown, fallback = ""): LocaleText {
  if (json && typeof json === "object") {
    const row = json as Record<string, unknown>;
    const en = typeof row.en === "string" ? row.en : fallback;
    const rw = typeof row.rw === "string" && row.rw ? row.rw : en;
    return { en, rw };
  }
  if (typeof json === "string" && json) return { en: json, rw: json };
  return { en: fallback, rw: fallback };
}

export function textOf(value: LocaleText, language: string): string {
  return language === "rw" && value.rw ? value.rw : value.en;
}

function lessonFrom(json: Record<string, unknown>): AcademyLesson {
  return {
    id: String(json.id ?? ""),
    title: localeText(json.title),
    aim: localeText(json.aim),
    bodyStatus: String(json.body_status ?? "placeholder"),
    pendingLanguageReview: json.pending_language_review === true,
    articleId: json.article_id == null ? null : String(json.article_id),
    completed: json.completed === true,
    completedAt: json.completed_at == null ? null : String(json.completed_at),
  };
}

function weekFrom(json: Record<string, unknown>): AcademyWeek {
  const stateRaw = String(json.state ?? "locked");
  const state: WeekState =
    stateRaw === "done" || stateRaw === "current" || stateRaw === "open" || stateRaw === "locked" ? stateRaw : "locked";
  return {
    week: Number(json.week ?? 0),
    unitId: String(json.unit_id ?? ""),
    title: localeText(json.title),
    state,
    lockedReason: json.locked_reason == null ? null : localeText(json.locked_reason),
    lessons: Array.isArray(json.lessons)
      ? json.lessons.filter((row): row is Record<string, unknown> => !!row && typeof row === "object").map(lessonFrom)
      : [],
  };
}

export function canOpenWeek(week: AcademyWeek): boolean {
  return week.state === "current" || week.state === "open" || week.state === "done";
}

export function weekByNumber(path: AcademyPath, week: number): AcademyWeek | undefined {
  return path.weeks.find((row) => row.week === week);
}

export function parseAcademyPath(raw: unknown): AcademyPath {
  const json = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const progress = json.progress && typeof json.progress === "object" ? (json.progress as Record<string, unknown>) : {};
  const enrolment = json.enrolment && typeof json.enrolment === "object" ? (json.enrolment as Record<string, unknown>) : {};
  return {
    catalogueVersion: String(json.catalogue_version ?? "1"),
    placeholderNotice: localeText(json.placeholder_notice),
    enrolment: {
      enrolled: enrolment.enrolled === true,
      status: String(enrolment.status ?? "free"),
      programmeName: enrolment.programme_name == null ? null : String(enrolment.programme_name),
      pathway: enrolment.pathway == null ? null : String(enrolment.pathway),
      careStartedOn: enrolment.care_started_on == null ? null : String(enrolment.care_started_on),
      currentWeek: Number(enrolment.current_week ?? 1),
    },
    units: Array.isArray(json.units)
      ? json.units
          .filter((row): row is Record<string, unknown> => !!row && typeof row === "object")
          .map((row) => ({
            id: String(row.id ?? ""),
            n: Number(row.n ?? 0),
            title: localeText(row.title),
            weekNumbers: Array.isArray(row.week_numbers) ? row.week_numbers.map((value) => Number(value)) : [],
          }))
      : [],
    weeks: Array.isArray(json.weeks)
      ? json.weeks.filter((row): row is Record<string, unknown> => !!row && typeof row === "object").map(weekFrom)
      : [],
    lessonsDone: Number(progress.lessons_done ?? 0),
    lessonsTotal: Number(progress.lessons_total ?? 0),
    currentWeek: Number(progress.current_week ?? 1),
  };
}

export async function fetchAcademyPath(request: (path: string) => Promise<unknown>): Promise<AcademyPath> {
  return parseAcademyPath(await request(ACADEMY_PATH_PATH));
}

export async function completeAcademyLesson(
  request: (path: string, options?: { method: "POST" }) => Promise<unknown>,
  week: number,
  lessonId: string,
): Promise<AcademyCompleteResult> {
  const raw = (await request(`${ACADEMY_PATH_PATH}/weeks/${week}/lessons/${lessonId}/complete`, { method: "POST" })) as Record<string, unknown> | null;
  const data = raw && typeof raw === "object" ? raw : {};
  return {
    already: data.already === true,
    path: data.path && typeof data.path === "object" ? parseAcademyPath(data.path) : null,
  };
}

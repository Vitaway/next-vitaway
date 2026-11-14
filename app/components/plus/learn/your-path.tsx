"use client";

import { useCallback, useEffect, useState } from "react";
import { CloudCross, InfoCircle, Lock, TickCircle } from "iconsax-react";
import {
  canOpenWeek,
  completeAcademyLesson,
  fetchAcademyPath,
  textOf,
  weekByNumber,
  type AcademyLesson,
  type AcademyPath,
  type AcademyWeek,
  type WeekState,
} from "@/lib/plus/academy-path";
import { useLanguage, useT } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { mobileRequest } from "@/lib/plus/client/api";
import { ActionButton, AppBar, CenterSpinner, useFeedback } from "../ui/vita";

const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;

/** Compact 12-week path card above the Learn article tabs — mirrors Flutter YourPathBlock. */
export function YourPathBlock() {
  const t = useT();
  const { language } = useLanguage();
  const { push } = usePlusPaths();
  const { toast } = useFeedback();
  const [path, setPath] = useState<AcademyPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setPath(await fetchAcademyPath((p) => mobileRequest(p)));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const openWeek = (week: AcademyWeek) => {
    if (!canOpenWeek(week)) {
      toast(week.lockedReason ? textOf(week.lockedReason, language) : t("your_path_locked"));
      return;
    }
    const lesson = week.lessons[0];
    if (!lesson) return;
    push(`/academy/${week.week}/${lesson.id}`);
  };

  return (
    <div style={{ padding: "12px 16px 4px" }}>
      <div
        style={{
          background: "var(--vc-surface)",
          borderRadius: 14,
          border: "1px solid var(--vc-line)",
          boxShadow: `0 10px 24px ${navyA(0.06)}`,
          padding: "12px 14px",
        }}
      >
        {loading && !path ? (
          <div style={{ height: 96, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CenterSpinner />
          </div>
        ) : error && !path ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <CloudCross size={18} color="var(--vc-muted)" />
            <div style={{ flex: 1, fontSize: 13, color: "var(--vc-body)" }}>{t("your_path_load_error")}</div>
            <button type="button" onClick={() => void reload()} style={{ border: 0, background: "none", color: "var(--vc-navy)", fontWeight: 700, fontSize: 13 }}>
              {t("retry")}
            </button>
          </div>
        ) : path ? (
          <PathCard path={path} language={language} onOpenWeek={openWeek} />
        ) : null}
      </div>
    </div>
  );
}

function PathCard({
  path,
  language,
  onOpenWeek,
}: {
  path: AcademyPath;
  language: string;
  onOpenWeek: (week: AcademyWeek) => void;
}) {
  const t = useT();
  const subtitle = path.enrolment.enrolled ? t("your_path_week_of", { week: path.currentWeek }) : t("your_path_free");
  const progress = t("your_path_progress", { done: path.lessonsDone, total: path.lessonsTotal });
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <div style={{ flex: 1, fontSize: 16, fontWeight: 800, color: "var(--vc-teal)", letterSpacing: -0.2 }}>{t("your_path")}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--vc-muted)" }}>{progress}</div>
      </div>
      <div style={{ marginTop: 2, fontSize: 12, color: "var(--vc-body)" }}>{subtitle}</div>
      <div style={{ marginTop: 8, fontSize: 11, lineHeight: 1.35, color: "var(--vc-muted)" }}>{textOf(path.placeholderNotice, language)}</div>
      {path.units.map((unit) => (
        <div key={unit.id} style={{ marginTop: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--vc-muted)", letterSpacing: 0.2 }}>{textOf(unit.title, language)}</div>
          <div style={{ display: "flex", marginTop: 6 }}>
            {unit.weekNumbers.map((number) => {
              const week = weekByNumber(path, number);
              return (
                <div key={number} style={{ flex: 1, padding: "0 3px" }}>
                  <WeekDot week={week} fallbackWeek={number} onClick={() => week && onOpenWeek(week)} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function WeekDot({
  week,
  fallbackWeek,
  onClick,
}: {
  week: AcademyWeek | undefined;
  fallbackWeek: number;
  onClick: () => void;
}) {
  const state: WeekState = week?.state ?? "locked";
  const number = week?.week ?? fallbackWeek;
  let fill = "var(--vc-surface-muted)";
  let ring = "var(--vc-line)";
  let ink = "rgba(var(--vc-navy-rgb),0.35)";
  let showLock = false;
  let showCheck = false;
  if (state === "done") {
    fill = "var(--vc-mint)";
    ring = "var(--vc-mint)";
    ink = "var(--vc-teal)";
    showCheck = true;
  } else if (state === "current") {
    fill = "var(--vc-teal)";
    ring = "var(--vc-teal)";
    ink = "#fff";
  } else if (state === "open") {
    fill = "var(--vc-surface)";
    ring = "var(--vc-teal)";
    ink = "var(--vc-teal)";
  } else {
    showLock = true;
  }
  return (
    <button type="button" onClick={onClick} aria-label={`Week ${number}, ${state}`} style={{ width: "100%", border: 0, background: "none", padding: 0, cursor: "pointer" }}>
      <span
        style={{
          width: 32,
          height: 32,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 999,
          background: fill,
          border: `${state === "open" ? 1.5 : 1}px solid ${ring}`,
          color: ink,
          fontSize: 12,
          fontWeight: 800,
        }}
      >
        {showLock ? <Lock size={14} color={ink} /> : showCheck ? <TickCircle size={16} color={ink} variant="Bold" /> : number}
      </span>
      <span style={{ display: "block", marginTop: 2, fontSize: 9, fontWeight: 600, color: "var(--vc-muted)" }}>{number}</span>
    </button>
  );
}

/** One academy lesson. Copy is a marked placeholder until CA-11 is published. */
export function PathLessonScreen({ week, lessonId }: { week: number; lessonId: string }) {
  const t = useT();
  const { language } = useLanguage();
  const { toast } = useFeedback();
  const [path, setPath] = useState<AcademyPath | null>(null);
  const [lesson, setLesson] = useState<AcademyLesson | null>(null);
  const [weekRow, setWeekRow] = useState<AcademyWeek | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const next = await fetchAcademyPath((p) => mobileRequest(p));
        if (cancelled) return;
        const row = weekByNumber(next, week) ?? null;
        const item = row?.lessons.find((l) => l.id === lessonId) ?? null;
        setPath(next);
        setWeekRow(row);
        setLesson(item);
      } catch {
        if (!cancelled) setPath(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [week, lessonId]);

  const complete = async () => {
    if (!lesson || lesson.completed || saving) return;
    setSaving(true);
    try {
      const result = await completeAcademyLesson((p, options) => mobileRequest(p, options), week, lesson.id);
      if (result.path) setPath(result.path);
      setLesson({ ...lesson, completed: true, completedAt: new Date().toISOString() });
    } catch {
      toast(t("your_path_complete_error"), { error: true });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
        <AppBar title="" />
        <CenterSpinner />
      </div>
    );
  }
  if (!path || !weekRow || !lesson) {
    return (
      <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
        <AppBar title={t("your_path")} />
        <p style={{ margin: "40px 16px", textAlign: "center", color: "var(--vc-ink)" }}>{t("your_path_load_error")}</p>
      </div>
    );
  }

  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={t("your_path_week_title", { week: weekRow.week })} />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 32px" }}>
        <div style={{ padding: 12, borderRadius: 10, background: "var(--vc-tile-peach)", display: "flex", gap: 8, alignItems: "flex-start" }}>
          <InfoCircle size={18} color="var(--vc-teal)" />
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--vc-teal)" }}>{t("your_path_placeholder_label")}</div>
            <div style={{ marginTop: 4, fontSize: 12, lineHeight: 1.4, color: "var(--vc-body)" }}>{textOf(path.placeholderNotice, language)}</div>
          </div>
        </div>
        <div style={{ marginTop: 20, fontSize: 13, fontWeight: 600, color: "var(--vc-muted)" }}>{textOf(weekRow.title, language)}</div>
        <h1 style={{ margin: "6px 0 0", fontSize: 24, fontWeight: 800, lineHeight: 1.2, letterSpacing: -0.6, color: "var(--vc-teal)" }}>{textOf(lesson.title, language)}</h1>
        <p style={{ margin: "14px 0 0", fontSize: 15, lineHeight: 1.5, color: "var(--vc-body)" }}>{textOf(lesson.aim, language)}</p>
        {lesson.pendingLanguageReview && language === "rw" ? (
          <p style={{ margin: "12px 0 0", fontSize: 12, color: "var(--vc-muted)" }}>{t("your_path_language_review")}</p>
        ) : null}
        <div style={{ marginTop: 28 }}>
          {lesson.completed ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 16px", borderRadius: 10, background: "var(--vc-tile-mint)" }}>
              <TickCircle size={20} color="var(--vc-teal)" />
              <span style={{ fontSize: 15, fontWeight: 800, color: "var(--vc-teal)" }}>{t("your_path_completed")}</span>
            </div>
          ) : (
            <ActionButton label={t("your_path_mark_complete")} onClick={() => void complete()} loading={saving} full />
          )}
        </div>
      </div>
    </div>
  );
}

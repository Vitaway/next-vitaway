"use client";

import { useState } from "react";
import { DocumentText, Messages2, Printer, Trash } from "@/lib/plus/icons";
import { useLanguage } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { displayName, useMe } from "@/lib/plus/client/data";
import { useCareTeam } from "@/lib/plus/client/care-team";
import { useInsight, type Text } from "@/lib/plus/client/insights";
import { useResource } from "@/lib/plus/client/use-resource";
import { listMealPhotos } from "@/lib/plus/meal-photos";
import { addVisitQuestion, removeVisitQuestion, shareWithCareTeam, useVisitQuestions } from "@/lib/plus/client/reports";
import { ActionButton, AppBar, HubLinks, Skeleton, cx, useFeedback } from "../ui/vita";
import { ILLU_TINT, Illu } from "../ui/vita-icons";

type Kind = "week" | "month" | "bp";
type Report = { title: string; period: string; lines: string[]; kpis: Array<[string, string]>; head: string[]; rows: string[][]; empty: string | null };

const DAY = 86_400_000;
const pct = (n: number | null | undefined) => (n == null ? "—" : `${n}%`);

function useMealCounts(days: number) {
  const r = useResource("/api/v1/mobile/meal-photos", listMealPhotos, { maxAgeMs: 60_000 });
  const since = Date.now() - days * DAY;
  const recent = (r.data ?? []).filter((m) => +new Date(m.created_at) >= since);
  return { logged: recent.length, checked: recent.filter((m) => m.status === "reviewed").length, loading: r.loading && !r.data };
}

/** Builds the three reports from the same insight numbers the charts use, so a report never disagrees with a chart. */
function useReport(kind: Kind): { report: Report | null; loading: boolean } {
  const { t, language } = useLanguage();
  const period = kind === "week" ? 7 : 30;
  const bp = useInsight("bp", period);
  const glu = useInsight("glucose", period);
  const wt = useInsight("weight", period);
  const meds = useInsight("meds", period);
  const act = useInsight("activity", period);
  const meals = useMealCounts(period);
  const L = (x: Text | null | undefined) => (x ? (language === "rw" && x.rw ? x.rw : x.en) : "");
  const loading = [bp, glu, wt, meds, act].some((r) => r.loading && !r.data) || meals.loading;
  if (loading) return { report: null, loading: true };
  const b = bp.data, g = glu.data, w = wt.data, m = meds.data, a = act.data;
  const fmtDate = (ms: number) => new Date(ms).toLocaleDateString(language === "rw" ? "rw-RW" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
  const range = `${fmtDate(Date.now() - (period - 1) * DAY)} – ${fmtDate(Date.now())}`;
  const bpAvg = b?.average ? `${b.average.s}/${b.average.d}` : "—";
  const readings = (b?.count ?? 0) + (g?.count ?? 0) + (w?.count ?? 0);

  if (kind === "bp") {
    const rows = (b?.points ?? []).slice().reverse().slice(0, 14).map((p) => [
      new Date(p.at).toLocaleDateString(language === "rw" ? "rw-RW" : "en-GB", { weekday: "short", day: "numeric", month: "short" }),
      new Date(p.at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      `${p.s}/${p.d}`,
      p.band ? L(p.band.chip) : "—",
    ]);
    return {
      loading: false,
      report: {
        title: t("rp_bp_title"),
        period: `${t("rp_last_days", { n: period })} · ${range}`,
        lines: b && b.count ? [t("rp_bp_avg_line", { avg: bpAvg, n: b.count }), b.in_target_pct != null && b.target ? t("rp_bp_target_line", { pct: b.in_target_pct, target: `${b.target.high}/${b.target.high2}` }) : t("rp_no_target"), L(b.headline)].filter(Boolean) : [],
        kpis: [[bpAvg, t("rp_average")], [pct(b?.in_target_pct), t("rp_below_target")], [String(b?.count ?? 0), t("rp_readings")], [b?.change ? `${b.change.s > 0 ? "+" : ""}${b.change.s}` : "—", t("rp_change_top")]],
        head: [t("rp_date"), t("rp_time"), t("rp_reading"), t("rp_category")],
        rows,
        empty: b && b.count ? null : t("rp_no_bp"),
      },
    };
  }

  const steps = a?.steps.average != null ? a.steps.average.toLocaleString("en-US") : "—";
  const lines = [
    t("rp_readings_line", { n: readings, days: period }),
    b && b.count ? (b.in_target_pct != null && b.target ? t("rp_bp_target_line", { pct: b.in_target_pct, target: `${b.target.high}/${b.target.high2}` }) : t("rp_bp_avg_line", { avg: bpAvg, n: b.count })) : "",
    g && g.in_target_pct != null ? t("rp_glu_line", { pct: g.in_target_pct }) : "",
    m && m.due ? t("rp_meds_line", { pct: m.taken_pct ?? 0, n: m.counts.taken, due: m.due }) : "",
    w && w.change != null && w.count > 1 ? t("rp_wt_line", { change: `${w.change > 0 ? "+" : ""}${w.change}` }) : "",
    meals.logged ? t("rp_meals_line", { n: meals.logged, checked: meals.checked }) : "",
  ].filter(Boolean);
  const rows: string[][] = [
    [t("rp_row_bp"), bpAvg, b?.previous ? `${b.previous.s}/${b.previous.d}` : "—", b?.target ? `< ${b.target.high}/${b.target.high2}` : "—"],
    [t("rp_row_glucose"), pct(g?.in_target_pct), pct(g?.previous_in_target_pct), g?.targets.fasting_mg ? `${g.targets.fasting_mg.low}–${g.targets.fasting_mg.high}` : "—"],
    [t("rp_row_weight"), w?.now != null ? `${w.now} kg` : "—", w?.start != null ? `${w.start} kg` : "—", w?.goal != null ? `${w.goal} kg` : "—"],
    [t("rp_row_meds"), pct(m?.taken_pct), "—", "80%"],
    [t("rp_row_steps"), steps, "—", a ? a.goals.steps.toLocaleString("en-US") : "—"],
    [t("rp_row_meals"), `${meals.logged} · ${meals.checked}`, "—", "—"],
  ];
  return {
    loading: false,
    report: {
      title: kind === "week" ? t("rp_week_title") : t("rp_month_title"),
      period: `${t("rp_last_days", { n: period })} · ${range}`,
      lines,
      kpis: [[`${readings}`, t("rp_readings_logged")], [bpAvg, t("rp_bp_average")], [pct(g?.in_target_pct), t("rp_glu_in_target")], [pct(m?.taken_pct), t("rp_doses_taken")]],
      head: [t("rp_measure"), t("rp_this_period"), t("rp_before"), t("rp_target")],
      rows,
      empty: readings || m?.due || meals.logged ? null : t("rp_nothing_yet"),
    },
  };
}

function ReportPaper({ report, name, mrn }: { report: Report; name: string; mrn: string | null }) {
  const { t } = useLanguage();
  return (
    <article className="vita-report-paper" data-testid="report-paper">
      <header className="vita-report-head">
        <div>
          <div className="vita-report-brand">
            vita<span>way</span> Plus
          </div>
          <h2>{report.title}</h2>
          <p>{report.period}</p>
        </div>
        <div className="vita-report-who">
          <b>{name || t("rp_member")}</b>
          {mrn ? <span>MRN {mrn}</span> : null}
        </div>
      </header>
      {report.empty ? (
        <p className="vita-report-empty">{report.empty}</p>
      ) : (
        <>
          {report.lines.length ? (
            <div className="vita-report-sum">
              <span>{t("rp_in_short")}</span>
              {report.lines.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
          ) : null}
          <div className="vita-report-kpis">
            {report.kpis.map(([v, l]) => (
              <div key={l}>
                <b>{v}</b>
                <span>{l}</span>
              </div>
            ))}
          </div>
          {report.rows.length ? (
            <div className="vita-report-table" role="table">
              <div role="row" className="th">
                {report.head.map((h) => (
                  <span key={h} role="columnheader">
                    {h}
                  </span>
                ))}
              </div>
              {report.rows.map((r, i) => (
                <div key={i} role="row">
                  {r.map((c, j) => (
                    <span key={j} role="cell">
                      {c}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          ) : null}
        </>
      )}
      <footer className="vita-report-foot">{t("rp_footer")}</footer>
    </article>
  );
}

function VisitQuestions() {
  const { t } = useLanguage();
  const { toast } = useFeedback();
  const q = useVisitQuestions();
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const add = async () => {
    if (!draft.trim() || busy) return;
    setBusy(true);
    try {
      await addVisitQuestion(draft.trim());
      setDraft("");
      toast(t("rp_q_added"));
    } catch (e) {
      toast(e instanceof Error && e.message ? e.message : t("network_error"), { error: true });
    }
    setBusy(false);
  };
  return (
    <section className="vita-report-card" data-testid="visit-questions">
      <h3>{t("rp_q_title")}</h3>
      <p className="vita-report-note">{t("rp_q_sub")}</p>
      {q.loading && !q.data ? <Skeleton height={60} /> : null}
      {q.list.map((x) => (
        <div key={x.id} className={cx("vita-report-q", x.answered_at && "done")}>
          <span>{x.body}</span>
          {x.answered_at ? (
            <small>{t("rp_q_answered")}</small>
          ) : (
            <button type="button" aria-label={t("rp_q_remove")} onClick={() => void removeVisitQuestion(x.id).catch(() => toast(t("network_error"), { error: true }))}>
              <Trash size={16} color="currentColor" />
            </button>
          )}
        </div>
      ))}
      <form
        className="vita-report-qadd"
        onSubmit={(e) => {
          e.preventDefault();
          void add();
        }}
      >
        <label htmlFor="rp-q" className="sr-only">
          {t("rp_q_new")}
        </label>
        <input id="rp-q" value={draft} maxLength={500} onChange={(e) => setDraft(e.target.value)} placeholder={t("rp_q_placeholder")} />
        <ActionButton small label={t("rp_q_add")} loading={busy} type="submit" />
      </form>
    </section>
  );
}

/** Reports: weekly and monthly summaries, a blood pressure report for the doctor, visit questions, and the clinic's own reports. */
export default function ReportsScreen() {
  const { t } = useLanguage();
  const { push } = usePlusPaths();
  const { toast } = useFeedback();
  const me = useMe();
  const team = useCareTeam();
  const [kind, setKind] = useState<Kind>("week");
  const [sharing, setSharing] = useState(false);
  const { report, loading } = useReport(kind);
  const main = team.mine.find((p) => p.can_message) ?? null;
  const name = displayName(me.user);
  const mrn = (me.user as { medical_record_number?: string | null } | undefined)?.medical_record_number ?? null;

  const share = async () => {
    if (!report || !main) return;
    setSharing(true);
    try {
      const text = [`${report.title} · ${report.period}`, ...report.lines.map((l) => `• ${l}`)].join("\n");
      const room = await shareWithCareTeam(main, text);
      toast(t("rp_shared", { name: main.name }));
      if (room) push(`/chat/${room}`);
    } catch (e) {
      toast(e instanceof Error && e.message ? e.message : t("network_error"), { error: true });
    }
    setSharing(false);
  };

  return (
    <div className="vita-page w-wide">
      <AppBar title={t("rpt_title")} />
      <div className="vita-scroll vita-reports">
        <div className="vita-report-tabs" role="tablist" aria-label={t("rpt_title")}>
          {(
            [
              ["week", t("rp_tab_week")],
              ["month", t("rp_tab_month")],
              ["bp", t("rp_tab_bp")],
            ] as Array<[Kind, string]>
          ).map(([k, l]) => (
            <button key={k} type="button" role="tab" aria-selected={kind === k} onClick={() => setKind(k)}>
              {l}
            </button>
          ))}
        </div>
        <div className="vita-reports-grid">
          <div>
            {loading || !report ? <Skeleton height={420} style={{ borderRadius: 12 }} /> : <ReportPaper report={report} name={name} mrn={mrn} />}
            <div className="vita-report-actions">
              <ActionButton label={t("rp_print")} icon={<Printer size={16} color="currentColor" />} onClick={() => window.print()} />
              <ActionButton tone="white" label={main ? t("rp_send_to", { name: main.name.split(" ")[0] }) : t("rp_send_team")} icon={<Messages2 size={16} color="currentColor" />} loading={sharing} disabled={!main || !report || Boolean(report.empty)} onClick={share} />
            </div>
            <p className="vita-report-note">{t("rp_privacy")}</p>
          </div>
          <aside>
            <VisitQuestions />
            <section className="vita-report-card">
              <h3>{t("rp_from_clinic")}</h3>
              <HubLinks
                links={[
                  { label: t("rp_visit_summaries"), icon: <DocumentText size={26} color="currentColor" />, tint: ILLU_TINT.appointments, onClick: () => push("/visit-reports") },
                  { label: t("rp_food_reports"), icon: <Illu name="food-reports" size={30} />, tint: ILLU_TINT["food-reports"], onClick: () => push("/food-reports") },
                ]}
              />
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { ArrowRight3 } from "iconsax-react";
import { useLanguage, useT } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { checkpointKey, formatChange, formatValue, getFoodReport, listFoodReports, periodLabel, type FoodReport } from "@/lib/plus/food-report";
import { AppBar, CenterSpinner, EmptyState, Page } from "../ui/vita";

const card: React.CSSProperties = { marginBottom: 12, padding: 16, borderRadius: 14, border: "1px solid var(--vc-line)", background: "var(--vc-surface)" };

export function FoodReportsScreen() {
  const t = useT();
  const { push } = usePlusPaths();
  const [rows, setRows] = useState<FoodReport[] | null>(null);
  const [error, setError] = useState(false);
  const load = () => {
    setError(false);
    listFoodReports().then(setRows).catch(() => setError(true));
  };
  useEffect(load, []);
  return (
    <Page>
      <AppBar title={t("fr_title")} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 32px", maxWidth: 720, width: "100%", margin: "0 auto" }}>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--vc-muted)" }}>{t("fr_intro")}</p>
        {rows == null && !error ? <CenterSpinner /> : null}
        {error ? <EmptyState title={t("fr_load_error")} actionLabel={t("retry")} onAction={load} /> : null}
        {rows && !rows.length ? <EmptyState title={t("fr_empty_title")} subtitle={t("fr_empty_body")} /> : null}
        {rows?.map((r) => (
          <button key={r.id} type="button" onClick={() => push(`/food-reports/${r.id}`)} style={{ ...card, width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 15, fontWeight: 800, color: "var(--vc-teal-ink)" }}>{t(checkpointKey(r.checkpoint))}</span>
              <span style={{ display: "block", marginTop: 4, fontSize: 13, color: "var(--vc-ink)" }}>{r.programme?.name ?? ""}</span>
              <span style={{ display: "block", marginTop: 2, fontSize: 12, color: "var(--vc-muted)" }}>
                {periodLabel(r.baseline)} → {periodLabel(r.now)} · {r.issued_by_name}
              </span>
            </span>
            <ArrowRight3 size={18} color="var(--vc-muted)" />
          </button>
        ))}
      </div>
    </Page>
  );
}

export function FoodReportScreen({ id }: { id: number }) {
  const t = useT();
  const [r, setR] = useState<FoodReport | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    getFoodReport(id).then(setR).catch(() => setError(true));
  }, [id]);
  return (
    <Page>
      <AppBar title={t("fr_title")} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 32px", maxWidth: 720, width: "100%", margin: "0 auto" }}>
        {!r && !error ? <CenterSpinner /> : null}
        {error ? <EmptyState title={t("fr_load_error")} /> : null}
        {r ? <FoodReportBody report={r} /> : null}
      </div>
    </Page>
  );
}

/** The report itself: the same blocks, in the same order, as the EHR report (W29). */
export function FoodReportBody({ report: r }: { report: FoodReport }) {
  const t = useT();
  const { language } = useLanguage();
  return (
    <div data-testid="food-report">
      <div style={card}>
        <div style={{ fontSize: 17, fontWeight: 800, color: "var(--vc-teal-ink)" }}>{t(checkpointKey(r.checkpoint))}</div>
        {r.programme ? <div style={{ marginTop: 2, fontSize: 13, color: "var(--vc-ink)" }}>{r.programme.name}</div> : null}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
          <Period label={t("fr_baseline")} p={r.baseline} meals={t("fr_meals")} />
          <Period label={r.checkpoint === "interim" ? t("fr_now") : t(checkpointKey(r.checkpoint))} p={r.now} meals={t("fr_meals")} />
        </div>
        {!r.enough_meals ? <p style={{ margin: "10px 0 0", fontSize: 12, fontWeight: 700, color: "var(--vc-danger)" }}>{t("fr_few_meals")}</p> : null}
      </div>
      <div style={card}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: "10px 8px", alignItems: "center", fontSize: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--vc-muted)" }}>{t("fr_measure")}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--vc-muted)", textAlign: "right" }}>{t("fr_week1")}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--vc-muted)", textAlign: "right" }}>{t("fr_then")}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--vc-muted)", textAlign: "right" }}>{t("fr_change")}</span>
          {r.metrics.map((m) => {
            const c = formatChange(m.change, m.unit);
            return (
              <Row key={m.key}>
                <span style={{ fontWeight: 700, color: "var(--vc-ink)" }}>{language === "rw" ? m.label_rw : m.label_en}</span>
                <span style={{ textAlign: "right", color: "var(--vc-ink)" }}>{formatValue(m.baseline, m.unit)}</span>
                <span style={{ textAlign: "right", color: "var(--vc-ink)" }}>{formatValue(m.now, m.unit)}</span>
                <span style={{ textAlign: "right", fontWeight: 800, color: "var(--vc-teal-ink)" }}>{c.text}</span>
              </Row>
            );
          })}
        </div>
        <p style={{ margin: "12px 0 0", fontSize: 12, color: "var(--vc-muted)" }}>{t("fr_checked_only")}</p>
      </div>
      <div style={{ ...card, borderLeft: "4px solid var(--vc-teal)" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "var(--vc-muted)" }}>{t("fr_note")}</div>
        <p style={{ margin: "6px 0 0", fontSize: 15, lineHeight: 1.5, color: "var(--vc-ink)", whiteSpace: "pre-wrap" }}>{r.nutritionist_note}</p>
        <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--vc-muted)" }}>
          {r.issued_by_name} · {r.issued_at.slice(0, 10)}
        </p>
      </div>
    </div>
  );
}

function Period({ label, p, meals }: { label: string; p: { from: string; to: string; meals: number }; meals: string }) {
  return (
    <div style={{ padding: 10, borderRadius: 10, background: "var(--vc-canvas)" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--vc-muted)" }}>{label}</div>
      <div style={{ marginTop: 2, fontSize: 14, fontWeight: 800, color: "var(--vc-ink)" }}>{periodLabel(p)}</div>
      <div style={{ fontSize: 12, color: "var(--vc-muted)" }}>
        {p.meals} {meals}
      </div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

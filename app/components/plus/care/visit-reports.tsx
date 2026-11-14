"use client";

import { useState } from "react";
import { ArrowRight3, ClipboardText, DocumentDownload } from "iconsax-react";
import { refreshVisitReports, useVisitReport, useVisitReports, visitReportPdf, visitWhenLabel, type VisitReport } from "@/lib/plus/client/care";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { ActionButton, AppBar, CenterSpinner, CircleButton, DotSpinner, EmptyState, useFeedback } from "../ui/vita";
import { useDocumentReader } from "../ui/document-reader";
import { useVisitPlans, VisitPlansList } from "./visit-plans";

function ReportCard({ report, onOpen }: { report: VisitReport; onOpen: () => void }) {
  return (
    <button type="button" className="vita-tap" onClick={onOpen} style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", padding: 18, borderRadius: 10, background: "var(--vc-surface)", border: "1px solid rgba(var(--vc-navy-rgb),0.06)", color: "var(--vc-navy)" }}>
      <span style={{ width: 44, height: 44, borderRadius: 8, background: "var(--vc-tile-sky)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
        <ClipboardText size={21} color="currentColor" />
      </span>
      <span style={{ marginLeft: 14, flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 16, fontWeight: 800 }}>{report.visitType}</span>
        <span style={{ display: "block", marginTop: 4, fontSize: 12, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.5)" }}>
          {report.clinician ? `${visitWhenLabel(report)} · ${report.clinician}` : visitWhenLabel(report)}
        </span>
      </span>
      {!report.read ? <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--vc-action)", marginRight: 6 }} /> : null}
      <span style={{ color: "rgba(var(--vc-navy-rgb),0.35)", display: "inline-flex" }}>
        <ArrowRight3 size={22} color="currentColor" />
      </span>
    </button>
  );
}

/** VisitReportsList — also embedded under My care. */
export function VisitReportsList({ embedded = false }: { embedded?: boolean }) {
  const { reports, loading, error, reload } = useVisitReports();
  const plans = useVisitPlans();
  const hasPlans = (plans.data ?? []).length > 0;
  const { push } = usePlusPaths();
  if (loading) return <div style={{ padding: embedded ? "28px 0" : 0, display: "flex", justifyContent: "center" }}><DotSpinner /></div>;
  if (!hasPlans && error && !reports.length) return <EmptyState title="Could not load visit reports" subtitle="Check your connection and try again." actionLabel="Try again" onAction={reload} />;
  if (!hasPlans && !reports.length) return <EmptyState title="No visit reports yet" subtitle="After a visit at the Vitaway clinic, your care team can send the summary here." />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: embedded ? "4px 0 8px" : "8px 20px 24px" }}>
      <VisitPlansList />
      {reports.map((r) => (
        <ReportCard key={r.id} report={r} onOpen={() => push(`/visit-reports/${r.id}`)} />
      ))}
    </div>
  );
}

export function VisitReportsScreen() {
  return (
    <div className="vita-page">
      <AppBar title="Visit reports" />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <VisitReportsList />
      </div>
    </div>
  );
}

function Section({ title, body, emptyLabel, tint, alwaysShow = false }: { title: string; body: string | null; emptyLabel?: string; tint?: string; alwaysShow?: boolean }) {
  if (!alwaysShow && body === null) return null;
  return (
    <div style={{ marginBottom: 12, padding: 16, borderRadius: 10, background: tint ?? "var(--vc-surface)", border: tint ? undefined : "1px solid rgba(var(--vc-navy-rgb),0.06)" }}>
      <div style={{ fontSize: 11, letterSpacing: 0.6, fontWeight: 700, color: "rgba(var(--vc-navy-rgb),0.55)" }}>{title.toUpperCase()}</div>
      <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.5, whiteSpace: "pre-wrap", color: body === null ? "rgba(var(--vc-navy-rgb),0.5)" : "var(--vc-navy)" }}>{body ?? emptyLabel ?? "None this visit"}</div>
    </div>
  );
}

export function VisitReportScreen({ id }: { id: number }) {
  const { data: report, error } = useVisitReport(id);
  const reader = useDocumentReader();
  const { toast } = useFeedback();
  const [downloading, setDownloading] = useState(false);
  const openPdf = async () => {
    setDownloading(true);
    try {
      await reader.open({ title: report?.visitType ?? "After-Visit Summary", filename: `avs_${id}.pdf`, load: () => visitReportPdf(id) });
    } catch {
      toast("Could not open the PDF. Try again.", { error: true });
    } finally {
      setDownloading(false);
      refreshVisitReports();
    }
  };
  return (
    <div className="vita-page">
      <AppBar
        title="After-Visit Summary"
        actions={
          report ? (
            <CircleButton label="Download PDF" onClick={downloading ? undefined : () => void openPdf()}>
              {downloading ? <DotSpinner small color="currentColor" /> : <DocumentDownload size={20} color="currentColor" />}
            </CircleButton>
          ) : null
        }
      />
      <div style={{ flex: 1, overflowY: "auto" }}>
        {error && !report ? (
          <EmptyState title="Could not open this summary" subtitle="Check your connection and try again." />
        ) : !report ? (
          <CenterSpinner />
        ) : (
          <div style={{ padding: "8px 20px 32px" }}>
            <div style={{ marginBottom: 14, padding: 20, borderRadius: 10, background: "var(--vc-teal)" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{report.visitType}</div>
              <div style={{ marginTop: 6, fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{report.clinician ? `${visitWhenLabel(report)} · with ${report.clinician}` : visitWhenLabel(report)}</div>
              {report.fileNumber ? <div style={{ marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Patient number {report.fileNumber}</div> : null}
            </div>
            <Section title="Message from your care team" body={report.message} tint="var(--vc-tile-mint)" />
            <Section title="Reason for visit" body={report.reason} />
            {report.vitals.length ? (
              <div style={{ marginBottom: 12, padding: "6px 16px", borderRadius: 10, background: "var(--vc-surface)", border: "1px solid rgba(var(--vc-navy-rgb),0.06)" }}>
                {report.vitals.map((v, i) => (
                  <div key={i} style={{ display: "flex", padding: "12px 0", borderBottom: i === report.vitals.length - 1 ? undefined : "1px solid rgba(var(--vc-navy-rgb),0.06)", fontSize: 14 }}>
                    <span style={{ flex: 1, color: "rgba(var(--vc-navy-rgb),0.65)" }}>{v.label}</span>
                    <span style={{ fontWeight: 700, color: "var(--vc-navy)" }}>{v.value}</span>
                  </div>
                ))}
              </div>
            ) : null}
            <Section title="Notes" body={report.notes} />
            <Section title="What we agreed" body={report.whatWeAgreed ?? report.recommendations} emptyLabel="None this visit" tint="var(--vc-tile-sage)" alwaysShow />
            <Section title="Supplements and referrals" body={report.prescriptions} emptyLabel="None this visit" tint="var(--vc-tile-peach)" alwaysShow />
            <Section title="Next visit" body={report.nextVisit} emptyLabel="Not scheduled yet" alwaysShow />
            <div style={{ height: 8 }} />
            <ActionButton full label="Download as PDF" loading={downloading} icon={<DocumentDownload size={20} color="currentColor" />} iconFirst onClick={openPdf} />
          </div>
        )}
      </div>
    </div>
  );
}

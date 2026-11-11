"use client";

import { asList, fetchProtectedBlob, fetchUrlBlob, mobileRequest } from "./api";
import { invalidate, useResource } from "./use-resource";
import { MONTHS, MONTHS_SHORT, fmtLongDay, sameDay } from "../format";

const text = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);

/* ───────── Visit reports (care/visit_reports.dart) ───────── */

export type VisitReport = {
  id: number;
  visitType: string;
  visitDate: string;
  visitTime: string;
  fileNumber: string | null;
  clinician: string | null;
  reason: string | null;
  vitals: Array<{ label: string; value: string }>;
  notes: string | null;
  recommendations: string | null;
  prescriptions: string | null;
  message: string | null;
  whatWeAgreed: string | null;
  nextVisit: string | null;
  read: boolean;
};

export function normalizeVisitReport(raw: Record<string, unknown>): VisitReport {
  const vitals = Array.isArray(raw.vitals) ? (raw.vitals as Array<Record<string, unknown>>).filter((r) => r && typeof r === "object") : [];
  return {
    id: Number(raw.id) || 0,
    visitType: text(raw.visit_type) ?? "Visit",
    visitDate: String(raw.visit_date ?? ""),
    visitTime: String(raw.visit_time ?? ""),
    fileNumber: text(raw.file_number),
    clinician: text(raw.clinician),
    reason: text(raw.reason),
    vitals: vitals.map((r) => ({ label: String(r.label ?? ""), value: String(r.value ?? "") })),
    notes: text(raw.notes),
    recommendations: text(raw.recommendations),
    prescriptions: text(raw.prescriptions),
    message: text(raw.message),
    whatWeAgreed: text(raw.what_we_agreed),
    nextVisit: text(raw.next_visit),
    read: raw.read === true,
  };
}

/** d MMMM yyyy · HH:mm */
export function visitWhenLabel(report: VisitReport): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(report.visitDate);
  const t = /^(\d{1,2}):(\d{2})/.exec(report.visitTime || "00:00");
  if (!m || !t) return report.visitDate;
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]} · ${t[1].padStart(2, "0")}:${t[2]}`;
}

export function useVisitReports() {
  const res = useResource<VisitReport[]>("/api/visit-reports/", async () => asList<Record<string, unknown>>(await mobileRequest("/api/visit-reports/")).map(normalizeVisitReport));
  return { ...res, reports: res.data ?? [] };
}

export function useVisitReport(id: number) {
  return useResource<VisitReport>(`/api/visit-reports/${id}/`, async () => normalizeVisitReport(await mobileRequest<Record<string, unknown>>(`/api/visit-reports/${id}/`)));
}

export const refreshVisitReports = () => invalidate("/api/visit-reports/");
export const visitReportPdf = (id: number) => fetchProtectedBlob([`/api/visit-reports/${id}/pdf/`]);

/* ───────── Progress notes (coaches/progress_notes.dart) ───────── */

export type NoteProfile = { firstName: string; lastName: string; profilePicture: string };
export type CoachNote = { id: number; timestamp: string; note: string; recommendations: string[]; coachProfile: NoteProfile; userProfile: NoteProfile };

const profileOf = (raw: unknown): NoteProfile => {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return { firstName: String(r.first_name ?? ""), lastName: String(r.last_name ?? ""), profilePicture: String(r.profile_picture ?? "") };
};

export function useProgressNotes() {
  const res = useResource<CoachNote[]>("/progress-notes/", async () => {
    const rows = asList<Record<string, unknown>>(await mobileRequest("/progress-notes/")).map((r) => ({
      id: Number(r.id) || 0,
      timestamp: String(r.timestamp ?? ""),
      note: String(r.note ?? ""),
      recommendations: Array.isArray(r.recommendations) ? r.recommendations.map(String) : [],
      coachProfile: profileOf(r.coach_profile),
      userProfile: profileOf(r.user_profile),
    }));
    return rows.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  });
  return { ...res, notes: res.data ?? [] };
}

/** health_metrics.dart formatDateString: Today / Tomorrow / EEEE, d MMMM */
export function relativeDayLabel(raw: string, t: (key: string) => string): string {
  const at = new Date(raw);
  if (Number.isNaN(at.getTime())) return raw;
  const now = new Date();
  if (sameDay(at, now)) return t("hm_today");
  if (sameDay(at, new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1))) return t("hm_tomorrow");
  return fmtLongDay(at);
}

/* ───────── Meal plans (meals/meal_plans.dart) ───────── */

export type MealPlanItem = { id: number; dayIndex: number; slotIndex: number; mealDescription: string };
export type MealPlan = { id: number; title: string; notes: string; startDate: string; endDate: string; guidelines: string; fileUrl: string | null; items: MealPlanItem[] };

export const MEAL_DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const MEAL_SLOT_LABELS = ["After Wake Up", "Breakfast / Morning", "Snack 1 / 09h–11h", "Lunch / 13h", "Snack 2 / 16h–18h", "Dinner / Evening"];

export const mealPlanUploaded = (plan: MealPlan) => Boolean(plan.fileUrl && plan.fileUrl.length);

export function useMealPlans() {
  const res = useResource<MealPlan[]>("/api/ehr-meal-plans/", async () =>
    asList<Record<string, unknown>>(await mobileRequest("/api/ehr-meal-plans/")).map((r) => ({
      id: Number(r.id) || 0,
      title: String(r.title ?? ""),
      notes: String(r.notes ?? ""),
      startDate: String(r.start_date ?? ""),
      endDate: String(r.end_date ?? ""),
      guidelines: String(r.guidelines ?? ""),
      fileUrl: typeof r.file_url === "string" ? r.file_url : null,
      items: (Array.isArray(r.items) ? (r.items as Array<Record<string, unknown>>) : []).map((i) => ({
        id: Number(i.id) || 0,
        dayIndex: Number.parseInt(String(i.date ?? ""), 10) || 0,
        slotIndex: Number.parseInt(String(i.time_slot ?? ""), 10) || 0,
        mealDescription: String(i.meal_description ?? ""),
      })),
    })),
  );
  return { ...res, plans: res.data ?? [] };
}

export const mealPlanPdf = (id: number) => fetchProtectedBlob([`/api/ehr-meal-plans/${id}/download/`]);

/* ───────── Documents (account/my_documents_page.dart) ───────── */

export type UserDocument = { id: number; document: string; documentType: string; name: string; description: string; uploadedAt: Date };

export function documentTypeName(type: string): string {
  switch (type) {
    case "medical_record":
      return "Medical Record";
    case "certification":
      return "Certification";
    case "cv":
      return "CV/Resume";
    case "license":
      return "Professional License";
    case "other":
      return "Other Document";
    default:
      return type;
  }
}

/** MMM d, yyyy */
export const fmtMMMdY = (d: Date) => `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

const DOCS = "/api/v1/mobile/documents/";

export function useDocuments() {
  const res = useResource<UserDocument[]>(DOCS, async () =>
    asList<Record<string, unknown>>(await mobileRequest(DOCS)).map((r) => {
      const at = new Date(String(r.uploaded_at ?? ""));
      return {
        id: Number(r.id) || 0,
        document: String(r.document ?? ""),
        documentType: String(r.document_type ?? "other"),
        name: String(r.name ?? "Document"),
        description: String(r.description ?? ""),
        uploadedAt: Number.isNaN(at.getTime()) ? new Date() : at,
      };
    }),
  );
  return { ...res, documents: res.data ?? [] };
}

export async function uploadDocument(file: File, documentType: string, name: string, description: string): Promise<UserDocument | null> {
  const form = new FormData();
  form.append("document", file, file.name);
  form.append("document_type", documentType);
  form.append("name", name.trim() || "Document");
  if (description.trim()) form.append("description", description.trim());
  const raw = await mobileRequest<Record<string, unknown>>(DOCS, { method: "POST", form });
  invalidate(DOCS);
  const id = Number(raw?.id) || 0;
  return id ? { id, document: String(raw.document ?? ""), documentType, name: String(raw.name ?? name), description, uploadedAt: new Date() } : null;
}

export async function deleteDocument(id: number): Promise<void> {
  await mobileRequest(`${DOCS}${id}/`, { method: "DELETE" });
  invalidate(DOCS);
}

/** openUserDocumentFile: authenticated bytes, then a fresh access URL, then the listed link. */
export async function openUserDocumentBlob(doc: UserDocument): Promise<Blob> {
  if (!doc.id) throw new Error("This document is not ready yet.");
  try {
    return await fetchProtectedBlob([`/api/v1/mobile/documents/${doc.id}/file`, `/api/documents/${doc.id}/file`]);
  } catch {
    for (const path of [`/api/v1/mobile/documents/${doc.id}/access-url`, `/api/documents/${doc.id}/access-url`]) {
      try {
        const body = await mobileRequest<Record<string, unknown>>(path);
        const url = String(body?.url ?? body?.access_url ?? body?.document ?? "");
        if (url) return await fetchUrlBlob(url);
      } catch {
        /* try next */
      }
    }
    if (doc.document.trim()) return fetchUrlBlob(doc.document.trim());
    throw new Error("Could not open this document. Try again later.");
  }
}

"use client";

import { useRef, useState } from "react";
import { DocumentText1, DocumentUpload, Trash } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { useMe } from "@/lib/plus/client/data";
import { deleteDocument, documentTypeName, fmtMMMdY, openUserDocumentBlob, uploadDocument, useDocuments, type UserDocument } from "@/lib/plus/client/care";
import { ActionButton, AppBar, CenterSpinner, DotSpinner, EmptyState, Modal, useFeedback } from "../ui/vita";
import { useDocumentReader } from "../ui/document-reader";

type Pending = { documentType: string; name: string; description: string };

function UploadSheet({ isPatient, onClose, onPick }: { isPatient: boolean; onClose: () => void; onPick: (p: Pending) => void }) {
  const t = useT();
  const [documentType, setType] = useState(isPatient ? "medical_record" : "certification");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const field = { background: "var(--vc-canvas)", border: 0 };
  return (
    <Modal
      open
      title={t("upload_document")}
      onClose={onClose}
      actions={
        <>
          <ActionButton small tone="white" label={t("cancel")} onClick={onClose} />
          <ActionButton small label={t("upload")} onClick={() => onPick({ documentType, name, description })} />
        </>
      }
    >
      <label style={{ display: "block" }}>
        <span className="vita-label">{t("document_type")}</span>
        <select className="vita-input" value={documentType} onChange={(e) => setType(e.target.value)} style={field}>
          {isPatient ? <option value="medical_record">{t("medical_record")}</option> : null}
          {!isPatient ? (
            <>
              <option value="certification">{t("certification")}</option>
              <option value="cv">CV/Resume</option>
              <option value="license">{t("professional_license")}</option>
            </>
          ) : null}
          <option value="other">{t("other")}</option>
        </select>
      </label>
      <label style={{ display: "block", marginTop: 12 }}>
        <span className="vita-label">{t("document_name")}</span>
        <input className="vita-input" value={name} onChange={(e) => setName(e.target.value)} style={field} />
      </label>
      <label style={{ display: "block", marginTop: 12 }}>
        <span className="vita-label">{t("description_optional")}</span>
        <textarea className="vita-input" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...field, resize: "none", height: "auto", paddingTop: 10 }} />
      </label>
    </Modal>
  );
}

export default function MyDocumentsScreen() {
  const t = useT();
  const { user } = useMe();
  const { documents, loading } = useDocuments();
  const { toast, confirm } = useFeedback();
  const reader = useDocumentReader();
  const [sheet, setSheet] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [openingId, setOpeningId] = useState<number | null>(null);
  const pending = useRef<Pending | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const open = async (doc: UserDocument) => {
    if (!doc.id || openingId !== null) return;
    setOpeningId(doc.id);
    try {
      await reader.open({ title: doc.name, filename: doc.name.toLowerCase().endsWith(".pdf") ? doc.name : `${doc.name}.pdf`, load: () => openUserDocumentBlob(doc) });
    } catch {
      toast(t("could_not_open_document"), { error: true });
    } finally {
      setOpeningId(null);
    }
  };

  const onFile = async (file: File | undefined) => {
    const meta = pending.current;
    pending.current = null;
    if (!file || !meta) return;
    setUploading(true);
    try {
      const uploaded = await uploadDocument(file, meta.documentType, meta.name.trim() || file.name, meta.description);
      toast(t(uploaded ? "document_uploaded_successfully" : "failed_to_upload_document"), { error: !uploaded });
      if (uploaded) await open(uploaded);
    } catch {
      toast(t("failed_to_upload_document"), { error: true });
    } finally {
      setUploading(false);
    }
  };

  const remove = async (doc: UserDocument) => {
    const ok = await confirm({ title: t("delete"), message: t("delete_document_confirmation"), confirmLabel: t("delete"), cancelLabel: t("cancel"), destructive: true });
    if (!ok) return;
    try {
      await deleteDocument(doc.id);
      toast(t("document_deleted_successfully"));
    } catch {
      toast(t("failed_to_delete_document"), { error: true });
    }
  };

  return (
    <div className="vita-page" style={{ position: "relative" }}>
      <AppBar title={t("my_documents")} />
      <input ref={fileInput} type="file" accept="application/pdf,.pdf" hidden onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = ""; }} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading && !documents.length ? (
          <CenterSpinner />
        ) : !documents.length ? (
          <div style={{ paddingTop: 80 }}>
            <EmptyState title={t("no_documents")} subtitle={t("no_documents_body")} actionLabel={t("upload_document")} actionIcon={<DocumentUpload size={16} color="currentColor" />} onAction={() => setSheet(true)} />
          </div>
        ) : (
          <div style={{ padding: "8px 18px 108px", display: "flex", flexDirection: "column", gap: 10 }}>
            {documents.map((doc) => (
              <div key={doc.id} className="vita-tap" role="button" tabIndex={0} onClick={() => void open(doc)} style={{ padding: 14, borderRadius: 10, background: "var(--vc-surface)", display: "flex", alignItems: "center", color: "var(--vc-navy)" }}>
                <span style={{ width: 44, height: 44, borderRadius: 8, background: "var(--vc-tile-mint)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                  <DocumentText1 size={22} color="currentColor" />
                </span>
                <span style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 15, fontWeight: 800, color: "var(--vc-ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doc.name}</span>
                  <span style={{ display: "block", marginTop: 2, fontSize: 12, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.5)" }}>{`${documentTypeName(doc.documentType)} · ${fmtMMMdY(doc.uploadedAt)}`}</span>
                </span>
                {openingId === doc.id ? <DotSpinner small /> : <span style={{ fontSize: 13, fontWeight: 800, color: "var(--vc-action)" }}>Read</span>}
                <button type="button" aria-label={t("delete")} onClick={(e) => { e.stopPropagation(); void remove(doc); }} style={{ marginLeft: 4, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vc-danger)", opacity: 0.85 }}>
                  <Trash size={20} variant="Bold" color="currentColor" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ position: "absolute", right: 16, bottom: "calc(16px + env(safe-area-inset-bottom))", zIndex: 5 }}>
        <ActionButton tone="teal" label={t("add_document")} loading={uploading} icon={<DocumentUpload size={16} color="currentColor" />} onClick={() => setSheet(true)} />
      </div>
      {sheet ? (
        <UploadSheet
          isPatient={(user?.user_type ?? "normal") === "normal"}
          onClose={() => setSheet(false)}
          onPick={(p) => {
            pending.current = p;
            setSheet(false);
            fileInput.current?.click();
          }}
        />
      ) : null}
    </div>
  );
}

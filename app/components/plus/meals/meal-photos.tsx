"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight3, Camera, Gallery } from "iconsax-react";
import {
  MEAL_TYPES,
  getMealPhoto,
  listMealPhotos,
  mealPhotoImageBlob,
  uploadMealPhoto,
  type MealPhoto,
} from "@/lib/plus/meal-photos";
import { useT } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { ActionButton, AppBar, CenterSpinner, EmptyState, Page, useFeedback } from "../ui/vita";

function statusColor(status: string) {
  if (status === "reviewed") return "#0B6A4C";
  if (status === "needs_retake") return "var(--vc-danger)";
  if (status === "in_review") return "var(--vc-action, #E85A2E)";
  return "var(--vc-muted)";
}

function AuthImage({ id, thumb, alt }: { id: number; thumb?: boolean; alt: string }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let url: string | null = null;
    let live = true;
    mealPhotoImageBlob(id, thumb)
      .then((blob) => {
        if (!live) return;
        url = URL.createObjectURL(blob);
        setSrc(url);
      })
      .catch(() => live && setSrc(null));
    return () => {
      live = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [id, thumb]);
  if (!src) return <div style={{ width: "100%", height: "100%", background: "var(--vc-surface-muted)" }} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />;
}

/** History of meal photos sent for a care-team check — Flutter MealPhotosPage. */
export function MealPhotosScreen() {
  const t = useT();
  const { push } = usePlusPaths();
  const [rows, setRows] = useState<MealPhoto[] | null>(null);
  const [error, setError] = useState(false);
  const load = () => {
    setError(false);
    listMealPhotos()
      .then(setRows)
      .catch(() => setError(true));
  };
  useEffect(() => {
    load();
  }, []);
  return (
    <Page>
      <AppBar title={t("meal_photos_title")} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 96px" }}>
        {rows == null && !error ? <CenterSpinner /> : null}
        {error ? <EmptyState title={t("meal_photos_load_error")} actionLabel={t("retry")} onAction={load} /> : null}
        {rows && !rows.length ? <EmptyState title={t("meal_photos_empty_title")} subtitle={t("meal_photos_empty_body")} /> : null}
        {rows?.map((photo) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => push(`/meal-photos/${photo.id}`)}
            style={{ width: "100%", textAlign: "left", marginBottom: 10, padding: 12, borderRadius: 14, border: "1px solid var(--vc-line)", background: "var(--vc-surface)", display: "flex", alignItems: "center", gap: 12 }}
          >
            <span style={{ width: 64, height: 64, borderRadius: 10, overflow: "hidden", flex: "none" }}>
              <AuthImage id={photo.id} thumb alt="" />
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 15, fontWeight: 800, color: "var(--vc-teal)" }}>{t(`meal_type_${photo.meal_type}`)}</span>
              <span style={{ display: "block", marginTop: 4, fontSize: 13, fontWeight: 600, color: statusColor(photo.status) }}>{photo.status_label}</span>
              {photo.review?.note ? <span style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--vc-muted)" }}>{t("meal_photos_has_feedback")}</span> : null}
            </span>
            <ArrowRight3 size={18} color="var(--vc-muted)" />
          </button>
        ))}
      </div>
      <div style={{ position: "sticky", bottom: 0, padding: "8px 16px calc(12px + env(safe-area-inset-bottom))", background: "var(--vc-canvas)" }}>
        <ActionButton full label={t("meal_photos_add")} onClick={() => push("/meal-photos/new")} icon={<Camera size={16} color="currentColor" />} />
      </div>
    </Page>
  );
}

/** Compose a meal photo — Flutter MealPhotoComposePage. */
export function MealPhotoComposeScreen({ retakeOf }: { retakeOf?: number }) {
  const t = useT();
  const { replace } = usePlusPaths();
  const { toast } = useFeedback();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mealType, setMealType] = useState("lunch");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const send = async () => {
    if (!file) {
      toast(t("meal_photos_need_photo"), { error: true });
      return;
    }
    setSaving(true);
    try {
      const photo = await uploadMealPhoto({ file, mealType, note, retakeOf });
      toast(photo.points?.awarded ? t("meal_photos_saved_points", { points: photo.points.points }) : t("meal_photos_saved"));
      replace(`/meal-photos/${photo.id}`);
    } catch {
      toast(t("meal_photos_save_error"), { error: true });
      setSaving(false);
    }
  };

  return (
    <Page>
      <AppBar title={retakeOf ? t("meal_photos_retake") : t("meal_photos_add")} />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 24px" }}>
        <p style={{ margin: "0 0 16px", fontSize: 13, lineHeight: 1.4, color: "var(--vc-body)" }}>{t("meal_photos_compose_notice")}</p>
        <input ref={inputRef} type="file" accept="image/*" capture="environment" hidden onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{ width: "100%", aspectRatio: "4 / 3", borderRadius: 14, border: "1px solid var(--vc-line)", background: "var(--vc-surface)", overflow: "hidden", padding: 0 }}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <span style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--vc-muted)", fontWeight: 600 }}>
              <Camera size={36} color="currentColor" />
              <span style={{ marginTop: 8 }}>{t("meal_photos_choose")}</span>
            </span>
          )}
        </button>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <ActionButton small label={t("meal_photos_library")} onClick={() => inputRef.current?.click()} icon={<Gallery size={14} color="currentColor" />} />
        </div>
        <div style={{ marginTop: 20, fontSize: 13, fontWeight: 700, color: "var(--vc-muted)" }}>{t("meal_photos_type")}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
          {MEAL_TYPES.map((type) => {
            const on = mealType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setMealType(type)}
                style={{ padding: "8px 12px", borderRadius: 999, border: `1px solid ${on ? "var(--vc-teal)" : "var(--vc-line)"}`, background: on ? "var(--vc-tile-mint)" : "var(--vc-surface)", color: "var(--vc-teal)", fontWeight: 700, fontSize: 13 }}
              >
                {t(`meal_type_${type}`)}
              </button>
            );
          })}
        </div>
        <label style={{ display: "block", marginTop: 16, fontSize: 13, fontWeight: 600, color: "var(--vc-muted)" }}>
          {t("meal_photos_note_optional")}
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={1000}
            rows={3}
            style={{ display: "block", width: "100%", marginTop: 8, padding: 12, borderRadius: 12, border: "1px solid var(--vc-line)", background: "var(--vc-surface)", color: "var(--vc-ink)", font: "inherit" }}
          />
        </label>
        <div style={{ marginTop: 20 }}>
          <ActionButton full label={t("meal_photos_send")} loading={saving} onClick={() => void send()} />
        </div>
      </div>
    </Page>
  );
}

/** One meal photo and any nutritionist feedback — Flutter MealPhotoDetailPage. */
export function MealPhotoDetailScreen({ id }: { id: number }) {
  const t = useT();
  const { push } = usePlusPaths();
  const [photo, setPhoto] = useState<MealPhoto | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    getMealPhoto(id)
      .then(setPhoto)
      .catch(() => setError(true));
  }, [id]);
  if (!photo && !error) {
    return (
      <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
        <AppBar title={t("meal_photos_title")} />
        <CenterSpinner />
      </div>
    );
  }
  if (!photo) {
    return (
      <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
        <AppBar title={t("meal_photos_title")} />
        <p style={{ margin: "40px 16px", textAlign: "center" }}>{t("meal_photos_load_error")}</p>
      </div>
    );
  }
  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={t("meal_photos_title")} />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 32px" }}>
        <div style={{ aspectRatio: "4 / 3", borderRadius: 14, overflow: "hidden" }}>
          <AuthImage id={photo.id} alt="" />
        </div>
        <h1 style={{ margin: "16px 0 0", fontSize: 22, fontWeight: 800, color: "var(--vc-teal)" }}>{t(`meal_type_${photo.meal_type}`)}</h1>
        <div style={{ marginTop: 6, fontSize: 14, fontWeight: 700, color: "var(--vc-body)" }}>{photo.status_label}</div>
        {photo.note ? (
          <>
            <div style={{ marginTop: 16, fontSize: 12, fontWeight: 700, color: "var(--vc-muted)" }}>{t("meal_photos_your_note")}</div>
            <p style={{ margin: "4px 0 0", fontSize: 15, lineHeight: 1.4, color: "var(--vc-body)" }}>{photo.note}</p>
          </>
        ) : null}
        {photo.review ? (
          <div style={{ marginTop: 20, padding: 14, borderRadius: 12, background: photo.status === "needs_retake" ? "var(--vc-tile-peach)" : "var(--vc-tile-mint)" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--vc-teal)" }}>{t("meal_photos_feedback_title")}</div>
            {photo.review.checked_by ? <div style={{ marginTop: 4, fontSize: 12, color: "var(--vc-muted)" }}>{t("meal_photos_checked_by", { name: photo.review.checked_by })}</div> : null}
            {photo.review.note ? <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.4, color: "var(--vc-body)" }}>{photo.review.note}</p> : null}
          </div>
        ) : null}
        {photo.kudos ? (
          <div data-testid="meal-kudos" style={{ marginTop: 12, padding: 14, borderRadius: 12, background: "var(--vc-surface)", border: "1.4px solid color-mix(in srgb, var(--vc-chip-orange-ink) 45%, transparent)" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--vc-chip-orange-ink)" }}>{t("meal_kudos_from", { name: photo.kudos.by })}</div>
            <p style={{ margin: "6px 0 0", fontSize: 15, lineHeight: 1.4, color: "var(--vc-body)" }}>{photo.kudos.message}</p>
          </div>
        ) : null}
        {photo.status === "needs_retake" ? (
          <div style={{ marginTop: 24 }}>
            <ActionButton full label={t("meal_photos_retake")} onClick={() => push(`/meal-photos/new?retake_of=${photo.id}`)} icon={<Camera size={16} color="currentColor" />} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

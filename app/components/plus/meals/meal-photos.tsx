"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Gallery, Message } from "@/lib/plus/icons";
import { parseStamp } from "@/lib/plus/health";
import { fmtLongDay } from "@/lib/plus/format";
import {
  MEAL_TYPES,
  getMealPhoto,
  listMealPhotos,
  mealPhotoImageBlob,
  uploadMealPhoto,
  type MealPhoto,
} from "@/lib/plus/meal-photos";
import { useLanguage, useT } from "@/lib/plus/i18n";
import { FoodTargetsCard, PlanTodayCard } from "./food-today";
import { useProgrammeConfig } from "@/lib/plus/client/programme-config";
import { MobileApiError } from "@/lib/plus/client/api";
import { changeLine, getFood, mealPollMs, itemFromRecognised, recognizeMeal, toSubmission, type Recognition, type ReviewItem } from "@/lib/plus/meal-review";
import { MealReviewItems, PrimaryButton } from "./meal-review";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { ActionButton, AppBar, CenterSpinner, EmptyState, HubLinks, Page, useFeedback } from "../ui/vita";
import { ILLU_TINT, Illu } from "../ui/vita-icons";

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

function statusTone(status: string) {
  if (status === "reviewed") return "ok";
  if (status === "needs_retake") return "bad";
  if (status === "in_review") return "warn";
  return "neutral";
}

/** History of meal photos sent for a care-team check — Flutter MealPhotosPage (23 Nov: hero + photo gallery). */
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
  const steps = [t("meal_step_1"), t("meal_step_2"), t("meal_step_3")];
  return (
    <Page width="wide">
      <AppBar title={t("nav_nutrition")} back={false} profile />
      <div className="vita-nu" style={{ flex: 1, overflowY: "auto" }}>
        <HubLinks
          links={[
            { label: t("meal_plans_title"), icon: <Illu name="meal-plans" size={30} />, tint: ILLU_TINT["meal-plans"], onClick: () => push("/meal-plans") },
            { label: t("fr_open"), icon: <Illu name="food-reports" size={30} />, tint: ILLU_TINT["food-reports"], onClick: () => push("/food-reports"), testId: "food-reports-link" },
          ]}
        />

        <section className="vita-nu-hero">
          <span className="art" style={{ background: ILLU_TINT["meal-photo"] }}>
            <Illu name="meal-photo" size={72} />
          </span>
          <div className="tx">
            <h2>{t("meal_hero_title")}</h2>
            <p>{t("meal_photos_empty_body")}</p>
          </div>
          <div className="cta">
            <ActionButton full label={t("meal_photos_add")} onClick={() => push("/meal-photos/new")} icon={<Camera size={16} color="currentColor" />} />
          </div>
        </section>

        {rows ? (
          <div className="vita-ft-wrap">
            <FoodTargetsCard rows={rows} />
            <PlanTodayCard />
          </div>
        ) : null}

        {rows == null && !error ? <CenterSpinner /> : null}
        {error ? <EmptyState title={t("meal_photos_load_error")} actionLabel={t("retry")} onAction={load} /> : null}

        {rows && !rows.length ? (
          <section className="vita-nu-steps" aria-label={t("meal_steps_title")}>
            <h2 className="vita-nu-title">{t("meal_steps_title")}</h2>
            <ol>
              {steps.map((step, i) => (
                <li key={step}>
                  <span className="n">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className="empty">{t("meal_photos_empty_title")}</p>
          </section>
        ) : null}

        {rows?.length ? (
          <section aria-label={t("meal_section_title")}>
            <h2 className="vita-nu-title">
              {t("meal_section_title")} <span className="ct">{rows.length}</span>
            </h2>
            <div className="vita-nu-grid">
              {rows.map((photo) => {
                const when = parseStamp(photo.eaten_at || photo.created_at);
                return (
                  <button key={photo.id} type="button" className="vita-nu-card" onClick={() => push(`/meal-photos/${photo.id}`)}>
                    <span className="ph">
                      <AuthImage id={photo.id} thumb alt="" />
                      <span className={`vita-mc-chip tone-${statusTone(photo.status)}`}>{photo.status_label}</span>
                    </span>
                    <span className="bd">
                      <b>{t(`meal_type_${photo.meal_type}`)}</b>
                      <span>{when ? fmtLongDay(when) : ""}</span>
                      {photo.review?.note ? (
                        <span className="fb">
                          <Message size={14} color="currentColor" /> {t("meal_photos_has_feedback")}
                        </span>
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}
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
  // "Log this meal" from today's plan opens here with the meal and its description filled in.
  const [mealType, setMealType] = useState("lunch");
  const [note, setNote] = useState("");
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const meal = q.get("meal");
    if (meal && (MEAL_TYPES as readonly string[]).includes(meal)) setMealType(meal);
    const planned = q.get("note");
    if (planned) setNote(planned.slice(0, 300));
  }, []);
  const [saving, setSaving] = useState(false);
  const { language } = useLanguage();
  const { config } = useProgrammeConfig();
  const [step, setStep] = useState<"photo" | "review">("photo");
  const [recognition, setRecognition] = useState<Recognition | null>(null);
  const [looking, setLooking] = useState(false);
  const [items, setItems] = useState<ReviewItem[]>([]);

  /** W23: after the photo, ask for suggestions (MiraFood when on), then let the member check them. */
  const toReview = async () => {
    if (!file) {
      toast(t("meal_photos_need_photo"), { error: true });
      return;
    }
    setStep("review");
    if (recognition) return;
    setLooking(true);
    try {
      const rec = await recognizeMeal(file);
      setRecognition(rec);
      const details = await Promise.all(rec.items.map((r) => getFood(r.food_key).catch(() => null)));
      setItems(rec.items.map((r, i) => itemFromRecognised(r, details[i])));
    } catch {
      setRecognition({ available: false, reason: "unavailable", request_id: null, model_version: null, dataset_version: null, items: [] });
    } finally {
      setLooking(false);
    }
  };

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
      const photo = await uploadMealPhoto({
        file,
        mealType,
        note,
        retakeOf,
        foods: toSubmission(items, language),
        mirafoodRequestId: recognition?.available ? recognition.request_id : null,
        modelVersion: recognition?.available ? recognition.model_version : null,
        datasetVersion: recognition?.available ? recognition.dataset_version : null,
      });
      toast(photo.points?.awarded ? t("meal_photos_saved_points", { points: photo.points.points }) : t("meal_photos_saved"));
      replace(`/meal-photos/${photo.id}`);
    } catch (error) {
      // A 400 carries the server's own reason (photo too big, unreadable, wrong type); say that, not a generic retry.
      const reason = error instanceof MobileApiError && error.status === 400 ? error.message : "";
      toast(reason || t("meal_photos_save_error"), { error: true });
      setSaving(false);
    }
  };

  if (step === "review") {
    return (
      <Page width="narrow">
        <AppBar title={t("mr_title")} onBack={() => setStep("photo")} />
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 24px" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" style={{ width: 72, height: 72, borderRadius: 12, objectFit: "cover", flex: "none" }} />
            ) : null}
            <div style={{ fontSize: 13, lineHeight: 1.4, color: "var(--vc-body)" }}>
              <b style={{ color: "var(--vc-teal-ink)" }}>{t(`meal_type_${mealType}`)}</b>
              <br />
              {t("mr_estimate_note")}
            </div>
          </div>
          {looking ? <CenterSpinner label={t("mr_looking")} /> : null}
          {!looking && recognition && !recognition.available ? (
            <div data-testid="recognition-off" style={{ marginTop: 12, padding: 12, borderRadius: 12, background: "var(--vc-surface-muted)", fontSize: 13, color: "var(--vc-body)" }}>
              {recognition.reason === "off" ? t("mr_recognition_off") : t("mr_recognition_failed")}
            </div>
          ) : null}
          {!looking ? <MealReviewItems items={items} setItems={setItems} thresholdPercent={config.meal_review?.confidence_percent ?? 60} /> : null}
          <label style={{ display: "block", marginTop: 16, fontSize: 13, fontWeight: 600, color: "var(--vc-muted)" }}>
            {t("meal_photos_note_optional")}
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={1000}
              rows={2}
              style={{ display: "block", width: "100%", marginTop: 8, padding: 12, borderRadius: 12, border: "1px solid var(--vc-line)", background: "var(--vc-surface)", color: "var(--vc-ink)", font: "inherit" }}
            />
          </label>
        </div>
        <div data-testid="submit-bar" style={{ position: "sticky", bottom: 0, zIndex: 5, padding: "10px 16px calc(12px + env(safe-area-inset-bottom))", background: "var(--vc-canvas)", borderTop: "1px solid var(--vc-line)" }} className="vita-bottom-bar">
          <PrimaryButton testId="meal-submit" label={t("mr_submit")} disabled={saving || looking} onClick={() => void send()} />
        </div>
      </Page>
    );
  }

  return (
    <Page width="narrow">
      <AppBar title={retakeOf ? t("meal_photos_retake") : t("meal_photos_add")} />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 24px" }}>
        <p style={{ margin: "0 0 16px", fontSize: 13, lineHeight: 1.4, color: "var(--vc-body)" }}>{t("meal_photos_compose_notice")}</p>
        <input ref={inputRef} type="file" accept="image/*" capture="environment" hidden onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{ width: "100%", height: "clamp(180px, 32vh, 280px)", borderRadius: 16, border: preview ? "1px solid var(--vc-line)" : "2px dashed rgba(var(--vc-navy-rgb), 0.18)", background: preview ? "var(--vc-surface)" : "color-mix(in srgb, var(--vc-tile-mint) 45%, var(--vc-surface))", overflow: "hidden", padding: 0 }}
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
                style={{ padding: "8px 12px", borderRadius: 999, border: `1px solid ${on ? "var(--vc-teal)" : "var(--vc-line)"}`, background: on ? "var(--vc-tile-mint)" : "var(--vc-surface)", color: "var(--vc-teal-ink)", fontWeight: 700, fontSize: 13 }}
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
          <ActionButton full label={t("mr_next")} onClick={() => void toReview()} />
        </div>
      </div>
    </Page>
  );
}

/** One meal photo and any nutritionist feedback — Flutter MealPhotoDetailPage. */
export function MealPhotoDetailScreen({ id }: { id: number }) {
  const t = useT();
  const { language } = useLanguage();
  const { push } = usePlusPaths();
  const [photo, setPhoto] = useState<MealPhoto | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    getMealPhoto(id)
      .then(setPhoto)
      .catch(() => setError(true));
  }, [id]);
  // W24: keep asking while the meal waits for its check, and when the app comes back to the front.
  const pollMs = photo ? mealPollMs(photo.status) : null;
  useEffect(() => {
    if (!pollMs) return;
    const refresh = () => {
      if (document.visibilityState === "visible") getMealPhoto(id).then(setPhoto).catch(() => undefined);
    };
    const timer = window.setInterval(refresh, pollMs);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [id, pollMs]);
  if (!photo && !error) {
    return (
      <div className="vita-page w-narrow" style={{ background: "var(--vc-canvas)" }}>
        <AppBar title={t("meal_photos_title")} />
        <CenterSpinner />
      </div>
    );
  }
  if (!photo) {
    return (
      <div className="vita-page w-narrow" style={{ background: "var(--vc-canvas)" }}>
        <AppBar title={t("meal_photos_title")} />
        <p style={{ margin: "40px 16px", textAlign: "center" }}>{t("meal_photos_load_error")}</p>
      </div>
    );
  }
  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={t("meal_photos_title")} />
      <div className="vita-media-split" style={{ flex: 1, overflowY: "auto", padding: "16px 20px 32px" }}>
        <div className="media" style={{ aspectRatio: "4 / 3", borderRadius: 14, overflow: "hidden" }}>
          <AuthImage id={photo.id} alt="" />
        </div>
        <div className="info">
        <h1 style={{ margin: "16px 0 0", fontSize: 22, fontWeight: 800, color: "var(--vc-teal-ink)" }}>{t(`meal_type_${photo.meal_type}`)}</h1>
        <div style={{ marginTop: 6, fontSize: 14, fontWeight: 700, color: "var(--vc-body)" }}>{photo.status_label}</div>
        {photo.note ? (
          <>
            <div style={{ marginTop: 16, fontSize: 13, fontWeight: 700, color: "var(--vc-muted)" }}>{t("meal_photos_your_note")}</div>
            <p style={{ margin: "4px 0 0", fontSize: 15, lineHeight: 1.4, color: "var(--vc-body)" }}>{photo.note}</p>
          </>
        ) : null}
        {photo.foods.length ? (
          <div data-testid="meal-foods" style={{ marginTop: 16, padding: 14, borderRadius: 12, background: "var(--vc-surface)", border: `1.4px ${photo.status === "reviewed" ? "solid" : "dashed"} var(--vc-line)` }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 800, color: "var(--vc-teal-ink)" }}>{t("mr_foods_title")}</div>
              {photo.totals?.kcal != null ? <div style={{ fontSize: 15, fontWeight: 800, color: "var(--vc-teal-ink)" }}>~{photo.totals.kcal} kcal</div> : null}
            </div>
            {photo.foods.map((food, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginTop: 8, fontSize: 14, color: "var(--vc-body)" }}>
                <span style={{ flex: 1 }}>
                  <b style={{ color: "var(--vc-ink)" }}>{language === "rw" && food.name_rw ? food.name_rw : food.name}</b>
                  {food.portion || food.grams != null ? ` · ${[food.portion, food.grams != null ? `${food.grams} g` : null].filter(Boolean).join(" · ")}` : ""}
                </span>
                {food.coach_changed ? <span style={{ fontSize: 13, fontWeight: 700, color: "var(--vc-chip-orange-ink)" }}>{t("mr_coach_changed")}</span> : null}
                {!food.verified ? <span style={{ fontSize: 13, fontWeight: 700, color: "var(--vc-muted)" }}>{t("mr_unverified")}</span> : null}
              </div>
            ))}
            <div style={{ marginTop: 8, fontSize: 13, color: "var(--vc-muted)" }}>{photo.status === "reviewed" ? `${t("mr_estimate_badge")} · ${t("mr_checked_foods")}` : t("mr_estimate_badge")}</div>
            {photo.changes.length ? (
              <div data-testid="meal-changes" style={{ marginTop: 12, paddingTop: 10, borderTop: "1px dashed var(--vc-line)" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--vc-chip-orange-ink)" }}>{t("mr_changes_title")}</div>
                {photo.changes.map((change, i) => {
                  const line = changeLine(change);
                  return (
                    <div key={i} style={{ marginTop: 4, fontSize: 13, color: "var(--vc-body)" }}>
                      • {t(line.key, line.vars)}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}
        {photo.review ? (
          <div style={{ marginTop: 20, padding: 14, borderRadius: 12, background: photo.status === "needs_retake" ? "var(--vc-tile-peach)" : "var(--vc-tile-mint)" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--vc-teal-ink)" }}>{t("meal_photos_feedback_title")}</div>
            {photo.review.checked_by ? <div style={{ marginTop: 4, fontSize: 13, color: "var(--vc-muted)" }}>{t("meal_photos_checked_by", { name: photo.review.checked_by })}</div> : null}
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
    </div>
  );
}

"use client";

/**
 * W23 (BL-106/110/130/133/135): the member checks the foods on a meal photo before sending it.
 * Items the photo check is unsure about (under the programme's threshold, default 60%) say "Please check".
 * Dashed outline + "~" = estimate (MiraFood visual grammar). Totals update live. Submit stays visible at 360 px.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Add, Edit2, SearchNormal1, Trash } from "iconsax-react";
import { useLanguage, useT } from "@/lib/plus/i18n";
import {
  PREPARATIONS,
  QUANTITIES,
  getFood,
  itemFromFood,
  itemFromTyped,
  itemNutrients,
  needsCheck,
  portionText,
  quantityLabel,
  reviewTotals,
  searchFoods,
  setPortion,
  setPreparation,
  stepGrams,
  unitLabel,
  type FoodOption,
  type ReviewItem,
} from "@/lib/plus/meal-review";

const chip = (on: boolean): React.CSSProperties => ({
  padding: "7px 11px",
  borderRadius: 999,
  border: `1.4px solid ${on ? "var(--vc-teal)" : "var(--vc-line)"}`,
  background: on ? "var(--vc-tile-mint)" : "var(--vc-surface)",
  color: "var(--vc-teal-ink)",
  fontWeight: 700,
  fontSize: 13,
});

function Sheet({ open, title, onClose, children, footer }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode }) {
  if (!open) return null;
  return (
    <div role="presentation" onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 70, background: "var(--vc-scrim)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 560, maxHeight: "86dvh", display: "flex", flexDirection: "column", background: "var(--vc-surface)", borderRadius: "20px 20px 0 0", boxShadow: "0 -12px 40px rgba(8,32,56,.25)" }}
      >
        <div style={{ width: 40, height: 4, borderRadius: 4, background: "var(--vc-line)", margin: "10px auto 0" }} />
        <div style={{ padding: "12px 20px 6px", fontSize: 18, fontWeight: 800, color: "var(--vc-teal-ink)" }}>{title}</div>
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 20px 12px" }}>{children}</div>
        {footer ? <div style={{ padding: "10px 20px calc(14px + env(safe-area-inset-bottom))", borderTop: "1px solid var(--vc-line)" }}>{footer}</div> : null}
      </div>
    </div>
  );
}

function PrimaryButton({ label, onClick, disabled, testId }: { label: string; onClick: () => void; disabled?: boolean; testId?: string }) {
  return (
    <button
      type="button"
      data-testid={testId}
      disabled={disabled}
      onClick={onClick}
      style={{ width: "100%", minHeight: 50, borderRadius: 14, border: "none", background: "var(--vc-action, #E85A2E)", color: "#fff", fontWeight: 800, fontSize: 16, opacity: disabled ? 0.6 : 1 }}
    >
      {label}
    </button>
  );
}

/** Portion sheet: MiraFood units with fractions, or grams in 10 g steps; plus how it was cooked. */
export function PortionSheet({ item, onChange, onClose }: { item: ReviewItem | null; onChange: (next: ReviewItem) => void; onClose: () => void }) {
  const t = useT();
  const { language } = useLanguage();
  if (!item) return null;
  const name = language === "rw" && item.name_rw ? item.name_rw : item.name;
  const n = itemNutrients(item);
  return (
    <Sheet open title={t("mr_portion_title", { name })} onClose={onClose} footer={<PrimaryButton testId="portion-done" label={t("mr_done")} onClick={onClose} />}>
      {item.portions.length ? (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--vc-muted)", marginTop: 4 }}>{t("mr_unit")}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {item.portions.map((p) => (
              <button key={p.unit_key} type="button" style={chip(item.unit_key === p.unit_key)} onClick={() => onChange(setPortion(item, p.unit_key, item.quantity ?? 1))}>
                {unitLabel(p, language)} <span style={{ fontWeight: 500, color: "var(--vc-muted)" }}>· {p.grams} g</span>
              </button>
            ))}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--vc-muted)", marginTop: 16 }}>{t("mr_amount")}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {QUANTITIES.map((q) => (
              <button
                key={q}
                type="button"
                data-testid={`qty-${q}`}
                style={{ ...chip(item.quantity === q && !!item.unit_key), minWidth: 48 }}
                onClick={() => onChange(setPortion(item, item.unit_key ?? item.portions[0].unit_key, q))}
              >
                {quantityLabel(q)}
              </button>
            ))}
          </div>
        </>
      ) : null}
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--vc-muted)", marginTop: 16 }}>{t("mr_grams")}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
        <button type="button" aria-label={t("mr_less")} data-testid="grams-less" onClick={() => onChange(stepGrams(item, -1))} style={{ ...chip(false), width: 52, height: 44, fontSize: 20 }}>
          −
        </button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div data-testid="grams-value" style={{ fontSize: 26, fontWeight: 800, color: "var(--vc-ink)" }}>{item.grams} g</div>
          <div style={{ fontSize: 12, color: "var(--vc-muted)" }}>{item.unit_key && item.quantity ? portionText(item, language).split(" · ")[0] : "\u00a0"}</div>
        </div>
        <button type="button" aria-label={t("mr_more")} data-testid="grams-more" onClick={() => onChange(stepGrams(item, 1))} style={{ ...chip(false), width: 52, height: 44, fontSize: 20 }}>
          +
        </button>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--vc-muted)", marginTop: 16 }}>{t("mr_preparation")}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
        {PREPARATIONS.map((p) => (
          <button key={p} type="button" style={chip(item.preparation === p)} onClick={() => onChange(setPreparation(item, p))}>
            {t(`mr_prep_${p}`)}
          </button>
        ))}
      </div>
      {n.kcal != null ? <div style={{ marginTop: 16, fontSize: 13, color: "var(--vc-muted)" }}>~{n.kcal} kcal · {t("mr_protein")} ~{n.protein_g} g</div> : null}
    </Sheet>
  );
}

/** Search the food list (MiraFood, or the unverified fallback list) and add a food; a typed name works too. */
export function FoodSearchSheet({ open, onPick, onClose }: { open: boolean; onPick: (item: ReviewItem) => void; onClose: () => void }) {
  const t = useT();
  const { language } = useLanguage();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<FoodOption[] | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!open) return;
    setQ("");
    setResults(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults(null);
      return;
    }
    let live = true;
    const timer = setTimeout(() => {
      searchFoods(term, language)
        .then((r) => live && setResults(r))
        .catch(() => live && setResults([]));
    }, 250);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [q, language]);
  const pick = async (food: FoodOption) => {
    setBusy(true);
    try {
      onPick(itemFromFood(await getFood(food.food_key).catch(() => food)));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Sheet open={open} title={t("mr_search_title")} onClose={onClose}>
      <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 12, border: "1.4px solid var(--vc-line)", background: "var(--vc-canvas)" }}>
        <SearchNormal1 size={18} color="var(--vc-muted)" />
        <input
          ref={inputRef}
          data-testid="food-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("mr_search_hint")}
          style={{ flex: 1, border: "none", outline: "none", background: "transparent", color: "var(--vc-ink)", font: "inherit", fontSize: 15 }}
        />
      </label>
      <div style={{ marginTop: 10 }}>
        {results?.map((food) => (
          <button
            key={food.food_key}
            type="button"
            disabled={busy}
            onClick={() => void pick(food)}
            style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 10, padding: "12px 4px", border: "none", borderBottom: "1px solid var(--vc-line)", background: "transparent" }}
          >
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontWeight: 700, color: "var(--vc-ink)" }}>{language === "rw" && food.name_rw ? food.name_rw : food.name}</span>
              <span style={{ display: "block", marginTop: 2, fontSize: 12, color: "var(--vc-muted)" }}>
                {(language === "rw" ? food.name : food.name_rw) ?? ""}
                {food.per_100g.kcal != null ? ` · ${t("mr_per_100g", { kcal: food.per_100g.kcal })}` : ""}
              </span>
            </span>
            {!food.verified ? <span style={{ fontSize: 11, fontWeight: 700, color: "var(--vc-muted)", border: "1px dashed var(--vc-muted)", borderRadius: 999, padding: "2px 8px" }}>{t("mr_unverified")}</span> : null}
            <Add size={20} color="var(--vc-teal-ink)" />
          </button>
        ))}
        {results && !results.length ? <p style={{ margin: "14px 4px", color: "var(--vc-muted)" }}>{t("mr_search_empty")}</p> : null}
        {q.trim().length >= 2 ? (
          <button type="button" onClick={() => onPick(itemFromTyped(q))} style={{ marginTop: 10, ...chip(false) }}>
            {t("mr_search_add_typed", { name: q.trim() })}
          </button>
        ) : null}
      </div>
    </Sheet>
  );
}

export function MealReviewItems({
  items,
  setItems,
  thresholdPercent,
}: {
  items: ReviewItem[];
  setItems: (next: ReviewItem[]) => void;
  thresholdPercent: number;
}) {
  const t = useT();
  const { language } = useLanguage();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const totals = useMemo(() => reviewTotals(items), [items]);
  const editItem = items.find((i) => i.uid === editing) ?? null;
  const update = (next: ReviewItem) => setItems(items.map((i) => (i.uid === next.uid ? next : i)));
  return (
    <div>
      {!items.length ? <p style={{ margin: "8px 0 4px", fontSize: 14, color: "var(--vc-muted)" }}>{t("mr_no_foods")}</p> : null}
      {items.map((item) => {
        const unsure = needsCheck(item, thresholdPercent);
        const n = itemNutrients(item);
        const name = language === "rw" && item.name_rw ? item.name_rw : item.name;
        const other = language === "rw" ? item.name : item.name_rw;
        return (
          <div
            key={item.uid}
            data-testid="review-item"
            data-unsure={unsure ? "1" : "0"}
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 14,
              background: unsure ? "var(--vc-tile-peach)" : "var(--vc-surface)",
              border: `1.4px ${item.verified && !unsure ? "solid" : "dashed"} ${unsure ? "var(--vc-chip-orange-ink)" : "var(--vc-line)"}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <button type="button" onClick={() => setEditing(item.uid)} style={{ flex: 1, minWidth: 0, textAlign: "left", border: "none", background: "transparent", padding: 0 }}>
                <span style={{ display: "block", fontSize: 15, fontWeight: 800, color: "var(--vc-ink)" }}>{name}</span>
                {other && other !== name ? <span style={{ display: "block", fontSize: 12, color: "var(--vc-muted)" }}>{other}</span> : null}
                <span style={{ display: "block", marginTop: 4, fontSize: 13, color: "var(--vc-body)" }}>
                  {portionText(item, language)}
                  {item.preparation ? ` · ${t(`mr_prep_${item.preparation}`)}` : ""}
                </span>
              </button>
              <span style={{ fontSize: 14, fontWeight: 800, color: "var(--vc-teal-ink)", whiteSpace: "nowrap" }}>{n.kcal != null ? `~${n.kcal} kcal` : "—"}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginTop: 8 }}>
              {unsure ? (
                <span data-testid="please-check" style={{ fontSize: 12, fontWeight: 800, color: "var(--vc-chip-orange-ink)", border: "1.4px dashed var(--vc-chip-orange-ink)", borderRadius: 999, padding: "3px 9px" }}>
                  {t("mr_please_check")} · {t("mr_sure", { pct: Math.round((item.confidence ?? 0) * 100) })}
                </span>
              ) : null}
              {!item.verified ? <span style={{ fontSize: 11, fontWeight: 700, color: "var(--vc-muted)", border: "1px dashed var(--vc-muted)", borderRadius: 999, padding: "2px 8px" }}>{t("mr_unverified")}</span> : null}
              <span style={{ flex: 1 }} />
              <button type="button" onClick={() => setEditing(item.uid)} style={{ display: "inline-flex", alignItems: "center", gap: 4, border: "none", background: "transparent", color: "var(--vc-teal-ink)", fontWeight: 700, fontSize: 13, padding: "6px 4px" }}>
                <Edit2 size={14} color="currentColor" /> {t("mr_change")}
              </button>
              <button
                type="button"
                aria-label={t("mr_remove", { name })}
                onClick={() => setItems(items.filter((i) => i.uid !== item.uid))}
                style={{ display: "inline-flex", alignItems: "center", border: "none", background: "transparent", color: "var(--vc-danger)", padding: "6px 4px" }}
              >
                <Trash size={16} color="currentColor" />
              </button>
            </div>
            {unsure ? <div style={{ marginTop: 6, fontSize: 12, color: "var(--vc-body)" }}>{t("mr_please_check_help")}</div> : null}
          </div>
        );
      })}
      <button
        type="button"
        data-testid="add-food"
        onClick={() => setAdding(true)}
        style={{ marginTop: 12, width: "100%", minHeight: 46, borderRadius: 14, border: "1.4px dashed var(--vc-teal-ink)", background: "transparent", color: "var(--vc-teal-ink)", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
      >
        <Add size={18} color="currentColor" /> {t("mr_add_food")}
      </button>
      {items.length ? (
        <div data-testid="meal-totals" style={{ marginTop: 14, padding: 14, borderRadius: 14, background: "var(--vc-tile-mint)", border: "1.4px dashed var(--vc-teal-ink)" }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "var(--vc-muted)", textTransform: "uppercase", letterSpacing: 0.4 }}>{t("mr_totals")}</div>
          <div style={{ marginTop: 4, fontSize: 26, fontWeight: 800, color: "var(--vc-teal-ink)" }}>{totals.kcal != null ? `~${totals.kcal} kcal` : "—"}</div>
          <div style={{ display: "flex", gap: 14, marginTop: 4, fontSize: 13, color: "var(--vc-body)", flexWrap: "wrap" }}>
            <span>
              {t("mr_protein")} ~{totals.protein_g ?? "—"} g
            </span>
            <span>
              {t("mr_carbs")} ~{totals.carbs_g ?? "—"} g
            </span>
            <span>
              {t("mr_fat")} ~{totals.fat_g ?? "—"} g
            </span>
          </div>
          {totals.partial ? <div style={{ marginTop: 6, fontSize: 12, color: "var(--vc-muted)" }}>{t("mr_partial")}</div> : null}
        </div>
      ) : null}
      <PortionSheet item={editItem} onChange={update} onClose={() => setEditing(null)} />
      <FoodSearchSheet
        open={adding}
        onClose={() => setAdding(false)}
        onPick={(item) => {
          setItems([...items, item]);
          setAdding(false);
          setEditing(item.uid);
        }}
      />
    </div>
  );
}

export { PrimaryButton };

"use client";

/**
 * W23 (BL-106/110/130/133/135): the member checks the foods on a meal photo before sending it.
 * Items the photo check is unsure about (under the programme's threshold, default 60%) say "Please check".
 * Dashed outline + "~" = estimate (MiraFood visual grammar). Totals update live. Submit stays visible at 360 px.
 * 24 Nov 2026: the picker runs on the MiraFood master food database: the member's usual foods, the core Rwandan
 * foods by group, search in four languages, household portions with a hint of where each weight comes from.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Add, Edit2, SearchNormal1, Trash } from "@/lib/plus/icons";
import { mediaUrl } from "@/lib/plus/client/api";
import { RootPortal } from "../ui/vita";
import { useLanguage, useT } from "@/lib/plus/i18n";
import {
  FOOD_GROUPS,
  PREPARATIONS,
  QUANTITIES,
  QUICK_GROUP_ORDER,
  askToAdd,
  commonFoods,
  defaultPortionText,
  getFood,
  groupQuickPicks,
  itemFromFood,
  itemFromTyped,
  itemNutrients,
  needsCheck,
  portionText,
  quantityLabel,
  recentFoods,
  reviewTotals,
  saltGrams,
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

function Sheet({ open, title, onClose, children, footer, head }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; head?: React.ReactNode }) {
  if (!open) return null;
  return (
    <RootPortal>
      <div role="presentation" className="vita-sheet-scrim" onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 70, background: "var(--vc-scrim)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={(e) => e.stopPropagation()}
          style={{ width: "100%", maxWidth: 560, maxHeight: "86dvh", display: "flex", flexDirection: "column", background: "var(--vc-surface)", borderRadius: "20px 20px 0 0", boxShadow: "0 -12px 40px rgba(8,32,56,.25)" }}
        >
          <div style={{ width: 40, height: 4, borderRadius: 4, background: "var(--vc-line)", margin: "10px auto 0" }} />
          <div style={{ padding: "12px 20px 6px", fontSize: 18, fontWeight: 800, color: "var(--vc-teal-ink)" }}>{title}</div>
          {head ? <div style={{ padding: "0 20px 8px" }}>{head}</div> : null}
          <div style={{ flex: 1, overflowY: "auto", padding: "4px 20px 12px" }}>{children}</div>
          {footer ? <div style={{ padding: "10px 20px calc(14px + env(safe-area-inset-bottom))", borderTop: "1px solid var(--vc-line)" }}>{footer}</div> : null}
        </div>
      </div>
    </RootPortal>
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

/** A food's picture: the product photo when there is one, otherwise its food-group colour and emoji. */
function FoodArt({ group, image, size = 44 }: { group: string | null | undefined; image?: string | null; size?: number }) {
  const meta = FOOD_GROUPS[group ?? ""] ?? FOOD_GROUPS["15"];
  const src = image ? mediaUrl(image) : null;
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" className="vfp-art" style={{ width: size, height: size }} />;
  }
  return (
    <span className="vfp-art" aria-hidden style={{ width: size, height: size, background: `color-mix(in srgb, ${meta.color} 28%, var(--vc-surface))`, fontSize: Math.round(size * 0.5) }}>
      {meta.emoji}
    </span>
  );
}

function TrustBadge({ label }: { label: ReviewItem["label"] }) {
  const t = useT();
  if (!label) return null;
  return <span className={`vfp-badge ${label}`}>{label === "provisional" ? t("mr_provisional") : t("mr_unverified")}</span>;
}

const PORTION_HINT: Record<string, string> = { draft: "mr_portion_hint_draft", tanzania: "mr_portion_hint_tanzania", usa: "mr_portion_hint_usa", label: "mr_portion_hint_label", weighed: "mr_portion_hint_weighed" };

/** Portion sheet: household units with fractions, or grams in 10 g steps; plus how it was cooked. */
export function PortionSheet({ item, onChange, onClose }: { item: ReviewItem | null; onChange: (next: ReviewItem) => void; onClose: () => void }) {
  const t = useT();
  const { language } = useLanguage();
  if (!item) return null;
  const name = language === "rw" && item.name_rw ? item.name_rw : item.name;
  const n = itemNutrients(item);
  const unit = item.portions.find((p) => p.unit_key === item.unit_key);
  const hint = unit?.status && PORTION_HINT[unit.status] ? t(PORTION_HINT[unit.status]) : null;
  const salt = saltGrams(n.sodium_mg);
  return (
    <Sheet open title={t("mr_portion_title", { name })} onClose={onClose} footer={<PrimaryButton testId="portion-done" label={t("mr_done")} onClick={onClose} />}>
      <div className="vfp-head">
        <FoodArt group={item.group_code} image={item.image_url} size={48} />
        <div className="vfp-head-tx">
          <b>{name}</b>
          <small>
            {item.source_name ? t("mr_source_from", { source: item.source_name }) : null}
            {item.source_name && item.label ? " · " : null}
            <TrustBadge label={item.label} />
          </small>
        </div>
      </div>
      {item.portions.length ? (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--vc-muted)", marginTop: 14 }}>{t("mr_unit")}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {item.portions.map((p) => (
              <button key={p.unit_key} type="button" style={chip(item.unit_key === p.unit_key)} onClick={() => onChange(setPortion(item, p.unit_key, item.quantity ?? 1))}>
                {unitLabel(p, language)} <span style={{ fontWeight: 500, color: "var(--vc-muted)" }}>· {p.grams} g</span>
              </button>
            ))}
          </div>
          {hint ? <div className="vfp-hint">{hint}</div> : null}
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
          <div style={{ fontSize: 13, color: "var(--vc-muted)" }}>{item.unit_key && item.quantity ? portionText(item, language).split(" · ")[0] : " "}</div>
        </div>
        <button type="button" aria-label={t("mr_more")} data-testid="grams-more" onClick={() => onChange(stepGrams(item, 1))} style={{ ...chip(false), width: 52, height: 44, fontSize: 20 }}>
          +
        </button>
      </div>
      {item.group_code === "12" || item.group_code === "06" ? null : (
        <>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--vc-muted)", marginTop: 16 }}>{t("mr_preparation")}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
        {PREPARATIONS.map((p) => (
          <button key={p} type="button" style={chip(item.preparation === p)} onClick={() => onChange(setPreparation(item, p))}>
            {t(`mr_prep_${p}`)}
          </button>
        ))}
      </div>
        </>
      )}
      {n.kcal != null ? (
        <div className="vfp-nums">
          <span><b>~{n.kcal}</b> kcal</span>
          <span><b>~{n.protein_g ?? "—"} g</b> {t("mr_protein")}</span>
          <span><b>~{n.fibre_g ?? "—"} g</b> {t("mr_fibre")}</span>
          {salt != null ? <span><b>~{salt} g</b> {t("mr_salt")}</span> : null}
        </div>
      ) : null}
      {item.image_url ? <div className="vfp-credit">{t("mr_photo_credit")}</div> : null}
    </Sheet>
  );
}

/** One food in the picker: picture, name in the member's language, the other name and its usual portion. */
function FoodRow({ food, onPick, disabled }: { food: FoodOption; onPick: (food: FoodOption) => void; disabled: boolean }) {
  const { language } = useLanguage();
  const name = language === "rw" && food.name_rw ? food.name_rw : food.name;
  const other = language === "rw" ? food.name : food.name_rw;
  return (
    <button type="button" className="vfp-row" disabled={disabled} onClick={() => onPick(food)} data-testid="food-result">
      <FoodArt group={food.group_code} image={food.image_url} />
      <span className="vfp-row-tx">
        <b>{name}</b>
        <small>
          {other && other !== name ? `${other} · ` : ""}
          {defaultPortionText(food, language)}
        </small>
      </span>
      <TrustBadge label={food.label} />
      <Add size={20} color="var(--vc-teal-ink)" />
    </button>
  );
}

// Loaded once per session: the lists don't change while the member logs a meal.
let quickCache: { recent: FoodOption[]; common: FoodOption[]; at: number } | null = null;

/** Search the food list (MiraFood master database, or the unverified fallback list) and add a food; a typed name works too. */
export function FoodSearchSheet({ open, onPick, onClose, initialQuery = "" }: { open: boolean; onPick: (item: ReviewItem) => void; onClose: () => void; initialQuery?: string }) {
  const t = useT();
  const [asked, setAsked] = useState<string | null>(null);
  const { language } = useLanguage();
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<string | null>(null);
  const [results, setResults] = useState<FoodOption[] | null>(null);
  const [quick, setQuick] = useState<{ recent: FoodOption[]; common: FoodOption[] } | null>(quickCache && Date.now() - quickCache.at < 10 * 60_000 ? quickCache : null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!open) return;
    setQ(initialQuery);
    setAsked(null);
    setGroup(null);
    setResults(null);
    setTimeout(() => inputRef.current?.focus(), 50);
    if (quick) return;
    let live = true;
    Promise.all([recentFoods().catch(() => [] as FoodOption[]), commonFoods().catch(() => [] as FoodOption[])]).then(([recent, common]) => {
      if (!live) return;
      quickCache = { recent, common, at: Date.now() };
      setQuick(quickCache);
    });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2 && !group) {
      setResults(null);
      return;
    }
    let live = true;
    const timer = setTimeout(() => {
      searchFoods(term, language, group)
        .then((r) => live && setResults(r))
        .catch(() => live && setResults([]));
    }, term ? 250 : 0);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [q, group, language]);
  const pick = async (food: FoodOption) => {
    setBusy(true);
    try {
      // Recent foods already carry their portions; anything else needs the detail call for them.
      onPick(itemFromFood(food.portions?.length ? food : await getFood(food.food_key).catch(() => food)));
    } finally {
      setBusy(false);
    }
  };
  const sections = useMemo(() => (quick ? groupQuickPicks(quick.common) : []), [quick]);
  const browsing = q.trim().length < 2 && !group;
  const groupName = (code: string) => t(FOOD_GROUPS[code]?.key ?? "fg_15");
  return (
    <Sheet
      open={open}
      title={t("mr_search_title")}
      onClose={onClose}
      head={
        <label className="vfp-search">
          <SearchNormal1 size={18} color="var(--vc-muted)" />
          <input ref={inputRef} data-testid="food-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("mr_search_hint")} />
        </label>
      }
    >
      <div className="vfp-groups" role="group" aria-label={t("mr_browse_groups")}>
        <button type="button" className={group == null ? "on" : ""} aria-pressed={group == null} onClick={() => setGroup(null)}>
          {t("mr_all_groups")}
        </button>
        {QUICK_GROUP_ORDER.map((code) => (
          <button key={code} type="button" className={group === code ? "on" : ""} aria-pressed={group === code} onClick={() => setGroup(group === code ? null : code)}>
            <span aria-hidden>{FOOD_GROUPS[code].emoji}</span> {groupName(code)}
          </button>
        ))}
      </div>

      {browsing ? (
        <>
          {!quick ? <p className="vfp-muted">{t("mr_search_more")}</p> : null}
          {quick?.recent.length ? (
            <section className="vfp-section" data-testid="recent-foods">
              <h4>{t("mr_recent")}</h4>
              <div className="vfp-chips">
                {quick.recent.map((food) => (
                  <button key={food.food_key} type="button" disabled={busy} onClick={() => void pick(food)}>
                    <FoodArt group={food.group_code} image={food.image_url} size={26} />
                    {language === "rw" && food.name_rw ? food.name_rw : food.name}
                  </button>
                ))}
              </div>
            </section>
          ) : null}
          {sections.map((s) => (
            <section key={s.code} className="vfp-section" data-testid={`common-${s.code}`}>
              <h4>
                <span aria-hidden>{FOOD_GROUPS[s.code].emoji}</span> {groupName(s.code)}
              </h4>
              <div className="vfp-list">
                {s.foods.map((food) => (
                  <FoodRow key={food.food_key} food={food} onPick={(f) => void pick(f)} disabled={busy} />
                ))}
              </div>
            </section>
          ))}
          {quick && !quick.common.length ? <p className="vfp-muted">{t("mr_search_more")}</p> : null}
        </>
      ) : (
        <section className="vfp-section">
          <h4>{group && q.trim().length < 2 ? groupName(group) : t("mr_search_results")}</h4>
          <div className="vfp-list">{results?.map((food) => <FoodRow key={food.food_key} food={food} onPick={(f) => void pick(f)} disabled={busy} />)}</div>
          {results && !results.length ? <p className="vfp-muted">{t("mr_search_empty")}</p> : null}
          {results && !results.length && q.trim().length >= 2 ? (
            <button
              type="button"
              data-testid="ask-add"
              disabled={asked === q.trim()}
              onClick={() => {
                const term = q.trim();
                setAsked(term);
                void askToAdd(term).catch(() => setAsked(null));
              }}
              style={{ marginTop: 8, ...chip(asked === q.trim()) }}
            >
              {asked === q.trim() ? t("mr_asked_done") : t("mr_ask_add", { name: q.trim() })}
            </button>
          ) : null}
          {q.trim().length >= 2 ? (
            <button type="button" onClick={() => onPick(itemFromTyped(q))} style={{ marginTop: 12, ...chip(false) }}>
              {t("mr_search_add_typed", { name: q.trim() })}
            </button>
          ) : null}
        </section>
      )}
    </Sheet>
  );
}

const QUICK_DRINKS = [
  { key: "mf:MF-12-0003-NS", emoji: "💧", label: "mr_drink_water" },
  { key: "mf:MF-05-0009-MX", emoji: "🧃", label: "mr_drink_juice" },
  { key: "mf:MF-12-0019-NS", emoji: "🍵", label: "mr_drink_tea" },
  { key: "mf:MF-06-0001-BO", emoji: "🥛", label: "mr_drink_milk" },
];

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
  const [busyDrink, setBusyDrink] = useState(false);
  const addDrink = async (key: string) => {
    setBusyDrink(true);
    try {
      const item = itemFromFood(await getFood(key));
      setItems([...items, item]);
      setEditing(item.uid);
    } catch {
      setAdding(true);
    } finally {
      setBusyDrink(false);
    }
  };
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
              <FoodArt group={item.group_code} image={item.image_url} size={40} />
              <button type="button" onClick={() => setEditing(item.uid)} style={{ flex: 1, minWidth: 0, textAlign: "left", border: "none", background: "transparent", padding: 0 }}>
                <span style={{ display: "block", fontSize: 15, fontWeight: 800, color: "var(--vc-ink)" }}>{name}</span>
                {other && other !== name ? <span style={{ display: "block", fontSize: 13, color: "var(--vc-muted)" }}>{other}</span> : null}
                <span style={{ display: "block", marginTop: 4, fontSize: 13, color: "var(--vc-body)" }}>
                  {portionText(item, language)}
                  {item.preparation ? ` · ${t(`mr_prep_${item.preparation}`)}` : ""}
                </span>
              </button>
              <span style={{ fontSize: 14, fontWeight: 800, color: "var(--vc-teal-ink)", whiteSpace: "nowrap" }}>{n.kcal != null ? `~${n.kcal} kcal` : "—"}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginTop: 8 }}>
              {unsure ? (
                <span data-testid="please-check" style={{ fontSize: 13, fontWeight: 800, color: "var(--vc-chip-orange-ink)", border: "1.4px dashed var(--vc-chip-orange-ink)", borderRadius: 999, padding: "3px 9px" }}>
                  {t("mr_please_check")} · {t("mr_sure", { pct: Math.round((item.confidence ?? 0) * 100) })}
                </span>
              ) : null}
              <TrustBadge label={item.label} />
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
            {unsure ? <div style={{ marginTop: 6, fontSize: 13, color: "var(--vc-body)" }}>{t("mr_please_check_help")}</div> : null}
            {!unsure && item.label === "provisional" ? <div style={{ marginTop: 6, fontSize: 13, color: "var(--vc-muted)" }}>{t("mr_provisional_help")}</div> : null}
          </div>
        );
      })}
      <div data-testid="quick-drinks" style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--vc-muted)" }}>{t("mr_quick_drinks")}</span>
        {QUICK_DRINKS.map((d) => (
          <button key={d.key} type="button" disabled={busyDrink} onClick={() => void addDrink(d.key)} style={chip(false)}>
            {d.emoji} {t(d.label)}
          </button>
        ))}
      </div>
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
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--vc-muted)", textTransform: "uppercase", letterSpacing: 0.4 }}>{t("mr_totals")}</div>
          <div style={{ marginTop: 4, fontSize: 26, fontWeight: 800, color: "var(--vc-teal-ink)" }}>{totals.kcal != null ? `~${totals.kcal} kcal` : "—"}</div>
          <div className="vfp-totals">
            <span>{t("mr_protein")} <b>~{totals.protein_g ?? "—"} g</b></span>
            <span>{t("mr_carbs")} <b>~{totals.carbs_g ?? "—"} g</b></span>
            <span>{t("mr_fat")} <b>~{totals.fat_g ?? "—"} g</b></span>
            <span>{t("mr_fibre")} <b>~{totals.fibre_g ?? "—"} g</b></span>
            {totals.salt_g != null ? <span>{t("mr_salt")} <b>~{totals.salt_g} g</b></span> : null}
          </div>
          {totals.partial ? <div style={{ marginTop: 6, fontSize: 13, color: "var(--vc-muted)" }}>{t("mr_partial")}</div> : null}
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

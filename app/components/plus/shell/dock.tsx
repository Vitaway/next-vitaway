"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Add } from "@/lib/plus/icons";
import { ILLU_TINT, Illu, NavCare, NavHealth, NavHome, NavLearn, NavNutrition } from "../ui/vita-icons";
import { useT } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { cx } from "../ui/vita";

/** F16: five tabs — Home, My Health, Nutrition, Learn, Care Team. */
export const ROOT_TABS = ["/home", "/metrics", "/meal-photos", "/articles", "/care"] as const;
/** Screens that also keep the tab bar (reached from a tab or the profile picture). */
export const DOCK_SCREENS = [...ROOT_TABS, "/support", "/profile"] as const;

export function useMainTabs(supportBadge = false) {
  const t = useT();
  return [
    { path: "/home", label: t("home_menu"), Icon: NavHome, badge: false },
    { path: "/metrics", label: t("nav_my_health"), Icon: NavHealth, badge: false },
    { path: "/meal-photos", label: t("nav_nutrition"), Icon: NavNutrition, badge: false },
    { path: "/articles", label: t("learn_title"), Icon: NavLearn, badge: false },
    { path: "/care", label: t("nav_care_team"), Icon: NavCare, badge: supportBadge },
  ];
}

/** Which tab owns a nested screen (e.g. /support → Care Team). */
export const TAB_OWNERS: Array<[string, string]> = [
  ["/support", "/care"], ["/chat", "/care"], ["/coaches", "/care"], ["/visit-reports", "/care"], ["/notes", "/care"],
  ["/documents", "/care"], ["/book-visit", "/care"], ["/appointments", "/care"],
  ["/health-score", "/metrics"], ["/log", "/metrics"], ["/medications", "/metrics"], ["/reminders", "/metrics"],
  ["/food-reports", "/meal-photos"], ["/meal-plans", "/meal-photos"],
  ["/academy", "/articles"], ["/learn", "/articles"], ["/badges", "/articles"], ["/today", "/home"], ["/emergency", "/home"],
];

export function tabFor(path: string): string | null {
  const hit = (p: string) => path === p || path.startsWith(`${p}/`);
  const direct = (ROOT_TABS as readonly string[]).find(hit);
  if (direct) return direct;
  return TAB_OWNERS.find(([prefix]) => hit(prefix))?.[1] ?? null;
}

export function useAppPath(): string {
  const pathname = usePathname() ?? "/";
  const { basePath } = usePlusPaths();
  if (basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`))) {
    return pathname.slice(basePath.length) || "/";
  }
  return pathname;
}

type QuickAction = { label: string; path: string; tint: string; icon: React.ReactNode };

export const QUICK_ACTIONS: QuickAction[] = [
  { label: "quick_blood_glucose", path: "/log/glucose", tint: ILLU_TINT.glucose, icon: <Illu name="glucose" size={30} /> },
  { label: "quick_blood_pressure", path: "/log/bp", tint: ILLU_TINT.bp, icon: <Illu name="bp" size={30} /> },
  { label: "quick_weight", path: "/log/weight", tint: ILLU_TINT.weight, icon: <Illu name="weight" size={30} /> },
  { label: "quick_habits", path: "/habits", tint: ILLU_TINT.today, icon: <Illu name="today" size={30} /> },
  { label: "quick_meal_photo", path: "/meal-photos/new", tint: ILLU_TINT["meal-photo"], icon: <Illu name="meal-photo" size={30} /> },
  // BL-122: the + menu reaches the Pillbox (add a medicine from there), as in Flutter.
  { label: "pillbox", path: "/medications", tint: ILLU_TINT.pillbox, icon: <Illu name="pillbox" size={30} /> },
];

export default function Dock({ supportBadge = false }: { supportBadge?: boolean }) {
  const t = useT();
  const path = useAppPath();
  const { push } = usePlusPaths();
  const [open, setOpen] = useState(false);
  const items = useMainTabs(supportBadge);
  const active = tabFor(path);

  useEffect(() => setOpen(false), [path]);

  return (
    <>
      {open ? <div className="vita-dial-scrim" onClick={() => setOpen(false)} aria-hidden /> : null}
      <nav className="vita-dock-wrap" aria-label="Main">
        {open ? (
          <div className="vita-dial">
            {[...QUICK_ACTIONS].reverse().map((action, index) => (
              <button
                key={action.path}
                type="button"
                className="vita-dial-action"
                style={{ animationDelay: `${index * 35}ms` }}
                onClick={() => {
                  setOpen(false);
                  push(action.path);
                }}
              >
                <span className="tag">{t(action.label)}</span>
                <span className="disc" style={{ background: action.tint }}>
                  {action.icon}
                </span>
              </button>
            ))}
          </div>
        ) : null}
        <div className="vita-log-row">
          <button
            type="button"
            className={cx("vita-log-btn", open && "open")}
            aria-label={open ? t("close") : t("quick_log_title")}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <Add size={24} color="currentColor" />
            )}
            <span>{open ? t("close") : t("quick_log_title")}</span>
          </button>
        </div>
        <div className="vita-dock">
          {items.map(({ path: itemPath, label, Icon, badge }) => {
            const selected = active === itemPath;
            return (
              <button
                key={itemPath}
                type="button"
                className={cx("vita-dock-item", selected && "on")}
                aria-current={selected ? "page" : undefined}
                onClick={() => {
                  setOpen(false);
                  push(itemPath);
                }}
              >
                <span style={{ position: "relative", display: "inline-flex" }}>
                  <Icon size={22} color="currentColor" variant={selected ? "Bold" : "Linear"} />
                  {badge ? <i className="vita-dock-badge" /> : null}
                </span>
                <span className="lb">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

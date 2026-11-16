"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Activity, Add, Book1, CalendarTick, Camera, Drop, Health, Home2, People, Reserve, Weight } from "iconsax-react";
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
    { path: "/home", label: t("home_menu"), Icon: Home2, badge: false },
    { path: "/metrics", label: t("nav_my_health"), Icon: Activity, badge: false },
    { path: "/meal-photos", label: t("nav_nutrition"), Icon: Reserve, badge: false },
    { path: "/articles", label: t("learn_title"), Icon: Book1, badge: false },
    { path: "/care", label: t("nav_care_team"), Icon: People, badge: supportBadge },
  ];
}

/** Which tab owns a nested screen (e.g. /support → Care Team). */
export const TAB_OWNERS: Array<[string, string]> = [
  ["/support", "/care"], ["/chat", "/care"], ["/coaches", "/care"], ["/visit-reports", "/care"], ["/notes", "/care"],
  ["/documents", "/care"], ["/book-visit", "/care"], ["/appointments", "/care"],
  ["/health-score", "/metrics"], ["/log", "/metrics"], ["/medications", "/metrics"], ["/reminders", "/metrics"],
  ["/food-reports", "/meal-photos"], ["/meal-plans", "/meal-photos"],
  ["/academy", "/articles"], ["/badges", "/articles"], ["/today", "/home"], ["/emergency", "/home"],
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
  { label: "quick_blood_glucose", path: "/log/glucose", tint: "var(--vc-tile-sky)", icon: <Drop size={22} variant="Bold" color="#0B2C4D" /> },
  { label: "quick_blood_pressure", path: "/log/bp", tint: "var(--vc-tile-peach)", icon: <Activity size={22} color="#0B2C4D" /> },
  { label: "quick_weight", path: "/log/weight", tint: "var(--vc-tile-lilac)", icon: <Weight size={22} color="#0B2C4D" /> },
  { label: "quick_meal_photo", path: "/meal-photos/new", tint: "var(--vc-tile-sage)", icon: <Camera size={22} color="#0B2C4D" /> },
  // BL-122: the + menu reaches the Pillbox (add a medicine from there), as in Flutter.
  { label: "pillbox", path: "/medications", tint: "var(--vc-tile-mint)", icon: <Health size={22} color="#0B2C4D" /> },
  { label: "quick_book_visit", path: "/book-visit", tint: "var(--vc-tile-sage)", icon: <CalendarTick size={22} color="#0B2C4D" /> },
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

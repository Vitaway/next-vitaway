"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Activity, Add, CalendarTick, Drop, Health, Heart, Home2, Messages2, User, Weight } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { cx } from "../ui/vita";

export const ROOT_TABS = ["/home", "/care", "/support", "/profile"] as const;

export function useAppPath(): string {
  const pathname = usePathname() ?? "/";
  const { basePath } = usePlusPaths();
  if (basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`))) {
    return pathname.slice(basePath.length) || "/";
  }
  return pathname;
}

type QuickAction = { label: string; path: string; tint: string; icon: React.ReactNode };

const QUICK_ACTIONS: QuickAction[] = [
  { label: "quick_blood_glucose", path: "/log/glucose", tint: "var(--vc-tile-sky)", icon: <Drop size={22} variant="Bold" color="#003E48" /> },
  { label: "quick_blood_pressure", path: "/log/bp", tint: "var(--vc-tile-peach)", icon: <Activity size={22} color="#003E48" /> },
  { label: "quick_weight", path: "/log/weight", tint: "var(--vc-tile-lilac)", icon: <Weight size={22} color="#003E48" /> },
  // BL-122: the + menu reaches the Pillbox (add a medicine from there), as in Flutter.
  { label: "pillbox", path: "/medications", tint: "var(--vc-tile-mint)", icon: <Health size={22} color="#003E48" /> },
  { label: "quick_book_visit", path: "/book-visit", tint: "var(--vc-tile-sage)", icon: <CalendarTick size={22} color="#003E48" /> },
];

export default function Dock({ supportBadge = false }: { supportBadge?: boolean }) {
  const t = useT();
  const path = useAppPath();
  const { push } = usePlusPaths();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [path]);

  const items = [
    { path: "/home", label: t("home_menu"), Icon: Home2 },
    { path: "/care", label: t("care_menu"), Icon: Heart },
    { path: "/support", label: t("support_menu"), Icon: Messages2 },
    { path: "/profile", label: t("account_menu"), Icon: User },
  ];

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
                <span className="disc" style={{ background: action.tint }}>
                  {action.icon}
                </span>
                <span className="tag">{t(action.label)}</span>
              </button>
            ))}
          </div>
        ) : null}
        <div className="vita-dock-row">
          <button
            type="button"
            className={cx("vita-log-btn", open && "open")}
            aria-label={open ? t("close") : t("quick_log_title")}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <Add size={30} color="currentColor" />
            )}
          </button>
          <div className="vita-dock">
            {items.map(({ path: itemPath, label, Icon }) => {
              const selected = path === itemPath || path.startsWith(`${itemPath}/`);
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
                    {itemPath === "/support" && supportBadge ? <i className="vita-dock-badge" /> : null}
                  </span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}

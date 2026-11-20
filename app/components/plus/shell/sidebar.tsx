"use client";

import { Calendar1, Home2, Messages2, Notification, Setting2, Timer1 } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { displayName, useMe, useNotifications } from "@/lib/plus/client/data";
import { Photo, cx } from "../ui/vita";
import { QUICK_ACTIONS, TAB_OWNERS, useAppPath, useMainTabs } from "./dock";

type NavItem = { path: string; label: string; Icon: typeof Home2; badge?: boolean; count?: number };

/** Which sidebar entry owns a nested screen, so the right item stays lit (e.g. /chat/12 → Support). */
const OWNERS: Array<[string, string]> = [
  ["/account", "/profile"],
  ["/programmes", "/profile"],
  ["/plans", "/profile"],
  ["/payment", "/profile"],
  ["/rewards", "/profile"],
  ["/chat", "/support"],
  ["/coaches", "/support"],
  ...TAB_OWNERS,
];

function matches(path: string, item: string): boolean {
  return path === item || path.startsWith(`${item}/`);
}

export function activeNavPath(path: string, items: string[]): string | null {
  const direct = items.filter((item) => matches(path, item)).sort((a, b) => b.length - a.length)[0];
  if (direct) return direct;
  const owner = OWNERS.find(([prefix]) => matches(path, prefix));
  return owner && items.includes(owner[1]) ? owner[1] : null;
}

/** Navigation rail from 640px (icon-only on tablet, labelled from 1024px). Hidden on phones in CSS. */
export default function Sidebar({ supportBadge = false }: { supportBadge?: boolean }) {
  const t = useT();
  const path = useAppPath();
  const { push } = usePlusPaths();
  const { user } = useMe();
  const { unread } = useNotifications();

  const main: NavItem[] = useMainTabs(supportBadge);
  const more: NavItem[] = [
    { path: "/support", label: t("nav_messages"), Icon: Messages2, badge: supportBadge },
    { path: "/appointments", label: t("appointments"), Icon: Calendar1 },
    { path: "/notifications", label: t("notifications"), Icon: Notification, count: unread },
    { path: "/reminders", label: t("reminders_title"), Icon: Timer1 },
    { path: "/settings", label: t("settings"), Icon: Setting2 },
  ];
  const all = [...main, ...more, ...QUICK_ACTIONS.map((a) => ({ path: a.path }))].map((i) => i.path);
  const active = activeNavPath(path, all);
  const name = displayName(user) || t("account_menu");

  const link = ({ path: itemPath, label, Icon, badge, count }: NavItem) => {
    const on = active === itemPath;
    return (
      <button
        key={itemPath}
        type="button"
        className={cx("vita-side-link", on && "on")}
        title={label}
        aria-label={label}
        aria-current={on ? "page" : undefined}
        onClick={() => push(itemPath)}
      >
        <span className="ic">
          <Icon size={20} color="currentColor" variant={on ? "Bold" : "Linear"} />
          {badge ? <i className="vita-dock-badge" /> : null}
        </span>
        <span className="tx">{label}</span>
        {count ? <span className="ct">{count > 9 ? "9+" : count}</span> : null}
      </button>
    );
  };

  return (
    <aside className="vita-sidebar" aria-label="Main">
      <button type="button" className="vita-side-brand" aria-label="Vitaway Plus home" onClick={() => push("/home")}>
        <span className="logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/plus-assets/vitaway-logo.png" alt="" />
        </span>
        <span className="name">
          Vitaway <b>Plus</b>
        </span>
      </button>

      <nav className="vita-side-scroll">
        <div className="vita-side-group">{main.map(link)}</div>

        <p className="vita-side-head">{t("quick_log_title")}</p>
        <div className="vita-side-quick">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.path}
              type="button"
              className={cx("vita-side-chip", active === action.path && "on")}
              onClick={() => push(action.path)}
              title={t(action.label)}
            >
              <span className="disc" style={{ background: action.tint }}>
                {action.icon}
              </span>
              <span className="tx">{t(action.label)}</span>
            </button>
          ))}
        </div>

        <p className="vita-side-head">{t("nav_more")}</p>
        <div className="vita-side-group">{more.map(link)}</div>
      </nav>

      <button type="button" className={cx("vita-side-me", active === "/profile" && "on")} title={t("my_profile")} aria-label={t("my_profile")} onClick={() => push("/profile")}>
        <span className="av">
          <Photo url={user?.profile?.profile_picture} size={36} />
        </span>
        <span className="who">
          <b>{name}</b>
          <small>{t("my_profile")}</small>
        </span>
      </button>
    </aside>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Add, ArrowDown2, Card, Crown1, LogoutCurve, Messages2, Notification, Profile, Setting2, Timer1 } from "@/lib/plus/icons";
import { useLanguage } from "@/lib/plus/i18n";
import { useTheme, type ThemeMode } from "@/lib/plus/theme";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { displayName, useMe, useNotifications } from "@/lib/plus/client/data";
import { useAccountActions } from "../account/shared";
import { Photo, cx } from "../ui/vita";
import { QUICK_ACTIONS, tabFor, useAppPath, useMainTabs } from "./dock";
import { quickLogKindFor, useOpenQuickLog } from "./quick-log";
import { Illu, NAV_ILLU } from "../ui/vita-icons";

/** Closes a popover on outside click, Escape and route change. */
function usePopover(path: string) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return { open, setOpen, ref };
}

/**
 * Tablet and desktop navigation (768px and up): a floating orange pill pinned to the top of the teal
 * header band, with the five Flutter tabs as text links, a white Log pill (same quick-log list as the
 * phone + dial), notifications and the account menu.
 * Phones keep the bottom dock; the bar is hidden there in CSS.
 */
export default function TopBar({ supportBadge = false }: { supportBadge?: boolean }) {
  const { t, language, setLanguage } = useLanguage();
  const theme = useTheme();
  const path = useAppPath();
  const { push } = usePlusPaths();
  const { user } = useMe();
  const { unread } = useNotifications();
  const { logout } = useAccountActions();
  const tabs = useMainTabs(supportBadge);
  const active = tabFor(path);
  const log = usePopover(path);
  const openQuickLog = useOpenQuickLog();
  const me = usePopover(path);
  const name = displayName(user) || t("account_menu");
  const email = (user as { email?: string | null } | null | undefined)?.email ?? "";

  const menu: Array<{ path: string; label: string; Icon: typeof Profile; dot?: boolean }> = [
    { path: "/profile", label: t("account_menu"), Icon: Profile },
    { path: "/support", label: t("nav_messages"), Icon: Messages2, dot: supportBadge },
    { path: "/plans", label: t("plans"), Icon: Crown1 },
    { path: "/account/payments", label: t("programme_payments"), Icon: Card },
    { path: "/reminders", label: t("reminders_title"), Icon: Timer1 },
    { path: "/settings", label: t("settings"), Icon: Setting2 },
  ];

  return (
    <header className="vita-topbar">
      <div className="vita-topbar-inner">
        <button type="button" className="vita-top-brand" aria-label="Vitaway Plus" onClick={() => push("/home")}>
          <span className="logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/plus-assets/vitaway-logo.png" alt="" />
          </span>
          <span className="name">
            Vitaway <b>Plus</b>
          </span>
        </button>

        <nav className="vita-top-nav" aria-label={t("topbar_main_nav")}>
          {tabs.map(({ path: tabPath, label, Icon, badge }) => {
            const on = active === tabPath;
            return (
              <button key={tabPath} type="button" className={cx("vita-top-link", on && "on")} aria-current={on ? "page" : undefined} onClick={() => push(tabPath)}>
                <span className="ic">
                  {NAV_ILLU[tabPath] ? <Illu name={NAV_ILLU[tabPath]} size={24} /> : <Icon size={20} color="currentColor" variant={on ? "Bold" : "Linear"} />}
                  {badge ? <i className="vita-dock-badge" /> : null}
                </span>
                <span className="tx">{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="vita-top-actions">
          <div className="vita-pop-anchor" ref={log.ref}>
            <button type="button" className="vita-top-log" aria-haspopup="menu" aria-expanded={log.open} onClick={() => log.setOpen((v) => !v)}>
              <Add size={22} color="currentColor" />
              <span>{t("quick_log_title")}</span>
            </button>
            {log.open ? (
              <div className="vita-pop vita-pop-log" role="menu" aria-label={t("topbar_log_menu")}>
                <p className="vita-pop-head">{t("topbar_log_menu")}</p>
                <div className="vita-pop-grid">
                  {QUICK_ACTIONS.map((action) => (
                    <button key={action.path} type="button" role="menuitem" className="vita-pop-tile" onClick={() => {
                      const kind = quickLogKindFor(action.path);
                      if (kind) {
                        log.setOpen(false);
                        openQuickLog(kind);
                      } else push(action.path);
                    }}>
                      <span className="disc" style={{ background: action.tint }}>
                        {action.icon}
                      </span>
                      <span className="tx">{t(action.label)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <button type="button" className={cx("vita-top-icon", path === "/notifications" && "on")} aria-label={t("notifications")} title={t("notifications")} onClick={() => push("/notifications")}>
            <Notification size={22} color="currentColor" variant={path === "/notifications" ? "Bold" : "Linear"} />
            {unread > 0 ? <span className="ct">{unread > 9 ? "9+" : unread}</span> : null}
          </button>

          <div className="vita-pop-anchor" ref={me.ref}>
            <button type="button" className="vita-top-me" aria-haspopup="menu" aria-expanded={me.open} aria-label={t("topbar_account_menu")} onClick={() => me.setOpen((v) => !v)}>
              <span className="av">
                <Photo url={user?.profile?.profile_picture} size={36} />
                {supportBadge ? <i className="vita-dock-badge" /> : null}
              </span>
              <span className="nm">{name}</span>
              <ArrowDown2 size={16} color="currentColor" />
            </button>
            {me.open ? (
              <div className="vita-pop vita-pop-me" role="menu" aria-label={t("topbar_account_menu")}>
                <div className="vita-pop-who">
                  <span className="av">
                    <Photo url={user?.profile?.profile_picture} size={44} />
                  </span>
                  <span className="who">
                    <b>{name}</b>
                    {email ? <small>{email}</small> : null}
                  </span>
                </div>
                {menu.map(({ path: itemPath, label, Icon, dot }) => (
                  <button key={itemPath} type="button" role="menuitem" className={cx("vita-pop-row", path === itemPath && "on")} onClick={() => push(itemPath)}>
                    <span className="ic">
                      <Icon size={20} color="currentColor" />
                      {dot ? <i className="vita-dock-badge" /> : null}
                    </span>
                    <span className="tx">{label}</span>
                  </button>
                ))}
                <div className="vita-pop-lang" role="group" aria-label={t("language")}>
                  <span>{t("language")}</span>
                  <span className="seg">
                    {(["en", "rw"] as const).map((code) => (
                      <button key={code} type="button" className={cx(language === code && "on")} aria-pressed={language === code} onClick={() => setLanguage(code)}>
                        {code === "en" ? "English" : "Kinyarwanda"}
                      </button>
                    ))}
                  </span>
                </div>
                <div className="vita-pop-lang next" role="group" aria-label={t("appearance")}>
                  <span>{t("appearance")}</span>
                  <span className="seg">
                    {(["light", "dark", "system"] as ThemeMode[]).map((mode) => (
                      <button key={mode} type="button" className={cx(theme.mode === mode && "on")} aria-pressed={theme.mode === mode} onClick={() => theme.setMode(mode)}>
                        {t(`theme_${mode}`)}
                      </button>
                    ))}
                  </span>
                </div>
                <button type="button" role="menuitem" className="vita-pop-row danger" onClick={() => { me.setOpen(false); void logout(); }}>
                  <span className="ic">
                    <LogoutCurve size={20} color="currentColor" />
                  </span>
                  <span className="tx">{t("logout_title")}</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

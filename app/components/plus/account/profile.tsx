"use client";

import { useState } from "react";
import { useLegal } from "../legal/legal-dialog";
import { ArrowRight3, Edit2 } from "@/lib/plus/icons";
import { Illu, ILLU_TINT, type IlluName } from "../ui/vita-icons";
import { useT, useLanguage, languageDisplayName } from "@/lib/plus/i18n";
import { useTheme } from "@/lib/plus/theme";
import { useInstall } from "@/lib/plus/install";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { useResource } from "@/lib/plus/client/use-resource";
import { mobileRequest } from "@/lib/plus/client/api";
import { badgesRemaining, fetchBadgeBoard, type BadgeBoard } from "@/lib/plus/badge-board";
import { AppBar, Modal, Page, Photo, useFeedback } from "../ui/vita";
import { useChatGate } from "../support/sheets";
import { AppearanceSegments, LanguageOptions, navyA, themeModeName, useAccountActions, useProfile } from "./shared";

type MenuItem = { illu: IlluName; label: string; subtitle?: string; trailing?: string | null; destructive?: boolean; onClick: () => void };

/** One titled group: a heading, then rows that each carry a Vitaway illustration on a soft tint. */
function Section({ title, items }: { title?: string; items: MenuItem[] }) {
  if (!items.length) return null;
  return (
    <section style={{ marginBottom: 18 }}>
      {title ? <h3 style={{ margin: "0 4px 8px", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: navyA(0.45) }}>{title}</h3> : null}
      <div style={{ background: "var(--vc-surface)", borderRadius: 16, overflow: "hidden", boxShadow: `0 1px 0 ${navyA(0.04)}` }}>
        {items.map((item, i) => (
          <div key={item.label}>
            {i > 0 ? <div style={{ height: 1, margin: "0 16px 0 72px", background: navyA(0.06) }} /> : null}
            <button type="button" onClick={item.onClick} className="vita-profile-row" style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "11px 14px", textAlign: "left", color: item.destructive ? "var(--vc-danger)" : "var(--vc-navy)" }}>
              <span style={{ width: 44, height: 44, borderRadius: 12, flex: "none", display: "grid", placeItems: "center", background: ILLU_TINT[item.illu] }}>
                <Illu name={item.illu} size={32} />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 15, fontWeight: 700 }}>{item.label}</span>
                {item.subtitle ? <span style={{ display: "block", marginTop: 2, fontSize: 13, fontWeight: 500, opacity: 0.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.subtitle}</span> : null}
              </span>
              {item.trailing ? <span style={{ flexShrink: 1, minWidth: 0, maxWidth: "42%", padding: "3px 10px", borderRadius: 999, background: navyA(0.06), fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.trailing}</span> : null}
              {!item.destructive ? <ArrowRight3 size={20} color="currentColor" style={{ opacity: 0.25, flex: "none" }} /> : null}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

/** account.dart ProfilePage. */
export function ProfileScreen() {
  const t = useT();
  const { openLegal } = useLegal();
  const { push } = usePlusPaths();
  const { toast, alert } = useFeedback();
  const installApp = useInstall();
  const { p } = useProfile();
  const { language } = useLanguage();
  const { mode } = useTheme();
  const { logout, deleteAccount } = useAccountActions();
  const gate = useChatGate();
  const [sheet, setSheet] = useState<null | "language" | "appearance">(null);
  // Same counts as Flutter account.dart: the badge board, with the /badges/ fallback.
  const badges = useResource<BadgeBoard>("badge-board", () => fetchBadgeBoard((path) => mobileRequest<unknown>(path)));
  const isPatient = p.type === "normal";
  const isCoach = p.type === "coach";
  const isDietitian = p.type === "dietitian";
  const name = [p.firstName, p.lastName].filter(Boolean).join(" ");
  const missing = t("no_mrn");
  const subtitle = isDietitian ? "Dietitian" : isPatient ? (p.mrn?.trim() ? `${t("mrn")}${p.mrn.trim()}` : missing === "no_mrn" ? "No MRN" : missing) : t("coach");
  const share = async () => {
    const text = t("share_app_text");
    try {
      if (navigator.share) await navigator.share({ text });
      else {
        await navigator.clipboard.writeText(text);
        toast("Copied");
      }
    } catch {
      /* cancelled */
    }
  };

  const account: MenuItem[] = [
    { illu: "profile", label: t("my_profile"), subtitle: t("edit_account_body"), onClick: () => push("/account/my-profile") },
    ...(isPatient ? [{ illu: "health-score" as IlluName, label: t("health_details"), subtitle: t("health_details_body"), onClick: () => push("/account/health-details") }] : []),
    { illu: "documents", label: t("my_documents"), onClick: () => push("/documents") },
    { illu: "payments", label: t("programme_payments"), onClick: () => push("/account/payments") },
  ];
  const care: MenuItem[] = isPatient
    ? [
        { illu: "appointments", label: t("my_appointments"), onClick: () => push("/appointments") },
        { illu: "learn", label: t("my_programmes"), subtitle: t("programmes_title"), onClick: () => push("/programmes/mine") },
        { illu: "pillbox", label: t("medications_title"), onClick: () => push("/medications") },
        { illu: "plan", label: t("plans_pricing_title"), onClick: () => push("/plans") },
      ]
    : [
        ...(isCoach
          ? [
              { illu: "reminders" as IlluName, label: t("my_availability"), onClick: () => push("/account/availability") },
              { illu: "food-reports" as IlluName, label: t("progress_notes_coach"), onClick: () => push("/notes") },
            ]
          : []),
        { illu: "messages", label: t("my_messages"), onClick: () => push("/support") },
      ];
  const rewards: MenuItem[] = isPatient
    ? [
        { illu: "rewards", label: t("rewards_title"), subtitle: t("rewards_menu_body"), onClick: () => push("/rewards") },
        { illu: "badge", label: t("badges_earned"), trailing: `${badges.data?.earnedCount ?? 0} · ${badges.data ? badgesRemaining(badges.data) : 0} ${t("badges_remaining")}`, onClick: () => push("/badges") },
        { illu: "community", label: t("community_handle"), subtitle: t("community_handle_body"), trailing: p.handle || null, onClick: () => void gate.ensureHandle(true) },
      ]
    : [];
  const prefs: MenuItem[] = [
    { illu: "language", label: t("language"), trailing: languageDisplayName(language), onClick: () => setSheet("language") },
    { illu: "appearance", label: t("appearance"), trailing: themeModeName(t, mode), onClick: () => setSheet("appearance") },
    { illu: "settings", label: t("settings_title"), onClick: () => push("/settings") },
    ...(installApp.available ? [{ illu: "install" as IlluName, label: t("install_app_button"), subtitle: t("install_menu_subtitle"), onClick: () => void installApp.install() }] : []),
  ];
  const help: MenuItem[] = [
    { illu: "messages", label: t("contact_us_title"), onClick: () => push("/account/contact") },
    { illu: "share", label: t("share_app"), onClick: () => void share() },
    { illu: "about", label: t("about_app"), onClick: () => push("/account/about") },
  ];
  const legal: MenuItem[] = [
    { illu: "privacy", label: t("privacy_policy"), onClick: () => openLegal("privacy") },
    { illu: "terms", label: t("terms_of_use"), onClick: () => openLegal("terms") },
    { illu: "disclaimer", label: t("medical_disclaimer"), onClick: () => void alert(t("medical_disclaimer"), t("medical_disclaimer_body")) },
  ];
  const session: MenuItem[] = [
    { illu: "logout", label: t("logout_title"), destructive: true, onClick: () => void logout() },
    { illu: "delete", label: t("delete_account"), destructive: true, onClick: () => void deleteAccount() },
  ];

  return (
    <Page backdrop width="wide">
      <AppBar title={t("account_menu")} back={false} />
      <div className="vita-scroll with-dock" style={{ padding: "4px 20px calc(env(safe-area-inset-bottom) + 104px)" }}>
        <div role="button" tabIndex={0} onClick={() => push("/account/my-profile")} onKeyDown={(e) => e.key === "Enter" && push("/account/my-profile")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 12px 14px 14px", borderRadius: 10, background: "var(--vc-surface)", cursor: "pointer" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", overflow: "hidden", flex: "none", background: "var(--vc-tile-mint)", border: "2px solid color-mix(in srgb, var(--vc-mint) 55%, transparent)" }}>
            <Photo url={p.photo} size={52} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--vc-ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name || t("account_menu")}</div>
            <div style={{ marginTop: 3, fontSize: 13, fontWeight: 500, color: navyA(0.5) }}>{subtitle}</div>
          </div>
          <button
            type="button"
            aria-label={t("edit_account")}
            onClick={(e) => {
              e.stopPropagation();
              push("/account/edit");
            }}
            style={{ width: 42, height: 42, borderRadius: "50%", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--vc-tile-mint)", color: "var(--vc-navy)" }}
          >
            <Edit2 size={20} color="currentColor" />
          </button>
        </div>
        <div style={{ height: 14 }} />
        <div className="vita-profile-menus">
          <div>
            <Section title={t("acct_sec_account")} items={account} />
            <Section title={isPatient ? t("acct_sec_care") : t("acct_sec_work")} items={care} />
            <Section title={t("acct_sec_rewards")} items={rewards} />
          </div>
          <div>
            <Section title={t("acct_sec_prefs")} items={prefs} />
            <Section title={t("acct_sec_help")} items={[...help, ...legal]} />
            <Section items={session} />
          </div>
        </div>
      </div>
      <Modal open={sheet === "language"} title={t("language")} onClose={() => setSheet(null)}>
        <LanguageOptions onPicked={() => setSheet(null)} />
      </Modal>
      <Modal open={sheet === "appearance"} title={t("appearance")} onClose={() => setSheet(null)}>
        <AppearanceSegments onPicked={() => setSheet(null)} />
      </Modal>
      {gate.element}
    </Page>
  );
}


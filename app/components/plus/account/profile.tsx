"use client";

import { useState } from "react";
import { useLegal } from "../legal/legal-dialog";
import {
  Activity,
  ArrowRight3,
  Calendar1,
  Clock,
  Crown1,
  Cup,
  DocumentText,
  Edit2,
  Export,
  FolderOpen,
  Health,
  InfoCircle,
  Logout,
  MessageQuestion,
  Mobile,
  Messages2,
  Moon,
  NoteText,
  ReceiptItem,
  Setting2,
  ShieldTick,
  Sun1,
  Translate,
  Trash,
  User,
  UserTag,
} from "iconsax-react";
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

type MenuItem = { icon: React.ReactNode; label: string; subtitle?: string; trailing?: string | null; destructive?: boolean; onClick: () => void };

function MenuCard({ items }: { items: MenuItem[] }) {
  return (
    <div style={{ background: "var(--vc-surface)", borderRadius: 10, overflow: "hidden" }}>
      {items.map((item, i) => {
        const color = item.destructive ? "var(--vc-danger)" : "var(--vc-navy)";
        return (
          <div key={item.label}>
            {i > 0 ? <div style={{ height: 1, margin: "0 16px 0 56px", background: navyA(0.06) }} /> : null}
            <button type="button" onClick={item.onClick} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", textAlign: "left", color }}>
              <span style={{ display: "inline-flex", flex: "none" }}>{item.icon}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 15, fontWeight: 600 }}>{item.label}</span>
                {item.subtitle ? <span style={{ display: "block", marginTop: 2, fontSize: 12, fontWeight: 500, opacity: 0.45, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.subtitle}</span> : null}
              </span>
              {item.trailing ? <span style={{ flexShrink: 1, minWidth: 0, maxWidth: "45%", fontSize: 12, fontWeight: 600, opacity: 0.42, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textAlign: "right" }}>{item.trailing}</span> : null}
              {!item.destructive ? <ArrowRight3 size={22} color="currentColor" style={{ opacity: 0.28, flex: "none" }} /> : null}
            </button>
          </div>
        );
      })}
    </div>
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
  const { mode, dark } = useTheme();
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
  const icon = (C: typeof User) => <C size={22} color="currentColor" />;

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

  const first: MenuItem[] = [
    { icon: icon(User), label: t("my_profile"), subtitle: t("edit_account_body"), onClick: () => push("/account/my-profile") },
    ...(isPatient ? [{ icon: icon(Activity), label: t("health_details"), subtitle: t("health_details_body"), onClick: () => push("/account/health-details") }] : []),
    { icon: icon(FolderOpen), label: t("my_documents"), onClick: () => push("/documents") },
    { icon: icon(ReceiptItem), label: "Payments", onClick: () => push("/account/payments") },
    ...(isPatient
      ? [
          { icon: icon(Cup), label: t("badges_earned"), trailing: `${badges.data?.earnedCount ?? 0} · ${badges.data ? badgesRemaining(badges.data) : 0} ${t("badges_remaining")}`, onClick: () => push("/badges") },
          { icon: icon(UserTag), label: t("community_handle"), subtitle: t("community_handle_body"), trailing: p.handle || null, onClick: () => void gate.ensureHandle(true) },
          { icon: icon(Calendar1), label: t("my_appointments"), onClick: () => push("/appointments") },
          { icon: icon(Crown1), label: t("plans_pricing_title"), onClick: () => push("/plans") },
          { icon: icon(Health), label: t("medications_title"), onClick: () => push("/medications") },
        ]
      : []),
    ...(isCoach
      ? [
          { icon: icon(Clock), label: t("my_availability"), onClick: () => push("/account/availability") },
          { icon: icon(NoteText), label: t("progress_notes_coach"), onClick: () => push("/notes") },
        ]
      : []),
    ...(!isPatient ? [{ icon: icon(Messages2), label: t("my_messages"), onClick: () => push("/support") }] : []),
    { icon: icon(Translate), label: t("language"), trailing: languageDisplayName(language), onClick: () => setSheet("language") },
    { icon: dark ? icon(Moon) : icon(Sun1), label: t("appearance"), trailing: themeModeName(t, mode), onClick: () => setSheet("appearance") },
    { icon: icon(Setting2), label: t("settings_title"), onClick: () => push("/settings") },
  ];
  const second: MenuItem[] = [
    ...(installApp.available
      ? [{ icon: icon(Mobile), label: t("install_app_button"), subtitle: t("install_menu_subtitle"), onClick: () => void installApp.install() }]
      : []),
    { icon: icon(MessageQuestion), label: t("contact_us_title"), onClick: () => push("/account/contact") },
    { icon: icon(Export), label: t("share_app"), onClick: () => void share() },
    { icon: icon(InfoCircle), label: t("about_app"), onClick: () => push("/account/about") },
    { icon: icon(ShieldTick), label: t("privacy_policy"), onClick: () => openLegal("privacy") },
    { icon: icon(DocumentText), label: t("terms_of_use"), onClick: () => openLegal("terms") },
    { icon: icon(Health), label: t("medical_disclaimer"), onClick: () => void alert(t("medical_disclaimer"), t("medical_disclaimer_body")) },
    { icon: icon(Trash), label: t("delete_account"), destructive: true, onClick: () => void deleteAccount() },
    { icon: icon(Logout), label: t("logout_title"), destructive: true, onClick: () => void logout() },
  ];

  return (
    <Page backdrop>
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
        <MenuCard items={first} />
        <div style={{ height: 12 }} />
        <MenuCard items={second} />
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


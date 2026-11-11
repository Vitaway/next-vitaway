"use client";

import { useEffect } from "react";
import { Copy, Flash, ImportCurve, Notification, Mobile } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { PLUS_ICON_192 } from "@/lib/plus/manifest";
import { useInstall, type InstallInfo } from "@/lib/plus/install";
import { ActionButton, cx, useFeedback } from "./ui/vita";

/* ───────── Glyphs that mirror Safari's own toolbar icons ───────── */

function ShareGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v12" />
      <path d="M8 7l4-4 4 4" />
      <path d="M8.5 10H6.5a1.5 1.5 0 0 0-1.5 1.5v8A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-8a1.5 1.5 0 0 0-1.5-1.5h-2" />
    </svg>
  );
}

function MoreGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

function AddSquareGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

function KebabGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  );
}

function CloseGlyph() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function AppIcon({ size = 64 }: { size?: number }) {
  return (
    <span className="vita-install-icon" style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={PLUS_ICON_192} alt="" width={size} height={size} />
    </span>
  );
}

function useEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onEscape();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onEscape]);
}

/* ───────── Install card (bottom sheet) ───────── */

function InstallCard() {
  const t = useT();
  const { cardOpen, info, canPrompt, install, dismiss } = useInstall();
  useEscape(cardOpen, dismiss);
  if (!cardOpen || !info) return null;

  const ios = info.platform === "ios-safari" || info.platform === "ios-other";
  const label = canPrompt ? t("install_app_button", undefined, "Install app") : ios ? t("install_add_home", undefined, "Add to Home Screen") : t("install_app_button", undefined, "Install app");

  return (
    <div className="vita-install-scrim" role="presentation" onClick={dismiss}>
      <div
        className="vita-install-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vita-install-title"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="vita-install-grip" aria-hidden />
        <button type="button" className="vita-install-close" aria-label={t("install_not_now", undefined, "Not now")} onClick={dismiss}>
          <CloseGlyph />
        </button>
        <div className="vita-install-head">
          <AppIcon />
          <div style={{ minWidth: 0 }}>
            <h2 id="vita-install-title" className="vita-install-title">Vitaway Plus</h2>
            <p className="vita-install-sub">{t("install_subtitle", undefined, "Free app · vitaway.org")}</p>
          </div>
        </div>
        <p className="vita-install-body">
          {t("install_benefit", undefined, "Open Vitaway in one tap from your home screen, full screen, with reminders and alerts like the mobile app.")}
        </p>
        <ul className="vita-install-perks">
          <li>
            <Flash size={16} color="currentColor" variant="Bold" />
            {t("install_perk_fast", undefined, "Opens fast")}
          </li>
          <li>
            <Mobile size={16} color="currentColor" variant="Bold" />
            {t("install_perk_full", undefined, "Full screen")}
          </li>
          <li>
            <Notification size={16} color="currentColor" variant="Bold" />
            {t("install_perk_alerts", undefined, "Alerts")}
          </li>
        </ul>
        <ActionButton full label={label} onClick={install} icon={<ImportCurve size={18} color="currentColor" />} />
        <button type="button" className="vita-install-later" onClick={dismiss}>
          {t("install_not_now", undefined, "Not now")}
        </button>
      </div>
    </div>
  );
}

/* ───────── Guide (iOS and browsers without one-tap install) ───────── */

type Step = { glyph: React.ReactNode; text: React.ReactNode };

function guideSteps(info: InstallInfo, t: ReturnType<typeof useT>): { title: string; intro?: string; steps: Step[]; note?: string } {
  const b = (text: string) => <strong>{text}</strong>;
  if (info.platform === "ios-safari") {
    const shareStep: Step = info.safariMoreMenu
      ? {
          glyph: <MoreGlyph />,
          text: (
            <>
              {t("install_ios26_step1_a", undefined, "Tap")} {b("•••")} {t("install_ios26_step1_b", undefined, "next to the address bar, then tap")} {b(t("install_share", undefined, "Share"))}.
            </>
          ),
        }
      : {
          glyph: <ShareGlyph />,
          text: (
            <>
              {t("install_ios_step1_a", undefined, "Tap the")} {b(t("install_share", undefined, "Share"))}{" "}
              {info.ipad ? t("install_ios_step1_ipad", undefined, "button at the top of Safari.") : t("install_ios_step1_b", undefined, "button in Safari's toolbar.")}
            </>
          ),
        };
    return {
      title: t("install_add_home", undefined, "Add to Home Screen"),
      steps: [
        shareStep,
        {
          glyph: <AddSquareGlyph />,
          text: (
            <>
              {t("install_ios_step2_a", undefined, "Scroll down and tap")} {b(t("install_add_home", undefined, "Add to Home Screen"))}.
            </>
          ),
        },
        {
          glyph: <span className="vita-install-addpill">{t("install_add", undefined, "Add")}</span>,
          text: info.safariMoreMenu ? (
            <>
              {t("install_ios26_step3_a", undefined, "Keep")} {b(t("install_open_web_app", undefined, "Open as Web App"))} {t("install_ios26_step3_b", undefined, "on, then tap")} {b(t("install_add", undefined, "Add"))}.
            </>
          ) : (
            <>
              {t("install_ios_step3_a", undefined, "Tap")} {b(t("install_add", undefined, "Add"))}. {t("install_ios_step3_b", undefined, "Vitaway appears on your Home Screen.")}
            </>
          ),
        },
      ],
      note: t("install_ios_note", undefined, "Don't see Add to Home Screen? Scroll to the bottom of the list and tap Edit Actions."),
    };
  }
  if (info.platform === "ios-other") {
    return {
      title: t("install_open_safari_title", undefined, "Open in Safari to install"),
      intro: info.inAppBrowser
        ? t("install_inapp_intro", undefined, "This page is open inside another app. Open it in Safari to add Vitaway Plus to your Home Screen.")
        : t("install_other_ios_intro", undefined, "iPhone and iPad add apps to the Home Screen from Safari."),
      steps: [
        {
          glyph: <Copy size={20} color="currentColor" />,
          text: <>{t("install_other_step1", undefined, "Copy the link below.")}</>,
        },
        {
          glyph: <ShareGlyph />,
          text: (
            <>
              {t("install_other_step2_a", undefined, "Open")} {b("Safari")}, {t("install_other_step2_b", undefined, "paste it in the address bar and go.")}
            </>
          ),
        },
        {
          glyph: <AddSquareGlyph />,
          text: (
            <>
              {t("install_other_step3_a", undefined, "Tap Share, then")} {b(t("install_add_home", undefined, "Add to Home Screen"))}.
            </>
          ),
        },
      ],
    };
  }
  if (info.platform === "android-menu") {
    return {
      title: t("install_app_button", undefined, "Install app"),
      steps: [
        { glyph: <KebabGlyph />, text: <>{t("install_android_step1", undefined, "Tap the ⋮ menu in your browser.")}</> },
        {
          glyph: <AddSquareGlyph />,
          text: (
            <>
              {t("install_android_step2_a", undefined, "Choose")} {b(t("install_app_button", undefined, "Install app"))} {t("install_or", undefined, "or")} {b(t("install_add_home", undefined, "Add to Home Screen"))}.
            </>
          ),
        },
      ],
      note: t("install_android_note", undefined, "For the best experience, open www.vitaway.org/app in Chrome."),
    };
  }
  return {
    title: t("install_app_button", undefined, "Install app"),
    steps: [
      {
        glyph: <ImportCurve size={20} color="currentColor" />,
        text: <>{t("install_desktop_step1", undefined, "In Chrome or Edge, click the install icon in the address bar, or open the browser menu and choose Install Vitaway Plus.")}</>,
      },
      {
        glyph: <ShareGlyph />,
        text: <>{t("install_desktop_step2", undefined, "In Safari on Mac, choose File › Add to Dock.")}</>,
      },
    ],
  };
}

function InstallGuide() {
  const t = useT();
  const { toast } = useFeedback();
  const { guideOpen, info, closeGuide } = useInstall();
  useEscape(guideOpen, closeGuide);
  if (!guideOpen || !info) return null;

  const guide = guideSteps(info, t);
  const ios = info.platform === "ios-safari";
  // Point at where Safari keeps Share: top right on iPad, ••• at the bottom right on iOS 26, toolbar centre before.
  const pointer = ios ? (info.ipad ? "top" : info.safariMoreMenu ? "bottom-right" : "bottom-center") : null;

  const copyLink = async () => {
    const url = window.location.origin + (window.location.pathname.startsWith("/app") ? "/app" : "/");
    try {
      await navigator.clipboard.writeText(url);
      toast(t("install_link_copied", undefined, "Link copied. Paste it in Safari."));
    } catch {
      window.prompt(t("install_copy_link", undefined, "Copy link"), url);
    }
  };

  return (
    <div className="vita-install-scrim" role="presentation" onClick={closeGuide}>
      <div
        className="vita-install-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vita-install-guide-title"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="vita-install-grip" aria-hidden />
        <button type="button" className="vita-install-close" aria-label={t("close", undefined, "Close")} onClick={closeGuide}>
          <CloseGlyph />
        </button>
        <div className="vita-install-head">
          <AppIcon size={52} />
          <div style={{ minWidth: 0 }}>
            <h2 id="vita-install-guide-title" className="vita-install-title">{guide.title}</h2>
            <p className="vita-install-sub">Vitaway Plus</p>
          </div>
        </div>
        {guide.intro ? <p className="vita-install-body">{guide.intro}</p> : null}
        <ol className="vita-install-steps">
          {guide.steps.map((step, index) => (
            <li key={index}>
              <span className="vita-install-step-no">{index + 1}</span>
              <span className="vita-install-step-glyph">{step.glyph}</span>
              <span className="vita-install-step-text">{step.text}</span>
            </li>
          ))}
        </ol>
        {guide.note ? <p className="vita-install-note">{guide.note}</p> : null}
        {info.platform === "ios-other" ? (
          <ActionButton full label={t("install_copy_link", undefined, "Copy link")} onClick={copyLink} icon={<Copy size={18} color="currentColor" />} />
        ) : (
          <ActionButton full tone="teal" label={t("install_got_it", undefined, "Got it")} onClick={closeGuide} />
        )}
        {pointer && pointer !== "top" ? <Pointer where={pointer} /> : null}
      </div>
      {pointer === "top" ? <Pointer where="top" /> : null}
    </div>
  );
}

function Pointer({ where }: { where: "top" | "bottom-right" | "bottom-center" }) {
  return (
    <div className={cx("vita-install-pointer", where)} aria-hidden>
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4v15M6 13l6 6 6-6" />
      </svg>
    </div>
  );
}

export default function InstallPrompt() {
  return (
    <>
      <InstallCard />
      <InstallGuide />
    </>
  );
}

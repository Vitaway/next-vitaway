"use client";

/**
 * Web footer (768px and up; hidden on phones, which use the app's bottom tab bar).
 * Teal band with rounded top corners to mirror the header: links to the real mobile app in the
 * App Store and Google Play (same URLs as the marketing site's store buttons), the legal pages,
 * and "Built by Keyypress" bottom right.
 */
import { APP_STORE_URL, PLAY_STORE_URL } from "@/app/components/buttons/store-buttons";
import { useT } from "@/lib/plus/i18n";
import { useLegal } from "../legal/legal-dialog";
import { usePlusPaths } from "@/lib/plus/plus-paths";

export default function WebFooter() {
  const t = useT();
  const { openLegal } = useLegal();
  const { push } = usePlusPaths();
  const year = new Date().getFullYear();
  return (
    <footer className="vita-webfoot">
      <div className="vita-webfoot-inner">
        <div className="vita-webfoot-top">
          <div className="brand">
            <span className="logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/plus-assets/vitaway-logo.png" alt="" />
            </span>
            <span className="name">
              Vitaway <b>Plus</b>
            </span>
          </div>
          <div className="app">
            <p className="ttl">{t("foot_get_app")}</p>
            <p className="sub">{t("foot_get_app_body")}</p>
            <div className="stores">
              <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Download on the App Store">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/badges/app-store.svg" alt="Download on the App Store" height={44} />
              </a>
              <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Get it on Google Play">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/badges/google-play.svg" alt="Get it on Google Play" height={44} />
              </a>
            </div>
          </div>
        </div>
        <div className="vita-webfoot-bottom">
          <span>
            © {year} Vitaway. {t("foot_rights")}
          </span>
          <nav className="links" aria-label="Legal">
            <button type="button" onClick={() => openLegal("privacy")}>{t("privacy_policy")}</button>
            <button type="button" onClick={() => openLegal("terms")}>{t("terms_of_use")}</button>
            <button type="button" onClick={() => push("/account/contact")}>{t("contact_us_title")}</button>
          </nav>
          <a className="built" href="https://keyypress.com" target="_blank" rel="noopener noreferrer">
            {t("foot_built_by")} <b>Keyypress</b>
          </a>
        </div>
      </div>
    </footer>
  );
}

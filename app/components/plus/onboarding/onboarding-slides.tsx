"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight3, MdCheck, TickCircle } from "@/lib/plus/icons";
import { useLanguage, type AppLanguageCode } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";

const ART = "/plus-assets/onboarding";

/** Each step: illustration, two floating "app" chips over it, then the copy and three short points. */
const STEPS = [
  { image: "welcome.png", chips: ["onb_chip_hello", "onb_chip_muraho"] },
  { image: "intro.png", title: "onboarding1", subtitle: "onboarding1_subtitle", chips: ["onb_chip_bp", "onb_chip_streak"], points: ["onb1_p1", "onb1_p2", "onb1_p3"] },
  { image: "conditions.png", title: "onboarding2", subtitle: "onboarding2_subtitle", chips: ["onb_chip_week", "onb_chip_quiz"], points: ["onb2_p1", "onb2_p2", "onb2_p3"] },
  { image: "about.png", title: "onboarding3", subtitle: "onboarding3_subtitle", chips: ["onb_chip_nurse", "onb_chip_visit"], points: ["onb3_p1", "onb3_p2", "onb3_p3"] },
] as const;

/** Some older titles carry a line break for the phone app; the layout wraps on its own. */
const oneLine = (s: string) => s.replace(/\s*\n\s*/g, " ");

function LanguageButton({ code, text, greeting, image }: { code: AppLanguageCode; text: string; greeting: string; image: string }) {
  const { language, setLanguage } = useLanguage();
  const on = language === code;
  return (
    <button type="button" className={on ? "ob-lang on" : "ob-lang"} onClick={() => setLanguage(code)} aria-pressed={on}>
      <span className="ob-flag" style={{ backgroundImage: `url(${ART}/${image})` }} />
      <span className="ob-lang-tx">
        <b>{text}</b>
        <small>{greeting}</small>
      </span>
      <span className="ob-lang-tick">{on ? <MdCheck size={15} color="currentColor" /> : null}</span>
    </button>
  );
}

/** Welcome: language first, then what the app does, then sign in or create an account. */
export default function OnboardingSlides() {
  const { t } = useLanguage();
  const { push } = usePlusPaths();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const startX = useRef<number | null>(null);
  const count = STEPS.length;
  const last = index === count - 1;
  const step = STEPS[index];

  const goTo = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(count - 1, i));
      setDir(next >= index ? 1 : -1);
      setIndex(next);
    },
    [count, index],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, index]);

  // Swipe left / right on phones.
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") startX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 50) goTo(index + (dx < 0 ? 1 : -1));
  };

  return (
    <div className="ob vita-fullbleed" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
      <div className="ob-frame">
        {/* Brand panel: logo, the illustration on a stage, two floating chips. */}
        <aside className={`ob-art ob-art-${index}`} aria-hidden>
          <div className="ob-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/plus-assets/logo.png" alt="" />
            <span>
              Vitaway <em>Plus</em>
            </span>
          </div>
          <div className="ob-stage" key={`art-${index}`} data-dir={dir}>
            <span className="ob-ring" />
            <span className="ob-disc" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ob-illu" src={`${ART}/${step.image}`} alt="" />
            <span className="ob-chip a">
              <TickCircle size={16} variant="Bold" color="currentColor" />
              {t(step.chips[0])}
            </span>
            <span className="ob-chip b">
              <i />
              {t(step.chips[1])}
            </span>
          </div>
          <p className="ob-tag">{t("onb_tagline")}</p>
        </aside>

        {/* Content panel */}
        <main className="ob-panel">
          <div className="ob-top">
            <span className="ob-step">{t("onb_step", { n: index + 1, total: count })}</span>
            {last ? null : (
              <button type="button" className="ob-skip" onClick={() => push("/signin")}>
                {t("onb_skip")}
              </button>
            )}
          </div>

          <div className="ob-body" key={`tx-${index}`} data-dir={dir}>
            {index === 0 ? (
              <>
                <span className="ob-kicker">{t("onb_kicker_0")}</span>
                <h1 className="ob-title">{t("welcome")}</h1>
                <p className="ob-sub">{t("select_language")}</p>
                <div className="ob-langs">
                  <LanguageButton code="en" text="English" greeting="Hello" image="english.png" />
                  <LanguageButton code="rw" text="Ikinyarwanda" greeting="Muraho" image="kinyarwanda.png" />
                </div>
              </>
            ) : (
              <>
                <span className="ob-kicker">{t(`onb_kicker_${index}`)}</span>
                <h1 className="ob-title">{oneLine(t("title" in step ? step.title : "welcome"))}</h1>
                <p className="ob-sub">{"subtitle" in step ? t(step.subtitle) : null}</p>
                <ul className="ob-points">
                  {("points" in step ? step.points : []).map((k, i) => (
                    <li key={k} style={{ animationDelay: `${120 + i * 70}ms` }}>
                      <span className="ob-point-ic">
                        <MdCheck size={14} color="currentColor" />
                      </span>
                      {t(k)}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="ob-foot">
            <div className="ob-progress" role="tablist" aria-label={t("onb_progress")}>
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={t("onb_step", { n: i + 1, total: count })}
                  className={i < index ? "done" : i === index ? "on" : ""}
                  onClick={() => goTo(i)}
                >
                  <i />
                </button>
              ))}
            </div>
            {last ? (
              <div className="ob-actions">
                <button type="button" className="ob-btn primary" onClick={() => push("/register")}>
                  {t("get_started")} <ArrowRight3 size={18} color="currentColor" />
                </button>
                <button type="button" className="ob-btn ghost" onClick={() => push("/signin")}>
                  {t("have_account")} <b>{t("sign_in")}</b>
                </button>
              </div>
            ) : (
              <div className="ob-actions row">
                {index > 0 ? (
                  <button type="button" className="ob-btn back" aria-label={t("onb_back")} onClick={() => goTo(index - 1)}>
                    <ArrowLeft size={20} color="currentColor" />
                  </button>
                ) : null}
                <button type="button" className="ob-btn primary" onClick={() => goTo(index + 1)}>
                  {t("continue")} <ArrowRight3 size={18} color="currentColor" />
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

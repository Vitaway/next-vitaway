"use client";

import { useEffect, useRef, useState } from "react";
import { MdCheck } from "react-icons/md";
import { useLanguage, type AppLanguageCode } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { ActionButton } from "../ui/vita";

const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;
const ART = "/plus-assets/onboarding";

const SLIDES = [
  { image: "intro.png", title: "onboarding1", subtitle: "onboarding1_subtitle" },
  { image: "conditions.png", title: "onboarding2", subtitle: "onboarding2_subtitle" },
  { image: "about.png", title: "onboarding3", subtitle: "onboarding3_subtitle" },
];

function Hero({ image }: { image: string }) {
  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="vita-onb-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ART}/${image}`} alt="" />
      </div>
    </div>
  );
}

function SlideText({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="vita-fade-up" style={{ textAlign: "center", paddingBottom: 22 }}>
      <h1 style={{ margin: 0, fontWeight: 800, fontSize: 30, lineHeight: 1.15, letterSpacing: -0.7, color: "var(--vc-navy)" }}>{title}</h1>
      <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.4, color: navyA(0.55) }}>{subtitle}</p>
    </div>
  );
}

function LanguageButton({ code, text, greeting, image }: { code: AppLanguageCode; text: string; greeting: string; image: string }) {
  const { language, setLanguage } = useLanguage();
  const on = language === code;
  return (
    <button type="button" className={on ? "vita-lang-btn on" : "vita-lang-btn"} onClick={() => setLanguage(code)} aria-pressed={on}>
      <span className="flag" style={{ backgroundImage: `url(${ART}/${image})` }} />
      <span style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
        <span style={{ display: "block", fontSize: 16, lineHeight: 1.2, fontWeight: 700, color: on ? "#fff" : "var(--vc-navy)" }}>{text}</span>
        <span style={{ display: "block", marginTop: 2, fontSize: 13, color: on ? "rgba(255,255,255,0.7)" : navyA(0.45) }}>{greeting}</span>
      </span>
      <span className="tick">{on ? <MdCheck size={16} color="#003e48" /> : null}</span>
    </button>
  );
}

/** Pages/onboarding/onboarding_page.dart: language picker + three slides, then Login. */
export default function OnboardingSlides() {
  const { t } = useLanguage();
  const { push } = usePlusPaths();
  const track = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const count = SLIDES.length + 1;
  const last = index === count - 1;

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => setIndex(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
    setIndex(i);
  };

  const onContinue = () => {
    if (last) push("/signin");
    else goTo(index + 1);
  };

  return (
    <div className="vita-onb">
      <div className="vita-onb-track" ref={track}>
        <section className="vita-onb-slide">
          <Hero image="welcome.png" />
          <div className="vita-fade-up" style={{ textAlign: "center" }}>
            <h1 style={{ margin: 0, fontWeight: 800, fontSize: 30, lineHeight: 1.15, letterSpacing: -0.7, color: "var(--vc-navy)" }}>{t("welcome")}</h1>
            <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.4, color: navyA(0.55) }}>{t("select_language")}</p>
            <div style={{ height: 22 }} />
            <LanguageButton code="en" text="English" greeting="Hello" image="english.png" />
            <div style={{ height: 10 }} />
            <LanguageButton code="rw" text="Ikinyarwanda" greeting="Muraho" image="kinyarwanda.png" />
          </div>
        </section>
        {SLIDES.map((slide) => (
          <section key={slide.image} className="vita-onb-slide">
            <Hero image={slide.image} />
            <SlideText title={t(slide.title)} subtitle={t(slide.subtitle)} />
          </section>
        ))}
      </div>
      <div style={{ padding: "6px 24px calc(10px + env(safe-area-inset-bottom))", background: "var(--vc-surface)" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 6 }} role="tablist" aria-label="Onboarding">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              aria-current={i === index ? "step" : undefined}
              onClick={() => goTo(i)}
              className="vita-onb-dot"
              style={{ width: i === index ? 22 : 7, background: i === index ? "var(--vc-navy)" : navyA(0.16) }}
            />
          ))}
        </div>
        <div style={{ height: 16 }} />
        <ActionButton full tone="teal" label={t("continue")} onClick={onContinue} />
      </div>
    </div>
  );
}

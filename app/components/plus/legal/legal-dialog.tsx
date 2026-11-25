"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { MdClose } from "@/lib/plus/icons";
import { useT } from "@/lib/plus/i18n";
import { ActionButton, CenterSpinner, RootPortal } from "../ui/vita";
import { Illu } from "../ui/vita-icons";
import { Markdown, markdownSections, splitMarkdownTitle } from "./markdown";

export type LegalDoc = "privacy" | "terms";

const FILES: Record<LegalDoc, string> = {
  privacy: "/plus-assets/legal/privacy_policy.md",
  terms: "/plus-assets/legal/terms_and_conditions.md",
};

const cache: Partial<Record<LegalDoc, string>> = {};

type LegalValue = { openLegal: (doc: LegalDoc) => void };
const LegalContext = createContext<LegalValue | null>(null);

/** PrivacyPolicyDialog / TermsDialog: the bundled Markdown in a wide modal with a teal Close button. */
export function LegalProvider({ children }: { children: React.ReactNode }) {
  const t = useT();
  const [doc, setDoc] = useState<LegalDoc | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  const openLegal = useCallback((next: LegalDoc) => {
    setDoc(next);
    setFailed(false);
    const cached = cache[next];
    if (cached) {
      setText(cached);
      return;
    }
    setText(null);
    fetch(FILES[next])
      .then((res) => (res.ok ? res.text() : Promise.reject(new Error(String(res.status)))))
      .then((body) => {
        cache[next] = body;
        setText(body);
      })
      .catch(() => setFailed(true));
  }, []);

  const value = useMemo(() => ({ openLegal }), [openLegal]);
  const fallback = doc === "terms" ? t("terms_of_use") : t("privacy_policy");
  const document = text ? splitMarkdownTitle(text, fallback) : null;
  const sections = useMemo(() => (document ? markdownSections(document.body) : []), [document]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const jump = (i: number) => {
    const el = bodyRef.current?.querySelector<HTMLElement>(`[data-sec="${i}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  useEffect(() => {
    if (doc === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDoc(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doc]);

  return (
    <LegalContext.Provider value={value}>
      {children}
      {doc !== null ? (
        <RootPortal>
          <div className="vita-legal-scrim" onClick={() => setDoc(null)} role="presentation">
            <div className="vita-legal" role="dialog" aria-modal="true" aria-label={document?.title ?? fallback} onClick={(e) => e.stopPropagation()}>
              <header className="vita-legal-head">
                <div className="vita-legal-badge">
                  <Illu name={doc === "terms" ? "terms" : "privacy"} size={36} />
                </div>
                <div className="vita-legal-titles">
                  <span className="vita-legal-eyebrow">{doc === "terms" ? "Terms of service" : "Privacy"}</span>
                  <h2>{document?.title ?? fallback}</h2>
                </div>
                <button type="button" className="vita-legal-x" aria-label="Close" onClick={() => setDoc(null)}>
                  <MdClose size={18} />
                </button>
              </header>
              <div className="vita-legal-main">
                {sections.length > 1 ? (
                  <nav className="vita-legal-toc" aria-label="Sections">
                    <span className="vita-legal-toc-title">In this document</span>
                    {sections.map((name, i) => (
                      <button key={i} type="button" onClick={() => jump(i)}>
                        {name}
                      </button>
                    ))}
                  </nav>
                ) : null}
                <div className="vita-legal-body" ref={bodyRef}>
                  {failed ? (
                    <p style={{ margin: 0, color: "var(--vc-danger)", fontSize: 14 }}>{t("network_error")}</p>
                  ) : document ? (
                    <Markdown source={document.body} />
                  ) : (
                    <CenterSpinner />
                  )}
                </div>
              </div>
              <footer className="vita-legal-foot">
                <ActionButton label="Close" tone="teal" small icon={<MdClose size={16} />} onClick={() => setDoc(null)} />
              </footer>
            </div>
          </div>
        </RootPortal>
      ) : null}
    </LegalContext.Provider>
  );
}

export function useLegal(): LegalValue {
  const value = useContext(LegalContext);
  if (!value) throw new Error("useLegal must be used within LegalProvider");
  return value;
}

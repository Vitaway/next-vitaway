"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { MdClose } from "react-icons/md";
import { useT } from "@/lib/plus/i18n";
import { ActionButton, CenterSpinner, Modal } from "../ui/vita";
import { Markdown, splitMarkdownTitle } from "./markdown";

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

  return (
    <LegalContext.Provider value={value}>
      {children}
      <Modal
        open={doc !== null}
        title={document?.title ?? fallback}
        onClose={() => setDoc(null)}
        actions={<ActionButton label="Close" tone="teal" small icon={<MdClose size={16} />} onClick={() => setDoc(null)} />}
      >
        {failed ? (
          <p style={{ margin: 0, color: "var(--vc-danger)", fontSize: 14 }}>{t("network_error")}</p>
        ) : document ? (
          <Markdown source={document.body} />
        ) : (
          <CenterSpinner />
        )}
      </Modal>
    </LegalContext.Provider>
  );
}

export function useLegal(): LegalValue {
  const value = useContext(LegalContext);
  if (!value) throw new Error("useLegal must be used within LegalProvider");
  return value;
}

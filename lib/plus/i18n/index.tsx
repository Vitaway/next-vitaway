"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import en from "./en.json";
import rw from "./rw.json";

export type AppLanguageCode = "en" | "rw";

const TABLES: Record<AppLanguageCode, Record<string, string>> = {
  en: en as Record<string, string>,
  rw: rw as Record<string, string>,
};

const LANGUAGE_KEY = "vitaway.plus.language";

export type Translate = (key: string, vars?: Record<string, string | number>, fallback?: string) => string;

type LanguageValue = {
  language: AppLanguageCode;
  setLanguage: (code: AppLanguageCode) => void;
  t: Translate;
};

function fill(text: string, vars?: Record<string, string | number>): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match,
  );
}

export function translateFor(language: AppLanguageCode): Translate {
  const table = TABLES[language] ?? TABLES.en;
  return (key, vars, fallback) => fill(table[key] ?? TABLES.en[key] ?? fallback ?? key, vars);
}

const LanguageContext = createContext<LanguageValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguageCode>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(LANGUAGE_KEY);
    if (saved === "en" || saved === "rw") setLanguageState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "rw" ? "rw" : "en";
  }, [language]);

  const setLanguage = useCallback((code: AppLanguageCode) => {
    window.localStorage.setItem(LANGUAGE_KEY, code);
    setLanguageState(code);
  }, []);

  const t = useMemo(() => translateFor(language), [language]);
  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageValue {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used within LanguageProvider");
  return value;
}

export function useT(): Translate {
  return useLanguage().t;
}

export function languageDisplayName(code: AppLanguageCode): string {
  return code === "rw" ? "Ikinyarwanda" : "English";
}

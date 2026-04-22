"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { I18nKey, LocaleKey } from "@/lib/i18n";
import { t as translate } from "@/lib/i18n";

type I18nContextValue = {
  locale: LocaleKey;
  setLocale: (locale: LocaleKey) => void;
  t: (key: I18nKey) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLocale(): LocaleKey {
  if (typeof window === "undefined") return "en";
  const raw = window.localStorage.getItem("locale");
  if (raw === "zh" || raw === "en") return raw;
  return "en";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleKey>("en");

  useEffect(() => {
    setLocaleState(readStoredLocale());
  }, []);

  const setLocale = useCallback((next: LocaleKey) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("locale", next);
      window.dispatchEvent(new CustomEvent("locale-change", { detail: next }));
    }
  }, []);

  useEffect(() => {
    const onLocaleChange = (e: Event) => {
      const next = (e as CustomEvent).detail as LocaleKey | undefined;
      if (next === "zh" || next === "en") setLocaleState(next);
    };
    window.addEventListener("locale-change", onLocaleChange as any);
    return () => window.removeEventListener("locale-change", onLocaleChange as any);
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    return {
      locale,
      setLocale,
      t: (key) => translate(locale, key),
    };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}


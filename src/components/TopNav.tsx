"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/I18nProvider";
import type { LocaleKey } from "@/lib/i18n";

const LOCALE_OPTIONS: Array<{ key: LocaleKey; label: string }> = [
  { key: "zh", label: "ZH" },
  { key: "en", label: "EN" },
];

export default function TopNav() {
  const { locale, setLocale, t } = useI18n();
  const [isLocaleOpen, setIsLocaleOpen] = useState(false);
  const localeRef = useRef<HTMLDivElement>(null);

  const [stars, setStars] = useState<number | null>(null);
  const [isStarsLoading, setIsStarsLoading] = useState(false);

  const localeLabel = useMemo(
    () => LOCALE_OPTIONS.find((o) => o.key === locale)?.label || "EN",
    [locale]
  );

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!localeRef.current) return;
      if (!localeRef.current.contains(e.target as Node)) setIsLocaleOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsStarsLoading(true);
      try {
        const res = await fetch("/api/github/stars", { cache: "no-store" });
        const json = await res.json();
        const value = typeof json?.stars === "number" ? json.stars : null;
        if (!isMounted) return;
        setStars(value);
      } finally {
        if (isMounted) setIsStarsLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative" ref={localeRef}>
            <button
              type="button"
              onClick={() => setIsLocaleOpen((v) => !v)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50 text-sm font-medium"
            >
              <span className="tracking-wider">{localeLabel}</span>
              <ChevronDown
                size={14}
                className={cn("text-gray-400 transition-transform", isLocaleOpen && "rotate-180")}
              />
            </button>
            {isLocaleOpen && (
              <div className="absolute left-0 mt-2 w-24 rounded-md border bg-white shadow-xl overflow-hidden">
                {LOCALE_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      setLocale(opt.key);
                      setIsLocaleOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm hover:bg-gray-50",
                      opt.key === locale && "bg-gray-50 font-semibold"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link href="/" className="text-sm font-semibold text-gray-900">
            {t("appName")}
          </Link>
        </div>

        <a
          href="https://github.com/ClancyAyres/Aura"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50 text-sm font-medium"
        >
          <Github size={16} className="text-gray-700" />
          <span>{t("star")}</span>
          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs tabular-nums">
            {isStarsLoading ? "…" : stars ?? "—"}
          </span>
        </a>
      </div>
    </header>
  );
}


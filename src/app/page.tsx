"use client";

import { useI18n } from "@/components/I18nProvider";

export default function Home() {
  const { t } = useI18n();
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold">Welcome to AI Resume Generator</h1>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/admin"
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              {t("quickStart")}
            </a>
            <a
              href="/edit"
              className="inline-flex items-center justify-center px-4 py-2 rounded-md border text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t("openEditor")}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a href="/edit" className="group rounded-lg border px-5 py-4 hover:bg-gray-50 transition-colors">
            <h2 className="mb-2 text-xl font-semibold">
              {t("import")}{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1">-&gt;</span>
            </h2>
            <p className="m-0 text-sm text-gray-500">{t("importDesc")}</p>
          </a>

          <a href="/admin/optimize" className="group rounded-lg border px-5 py-4 hover:bg-gray-50 transition-colors">
            <h2 className="mb-2 text-xl font-semibold">
              {t("optimize")}{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1">-&gt;</span>
            </h2>
            <p className="m-0 text-sm text-gray-500">{t("optimizeDesc")}</p>
          </a>

          <a href="/admin/jd-match" className="group rounded-lg border px-5 py-4 hover:bg-gray-50 transition-colors">
            <h2 className="mb-2 text-xl font-semibold">
              {t("jdMatch")}{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1">-&gt;</span>
            </h2>
            <p className="m-0 text-sm text-gray-500">{t("jdMatchDesc")}</p>
          </a>

          <a href="/edit" className="group rounded-lg border px-5 py-4 hover:bg-gray-50 transition-colors">
            <h2 className="mb-2 text-xl font-semibold">
              {t("export")}{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1">-&gt;</span>
            </h2>
            <p className="m-0 text-sm text-gray-500">{t("exportDesc")}</p>
          </a>
        </div>
      </div>
    </main>
  );
}

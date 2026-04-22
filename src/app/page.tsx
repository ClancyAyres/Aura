"use client";

import { useI18n } from "@/components/I18nProvider";

export default function Home() {
  const { t } = useI18n();
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="mx-auto max-w-6xl px-6 min-h-[58vh] flex items-center">
        <div className="mx-auto max-w-3xl w-full text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-900">
            {t("homeTitle")}
          </h1>
          <p className="mt-4 text-lg text-gray-600">{t("homeSubtitle")}</p>
          <div className="mt-10 flex items-center justify-between gap-4 mx-auto max-w-md">
            <a
              href="/edit"
              className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              {t("quickStart")}
            </a>
            <a
              href="/admin/templates"
              className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-lg border bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t("resumeManagement")}
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
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
      </section>
    </main>
  );
}

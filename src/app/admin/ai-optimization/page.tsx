"use client";

import { useI18n } from "@/components/I18nProvider";

export default function AiOptimizationPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">{t("aiOptimization")}</h1>
        <p className="text-sm text-gray-500">{t("aiOptimization")} · {t("admin")}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <a href="/admin/optimize" className="rounded-lg border p-4 hover:bg-gray-50 transition-colors">
          <div className="font-semibold">{t("optimize")}</div>
          <div className="text-sm text-gray-500">{t("optimizeDesc")}</div>
        </a>
        <a href="/admin/jd-match" className="rounded-lg border p-4 hover:bg-gray-50 transition-colors">
          <div className="font-semibold">{t("jdMatch")}</div>
          <div className="text-sm text-gray-500">{t("jdMatchDesc")}</div>
        </a>
      </div>
    </div>
  );
}


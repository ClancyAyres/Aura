"use client";

import { useI18n } from "@/components/I18nProvider";

export default function JdMatchPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">{t("jdMatch")}</h1>
        <p className="text-sm text-gray-500">{t("jdMatchDesc")}</p>
      </div>

      <div className="rounded-lg border p-4 text-sm text-gray-600">
        {t("jdMatch")}
      </div>
    </div>
  );
}


"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";

export default function AdminHome() {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">{t("admin")}</h1>
        <p className="text-sm text-gray-500">
          {t("myResumes")} / {t("templateGallery")} / {t("aiProvider")} / {t("settings")} / {t("aiOptimization")}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/admin/optimize" className="rounded-lg border p-4 hover:bg-gray-50 transition-colors">
          <div className="font-semibold">{t("optimize")}</div>
          <div className="text-sm text-gray-500">{t("optimizeDesc")}</div>
        </Link>
        <Link href="/admin/jd-match" className="rounded-lg border p-4 hover:bg-gray-50 transition-colors">
          <div className="font-semibold">{t("jdMatch")}</div>
          <div className="text-sm text-gray-500">{t("jdMatchDesc")}</div>
        </Link>
      </div>
    </div>
  );
}


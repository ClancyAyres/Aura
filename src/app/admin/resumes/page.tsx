"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";

export default function MyResumesPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">{t("myResumes")}</h1>
        <p className="text-sm text-gray-500">{t("myResumes")} · {t("admin")}</p>
      </div>

      <div className="rounded-lg border p-4">
        <div className="text-sm text-gray-600">0</div>
        <div className="mt-3 flex gap-3">
          <Link
            href="/edit"
            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            {t("openEditor")}
          </Link>
        </div>
      </div>
    </div>
  );
}


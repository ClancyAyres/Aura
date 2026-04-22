"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";

export default function TemplateGalleryPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">{t("templateGallery")}</h1>
        <p className="text-sm text-gray-500">{t("templateGallery")} · {t("admin")}</p>
      </div>

      <div className="rounded-lg border p-4">
        <div className="text-sm text-gray-600">{t("templateGallery")}</div>
        <div className="mt-3">
          <Link href="/edit" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            {t("openEditor")}
          </Link>
        </div>
      </div>
    </div>
  );
}


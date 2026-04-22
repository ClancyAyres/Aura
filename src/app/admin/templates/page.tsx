"use client";

import { useI18n } from "@/components/I18nProvider";
import ResumePreview, { TemplateId } from "@/components/ResumePreview";
import type { ResumeData } from "@/schemas/resume";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function TemplateGalleryPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [current, setCurrent] = useState<TemplateId>("classic");

  useEffect(() => {
    const saved = window.localStorage.getItem("resume_template");
    if (saved === "classic" || saved === "modern" || saved === "compact") setCurrent(saved);
  }, []);

  const sample = useMemo<ResumeData>(() => {
    return {
      profile: {
        name: "Alex Chen",
        title: "Software Engineer",
        contact_fields: [
          { id: "email", label: "Email", value: "alex@example.com", icon_key: "mail", is_icon_visible: true },
          { id: "github", label: "GitHub", value: "github.com/alex", icon_key: "github", is_icon_visible: true },
          { id: "location", label: "Location", value: "Shanghai", icon_key: "map-pin", is_icon_visible: true },
        ],
      },
      summary: "Build user-facing products with strong engineering fundamentals and clean UI.",
      skills: [
        { name: "TypeScript", level: "advanced" },
        { name: "React", level: "advanced" },
        { name: "Next.js", level: "intermediate" },
      ],
      experience: [
        {
          company: "Example Inc.",
          title: "Frontend Engineer",
          startDate: "2023-01",
          endDate: "Present",
          tech: ["React", "Next.js", "Tailwind"],
          description_raw: ["Improved core flows and reduced page load time."],
          description_optimized: ["Improved core flows and reduced page load time."],
        },
      ],
      projects: [
        {
          name: "Aura Resume",
          role: "Owner",
          tech: ["Next.js", "Prisma"],
          description_raw: ["AI-powered resume builder with templates and export."],
        },
      ],
      education: [
        {
          school: "Example University",
          degree: "B.S. Computer Science",
          startDate: "2019-09",
          endDate: "2023-06",
        },
      ],
      languages: [],
      certs: [],
    };
  }, []);

  const templates: Array<{ id: TemplateId; name: string }> = useMemo(() => {
    return [
      { id: "classic", name: "Classic" },
      { id: "modern", name: "Modern" },
      { id: "compact", name: "Compact" },
    ];
  }, []);

  const choose = (id: TemplateId) => {
    window.localStorage.setItem("resume_template", id);
    setCurrent(id);
    router.push(`/edit?new=1&template=${encodeURIComponent(id)}`);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">{t("templateGallery")}</h1>
        <p className="text-sm text-gray-500">{t("templateGallery")} · {t("admin")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => choose(tpl.id)}
            className={cn(
              "text-left rounded-xl border bg-white overflow-hidden shadow-sm transition-all",
              "hover:-translate-y-1 hover:shadow-lg",
              tpl.id === current && "ring-2 ring-blue-600 border-blue-200"
            )}
          >
            <div className="h-56 bg-gray-50 overflow-hidden">
              <div className="origin-top-left scale-[0.26] w-[900px] pointer-events-none select-none">
                <ResumePreview data={sample} templateId={tpl.id} />
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="text-sm font-semibold">{tpl.name}</div>
              <div className="text-sm font-semibold text-blue-600">{t("quickStart")}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

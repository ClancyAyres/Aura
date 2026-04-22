"use client";

import ResumeForm from "@/components/ResumeForm";
import ResumePreview, { TemplateId } from "@/components/ResumePreview";
import { ResumeData } from "@/schemas/resume";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useI18n } from "@/components/I18nProvider";

type ResumeRecord = {
  id: string;
  title: string;
  data: string;
  updatedAt: string;
  createdAt: string;
};

function packResumeData(data: ResumeData, templateId: TemplateId) {
  return JSON.stringify({ resume: data, templateId });
}

function unpackResumeData(raw: string): { resume: ResumeData | null; templateId: TemplateId } {
  try {
    const parsed = JSON.parse(raw);
    const templateId =
      parsed?.templateId === "classic" || parsed?.templateId === "modern" || parsed?.templateId === "compact"
        ? (parsed.templateId as TemplateId)
        : "classic";
    const resume = parsed?.resume ? (parsed.resume as ResumeData) : (parsed as ResumeData);
    return { resume, templateId };
  } catch {
    return { resume: null, templateId: "classic" };
  }
}

export default function EditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const [initialData, setInitialData] = useState<Partial<ResumeData> | undefined>(undefined);
  const [currentData, setCurrentData] = useState<ResumeData | null>(null);
  const [templateId, setTemplateId] = useState<TemplateId>("classic");
  const [isLoading, setIsLoading] = useState(true);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [resumeTitle, setResumeTitle] = useState("");

  useEffect(() => {
    let isMounted = true;
    const resumeIdParam = searchParams.get("resumeId");
    const isNew = searchParams.get("new") === "1";
    const templateParam = searchParams.get("template");

    const load = async () => {
      const savedTemplate = localStorage.getItem("resume_template");
      if (savedTemplate === "classic" || savedTemplate === "modern" || savedTemplate === "compact") {
        setTemplateId(savedTemplate);
      }

      if (resumeIdParam) {
        try {
          const res = await fetch(`/api/resumes/${encodeURIComponent(resumeIdParam)}`, { cache: "no-store" });
          if (!res.ok) throw new Error("Failed to load resume");
          const record = (await res.json()) as ResumeRecord;
          const { resume, templateId: recordTemplate } = unpackResumeData(record.data);
          if (!isMounted) return;
          setResumeId(record.id);
          setResumeTitle(record.title || "");
          if (resume) {
            setInitialData(resume);
            setCurrentData(resume);
          }
          setTemplateId(recordTemplate);
          setIsLoading(false);
          return;
        } catch {
          if (!isMounted) return;
          setResumeId(null);
        }
      }

      if (isNew) {
        if (templateParam === "classic" || templateParam === "modern" || templateParam === "compact") {
          setTemplateId(templateParam);
          localStorage.setItem("resume_template", templateParam);
        }
        if (!isMounted) return;
        setResumeId(null);
        setResumeTitle("");
        setInitialData(undefined);
        setCurrentData(null);
        setIsLoading(false);
        return;
      }

      const saved = localStorage.getItem("resume_draft");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (!isMounted) return;
          setInitialData(parsed);
          setCurrentData(parsed);
        } catch {}
      }
      if (!isMounted) return;
      setIsLoading(false);
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  const handleSave = async (data: ResumeData) => {
    localStorage.setItem("resume_draft", JSON.stringify(data));
    localStorage.setItem("resume_template", templateId);
    
    try {
      const title = resumeTitle.trim() || `${data.profile.name || "Untitled"}'s Resume`;
      const body = JSON.stringify({ title, data: packResumeData(data, templateId) });
      const res = await fetch(resumeId ? `/api/resumes/${encodeURIComponent(resumeId)}` : "/api/resumes", {
        method: resumeId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (res.ok) {
        const saved = (await res.json()) as ResumeRecord;
        setResumeId(saved.id);
        setResumeTitle(saved.title);
        router.replace(`/edit?resumeId=${encodeURIComponent(saved.id)}`);
      }
    } catch (e) {
      console.error("Failed to save to database", e);
      alert("Failed to save to database, but saved locally.");
    }
  };

  const handleTemplateChange = (id: TemplateId) => {
    setTemplateId(id);
    localStorage.setItem("resume_template", id);
  };

  if (isLoading) return <div className="p-24 text-center font-mono animate-pulse">{t("initEditor")}</div>;

  return (
    <main className="flex h-screen overflow-hidden bg-gray-50">
      {/* Left: Editor */}
      <div className="w-1/2 h-full overflow-auto border-r bg-white">
        <div className="px-6 pt-4 pb-2 border-b bg-white sticky top-0 z-20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Link href="/" className="text-sm font-semibold text-gray-700 hover:text-gray-900">
                {t("backHome")}
              </Link>
              <Link href="/admin/resumes" className="text-sm text-gray-500 hover:text-gray-800">
                {t("myResumes")}
              </Link>
            </div>
            <input
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              placeholder={t("resumeTitlePlaceholder")}
              className="w-64 max-w-[50%] px-3 py-1.5 border rounded-md text-sm focus:border-blue-500 outline-none"
            />
          </div>
        </div>
        <ResumeForm 
          initialData={initialData} 
          onSave={handleSave} 
          onChange={setCurrentData}
          onTemplateChange={handleTemplateChange}
          currentTemplate={templateId}
        />
      </div>

      {/* Right: Preview */}
      <div className="w-1/2 h-full bg-gray-100 relative">
        {currentData ? (
          <ResumePreview data={currentData} templateId={templateId} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 font-mono italic">
            {t("startTyping")}
          </div>
        )}
      </div>
    </main>
  );
}

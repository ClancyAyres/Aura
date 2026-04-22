"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";
import { useEffect, useMemo, useState } from "react";
import ResumePreview, { TemplateId } from "@/components/ResumePreview";
import type { ResumeData } from "@/schemas/resume";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ResumeRecord = {
  id: string;
  title: string;
  data: string;
  updatedAt: string;
  createdAt: string;
};

function readOrder(): string[] {
  try {
    const raw = window.localStorage.getItem("resume_order");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeOrder(ids: string[]) {
  window.localStorage.setItem("resume_order", JSON.stringify(ids));
}

function parseResumeRecordData(raw: string): { resume: ResumeData | null; templateId: TemplateId } {
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

export default function MyResumesPage() {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(true);
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [order, setOrder] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/resumes", { cache: "no-store" });
        const json = await res.json();
        if (!isMounted) return;
        const list = Array.isArray(json) ? (json as ResumeRecord[]) : [];
        setResumes(list);
        const stored = readOrder();
        const ids = list.map((r) => r.id);
        const next = [...stored.filter((id) => ids.includes(id)), ...ids.filter((id) => !stored.includes(id))];
        setOrder(next);
        writeOrder(next);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const items = useMemo(() => {
    const byId = new Map(resumes.map((r) => [r.id, r]));
    const sorted = order.length ? order.map((id) => byId.get(id)).filter(Boolean) as ResumeRecord[] : resumes;
    return sorted.map((r) => {
      const { resume, templateId } = parseResumeRecordData(r.data);
      return { ...r, resume, templateId };
    });
  }, [resumes, order]);

  const move = (id: string, dir: -1 | 1) => {
    setOrder((prev) => {
      const idx = prev.indexOf(id);
      if (idx === -1) return prev;
      const nextIdx = idx + dir;
      if (nextIdx < 0 || nextIdx >= prev.length) return prev;
      const next = [...prev];
      const tmp = next[idx];
      next[idx] = next[nextIdx];
      next[nextIdx] = tmp;
      writeOrder(next);
      return next;
    });
  };

  const removeResume = async (id: string) => {
    if (!window.confirm(t("deleteConfirm"))) return;
    const res = await fetch(`/api/resumes/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) return;
    setResumes((prev) => prev.filter((r) => r.id !== id));
    setOrder((prev) => {
      const next = prev.filter((x) => x !== id);
      writeOrder(next);
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">{t("myResumes")}</h1>
          <p className="text-sm text-gray-500">{t("myResumes")} · {t("admin")}</p>
        </div>
        <Link
          href="/edit?new=1"
          className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          {t("openEditor")}
        </Link>
      </div>

      {isLoading ? (
        <div className="text-sm text-gray-500">{t("loading")}</div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-gray-600">0</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((r) => (
            <div key={r.id} className="rounded-xl border bg-white overflow-hidden shadow-sm">
              <Link
                href={`/edit?resumeId=${encodeURIComponent(r.id)}`}
                className={cn(
                  "block h-44 bg-gray-50 overflow-hidden transition-all",
                  "hover:-translate-y-1 hover:shadow-lg"
                )}
              >
                {r.resume ? (
                  <div className="origin-top-left scale-[0.22] w-[900px] pointer-events-none select-none">
                    <ResumePreview data={r.resume} templateId={r.templateId} />
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-gray-400">{t("invalidData")}</div>
                )}
              </Link>

              <div className="p-4 space-y-2">
                <div className="text-sm font-semibold line-clamp-2">{r.title}</div>
                <div className="text-xs text-gray-400">
                  {new Date(r.updatedAt).toLocaleString()}
                </div>
                <div className="pt-1 flex items-center justify-between">
                  <Link
                    href={`/edit?resumeId=${encodeURIComponent(r.id)}`}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {t("edit")}
                  </Link>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title={t("moveUp")}
                      onClick={() => move(r.id, -1)}
                      className="p-2 rounded-md hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition-colors"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      title={t("moveDown")}
                      onClick={() => move(r.id, 1)}
                      className="p-2 rounded-md hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition-colors"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      title={t("deleteResume")}
                      onClick={() => removeResume(r.id)}
                      className="p-2 rounded-md hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

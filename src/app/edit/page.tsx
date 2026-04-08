"use client";

import ResumeForm from "@/components/ResumeForm";
import ResumePreview, { TemplateId } from "@/components/ResumePreview";
import { ResumeData } from "@/schemas/resume";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function EditPage() {
  const router = useRouter();
  const [initialData, setInitialData] = useState<Partial<ResumeData> | undefined>(undefined);
  const [currentData, setCurrentData] = useState<ResumeData | null>(null);
  const [templateId, setTemplateId] = useState<TemplateId>("classic");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("resume_draft");
    const savedTemplate = localStorage.getItem("resume_template");
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setInitialData(parsed);
        setCurrentData(parsed);
      } catch (e) {
        console.error("Failed to parse saved resume", e);
      }
    }
    
    if (savedTemplate) {
      setTemplateId(savedTemplate as TemplateId);
    }
    
    setIsLoading(false);
  }, []);

  const handleSave = async (data: ResumeData) => {
    localStorage.setItem("resume_draft", JSON.stringify(data));
    localStorage.setItem("resume_template", templateId);
    
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${data.profile.name}'s Resume`,
          data: JSON.stringify(data),
        }),
      });
      if (res.ok) {
        alert("Resume saved successfully!");
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

  if (isLoading) return <div className="p-24 text-center font-mono animate-pulse">Initializing editor...</div>;

  return (
    <main className="flex h-screen overflow-hidden bg-gray-50">
      {/* Left: Editor */}
      <div className="w-1/2 h-full overflow-auto border-r bg-white">
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
            Start typing to see preview...
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResumeSchema, ResumeData } from "@/schemas/resume";
import { cn } from "@/lib/utils";
import { Plus, Trash2, Save, Wand2, Layout } from "lucide-react";
import { useState, useEffect } from "react";
import * as YAML from "yaml";

export default function ResumeForm({ 
  initialData, 
  onSave,
  onChange,
  onTemplateChange,
  currentTemplate = "classic"
}: { 
  initialData?: Partial<ResumeData>,
  onSave: (data: ResumeData) => void,
  onChange?: (data: ResumeData) => void,
  onTemplateChange?: (templateId: "classic" | "modern" | "compact") => void,
  currentTemplate?: string
}) {
  const [importMode, setImportMode] = useState<"form" | "json" | "yaml">("form");
  const [importText, setImportText] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResumeData>({
    resolver: zodResolver(ResumeSchema),
    defaultValues: initialData || {
      profile: { name: "", title: "" },
      summary: "",
      skills: [],
      experience: [],
      projects: [],
      education: [],
    },
  });

  // Watch all fields for real-time preview
  const watchedData = useWatch({ control });
  
  useEffect(() => {
    if (onChange && watchedData) {
      onChange(watchedData as ResumeData);
    }
  }, [watchedData, onChange]);

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: "experience",
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: "skills",
  });

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: "projects",
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: "education",
  });

  const [isOptimizing, setIsOptimizing] = useState<number | null>(null);

  const handleOptimize = async (index: number) => {
    const exp = watchedData.experience?.[index];
    if (!exp?.company || !exp?.title || !exp?.description_raw || exp.description_raw.length === 0) {
      alert("Please fill in company, title, and raw description first.");
      return;
    }

    setIsOptimizing(index);
    try {
      const res = await fetch("/api/optimize/star", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: exp.company,
          title: exp.title,
          description_raw: exp.description_raw,
          tech: exp.tech || [],
        }),
      });
      const { optimized, error } = await res.json();
      if (error) throw new Error(error);
      
      const newExperience = [...(watchedData.experience || [])];
      newExperience[index] = { ...exp, description_optimized: optimized };
      reset({ ...watchedData, experience: newExperience });
    } catch (e) {
      alert("Failed to optimize: " + (e as Error).message);
    } finally {
      setIsOptimizing(null);
    }
  };

  const handleImport = () => {
    try {
      let data: any;
      if (importMode === "json") {
        data = JSON.parse(importText);
      } else if (importMode === "yaml") {
        data = YAML.parse(importText);
      }
      const validated = ResumeSchema.parse(data);
      reset(validated);
      setImportMode("form");
    } catch (e) {
      alert("Invalid data format: " + (e as Error).message);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10 py-4 border-b">
        <h1 className="text-2xl font-bold">Resume Editor</h1>
        <div className="flex gap-2">
          <div className="flex bg-gray-100 p-1 rounded-md mr-2">
            {(["classic", "modern", "compact"] as const).map((t) => (
              <button
                key={t}
                onClick={() => onTemplateChange?.(t)}
                className={cn(
                  "px-3 py-1 text-xs rounded transition-all",
                  currentTemplate === t ? "bg-white shadow-sm text-black font-medium" : "text-gray-500 hover:text-gray-800"
                )}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setImportMode(importMode === "form" ? "json" : "form")}
            className="px-4 py-2 border rounded hover:bg-gray-50 text-sm flex items-center gap-2"
          >
            <Layout size={16} />
            {importMode === "form" ? "Import" : "Edit"}
          </button>
          <button
            onClick={handleSubmit(onSave)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 text-sm"
          >
            <Save size={16} />
            Save
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-black flex items-center gap-2 text-sm"
          >
            <Plus size={16} className="rotate-45" />
            PDF
          </button>
        </div>
      </div>

      {importMode !== "form" ? (
        <div className="space-y-4">
          <div className="flex gap-4 mb-2">
            <button
              onClick={() => setImportMode("json")}
              className={cn("px-4 py-1 rounded-full text-xs", importMode === "json" ? "bg-black text-white" : "bg-gray-100")}
            >
              JSON
            </button>
            <button
              onClick={() => setImportMode("yaml")}
              className={cn("px-4 py-1 rounded-full text-xs", importMode === "yaml" ? "bg-black text-white" : "bg-gray-100")}
            >
              YAML
            </button>
          </div>
          <textarea
            className="w-full h-96 p-4 font-mono text-sm border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder={importMode === "json" ? '{ "profile": { "name": "..." } }' : "profile:\n  name: ..."}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
          />
          <button
            onClick={handleImport}
            className="w-full py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Load Data
          </button>
        </div>
      ) : (
        <form className="space-y-12 pb-24">
          {/* Profile Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Profile</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Full Name</label>
                <input
                  {...register("profile.name")}
                  className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none"
                />
                {errors.profile?.name && <p className="text-red-500 text-xs">{errors.profile.name.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Job Title</label>
                <input
                  {...register("profile.title")}
                  className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <input
                  {...register("profile.contacts.email")}
                  className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Location</label>
                <input
                  {...register("profile.location")}
                  placeholder="City, Country"
                  className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* Summary Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Professional Summary</h2>
            <textarea
              {...register("summary")}
              rows={4}
              placeholder="A brief overview of your professional background and key achievements."
              className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm"
            />
          </section>

          {/* Experience Section */}
          <section className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold">Experience</h2>
              <button
                type="button"
                onClick={() => appendExperience({ company: "", title: "", startDate: "", tech: [], description_raw: [] })}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
              >
                <Plus size={16} /> Add Experience
              </button>
            </div>
            
            <div className="space-y-8">
              {experienceFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative group">
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={18} />
                  </button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium uppercase text-gray-500">Company</label>
                      <input
                        {...register(`experience.${index}.company`)}
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium uppercase text-gray-500">Title</label>
                      <input
                        {...register(`experience.${index}.title`)}
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium uppercase text-gray-500">Start Date</label>
                      <input
                        {...register(`experience.${index}.startDate`)}
                        placeholder="YYYY-MM"
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium uppercase text-gray-500">End Date</label>
                      <input
                        {...register(`experience.${index}.endDate`)}
                        placeholder="YYYY-MM or Present"
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium uppercase text-gray-500">Description (Raw)</label>
                    <textarea
                      rows={3}
                      placeholder="One point per line"
                      className="w-full p-2 border rounded text-sm font-mono"
                      defaultValue={field.description_raw.join("\n")}
                      onChange={(e) => {
                        const lines = e.target.value.split("\n").filter(l => l.trim());
                        const newExperience = [...(watchedData.experience || [])];
                        newExperience[index] = { ...newExperience[index], description_raw: lines };
                        // We use reset with { keepDefaultValues: true } to avoid unnecessary re-renders of the whole form
                        // but actually, since we are using useWatch, updating the data is important.
                        // However, react-hook-form field arrays work better with setValue.
                      }}
                      // Using setValue for specific field is cleaner than reset
                      onBlur={(e) => {
                        const lines = e.target.value.split("\n").filter(l => l.trim());
                        const fieldName = `experience.${index}.description_raw` as const;
                        // @ts-ignore
                        control._setValue(fieldName, lines);
                      }}
                    />
                  </div>

                  {field.description_optimized && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium uppercase text-blue-500">Description (Optimized)</label>
                      <div className="bg-blue-50 p-3 rounded text-sm space-y-1">
                        {field.description_optimized.map((line, i) => (
                          <div key={i} className="flex gap-2">
                            <span>•</span>
                            <span>{line}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleOptimize(index)}
                    disabled={isOptimizing === index}
                    className={cn(
                      "flex items-center gap-1 text-xs px-3 py-1 rounded transition-colors",
                      isOptimizing === index 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                        : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                    )}
                  >
                    <Wand2 size={12} className={isOptimizing === index ? "animate-spin" : ""} />
                    {isOptimizing === index ? "Optimizing..." : "Optimize with AI (STAR)"}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Projects Section */}
          <section className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold">Projects</h2>
              <button
                type="button"
                onClick={() => appendProject({ name: "", description_raw: [], tech: [] })}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
              >
                <Plus size={16} /> Add Project
              </button>
            </div>
            
            <div className="space-y-8">
              {projectFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative group">
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={18} />
                  </button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium uppercase text-gray-500">Project Name</label>
                      <input
                        {...register(`projects.${index}.name`)}
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium uppercase text-gray-500">Role</label>
                      <input
                        {...register(`projects.${index}.role`)}
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium uppercase text-gray-500">Description (Raw)</label>
                    <textarea
                      rows={2}
                      placeholder="One point per line"
                      className="w-full p-2 border rounded text-sm font-mono"
                      defaultValue={field.description_raw.join("\n")}
                      onBlur={(e) => {
                        const lines = e.target.value.split("\n").filter(l => l.trim());
                        const fieldName = `projects.${index}.description_raw` as const;
                        // @ts-ignore
                        control._setValue(fieldName, lines);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education Section */}
          <section className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold">Education</h2>
              <button
                type="button"
                onClick={() => appendEducation({ school: "", degree: "", startDate: "" })}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
              >
                <Plus size={16} /> Add Education
              </button>
            </div>
            
            <div className="space-y-6">
              {educationFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative group">
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={18} />
                  </button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 col-span-2">
                      <label className="text-xs font-medium uppercase text-gray-500">School</label>
                      <input
                        {...register(`education.${index}.school`)}
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>
                    <div className="space-y-1 col-span-2">
                      <label className="text-xs font-medium uppercase text-gray-500">Degree</label>
                      <input
                        {...register(`education.${index}.degree`)}
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium uppercase text-gray-500">Start Date</label>
                      <input
                        {...register(`education.${index}.startDate`)}
                        placeholder="YYYY-MM"
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium uppercase text-gray-500">End Date</label>
                      <input
                        {...register(`education.${index}.endDate`)}
                        placeholder="YYYY-MM"
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold">Skills</h2>
              <button
                type="button"
                onClick={() => appendSkill({ name: "", level: "intermediate" })}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
              >
                <Plus size={16} /> Add Skill
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full group">
                  <input
                    {...register(`skills.${index}.name`)}
                    className="bg-transparent border-none focus:ring-0 text-sm w-24 outline-none"
                    placeholder="Skill name"
                  />
                  <select
                    {...register(`skills.${index}.level`)}
                    className="bg-transparent border-none focus:ring-0 text-[10px] text-gray-500 uppercase outline-none"
                  >
                    <option value="beginner">Beg</option>
                    <option value="intermediate">Int</option>
                    <option value="advanced">Adv</option>
                    <option value="expert">Exp</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="text-gray-400 hover:text-red-500 ml-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </form>
      )}
    </div>
  );
}

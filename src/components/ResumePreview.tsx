"use client";

import { ResumeData, Experience, Project, Education } from "@/schemas/resume";
import { cn } from "@/lib/utils";

export type TemplateId = "classic" | "modern" | "compact";

interface ResumePreviewProps {
  data: ResumeData;
  templateId: TemplateId;
}

export default function ResumePreview({ data, templateId }: ResumePreviewProps) {
  const renderTemplate = () => {
    switch (templateId) {
      case "modern":
        return <ModernTemplate data={data} />;
      case "compact":
        return <CompactTemplate data={data} />;
      case "classic":
      default:
        return <ClassicTemplate data={data} />;
    }
  };

  return (
    <div className="w-full h-full bg-gray-200 p-8 overflow-auto flex justify-center no-scrollbar">
      <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl p-[15mm] text-black shrink-0">
        {renderTemplate()}
      </div>
    </div>
  );
}

// Helper components for templates
function BulletList({ items }: { items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="list-disc list-outside ml-4 mt-1 space-y-1">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function ClassicTemplate({ data }: { data: ResumeData }) {
  const { profile, summary, skills, experience, projects, education } = data;
  return (
    <div className="space-y-6 font-serif">
      <div className="text-center border-b-2 border-black pb-4">
        <h1 className="text-3xl font-bold uppercase tracking-wider">{profile.name}</h1>
        <div className="text-sm mt-2 flex justify-center gap-4 flex-wrap">
          {profile.title && <span>{profile.title}</span>}
          {profile.location && <span>{profile.location}</span>}
          {profile.contacts?.email && <span>{profile.contacts.email}</span>}
          {profile.contacts?.phone && <span>{profile.contacts.phone}</span>}
        </div>
      </div>

      {summary && (
        <section>
          <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase tracking-tight">Summary</h2>
          <p className="text-sm leading-relaxed">{summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section>
          <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase tracking-tight">Experience</h2>
          <div className="space-y-4">
            {experience.map((exp, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span>{exp.company}</span>
                  <span>{exp.startDate} - {exp.endDate || "Present"}</span>
                </div>
                <div className="italic text-sm">{exp.title}</div>
                <BulletList items={exp.description_optimized || exp.description_raw} />
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section>
          <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase tracking-tight">Projects</h2>
          <div className="space-y-4">
            {projects.map((proj, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span>{proj.name} {proj.role && `— ${proj.role}`}</span>
                  <span>{proj.startDate} - {proj.endDate}</span>
                </div>
                <BulletList items={proj.description_optimized || proj.description_raw} />
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase tracking-tight">Skills</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {skills.map((skill, i) => (
              <span key={i}><span className="font-semibold">{skill.name}</span> ({skill.level})</span>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section>
          <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase tracking-tight">Education</h2>
          <div className="space-y-2">
            {education.map((edu, i) => (
              <div key={i} className="flex justify-between text-sm">
                <div>
                  <span className="font-bold">{edu.school}</span>, {edu.degree}
                </div>
                <span>{edu.startDate} - {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ModernTemplate({ data }: { data: ResumeData }) {
  const { profile, summary, skills, experience, projects, education } = data;
  return (
    <div className="grid grid-cols-12 gap-8 font-sans h-full">
      <div className="col-span-4 bg-gray-50 -m-[15mm] p-[15mm] space-y-8">
        <div>
          <h1 className="text-2xl font-black text-blue-900 leading-tight uppercase">{profile.name}</h1>
          <p className="text-blue-700 font-medium mt-1">{profile.title}</p>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          <h3 className="font-bold text-gray-900 border-b pb-1">CONTACT</h3>
          {profile.location && <p>{profile.location}</p>}
          {profile.contacts?.email && <p>{profile.contacts.email}</p>}
          {profile.contacts?.phone && <p>{profile.contacts.phone}</p>}
          {profile.contacts?.github && <p className="truncate text-xs">{profile.contacts.github}</p>}
        </div>

        <div className="space-y-3 text-sm">
          <h3 className="font-bold text-gray-900 border-b pb-1">SKILLS</h3>
          <div className="space-y-2">
            {skills.map((skill, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{skill.name}</span>
                  <span className="text-gray-400">{skill.level}</span>
                </div>
                <div className="w-full bg-gray-200 h-1 rounded-full">
                  <div 
                    className="bg-blue-600 h-1 rounded-full" 
                    style={{ width: skill.level === "expert" ? "100%" : skill.level === "advanced" ? "75%" : skill.level === "intermediate" ? "50%" : "25%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {education.length > 0 && (
          <div className="space-y-3 text-sm">
            <h3 className="font-bold text-gray-900 border-b pb-1">EDUCATION</h3>
            {education.map((edu, i) => (
              <div key={i} className="space-y-1">
                <p className="font-bold text-gray-800">{edu.school}</p>
                <p className="text-xs">{edu.degree}</p>
                <p className="text-[10px] text-gray-400">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="col-span-8 space-y-8">
        {summary && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
              <span className="w-8 h-1 bg-blue-900 inline-block" />
              ABOUT ME
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
              <span className="w-8 h-1 bg-blue-900 inline-block" />
              EXPERIENCE
            </h2>
            <div className="space-y-6">
              {experience.map((exp, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-blue-100">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-600" />
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900">{exp.company}</h3>
                    <span className="text-xs font-bold text-blue-600">{exp.startDate} - {exp.endDate || "Present"}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 italic mb-2">{exp.title}</p>
                  <BulletList items={exp.description_optimized || exp.description_raw} />
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
              <span className="w-8 h-1 bg-blue-900 inline-block" />
              PROJECTS
            </h2>
            <div className="space-y-6">
              {projects.map((proj, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-blue-100">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-600" />
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900">{proj.name}</h3>
                    <span className="text-xs font-bold text-blue-600">{proj.startDate} - {proj.endDate}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 italic mb-2">{proj.role}</p>
                  <BulletList items={proj.description_optimized || proj.description_raw} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function CompactTemplate({ data }: { data: ResumeData }) {
  const { profile, summary, skills, experience, projects, education } = data;
  return (
    <div className="text-[11px] leading-tight space-y-3 font-sans">
      <div className="flex justify-between items-end border-b-2 border-gray-800 pb-1">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight">{profile.name}</h1>
          <p className="font-medium text-gray-600 uppercase">{profile.title}</p>
        </div>
        <div className="text-right flex flex-wrap justify-end gap-x-3 gap-y-0.5 max-w-[50%]">
          {profile.location && <span>{profile.location}</span>}
          {profile.contacts?.email && <span>{profile.contacts.email}</span>}
          {profile.contacts?.phone && <span>{profile.contacts.phone}</span>}
          {profile.contacts?.github && <span className="truncate">{profile.contacts.github}</span>}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3 space-y-4">
          {experience.length > 0 && (
            <section>
              <h2 className="font-bold border-b border-gray-400 mb-1 uppercase text-xs">Experience</h2>
              <div className="space-y-3">
                {experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>{exp.company} — {exp.title}</span>
                      <span>{exp.startDate} – {exp.endDate || "Present"}</span>
                    </div>
                    <BulletList items={exp.description_optimized || exp.description_raw} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <h2 className="font-bold border-b border-gray-400 mb-1 uppercase text-xs">Projects</h2>
              <div className="space-y-2">
                {projects.map((proj, i) => (
                  <div key={i}>
                    <div className="flex justify-between font-bold">
                      <span>{proj.name} {proj.role && `— ${proj.role}`}</span>
                      <span>{proj.startDate} – {proj.endDate}</span>
                    </div>
                    <BulletList items={proj.description_optimized || proj.description_raw} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="col-span-1 space-y-4">
          {skills.length > 0 && (
            <section>
              <h2 className="font-bold border-b border-gray-400 mb-1 uppercase text-xs">Skills</h2>
              <div className="space-y-1">
                {skills.map((skill, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{skill.name}</span>
                    <span className="text-gray-400 italic">{skill.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h2 className="font-bold border-b border-gray-400 mb-1 uppercase text-xs">Education</h2>
              {education.map((edu, i) => (
                <div key={i} className="mb-2">
                  <p className="font-bold">{edu.school}</p>
                  <p>{edu.degree}</p>
                  <p className="text-gray-400 italic">{edu.startDate} – {edu.endDate}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

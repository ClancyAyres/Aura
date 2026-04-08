import { z } from "zod";

export const ContactFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string().optional(),
  icon_key: z.string().optional(),
  is_icon_visible: z.boolean().default(true),
});

export const AvatarConfigSchema = z.object({
  url: z.string().url().optional(),
});

export const ProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().optional(),
  location: z.string().optional(),
  contact_fields: z.array(ContactFieldSchema).default([]),
  avatar: AvatarConfigSchema.optional(),
});

export const SkillSchema = z.object({
  name: z.string().min(1),
  level: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
});

export const ExperienceSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().optional(), // "Present" or date
  location: z.string().optional(),
  description_raw: z.array(z.string()).default([]),
  description_optimized: z.array(z.string()).optional(),
  tech: z.array(z.string()).default([]),
});

export const ProjectSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description_raw: z.array(z.string()).default([]),
  description_optimized: z.array(z.string()).optional(),
  tech: z.array(z.string()).default([]),
  link: z.string().url().optional(),
});

export const EducationSchema = z.object({
  school: z.string().min(1),
  degree: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
});

export const ResumeSchema = z.object({
  profile: ProfileSchema,
  summary: z.string().optional(),
  skills: z.array(SkillSchema).default([]),
  experience: z.array(ExperienceSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  education: z.array(EducationSchema).default([]),
  languages: z.array(z.string()).default([]),
  certs: z.array(z.string()).default([]),
});

export type ResumeData = z.infer<typeof ResumeSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type ContactField = z.infer<typeof ContactFieldSchema>;
export type AvatarConfig = z.infer<typeof AvatarConfigSchema>;

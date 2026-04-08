import { z } from "zod";

export const ContactSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  github: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  website: z.string().url().optional(),
});

export const ProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().optional(),
  location: z.string().optional(),
  contacts: ContactSchema.optional(),
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

import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  userType: z.enum(["student", "teacher", "admin"]),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  isVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const SubjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  hours: z.number(),
  minutes: z.number(),
});

export const StudyCycleSchema = z.object({
  id: z.string(),
  name: z.string(),
  settingsId: z.string(),
  totalWeeks: z.number(),
  createdAt: z.date(),
});

export const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  creatorId: z.string(),
  subjectId: z.string(),
  isPublished: z.boolean(),
  createdAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;
export type Subject = z.infer<typeof SubjectSchema>;
export type StudyCycle = z.infer<typeof StudyCycleSchema>;
export type Course = z.infer<typeof CourseSchema>;

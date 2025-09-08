import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const subjects = pgTable("subjects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  hours: integer("hours").notNull().default(0),
  minutes: integer("minutes").notNull().default(0),
});

export const studySettings = pgTable("study_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  wakeTime: text("wake_time").notNull().default("07:00"),
  sleepTime: text("sleep_time").notNull().default("23:00"),
  dailyStudyHours: integer("daily_study_hours").notNull().default(6),
  dailyStudyMinutes: integer("daily_study_minutes").notNull().default(0),
});

// Users table with authentication and roles
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  userType: text("user_type").notNull().default("student"), // "student" or "teacher"
  bio: text("bio"),
  avatar: text("avatar"),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Content created by teachers
export const content = pgTable("content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teacherId: varchar("teacher_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  contentType: text("content_type").notNull(), // "video", "article", "quiz", etc.
  contentUrl: text("content_url"),
  thumbnailUrl: text("thumbnail_url"),
  tags: text("tags").array(),
  isPublished: boolean("is_published").notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  likeCount: integer("like_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Global subjects - independent of study cycles
export const globalSubjects = pgTable("global_subjects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const studyCycles = pgTable("study_cycles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  settingsId: varchar("settings_id").references(() => studySettings.id),
  totalWeeks: integer("total_weeks").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Link table between cycles and global subjects with time allocation
export const cycleSubjects = pgTable("cycle_subjects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cycleId: varchar("cycle_id").references(() => studyCycles.id),
  globalSubjectId: varchar("global_subject_id").references(() => globalSubjects.id),
  hours: integer("hours").notNull().default(0),
  minutes: integer("minutes").notNull().default(0),
});

export const insertSubjectSchema = createInsertSchema(subjects).omit({
  id: true,
});

export const insertStudySettingsSchema = createInsertSchema(studySettings).omit({
  id: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const insertContentSchema = createInsertSchema(content).omit({
  id: true,
  teacherId: true,
  viewCount: true,
  likeCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGlobalSubjectSchema = createInsertSchema(globalSubjects).omit({
  id: true,
  createdAt: true,
});

export const insertCycleSubjectSchema = createInsertSchema(cycleSubjects).omit({
  id: true,
});

export const insertStudyCycleSchema = createInsertSchema(studyCycles).omit({
  id: true,
  createdAt: true,
});

export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Subject = typeof subjects.$inferSelect;

export type InsertStudySettings = z.infer<typeof insertStudySettingsSchema>;
export type StudySettings = typeof studySettings.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;

export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof content.$inferSelect;

export type InsertGlobalSubject = z.infer<typeof insertGlobalSubjectSchema>;
export type GlobalSubject = typeof globalSubjects.$inferSelect;

export type InsertCycleSubject = z.infer<typeof insertCycleSubjectSchema>;
export type CycleSubject = typeof cycleSubjects.$inferSelect;

export type InsertStudyCycle = z.infer<typeof insertStudyCycleSchema>;
export type StudyCycle = typeof studyCycles.$inferSelect;

// Schedule types
export type ScheduleSlot = {
  subjectId: string;
  subjectName: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
};

export type DaySchedule = {
  day: string;
  date: string;
  slots: ScheduleSlot[];
  totalMinutes: number;
};

export type WeekSchedule = {
  weekNumber: number;
  days: DaySchedule[];
};

// Extended types for full subject data with time allocation
export type CycleSubjectWithDetails = CycleSubject & {
  globalSubject: GlobalSubject;
};

// Content with teacher information
export type ContentWithTeacher = Content & {
  teacher: Pick<User, 'id' | 'name' | 'avatar' | 'userType'>;
};

// Current session user
export type SessionUser = {
  id: string;
  email: string;
  name: string;
  userType: string;
  avatar?: string;
};

export type StudyCycleData = {
  cycle: StudyCycle;
  settings: StudySettings;
  subjects: Subject[]; // Legacy - will be replaced by cycleSubjects
  cycleSubjects?: CycleSubjectWithDetails[]; // New structure
  weeks: WeekSchedule[];
};

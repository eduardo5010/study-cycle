import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
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

export type StudyCycleData = {
  cycle: StudyCycle;
  settings: StudySettings;
  subjects: Subject[]; // Legacy - will be replaced by cycleSubjects
  cycleSubjects?: CycleSubjectWithDetails[]; // New structure
  weeks: WeekSchedule[];
};

import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  real,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import type { Course as CourseType } from "./types/course";

// Base tables
export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  isStudent: integer("is_student", { mode: "boolean" }).notNull().default(true),
  isTeacher: integer("is_teacher", { mode: "boolean" }).notNull().default(false),
  isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
  bio: text("bio"),
  avatar: text("avatar"),
  isVerified: integer("is_verified", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export const studySettings = sqliteTable("study_settings", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").references(() => users.id),
  wakeTime: text("wake_time").notNull().default("07:00"),
  sleepTime: text("sleep_time").notNull().default("23:00"),
  dailyStudyHours: integer("daily_study_hours").notNull().default(6),
  dailyStudyMinutes: integer("daily_study_minutes").notNull().default(0),
});

// Subjects and Study Cycles
export const subjects = sqliteTable("subjects", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  hours: integer("hours").notNull().default(0),
  minutes: integer("minutes").notNull().default(0),
});

export const globalSubjects = sqliteTable("global_subjects", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull().unique(),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const studyCycles = sqliteTable("study_cycles", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  settingsId: text("settings_id").references(() => studySettings.id),
  totalWeeks: integer("total_weeks").notNull(),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const cycleSubjects = sqliteTable("cycle_subjects", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  cycleId: text("cycle_id").references(() => studyCycles.id),
  globalSubjectId: text("global_subject_id").references(
    () => globalSubjects.id
  ),
  hours: integer("hours").notNull().default(0),
  minutes: integer("minutes").notNull().default(0),
});

// Courses and Learning Content
export const courses = sqliteTable("courses", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  level: text("level").notNull().default("beginner"),
  thumbnailUrl: text("thumbnail_url"),
  isCareer: integer("is_career", { mode: "boolean" }).notNull().default(false),
  estimatedHours: integer("estimated_hours").notNull().default(0),
  enrollmentCount: integer("enrollment_count").notNull().default(0),
  rating: integer("rating").notNull().default(0),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(false),
  creatorId: text("creator_id").references(() => users.id),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

export const courseModules = sqliteTable("course_modules", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  courseId: text("course_id").references(() => courses.id),
  title: text("title").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull().default(0),
  estimatedMinutes: integer("estimated_minutes").notNull().default(0),
});

export const courseContent = sqliteTable("course_content", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  moduleId: text("module_id").references(() => courseModules.id),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  duration: integer("duration"),
  orderIndex: integer("order_index").notNull(),
  isRequired: integer("is_required", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const userCourses = sqliteTable("user_courses", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").references(() => users.id),
  courseId: text("course_id").references(() => courses.id),
  currentModuleId: text("current_module_id").references(
    () => courseModules.id
  ),
  progress: integer("progress").notNull().default(0),
  isCompleted: integer("is_completed", { mode: "boolean" }).notNull().default(false),
  enrolledAt: text("enrolled_at").default(sql`(datetime('now'))`),
  completedAt: text("completed_at"),
});

// Social Learning
export const studyGroups = sqliteTable("study_groups", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: text("owner_id").references(() => users.id),
  subjectId: text("subject_id").references(() => subjects.id),
  maxMembers: integer("max_members").default(10),
  isPrivate: integer("is_private", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const groupMembers = sqliteTable("group_members", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  groupId: text("group_id").references(() => studyGroups.id),
  userId: text("user_id").references(() => users.id),
  role: text("role").default("member"),
  joinedAt: text("joined_at").default(sql`(datetime('now'))`),
});

// Gamification
// Tabelas de gamificação
export const userStats = sqliteTable("user_stats", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id")
    .references(() => users.id)
    .unique(),
  tasksCompleted: integer("tasks_completed").notNull().default(0),
  projectsCompleted: integer("projects_completed").notNull().default(0),
  certificatesEarned: integer("certificates_earned").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastStudyDate: text("last_study_date"),
  currentXp: integer("current_xp").notNull().default(0),
  totalXp: integer("total_xp").notNull().default(0),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export const leagues = sqliteTable("leagues", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  minXp: integer("min_xp").notNull().default(0),
  maxXp: integer("max_xp").notNull().default(0),
  orderIndex: integer("order_index").notNull().default(0),
  color: text("color").notNull(),
  icon: text("icon"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export const studyStreaks = sqliteTable("study_streaks", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  date: text("date").notNull(),
  minutesStudied: integer("minutes_studied").notNull().default(0),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = typeof userStats.$inferInsert;
export type League = typeof leagues.$inferSelect;
export type InsertLeague = typeof leagues.$inferInsert;
export type StudyStreak = typeof studyStreaks.$inferSelect;
export type InsertStudyStreak = typeof studyStreaks.$inferInsert;

export const achievements = sqliteTable("achievements", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  title: text("title").notNull(),
  description: text("description"),
  iconUrl: text("icon_url"),
  requirement: text("requirement").notNull(),
  xpReward: integer("xp_reward").notNull().default(0),
});

export const userAchievements = sqliteTable("user_achievements", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").references(() => users.id),
  achievementId: text("achievement_id").references(() => achievements.id),
  unlockedAt: text("unlocked_at").default(sql`(datetime('now'))`),
});

// Analytics and Progress
export const studyAnalytics = sqliteTable("study_analytics", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").references(() => users.id),
  type: text("type").notNull(),
  value: integer("value").notNull(),
  metadata: text("metadata", { mode: "json" }),
  recordedAt: text("recorded_at").default(sql`(datetime('now'))`),
});

export const studyProgress = sqliteTable("study_progress", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").references(() => users.id),
  subjectId: text("subject_id").references(() => subjects.id),
  type: text("progress_type").notNull(),
  value: integer("progress_value").notNull(),
  metadata: text("metadata", { mode: "json" }),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// Projects and Tasks
export const projects = sqliteTable("projects", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").references(() => users.id),
  courseId: text("course_id").references(() => courses.id),
  title: text("title").notNull(),
  description: text("description"),
  repositoryUrl: text("repository_url"),
  isCompleted: integer("is_completed", { mode: "boolean" }).notNull().default(false),
  completedAt: text("completed_at"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const tasks = sqliteTable("tasks", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  isCompleted: integer("is_completed", { mode: "boolean" }).notNull().default(false),
  xpReward: integer("xp_reward").notNull().default(10),
  completedAt: text("completed_at"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

// Notifications
export const notifications = sqliteTable("notifications", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(),
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

// Schema validations
export const insertSubjectSchema = createInsertSchema(subjects).omit({
  id: true,
});
export const insertStudySettingsSchema = createInsertSchema(studySettings).omit(
  { id: true }
);
export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({ confirmPassword: z.string().min(6) })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  enrollmentCount: true,
  rating: true,
  createdAt: true,
});

export const insertGlobalSubjectSchema = createInsertSchema(
  globalSubjects
).omit({
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

// Type exports
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Subject = typeof subjects.$inferSelect;

export type InsertStudySettings = z.infer<typeof insertStudySettingsSchema>;
export type StudySettings = typeof studySettings.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;

export type InsertGlobalSubject = z.infer<typeof insertGlobalSubjectSchema>;
export type GlobalSubject = typeof globalSubjects.$inferSelect;

export type InsertCycleSubject = z.infer<typeof insertCycleSubjectSchema>;
export type CycleSubject = typeof cycleSubjects.$inferSelect;

export type InsertStudyCycle = z.infer<typeof insertStudyCycleSchema>;
export type StudyCycle = typeof studyCycles.$inferSelect;

// Custom types
export type ScheduleSlot = {
  subjectId: string;
  subjectName: string;
  startTime: string;
  endTime: string;
  duration: number;
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

export type CycleSubjectWithDetails = CycleSubject & {
  globalSubject: GlobalSubject;
};

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
  subjects: Subject[];
  cycleSubjects?: CycleSubjectWithDetails[];
  weeks: WeekSchedule[];
};

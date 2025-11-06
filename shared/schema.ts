import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import type { Course as CourseType } from "./types/course";

// Base tables
export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  isStudent: boolean("is_student").notNull().default(true),
  isTeacher: boolean("is_teacher").notNull().default(false),
  isAdmin: boolean("is_admin").notNull().default(false),
  bio: text("bio"),
  avatar: text("avatar"),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const studySettings = pgTable("study_settings", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  wakeTime: text("wake_time").notNull().default("07:00"),
  sleepTime: text("sleep_time").notNull().default("23:00"),
  dailyStudyHours: integer("daily_study_hours").notNull().default(6),
  dailyStudyMinutes: integer("daily_study_minutes").notNull().default(0),
});

// Subjects and Study Cycles
export const subjects = pgTable("subjects", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  hours: integer("hours").notNull().default(0),
  minutes: integer("minutes").notNull().default(0),
});

export const globalSubjects = pgTable("global_subjects", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const studyCycles = pgTable("study_cycles", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  settingsId: varchar("settings_id").references(() => studySettings.id),
  totalWeeks: integer("total_weeks").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const cycleSubjects = pgTable("cycle_subjects", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  cycleId: varchar("cycle_id").references(() => studyCycles.id),
  globalSubjectId: varchar("global_subject_id").references(
    () => globalSubjects.id
  ),
  hours: integer("hours").notNull().default(0),
  minutes: integer("minutes").notNull().default(0),
});

// Courses and Learning Content
export const courses = pgTable("courses", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  level: text("level").notNull().default("beginner"),
  thumbnailUrl: text("thumbnail_url"),
  isCareer: boolean("is_career").notNull().default(false),
  estimatedHours: integer("estimated_hours").notNull().default(0),
  enrollmentCount: integer("enrollment_count").notNull().default(0),
  rating: integer("rating").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(false),
  creatorId: varchar("creator_id").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

export const courseModules = pgTable("course_modules", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").references(() => courses.id),
  title: text("title").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull().default(0),
  estimatedMinutes: integer("estimated_minutes").notNull().default(0),
});

export const courseContent = pgTable("course_content", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  moduleId: varchar("module_id").references(() => courseModules.id),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  duration: integer("duration"),
  orderIndex: integer("order_index").notNull(),
  isRequired: boolean("is_required").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userCourses = pgTable("user_courses", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  courseId: varchar("course_id").references(() => courses.id),
  currentModuleId: varchar("current_module_id").references(
    () => courseModules.id
  ),
  progress: integer("progress").notNull().default(0),
  isCompleted: boolean("is_completed").notNull().default(false),
  enrolledAt: timestamp("enrolled_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Social Learning
export const studyGroups = pgTable("study_groups", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: varchar("owner_id").references(() => users.id),
  subjectId: varchar("subject_id").references(() => subjects.id),
  maxMembers: integer("max_members").default(10),
  isPrivate: boolean("is_private").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const groupMembers = pgTable("group_members", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").references(() => studyGroups.id),
  userId: varchar("user_id").references(() => users.id),
  role: text("role").default("member"),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

// Gamification
// Tabelas de gamificação
export const userStats = pgTable("user_stats", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .references(() => users.id)
    .unique(),
  tasksCompleted: integer("tasks_completed").notNull().default(0),
  projectsCompleted: integer("projects_completed").notNull().default(0),
  certificatesEarned: integer("certificates_earned").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastStudyDate: timestamp("last_study_date"),
  currentXp: integer("current_xp").notNull().default(0),
  totalXp: integer("total_xp").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const leagues = pgTable("leagues", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  minXp: integer("min_xp").notNull().default(0),
  maxXp: integer("max_xp").notNull().default(0),
  orderIndex: integer("order_index").notNull().default(0),
  color: text("color").notNull(),
  icon: text("icon"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const studyStreaks = pgTable("study_streaks", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .references(() => users.id)
    .notNull(),
  date: timestamp("date").notNull(),
  minutesStudied: integer("minutes_studied").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = typeof userStats.$inferInsert;
export type League = typeof leagues.$inferSelect;
export type InsertLeague = typeof leagues.$inferInsert;
export type StudyStreak = typeof studyStreaks.$inferSelect;
export type InsertStudyStreak = typeof studyStreaks.$inferInsert;

export const achievements = pgTable("achievements", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  iconUrl: text("icon_url"),
  requirement: text("requirement").notNull(),
  xpReward: integer("xp_reward").notNull().default(0),
});

export const userAchievements = pgTable("user_achievements", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  achievementId: varchar("achievement_id").references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
});

// Analytics and Progress
export const studyAnalytics = pgTable("study_analytics", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  type: text("type").notNull(),
  value: integer("value").notNull(),
  metadata: jsonb("metadata"),
  recordedAt: timestamp("recorded_at").notNull().defaultNow(),
});

export const studyProgress = pgTable("study_progress", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  subjectId: varchar("subject_id").references(() => subjects.id),
  type: text("progress_type").notNull(),
  value: integer("progress_value").notNull(),
  metadata: jsonb("metadata"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Projects and Tasks
export const projects = pgTable("projects", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  courseId: varchar("course_id").references(() => courses.id),
  title: text("title").notNull(),
  description: text("description"),
  repositoryUrl: text("repository_url"),
  isCompleted: boolean("is_completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  isCompleted: boolean("is_completed").notNull().default(false),
  xpReward: integer("xp_reward").notNull().default(10),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
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

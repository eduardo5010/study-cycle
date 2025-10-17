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

// Courses and Careers
export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // e.g., "Programming", "Math", "Science"
  level: text("level").notNull().default("beginner"), // "beginner", "intermediate", "advanced"
  thumbnailUrl: text("thumbnail_url"),
  isCareer: boolean("is_career").notNull().default(false), // true if it's a career path
  estimatedHours: integer("estimated_hours").notNull().default(0),
  enrollmentCount: integer("enrollment_count").notNull().default(0),
  rating: integer("rating").notNull().default(0), // 0-5 stars * 100 (e.g., 450 = 4.5 stars)
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const courseModules = pgTable("course_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").references(() => courses.id),
  title: text("title").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull().default(0),
  estimatedMinutes: integer("estimated_minutes").notNull().default(0),
});

export const userCourses = pgTable("user_courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  courseId: varchar("course_id").references(() => courses.id),
  currentModuleId: varchar("current_module_id").references(() => courseModules.id),
  progress: integer("progress").notNull().default(0), // 0-100 percentage
  isCompleted: boolean("is_completed").notNull().default(false),
  enrolledAt: timestamp("enrolled_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Gamification
export const userXp = pgTable("user_xp", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).unique(),
  totalXp: integer("total_xp").notNull().default(0),
  monthlyXp: integer("monthly_xp").notNull().default(0),
  weeklyXp: integer("weekly_xp").notNull().default(0),
  dailyXp: integer("daily_xp").notNull().default(0),
  lastXpDate: text("last_xp_date"),
});

export const streaks = pgTable("streaks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).unique(),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  freezesUsed: integer("freezes_used").notNull().default(0),
  freezesAvailable: integer("freezes_available").notNull().default(2),
  lastStudyDate: text("last_study_date"),
});

export const leagues = pgTable("leagues", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // "Bronze", "Silver", "Gold", etc.
  minXp: integer("min_xp").notNull().default(0),
  orderIndex: integer("order_index").notNull().default(0),
});

export const userLeagues = pgTable("user_leagues", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  leagueId: varchar("league_id").references(() => leagues.id),
  monthlyXp: integer("monthly_xp").notNull().default(0),
  rank: integer("rank").notNull().default(0),
  month: text("month").notNull(), // "2025-01"
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  iconUrl: text("icon_url"),
  requirement: text("requirement").notNull(), // JSON string with achievement criteria
  xpReward: integer("xp_reward").notNull().default(0),
});

export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  achievementId: varchar("achievement_id").references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
});

export const certificates = pgTable("certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  courseId: varchar("course_id").references(() => courses.id),
  certificateUrl: text("certificate_url"),
  issuedAt: timestamp("issued_at").notNull().defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  isCompleted: boolean("is_completed").notNull().default(false),
  xpReward: integer("xp_reward").notNull().default(10),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  courseId: varchar("course_id").references(() => courses.id),
  title: text("title").notNull(),
  description: text("description"),
  repositoryUrl: text("repository_url"),
  isCompleted: boolean("is_completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // "achievement", "course", "league", "system"
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  enrollmentCount: true,
  rating: true,
  createdAt: true,
});

export const insertUserCourseSchema = createInsertSchema(userCourses).omit({
  id: true,
  enrolledAt: true,
  completedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

// Types
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type CourseModule = typeof courseModules.$inferSelect;

export type UserCourse = typeof userCourses.$inferSelect;
export type InsertUserCourse = z.infer<typeof insertUserCourseSchema>;

export type UserXp = typeof userXp.$inferSelect;
export type Streak = typeof streaks.$inferSelect;
export type League = typeof leagues.$inferSelect;
export type UserLeague = typeof userLeagues.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type Certificate = typeof certificates.$inferSelect;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type CourseWithProgress = Course & {
  progress?: number;
  currentModule?: CourseModule;
};

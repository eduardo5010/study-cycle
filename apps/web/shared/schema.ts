import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  varchar,
  boolean,
  real,
  jsonb,
  timestamp,
  uuid,
  text,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import type { Course as CourseType } from "./types/course";

// Base tables
export const users = pgTable("users", {
  id: uuid("id")
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
  memoryType: text("memory_type"), // 'good', 'average', 'poor'
  memoryLambda: real("memory_lambda"), // learning algorithm parameter
  githubId: text("github_id"),
  googleId: text("google_id"),
  githubProfile: jsonb("github_profile"),
  googleProfile: jsonb("google_profile"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

export const studySettings = pgTable("study_settings", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  wakeTime: text("wake_time").notNull().default("07:00"),
  sleepTime: text("sleep_time").notNull().default("23:00"),
  dailyStudyHours: integer("daily_study_hours").notNull().default(6),
  dailyStudyMinutes: integer("daily_study_minutes").notNull().default(0),
});

// Subjects and Study Cycles
export const subjects = pgTable("subjects", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  hours: integer("hours").notNull().default(0),
  minutes: integer("minutes").notNull().default(0),
});

export const globalSubjects = pgTable("global_subjects", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const studyCycles = pgTable("study_cycles", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  settingsId: uuid("settings_id").references(() => studySettings.id),
  totalWeeks: integer("total_weeks").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const cycleSubjects = pgTable("cycle_subjects", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  cycleId: uuid("cycle_id").references(() => studyCycles.id),
  globalSubjectId: uuid("global_subject_id").references(
    () => globalSubjects.id
  ),
  hours: integer("hours").notNull().default(0),
  minutes: integer("minutes").notNull().default(0),
});

// Courses and Learning Content
export const courses = pgTable("courses", {
  id: uuid("id")
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
  creatorId: uuid("creator_id").references(() => users.id),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

export const courseModules = pgTable("course_modules", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  courseId: uuid("course_id").references(() => courses.id),
  title: text("title").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull().default(0),
  estimatedMinutes: integer("estimated_minutes").notNull().default(0),
});

export const courseContent = pgTable("course_content", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  moduleId: uuid("module_id").references(() => courseModules.id),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  duration: integer("duration"),
  orderIndex: integer("order_index").notNull(),
  isRequired: boolean("is_required").default(true),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const userCourses = pgTable("user_courses", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  courseId: uuid("course_id").references(() => courses.id),
  currentModuleId: uuid("current_module_id").references(
    () => courseModules.id
  ),
  progress: integer("progress").notNull().default(0),
  isCompleted: boolean("is_completed").notNull().default(false),
  enrolledAt: timestamp("enrolled_at").default(sql`now()`).notNull(),
  completedAt: timestamp("completed_at"),
});

// Social Learning
export const studyGroups = pgTable("study_groups", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: uuid("owner_id").references(() => users.id),
  subjectId: uuid("subject_id").references(() => subjects.id),
  maxMembers: integer("max_members").default(10),
  isPrivate: boolean("is_private").default(false),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const groupMembers = pgTable("group_members", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  groupId: uuid("group_id").references(() => studyGroups.id),
  userId: uuid("user_id").references(() => users.id),
  role: text("role").default("member"),
  joinedAt: timestamp("joined_at").default(sql`now()`).notNull(),
});

// Gamification - Sistema Avançado
export const userStats = pgTable("user_stats", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .references(() => users.id)
    .unique(),
  // Estatísticas básicas
  tasksCompleted: integer("tasks_completed").notNull().default(0),
  projectsCompleted: integer("projects_completed").notNull().default(0),
  certificatesEarned: integer("certificates_earned").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastStudyDate: text("last_study_date"),

  // XP e níveis
  currentXp: integer("current_xp").notNull().default(0),
  totalXp: integer("total_xp").notNull().default(0),
  currentLevel: integer("current_level").notNull().default(1),
  levelProgress: integer("level_progress").notNull().default(0),

  // Métricas competitivas
  rankPosition: integer("rank_position"),
  competitiveScore: integer("competitive_score").notNull().default(0),
  wins: integer("wins").notNull().default(0),
  losses: integer("losses").notNull().default(0),
  draws: integer("draws").notNull().default(0),

  // Métricas colaborativas
  collaborativeScore: integer("collaborative_score").notNull().default(0),
  studyGroupsJoined: integer("study_groups_joined").notNull().default(0),
  studySessionsHosted: integer("study_sessions_hosted").notNull().default(0),
  peersHelped: integer("peers_helped").notNull().default(0),
  feedbackGiven: integer("feedback_given").notNull().default(0),

  // Estatísticas de aprendizado
  flashcardsReviewed: integer("flashcards_reviewed").notNull().default(0),
  flashcardsCreated: integer("flashcards_created").notNull().default(0),
  studyHoursTotal: integer("study_hours_total").notNull().default(0),
  subjectsMastered: integer("subjects_mastered").notNull().default(0),

  // Liga atual
  currentLeagueId: uuid("current_league_id").references(() => leagues.id),

  // Preferências de gamificação
  gamificationEnabled: boolean("gamification_enabled").notNull().default(true),
  competitivePreference: real("competitive_preference").notNull().default(0.5), // 0 = fully collaborative, 1 = fully competitive
  notificationsEnabled: boolean("notifications_enabled").notNull().default(true),

  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

export const leagues = pgTable("leagues", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  minXp: integer("min_xp").notNull().default(0),
  maxXp: integer("max_xp"),
  minUsers: integer("min_users").notNull().default(2),
  maxUsers: integer("max_users"),
  orderIndex: integer("order_index").notNull().default(0),
  color: text("color").notNull(),
  icon: text("icon"),
  badgeUrl: text("badge_url"),
  rewards: jsonb("rewards").default({}), // XP bonuses, badges, etc.
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

export const leagueSeasons = pgTable("league_seasons", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").notNull().default(false),
  totalParticipants: integer("total_participants").notNull().default(0),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const userLeagueHistory = pgTable("user_league_history", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  leagueId: uuid("league_id").references(() => leagues.id),
  seasonId: uuid("season_id").references(() => leagueSeasons.id),
  joinedAt: timestamp("joined_at").notNull(),
  leftAt: timestamp("left_at"),
  finalRank: integer("final_rank"),
  seasonXp: integer("season_xp").notNull().default(0),
  achievements: jsonb("achievements").default([]),
});

export const achievements = pgTable("achievements", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  longDescription: text("long_description"),
  iconUrl: text("icon_url"),
  badgeUrl: text("badge_url"),
  category: text("category").notNull(), // competitive, collaborative, learning, social
  requirementType: text("requirement_type").notNull(), // streak, xp, tasks, social, etc.
  requirementValue: integer("requirement_value").notNull(),
  requirementMetadata: jsonb("requirement_metadata").default({}),
  xpReward: integer("xp_reward").notNull().default(0),
  coinReward: integer("coin_reward").notNull().default(0),
  isRare: boolean("is_rare").notNull().default(false),
  isSeasonal: boolean("is_seasonal").notNull().default(false),
  maxUnlocks: integer("max_unlocks"), // null = unlimited
  isActive: boolean("is_active").notNull().default(true),
  unlockRate: real("unlock_rate"), // percentage of users who unlock this
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const userAchievements = pgTable("user_achievements", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  achievementId: uuid("achievement_id").references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").default(sql`now()`).notNull(),
  progressValue: integer("progress_value"), // for progressive achievements
  isNew: boolean("is_new").notNull().default(true), // shown in notifications
});

export const gamificationEvents = pgTable("gamification_events", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  eventType: text("event_type").notNull(), // study_session, flashcard_review, group_join, achievement_unlock, etc.
  eventData: jsonb("event_data").default({}),
  xpGained: integer("xp_gained").notNull().default(0),
  coinsGained: integer("coins_gained").notNull().default(0),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const challenges = pgTable("challenges", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // daily, weekly, monthly, seasonal
  category: text("category").notNull(), // competitive, collaborative, learning
  targetValue: integer("target_value").notNull(),
  targetUnit: text("target_unit").notNull(), // hours, tasks, xp, sessions, etc.
  durationDays: integer("duration_days").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  rewards: jsonb("rewards").default({}),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const userChallenges = pgTable("user_challenges", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  challengeId: uuid("challenge_id").references(() => challenges.id),
  joinedAt: timestamp("joined_at").default(sql`now()`).notNull(),
  currentValue: integer("current_value").notNull().default(0),
  isCompleted: boolean("is_completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  finalRank: integer("final_rank"),
  rewardsClaimed: boolean("rewards_claimed").notNull().default(false),
});

// Social Feed Tables
export const posts = pgTable("posts", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  authorId: uuid("author_id").references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  type: varchar("type", { length: 50 }).notNull().default("text"),
  mediaUrl: text("media_url"),
  mediaType: varchar("media_type", { length: 50 }),
  mediaMetadata: jsonb("media_metadata").default({}),
  isPinned: boolean("is_pinned").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  visibility: varchar("visibility", { length: 20 }).notNull().default("public"),
  tags: text("tags").array().default([]),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

export const stories = pgTable("stories", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  authorId: uuid("author_id").references(() => users.id, { onDelete: "cascade" }),
  content: text("content"),
  type: varchar("type", { length: 50 }).notNull().default("text"),
  mediaUrl: text("media_url"),
  mediaType: varchar("media_type"),
  mediaMetadata: jsonb("media_metadata").default({}),
  expiresAt: timestamp("expires_at").notNull(),
  isHighlighted: boolean("is_highlighted").notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const comments = pgTable("comments", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").references(() => users.id, { onDelete: "cascade" }),
  parentCommentId: uuid("parent_comment_id").references(() => comments.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  isEdited: boolean("is_edited").notNull().default(false),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

export const likes = pgTable("likes", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  targetType: varchar("target_type", { length: 20 }).notNull(),
  targetId: uuid("target_id").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const bookmarks = pgTable("bookmarks", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
  collectionName: varchar("collection_name", { length: 100 }).default("Default"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const follows = pgTable("follows", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  followerId: uuid("follower_id").references(() => users.id, { onDelete: "cascade" }),
  followingId: uuid("following_id").references(() => users.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const storyViews = pgTable("story_views", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  storyId: uuid("story_id").references(() => stories.id, { onDelete: "cascade" }),
  viewerId: uuid("viewer_id").references(() => users.id, { onDelete: "cascade" }),
  viewedAt: timestamp("viewed_at").default(sql`now()`).notNull(),
});

export const userInteractions = pgTable("user_interactions", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  interactionType: varchar("interaction_type", { length: 50 }).notNull(),
  targetType: varchar("target_type", { length: 50 }).notNull(),
  targetId: uuid("target_id").notNull(),
  weight: real("weight").notNull().default(1.0),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const studyStreaks = pgTable("study_streaks", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  date: text("date").notNull(),
  minutesStudied: integer("minutes_studied").notNull().default(0),
  tasksCompleted: integer("tasks_completed").notNull().default(0),
  xpGained: integer("xp_gained").notNull().default(0),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const leaderboardSnapshots = pgTable("leaderboard_snapshots", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  snapshotDate: timestamp("snapshot_date").default(sql`now()`).notNull(),
  leaderboardType: text("leaderboard_type").notNull(), // overall, weekly, monthly, league
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
  rankings: jsonb("rankings").notNull(), // array of {userId, score, rank, metadata}
  totalParticipants: integer("total_participants").notNull(),
});

// Type exports
export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = typeof userStats.$inferInsert;
export type League = typeof leagues.$inferSelect;
export type InsertLeague = typeof leagues.$inferInsert;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;
export type GamificationEvent = typeof gamificationEvents.$inferSelect;
export type InsertGamificationEvent = typeof gamificationEvents.$inferInsert;
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = typeof challenges.$inferInsert;
export type UserChallenge = typeof userChallenges.$inferSelect;
export type InsertUserChallenge = typeof userChallenges.$inferInsert;
export type StudyStreak = typeof studyStreaks.$inferSelect;
export type InsertStudyStreak = typeof studyStreaks.$inferInsert;

// Analytics and Progress
export const studyAnalytics = pgTable("study_analytics", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  type: text("type").notNull(),
  value: integer("value").notNull(),
  metadata: jsonb("metadata"),
  recordedAt: timestamp("recorded_at").default(sql`now()`).notNull(),
});

export const studyProgress = pgTable("study_progress", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  subjectId: uuid("subject_id").references(() => subjects.id),
  type: text("progress_type").notNull(),
  value: integer("progress_value").notNull(),
  metadata: jsonb("metadata"),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

// Projects and Tasks
export const projects = pgTable("projects", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  courseId: uuid("course_id").references(() => courses.id),
  title: text("title").notNull(),
  description: text("description"),
  repositoryUrl: text("repository_url"),
  isCompleted: boolean("is_completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  isCompleted: boolean("is_completed").notNull().default(false),
  xpReward: integer("xp_reward").notNull().default(10),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
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

// Social Feed Schemas
export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLikeSchema = createInsertSchema(likes).omit({
  id: true,
  createdAt: true,
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
  createdAt: true,
});

export const insertFollowSchema = createInsertSchema(follows).omit({
  id: true,
  createdAt: true,
});

export const insertStoryViewSchema = createInsertSchema(storyViews).omit({
  id: true,
  viewedAt: true,
});

export const insertUserInteractionSchema = createInsertSchema(userInteractions).omit({
  id: true,
  createdAt: true,
});

// Type exports for social feed tables
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type Story = typeof stories.$inferSelect;
export type InsertStory = z.infer<typeof insertStorySchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Like = typeof likes.$inferSelect;
export type InsertLike = z.infer<typeof insertLikeSchema>;

export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;

export type Follow = typeof follows.$inferSelect;
export type InsertFollow = z.infer<typeof insertFollowSchema>;

export type StoryView = typeof storyViews.$inferSelect;
export type InsertStoryView = z.infer<typeof insertStoryViewSchema>;

export type UserInteraction = typeof userInteractions.$inferSelect;
export type InsertUserInteraction = z.infer<typeof insertUserInteractionSchema>;

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

// Daily User Stats - tracks daily progress
export const dailyUserStats = pgTable("daily_user_stats", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  date: text("date").notNull(), // YYYY-MM-DD format
  studyMinutes: integer("study_minutes").notNull().default(0),
  flashcardsReviewed: integer("flashcards_reviewed").notNull().default(0),
  subjectsCompleted: integer("subjects_completed").notNull().default(0),
  accuracy: real("accuracy"), // 0-1 scale
  xpEarned: integer("xp_earned").notNull().default(0),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

// User Achievements Progress
export const userAchievementProgress = pgTable("user_achievement_progress", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id),
  achievementId: uuid("achievement_id").references(() => achievements.id),
  progress: integer("progress").notNull().default(0),
  isCompleted: boolean("is_completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

// Achievement definitions in database
export const achievementDefinitions = pgTable("achievement_definitions", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  bgColor: text("bg_color").notNull(),
  borderColor: text("border_color").notNull(),
  xpReward: integer("xp_reward").notNull().default(0),
  category: text("category").notNull(),
  requirementType: text("requirement_type").notNull(),
  requirementValue: integer("requirement_value").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

// Type exports for new tables
export type DailyUserStats = typeof dailyUserStats.$inferSelect;
export type InsertDailyUserStats = typeof dailyUserStats.$inferInsert;
export type UserAchievementProgress = typeof userAchievementProgress.$inferSelect;
export type InsertUserAchievementProgress = typeof userAchievementProgress.$inferInsert;
export type AchievementDefinition = typeof achievementDefinitions.$inferSelect;
export type InsertAchievementDefinition = typeof achievementDefinitions.$inferInsert;

// Gamification data interfaces
export interface GamificationStats {
  streak: {
    current: number;
    longest: number;
    days: string[];
    status: boolean[];
  };
  stats: {
    tasksCompleted: number;
    projectsCompleted: number;
    certificatesEarned: number;
    flashcardsReviewed: number;
    studyHoursTotal: number;
    subjectsMastered: number;
    averageAccuracy: number;
    totalXp: number;
    dailyStudyMinutes: number;
    dailyFlashcardsReviewed: number;
    dailySubjectsCompleted: number;
  };
  league: {
    name: string;
    rank: number;
    xp: number;
    topUsers: Array<{
      name: string;
      xp: number;
    }>;
  };
}

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

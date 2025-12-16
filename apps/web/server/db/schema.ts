import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const reviewEvents = sqliteTable("review_events", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  itemId: text("item_id"),
  timestamp: text("timestamp").default(sql`(datetime('now'))`),
  correctness: integer("correctness"),
  responseTimeMs: integer("response_time_ms"),
  nReps: integer("n_reps"),
  timeSinceLastReviewSec: integer("time_since_last_review_sec"),
  metadata: text("metadata", { mode: "json" }).$type<Record<string, any>>().default({}),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const reviewVariants = sqliteTable("review_variants", {
  id: text("id").primaryKey(),
  itemId: text("item_id"),
  authorId: text("author_id"),
  type: text("type"),
  content: text("content", { mode: "json" }).$type<Record<string, any>>().default({}),
  metadata: text("metadata", { mode: "json" }).$type<Record<string, any>>().default({}),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  lastUsedBy: text("last_used_by", { mode: "json" }).$type<Record<string, string>>().default({}),
});

export const userLambdas = sqliteTable("user_lambdas", {
  userId: text("user_id").primaryKey(),
  lambda: text("lambda"),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
  source: text("source"),
});

// Users table for persistent authentication records
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  isStudent: integer("is_student", { mode: "boolean" }).default(true),
  isTeacher: integer("is_teacher", { mode: "boolean" }).default(false),
  isAdmin: integer("is_admin", { mode: "boolean" }).default(false),
  bio: text("bio"),
  avatar: text("avatar"),
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
  githubId: text("github_id"),
  googleId: text("google_id"),
  facebookId: text("facebook_id"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// User Statistics table for dashboard data
export const userStats = sqliteTable("user_stats", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  totalStudyTime: integer("total_study_time").default(0), // in minutes
  totalFlashcardsReviewed: integer("total_flashcards_reviewed").default(0),
  totalCoursesEnrolled: integer("total_courses_enrolled").default(0),
  totalCoursesCompleted: integer("total_courses_completed").default(0),
  averageScore: integer("average_score").default(0), // percentage
  lastActivityDate: text("last_activity_date"),
  weeklyGoal: integer("weekly_goal").default(420), // minutes per week
  monthlyGoal: integer("monthly_goal").default(1800), // minutes per month
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// Teacher Statistics table
export const teacherStats = sqliteTable("teacher_stats", {
  id: text("id").primaryKey(),
  teacherId: text("teacher_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  totalStudents: integer("total_students").default(0),
  activeCourses: integer("active_courses").default(0),
  totalRevenue: integer("total_revenue").default(0), // in cents
  averageRating: integer("average_rating").default(0), // multiplied by 10 (4.8 = 48)
  totalRatings: integer("total_ratings").default(0),
  completionRate: integer("completion_rate").default(0), // percentage
  monthlyGrowth: integer("monthly_growth").default(0), // percentage
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// Courses table
export const courses = sqliteTable("courses", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  instructorId: text("instructor_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  price: integer("price").default(0), // in cents
  originalPrice: integer("original_price"), // in cents
  thumbnail: text("thumbnail"),
  category: text("category"),
  level: text("level"), // beginner, intermediate, advanced
  language: text("language").default("pt-BR"),
  duration: integer("duration"), // in minutes
  totalLessons: integer("total_lessons").default(0),
  status: text("status").default("draft"), // draft, published, archived
  isPublished: integer("is_published", { mode: "boolean" }).default(false),
  publishedAt: text("published_at"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// Course Enrollments table
export const courseEnrollments = sqliteTable("course_enrollments", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  studentId: text("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  enrollmentDate: text("enrollment_date").default(sql`(datetime('now'))`),
  completionDate: text("completion_date"),
  progress: integer("progress").default(0), // percentage
  lastAccessedAt: text("last_accessed_at"),
  certificateIssued: integer("certificate_issued", { mode: "boolean" }).default(false),
  certificateUrl: text("certificate_url"),
  totalTimeSpent: integer("total_time_spent").default(0), // in minutes
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// Course Ratings table
export const courseRatings = sqliteTable("course_ratings", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  studentId: text("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
  helpfulVotes: integer("helpful_votes").default(0),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// Notifications table
export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // course_enrollment, rating_received, payment, system, etc.
  title: text("title").notNull(),
  message: text("message").notNull(),
  data: text("data", { mode: "json" }).$type<Record<string, any>>().default({}),
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  readAt: text("read_at"),
  priority: text("priority").default("normal"), // low, normal, high, urgent
  expiresAt: text("expires_at"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

// Course Analytics table
export const courseAnalytics = sqliteTable("course_analytics", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  date: text("date").notNull(), // YYYY-MM-DD format
  views: integer("views").default(0),
  enrollments: integer("enrollments").default(0),
  completions: integer("completions").default(0),
  revenue: integer("revenue").default(0), // in cents
  averageRating: integer("average_rating").default(0), // multiplied by 10
  totalRatings: integer("total_ratings").default(0),
  timeSpent: integer("time_spent").default(0), // in minutes
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

// Teacher Analytics table (monthly aggregations)
export const teacherAnalytics = sqliteTable("teacher_analytics", {
  id: text("id").primaryKey(),
  teacherId: text("teacher_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  period: text("period").notNull(), // YYYY-MM format
  totalStudents: integer("total_students").default(0),
  newStudents: integer("new_students").default(0),
  totalRevenue: integer("total_revenue").default(0), // in cents
  courseRevenue: integer("course_revenue").default(0), // in cents
  averageRating: integer("average_rating").default(0), // multiplied by 10
  totalRatings: integer("total_ratings").default(0),
  completionRate: integer("completion_rate").default(0), // percentage
  totalViews: integer("total_views").default(0),
  totalEnrollments: integer("total_enrollments").default(0),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

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

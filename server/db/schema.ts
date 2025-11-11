import { pgTable, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";

export const reviewEvents = pgTable("review_events", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  itemId: text("item_id"),
  timestamp: timestamp("timestamp", { mode: "string" }).defaultNow(),
  correctness: integer("correctness"),
  responseTimeMs: integer("response_time_ms").$type<number | null>(),
  nReps: integer("n_reps").$type<number | null>(),
  timeSinceLastReviewSec: integer("time_since_last_review_sec").$type<
    number | null
  >(),
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

export const reviewVariants = pgTable("review_variants", {
  id: text("id").primaryKey(),
  itemId: text("item_id"),
  authorId: text("author_id").$type<string | null>(),
  type: text("type"),
  content: jsonb("content").$type<Record<string, any>>().default({}),
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  lastUsedBy: jsonb("last_used_by").$type<Record<string, string>>().default({}),
});

export const userLambdas = pgTable("user_lambdas", {
  userId: text("user_id").primaryKey(),
  lambda: text("lambda"),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  source: text("source").$type<string | null>(),
});

// Users table for persistent authentication records
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  isStudent: integer("is_student").$type<number | null>().default(1),
  isTeacher: integer("is_teacher").$type<number | null>().default(0),
  isAdmin: integer("is_admin").$type<number | null>().default(0),
  bio: text("bio").$type<string | null>(),
  avatar: text("avatar").$type<string | null>(),
  isVerified: integer("is_verified").$type<number | null>().default(0),
  githubId: text("github_id").$type<string | null>(),
  googleId: text("google_id").$type<string | null>(),
  facebookId: text("facebook_id").$type<string | null>(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

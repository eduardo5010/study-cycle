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

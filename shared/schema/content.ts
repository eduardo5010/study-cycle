import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import type { Course } from "../types/course";
import { users } from "../schema";

export const content = pgTable("content", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // "COURSE", "SUBJECT", "MODULE", etc.
  contentType: text("content_type"), // video, pdf, etc
  contentUrl: text("content_url"),
  thumbnailUrl: text("thumbnail_url"),
  tags: jsonb("tags").$type<string[]>(),
  isPublished: boolean("is_published").notNull().default(false),
  metadata: jsonb("metadata").$type<Course>(),
  creatorId: varchar("creator_id")
    .references(() => users.id)
    .notNull(),
  teacherId: varchar("teacher_id").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Content = typeof content.$inferSelect;
export type InsertContent = typeof content.$inferInsert;

export const insertContentSchema = z.object({
  title: z.string(),
  type: z.string(),
  creatorId: z.string(),
  description: z.string().optional().nullable(),
  contentType: z.string().optional().nullable(),
  contentUrl: z.string().optional().nullable(),
  thumbnailUrl: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  isPublished: z.boolean().optional(),
  metadata: z.custom<Course>().optional().nullable(),
  teacherId: z.string().optional().nullable(),
});

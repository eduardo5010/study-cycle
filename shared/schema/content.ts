import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import type { Course } from "../types/course";
import { users } from "../schema";

export const content = sqliteTable("content", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // "COURSE", "SUBJECT", "MODULE", etc.
  contentType: text("content_type"), // video, pdf, etc
  contentUrl: text("content_url"),
  thumbnailUrl: text("thumbnail_url"),
  tags: text("tags", { mode: "json" }).$type<string[]>(),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(false),
  metadata: text("metadata", { mode: "json" }).$type<Course>(),
  creatorId: text("creator_id")
    .references(() => users.id)
    .notNull(),
  teacherId: text("teacher_id").references(() => users.id),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
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

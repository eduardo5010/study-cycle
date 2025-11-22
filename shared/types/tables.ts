import { sql } from "drizzle-orm";
import { sqliteTable, text, timestamp, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import type { Course } from "@shared/types/course";
import { users } from "../schema";

export const content = sqliteTable("content", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // "COURSE", "SUBJECT", "MODULE", etc.
  data: text("data", { mode: "json" }).notNull().$type<Course>(), // Course, Subject, Module, etc.
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export const insertContentSchema = createInsertSchema(content).extend({
  data: z.custom<Course>(),
});

export type Content = typeof content.$inferSelect;
export type InsertContent = typeof content.$inferInsert;

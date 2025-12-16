import { sql } from "drizzle-orm";
import { pgTable, text, uuid, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import type { Course } from "@shared/types/course";
import { users } from "../schema";

export const content = pgTable("content", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // "COURSE", "SUBJECT", "MODULE", etc.
  data: jsonb("data").notNull().$type<Course>(), // Course, Subject, Module, etc.
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const insertContentSchema = createInsertSchema(content).extend({
  data: z.custom<Course>(),
});

export type Content = typeof content.$inferSelect;
export type InsertContent = typeof content.$inferInsert;

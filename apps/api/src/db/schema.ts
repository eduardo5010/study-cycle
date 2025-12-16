import {
  pgTable,
  text,
  varchar,
  timestamp,
  uuid,
  boolean,
  integer,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Users table
export const users = pgTable(
  'users',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: text('password').notNull(),
    firstName: varchar('first_name', { length: 100 }),
    lastName: varchar('last_name', { length: 100 }),
    avatar: text('avatar'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index('users_email_idx').on(table.email),
  })
);

// Study Cycles table
export const studyCycles = pgTable(
  'study_cycles',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('study_cycles_user_id_idx').on(table.userId),
  })
);

// Subjects table
export const subjects = pgTable(
  'subjects',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    studyCycleId: uuid('study_cycle_id')
      .notNull()
      .references(() => studyCycles.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    code: varchar('code', { length: 50 }),
    description: text('description'),
    credits: integer('credits'),
    color: varchar('color', { length: 7 }), // Hex color code
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    studyCycleIdIdx: index('subjects_study_cycle_id_idx').on(table.studyCycleId),
  })
);

// Courses table (aka "Disciplinas")
export const courses = pgTable(
  'courses',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    subjectId: uuid('subject_id')
      .notNull()
      .references(() => subjects.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    teacher: varchar('teacher', { length: 255 }),
    schedule: varchar('schedule', { length: 255 }), // e.g., "Seg/Qua 10:00-12:00"
    room: varchar('room', { length: 100 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    subjectIdIdx: index('courses_subject_id_idx').on(table.subjectId),
  })
);

// Sync logs table (for tracking offline changes)
export const syncLogs = pgTable(
  'sync_logs',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    entityType: varchar('entity_type', { length: 50 }).notNull(), // 'study_cycle', 'subject', 'course'
    entityId: uuid('entity_id').notNull(),
    operation: varchar('operation', { length: 20 }).notNull(), // 'create', 'update', 'delete'
    changes: jsonb('changes'), // Store the actual changes
    synced: boolean('synced').notNull().default(false),
    syncedAt: timestamp('synced_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('sync_logs_user_id_idx').on(table.userId),
    syncedIdx: index('sync_logs_synced_idx').on(table.synced),
  })
);

// Sync queue table (for pending synchronization)
export const syncQueue = pgTable(
  'sync_queue',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    payload: jsonb('payload').notNull(),
    retries: integer('retries').notNull().default(0),
    lastError: text('last_error'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('sync_queue_user_id_idx').on(table.userId),
  })
);

export type User = typeof users.$inferSelect;
export type StudyCycle = typeof studyCycles.$inferSelect;
export type Subject = typeof subjects.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type SyncLog = typeof syncLogs.$inferSelect;
export type SyncQueue = typeof syncQueue.$inferSelect;

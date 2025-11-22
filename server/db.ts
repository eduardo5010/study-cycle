import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./db/schema";

// Initialize SQLite database
const dbPath = process.env.DATABASE_URL || "./database.sqlite";

// Create database connection
const sqlite = new Database(dbPath);

// Enable foreign keys
sqlite.pragma("foreign_keys = ON");

// Create drizzle instance
export const db = drizzle(sqlite, { schema });

export default db;

// Ensure tables exist when running in development
// This is a best-effort convenience: in production prefer proper migrations
(async function ensureTables() {
  try {
    // Users table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        is_student INTEGER DEFAULT 1,
        is_teacher INTEGER DEFAULT 0,
        is_admin INTEGER DEFAULT 0,
        bio TEXT,
        avatar TEXT,
        is_verified INTEGER DEFAULT 0,
        github_id TEXT,
        google_id TEXT,
        facebook_id TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);

    // Review events table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS review_events (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        item_id TEXT,
        timestamp TEXT DEFAULT (datetime('now')),
        correctness INTEGER,
        response_time_ms INTEGER,
        n_reps INTEGER,
        time_since_last_review_sec INTEGER,
        metadata TEXT DEFAULT '{}',
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);

    // Review variants table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS review_variants (
        id TEXT PRIMARY KEY,
        item_id TEXT,
        author_id TEXT,
        type TEXT,
        content TEXT DEFAULT '{}',
        metadata TEXT DEFAULT '{}',
        created_at TEXT DEFAULT (datetime('now')),
        last_used_by TEXT DEFAULT '{}'
      );
    `);

    // User lambdas table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS user_lambdas (
        user_id TEXT PRIMARY KEY,
        lambda TEXT,
        updated_at TEXT DEFAULT (datetime('now')),
        source TEXT
      );
    `);
  } catch (err) {
    // ignore - database may be unavailable in some environments
    console.warn(
      "Could not ensure tables exist:",
      (err as any)?.message || err
    );
  }
})();

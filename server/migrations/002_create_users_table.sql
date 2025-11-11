-- Migration: create users table
-- Run with psql or drizzle-kit

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
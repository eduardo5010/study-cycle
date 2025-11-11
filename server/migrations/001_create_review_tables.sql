-- Migration: create review_events, review_variants, user_lambdas
-- Run with psql or drizzle-kit

CREATE TABLE IF NOT EXISTS review_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  correctness INTEGER NOT NULL,
  response_time_ms INTEGER,
  n_reps INTEGER,
  time_since_last_review_sec INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_review_events_user_id ON review_events(user_id);
CREATE INDEX IF NOT EXISTS idx_review_events_item_id ON review_events(item_id);
CREATE INDEX IF NOT EXISTS idx_review_events_created_at ON review_events(created_at);

CREATE TABLE IF NOT EXISTS review_variants (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  author_id TEXT,
  type TEXT NOT NULL,
  content JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_by JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_review_variants_item_id ON review_variants(item_id);

CREATE TABLE IF NOT EXISTS user_lambdas (
  user_id TEXT PRIMARY KEY,
  lambda TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT
);

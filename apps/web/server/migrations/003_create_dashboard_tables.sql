-- Migration: create dashboard tables for user and teacher data
-- Run with psql or drizzle-kit

-- User Statistics table
CREATE TABLE IF NOT EXISTS user_stats (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_study_time INTEGER DEFAULT 0, -- in minutes
  total_flashcards_reviewed INTEGER DEFAULT 0,
  total_courses_enrolled INTEGER DEFAULT 0,
  total_courses_completed INTEGER DEFAULT 0,
  average_score INTEGER DEFAULT 0, -- percentage
  last_activity_date TEXT,
  weekly_goal INTEGER DEFAULT 0, -- minutes per week
  monthly_goal INTEGER DEFAULT 0, -- minutes per month
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);

-- Teacher Statistics table
CREATE TABLE IF NOT EXISTS teacher_stats (
  id TEXT PRIMARY KEY,
  teacher_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_students INTEGER DEFAULT 0,
  active_courses INTEGER DEFAULT 0,
  total_revenue INTEGER DEFAULT 0, -- in cents
  average_rating INTEGER DEFAULT 0, -- multiplied by 10 (4.8 = 48)
  total_ratings INTEGER DEFAULT 0,
  completion_rate INTEGER DEFAULT 0, -- percentage
  monthly_growth INTEGER DEFAULT 0, -- percentage
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teacher_stats_teacher_id ON teacher_stats(teacher_id);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  instructor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  price INTEGER DEFAULT 0, -- in cents
  original_price INTEGER, -- in cents
  thumbnail TEXT,
  category TEXT,
  level TEXT, -- beginner, intermediate, advanced
  language TEXT DEFAULT 'pt-BR',
  duration INTEGER, -- in minutes
  total_lessons INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft', -- draft, published, archived
  is_published INTEGER DEFAULT 0,
  published_at TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);

-- Course Enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  completion_date TEXT,
  progress INTEGER DEFAULT 0, -- percentage
  last_accessed_at TEXT,
  certificate_issued INTEGER DEFAULT 0,
  certificate_url TEXT,
  total_time_spent INTEGER DEFAULT 0, -- in minutes
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_student_id ON course_enrollments(student_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_course_enrollments_unique ON course_enrollments(course_id, student_id);

-- Course Ratings table
CREATE TABLE IF NOT EXISTS course_ratings (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL, -- 1-5 stars
  review TEXT,
  is_verified INTEGER DEFAULT 0,
  helpful_votes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_course_ratings_course_id ON course_ratings(course_id);
CREATE INDEX IF NOT EXISTS idx_course_ratings_student_id ON course_ratings(student_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_course_ratings_unique ON course_ratings(course_id, student_id);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- course_enrollment, rating_received, payment, system, etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read INTEGER DEFAULT 0,
  read_at TEXT,
  priority TEXT DEFAULT 'normal', -- low, normal, high, urgent
  expires_at TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Course Analytics table
CREATE TABLE IF NOT EXISTS course_analytics (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  date TEXT NOT NULL, -- YYYY-MM-DD format
  views INTEGER DEFAULT 0,
  enrollments INTEGER DEFAULT 0,
  completions INTEGER DEFAULT 0,
  revenue INTEGER DEFAULT 0, -- in cents
  average_rating INTEGER DEFAULT 0, -- multiplied by 10
  total_ratings INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in minutes
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_course_analytics_course_id ON course_analytics(course_id);
CREATE INDEX IF NOT EXISTS idx_course_analytics_date ON course_analytics(date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_course_analytics_unique ON course_analytics(course_id, date);

-- Teacher Analytics table (monthly aggregations)
CREATE TABLE IF NOT EXISTS teacher_analytics (
  id TEXT PRIMARY KEY,
  teacher_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  period TEXT NOT NULL, -- YYYY-MM format
  total_students INTEGER DEFAULT 0,
  new_students INTEGER DEFAULT 0,
  total_revenue INTEGER DEFAULT 0, -- in cents
  course_revenue INTEGER DEFAULT 0, -- in cents
  average_rating INTEGER DEFAULT 0, -- multiplied by 10
  total_ratings INTEGER DEFAULT 0,
  completion_rate INTEGER DEFAULT 0, -- percentage
  total_views INTEGER DEFAULT 0,
  total_enrollments INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teacher_analytics_teacher_id ON teacher_analytics(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_analytics_period ON teacher_analytics(period);
CREATE UNIQUE INDEX IF NOT EXISTS idx_teacher_analytics_unique ON teacher_analytics(teacher_id, period);

-- Create daily user stats table
CREATE TABLE IF NOT EXISTS daily_user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  date TEXT NOT NULL,
  study_minutes INTEGER NOT NULL DEFAULT 0,
  flashcards_reviewed INTEGER NOT NULL DEFAULT 0,
  subjects_completed INTEGER NOT NULL DEFAULT 0,
  accuracy REAL,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create achievement definitions table
CREATE TABLE IF NOT EXISTS achievement_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  bg_color TEXT NOT NULL,
  border_color TEXT NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create user achievement progress table
CREATE TABLE IF NOT EXISTS user_achievement_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  achievement_id UUID REFERENCES achievement_definitions(id),
  progress INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Insert default achievement definitions
INSERT INTO achievement_definitions (code, title, description, icon, color, bg_color, border_color, xp_reward, category, requirement_type, requirement_value) VALUES
('math-session', 'Completed Mathematics session', 'Completed a study session', 'BookOpen', 'text-green-500', 'bg-green-50 dark:bg-green-900/20', 'border-green-200 dark:border-green-800', 25, 'learning', 'session_completed', 1),
('flashcards-reviewed', 'Reviewed 20 flashcards', 'Physics chapter 3', 'Zap', 'text-blue-500', 'bg-blue-50 dark:bg-blue-900/20', 'border-blue-200 dark:border-blue-800', 15, 'learning', 'flashcards_reviewed', 20),
('study-streak', 'Achieved 7-day study streak', 'Keep it up!', 'Trophy', 'text-purple-500', 'bg-purple-50 dark:bg-purple-900/20', 'border-purple-200 dark:border-purple-800', 50, 'consistency', 'streak_days', 7),
('first-task', 'Completed first task', 'Welcome to your learning journey!', 'Target', 'text-orange-500', 'bg-orange-50 dark:bg-orange-900/20', 'border-orange-200 dark:border-orange-800', 10, 'learning', 'tasks_completed', 1),
('study-hours', 'Studied for 10 hours', 'Great dedication to learning!', 'Flame', 'text-red-500', 'bg-red-50 dark:bg-red-900/20', 'border-red-200 dark:border-red-800', 100, 'dedication', 'study_hours', 10),
('perfect-score', 'Achieved perfect score', '100% accuracy in a session!', 'Star', 'text-yellow-500', 'bg-yellow-50 dark:bg-yellow-900/20', 'border-yellow-200 dark:border-yellow-800', 75, 'accuracy', 'perfect_session', 1)
ON CONFLICT (code) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_user_stats_user_date ON daily_user_stats(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_user_stats_date ON daily_user_stats(date);
CREATE INDEX IF NOT EXISTS idx_user_achievement_progress_user ON user_achievement_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievement_progress_completed ON user_achievement_progress(is_completed);
CREATE INDEX IF NOT EXISTS idx_achievement_definitions_active ON achievement_definitions(is_active);

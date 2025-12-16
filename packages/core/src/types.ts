// Shared types for StudyCycle

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  isStudent: boolean;
  isTeacher: boolean;
  isAdmin: boolean;
  bio?: string;
  avatar?: string;
  isVerified: boolean;
  memoryType?: 'good' | 'average' | 'poor';
  memoryLambda?: number;
  githubId?: string;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  hours: number;
  minutes: number;
}

export interface GlobalSubject {
  id: string;
  name: string;
  createdAt: string;
}

export interface StudyCycle {
  id: string;
  name: string;
  settingsId: string;
  totalWeeks: number;
  createdAt: string;
}

export interface StudySettings {
  id: string;
  userId: string;
  wakeTime: string;
  sleepTime: string;
  dailyStudyHours: number;
  dailyStudyMinutes: number;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  category: string;
  level: string;
  thumbnailUrl?: string;
  isCareer: boolean;
  estimatedHours: number;
  enrollmentCount: number;
  rating: number;
  isPublished: boolean;
  creatorId?: string;
  createdAt: string;
  updatedAt: string;
}

// Gamification types
export interface UserStats {
  id: string;
  userId: string;
  tasksCompleted: number;
  projectsCompleted: number;
  certificatesEarned: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate?: string;
  currentXp: number;
  totalXp: number;
  currentLevel: number;
  levelProgress: number;
  rankPosition?: number;
  competitiveScore: number;
  collaborativeScore: number;
  gamificationEnabled: boolean;
  notificationsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  longDescription?: string;
  iconUrl?: string;
  badgeUrl?: string;
  category: string;
  requirementType: string;
  requirementValue: number;
  xpReward: number;
  coinReward: number;
  isRare: boolean;
  isSeasonal: boolean;
  maxUnlocks?: number;
  isActive: boolean;
  unlockRate?: number;
  createdAt: string;
}

// Sync types for mobile/desktop sync
export interface SyncMetadata {
  lastSyncedAt?: string;
  version: number;
  deviceId: string;
}

export interface SyncableEntity {
  id: string;
  _syncMetadata: SyncMetadata;
}

// Common response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Form types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  isStudent?: boolean;
  isTeacher?: boolean;
}

// Schedule types
export interface ScheduleSlot {
  subjectId: string;
  subjectName: string;
  startTime: string;
  endTime: string;
  duration: number;
}

export interface DaySchedule {
  day: string;
  date: string;
  slots: ScheduleSlot[];
  totalMinutes: number;
}

export interface WeekSchedule {
  weekNumber: number;
  days: DaySchedule[];
}

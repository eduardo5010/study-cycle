import { z } from 'zod';

// User schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  password: z.string().optional(),
  name: z.string().min(1),
  isStudent: z.boolean(),
  isTeacher: z.boolean(),
  isAdmin: z.boolean(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  isVerified: z.boolean(),
  memoryType: z.enum(['good', 'average', 'poor']).optional(),
  memoryLambda: z.number().optional(),
  githubId: z.string().optional(),
  googleId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Subject schemas
export const subjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  hours: z.number().min(0),
  minutes: z.number().min(0),
});

export const globalSubjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  createdAt: z.string(),
});

// Study cycle schemas
export const studySettingsSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  wakeTime: z.string(),
  sleepTime: z.string(),
  dailyStudyHours: z.number().min(0),
  dailyStudyMinutes: z.number().min(0),
});

export const studyCycleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  settingsId: z.string().uuid(),
  totalWeeks: z.number().min(1),
  createdAt: z.string(),
});

// Course schemas
export const courseSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  level: z.string().min(1),
  thumbnailUrl: z.string().optional(),
  isCareer: z.boolean(),
  estimatedHours: z.number().min(0),
  enrollmentCount: z.number().min(0),
  rating: z.number().min(0).max(5),
  isPublished: z.boolean(),
  creatorId: z.string().uuid().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Gamification schemas
export const userStatsSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  tasksCompleted: z.number().min(0),
  projectsCompleted: z.number().min(0),
  certificatesEarned: z.number().min(0),
  currentStreak: z.number().min(0),
  longestStreak: z.number().min(0),
  lastStudyDate: z.string().optional(),
  currentXp: z.number().min(0),
  totalXp: z.number().min(0),
  currentLevel: z.number().min(1),
  levelProgress: z.number().min(0),
  rankPosition: z.number().optional(),
  competitiveScore: z.number().min(0),
  collaborativeScore: z.number().min(0),
  gamificationEnabled: z.boolean(),
  notificationsEnabled: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const achievementSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  longDescription: z.string().optional(),
  iconUrl: z.string().optional(),
  badgeUrl: z.string().optional(),
  category: z.string().min(1),
  requirementType: z.string().min(1),
  requirementValue: z.number().min(0),
  xpReward: z.number().min(0),
  coinReward: z.number().min(0),
  isRare: z.boolean(),
  isSeasonal: z.boolean(),
  maxUnlocks: z.number().optional(),
  isActive: z.boolean(),
  unlockRate: z.number().optional(),
  createdAt: z.string(),
});

// Form validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  name: z.string().min(1, 'Name is required'),
  isStudent: z.boolean().optional(),
  isTeacher: z.boolean().optional(),
}).refine((data: any) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const createSubjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  hours: z.number().min(0),
  minutes: z.number().min(0),
});

export const createStudyCycleSchema = z.object({
  name: z.string().min(1, 'Cycle name is required'),
  totalWeeks: z.number().min(1, 'Must have at least 1 week'),
});

// Sync schemas
export const syncMetadataSchema = z.object({
  lastSyncedAt: z.string().optional(),
  version: z.number().min(0),
  deviceId: z.string().min(1),
});

// API response schemas
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  });

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    hasMore: z.boolean(),
  });

// Schedule schemas
export const scheduleSlotSchema = z.object({
  subjectId: z.string().uuid(),
  subjectName: z.string().min(1),
  startTime: z.string(),
  endTime: z.string(),
  duration: z.number().min(0),
});

export const dayScheduleSchema = z.object({
  day: z.string(),
  date: z.string(),
  slots: z.array(scheduleSlotSchema),
  totalMinutes: z.number().min(0),
});

export const weekScheduleSchema = z.object({
  weekNumber: z.number().min(1),
  days: z.array(dayScheduleSchema),
});

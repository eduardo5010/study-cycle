import { z } from "zod";

// Base types
export interface User {
  id: string;
  email: string;
  password: string;
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
  githubProfile?: any;
  googleProfile?: any;
  createdAt: string;
  updatedAt: string;
}

export interface StudySettings {
  id: string;
  userId: string;
  wakeTime: string;
  sleepTime: string;
  dailyStudyHours: number;
  dailyStudyMinutes: number;
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

export interface CycleSubject {
  id: string;
  cycleId: string;
  globalSubjectId: string;
  hours: number;
  minutes: number;
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
  wins: number;
  losses: number;
  draws: number;
  collaborativeScore: number;
  studyGroupsJoined: number;
  studySessionsHosted: number;
  peersHelped: number;
  feedbackGiven: number;
  flashcardsReviewed: number;
  flashcardsCreated: number;
  studyHoursTotal: number;
  subjectsMastered: number;
  currentLeagueId?: string;
  gamificationEnabled: boolean;
  competitivePreference: number;
  notificationsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface League {
  id: string;
  name: string;
  description?: string;
  minXp: number;
  maxXp?: number;
  minUsers: number;
  maxUsers?: number;
  orderIndex: number;
  color: string;
  icon?: string;
  badgeUrl?: string;
  rewards: any;
  isActive: boolean;
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
  requirementMetadata: any;
  xpReward: number;
  coinReward: number;
  isRare: boolean;
  isSeasonal: boolean;
  maxUnlocks?: number;
  isActive: boolean;
  unlockRate?: number;
  createdAt: string;
}

// Social types
export interface Post {
  id: string;
  authorId: string;
  content: string;
  type: string;
  mediaUrl?: string;
  mediaType?: string;
  mediaMetadata: any;
  isPinned: boolean;
  isFeatured: boolean;
  visibility: string;
  tags: string[];
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  subjectId?: string;
  maxMembers: number;
  isPrivate: boolean;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form schemas
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

export const createCycleSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  totalWeeks: z.number().min(1, 'Deve ter pelo menos 1 semana'),
  dailyStudyHours: z.number().min(0),
  dailyStudyMinutes: z.number().min(0).max(59),
  wakeTime: z.string(),
  sleepTime: z.string(),
});

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type CreateCycleData = z.infer<typeof createCycleSchema>;

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Home: undefined;
  Cycles: undefined;
  Flashcards: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  MemoryAssessment: undefined;
};

// Custom types for mobile app
export interface ScheduleSlot {
  subjectId: string;
  subjectName: string;
  startTime: string;
  endTime: string;
  duration: number;
  isCompleted?: boolean;
}

export interface DaySchedule {
  day: string;
  date: string;
  slots: ScheduleSlot[];
  totalMinutes: number;
  isCompleted?: boolean;
}

export interface WeekSchedule {
  weekNumber: number;
  days: DaySchedule[];
  isCompleted?: boolean;
}

export interface CycleSubjectWithDetails extends CycleSubject {
  globalSubject: GlobalSubject;
}

export interface StudyCycleData {
  cycle: StudyCycle;
  settings: StudySettings;
  subjects: Subject[];
  cycleSubjects: CycleSubjectWithDetails[];
  weeks: WeekSchedule[];
  progress: {
    completedWeeks: number;
    totalWeeks: number;
    completedSubjects: number;
    totalSubjects: number;
  };
}

// Flashcard types
export interface Flashcard {
  id: string;
  userId: string;
  front: string;
  back: string;
  category?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  nextReview: string;
  interval: number;
  easeFactor: number;
  repetitions: number;
  createdAt: string;
  updatedAt: string;
}

export interface FlashcardReview {
  flashcardId: string;
  quality: number; // 0-5 scale
  responseTime: number;
}

// Notification types
export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'study_reminder' | 'achievement' | 'social' | 'system';
  isRead: boolean;
  createdAt: string;
  data?: any;
}

// File upload types
export interface FileUploadResult {
  uri: string;
  name: string;
  type: string;
  size: number;
}

export interface OCRResult {
  text: string;
  confidence: number;
  language?: string;
}

import { BookOpen, Zap, Trophy, Star, Target, Flame } from "lucide-react";
import type { GamificationStats } from "@shared/schema";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  xpReward: number;
  timeAgo: string;
  isUnlocked: boolean;
}

// Achievement definitions with their unlock conditions
export const ACHIEVEMENT_DEFINITIONS = {
  mathSession: {
    id: 'math-session',
    title: 'Completed Mathematics session',
    description: 'Completed a study session',
    icon: BookOpen,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
    xpReward: 25,
    // Always unlocked for demo purposes - in real app would check recent study sessions
    checkUnlock: (stats: any) => true,
  },
  flashcardsReviewed: {
    id: 'flashcards-reviewed',
    title: 'Reviewed 20 flashcards',
    description: 'Physics chapter 3',
    icon: Zap,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    xpReward: 15,
    checkUnlock: (stats: any) => (stats?.stats?.flashcardsReviewed || 0) >= 20,
  },
  studyStreak: {
    id: 'study-streak',
    title: 'Achieved 7-day study streak',
    description: 'Keep it up!',
    icon: Trophy,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    xpReward: 50,
    checkUnlock: (stats: any) => (stats?.streak?.current || 0) >= 7,
  },
  firstTask: {
    id: 'first-task',
    title: 'Completed first task',
    description: 'Welcome to your learning journey!',
    icon: Target,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    xpReward: 10,
    checkUnlock: (stats: any) => (stats?.stats?.tasksCompleted || 0) >= 1,
  },
  studyHours: {
    id: 'study-hours',
    title: 'Studied for 10 hours',
    description: 'Great dedication to learning!',
    icon: Flame,
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    xpReward: 100,
    checkUnlock: (stats: any) => (stats?.stats?.studyHoursTotal || 0) >= 10,
  },
  perfectScore: {
    id: 'perfect-score',
    title: 'Achieved perfect score',
    description: '100% accuracy in a session!',
    icon: Star,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    xpReward: 75,
    // This would need actual session data to check - for now always false
    checkUnlock: (stats: any) => false,
  },
};

export function getUnlockedAchievements(stats: GamificationStats | null | undefined): Achievement[] {
  if (!stats) return [];

  const unlockedAchievements: Achievement[] = [];

  Object.values(ACHIEVEMENT_DEFINITIONS).forEach((definition) => {
    if (definition.checkUnlock(stats)) {
      // Calculate time ago (mock data for now)
      const timeAgoOptions = ['2 hours ago', '4 hours ago', 'Yesterday', '3 days ago', '1 week ago'];
      const randomTimeAgo = timeAgoOptions[Math.floor(Math.random() * timeAgoOptions.length)];

      unlockedAchievements.push({
        ...definition,
        timeAgo: randomTimeAgo,
        isUnlocked: true,
      });
    }
  });

  // Sort by most recent (mock sorting for now)
  return unlockedAchievements.sort((a, b) => {
    const timeOrder = ['2 hours ago', '4 hours ago', 'Yesterday', '3 days ago', '1 week ago'];
    return timeOrder.indexOf(a.timeAgo) - timeOrder.indexOf(b.timeAgo);
  });
}

export function getRecentAchievements(stats: GamificationStats | null | undefined, limit: number = 3): Achievement[] {
  const unlocked = getUnlockedAchievements(stats);
  return unlocked.slice(0, limit);
}

// Stats validation functions - only show values if they meet conditions
export const STATS_VALIDATORS = {
  streak: {
    checkValid: (stats: GamificationStats | null | undefined) => (stats?.streak?.current || 0) > 0,
    value: (stats: GamificationStats | null | undefined) => stats?.streak?.current || 0,
    display: (stats: GamificationStats | null | undefined) => `${stats?.streak?.current || 0}`,
  },
  accuracy: {
    checkValid: (stats: GamificationStats | null | undefined) => (stats?.stats?.averageAccuracy || 0) > 0,
    value: (stats: GamificationStats | null | undefined) => Math.round((stats?.stats?.averageAccuracy || 0) * 100),
    display: (stats: GamificationStats | null | undefined) => `${Math.round((stats?.stats?.averageAccuracy || 0) * 100)}%`,
  },
  xp: {
    checkValid: (stats: GamificationStats | null | undefined) => (stats?.stats?.totalXp || 0) > 0,
    value: (stats: GamificationStats | null | undefined) => stats?.stats?.totalXp || 0,
    display: (stats: GamificationStats | null | undefined) => `${(stats?.stats?.totalXp || 0).toLocaleString()}`,
  },
  studyTime: {
    checkValid: (stats: GamificationStats | null | undefined) => (stats?.stats?.studyHoursTotal || 0) > 0,
    value: (stats: GamificationStats | null | undefined) => stats?.stats?.studyHoursTotal || 0,
    display: (stats: GamificationStats | null | undefined) => `${stats?.stats?.studyHoursTotal || 0}h`,
  },
  flashcardsReviewed: {
    checkValid: (stats: GamificationStats | null | undefined) => (stats?.stats?.flashcardsReviewed || 0) > 0,
    value: (stats: GamificationStats | null | undefined) => stats?.stats?.flashcardsReviewed || 0,
    display: (stats: GamificationStats | null | undefined) => `${stats?.stats?.flashcardsReviewed || 0}`,
  },
  subjectsCompleted: {
    checkValid: (stats: GamificationStats | null | undefined) => (stats?.stats?.subjectsMastered || 0) > 0,
    value: (stats: GamificationStats | null | undefined) => stats?.stats?.subjectsMastered || 0,
    display: (stats: GamificationStats | null | undefined) => `${stats?.stats?.subjectsMastered || 0}`,
  },
};

// Progress bar validators for study goals
export const PROGRESS_VALIDATORS = {
  studyTime: {
    checkValid: (stats: GamificationStats | null | undefined) => (stats?.stats?.dailyStudyMinutes || 0) > 0,
    current: (stats: GamificationStats | null | undefined) => stats?.stats?.dailyStudyMinutes || 0,
    target: (stats: GamificationStats | null | undefined) => 180, // 3 hours in minutes
    currentDisplay: (stats: GamificationStats | null | undefined) => {
      const minutes = stats?.stats?.dailyStudyMinutes || 0;
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}.${Math.round((mins / 60) * 10)}h` : `${hours}h`;
    },
    targetDisplay: (stats: GamificationStats | null | undefined) => '3h',
    percentage: (stats: GamificationStats | null | undefined) => {
      const current = stats?.stats?.dailyStudyMinutes || 0;
      const target = 180; // 3 hours
      return Math.min(Math.round((current / target) * 100), 100);
    },
  },
  flashcards: {
    checkValid: (stats: GamificationStats | null | undefined) => (stats?.stats?.dailyFlashcardsReviewed || 0) > 0,
    current: (stats: GamificationStats | null | undefined) => stats?.stats?.dailyFlashcardsReviewed || 0,
    target: (stats: GamificationStats | null | undefined) => 50,
    currentDisplay: (stats: GamificationStats | null | undefined) => `${stats?.stats?.dailyFlashcardsReviewed || 0}`,
    targetDisplay: (stats: GamificationStats | null | undefined) => '50',
    percentage: (stats: GamificationStats | null | undefined) => {
      const current = stats?.stats?.dailyFlashcardsReviewed || 0;
      const target = 50;
      return Math.min(Math.round((current / target) * 100), 100);
    },
  },
  subjects: {
    checkValid: (stats: GamificationStats | null | undefined) => (stats?.stats?.dailySubjectsCompleted || 0) > 0,
    current: (stats: GamificationStats | null | undefined) => stats?.stats?.dailySubjectsCompleted || 0,
    target: (stats: GamificationStats | null | undefined) => 4,
    currentDisplay: (stats: GamificationStats | null | undefined) => `${stats?.stats?.dailySubjectsCompleted || 0}`,
    targetDisplay: (stats: GamificationStats | null | undefined) => '4',
    percentage: (stats: GamificationStats | null | undefined) => {
      const current = stats?.stats?.dailySubjectsCompleted || 0;
      const target = 4;
      return Math.min(Math.round((current / target) * 100), 100);
    },
  },
};

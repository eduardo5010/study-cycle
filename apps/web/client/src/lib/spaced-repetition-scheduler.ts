import { recommendNextInterval, recordReviewOutcome, ReviewVariant } from "./review";
import { logReviewEvent } from "./ml";
import type { GamificationStats } from "@shared/schema";

// Enhanced spaced repetition scheduler with ML integration
export interface StudyItem {
  id: string;
  content: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  lastReviewed?: Date;
  nextReview?: Date;
  reviewCount: number;
  easeFactor: number;
  interval: number; // in days
  successRate: number;
}

export interface StudySession {
  id: string;
  userId: string;
  items: StudyItem[];
  startTime: Date;
  endTime?: Date;
  totalItems: number;
  completedItems: number;
  averageAccuracy: number;
  sessionType: "review" | "learning" | "mixed";
}

export interface PersonalizedStudyPlan {
  userId: string;
  dailyGoal: number; // items per day
  weeklyGoal: number; // items per week
  subjects: string[];
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  preferredStudyTimes: string[];
  currentStreak: number;
  nextReviewItems: StudyItem[];
  recommendedNewItems: StudyItem[];
}

// ML-powered study scheduler
export class SpacedRepetitionScheduler {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  // Get items ready for review based on ML predictions
  async getItemsDueForReview(): Promise<StudyItem[]> {
    try {
      const response = await fetch(`/api/ml/schedule/${this.userId}`);
      if (!response.ok) return [];

      const data = await response.json();
      return data.items?.map((item: any) => ({
        id: item.id,
        content: item.content?.question || item.content?.text || "Review item",
        subject: item.metadata?.subject || "General",
        difficulty: item.metadata?.difficulty || "medium",
        lastReviewed: item.metadata?.lastReviewed ? new Date(item.metadata.lastReviewed) : undefined,
        nextReview: new Date(item.metadata?.schedule?.nextReviewAt || Date.now()),
        reviewCount: item.metadata?.reviewCount || 0,
        easeFactor: item.metadata?.easeFactor || 2.5,
        interval: item.metadata?.interval || 1,
        successRate: item.metadata?.successRate || 0.8,
      })) || [];
    } catch (error) {
      console.error("Failed to fetch review items:", error);
      return [];
    }
  }

  // Calculate optimal review interval using ML
  async calculateOptimalInterval(
    itemId: string,
    performance: number, // 0-1 accuracy
    responseTime: number // milliseconds
  ): Promise<number> {
    try {
      const recommendation = await recommendNextInterval({
        userId: this.userId,
        itemId,
        candidateIntervals: [
          60 * 60 * 24,        // 1 day
          60 * 60 * 24 * 2,    // 2 days
          60 * 60 * 24 * 4,    // 4 days
          60 * 60 * 24 * 7,    // 1 week
          60 * 60 * 24 * 14,   // 2 weeks
          60 * 60 * 24 * 30,   // 1 month
          60 * 60 * 24 * 60,   // 2 months
        ],
      });

      if (recommendation) {
        return recommendation.recommendedIntervalSec;
      }

      // Fallback: simple SM-2 algorithm
      return this.simpleSM2Interval(performance, responseTime);
    } catch (error) {
      console.error("Failed to calculate optimal interval:", error);
      return this.simpleSM2Interval(performance, responseTime);
    }
  }

  // Simple SM-2 algorithm fallback
  private simpleSM2Interval(performance: number, responseTime: number): number {
    const baseInterval = 24 * 60 * 60; // 1 day in seconds

    if (performance >= 0.9) {
      return baseInterval * 6; // 6 days
    } else if (performance >= 0.7) {
      return baseInterval * 3; // 3 days
    } else if (performance >= 0.5) {
      return baseInterval * 1; // 1 day
    } else {
      return baseInterval * 0.5; // 12 hours
    }
  }

  // Record review outcome and update ML model
  async recordReview(
    itemId: string,
    correctness: 0 | 1,
    responseTimeMs: number,
    variantId?: string
  ): Promise<void> {
    await recordReviewOutcome(
      this.userId,
      itemId,
      variantId || null,
      correctness,
      responseTimeMs,
      1, // nReps
      undefined // timeSinceLastReviewSec
    );
  }

  // Generate personalized study plan
  async generatePersonalizedPlan(stats?: GamificationStats): Promise<PersonalizedStudyPlan> {
    const dueItems = await this.getItemsDueForReview();

    // Calculate daily capacity based on user performance
    const dailyCapacity = this.calculateDailyCapacity(stats);

    // Determine difficulty distribution
    const difficultyDistribution = this.optimizeDifficultyDistribution(stats);

    // Get preferred study times (mock for now)
    const preferredStudyTimes = ["09:00", "14:00", "19:00"];

    return {
      userId: this.userId,
      dailyGoal: dailyCapacity,
      weeklyGoal: dailyCapacity * 7,
      subjects: this.extractSubjectsFromItems(dueItems),
      difficultyDistribution,
      preferredStudyTimes,
      currentStreak: stats?.streak?.current || 0,
      nextReviewItems: dueItems.slice(0, 10), // Top 10 due items
      recommendedNewItems: [], // Would be calculated based on weak areas
    };
  }

  // Calculate user's daily study capacity
  private calculateDailyCapacity(stats?: GamificationStats): number {
    const baseCapacity = 20; // Default 20 items per day

    if (!stats) return baseCapacity;

    // Adjust based on streak and performance
    const streakBonus = Math.min(stats.streak.current * 2, 20);
    const performanceBonus = stats.stats.averageAccuracy > 0.8 ? 10 : 0;

    return Math.max(10, Math.min(50, baseCapacity + streakBonus + performanceBonus));
  }

  // Optimize difficulty distribution for optimal learning
  private optimizeDifficultyDistribution(stats?: GamificationStats) {
    const defaultDistribution = { easy: 0.4, medium: 0.4, hard: 0.2 };

    if (!stats) return defaultDistribution;

    // Adjust based on performance
    const accuracy = stats.stats.averageAccuracy;
    if (accuracy > 0.9) {
      // High performer: increase hard items
      return { easy: 0.2, medium: 0.4, hard: 0.4 };
    } else if (accuracy < 0.6) {
      // Struggling: increase easy items
      return { easy: 0.6, medium: 0.3, hard: 0.1 };
    }

    return defaultDistribution;
  }

  // Extract unique subjects from items
  private extractSubjectsFromItems(items: StudyItem[]): string[] {
    const subjects = new Set(items.map(item => item.subject));
    return Array.from(subjects);
  }

  // Get study recommendations based on user performance
  async getStudyRecommendations(stats?: GamificationStats): Promise<string[]> {
    const recommendations: string[] = [];

    if (!stats) {
      recommendations.push("Complete your first study session to get personalized recommendations");
      return recommendations;
    }

    const { streak, stats: userStats } = stats;

    // Streak-based recommendations
    if (streak.current === 0) {
      recommendations.push("Start a daily study streak to build consistency");
    } else if (streak.current >= 7) {
      recommendations.push("Great job maintaining your study streak!");
    }

    // Performance-based recommendations
    if (userStats.averageAccuracy < 0.7) {
      recommendations.push("Focus on understanding core concepts before moving to advanced topics");
    } else if (userStats.averageAccuracy > 0.9) {
      recommendations.push("You're performing excellently! Try challenging yourself with harder material");
    }

    // Activity-based recommendations
    if (userStats.dailyStudyMinutes < 30) {
      recommendations.push("Try to study for at least 30 minutes daily to see better results");
    }

    if (userStats.flashcardsReviewed < 10) {
      recommendations.push("Review more flashcards to improve retention");
    }

    return recommendations;
  }

  // Schedule study session with optimal timing
  async scheduleOptimalStudySession(items: StudyItem[]): Promise<StudySession> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      id: sessionId,
      userId: this.userId,
      items: items.sort((a, b) => {
        // Sort by urgency (due date) and difficulty
        const aUrgency = a.nextReview ? a.nextReview.getTime() : 0;
        const bUrgency = b.nextReview ? b.nextReview.getTime() : 0;
        return aUrgency - bUrgency;
      }),
      startTime: new Date(),
      totalItems: items.length,
      completedItems: 0,
      averageAccuracy: 0,
      sessionType: "review",
    };
  }
}

// Utility functions for the spaced repetition system
export const spacedRepetitionUtils = {
  // Calculate forgetting probability
  calculateForgettingProbability(
    lastReviewTime: Date,
    currentTime: Date,
    easeFactor: number
  ): number {
    const timeDiffHours = (currentTime.getTime() - lastReviewTime.getTime()) / (1000 * 60 * 60);
    // Simplified forgetting curve: R = e^(-t/S) where S is stability
    const stability = easeFactor * 24; // Base stability in hours
    return Math.exp(-timeDiffHours / stability);
  },

  // Determine if an item needs review
  shouldReviewItem(item: StudyItem): boolean {
    if (!item.nextReview) return true;
    return new Date() >= item.nextReview;
  },

  // Update item difficulty based on performance
  updateItemDifficulty(item: StudyItem, correct: boolean, responseTime: number): StudyItem {
    const newItem = { ...item };

    // Adjust ease factor based on performance and speed
    if (correct) {
      if (responseTime < 5000) { // Fast correct answer
        newItem.easeFactor = Math.min(3.0, newItem.easeFactor + 0.1);
      } else if (responseTime < 15000) { // Normal correct answer
        newItem.easeFactor = Math.min(3.0, newItem.easeFactor + 0.05);
      }
    } else {
      // Incorrect answer - decrease ease factor
      newItem.easeFactor = Math.max(1.3, newItem.easeFactor - 0.2);
    }

    // Update success rate (rolling average)
    const totalReviews = newItem.reviewCount + 1;
    newItem.successRate = ((newItem.successRate * newItem.reviewCount) + (correct ? 1 : 0)) / totalReviews;

    newItem.reviewCount = totalReviews;
    newItem.lastReviewed = new Date();

    return newItem;
  },

  // Get study session statistics
  calculateSessionStats(session: StudySession): {
    duration: number;
    accuracy: number;
    itemsPerMinute: number;
    averageResponseTime: number;
  } {
    const duration = session.endTime
      ? (session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60) // minutes
      : 0;

    const accuracy = session.completedItems > 0 ? session.averageAccuracy : 0;
    const itemsPerMinute = duration > 0 ? session.completedItems / duration : 0;

    // This would need to be calculated from individual item response times
    const averageResponseTime = 8000; // mock value

    return {
      duration,
      accuracy,
      itemsPerMinute,
      averageResponseTime,
    };
  },
};

export default SpacedRepetitionScheduler;

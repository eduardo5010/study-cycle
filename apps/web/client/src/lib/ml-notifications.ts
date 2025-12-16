import { SpacedRepetitionScheduler, type StudyItem } from "./spaced-repetition-scheduler";
import type { GamificationStats } from "@shared/schema";

// ML-Driven Study Notifications
export interface StudyNotification {
  id: string;
  type: "review_due" | "study_reminder" | "achievement_unlocked" | "streak_warning" | "optimal_study_time";
  title: string;
  message: string;
  priority: "low" | "medium" | "high" | "urgent";
  timestamp: Date;
  actionUrl?: string;
  metadata?: Record<string, any>;
  isRead: boolean;
}

export interface MLNotificationManager {
  scheduler: SpacedRepetitionScheduler;
  notifications: StudyNotification[];
  userId: string;

  // Generate notifications based on ML predictions
  generateNotifications(stats?: GamificationStats): Promise<StudyNotification[]>;

  // Get urgent notifications that need immediate attention
  getUrgentNotifications(): StudyNotification[];

  // Mark notification as read
  markAsRead(notificationId: string): void;

  // Get personalized study reminders
  getStudyReminders(stats?: GamificationStats): Promise<StudyNotification[]>;
}

// ML-powered notification system
export class MLNotificationSystem implements MLNotificationManager {
  scheduler: SpacedRepetitionScheduler;
  notifications: StudyNotification[] = [];
  userId: string;

  constructor(userId: string) {
    this.userId = userId;
    this.scheduler = new SpacedRepetitionScheduler(userId);
  }

  async generateNotifications(stats?: GamificationStats): Promise<StudyNotification[]> {
    const notifications: StudyNotification[] = [];

    // 1. Review due notifications - based on ML predictions
    const reviewNotifications = await this.generateReviewNotifications();
    notifications.push(...reviewNotifications);

    // 2. Study streak warnings
    const streakNotifications = this.generateStreakNotifications(stats);
    notifications.push(...streakNotifications);

    // 3. Achievement progress notifications
    const achievementNotifications = this.generateAchievementNotifications(stats);
    notifications.push(...achievementNotifications);

    // 4. Optimal study time reminders
    const optimalTimeNotifications = this.generateOptimalTimeNotifications();
    notifications.push(...optimalTimeNotifications);

    // 5. Performance-based recommendations
    const performanceNotifications = this.generatePerformanceNotifications(stats);
    notifications.push(...performanceNotifications);

    // Sort by priority and timestamp
    return notifications.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  }

  private async generateReviewNotifications(): Promise<StudyNotification[]> {
    const notifications: StudyNotification[] = [];

    try {
      const dueItems = await this.scheduler.getItemsDueForReview();

      if (dueItems.length === 0) {
        // No items due - encourage continued learning
        notifications.push({
          id: `review-${Date.now()}-no-items`,
          type: "study_reminder",
          title: "Ready for New Material",
          message: "Great job staying on top of reviews! Consider adding new flashcards to continue learning.",
          priority: "low",
          timestamp: new Date(),
          actionUrl: "/ai-flashcards",
          isRead: false,
        });
        return notifications;
      }

      // Group items by urgency
      const urgentItems = dueItems.filter(item => {
        if (!item.nextReview) return true;
        const hoursUntilDue = (item.nextReview.getTime() - Date.now()) / (1000 * 60 * 60);
        return hoursUntilDue < 2; // Due within 2 hours
      });

      const todayItems = dueItems.filter(item => {
        if (!item.nextReview) return false;
        const hoursUntilDue = (item.nextReview.getTime() - Date.now()) / (1000 * 60 * 60);
        return hoursUntilDue >= 2 && hoursUntilDue < 24; // Due today
      });

      // Urgent review notifications
      if (urgentItems.length > 0) {
        notifications.push({
          id: `review-${Date.now()}-urgent`,
          type: "review_due",
          title: `${urgentItems.length} Items Need Immediate Review`,
          message: `Based on your learning patterns, ${urgentItems.length} items are optimally ready for review now.`,
          priority: "urgent",
          timestamp: new Date(),
          actionUrl: "/flashcards",
          metadata: { itemCount: urgentItems.length, items: urgentItems.slice(0, 3) },
          isRead: false,
        });
      }

      // Today's review notifications
      if (todayItems.length > 0) {
        notifications.push({
          id: `review-${Date.now()}-today`,
          type: "review_due",
          title: `${todayItems.length} Items Due Today`,
          message: `ML analysis shows ${todayItems.length} items are at optimal review timing today.`,
          priority: "high",
          timestamp: new Date(),
          actionUrl: "/flashcards",
          metadata: { itemCount: todayItems.length },
          isRead: false,
        });
      }

      // General review reminder
      if (dueItems.length > 5) {
        notifications.push({
          id: `review-${Date.now()}-general`,
          type: "review_due",
          title: "Review Session Recommended",
          message: `${dueItems.length} items are ready for review. A quick review session will strengthen your memory.`,
          priority: "medium",
          timestamp: new Date(),
          actionUrl: "/flashcards",
          metadata: { itemCount: dueItems.length },
          isRead: false,
        });
      }

    } catch (error) {
      console.error("Failed to generate review notifications:", error);
    }

    return notifications;
  }

  private generateStreakNotifications(stats?: GamificationStats): StudyNotification[] {
    const notifications: StudyNotification[] = [];

    if (!stats || stats.streak.current === 0) {
      notifications.push({
        id: `streak-${Date.now()}-start`,
        type: "streak_warning",
        title: "Start Your Study Streak",
        message: "Begin studying today to start building a consistent learning habit!",
        priority: "medium",
        timestamp: new Date(),
        actionUrl: "/flashcards",
        isRead: false,
      });
      return notifications;
    }

    // Streak milestone celebrations
    const milestones = [3, 7, 14, 30, 50, 100];
    if (milestones.includes(stats.streak.current)) {
      notifications.push({
        id: `streak-${Date.now()}-milestone`,
        type: "achievement_unlocked",
        title: `${stats.streak.current} Day Streak! 🔥`,
        message: `Amazing! You've maintained a ${stats.streak.current}-day study streak. Keep up the fantastic work!`,
        priority: "high",
        timestamp: new Date(),
        isRead: false,
      });
    }

    // Streak at risk warning (if last study was more than 24 hours ago)
    const hoursSinceLastStudy = stats.stats.dailyStudyMinutes > 0 ? 0 : 48; // Simplified check
    if (stats.streak.current >= 3 && hoursSinceLastStudy > 36) {
      notifications.push({
        id: `streak-${Date.now()}-risk`,
        type: "streak_warning",
        title: "Study Streak at Risk",
        message: `Your ${stats.streak.current}-day streak is in danger! Study today to maintain it.`,
        priority: "high",
        timestamp: new Date(),
        actionUrl: "/flashcards",
        isRead: false,
      });
    }

    return notifications;
  }

  private generateAchievementNotifications(stats?: GamificationStats): StudyNotification[] {
    const notifications: StudyNotification[] = [];

    if (!stats) return notifications;

    // Check for potential achievements
    const potentialAchievements = [
      {
        condition: stats.stats.flashcardsReviewed >= 20,
        title: "Flashcard Master",
        message: "You've reviewed 20 flashcards! Keep up the great memorization work.",
        unlocked: stats.stats.flashcardsReviewed >= 20,
      },
      {
        condition: stats.streak.current >= 7,
        title: "Week Warrior",
        message: "7-day study streak achieved! You're building excellent habits.",
        unlocked: stats.streak.current >= 7,
      },
      {
        condition: stats.stats.studyHoursTotal >= 10,
        title: "Study Champion",
        message: "You've studied for 10 hours total! Your dedication is paying off.",
        unlocked: stats.stats.studyHoursTotal >= 10,
      },
    ];

    potentialAchievements.forEach((achievement, index) => {
      if (achievement.unlocked) {
        notifications.push({
          id: `achievement-${Date.now()}-${index}`,
          type: "achievement_unlocked",
          title: `🏆 ${achievement.title}`,
          message: achievement.message,
          priority: "high",
          timestamp: new Date(),
          isRead: false,
        });
      }
    });

    return notifications;
  }

  private generateOptimalTimeNotifications(): StudyNotification[] {
    const notifications: StudyNotification[] = [];
    const currentHour = new Date().getHours();

    // Peak learning times (typically morning and evening)
    const optimalHours = [9, 10, 14, 15, 19, 20];
    const isOptimalTime = optimalHours.includes(currentHour);

    if (isOptimalTime) {
      notifications.push({
        id: `timing-${Date.now()}-optimal`,
        type: "optimal_study_time",
        title: "Perfect Study Time! 🧠",
        message: "This is an optimal time for learning based on your study patterns. Your brain is most receptive now!",
        priority: "low",
        timestamp: new Date(),
        actionUrl: "/flashcards",
        isRead: false,
      });
    }

    // Evening reminder for next day preparation
    if (currentHour >= 18 && currentHour <= 21) {
      notifications.push({
        id: `timing-${Date.now()}-prep`,
        type: "study_reminder",
        title: "Prepare for Tomorrow",
        message: "Evening is a great time to review tomorrow's study materials and plan your learning session.",
        priority: "low",
        timestamp: new Date(),
        actionUrl: "/calendar",
        isRead: false,
      });
    }

    return notifications;
  }

  private generatePerformanceNotifications(stats?: GamificationStats): StudyNotification[] {
    const notifications: StudyNotification[] = [];

    if (!stats) return notifications;

    // Performance analysis
    const accuracy = stats.stats.averageAccuracy;

    if (accuracy < 0.6) {
      notifications.push({
        id: `performance-${Date.now()}-struggle`,
        type: "study_reminder",
        title: "Let's Improve Your Performance",
        message: "Your recent accuracy is below optimal. Try breaking down complex topics into smaller chunks.",
        priority: "medium",
        timestamp: new Date(),
        actionUrl: "/flashcards",
        isRead: false,
      });
    } else if (accuracy > 0.9) {
      notifications.push({
        id: `performance-${Date.now()}-excellent`,
        type: "achievement_unlocked",
        title: "Excellent Performance! 🌟",
        message: "Your accuracy is outstanding! Consider challenging yourself with more difficult material.",
        priority: "low",
        timestamp: new Date(),
        isRead: false,
      });
    }

    // Study consistency analysis
    if (stats.stats.dailyStudyMinutes < 15) {
      notifications.push({
        id: `consistency-${Date.now()}-low`,
        type: "study_reminder",
        title: "Build Study Consistency",
        message: "Short daily study sessions build better long-term retention than infrequent long sessions.",
        priority: "medium",
        timestamp: new Date(),
        actionUrl: "/flashcards",
        isRead: false,
      });
    }

    return notifications;
  }

  getUrgentNotifications(): StudyNotification[] {
    return this.notifications.filter(n => n.priority === "urgent" && !n.isRead);
  }

  async getStudyReminders(stats?: GamificationStats): Promise<StudyNotification[]> {
    const reminders: StudyNotification[] = [];

    // Daily study reminder (if no study today)
    if (!stats || stats.stats.dailyStudyMinutes === 0) {
      reminders.push({
        id: `reminder-${Date.now()}-daily`,
        type: "study_reminder",
        title: "Daily Study Reminder",
        message: "Consistent daily practice is key to long-term retention. Even 15 minutes makes a difference!",
        priority: "medium",
        timestamp: new Date(),
        actionUrl: "/flashcards",
        isRead: false,
      });
    }

    // Weekly progress check
    const weekReminders = await this.generateWeeklyProgressReminders(stats);
    reminders.push(...weekReminders);

    return reminders;
  }

  private async generateWeeklyProgressReminders(stats?: GamificationStats): Promise<StudyNotification[]> {
    const reminders: StudyNotification[] = [];

    if (!stats) return reminders;

    const weeklyGoals = {
      studyTime: 7 * 60, // 7 hours per week
      flashcards: 50, // 50 flashcards per week
      accuracy: 0.8, // 80% accuracy target
    };

    // This would need actual weekly stats - for now, provide general encouragement
    reminders.push({
      id: `weekly-${Date.now()}-progress`,
      type: "study_reminder",
      title: "Weekly Progress Check",
      message: "Take a moment to review your weekly learning progress and adjust your goals as needed.",
      priority: "low",
      timestamp: new Date(),
      actionUrl: "/profile",
      isRead: false,
    });

    return reminders;
  }

  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  }
}

// Utility functions for notification management
export const notificationUtils = {
  // Filter notifications by type
  filterByType(notifications: StudyNotification[], type: StudyNotification["type"]): StudyNotification[] {
    return notifications.filter(n => n.type === type);
  },

  // Get unread notifications count
  getUnreadCount(notifications: StudyNotification[]): number {
    return notifications.filter(n => !n.isRead).length;
  },

  // Group notifications by priority
  groupByPriority(notifications: StudyNotification[]): Record<string, StudyNotification[]> {
    return notifications.reduce((groups, notification) => {
      if (!groups[notification.priority]) {
        groups[notification.priority] = [];
      }
      groups[notification.priority].push(notification);
      return groups;
    }, {} as Record<string, StudyNotification[]>);
  },

  // Sort notifications by timestamp (newest first)
  sortByTimestamp(notifications: StudyNotification[]): StudyNotification[] {
    return [...notifications].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  },
};

export default MLNotificationSystem;

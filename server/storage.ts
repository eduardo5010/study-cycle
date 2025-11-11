import {
  type Subject,
  type InsertSubject,
  type StudySettings,
  type InsertStudySettings,
  type StudyCycle,
  type InsertStudyCycle,
  type StudyCycleData,
  type GlobalSubject,
  type InsertGlobalSubject,
  type CycleSubject,
  type InsertCycleSubject,
  type CycleSubjectWithDetails,
  type User,
  type InsertUser,
  courses,
  type Course,
  type InsertCourse,
  type UserStats,
  type League,
  type StudyStreak,
} from "@shared/schema";
import type { Content, InsertContent } from "@shared/schema/content";
import { randomUUID } from "crypto";
import { db } from "./db";
import {
  reviewEvents,
  reviewVariants,
  userLambdas,
  users as usersTable,
} from "./db/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Legacy Subjects (for compatibility)
  getSubjects(): Promise<Subject[]>;
  getSubject(id: string): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  updateSubject(id: string, subject: Partial<InsertSubject>): Promise<Subject>;
  deleteSubject(id: string): Promise<boolean>;

  // Global Subjects
  getGlobalSubjects(): Promise<GlobalSubject[]>;
  getGlobalSubject(id: string): Promise<GlobalSubject | undefined>;
  createGlobalSubject(subject: InsertGlobalSubject): Promise<GlobalSubject>;
  updateGlobalSubject(
    id: string,
    subject: Partial<InsertGlobalSubject>
  ): Promise<GlobalSubject>;
  deleteGlobalSubject(id: string): Promise<boolean>;

  // Cycle Subjects (relationships)
  getCycleSubjects(cycleId: string): Promise<CycleSubjectWithDetails[]>;
  addSubjectToCycle(cycleSubject: InsertCycleSubject): Promise<CycleSubject>;
  updateCycleSubject(
    id: string,
    updates: Partial<InsertCycleSubject>
  ): Promise<CycleSubject>;
  removeSubjectFromCycle(id: string): Promise<boolean>;

  // Study Settings
  getStudySettings(): Promise<StudySettings | undefined>;
  createOrUpdateStudySettings(
    settings: InsertStudySettings
  ): Promise<StudySettings>;

  // Study Cycles
  getStudyCycles(): Promise<StudyCycle[]>;
  getStudyCycle(id: string): Promise<StudyCycle | undefined>;
  createStudyCycle(cycle: InsertStudyCycle): Promise<StudyCycle>;
  deleteStudyCycle(id: string): Promise<boolean>;

  // Get complete cycle data
  getStudyCycleData(cycleId: string): Promise<StudyCycleData | undefined>;

  // Users and authentication
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | null>;

  // Content management
  createContent(content: InsertContent, teacherId: string): Promise<Content>;
  getContentByTeacher(teacherId: string): Promise<Content[]>;
  getAllContent(): Promise<Content[]>;
  updateContent(
    id: string,
    content: Partial<InsertContent>
  ): Promise<Content | null>;
  deleteContent(id: string): Promise<boolean>;

  // Course management
  getAllCourses(): Promise<Course[]>;
  getPublishedCourses(): Promise<Course[]>;
  getTeacherCourses(teacherId: string): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(
    id: string,
    course: Partial<InsertCourse>
  ): Promise<Course | null>;
  deleteCourse(id: string): Promise<boolean>;

  // Gamification
  getGamificationData(userId: string): Promise<{
    streak: {
      current: number;
      longest: number;
      days: string[];
      status: boolean[];
    };
    stats: {
      tasksCompleted: number;
      projectsCompleted: number;
      certificatesEarned: number;
    };
    league: {
      name: string;
      rank: number;
      xp: number;
      topUsers: Array<{
        name: string;
        xp: number;
      }>;
    };
  }>;

  // Complete cycle management - clears all cycle data
  clearAllCycleData(): Promise<boolean>;

  // ML / Review events
  logReviewEvent(event: ReviewEventInput): Promise<ReviewEvent>;
  getReviewEventsForUser(userId: string): Promise<ReviewEvent[]>;
  getReviewEventsForItem(itemId: string): Promise<ReviewEvent[]>;
  getAllReviewEvents(): Promise<ReviewEvent[]>;
  // Review variants (AI or human created)
  createReviewVariant(variant: ReviewVariantInput): Promise<ReviewVariant>;
  getReviewVariantsForItem(itemId: string): Promise<ReviewVariant[]>;
  getAllReviewVariants(): Promise<ReviewVariant[]>;
  markVariantUsed(variantId: string, userId: string): Promise<void>;
}

export type ReviewEventInput = {
  userId: string;
  itemId: string;
  timestamp: string | Date;
  correctness: 0 | 1;
  responseTimeMs?: number;
  nReps?: number;
  timeSinceLastReviewSec?: number;
};

export type ReviewEvent = ReviewEventInput & { id: string; createdAt: Date };

export type ReviewVariantInput = {
  itemId: string;
  authorId?: string | null; // null for AI-generated
  type: "ai" | "human";
  content: any; // arbitrary payload: question, prompt, media refs
  metadata?: Record<string, any>;
};

export type ReviewVariant = ReviewVariantInput & {
  id: string;
  createdAt: Date;
  lastUsedBy?: Record<string, string>; // userId -> ISO timestamp
};

export class MemStorage implements IStorage {
  private subjects: Map<string, Subject>;
  private globalSubjects: Map<string, GlobalSubject>;
  private cycleSubjects: Map<string, CycleSubject>;
  private studySettings: StudySettings | undefined;
  private studyCycles: Map<string, StudyCycle>;
  private users: Map<string, User>;
  private courses: Map<string, Course>;
  private content: Map<string, Content>;
  private userStats: Map<string, UserStats>;
  private userLeagues: Map<string, League>;
  private studyStreaks: Map<string, StudyStreak>;
  // review events for ML instrumentation
  private reviewEvents: Map<string, ReviewEvent>;
  private reviewVariants: Map<string, ReviewVariant>;
  // per-user lambda storage (optional sync with backend)
  private userLambdas: Map<
    string,
    { lambda: number; updatedAt: Date; source?: string }
  >;

  constructor() {
    this.subjects = new Map();
    this.globalSubjects = new Map();
    this.cycleSubjects = new Map();
    this.studyCycles = new Map();
    this.users = new Map();
    this.courses = new Map();
    this.content = new Map();
    this.userStats = new Map();
    this.userLeagues = new Map();
    this.studyStreaks = new Map();
    this.reviewEvents = new Map();
    this.reviewVariants = new Map();
    this.userLambdas = new Map();

    // Initialize with default settings
    this.studySettings = {
      id: randomUUID(),
      userId: null, // null significa configurações globais padrão
      wakeTime: "07:00",
      sleepTime: "23:00",
      dailyStudyHours: 6,
      dailyStudyMinutes: 0,
    };
  }

  // Subjects
  async getSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values());
  }

  async getSubject(id: string): Promise<Subject | undefined> {
    return this.subjects.get(id);
  }

  async createSubject(insertSubject: InsertSubject): Promise<Subject> {
    const id = randomUUID();
    const subject: Subject = {
      id,
      name: insertSubject.name,
      hours: insertSubject.hours ?? 0,
      minutes: insertSubject.minutes ?? 0,
    };
    this.subjects.set(id, subject);
    return subject;
  }

  async updateSubject(
    id: string,
    updateData: Partial<InsertSubject>
  ): Promise<Subject> {
    const existing = this.subjects.get(id);
    if (!existing) {
      throw new Error("Subject not found");
    }
    const updated: Subject = { ...existing, ...updateData };
    this.subjects.set(id, updated);
    return updated;
  }

  async deleteSubject(id: string): Promise<boolean> {
    return this.subjects.delete(id);
  }

  // Study Settings
  async getStudySettings(): Promise<StudySettings | undefined> {
    if (!this.studySettings) {
      return {
        id: randomUUID(),
        userId: null,
        wakeTime: "07:00",
        sleepTime: "23:00",
        dailyStudyHours: 6,
        dailyStudyMinutes: 0,
      };
    }
    return this.studySettings;
  }

  async createOrUpdateStudySettings(
    settings: InsertStudySettings
  ): Promise<StudySettings> {
    const id = this.studySettings?.id || randomUUID();
    this.studySettings = {
      id,
      userId: settings.userId ?? null,
      wakeTime: settings.wakeTime ?? "07:00",
      sleepTime: settings.sleepTime ?? "23:00",
      dailyStudyHours: settings.dailyStudyHours ?? 6,
      dailyStudyMinutes: settings.dailyStudyMinutes ?? 0,
    };
    return this.studySettings;
  }

  // Study Cycles
  async getStudyCycles(): Promise<StudyCycle[]> {
    return Array.from(this.studyCycles.values());
  }

  async getStudyCycle(id: string): Promise<StudyCycle | undefined> {
    return this.studyCycles.get(id);
  }

  async createStudyCycle(insertCycle: InsertStudyCycle): Promise<StudyCycle> {
    const id = randomUUID();
    const cycle: StudyCycle = {
      id,
      name: insertCycle.name,
      totalWeeks: insertCycle.totalWeeks,
      settingsId: insertCycle.settingsId ?? null,
      createdAt: new Date(),
    };
    this.studyCycles.set(id, cycle);
    return cycle;
  }

  async deleteStudyCycle(id: string): Promise<boolean> {
    return this.studyCycles.delete(id);
  }

  // Global Subjects
  async getGlobalSubjects(): Promise<GlobalSubject[]> {
    return Array.from(this.globalSubjects.values());
  }

  async getGlobalSubject(id: string): Promise<GlobalSubject | undefined> {
    return this.globalSubjects.get(id);
  }

  async createGlobalSubject(
    insertSubject: InsertGlobalSubject
  ): Promise<GlobalSubject> {
    const id = randomUUID();
    const subject: GlobalSubject = {
      id,
      name: insertSubject.name,
      createdAt: new Date(),
    };
    this.globalSubjects.set(id, subject);
    return subject;
  }

  async updateGlobalSubject(
    id: string,
    updateData: Partial<InsertGlobalSubject>
  ): Promise<GlobalSubject> {
    const existing = this.globalSubjects.get(id);
    if (!existing) {
      throw new Error("Global subject not found");
    }
    const updated: GlobalSubject = { ...existing, ...updateData };
    this.globalSubjects.set(id, updated);
    return updated;
  }

  async deleteGlobalSubject(id: string): Promise<boolean> {
    // Also remove from any cycles
    const cycleSubjectEntries = Array.from(this.cycleSubjects.entries());
    for (const [cycleSubjectId, cycleSubject] of cycleSubjectEntries) {
      if (cycleSubject.globalSubjectId === id) {
        this.cycleSubjects.delete(cycleSubjectId);
      }
    }
    return this.globalSubjects.delete(id);
  }

  // Cycle Subjects
  async getCycleSubjects(cycleId: string): Promise<CycleSubjectWithDetails[]> {
    const cycleSubjects = Array.from(this.cycleSubjects.values()).filter(
      (cs) => cs.cycleId === cycleId
    );

    const result: CycleSubjectWithDetails[] = [];
    for (const cycleSubject of cycleSubjects) {
      const globalSubject = await this.getGlobalSubject(
        cycleSubject.globalSubjectId!
      );
      if (globalSubject) {
        result.push({
          ...cycleSubject,
          globalSubject,
        });
      }
    }
    return result;
  }

  async addSubjectToCycle(
    insertCycleSubject: InsertCycleSubject
  ): Promise<CycleSubject> {
    const id = randomUUID();
    const cycleSubject: CycleSubject = {
      id,
      cycleId: insertCycleSubject.cycleId || null,
      globalSubjectId: insertCycleSubject.globalSubjectId || null,
      hours: insertCycleSubject.hours ?? 0,
      minutes: insertCycleSubject.minutes ?? 0,
    };
    this.cycleSubjects.set(id, cycleSubject);
    return cycleSubject;
  }

  async updateCycleSubject(
    id: string,
    updates: Partial<InsertCycleSubject>
  ): Promise<CycleSubject> {
    const existing = this.cycleSubjects.get(id);
    if (!existing) {
      throw new Error("Cycle subject not found");
    }
    const updated: CycleSubject = { ...existing, ...updates };
    this.cycleSubjects.set(id, updated);
    return updated;
  }

  async removeSubjectFromCycle(id: string): Promise<boolean> {
    return this.cycleSubjects.delete(id);
  }

  async getStudyCycleData(
    cycleId: string
  ): Promise<StudyCycleData | undefined> {
    const cycle = await this.getStudyCycle(cycleId);
    if (!cycle) return undefined;

    const settings = await this.getStudySettings();
    if (!settings) return undefined;

    const subjects = await this.getSubjects();
    const cycleSubjects = await this.getCycleSubjects(cycleId);

    return {
      cycle,
      settings,
      subjects, // Legacy support
      cycleSubjects, // New structure
      weeks: [], // Will be generated on frontend
    };
  }

  // Users and authentication
  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const newUser: User = {
      id,
      email: user.email,
      password: user.password, // In real app, this would be hashed
      name: user.name,
      isStudent: user.isStudent || true,
      isTeacher: user.isTeacher || false,
      isAdmin: user.isAdmin || false,
      bio: user.bio || null,
      avatar: user.avatar || null,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = Array.from(this.users.values());
    for (const user of users) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async updateUser(
    id: string,
    userData: Partial<InsertUser>
  ): Promise<User | null> {
    const existing = this.users.get(id);
    if (!existing) return null;

    const updated: User = {
      ...existing,
      ...userData,
      updatedAt: new Date(),
    };
    this.users.set(id, updated);
    return updated;
  }

  // ML / Review events
  async logReviewEvent(event: ReviewEventInput): Promise<ReviewEvent> {
    const id = randomUUID();
    const ev: ReviewEvent = {
      id,
      ...event,
      timestamp:
        typeof event.timestamp === "string"
          ? new Date(event.timestamp)
          : event.timestamp,
      createdAt: new Date(),
    };
    this.reviewEvents.set(id, ev);
    return ev;
  }

  async getReviewEventsForUser(userId: string): Promise<ReviewEvent[]> {
    return Array.from(this.reviewEvents.values()).filter(
      (e) => e.userId === userId
    );
  }

  async getReviewEventsForItem(itemId: string): Promise<ReviewEvent[]> {
    return Array.from(this.reviewEvents.values()).filter(
      (e) => e.itemId === itemId
    );
  }

  async getAllReviewEvents(): Promise<ReviewEvent[]> {
    return Array.from(this.reviewEvents.values());
  }

  // User lambda management
  async getUserLambda(
    userId: string
  ): Promise<{ lambda: number; updatedAt: Date; source?: string } | null> {
    const v = this.userLambdas.get(userId) || null;
    return v;
  }

  async setUserLambda(
    userId: string,
    lambda: number,
    source?: string
  ): Promise<void> {
    this.userLambdas.set(userId, { lambda, updatedAt: new Date(), source });
  }

  // Review variants
  async createReviewVariant(
    variant: ReviewVariantInput
  ): Promise<ReviewVariant> {
    const id = randomUUID();
    const v: ReviewVariant = {
      id,
      ...variant,
      createdAt: new Date(),
      lastUsedBy: {},
    };
    this.reviewVariants.set(id, v);
    return v;
  }

  async getReviewVariantsForItem(itemId: string): Promise<ReviewVariant[]> {
    return Array.from(this.reviewVariants.values()).filter(
      (v) => v.itemId === itemId
    );
  }

  async getAllReviewVariants(): Promise<ReviewVariant[]> {
    return Array.from(this.reviewVariants.values());
  }

  async markVariantUsed(variantId: string, userId: string): Promise<void> {
    const v = this.reviewVariants.get(variantId);
    if (!v) return;
    v.lastUsedBy = v.lastUsedBy || {};
    v.lastUsedBy[userId] = new Date().toISOString();
    this.reviewVariants.set(variantId, v);
  }

  // Content management
  async createContent(
    contentData: InsertContent,
    teacherId: string
  ): Promise<Content> {
    const id = randomUUID();
    const newContent: Content = {
      id,
      title: contentData.title,
      description: contentData.description ?? null,
      metadata: contentData.metadata ?? null,
      creatorId: contentData.creatorId,
      teacherId: contentData.teacherId ?? teacherId,
      type: contentData.type,
      contentType: contentData.contentType ?? null,
      contentUrl: contentData.contentUrl ?? null,
      thumbnailUrl: contentData.thumbnailUrl ?? null,
      tags: contentData.tags ?? [],
      isPublished: contentData.isPublished ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.content.set(id, newContent);
    return newContent;
  }

  async getContentByTeacher(teacherId: string): Promise<Content[]> {
    return Array.from(this.content.values()).filter(
      (c) => c.teacherId === teacherId
    );
  }

  async getAllContent(): Promise<Content[]> {
    return Array.from(this.content.values());
  }

  async getPublishedContent(): Promise<Content[]> {
    return Array.from(this.content.values()).filter((c) => c.isPublished);
  }

  async getTeacherContent(teacherId: string): Promise<Content[]> {
    return Array.from(this.content.values()).filter(
      (c) => c.teacherId === teacherId
    );
  }

  async updateContent(
    id: string,
    contentData: Partial<InsertContent>
  ): Promise<Content | null> {
    const existing = this.content.get(id);
    if (!existing) return null;

    const updated: Content = {
      ...existing,
      ...contentData,
      updatedAt: new Date(),
    };
    this.content.set(id, updated);
    return updated;
  }

  async deleteContent(id: string): Promise<boolean> {
    return this.content.delete(id);
  }

  // Course management
  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getPublishedCourses(): Promise<Course[]> {
    return Array.from(this.courses.values()).filter((c) => c.isPublished);
  }

  async getTeacherCourses(teacherId: string): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(
      (c) => c.creatorId === teacherId
    );
  }

  async createCourse(courseData: InsertCourse): Promise<Course> {
    const id = randomUUID();
    const course: Course = {
      id,
      title: courseData.title,
      description: courseData.description ?? null,
      category: courseData.category,
      level: courseData.level ?? "beginner",
      thumbnailUrl: courseData.thumbnailUrl ?? null,
      isCareer: courseData.isCareer ?? false,
      estimatedHours: courseData.estimatedHours ?? 0,
      enrollmentCount: courseData.enrollmentCount ?? 0,
      rating: courseData.rating ?? 0,
      isPublished: courseData.isPublished ?? false,
      creatorId: courseData.creatorId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.courses.set(id, course);
    return course;
  }

  async updateCourse(
    id: string,
    courseData: Partial<InsertCourse>
  ): Promise<Course | null> {
    const existing = this.courses.get(id);
    if (!existing) return null;

    const updated: Course = {
      ...existing,
      ...courseData,
      updatedAt: new Date(),
    };

    this.courses.set(id, updated);
    return updated;
  }

  async deleteCourse(id: string): Promise<boolean> {
    return this.courses.delete(id);
  }

  // User Stats
  private async getUserStats(userId: string): Promise<UserStats> {
    let stats = this.userStats.get(userId);
    if (!stats) {
      stats = {
        id: randomUUID(),
        userId,
        tasksCompleted: 0,
        projectsCompleted: 0,
        certificatesEarned: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: null,
        currentXp: 0,
        totalXp: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.userStats.set(userId, stats);
    }
    return stats;
  }

  private async getOrCreateLeague(xp: number): Promise<League> {
    // Leagues are predefined
    const leagues = [
      {
        id: "bronze",
        name: "Liga Bronze",
        minXp: 0,
        maxXp: 1000,
        orderIndex: 0,
        color: "#CD7F32",
        icon: "🥉",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "silver",
        name: "Liga Prata",
        minXp: 1001,
        maxXp: 2500,
        orderIndex: 1,
        color: "#C0C0C0",
        icon: "🥈",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "gold",
        name: "Liga Ouro",
        minXp: 2501,
        maxXp: 5000,
        orderIndex: 2,
        color: "#FFD700",
        icon: "🥇",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "diamond",
        name: "Liga Diamante",
        minXp: 5001,
        maxXp: 10000,
        orderIndex: 3,
        color: "#B9F2FF",
        icon: "💎",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const league =
      leagues.find((l) => xp >= l.minXp && xp <= l.maxXp) || leagues[0];

    if (!this.userLeagues.has(league.id)) {
      this.userLeagues.set(league.id, league);
    }

    return league;
  }

  // Gamification data
  async getGamificationData(userId: string) {
    const userStats = await this.getUserStats(userId);

    // Calculate streak days and status
    const days = ["D", "S", "T", "Q", "Q", "S", "S"];
    const status = days.map(() => false);

    // Get last 7 days of streaks
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentStreaks = Array.from(this.studyStreaks.values())
      .filter(
        (streak) => streak.userId === userId && streak.date >= sevenDaysAgo
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    recentStreaks.forEach((streak) => {
      const dayIndex = streak.date.getDay();
      status[dayIndex] = streak.minutesStudied > 0;
    });

    const streak = {
      current: userStats.currentStreak,
      longest: userStats.longestStreak,
      days,
      status,
    };

    const stats = {
      tasksCompleted: userStats.tasksCompleted,
      projectsCompleted: userStats.projectsCompleted,
      certificatesEarned: userStats.certificatesEarned,
    };

    // Get user's league
    const userLeague = await this.getOrCreateLeague(userStats.totalXp);

    // Get top users in same league
    const leagueUsers = Array.from(this.users.values()).map(async (user) => {
      const stats = await this.getUserStats(user.id);
      return {
        name: user.name,
        xp: stats.totalXp,
      };
    });

    const resolvedUsers = await Promise.all(leagueUsers);
    const sortedUsers = resolvedUsers
      .filter((u) => u.xp >= userLeague.minXp && u.xp <= userLeague.maxXp)
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 5);

    const userRank =
      sortedUsers.findIndex((u) => u.name === this.users.get(userId)?.name) + 1;

    const league = {
      name: userLeague.name,
      rank: userRank,
      xp: userStats.currentXp,
      topUsers: sortedUsers,
    };

    return { streak, stats, league };
  }

  // Gamification updates
  async updateUserStats(
    userId: string,
    updates: {
      tasksCompleted?: number;
      projectsCompleted?: number;
      certificatesEarned?: number;
      xpEarned?: number;
      studyMinutes?: number;
    }
  ): Promise<UserStats> {
    const stats = await this.getUserStats(userId);

    if (updates.tasksCompleted) {
      stats.tasksCompleted += updates.tasksCompleted;
    }

    if (updates.projectsCompleted) {
      stats.projectsCompleted += updates.projectsCompleted;
    }

    if (updates.certificatesEarned) {
      stats.certificatesEarned += updates.certificatesEarned;
    }

    if (updates.xpEarned) {
      stats.currentXp += updates.xpEarned;
      stats.totalXp += updates.xpEarned;
    }

    if (updates.studyMinutes) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Add study streak
      const streak: StudyStreak = {
        id: randomUUID(),
        userId,
        date: today,
        minutesStudied: updates.studyMinutes,
        createdAt: new Date(),
      };
      this.studyStreaks.set(streak.id, streak);

      // Update streak counts
      if (!stats.lastStudyDate) {
        stats.currentStreak = 1;
      } else {
        const lastStudyDate = new Date(stats.lastStudyDate);
        lastStudyDate.setHours(0, 0, 0, 0);

        const diffDays = Math.floor(
          (today.getTime() - lastStudyDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
          stats.currentStreak++;
          if (stats.currentStreak > stats.longestStreak) {
            stats.longestStreak = stats.currentStreak;
          }
        } else if (diffDays > 1) {
          stats.currentStreak = 1;
        }
      }

      stats.lastStudyDate = today;
    }

    stats.updatedAt = new Date();
    this.userStats.set(userId, stats);

    return stats;
  }

  async addStudyStreak(userId: string, minutes: number): Promise<StudyStreak> {
    const streak: StudyStreak = {
      id: randomUUID(),
      userId,
      date: new Date(),
      minutesStudied: minutes,
      createdAt: new Date(),
    };

    this.studyStreaks.set(streak.id, streak);
    return streak;
  }

  // Complete cycle management - clears all cycle data
  async clearAllCycleData(): Promise<boolean> {
    // Clear all cycle-related data but keep global subjects and settings
    this.subjects.clear();
    this.cycleSubjects.clear();
    this.studyCycles.clear();
    return true;
  }
}

// Hybrid storage: uses Postgres (Drizzle) for ML-review data and per-user lambdas,
// while keeping the existing MemStorage behavior for legacy app data until
// a full migration is implemented.
class HybridStorage implements IStorage {
  private mem: MemStorage;

  constructor() {
    this.mem = new MemStorage();
  }

  // Delegate legacy methods to in-memory implementation
  async getSubjects() {
    return this.mem.getSubjects();
  }
  async getSubject(id: string) {
    return this.mem.getSubject(id);
  }
  async createSubject(s: any) {
    return this.mem.createSubject(s);
  }
  async updateSubject(id: string, s: any) {
    return this.mem.updateSubject(id, s);
  }
  async deleteSubject(id: string) {
    return this.mem.deleteSubject(id);
  }

  async getGlobalSubjects() {
    return this.mem.getGlobalSubjects();
  }
  async getGlobalSubject(id: string) {
    return this.mem.getGlobalSubject(id);
  }
  async createGlobalSubject(s: any) {
    return this.mem.createGlobalSubject(s);
  }
  async updateGlobalSubject(id: string, s: any) {
    return this.mem.updateGlobalSubject(id, s);
  }
  async deleteGlobalSubject(id: string) {
    return this.mem.deleteGlobalSubject(id);
  }

  async getCycleSubjects(cycleId: string) {
    return this.mem.getCycleSubjects(cycleId);
  }
  async addSubjectToCycle(s: any) {
    return this.mem.addSubjectToCycle(s);
  }
  async updateCycleSubject(id: string, s: any) {
    return this.mem.updateCycleSubject(id, s);
  }
  async removeSubjectFromCycle(id: string) {
    return this.mem.removeSubjectFromCycle(id);
  }

  async getStudySettings() {
    return this.mem.getStudySettings();
  }
  async createOrUpdateStudySettings(s: any) {
    return this.mem.createOrUpdateStudySettings(s);
  }

  async getStudyCycles() {
    return this.mem.getStudyCycles();
  }
  async getStudyCycle(id: string) {
    return this.mem.getStudyCycle(id);
  }
  async createStudyCycle(c: any) {
    return this.mem.createStudyCycle(c);
  }
  async deleteStudyCycle(id: string) {
    return this.mem.deleteStudyCycle(id);
  }

  async getStudyCycleData(cycleId: string) {
    return this.mem.getStudyCycleData(cycleId);
  }

  async createUser(u: any) {
    // Try to persist to Postgres first; fall back to in-memory storage if DB is unavailable
    try {
      const id = randomUUID();
      const row = {
        id,
        email: u.email,
        password: u.password,
        name: u.name,
        isStudent: u.isStudent ? 1 : 0,
        isTeacher: u.isTeacher ? 1 : 0,
        isAdmin: u.isAdmin ? 1 : 0,
        bio: u.bio ?? null,
        avatar: u.avatar ?? null,
        isVerified: u.isVerified ? 1 : 0,
        githubId: (u as any).githubId ?? null,
        googleId: (u as any).googleId ?? null,
        facebookId: (u as any).facebookId ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any;

      // attempt insert
      await db.insert(usersTable).values(row as any);

      // return shape compatible with User type expected by rest of app
      return {
        id: row.id,
        email: row.email,
        password: row.password,
        name: row.name,
        isStudent: Boolean(row.isStudent),
        isTeacher: Boolean(row.isTeacher),
        isAdmin: Boolean(row.isAdmin),
        bio: row.bio,
        avatar: row.avatar,
        isVerified: Boolean(row.isVerified),
        githubId: row.githubId,
        googleId: row.googleId,
        facebookId: row.facebookId,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      } as any;
    } catch (err) {
      // DB not available or insert failed; fall back to in-memory storage
      return this.mem.createUser(u);
    }
  }
  async getUserByEmail(email: string) {
    try {
      const rows = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));
      if (rows.length > 0) {
        const r: any = rows[0];
        return {
          id: r.id,
          email: r.email,
          password: r.password,
          name: r.name,
          isStudent: Boolean(r.isStudent),
          isTeacher: Boolean(r.isTeacher),
          isAdmin: Boolean(r.isAdmin),
          bio: r.bio,
          avatar: r.avatar,
          isVerified: Boolean(r.isVerified),
          githubId: r.githubId,
          googleId: r.googleId,
          facebookId: r.facebookId,
          createdAt: new Date(r.createdAt),
          updatedAt: new Date(r.updatedAt),
        } as any;
      }
      return this.mem.getUserByEmail(email);
    } catch (err) {
      return this.mem.getUserByEmail(email);
    }
  }
  async getUserById(id: string) {
    try {
      const rows = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id));
      if (rows.length > 0) {
        const r: any = rows[0];
        return {
          id: r.id,
          email: r.email,
          password: r.password,
          name: r.name,
          isStudent: Boolean(r.isStudent),
          isTeacher: Boolean(r.isTeacher),
          isAdmin: Boolean(r.isAdmin),
          bio: r.bio,
          avatar: r.avatar,
          isVerified: Boolean(r.isVerified),
          githubId: r.githubId,
          googleId: r.googleId,
          facebookId: r.facebookId,
          createdAt: new Date(r.createdAt),
          updatedAt: new Date(r.updatedAt),
        } as any;
      }
      return this.mem.getUserById(id);
    } catch (err) {
      return this.mem.getUserById(id);
    }
  }
  async updateUser(id: string, u: any) {
    try {
      const updates: any = {};
      if (typeof u.email !== "undefined") updates.email = u.email;
      if (typeof u.password !== "undefined") updates.password = u.password;
      if (typeof u.name !== "undefined") updates.name = u.name;
      if (typeof u.isStudent !== "undefined")
        updates.isStudent = u.isStudent ? 1 : 0;
      if (typeof u.isTeacher !== "undefined")
        updates.isTeacher = u.isTeacher ? 1 : 0;
      if (typeof u.isAdmin !== "undefined") updates.isAdmin = u.isAdmin ? 1 : 0;
      if (typeof u.bio !== "undefined") updates.bio = u.bio;
      if (typeof u.avatar !== "undefined") updates.avatar = u.avatar;
      if (typeof u.isVerified !== "undefined")
        updates.isVerified = u.isVerified ? 1 : 0;
      if (typeof (u as any).githubId !== "undefined")
        updates.githubId = (u as any).githubId;
      if (typeof (u as any).googleId !== "undefined")
        updates.googleId = (u as any).googleId;
      if (typeof (u as any).facebookId !== "undefined")
        updates.facebookId = (u as any).facebookId;
      updates.updatedAt = new Date().toISOString();

      await db
        .update(usersTable)
        .set(updates as any)
        .where(eq(usersTable.id, id));
      const rows = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id));
      if (rows.length > 0) {
        const r: any = rows[0];
        return {
          id: r.id,
          email: r.email,
          password: r.password,
          name: r.name,
          isStudent: Boolean(r.isStudent),
          isTeacher: Boolean(r.isTeacher),
          isAdmin: Boolean(r.isAdmin),
          bio: r.bio,
          avatar: r.avatar,
          isVerified: Boolean(r.isVerified),
          githubId: r.githubId,
          googleId: r.googleId,
          facebookId: r.facebookId,
          createdAt: new Date(r.createdAt),
          updatedAt: new Date(r.updatedAt),
        } as any;
      }
      return this.mem.updateUser(id, u);
    } catch (err) {
      return this.mem.updateUser(id, u);
    }
  }

  // Content and courses delegate
  async createContent(c: any, teacherId: string) {
    return this.mem.createContent(c, teacherId);
  }
  async getContentByTeacher(teacherId: string) {
    return this.mem.getContentByTeacher(teacherId);
  }
  async getAllContent() {
    return this.mem.getAllContent();
  }
  async updateContent(id: string, contentData: any) {
    return this.mem.updateContent(id, contentData);
  }
  async deleteContent(id: string) {
    return this.mem.deleteContent(id);
  }

  async getAllCourses() {
    return this.mem.getAllCourses();
  }
  async getPublishedCourses() {
    return this.mem.getPublishedCourses();
  }
  async getTeacherCourses(teacherId: string) {
    return this.mem.getTeacherCourses(teacherId);
  }
  async createCourse(c: any) {
    return this.mem.createCourse(c);
  }
  async updateCourse(id: string, data: any) {
    return this.mem.updateCourse(id, data);
  }
  async deleteCourse(id: string) {
    return this.mem.deleteCourse(id);
  }

  async getGamificationData(userId: string) {
    return this.mem.getGamificationData(userId);
  }
  async clearAllCycleData() {
    return this.mem.clearAllCycleData();
  }

  // ML / Review events - Postgres backed via Drizzle
  async logReviewEvent(event: ReviewEventInput): Promise<ReviewEvent> {
    const id = randomUUID();
    await db.insert(reviewEvents).values({
      id,
      userId: event.userId,
      itemId: event.itemId,
      timestamp:
        typeof event.timestamp === "string"
          ? new Date(event.timestamp).toISOString()
          : (event.timestamp as Date).toISOString(),
      correctness: event.correctness,
      responseTimeMs: event.responseTimeMs ?? null,
      nReps: event.nReps ?? null,
      timeSinceLastReviewSec: event.timeSinceLastReviewSec ?? null,
      metadata: {},
    } as any);

    return {
      id,
      ...event,
      timestamp:
        typeof event.timestamp === "string"
          ? new Date(event.timestamp)
          : event.timestamp,
      createdAt: new Date(),
    };
  }

  async getReviewEventsForUser(userId: string): Promise<ReviewEvent[]> {
    const rows = await db
      .select()
      .from(reviewEvents)
      .where(eq(reviewEvents.userId, userId));
    return rows.map((r: any) => ({
      id: r.id,
      userId: r.userId,
      itemId: r.itemId,
      timestamp: new Date(r.timestamp),
      correctness: r.correctness,
      responseTimeMs: r.responseTimeMs,
      nReps: r.nReps,
      timeSinceLastReviewSec: r.timeSinceLastReviewSec,
      createdAt: new Date(r.createdAt),
    }));
  }

  async getReviewEventsForItem(itemId: string): Promise<ReviewEvent[]> {
    const rows = await db
      .select()
      .from(reviewEvents)
      .where(eq(reviewEvents.itemId, itemId));
    return rows.map((r: any) => ({
      id: r.id,
      userId: r.userId,
      itemId: r.itemId,
      timestamp: new Date(r.timestamp),
      correctness: r.correctness,
      responseTimeMs: r.responseTimeMs,
      nReps: r.nReps,
      timeSinceLastReviewSec: r.timeSinceLastReviewSec,
      createdAt: new Date(r.createdAt),
    }));
  }

  async getAllReviewEvents(): Promise<ReviewEvent[]> {
    const rows = await db.select().from(reviewEvents);
    return rows.map((r: any) => ({
      id: r.id,
      userId: r.userId,
      itemId: r.itemId,
      timestamp: new Date(r.timestamp),
      correctness: r.correctness,
      responseTimeMs: r.responseTimeMs,
      nReps: r.nReps,
      timeSinceLastReviewSec: r.timeSinceLastReviewSec,
      createdAt: new Date(r.createdAt),
    }));
  }

  // Review variants
  async createReviewVariant(
    variant: ReviewVariantInput
  ): Promise<ReviewVariant> {
    const id = randomUUID();
    await db.insert(reviewVariants).values({
      id,
      itemId: variant.itemId,
      authorId: variant.authorId ?? null,
      type: variant.type,
      content: variant.content,
      metadata: variant.metadata ?? {},
    } as any);

    return {
      id,
      ...variant,
      createdAt: new Date(),
      lastUsedBy: {},
    };
  }

  async getReviewVariantsForItem(itemId: string): Promise<ReviewVariant[]> {
    const rows = await db
      .select()
      .from(reviewVariants)
      .where(eq(reviewVariants.itemId, itemId));
    return rows.map((r: any) => ({
      id: r.id,
      itemId: r.itemId,
      authorId: r.authorId,
      type: r.type,
      content: r.content,
      metadata: r.metadata,
      createdAt: new Date(r.createdAt),
      lastUsedBy: r.lastUsedBy || {},
    }));
  }

  async getAllReviewVariants(): Promise<ReviewVariant[]> {
    const rows = await db.select().from(reviewVariants);
    return rows.map((r: any) => ({
      id: r.id,
      itemId: r.itemId,
      authorId: r.authorId,
      type: r.type,
      content: r.content,
      metadata: r.metadata,
      createdAt: new Date(r.createdAt),
      lastUsedBy: r.lastUsedBy || {},
    }));
  }

  async markVariantUsed(variantId: string, userId: string): Promise<void> {
    // read variant, update lastUsedBy JSON
    const rows = await db
      .select()
      .from(reviewVariants)
      .where(eq(reviewVariants.id, variantId));
    if (rows.length === 0) return;
    const row = rows[0] as any;
    const lastUsed = row.lastUsedBy || {};
    lastUsed[userId] = new Date().toISOString();
    await db
      .update(reviewVariants)
      .set({ lastUsedBy: lastUsed } as any)
      .where(eq(reviewVariants.id, variantId));
  }

  // User lambda management
  async getUserLambda(
    userId: string
  ): Promise<{ lambda: number; updatedAt: Date; source?: string } | null> {
    const rows = await db
      .select()
      .from(userLambdas)
      .where(eq(userLambdas.userId, userId));
    if (rows.length === 0) return null;
    const r: any = rows[0];
    return {
      lambda: Number(r.lambda),
      updatedAt: new Date(r.updatedAt),
      source: r.source,
    };
  }

  async setUserLambda(
    userId: string,
    lambda: number,
    source?: string
  ): Promise<void> {
    const rows = await db
      .select()
      .from(userLambdas)
      .where(eq(userLambdas.userId, userId));
    if (rows.length === 0) {
      await db.insert(userLambdas).values({
        userId,
        lambda: String(lambda),
        source: source ?? null,
      } as any);
    } else {
      await db
        .update(userLambdas)
        .set({
          lambda: String(lambda),
          source: source ?? null,
          updatedAt: new Date().toISOString(),
        } as any)
        .where(eq(userLambdas.userId, userId));
    }
  }
}

export const storage = new HybridStorage();

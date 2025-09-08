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
  type Content,
  type InsertContent
} from "@shared/schema";
import { randomUUID } from "crypto";

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
  updateGlobalSubject(id: string, subject: Partial<InsertGlobalSubject>): Promise<GlobalSubject>;
  deleteGlobalSubject(id: string): Promise<boolean>;

  // Cycle Subjects (relationships)
  getCycleSubjects(cycleId: string): Promise<CycleSubjectWithDetails[]>;
  addSubjectToCycle(cycleSubject: InsertCycleSubject): Promise<CycleSubject>;
  updateCycleSubject(id: string, updates: Partial<InsertCycleSubject>): Promise<CycleSubject>;
  removeSubjectFromCycle(id: string): Promise<boolean>;

  // Study Settings
  getStudySettings(): Promise<StudySettings | undefined>;
  createOrUpdateStudySettings(settings: InsertStudySettings): Promise<StudySettings>;

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
  updateContent(id: string, content: Partial<InsertContent>): Promise<Content | null>;
  deleteContent(id: string): Promise<boolean>;
  
  // Complete cycle management - clears all cycle data
  clearAllCycleData(): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private subjects: Map<string, Subject>;
  private globalSubjects: Map<string, GlobalSubject>;
  private cycleSubjects: Map<string, CycleSubject>;
  private studySettings: StudySettings | undefined;
  private studyCycles: Map<string, StudyCycle>;
  private users: Map<string, User>;
  private content: Map<string, Content>;

  constructor() {
    this.subjects = new Map();
    this.globalSubjects = new Map();
    this.cycleSubjects = new Map();
    this.studyCycles = new Map();
    this.users = new Map();
    this.content = new Map();
    
    // Initialize with default settings
    this.studySettings = {
      id: randomUUID(),
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
      minutes: insertSubject.minutes ?? 0
    };
    this.subjects.set(id, subject);
    return subject;
  }

  async updateSubject(id: string, updateData: Partial<InsertSubject>): Promise<Subject> {
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
    return this.studySettings;
  }

  async createOrUpdateStudySettings(settings: InsertStudySettings): Promise<StudySettings> {
    const id = this.studySettings?.id || randomUUID();
    this.studySettings = { 
      id,
      wakeTime: settings.wakeTime ?? "07:00",
      sleepTime: settings.sleepTime ?? "23:00",
      dailyStudyHours: settings.dailyStudyHours ?? 6,
      dailyStudyMinutes: settings.dailyStudyMinutes ?? 0
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
      createdAt: new Date().toISOString()
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

  async createGlobalSubject(insertSubject: InsertGlobalSubject): Promise<GlobalSubject> {
    const id = randomUUID();
    const subject: GlobalSubject = { 
      id,
      name: insertSubject.name,
      createdAt: new Date().toISOString()
    };
    this.globalSubjects.set(id, subject);
    return subject;
  }

  async updateGlobalSubject(id: string, updateData: Partial<InsertGlobalSubject>): Promise<GlobalSubject> {
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
    const cycleSubjects = Array.from(this.cycleSubjects.values())
      .filter(cs => cs.cycleId === cycleId);
    
    const result: CycleSubjectWithDetails[] = [];
    for (const cycleSubject of cycleSubjects) {
      const globalSubject = await this.getGlobalSubject(cycleSubject.globalSubjectId!);
      if (globalSubject) {
        result.push({
          ...cycleSubject,
          globalSubject
        });
      }
    }
    return result;
  }

  async addSubjectToCycle(insertCycleSubject: InsertCycleSubject): Promise<CycleSubject> {
    const id = randomUUID();
    const cycleSubject: CycleSubject = {
      id,
      cycleId: insertCycleSubject.cycleId || null,
      globalSubjectId: insertCycleSubject.globalSubjectId || null,
      hours: insertCycleSubject.hours ?? 0,
      minutes: insertCycleSubject.minutes ?? 0
    };
    this.cycleSubjects.set(id, cycleSubject);
    return cycleSubject;
  }

  async updateCycleSubject(id: string, updates: Partial<InsertCycleSubject>): Promise<CycleSubject> {
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

  async getStudyCycleData(cycleId: string): Promise<StudyCycleData | undefined> {
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
      weeks: [] // Will be generated on frontend
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
      userType: user.userType || "student",
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
  
  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User | null> {
    const existing = this.users.get(id);
    if (!existing) return null;
    
    const updated: User = { 
      ...existing, 
      ...userData,
      updatedAt: new Date()
    };
    this.users.set(id, updated);
    return updated;
  }
  
  // Content management
  async createContent(contentData: InsertContent, teacherId: string): Promise<Content> {
    const id = randomUUID();
    const newContent: Content = {
      id,
      teacherId,
      title: contentData.title,
      description: contentData.description || null,
      contentType: contentData.contentType,
      contentUrl: contentData.contentUrl || null,
      thumbnailUrl: contentData.thumbnailUrl || null,
      tags: contentData.tags || null,
      isPublished: contentData.isPublished || false,
      viewCount: 0,
      likeCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.content.set(id, newContent);
    return newContent;
  }
  
  async getContentByTeacher(teacherId: string): Promise<Content[]> {
    return Array.from(this.content.values()).filter(c => c.teacherId === teacherId);
  }
  
  async getAllContent(): Promise<Content[]> {
    return Array.from(this.content.values()).filter(c => c.isPublished);
  }
  
  async updateContent(id: string, contentData: Partial<InsertContent>): Promise<Content | null> {
    const existing = this.content.get(id);
    if (!existing) return null;
    
    const updated: Content = { 
      ...existing, 
      ...contentData,
      updatedAt: new Date()
    };
    this.content.set(id, updated);
    return updated;
  }
  
  async deleteContent(id: string): Promise<boolean> {
    return this.content.delete(id);
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

export const storage = new MemStorage();

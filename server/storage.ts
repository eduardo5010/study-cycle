import { 
  type Subject, 
  type InsertSubject,
  type StudySettings,
  type InsertStudySettings,
  type StudyCycle,
  type InsertStudyCycle,
  type StudyCycleData
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Subjects
  getSubjects(): Promise<Subject[]>;
  getSubject(id: string): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  updateSubject(id: string, subject: Partial<InsertSubject>): Promise<Subject>;
  deleteSubject(id: string): Promise<boolean>;

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
}

export class MemStorage implements IStorage {
  private subjects: Map<string, Subject>;
  private studySettings: StudySettings | undefined;
  private studyCycles: Map<string, StudyCycle>;

  constructor() {
    this.subjects = new Map();
    this.studyCycles = new Map();
    
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

  async getStudyCycleData(cycleId: string): Promise<StudyCycleData | undefined> {
    const cycle = await this.getStudyCycle(cycleId);
    if (!cycle) return undefined;

    const settings = await this.getStudySettings();
    if (!settings) return undefined;

    const subjects = await this.getSubjects();
    
    return {
      cycle,
      settings,
      subjects,
      weeks: [] // Will be generated on frontend
    };
  }
}

export const storage = new MemStorage();

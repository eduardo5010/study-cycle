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
  type CycleSubjectWithDetails
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
}

export class MemStorage implements IStorage {
  private subjects: Map<string, Subject>;
  private globalSubjects: Map<string, GlobalSubject>;
  private cycleSubjects: Map<string, CycleSubject>;
  private studySettings: StudySettings | undefined;
  private studyCycles: Map<string, StudyCycle>;

  constructor() {
    this.subjects = new Map();
    this.globalSubjects = new Map();
    this.cycleSubjects = new Map();
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
}

export const storage = new MemStorage();

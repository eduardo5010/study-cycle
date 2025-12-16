export enum SkillLevel {
  NOT_STARTED = "NOT_STARTED",
  ATTEMPTED = "ATTEMPTED",
  FAMILIAR = "FAMILIAR",
  PROFICIENT = "PROFICIENT",
  MASTERED = "MASTERED",
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type:
    | "PRACTICE"
    | "UNIT_TEST"
    | "MODULE_TEST"
    | "SUBJECT_TEST"
    | "COURSE_TEST";
  content: string;
  solution?: string;
  difficulty: "BASIC" | "INTERMEDIATE" | "ADVANCED";
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  level: SkillLevel;
  exercises: Exercise[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  theory?: string;
  skills: Skill[];
  quiz?: {
    id: string;
    title: string;
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      correctOption: number;
    }>;
  };
  assignments: Array<{
    id: string;
    title: string;
    description: string;
    dueDate?: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
  unitTest?: Exercise;
  createdAt: Date;
  updatedAt: Date;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  units: Unit[];
  moduleTest?: Exercise;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  subjectTest?: Exercise;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  subjects: Subject[];
  courseTest?: Exercise;
  isPublished: boolean;
  progress?: number;
  createdBy: {
    id: string;
    name: string;
    type: "ADMIN" | "TEACHER" | "AI";
  };
  createdAt: Date;
  updatedAt: Date;
}

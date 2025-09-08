import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertSubjectSchema, 
  insertStudySettingsSchema, 
  insertStudyCycleSchema,
  insertGlobalSubjectSchema,
  insertCycleSubjectSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Global Subjects routes
  app.get("/api/global-subjects", async (req, res) => {
    try {
      const subjects = await storage.getGlobalSubjects();
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch global subjects" });
    }
  });

  app.post("/api/global-subjects", async (req, res) => {
    try {
      const validatedData = insertGlobalSubjectSchema.parse(req.body);
      const subject = await storage.createGlobalSubject(validatedData);
      res.status(201).json(subject);
    } catch (error) {
      res.status(400).json({ message: "Invalid global subject data" });
    }
  });

  app.put("/api/global-subjects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertGlobalSubjectSchema.partial().parse(req.body);
      const subject = await storage.updateGlobalSubject(id, validatedData);
      res.json(subject);
    } catch (error) {
      res.status(400).json({ message: "Failed to update global subject" });
    }
  });

  app.delete("/api/global-subjects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteGlobalSubject(id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Global subject not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete global subject" });
    }
  });

  // Cycle Subjects routes
  app.get("/api/cycles/:cycleId/subjects", async (req, res) => {
    try {
      const { cycleId } = req.params;
      const cycleSubjects = await storage.getCycleSubjects(cycleId);
      res.json(cycleSubjects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cycle subjects" });
    }
  });

  app.post("/api/cycles/:cycleId/subjects", async (req, res) => {
    try {
      const { cycleId } = req.params;
      const validatedData = insertCycleSubjectSchema.parse({
        ...req.body,
        cycleId
      });
      const cycleSubject = await storage.addSubjectToCycle(validatedData);
      res.status(201).json(cycleSubject);
    } catch (error) {
      res.status(400).json({ message: "Invalid cycle subject data" });
    }
  });

  app.put("/api/cycle-subjects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertCycleSubjectSchema.partial().parse(req.body);
      const cycleSubject = await storage.updateCycleSubject(id, validatedData);
      res.json(cycleSubject);
    } catch (error) {
      res.status(400).json({ message: "Failed to update cycle subject" });
    }
  });

  app.delete("/api/cycle-subjects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.removeSubjectFromCycle(id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Cycle subject not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete cycle subject" });
    }
  });

  // Legacy Subjects routes (for compatibility)
  app.get("/api/subjects", async (req, res) => {
    try {
      const subjects = await storage.getSubjects();
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subjects" });
    }
  });

  app.post("/api/subjects", async (req, res) => {
    try {
      const validatedData = insertSubjectSchema.parse(req.body);
      const subject = await storage.createSubject(validatedData);
      res.status(201).json(subject);
    } catch (error) {
      res.status(400).json({ message: "Invalid subject data" });
    }
  });

  app.put("/api/subjects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertSubjectSchema.partial().parse(req.body);
      const subject = await storage.updateSubject(id, validatedData);
      res.json(subject);
    } catch (error) {
      res.status(400).json({ message: "Failed to update subject" });
    }
  });

  app.delete("/api/subjects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteSubject(id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Subject not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete subject" });
    }
  });

  // Study settings routes
  app.get("/api/study-settings", async (req, res) => {
    try {
      const settings = await storage.getStudySettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch study settings" });
    }
  });

  app.post("/api/study-settings", async (req, res) => {
    try {
      const validatedData = insertStudySettingsSchema.parse(req.body);
      const settings = await storage.createOrUpdateStudySettings(validatedData);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: "Invalid settings data" });
    }
  });

  // Study cycles routes
  app.get("/api/study-cycles", async (req, res) => {
    try {
      const cycles = await storage.getStudyCycles();
      res.json(cycles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch study cycles" });
    }
  });

  app.post("/api/study-cycles", async (req, res) => {
    try {
      const validatedData = insertStudyCycleSchema.parse(req.body);
      const cycle = await storage.createStudyCycle(validatedData);
      res.status(201).json(cycle);
    } catch (error) {
      res.status(400).json({ message: "Invalid cycle data" });
    }
  });

  app.get("/api/study-cycles/:id/data", async (req, res) => {
    try {
      const { id } = req.params;
      const cycleData = await storage.getStudyCycleData(id);
      if (cycleData) {
        res.json(cycleData);
      } else {
        res.status(404).json({ message: "Study cycle not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cycle data" });
    }
  });

  app.delete("/api/study-cycles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteStudyCycle(id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Study cycle not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete study cycle" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

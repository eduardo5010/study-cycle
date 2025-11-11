import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertSubjectSchema,
  insertStudySettingsSchema,
  insertStudyCycleSchema,
  insertGlobalSubjectSchema,
  insertCycleSubjectSchema,
  insertUserSchema,
  loginSchema,
} from "@shared/schema";
import { insertContentSchema } from "@shared/schema/content";
import type { UserType } from "@shared/types/user";

function getUserType(user: {
  isStudent: boolean;
  isTeacher: boolean;
  isAdmin: boolean;
}): UserType {
  if (user.isAdmin) return "admin";
  if (user.isTeacher) return "teacher";
  return "student";
}

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
        cycleId,
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

  // Authentication endpoints
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(validatedData.email);

      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const user = await storage.createUser(validatedData);
      const sessionUser = {
        id: user.id,
        name: user.name,
        userType: getUserType(user),
        avatar: user.avatar,
      };
      res.status(201).json(sessionUser);
    } catch (error) {
      res.status(400).json({ message: "Invalid registration data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(validatedData.email);

      if (!user || user.password !== validatedData.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const sessionUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: getUserType(user),
        avatar: user.avatar,
      };

      res.json(sessionUser);
    } catch (error) {
      res.status(400).json({ message: "Invalid login data" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    const userId = req.headers["user-id"]; // Em produção, isso viria do token JWT
    if (!userId) {
      return res.json(null);
    }

    try {
      const user = await storage.getUserById(userId as string);
      if (!user) {
        return res.json(null);
      }

      const sessionUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: getUserType(user),
        avatar: user.avatar,
      };

      res.json(sessionUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user data" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    // Em produção, isso invalidaria o token JWT
    res.status(204).send();
  });

  app.post("/api/auth/switch-to-teacher", async (req, res) => {
    const userId = req.headers["user-id"]; // Em produção, isso viria do token JWT
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = await storage.getUserById(userId as string);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUser = await storage.updateUser(user.id, {
        isTeacher: true,
      });

      if (!updatedUser) {
        throw new Error("Failed to update user");
      }

      const sessionUser = {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        userType: getUserType(updatedUser),
        avatar: updatedUser.avatar,
      };

      res.json(sessionUser);
    } catch (error) {
      console.error("Error switching to teacher:", error);
      res.status(500).json({ message: "Failed to switch to teacher" });
    }
  });

  // Rotas de cursos
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/published", async (req, res) => {
    try {
      const courses = await storage.getPublishedCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch published courses" });
    }
  });

  app.get("/api/courses/teacher/:teacherId", async (req, res) => {
    try {
      const courses = await storage.getTeacherCourses(req.params.teacherId);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch teacher courses" });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      const userId = req.headers["user-id"];
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUserById(userId as string);
      if (!user || !user.isTeacher) {
        return res
          .status(403)
          .json({ message: "Only teachers can create courses" });
      }

      const course = await storage.createCourse({
        ...req.body,
        creatorId: userId as string,
      });
      res.status(201).json(course);
    } catch (error) {
      res.status(400).json({ message: "Failed to create course" });
    }
  });

  // Rotas de gamificação
  app.get("/api/gamification/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const gamificationData = await storage.getGamificationData(userId);
      res.json(gamificationData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gamification data" });
    }
  });

  // ML instrumentation: log review events
  app.post("/api/ml/events", async (req, res) => {
    try {
      const payload = req.body;
      // basic validation
      if (
        !payload ||
        !payload.userId ||
        !payload.itemId ||
        typeof payload.correctness === "undefined"
      ) {
        return res.status(400).json({ message: "Invalid event payload" });
      }

      const ev = await storage.logReviewEvent({
        userId: payload.userId,
        itemId: payload.itemId,
        timestamp: payload.timestamp || new Date().toISOString(),
        correctness: payload.correctness ? 1 : 0,
        responseTimeMs: payload.responseTimeMs,
        nReps: payload.nReps,
        timeSinceLastReviewSec: payload.timeSinceLastReviewSec,
      });

      res.status(201).json(ev);
    } catch (error) {
      console.error("Failed to log review event", error);
      res.status(500).json({ message: "Failed to log review event" });
    }
  });

  // Retrieve all ML review events (for training worker)
  app.get("/api/ml/events", async (req, res) => {
    try {
      const events = await storage.getAllReviewEvents();
      // serialize dates
      const serialized = events.map((e) => ({
        ...e,
        timestamp: e.timestamp ? new Date(e.timestamp).toISOString() : null,
        createdAt: e.createdAt ? new Date(e.createdAt).toISOString() : null,
      }));
      res.json(serialized);
    } catch (error) {
      console.error("Failed to fetch review events", error);
      res.status(500).json({ message: "Failed to fetch review events" });
    }
  });

  // User lambda sync endpoints (get/set)
  app.get("/api/ml/lambda/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const rec = await storage.getUserLambda(userId);
      if (!rec) return res.json(null);
      res.json({
        lambda: rec.lambda,
        updatedAt: rec.updatedAt.toISOString(),
        source: rec.source || null,
      });
    } catch (error) {
      console.error("Failed to get user lambda", error);
      res.status(500).json({ message: "Failed to get user lambda" });
    }
  });

  app.post("/api/ml/lambda/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { lambda, source } = req.body || {};
      if (typeof lambda !== "number")
        return res.status(400).json({ message: "Missing lambda number" });
      await storage.setUserLambda(userId, lambda, source || "online");
      res.status(204).send();
    } catch (error) {
      console.error("Failed to set user lambda", error);
      res.status(500).json({ message: "Failed to set user lambda" });
    }
  });

  // ML prediction endpoint (simple baseline using the exponential formula)
  app.post("/api/ml/predict", async (req, res) => {
    try {
      const {
        userId,
        itemId,
        candidateIntervals,
        lambda,
        sum_t_over_n,
        n_next,
      } = req.body || {};

      // candidateIntervals in seconds (array) - optional
      const candidates: number[] = Array.isArray(candidateIntervals)
        ? candidateIntervals
        : [3600 * 24, 3600 * 24 * 2, 3600 * 24 * 4, 3600 * 24 * 7];

      // compute S = sum(t_i / n_i) either from provided sum or from recent events
      let S = 0;
      if (typeof sum_t_over_n === "number") {
        S = sum_t_over_n;
      } else if (userId && itemId) {
        const events = await storage.getReviewEventsForUser(userId);
        // compute approximate S using last N events for the same item
        const itemEvents = events.filter((e) => e.itemId === itemId).slice(-10);
        S = itemEvents.reduce((acc, e) => {
          const t =
            typeof e.timeSinceLastReviewSec === "number"
              ? e.timeSinceLastReviewSec
              : 0;
          const n = e.nReps && e.nReps > 0 ? e.nReps : 1;
          return acc + t / n;
        }, 0);
      }

      const lambdaUsed = typeof lambda === "number" ? lambda : 0.15; // fallback default
      const nNext = typeof n_next === "number" && n_next > 0 ? n_next : 1;
      // compute predicted probabilities for each candidate interval: R = exp(-lambda*(S + t/n_next))
      const results = candidates.map((tSec) => {
        const t = tSec; // seconds
        const R = Math.exp(-lambdaUsed * (S + t / nNext));
        return { intervalSec: t, predictedRetention: R };
      });

      // choose smallest interval that achieves target retention (0.9)
      const target = 0.9;
      let chosen =
        results.find((r) => r.predictedRetention >= target) ||
        results[results.length - 1];

      res.json({
        recommendedIntervalSec: chosen.intervalSec,
        predictedRetention: chosen.predictedRetention,
        model: "baseline-exponential",
        lambda: lambdaUsed,
        S,
        candidates: results,
      });
    } catch (error) {
      console.error("Prediction failed", error);
      res.status(500).json({ message: "Prediction failed" });
    }
  });

  // Review variants: list variants for an item
  app.get("/api/reviews/:itemId/variants", async (req, res) => {
    try {
      const { itemId } = req.params;
      const variants = await storage.getReviewVariantsForItem(itemId);
      res.json(variants);
    } catch (error) {
      console.error("Failed to list variants", error);
      res.status(500).json({ message: "Failed to list variants" });
    }
  });

  // Create a human-provided variant for an item
  app.post("/api/reviews/:itemId/variants", async (req, res) => {
    try {
      const { itemId } = req.params;
      const payload = req.body;
      if (!payload || !payload.content)
        return res.status(400).json({ message: "Missing content" });

      const variant = await storage.createReviewVariant({
        itemId,
        authorId: payload.authorId || null,
        type: "human",
        content: payload.content,
        metadata: payload.metadata || {},
      });

      res.status(201).json(variant);
    } catch (error) {
      console.error("Failed to create variant", error);
      res.status(500).json({ message: "Failed to create variant" });
    }
  });

  // Generate an AI variant (mock) — in prod hook to external AI service
  app.post("/api/reviews/:itemId/generate", async (req, res) => {
    try {
      const { itemId } = req.params;
      const { prompt, authorId } = req.body || {};

      // Prefer real OpenAI generation if API key is provided
      const openAiKey = process.env.OPENAI_API_KEY;
      let generatedText = "";
      const basePrompt =
        prompt ||
        `Create a short multiple-choice question (1 correct + 3 distractors) or a cloze sentence about the key point of item ${itemId}. Return JSON with fields: question, choices (array), answerIndex (number).`;

      if (openAiKey) {
        try {
          const resp = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${openAiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                  {
                    role: "system",
                    content:
                      "You are an assistant that generates small review questions suitable for flashcards and quizzes.",
                  },
                  { role: "user", content: basePrompt },
                ],
                max_tokens: 400,
                temperature: 0.7,
              }),
            }
          );

          if (resp.ok) {
            const data = await resp.json();
            const msg = data?.choices?.[0]?.message?.content;
            generatedText =
              typeof msg === "string" ? msg : JSON.stringify(msg || "");
          } else {
            const txt = await resp.text();
            console.warn("OpenAI error", resp.status, txt);
            generatedText = basePrompt; // fallback
          }
        } catch (err) {
          console.error("OpenAI request failed", err);
          generatedText = basePrompt;
        }
      } else {
        // fallback: simple mock generation
        generatedText = JSON.stringify({
          question: `(AI) What is a key point for ${itemId}?`,
          choices: [],
          answerIndex: 0,
        });
      }

      // Try to parse JSON returned by the LLM; if not JSON, wrap as a question text
      let parsed: any = null;
      try {
        parsed = JSON.parse(generatedText);
      } catch (e) {
        parsed = { question: generatedText, choices: [], answerIndex: 0 };
      }

      const variant = await storage.createReviewVariant({
        itemId,
        authorId: authorId || null,
        type: "ai",
        content: parsed,
        metadata: { generatedBy: openAiKey ? "openai" : "mock-ai" },
      });

      res.status(201).json(variant);
    } catch (error) {
      console.error("AI generation failed", error);
      res.status(500).json({ message: "AI generation failed" });
    }
  });

  // Mark a variant used by a user (to avoid immediate repetition)
  app.post("/api/reviews/variants/:variantId/used", async (req, res) => {
    try {
      const { variantId } = req.params;
      const { userId } = req.body || {};
      if (!userId) return res.status(400).json({ message: "Missing userId" });
      await storage.markVariantUsed(variantId, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Failed to mark variant used", error);
      res.status(500).json({ message: "Failed to mark variant used" });
    }
  });

  // Clear all cycle data endpoint
  app.delete("/api/cycles/clear", async (req, res) => {
    try {
      const cleared = await storage.clearAllCycleData();
      if (cleared) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: "Failed to clear cycle data" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cycle data" });
    }
  });

  // Content management endpoints
  app.get("/api/content", async (req, res) => {
    try {
      const content = await storage.getAllContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.post("/api/content", async (req, res) => {
    try {
      const validatedData = insertContentSchema.parse(req.body);
      const content = await storage.createContent(
        validatedData,
        "mock-teacher-id"
      );
      res.status(201).json(content);
    } catch (error) {
      res.status(400).json({ message: "Invalid content data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

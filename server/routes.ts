import type { Express } from "express";
import multer from "multer";
import { createServer, type Server } from "http";
import { randomUUID } from "crypto";
import fs from "fs";
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
import { hashPassword, comparePassword, signToken, getUserIdFromReq } from "./utils/auth";
import { requireAuth, requireTeacher } from "./middleware/auth";
import { asyncHandler, ValidationError, AuthenticationError, NotFoundError, ConflictError } from "./utils/errors";
import { logger } from "./utils/logger";
import { env } from "./utils/env";

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
  // Multer setup for handling file uploads. We store files under server/uploads/<userId>/
  const diskStorage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
      const userId = (req.headers["user-id"] || "anonymous") as string;
      const path = `./server/uploads/${userId}`;
      // ensure directory exists
      try {
        fs.mkdirSync(path, { recursive: true });
      } catch (e) {
        // ignore
      }
      cb(null, path);
    },
    filename: function (req: any, file: any, cb: any) {
      const uid = randomUUID();
      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
      cb(null, `${uid}-${safeName}`);
    },
  });

  const upload = multer({ storage: diskStorage });

  // Simple in-memory map to correlate OAuth state -> intent (login or link) and userId (for linking)
  const oauthStateMap: Map<
    string,
    { action: "login" | "link"; userId?: string }
  > = new Map();

  // Start OAuth flow for providers (only GitHub implemented here). If the request
  // includes a valid Authorization header, we treat the flow as a "link" action
  // (attach provider to existing account); otherwise it's a login/signup flow.
  app.get("/api/auth/oauth/:provider", async (req, res) => {
    try {
      const { provider } = req.params;
      console.log("OAuth provider requested:", provider);
      console.log("Supported providers:", ["github", "google"]);
      const supported = ["github", "google"];
      if (!supported.includes(provider)) {
        console.log("Provider not supported:", provider);
        return res.status(501).json({ message: "Provider not implemented" });
      }

      const state = randomUUID();

      // determine if this is a linking flow (has valid bearer token)
      const userId = getUserIdFromReq(req as any);
      if (userId) {
        oauthStateMap.set(state, { action: "link", userId });
      } else {
        oauthStateMap.set(state, { action: "login" });
      }

      const frontend = env.FRONTEND_URL;

      if (provider === "github") {
        const clientId = env.GITHUB_CLIENT_ID;
        const redirectUri = `${
          env.SERVER_URL
        }/api/auth/oauth/github/callback`;
        const scope = "user:email";
        const url = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(
          String(clientId)
        )}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(
          state
        )}`;
        return res.redirect(url);
      }

      if (provider === "google") {
        const clientId = env.GOOGLE_CLIENT_ID;
        const redirectUri = `${
          env.SERVER_URL
        }/api/auth/oauth/google/callback`;
        const scope = "openid email profile";
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
          String(clientId)
        )}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&response_type=code&scope=${encodeURIComponent(
          scope
        )}&state=${encodeURIComponent(state)}`;
        return res.redirect(url);
      }

      if (provider === "facebook") {
        const clientId = env.FACEBOOK_CLIENT_ID;
        const redirectUri = `${
          env.SERVER_URL
        }/api/auth/oauth/facebook/callback`;
        const scope = "email";
        const url = `https://www.facebook.com/v15.0/dialog/oauth?client_id=${encodeURIComponent(
          String(clientId)
        )}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&state=${encodeURIComponent(state)}&scope=${encodeURIComponent(
          scope
        )}`;
        return res.redirect(url);
      }

      res.status(400).json({ message: "Unsupported provider" });
    } catch (err) {
      logger.error("Failed to start OAuth flow", err);
      res.status(500).json({ message: "Failed to start OAuth flow" });
    }
  });

  // GitHub callback handler: exchange code for access token, fetch user info,
  // then either sign-in/up the user or attach (link) the GitHub account to an
  // existing user depending on the saved state.
  app.get("/api/auth/oauth/github/callback", async (req, res) => {
    try {
      const { code, state } = req.query as any;
      if (!code || !state) return res.status(400).send("Missing code/state");

      const mapping = oauthStateMap.get(String(state));
      if (!mapping) return res.status(400).send("Invalid or expired state");

      // exchange code for access token
      const tokenResp = await fetch(
        "https://github.com/login/oauth/access_token",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id: env.GITHUB_CLIENT_ID || "",
            client_secret: env.GITHUB_CLIENT_SECRET || "",
            code,
          }),
        }
      );

      const tokenJson = await tokenResp.json();
      const accessToken = tokenJson.access_token;
      if (!accessToken) {
        logger.error("GitHub token error", undefined, { tokenJson });
        return res.status(400).send("Failed to obtain GitHub access token");
      }

      // fetch user profile
      const ghUserResp = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: "application/json",
        },
      });
      const ghUser = await ghUserResp.json();

      // fetch primary email (may be separate)
      let email = ghUser.email;
      if (!email) {
        try {
          const emailsResp = await fetch("https://api.github.com/user/emails", {
            headers: {
              Authorization: `token ${accessToken}`,
              Accept: "application/vnd.github.v3+json",
            },
          });
          const emails = await emailsResp.json();
          const primary = Array.isArray(emails)
            ? emails.find((e: any) => e.primary)
            : null;
          email = primary?.email || (emails[0] && emails[0].email) || email;
        } catch (e) {
          // ignore
        }
      }

      const githubId = ghUser.id ? String(ghUser.id) : undefined;

      if (mapping.action === "link" && mapping.userId) {
        // attach GitHub info to existing user
        try {
          const existing = await storage.getUserById(mapping.userId);
          if (!existing)
            return res.status(404).send("User not found for linking");

          const updated = await storage.updateUser(existing.id, {
            // store provider info; storage is permissive in-memory
            githubId,
            githubProfile: ghUser,
          } as any);

          oauthStateMap.delete(String(state));
          return res.redirect(
            `${
              process.env.FRONTEND_URL || "http://localhost:5173"
            }/profile?linked=github`
          );
        } catch (e) {
          logger.error("Failed to link GitHub account", e);
          return res.status(500).send("Failed to link account");
        }
      }

      // Otherwise, treat as login/signup
      let user = null;
      if (email) user = await storage.getUserByEmail(String(email));

      if (!user) {
        // create a new user with a random password (user should set password later)
        const pwd = randomUUID();
        const newUser = await storage.createUser({
          email: email || `github+${githubId}@no-email.local`,
          password: pwd,
          name: ghUser.name || ghUser.login || "GitHub User",
          isStudent: true,
        } as any);
        // attach github info
        await storage.updateUser(newUser.id, {
          githubId,
          githubProfile: ghUser,
        } as any);
        user = newUser;
      }

      const token = signToken(user.id);
      oauthStateMap.delete(String(state));
      // redirect to frontend callback handler with token
      const redirectTo = `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/auth/callback?token=${encodeURIComponent(token)}`;
      return res.redirect(redirectTo);
    } catch (err) {
      logger.error("GitHub callback failed", err);
      res.status(500).send("OAuth callback failed");
    }
  });

  // Google callback
  app.get("/api/auth/oauth/google/callback", async (req, res) => {
    try {
      const { code, state } = req.query as any;
      if (!code || !state) return res.status(400).send("Missing code/state");

      const mapping = oauthStateMap.get(String(state));
      if (!mapping) return res.status(400).send("Invalid or expired state");

      // exchange code for tokens
      const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code: String(code),
          client_id: String(env.GOOGLE_CLIENT_ID || ""),
          client_secret: String(env.GOOGLE_CLIENT_SECRET || ""),
          redirect_uri: `${
            env.SERVER_URL
          }/api/auth/oauth/google/callback`,
          grant_type: "authorization_code",
        }),
      });

      const tokenJson = await tokenResp.json();
      const accessToken = tokenJson.access_token;
      const idToken = tokenJson.id_token;
      if (!accessToken && !idToken) {
        logger.error("Google token error", undefined, { tokenJson });
        return res.status(400).send("Failed to obtain Google access token");
      }

      // fetch userinfo
      let profile: any = null;
      try {
        const ui = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        profile = await ui.json();
      } catch (e) {
        // fallback: decode id_token if present
        if (idToken) {
          const parts = String(idToken).split(".");
          if (parts.length >= 2) {
            const payload = JSON.parse(
              Buffer.from(parts[1], "base64").toString()
            );
            profile = payload;
          }
        }
      }

      const email = profile?.email;
      const googleId = profile?.sub || profile?.id;

      if (mapping.action === "link" && mapping.userId) {
        const existing = await storage.getUserById(mapping.userId);
        if (!existing)
          return res.status(404).send("User not found for linking");
        await storage.updateUser(existing.id, {
          googleId: googleId ? String(googleId) : undefined,
          googleProfile: profile,
        } as any);
        oauthStateMap.delete(String(state));
        return res.redirect(
          `${
            process.env.FRONTEND_URL || "http://localhost:5173"
          }/profile?linked=google`
        );
      }

      let user = null;
      if (email) user = await storage.getUserByEmail(String(email));
      if (!user) {
        const pwd = randomUUID();
        const newUser = await storage.createUser({
          email: email || `google+${googleId}@no-email.local`,
          password: pwd,
          name: profile?.name || profile?.email || "Google User",
          isStudent: true,
        } as any);
        await storage.updateUser(newUser.id, {
          googleId,
          googleProfile: profile,
        } as any);
        user = newUser;
      }

      const token = signToken(user.id);
      oauthStateMap.delete(String(state));
      return res.redirect(
        `${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }/auth/callback?token=${encodeURIComponent(token)}`
      );
    } catch (err) {
      logger.error("Google callback failed", err);
      res.status(500).send("OAuth callback failed");
    }
  });

  // Facebook callback
  app.get("/api/auth/oauth/facebook/callback", async (req, res) => {
    try {
      const { code, state } = req.query as any;
      if (!code || !state) return res.status(400).send("Missing code/state");

      const mapping = oauthStateMap.get(String(state));
      if (!mapping) return res.status(400).send("Invalid or expired state");

      const redirectUri = `${
        env.SERVER_URL
      }/api/auth/oauth/facebook/callback`;
      // exchange code for token (facebook uses GET)
      const tokenUrl = `https://graph.facebook.com/v15.0/oauth/access_token?client_id=${encodeURIComponent(
        String(env.FACEBOOK_CLIENT_ID || "")
      )}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&client_secret=${encodeURIComponent(
        String(env.FACEBOOK_CLIENT_SECRET || "")
      )}&code=${encodeURIComponent(String(code))}`;
      const tokenResp = await fetch(tokenUrl);
      const tokenJson = await tokenResp.json();
      const accessToken = tokenJson.access_token;
      if (!accessToken) {
        logger.error("Facebook token error", undefined, { tokenJson });
        return res.status(400).send("Failed to obtain Facebook access token");
      }

      const meUrl = `https://graph.facebook.com/me?fields=id,name,email&access_token=${encodeURIComponent(
        accessToken
      )}`;
      const meResp = await fetch(meUrl);
      const profile = await meResp.json();

      const email = profile?.email;
      const facebookId = profile?.id ? String(profile.id) : undefined;

      if (mapping.action === "link" && mapping.userId) {
        const existing = await storage.getUserById(mapping.userId);
        if (!existing)
          return res.status(404).send("User not found for linking");
        await storage.updateUser(existing.id, {
          facebookId,
          facebookProfile: profile,
        } as any);
        oauthStateMap.delete(String(state));
        return res.redirect(
          `${
            process.env.FRONTEND_URL || "http://localhost:5173"
          }/profile?linked=facebook`
        );
      }

      let user = null;
      if (email) user = await storage.getUserByEmail(String(email));
      if (!user) {
        const pwd = randomUUID();
        const newUser = await storage.createUser({
          email: email || `facebook+${facebookId}@no-email.local`,
          password: pwd,
          name: profile?.name || "Facebook User",
          isStudent: true,
        } as any);
        await storage.updateUser(newUser.id, {
          facebookId,
          facebookProfile: profile,
        } as any);
        user = newUser;
      }

      const token = signToken(user.id);
      oauthStateMap.delete(String(state));
      return res.redirect(
        `${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }/auth/callback?token=${encodeURIComponent(token)}`
      );
    } catch (err) {
      logger.error("Facebook callback failed", err);
      res.status(500).send("OAuth callback failed");
    }
  });

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
  app.post(
    "/api/auth/register",
    asyncHandler(async (req, res) => {
      const validatedData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(validatedData.email);

      if (existingUser) {
        throw new ConflictError("Email already registered");
      }

      // Hash password before storing
      const hashedPassword = await hashPassword(validatedData.password);
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      const sessionUser = {
        id: user.id,
        name: user.name,
        userType: getUserType(user),
        avatar: user.avatar,
      };
      const token = signToken(user.id);
      res.status(201).json({ ...sessionUser, token });
    })
  );

  app.post(
    "/api/auth/login",
    asyncHandler(async (req, res) => {
      const validatedData = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(validatedData.email);

      if (!user) {
        throw new AuthenticationError("Invalid credentials");
      }

      // Compare password with hash
      const isPasswordValid = await comparePassword(
        validatedData.password,
        user.password
      );

      if (!isPasswordValid) {
        throw new AuthenticationError("Invalid credentials");
      }

      const sessionUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: getUserType(user),
        avatar: user.avatar,
        memoryType: user.memoryType,
        memoryLambda: user.memoryLambda,
      };
      const token = signToken(user.id);
      res.json({ ...sessionUser, token });
    })
  );

  app.get(
    "/api/auth/me",
    asyncHandler(async (req, res) => {
      const userId = getUserIdFromReq(req as any);
      if (!userId) {
        return res.json(null);
      }

      const user = await storage.getUserById(userId);
      if (!user) {
        return res.json(null);
      }

      const sessionUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: getUserType(user),
        avatar: user.avatar,
        memoryType: user.memoryType,
        memoryLambda: user.memoryLambda,
      };

      res.json(sessionUser);
    })
  );

  app.post("/api/auth/logout", (req, res) => {
    // Em produção, isso invalidaria o token JWT
    res.status(204).send();
  });

  app.post("/api/auth/switch-to-teacher", async (req, res) => {
    const userId = getUserIdFromReq(req as any);
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
      logger.error("Error switching to teacher", error);
      res.status(500).json({ message: "Failed to switch to teacher" });
    }
  });

  app.patch("/api/auth/update-memory", async (req, res) => {
    const userId = getUserIdFromReq(req as any);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { memoryType, memoryLambda } = req.body;

      if (!memoryType || typeof memoryLambda !== 'number') {
        return res.status(400).json({ message: "Invalid memory data" });
      }

      const user = await storage.getUserById(userId as string);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUser = await storage.updateUser(user.id, {
        memoryType,
        memoryLambda,
      });

      if (!updatedUser) {
        throw new Error("Failed to update user memory settings");
      }

      const sessionUser = {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        userType: getUserType(updatedUser),
        avatar: updatedUser.avatar,
        memoryType: updatedUser.memoryType,
        memoryLambda: updatedUser.memoryLambda,
      };

      res.json(sessionUser);
    } catch (error) {
      logger.error("Error updating memory settings", error);
      res.status(500).json({ message: "Failed to update memory settings" });
    }
  });

  // Unlink an OAuth provider from the current user
  app.post("/api/auth/unlink/:provider", async (req, res) => {
    try {
      const userId = getUserIdFromReq(req as any);
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      const { provider } = req.params;
      const user = await storage.getUserById(userId as string);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (provider === "github") {
        await storage.updateUser(user.id, {
          githubId: null,
          githubProfile: null,
        } as any);
      } else if (provider === "google") {
        await storage.updateUser(user.id, {
          googleId: null,
          googleProfile: null,
        } as any);
      } else if (provider === "facebook") {
        await storage.updateUser(user.id, {
          facebookId: null,
          facebookProfile: null,
        } as any);
      } else {
        return res.status(400).json({ message: "Unknown provider" });
      }

      res.status(204).send();
    } catch (err) {
      logger.error("Failed to unlink provider", err);
      res.status(500).json({ message: "Failed to unlink provider" });
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

  app.post(
    "/api/courses",
    requireAuth,
    requireTeacher,
    asyncHandler(async (req: any, res) => {
      const course = await storage.createCourse({
        ...req.body,
        creatorId: req.userId!,
      });
      res.status(201).json(course);
    })
  );

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
      logger.error("Failed to log review event", error);
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
      logger.error("Failed to fetch review events", error);
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
      logger.error("Failed to get user lambda", error);
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
      logger.error("Failed to set user lambda", error);
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
      logger.error("Prediction failed", error);
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
      logger.error("Failed to list variants", error);
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
      logger.error("Failed to create variant", error);
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
            logger.warn("OpenAI error", { status: resp.status, text: txt });
            generatedText = basePrompt; // fallback
          }
        } catch (err) {
          logger.error("OpenAI request failed", err);
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
      logger.error("AI generation failed", error);
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
      logger.error("Failed to mark variant used", error);
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

  // File upload endpoint (multipart/form-data)
  // Fields: file (binary). Requires header "user-id" to map uploads to a user.
  app.post("/api/uploads", upload.single("file"), async (req, res) => {
    try {
      const userId = getUserIdFromReq(req as any) as string | undefined;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      const file = (req as any).file as
        | { originalname: string; mimetype: string; size: number; path: string }
        | undefined;
      if (!file) return res.status(400).json({ message: "Missing file" });

      const content = await storage.createContent(
        {
          title: file.originalname,
          description: null,
          metadata: {
            private: true,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            path: file.path,
          },
          creatorId: userId,
          type: "file",
          contentType: file.mimetype,
          contentUrl: file.path,
          thumbnailUrl: null,
          tags: [],
          isPublished: false,
        },
        userId
      );

      // enqueue OCR job (best-effort, non-blocking)
      import("./ocr/queue")
        .then((mod) => mod.enqueue(file.path, content.id, userId))
        .catch((err) => logger.warn("OCR queue failed to enqueue", err));

      res.status(201).json(content);
    } catch (error) {
      logger.error("Upload failed", error);
      res.status(500).json({ message: "Upload failed" });
    }
  });

  // Secure download: only owner can download their uploaded file
  app.get("/api/uploads/:contentId/file", async (req, res) => {
    try {
      const userId = getUserIdFromReq(req as any) as string | undefined;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      const { contentId } = req.params;
      const contents = await storage.getAllContent();
      const content = contents.find((c) => c.id === contentId);
      if (!content) return res.status(404).json({ message: "Not found" });
      if (content.creatorId !== userId)
        return res.status(403).json({ message: "Forbidden" });

      const path = content.contentUrl as string | null;
      if (!path) return res.status(404).json({ message: "File not available" });

      // stream the file
      if (!fs.existsSync(path))
        return res.status(404).json({ message: "File not found on disk" });
      res.setHeader(
        "Content-Type",
        content.contentType || "application/octet-stream"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${
          ((content.metadata as any)?.originalName as string) ||
          content.title ||
          contentId
        }"`
      );
      const stream = fs.createReadStream(path);
      stream.pipe(res);
    } catch (err) {
      logger.error("Download failed", err);
      res.status(500).json({ message: "Download failed" });
    }
  });

  // List uploads for the current user
  app.get("/api/uploads", async (req, res) => {
    try {
      const userId = getUserIdFromReq(req as any) as string | undefined;
      const me = req.query.me === "1" || req.query.me === "true";
      if (me && !userId)
        return res.status(401).json({ message: "Unauthorized" });
      const contents = await storage.getAllContent();
      const filtered = me
        ? contents.filter((c) => c.creatorId === userId)
        : contents;
      res.json(
        filtered.map((c) => ({
          id: c.id,
          title: c.title,
          metadata: c.metadata,
          createdAt: c.createdAt,
        }))
      );
    } catch (err) {
      logger.error("Failed to list uploads", err);
      res.status(500).json({ message: "Failed to list uploads" });
    }
  });

  // Generate review variants from an uploaded content item (text/media)
  app.post("/api/content/:id/generate", async (req, res) => {
    try {
      const userId = getUserIdFromReq(req as any) as string | undefined;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      const { id } = req.params;
      const { difficulty, modes } = req.body || {};
      // modes could be array like ['flashcard','quiz','exercise']

      // For now, call the existing AI generator per item to produce variants
      // Load content to include text context if available
      const contents = await storage.getAllContent();
      const content = contents.find((c) => c.id === id);
      if (!content)
        return res.status(404).json({ message: "Content not found" });

      const contextText =
        ((content.metadata as any)?.ocrText as string) ||
        content.description ||
        "";
      // delegate to AI generator helper
      const gen = await import("./ai/generator");
      const openAiKey = process.env.OPENAI_API_KEY;
      const generated = await gen.generateReviewItems(
        contextText,
        difficulty,
        modes,
        openAiKey
      );

      // Before storing variants, compute per-user forgetting probability R and
      // a simple nextReviewAt estimate using past review events for this user+item.
      // Formula: R = exp(-lambda * sum_i (t_i / n_i)), where t_i is seconds
      // since event i and n_i is nReps at that event (fallback 1). We'll set
      // nextReviewAt = now + max(60s, round(sum)) as a simple heuristic.
      const now = Date.now();
      const pastEvents = await storage.getReviewEventsForUser(userId);
      const eventsForItem = pastEvents.filter((e) => e.itemId === id);

      let sum = 0;
      for (const ev of eventsForItem) {
        const ts =
          ev.timestamp instanceof Date
            ? ev.timestamp.getTime()
            : new Date(ev.timestamp).getTime();
        const tSec = Math.max(0, (now - ts) / 1000);
        const n = ev.nReps && ev.nReps > 0 ? ev.nReps : 1;
        sum += tSec / n;
      }

      // get user's lambda (fallback to a reasonable default)
      const lambdaRow = await storage.getUserLambda(userId);
      const lambda = lambdaRow?.lambda ?? 0.000001;

      const forgettingProb = Math.exp(-lambda * sum);
      const nextDelaySec = Math.max(60, Math.round(sum));
      const nextReviewAt = new Date(
        Date.now() + nextDelaySec * 1000
      ).toISOString();

      // store generated items as review variants, preserving difficulty, type and schedule metadata
      const stored: any[] = [];
      for (const g of generated) {
        const metadata = {
          generatedFrom: id,
          difficulty: g.difficulty,
          itemType: g.type,
          schedule: {
            userId,
            nextReviewAt,
            nextDelaySec,
            forgettingProb,
            lambdaUsed: lambda,
            sum, // diagnostic: sum of t_i/n_i
          },
        } as any;

        const v = await storage.createReviewVariant({
          itemId: id,
          authorId: null,
          type: "ai",
          content: g.content,
          metadata,
        });
        stored.push(v);
      }

      // seed a review event for the user so the scheduler has an initial signal
      try {
        await storage.logReviewEvent({
          userId: userId,
          itemId: id,
          timestamp: new Date().toISOString(),
          correctness: 1,
          responseTimeMs: 0,
          nReps: 1,
          timeSinceLastReviewSec: 0,
        });
      } catch (e) {
        logger.warn("Failed to log initial review event", { error: e });
      }

      res.status(201).json({
        generated: stored,
        schedule: { nextReviewAt, forgettingProb, lambda, sum },
      });
    } catch (err) {
      logger.error("Generation from content failed", err);
      res.status(500).json({ message: "Generation failed" });
    }
  });

  // List scheduled review variants for a user (ready to review)
  app.get("/api/ml/schedule/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId) return res.status(400).json({ message: "Missing userId" });
      const allVariants = await storage.getAllReviewVariants();
      const now = new Date();
      const ready = allVariants.filter((v: any) => {
        try {
          const sched = v.metadata && v.metadata.schedule;
          if (!sched) return false;
          if (sched.userId !== userId) return false;
          const next = sched.nextReviewAt;
          if (!next) return false;
          const nextDate = new Date(next);
          return nextDate <= now;
        } catch (e) {
          return false;
        }
      });

      // return small summary to avoid huge payloads
      const summary = ready.map((v: any) => ({
        id: v.id,
        itemId: v.itemId,
        content: v.content,
        metadata: v.metadata,
      }));
      res.json({ count: summary.length, items: summary });
    } catch (error) {
      logger.error("Failed to list scheduled variants", error);
      res.status(500).json({ message: "Failed to list scheduled variants" });
    }
  });

  // Adjust per-user lambda based on recent review events (simple heuristic)
  app.post("/api/ml/adjust-lambda/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { learningRate, window } = req.body || {};
      if (!userId) return res.status(400).json({ message: "Missing userId" });

      const events = await storage.getReviewEventsForUser(userId);
      const w = typeof window === "number" && window > 0 ? window : 50;
      const recent = events.slice(-w);
      if (recent.length === 0) {
        return res
          .status(400)
          .json({ message: "Not enough events to adjust lambda" });
      }

      const avg =
        recent.reduce((acc, e) => acc + (e.correctness || 0), 0) /
        recent.length;
      const lr = typeof learningRate === "number" ? learningRate : 0.2; // default

      const current = (await storage.getUserLambda(userId))?.lambda ?? 0.15;
      // multiplicative update: increase lambda if performance low, decrease if high
      const target = 0.8;
      const factor = Math.exp(lr * (target - avg));
      const newLambda = Math.max(1e-8, current * factor);

      await storage.setUserLambda(userId, newLambda, "auto-adjust");
      res.json({
        lambda: newLambda,
        previous: current,
        avgCorrectness: avg,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Failed to adjust lambda", error);
      res.status(500).json({ message: "Failed to adjust lambda" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

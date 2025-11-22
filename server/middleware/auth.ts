import type { Request, Response, NextFunction } from "express";
import { getUserIdFromReq } from "../utils/auth";
import { storage } from "../storage";

/**
 * Middleware to require authentication
 * Adds req.userId and req.user to the request object
 */
export async function requireAuth(
  req: Request & { userId?: string; user?: any },
  res: Response,
  next: NextFunction
) {
  const userId = getUserIdFromReq(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await storage.getUserById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.userId = userId;
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Authentication error" });
  }
}

/**
 * Middleware to require teacher role
 * Must be used after requireAuth
 */
export function requireTeacher(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!req.user.isTeacher) {
    return res.status(403).json({ message: "Only teachers can access this resource" });
  }

  next();
}

/**
 * Middleware to require admin role
 * Must be used after requireAuth
 */
export function requireAdmin(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Only admins can access this resource" });
  }

  next();
}


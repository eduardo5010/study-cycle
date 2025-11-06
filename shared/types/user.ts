import type { users } from "../schema";

export type UserType = "student" | "teacher" | "admin";

export type SessionUser = typeof users.$inferSelect & {
  userType: UserType;
};

export type InsertUser = typeof users.$inferInsert & {
  confirmPassword?: string;
};

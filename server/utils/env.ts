/**
 * Environment variable validation and helpers
 */

interface EnvConfig {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  SERVER_URL: string;
  FRONTEND_URL: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  FACEBOOK_CLIENT_ID?: string;
  FACEBOOK_CLIENT_SECRET?: string;
  OPENAI_API_KEY?: string;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue!;
}

function getEnvVarAsNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const num = parseInt(value, 10);
  if (isNaN(num)) {
    throw new Error(`Invalid number for environment variable: ${key}`);
  }
  return num;
}

export function validateEnv(): EnvConfig {
  const isProduction = process.env.NODE_ENV === "production";

  // Validate JWT_SECRET in production
  const jwtSecret = getEnvVar("JWT_SECRET");
  if (isProduction && jwtSecret === "dev-secret") {
    throw new Error(
      "JWT_SECRET must be changed from default value in production"
    );
  }

  return {
    PORT: getEnvVarAsNumber("PORT", 5000),
    NODE_ENV: (process.env.NODE_ENV || "development") as EnvConfig["NODE_ENV"],
    SERVER_URL: getEnvVar("SERVER_URL", "http://localhost:3000"),
    FRONTEND_URL: getEnvVar("FRONTEND_URL", "http://localhost:5173"),
    DATABASE_URL: process.env.DATABASE_URL || "./database.sqlite",
    JWT_SECRET: jwtSecret,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  };
}

export const env = validateEnv();


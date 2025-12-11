import { defineConfig } from "drizzle-kit";

// Detect database type based on DATABASE_URL
const databaseUrl = process.env.DATABASE_URL || "./database.sqlite";
const isPostgres = databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://");

// Configuration for both SQLite and PostgreSQL
export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: isPostgres ? "postgresql" : "sqlite",
  dbCredentials: isPostgres ? {
    url: databaseUrl,
  } : {
    url: databaseUrl,
  },
});

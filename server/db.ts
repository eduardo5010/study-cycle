import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

// Initialize a Postgres pool and drizzle client using DATABASE_URL
const connectionStringRaw =
  process.env.DATABASE_URL || process.env.PG_CONNECTION || null;

if (!connectionStringRaw) {
  // No connection string provided; fall back to localhost and warn
  // Keep behavior backward-compatible but log an explicit hint
  console.warn(
    "No DATABASE_URL or PG_CONNECTION detected. Falling back to postgres://localhost:5432/study_cycle. Set DATABASE_URL to use Postgres in production."
  );
}

if (connectionStringRaw && typeof connectionStringRaw !== "string") {
  throw new Error(
    `DATABASE_URL (or PG_CONNECTION) must be a string, got ${typeof connectionStringRaw}`
  );
}

const connectionString =
  (connectionStringRaw as string) || "postgresql://localhost:5432/study_cycle";

// quick sanity check: try to parse URL and warn if password is missing
try {
  const parsed = new URL(connectionString);
  // parsed.password will be '' if not present
  if (!parsed.password) {
    console.warn(
      "DATABASE_URL parsed but contains no password. If your server requires auth, set a password in the URL or use PGUSER/PGPASSWORD env vars."
    );
  }
} catch (e) {
  // Not a URL-like string; pg will still try to parse it. We only warn in debug.
}

const pool = new Pool({ connectionString });

export const db = drizzle(pool);

export default db;

// Ensure users table exists when running in development to simplify local setup.
// This is a best-effort convenience: in production prefer proper migrations.
(async function ensureUsersTable() {
  try {
    const createSql = `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        is_student INTEGER DEFAULT 1,
        is_teacher INTEGER DEFAULT 0,
        is_admin INTEGER DEFAULT 0,
        bio TEXT,
        avatar TEXT,
        is_verified INTEGER DEFAULT 0,
        github_id TEXT,
        google_id TEXT,
        facebook_id TEXT,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `;
    await pool.query(createSql);
  } catch (err) {
    // ignore - pool may be unavailable in some environments
    console.warn(
      "Could not ensure users table exists:",
      (err as any)?.message || err
    );
  }
})();

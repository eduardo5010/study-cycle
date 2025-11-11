import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

// Initialize a Postgres pool and drizzle client using DATABASE_URL
const connectionString =
  process.env.DATABASE_URL ||
  process.env.PG_CONNECTION ||
  "postgresql://localhost:5432/study_cycle";

const pool = new Pool({ connectionString });

export const db = drizzle(pool);

export default db;

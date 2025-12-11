import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./db/schema";

// Initialize PostgreSQL database
const connectionString = process.env.DATABASE_URL;

// Create postgres pool
const pool = new Pool({
  connectionString: connectionString,
});

// Create drizzle instance
export const db = drizzle(pool, { schema });

export default db;

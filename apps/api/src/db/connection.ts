import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

const connectionString = 'postgresql://studycycle:studycycle123@localhost:5432/studycycle';

console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL);
console.log('🔍 Using connection string:', connectionString);

const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool);

export async function connectDB() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Connected to PostgreSQL');
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL:', error);
    process.exit(1);
  }
}

export async function disconnectDB() {
  await pool.end();
}

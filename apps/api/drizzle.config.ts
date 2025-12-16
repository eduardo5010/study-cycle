import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString:
      process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/studycycle',
  },
  strict: true,
  verbose: true,
} satisfies Config;

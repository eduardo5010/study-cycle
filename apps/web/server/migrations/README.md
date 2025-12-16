Postgres migration files

This folder contains SQL migrations to create the tables required by the review/ML subsystem.

How to run (manual):

1. Ensure you have a running Postgres instance and DATABASE_URL set, for example:

   export DATABASE_URL="postgresql://postgres:password@localhost:5432/study_cycle"

2. Create the database if it doesn't exist:

   createdb -U postgres study_cycle

3. Run the SQL migration:

   psql "$DATABASE_URL" -f server/migrations/001_create_review_tables.sql

Or if you prefer Drizzle's migration tooling, you can integrate these SQL files into your drizzle configuration and run `drizzle-kit push`.

Notes:

- The SQL is idempotent (uses IF NOT EXISTS) so it is safe to re-run.
- If you want me to run these commands here, confirm and I will attempt to install Postgres (requires sudo) or start a local Docker Postgres container.

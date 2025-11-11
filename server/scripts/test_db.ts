import "../index"; // ensure server env if needed
import { storage } from "../storage";

async function run() {
  console.log("Inserting test review event...");
  const ev = await storage.logReviewEvent({
    userId: "test-user",
    itemId: "test-item",
    timestamp: new Date().toISOString(),
    correctness: 1,
    responseTimeMs: 1234,
    nReps: 1,
    timeSinceLastReviewSec: 3600,
  });

  console.log("Inserted event id:", ev.id);
  console.log("Now selecting from DB to confirm (first 5 rows):");

  // We can't easily run SQL here in TS without adding pg import; instead
  // instruct user how to query, and also attempt to query using child_process psql
  try {
    const { execSync } = await import("node:child_process");
    const url = process.env.DATABASE_URL;
    if (!url) {
      console.warn(
        "DATABASE_URL not set; cannot run psql select. Set DATABASE_URL and run 'psql $DATABASE_URL -c \"SELECT * FROM review_events LIMIT 5;\"' to inspect."
      );
      return;
    }
    const out = execSync(
      `psql '${url}' -c "SELECT id, user_id, item_id, correctness, created_at FROM review_events ORDER BY created_at DESC LIMIT 5;"`,
      { encoding: "utf8" }
    );
    console.log(out);
  } catch (err: any) {
    console.warn("Could not run psql to display rows:", err?.message || err);
    console.log(
      'You can run: psql "$DATABASE_URL" -c "SELECT * FROM review_events ORDER BY created_at DESC LIMIT 5;"'
    );
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

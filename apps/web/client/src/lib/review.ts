import { logReviewEvent, predictNextInterval } from "./ml";
import forgetting, { eventsFromRaw } from "./forgetting";
import tfjsAdapter from "./tfjs-adapter";

// helper to sync lambda to backend with retries/backoff (best-effort)
async function syncLambdaToBackend(userId: string, maxRetries = 3) {
  try {
    const rec = (await import("./lambda-store")).loadLambda(userId);
    if (!(rec && typeof rec.lambda === "number")) return;
    const payload = { lambda: rec.lambda, source: rec.source || "online" };
    let attempt = 0;
    let delay = 500;
    while (attempt < maxRetries) {
      try {
        const res = await fetch(
          `/api/ml/lambda/${encodeURIComponent(userId)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (res.ok) return;
      } catch (e) {
        // swallow and retry
      }
      attempt++;
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Failed to sync lambda to backend", e);
  }
}

export type ReviewVariant = {
  id: string;
  itemId: string;
  authorId?: string | null;
  type: "ai" | "human";
  content: any;
  metadata?: Record<string, any>;
  lastUsedBy?: Record<string, string>;
  createdAt: string;
};

export async function fetchVariants(itemId: string): Promise<ReviewVariant[]> {
  try {
    const res = await fetch(
      `/api/reviews/${encodeURIComponent(itemId)}/variants`
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json as ReviewVariant[];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("Failed to fetch variants", err);
    return [];
  }
}

export async function createHumanVariant(
  itemId: string,
  authorId: string | null,
  content: any
) {
  try {
    const res = await fetch(
      `/api/reviews/${encodeURIComponent(itemId)}/variants`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId, content }),
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json as ReviewVariant;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("Failed to create human variant", err);
    return null;
  }
}

export async function generateAIVariant(itemId: string, prompt?: string) {
  try {
    const res = await fetch(
      `/api/reviews/${encodeURIComponent(itemId)}/generate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json as ReviewVariant;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("Failed to generate AI variant", err);
    return null;
  }
}

// Choose a variant avoiding repeating the same variant for the same user (lastUsed)
export function chooseVariant(
  variants: ReviewVariant[],
  userId?: string
): ReviewVariant | null {
  if (!variants || variants.length === 0) return null;
  if (!userId) return variants[0];

  // prefer variants not used by the user recently
  const unused = variants.filter((v) => !v.lastUsedBy || !v.lastUsedBy[userId]);
  if (unused.length > 0) return unused[0];

  // else pick the least recently used for this user
  const sorted = variants.slice().sort((a, b) => {
    const aTime = a.lastUsedBy?.[userId] ? Date.parse(a.lastUsedBy[userId]) : 0;
    const bTime = b.lastUsedBy?.[userId] ? Date.parse(b.lastUsedBy[userId]) : 0;
    return aTime - bTime;
  });
  return sorted[0] || variants[0];
}

export async function recordReviewOutcome(
  userId: string,
  itemId: string,
  variantId: string | null,
  correctness: 0 | 1,
  responseTimeMs?: number,
  nReps?: number,
  timeSinceLastReviewSec?: number
) {
  // log event to backend
  await logReviewEvent({
    userId,
    itemId,
    timestamp: new Date().toISOString(),
    correctness,
    responseTimeMs,
    nReps,
    timeSinceLastReviewSec,
  });

  // After logging, fetch recent events for this user-item to update lambda online
  try {
    const evRes = await fetch(`/api/ml/events`);
    if (evRes.ok) {
      const allEvents = await evRes.json();
      const userItemEvents = (allEvents || []).filter(
        (e: any) => e.userId === userId && e.itemId === itemId
      );
      const simple = eventsFromRaw(userItemEvents);
      // observed outcome is correctness (y)
      const upd = forgetting.updateLambdaOnline(userId, simple, {
        y: correctness,
      });
      // sync to backend (best-effort)
      await syncLambdaToBackend(userId);
      // eslint-disable-next-line no-console
      console.debug("Lambda updated", upd);
    }
  } catch (e) {
    // ignore
  }

  // optionally tell backend variant was used to avoid immediate repeat
  if (variantId) {
    try {
      await fetch(
        `/api/reviews/variants/${encodeURIComponent(variantId)}/used`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
    } catch (err) {
      // non-fatal
    }
  }
}

// Recommend next interval (seconds) using ML predict; wrapper
export async function recommendNextInterval(opts: {
  userId?: string;
  itemId?: string;
  lambda?: number;
  sum_t_over_n?: number;
  n_next?: number;
  candidateIntervals?: number[];
}) {
  // Try TF.js local model first (if available)
  try {
    const tf = await tfjsAdapter.loadTf();
    if (tf) {
      // assemble features from recent events
      let events: any[] = [];
      if (opts.userId) {
        const res = await fetch(`/api/ml/events`);
        if (res.ok) {
          const all = await res.json();
          events = (all || []).filter(
            (e: any) => e.userId === opts.userId && e.itemId === opts.itemId
          );
        }
      }
      const simple = eventsFromRaw(events);
      const n_prev = simple.length;
      const avg_prev_interval = n_prev
        ? simple.reduce((acc, s) => acc + (s.timeSinceLastReviewSec || 0), 0) /
          n_prev
        : 0;
      const last_interval = n_prev
        ? simple[simple.length - 1].timeSinceLastReviewSec || 0
        : 0;
      const lastTs =
        n_prev && simple[simple.length - 1].timestampIso
          ? Date.parse(String(simple[simple.length - 1].timestampIso)) / 1000
          : 0;
      const time_since_prev = n_prev
        ? Math.max(0, Date.now() / 1000 - lastTs)
        : 0;

      const candidates = opts.candidateIntervals || [
        3600 * 24,
        3600 * 24 * 2,
        3600 * 24 * 4,
        3600 * 24 * 7,
      ];
      const preds: Array<{ intervalSec: number; predictedRetention: number }> =
        [];
      for (const t of candidates) {
        const feat = {
          n_prev,
          avg_prev_interval,
          last_interval,
          time_since_prev: time_since_prev + t,
        };
        const p = await tfjsAdapter.predictWithLocalModel(feat as any);
        if (typeof p === "number")
          preds.push({ intervalSec: t, predictedRetention: p });
      }
      if (preds.length > 0) {
        const target = 0.9;
        const chosen =
          preds.find((r) => r.predictedRetention >= target) ||
          preds[preds.length - 1];
        return {
          recommendedIntervalSec: chosen.intervalSec,
          predictedRetention: chosen.predictedRetention,
          model: "tfjs-local",
          candidates: preds,
        };
      }
    }
  } catch (e) {
    // ignore and fall back to backend
  }

  const p = await predictNextInterval({
    userId: opts.userId,
    itemId: opts.itemId,
    lambda: opts.lambda,
    sum_t_over_n: opts.sum_t_over_n,
    n_next: opts.n_next,
    candidateIntervals: opts.candidateIntervals,
  });
  return p;
}

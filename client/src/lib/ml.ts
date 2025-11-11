// Client-side ML helper: logs review events and requests predictions from the backend.
// This keeps UI unchanged: it's a non-visual utility used by review flows.

export type ReviewEventPayload = {
  userId: string;
  itemId: string;
  timestamp?: string;
  correctness: 0 | 1;
  responseTimeMs?: number;
  nReps?: number;
  timeSinceLastReviewSec?: number;
};

export async function logReviewEvent(payload: ReviewEventPayload) {
  try {
    await fetch("/api/ml/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    // non-fatal; we log and continue
    // In production, implement retry/backoff
    // eslint-disable-next-line no-console
    console.warn("Failed to log review event", err);
  }
}

export type PredictRequest = {
  userId?: string;
  itemId?: string;
  candidateIntervals?: number[]; // seconds
  lambda?: number; // optional user lambda
  sum_t_over_n?: number;
  n_next?: number;
};

export type PredictResponse = {
  recommendedIntervalSec: number;
  predictedRetention: number;
  model: string;
  lambda: number;
  S: number;
  candidates: Array<{ intervalSec: number; predictedRetention: number }>;
};

export async function predictNextInterval(
  req: PredictRequest
): Promise<PredictResponse | null> {
  try {
    const res = await fetch("/api/ml/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json as PredictResponse;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("Prediction request failed", err);
    return null;
  }
}

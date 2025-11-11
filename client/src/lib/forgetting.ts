// Utilities for forgetting curve calculations and simple online lambda adaptation.
// Formula: R = exp(-lambda * S) where S = sum(t_i / n_i) (+ t_next/n_next if predicting into future)

import { loadLambda, saveLambda } from "./lambda-store";

export type ReviewEventSimple = {
  timestampIso?: string; // ISO timestamp
  timeSinceLastReviewSec?: number; // t_i
  nReps?: number; // n_i
  correctness?: 0 | 1; // observed outcome
};

export function computeS(events: ReviewEventSimple[]): number {
  // S = sum(t_i / n_i)
  let s = 0;
  for (const e of events) {
    const t =
      typeof e.timeSinceLastReviewSec === "number"
        ? e.timeSinceLastReviewSec
        : 0;
    const n = typeof e.nReps === "number" && e.nReps > 0 ? e.nReps : 1;
    s += t / n;
  }
  return s;
}

export function retention(
  lambda: number,
  S: number,
  tNextSec = 0,
  nNext = 1
): number {
  const tOverN = tNextSec / Math.max(1, nNext);
  const R = Math.exp(-lambda * (S + tOverN));
  // clamp to [0,1]
  if (!isFinite(R) || R < 0) return 0;
  if (R > 1) return 1;
  return R;
}

export function recommendIntervalForTarget(
  lambda: number,
  S: number,
  candidatesSec: number[],
  targetRetention = 0.9,
  nNext = 1
) {
  const results = candidatesSec.map((t) => ({
    intervalSec: t,
    predictedRetention: retention(lambda, S, t, nNext),
  }));
  const chosen =
    results.find((r) => r.predictedRetention >= targetRetention) ||
    results[results.length - 1];
  return { chosen, results };
}

// Online lambda update via simple gradient descent on squared error: L = (R - y)^2
// dR/dlambda = - (S + t/n) * R
// dL/dlambda = 2*(R - y) * dR/dlambda = -2*(R - y)*(S + t/n)*R
export function updateLambdaOnline(
  userId: string,
  events: ReviewEventSimple[],
  observed: { tNextSec?: number; nNext?: number; y: 0 | 1 },
  opts?: { lr?: number; minLambda?: number; maxLambda?: number }
) {
  const lr = opts?.lr ?? 1e-7; // default learning rate small because S in seconds
  const minLambda = opts?.minLambda ?? 1e-6;
  const maxLambda = opts?.maxLambda ?? 1.0;

  const record = loadLambda(userId);
  const currentLambda = record?.lambda ?? 0.15; // default

  const S = computeS(events);
  const tNext = observed.tNextSec ?? 0;
  const nNext = observed.nNext ?? 1;

  const R = retention(currentLambda, S, tNext, nNext);
  const y = observed.y;

  const denom = 1; // keep simple
  const grad = -2 * (R - y) * (S + tNext / Math.max(1, nNext)) * R;
  // gradient descent step: lambda <- lambda - lr * grad
  let lambdaNew = currentLambda - lr * grad;
  if (!isFinite(lambdaNew) || Number.isNaN(lambdaNew))
    lambdaNew = currentLambda;
  lambdaNew = Math.max(minLambda, Math.min(maxLambda, lambdaNew));

  saveLambda(userId, lambdaNew, "online");
  return { prev: currentLambda, next: lambdaNew, predBefore: R };
}

// Helper: compute S from raw history events shape returned by backend or client. Normalizes keys.
export function eventsFromRaw(raw: any[]): ReviewEventSimple[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => ({
    timestampIso: r.timestamp || r.createdAt || null,
    timeSinceLastReviewSec:
      typeof r.timeSinceLastReviewSec === "number"
        ? r.timeSinceLastReviewSec
        : r.timeSinceLastReview || r.timeSinceLast || 0,
    nReps: typeof r.nReps === "number" ? r.nReps : r.nRepetition || 1,
    correctness:
      typeof r.correctness === "number"
        ? r.correctness
          ? 1
          : 0
        : typeof r.correct === "number"
        ? r.correct
          ? 1
          : 0
        : undefined,
  }));
}

export default {
  computeS,
  retention,
  recommendIntervalForTarget,
  updateLambdaOnline,
  eventsFromRaw,
};

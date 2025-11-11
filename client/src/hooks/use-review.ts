import { useCallback } from "react";
import {
  fetchVariants,
  chooseVariant,
  generateAIVariant,
  createHumanVariant,
  recordReviewOutcome,
  recommendNextInterval,
} from "../lib/review";

// Hook returns helpers to get a review variant and record outcomes. It's UI-agnostic so existing components keep same look.
export function useReview() {
  const getVariantFor = useCallback(async (itemId: string, userId?: string) => {
    const variants = await fetchVariants(itemId);
    let chosen = chooseVariant(variants, userId);
    if (!chosen) {
      // fallback: generate AI variant on the fly (best-effort)
      const gen = await generateAIVariant(
        itemId,
        `Create a short question for ${itemId}`
      );
      if (gen) chosen = gen;
    }
    return chosen;
  }, []);

  const createHuman = useCallback(
    async (itemId: string, authorId: string | null, content: any) => {
      return await createHumanVariant(itemId, authorId, content);
    },
    []
  );

  const reportOutcome = useCallback(
    async (params: {
      userId: string;
      itemId: string;
      variantId?: string | null;
      correctness: 0 | 1;
      responseTimeMs?: number;
      nReps?: number;
      timeSinceLastReviewSec?: number;
    }) => {
      await recordReviewOutcome(
        params.userId,
        params.itemId,
        params.variantId || null,
        params.correctness,
        params.responseTimeMs,
        params.nReps,
        params.timeSinceLastReviewSec
      );
    },
    []
  );

  const getNextInterval = useCallback(
    async (opts: {
      userId?: string;
      itemId?: string;
      lambda?: number;
      sum_t_over_n?: number;
      n_next?: number;
      candidateIntervals?: number[];
    }) => {
      return await recommendNextInterval(opts);
    },
    []
  );

  return { getVariantFor, createHuman, reportOutcome, getNextInterval };
}

/**
 * Unit tests for the Spaced Review Engine
 */

import {
  MemoryProfile,
  computeS,
  computeLambda,
  computeProbability,
  shouldReview,
  nextInterval,
  suggestReview,
  trainCoefficients,
  predictRememberProbability,
  DEFAULT_COEFFICIENTS,
  type StudySessionInput,
  type ContentItem,
  type UserProfile,
  type ModelCoefficients,
  type TrainingExample,
} from "../spaced-review-engine";

describe("Spaced Review Engine", () => {
  // Test data
  const mockContent: ContentItem = {
    id: "test-content",
    s0: 1, // 1 day base stability
    dificuldade: 0.8, // Hard content
  };

  const mockProfile: UserProfile = {
    id: "test-user",
    pUsuario: MemoryProfile.POOR, // 0.4
    performanceMedia: 0.65, // Below average
    beta: 0.5,
  };

  const mockInput: StudySessionInput = {
    userId: "test-user",
    contentId: "test-content",
    tDias: 5, // 5 days since last review
    historico: 0.6, // 60% historical accuracy
    tempoEstudo: 0.7, // Studied 70% of optimal time
    confianca: 0.5, // Moderate confidence
    intervaloAnterior: 1, // Remembered last time
    acertouUltima: true,
  };

  describe("Memory Profile Enum", () => {
    test("should have correct values", () => {
      expect(MemoryProfile.GOOD).toBe(0.2);
      expect(MemoryProfile.POOR).toBe(0.4);
      expect(MemoryProfile.TERRIBLE).toBe(0.8);
    });
  });

  describe("computeS function", () => {
    test("should calculate memory stability factor", () => {
      const S = computeS(mockInput, mockContent, DEFAULT_COEFFICIENTS);

      // S should be positive
      expect(S).toBeGreaterThan(0);

      // With hard content (0.8), good historical performance (0.6),
      // good study time (0.7), moderate confidence (0.5), remembered last time (1)
      // S should be adjusted from base s0=1
      expect(S).toBeGreaterThan(0.5);
      expect(S).toBeLessThan(3);
    });

    test("should handle edge cases", () => {
      const easyContent: ContentItem = { ...mockContent, dificuldade: 0.1 };
      const hardContent: ContentItem = { ...mockContent, dificuldade: 0.9 };

      const S_easy = computeS(mockInput, easyContent, DEFAULT_COEFFICIENTS);
      const S_hard = computeS(mockInput, hardContent, DEFAULT_COEFFICIENTS);

      // Harder content should have different stability factor
      expect(S_easy).not.toBe(S_hard);
    });

    test("should clamp results within bounds", () => {
      // Test with extreme values
      const extremeInput: StudySessionInput = {
        ...mockInput,
        historico: 1.0,
        tempoEstudo: 1.0,
        confianca: 1.0,
        intervaloAnterior: 1,
      };

      const S = computeS(extremeInput, mockContent, DEFAULT_COEFFICIENTS);
      expect(S).toBeGreaterThanOrEqual(0.1);
      expect(S).toBeLessThanOrEqual(365);
    });
  });

  describe("computeLambda function", () => {
    test("should calculate lambda for below-average performer", () => {
      const lambda = computeLambda(mockProfile);

      // performanceMedia = 0.65 (< 0.7), so lambda should be > 1
      expect(lambda).toBeGreaterThan(1);
      expect(lambda).toBeLessThanOrEqual(3.0);
    });

    test("should calculate lambda for above-average performer", () => {
      const goodProfile: UserProfile = {
        ...mockProfile,
        performanceMedia: 0.85, // Above average
      };

      const lambda = computeLambda(goodProfile);
      expect(lambda).toBeLessThan(1);
      expect(lambda).toBeGreaterThanOrEqual(0.1);
    });

    test("should handle boundary values", () => {
      const excellentProfile: UserProfile = { ...mockProfile, performanceMedia: 1.0 };
      const poorProfile: UserProfile = { ...mockProfile, performanceMedia: 0.0 };

      const lambdaExcellent = computeLambda(excellentProfile);
      const lambdaPoor = computeLambda(poorProfile);

      expect(lambdaExcellent).toBeGreaterThanOrEqual(0.1);
      expect(lambdaPoor).toBeLessThanOrEqual(3.0);
    });
  });

  describe("computeProbability function", () => {
    test("should calculate remembering probability", () => {
      const S = 2.0;
      const lambda = 1.2;
      const pUsuario = MemoryProfile.POOR;
      const t = 5;

      const probability = computeProbability(t, S, lambda, pUsuario);

      expect(probability).toBeGreaterThanOrEqual(0);
      expect(probability).toBeLessThanOrEqual(1);

      // With t=5, S=2, lambda=1.2, pUsuario=0.4
      // P should be relatively low
      expect(probability).toBeLessThan(0.5);
    });

    test("should handle time factor correctly", () => {
      const S = 2.0;
      const lambda = 1.0;
      const pUsuario = 0.5;

      const probShort = computeProbability(1, S, lambda, pUsuario); // 1 day
      const probLong = computeProbability(7, S, lambda, pUsuario);  // 7 days

      // Longer time should result in lower probability
      expect(probShort).toBeGreaterThan(probLong);
    });
  });

  describe("shouldReview function", () => {
    test("should determine if review is needed", () => {
      expect(shouldReview(0.1)).toBe(true);   // Low probability - needs review
      expect(shouldReview(0.5)).toBe(false);  // High probability - no review needed
      expect(shouldReview(0.3)).toBe(true);   // At threshold - needs review
    });

    test("should respect custom threshold", () => {
      expect(shouldReview(0.4, 0.5)).toBe(true);   // Below custom threshold
      expect(shouldReview(0.6, 0.5)).toBe(false);  // Above custom threshold
    });
  });

  describe("nextInterval function", () => {
    test("should calculate next review interval", () => {
      const S = 2.0;
      const acertouUltima = true;

      const interval = nextInterval(S, acertouUltima);

      expect(interval).toBeGreaterThanOrEqual(0.5);
      expect(interval).toBeLessThanOrEqual(365);

      // With acertouUltima=true, should apply 1.3 multiplier
      expect(interval).toBeGreaterThan(0.5);
    });

    test("should adjust based on success", () => {
      const S = 2.0;

      const intervalSuccess = nextInterval(S, true);
      const intervalFailure = nextInterval(S, false);

      // Success should result in longer interval
      expect(intervalSuccess).toBeGreaterThan(intervalFailure);
    });
  });

  describe("suggestReview function", () => {
    test("should provide complete review suggestion", () => {
      const suggestion = suggestReview(mockInput, mockContent, mockProfile, DEFAULT_COEFFICIENTS);

      expect(suggestion).toHaveProperty("probabilidade");
      expect(suggestion).toHaveProperty("revisar");
      expect(suggestion).toHaveProperty("tProximo");
      expect(suggestion).toHaveProperty("S");
      expect(suggestion).toHaveProperty("lambda");

      expect(typeof suggestion.probabilidade).toBe("number");
      expect(typeof suggestion.revisar).toBe("boolean");
      expect(typeof suggestion.tProximo).toBe("number");
      expect(typeof suggestion.S).toBe("number");
      expect(typeof suggestion.lambda).toBe("number");

      // Validate ranges
      expect(suggestion.probabilidade).toBeGreaterThanOrEqual(0);
      expect(suggestion.probabilidade).toBeLessThanOrEqual(1);
      expect(suggestion.tProximo).toBeGreaterThanOrEqual(0.5);
      expect(suggestion.tProximo).toBeLessThanOrEqual(365);
    });

    test("should handle different memory profiles", () => {
      const goodMemoryProfile: UserProfile = { ...mockProfile, pUsuario: MemoryProfile.GOOD };
      const terribleMemoryProfile: UserProfile = { ...mockProfile, pUsuario: MemoryProfile.TERRIBLE };

      const suggestionGood = suggestReview(mockInput, mockContent, goodMemoryProfile, DEFAULT_COEFFICIENTS);
      const suggestionTerrible = suggestReview(mockInput, mockContent, terribleMemoryProfile, DEFAULT_COEFFICIENTS);

      // Good memory should have higher probability (less likely to need review)
      expect(suggestionGood.probabilidade).toBeGreaterThan(suggestionTerrible.probabilidade);
    });
  });

  describe("trainCoefficients function", () => {
    test("should train model coefficients", () => {
      const examples: TrainingExample[] = [
        {
          dificuldade: 0.8,
          historico: 0.6,
          tempoEstudo: 0.7,
          confianca: 0.5,
          intervaloAnterior: 1,
          lembrou: 1, // Remembered
        },
        {
          dificuldade: 0.5,
          historico: 0.8,
          tempoEstudo: 0.9,
          confianca: 0.8,
          intervaloAnterior: 0,
          lembrou: 0, // Forgot
        },
      ];

      const initialCoeffs = { ...DEFAULT_COEFFICIENTS };
      const trainedCoeffs = trainCoefficients(examples, initialCoeffs, 10);

      // Coefficients should change after training
      expect(trainedCoeffs.alpha1).not.toBe(initialCoeffs.alpha1);
      expect(trainedCoeffs.alpha2).not.toBe(initialCoeffs.alpha2);
      expect(trainedCoeffs.beta).not.toBe(initialCoeffs.beta);
    });

    test("should improve predictions over time", () => {
      const examples: TrainingExample[] = [
        {
          dificuldade: 0.5,
          historico: 0.8,
          tempoEstudo: 0.8,
          confianca: 0.7,
          intervaloAnterior: 1,
          lembrou: 1,
        },
      ];

      const initialCoeffs = { ...DEFAULT_COEFFICIENTS };
      const trainedCoeffs = trainCoefficients(examples, initialCoeffs, 50);

      // Test prediction with trained model
      const testInput: StudySessionInput = {
        userId: "test",
        contentId: "test",
        tDias: 1,
        historico: 0.8,
        tempoEstudo: 0.8,
        confianca: 0.7,
        intervaloAnterior: 1,
        acertouUltima: true,
      };

      const testContent: ContentItem = {
        id: "test",
        s0: 1,
        dificuldade: 0.5,
      };

      const testProfile: UserProfile = {
        id: "test",
        pUsuario: 0.4,
        performanceMedia: 0.7,
        beta: 0.5,
      };

      const prediction = predictRememberProbability(testInput, testContent, testProfile, trainedCoeffs);

      expect(prediction).toBeGreaterThanOrEqual(0);
      expect(prediction).toBeLessThanOrEqual(1);
    });
  });

  describe("Integration scenarios", () => {
    test("Maria's example from specification", () => {
      // Maria's parameters from the spec
      const mariaInput: StudySessionInput = {
        userId: "maria",
        contentId: "derivadas",
        tDias: 5,
        historico: 0.6,
        tempoEstudo: 0.7,
        confianca: 0.5,
        intervaloAnterior: 1,
        acertouUltima: true,
      };

      const mariaContent: ContentItem = {
        id: "derivadas",
        s0: 1,
        dificuldade: 0.8,
      };

      const mariaProfile: UserProfile = {
        id: "maria",
        pUsuario: 0.4, // Poor memory
        performanceMedia: 0.65,
        beta: 0.5,
      };

      const suggestion = suggestReview(mariaInput, mariaContent, mariaProfile, DEFAULT_COEFFICIENTS);

      // Should need review (probability < 0.3)
      expect(suggestion.revisar).toBe(true);
      expect(suggestion.probabilidade).toBeLessThan(0.3);

      // Should have reasonable values
      expect(suggestion.S).toBeGreaterThan(0);
      expect(suggestion.lambda).toBeGreaterThan(0);
      expect(suggestion.tProximo).toBeGreaterThan(0);
    });

    test("Different memory profiles comparison", () => {
      const profiles = [
        { name: "Good", pUsuario: MemoryProfile.GOOD },
        { name: "Poor", pUsuario: MemoryProfile.POOR },
        { name: "Terrible", pUsuario: MemoryProfile.TERRIBLE },
      ];

      const results = profiles.map(profile => {
        const testProfile: UserProfile = {
          id: "test",
          pUsuario: profile.pUsuario,
          performanceMedia: 0.65,
          beta: 0.5,
        };

        const suggestion = suggestReview(mockInput, mockContent, testProfile, DEFAULT_COEFFICIENTS);
        return {
          name: profile.name,
          probability: suggestion.probabilidade,
          needsReview: suggestion.revisar,
        };
      });

      // Good memory should have highest probability, terrible lowest
      expect(results[0].probability).toBeGreaterThan(results[1].probability);
      expect(results[1].probability).toBeGreaterThan(results[2].probability);

      // All should need review with current parameters (probability < 0.3)
      results.forEach(result => {
        expect(result.needsReview).toBe(true);
      });
    });

    test("Limiar threshold adjustments", () => {
      const thresholds = [0.1, 0.3, 0.5];

      const results = thresholds.map(limiar => {
        const inputWithLimiar: StudySessionInput = { ...mockInput, limiar };
        const suggestion = suggestReview(inputWithLimiar, mockContent, mockProfile, DEFAULT_COEFFICIENTS);
        return {
          limiar,
          needsReview: suggestion.revisar,
        };
      });

      // Lower threshold should require more reviews
      expect(results[0].needsReview).toBe(true);  // limiar = 0.1
      // Higher thresholds might not require review depending on probability
    });
  });
});

describe("Edge Cases and Error Handling", () => {
  test("should handle zero values gracefully", () => {
    const zeroInput: StudySessionInput = {
      userId: "test",
      contentId: "test",
      tDias: 0,
      historico: 0,
      tempoEstudo: 0,
      confianca: 0,
      intervaloAnterior: 0,
      acertouUltima: false,
    };

    const zeroContent: ContentItem = {
      id: "test",
      s0: 0.1, // Very small base stability
      dificuldade: 0,
    };

    const suggestion = suggestReview(zeroInput, zeroContent, mockProfile, DEFAULT_COEFFICIENTS);

    // Should not crash and return valid values
    expect(suggestion.probabilidade).toBeGreaterThanOrEqual(0);
    expect(suggestion.probabilidade).toBeLessThanOrEqual(1);
    expect(suggestion.S).toBeGreaterThan(0);
  });

  test("should handle extreme values", () => {
    const extremeInput: StudySessionInput = {
      userId: "test",
      contentId: "test",
      tDias: 1000, // Very long time
      historico: 1.0, // Perfect history
      tempoEstudo: 1.0, // Maximum study time
      confianca: 1.0, // Maximum confidence
      intervaloAnterior: 1, // Remembered
      acertouUltima: true,
    };

    const suggestion = suggestReview(extremeInput, mockContent, mockProfile, DEFAULT_COEFFICIENTS);

    // Should not crash
    expect(suggestion.probabilidade).toBeGreaterThanOrEqual(0);
    expect(suggestion.probabilidade).toBeLessThanOrEqual(1);
    expect(suggestion.S).toBeFinite();
    expect(suggestion.tProximo).toBeFinite();
  });
});

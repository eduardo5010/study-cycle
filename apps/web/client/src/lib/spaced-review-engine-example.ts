/**
 * Example usage of the Spaced Review Engine
 *
 * This file demonstrates how to use the Spaced Review Engine with the Maria example
 * from the specification.
 */

import {
  MemoryProfile,
  suggestReview,
  computeS,
  computeLambda,
  computeProbability,
  shouldReview,
  nextInterval,
  trainCoefficients,
  DEFAULT_COEFFICIENTS,
  type StudySessionInput,
  type ContentItem,
  type UserProfile,
  type TrainingExample,
} from "./spaced-review-engine";

/**
 * Example 1: Maria's Study Session (from specification)
 */
export function mariaExample() {
  console.log("=== Maria's Spaced Review Example ===\n");

  // Maria's study session data
  const mariaInput: StudySessionInput = {
    userId: "maria",
    contentId: "derivadas",
    tDias: 5, // 5 days since last review
    historico: 0.6, // 60% historical accuracy
    tempoEstudo: 0.7, // Studied 70% of optimal time
    confianca: 0.5, // Moderate confidence
    intervaloAnterior: 1, // Remembered last time
    acertouUltima: true, // Got it right last time
  };

  const mariaContent: ContentItem = {
    id: "derivadas",
    s0: 1, // Base stability: 1 day
    dificuldade: 0.8, // Hard content (80% difficulty)
  };

  const mariaProfile: UserProfile = {
    id: "maria",
    pUsuario: MemoryProfile.POOR, // Poor memory: 0.4
    performanceMedia: 0.65, // Below average performance
    beta: 0.5, // Calibration coefficient
  };

  // Step-by-step calculation
  console.log("Input Data:");
  console.log(`- Days since review: ${mariaInput.tDias}`);
  console.log(`- Historical accuracy: ${(mariaInput.historico * 100).toFixed(1)}%`);
  console.log(`- Study time: ${(mariaInput.tempoEstudo * 100).toFixed(1)}%`);
  console.log(`- Confidence: ${(mariaInput.confianca * 100).toFixed(1)}%`);
  console.log(`- Previous interval success: ${mariaInput.intervaloAnterior}`);
  console.log(`- Content difficulty: ${(mariaContent.dificuldade * 100).toFixed(1)}%`);
  console.log(`- Base stability: ${mariaContent.s0} day(s)`);
  console.log(`- Memory profile: ${mariaProfile.pUsuario} (${MemoryProfile.POOR === mariaProfile.pUsuario ? 'Poor' : 'Other'})`);
  console.log(`- Average performance: ${(mariaProfile.performanceMedia * 100).toFixed(1)}%\n`);

  // Calculate S (memory stability factor)
  const S = computeS(mariaInput, mariaContent, DEFAULT_COEFFICIENTS);
  console.log(`Step 1 - Memory Stability Factor (S):`);
  console.log(`S = ${mariaContent.s0} × (1 + ${DEFAULT_COEFFICIENTS.alpha1}×${mariaContent.dificuldade} + ${DEFAULT_COEFFICIENTS.alpha2}×${mariaInput.historico} + ${DEFAULT_COEFFICIENTS.alpha3}×${mariaInput.tempoEstudo} + ${DEFAULT_COEFFICIENTS.alpha4}×${mariaInput.confianca} + ${DEFAULT_COEFFICIENTS.alpha5}×${mariaInput.intervaloAnterior})`);
  console.log(`S = ${S.toFixed(3)} days\n`);

  // Calculate lambda (user calibration factor)
  const lambda = computeLambda(mariaProfile);
  console.log(`Step 2 - User Calibration Factor (λ):`);
  console.log(`λ = 1 + ${mariaProfile.beta} × (${mariaProfile.performanceMedia} - 0.7)`);
  console.log(`λ = ${lambda.toFixed(3)}\n`);

  // Calculate probability of remembering
  const probability = computeProbability(mariaInput.tDias, S, lambda, mariaProfile.pUsuario);
  console.log(`Step 3 - Probability of Remembering (P):`);
  console.log(`P = e^(-${mariaInput.tDias}/${S.toFixed(3)}) × ${lambda.toFixed(3)} × ${mariaProfile.pUsuario}`);
  console.log(`P = ${probability.toFixed(4)} (${(probability * 100).toFixed(2)}%)\n`);

  // Determine if review is needed
  const needsReview = shouldReview(probability);
  console.log(`Step 4 - Review Decision:`);
  console.log(`Needs review? ${needsReview} (P = ${probability.toFixed(4)} < 0.3)\n`);

  // Calculate next interval
  const nextIntervalDays = nextInterval(S, mariaInput.acertouUltima ?? true);
  console.log(`Step 5 - Next Review Interval:`);
  console.log(`Next interval = -${S.toFixed(3)} × ln(0.3) × ${(mariaInput.acertouUltima ? 1.3 : 0.5)}`);
  console.log(`Next interval = ${nextIntervalDays.toFixed(1)} days\n`);

  // Complete suggestion
  const suggestion = suggestReview(mariaInput, mariaContent, mariaProfile, DEFAULT_COEFFICIENTS);
  console.log(`Complete Suggestion:`);
  console.log(`- Probability: ${(suggestion.probabilidade * 100).toFixed(2)}%`);
  console.log(`- Needs review: ${suggestion.revisar}`);
  console.log(`- Next interval: ${suggestion.tProximo.toFixed(1)} days`);
  console.log(`- Memory stability (S): ${suggestion.S.toFixed(3)} days`);
  console.log(`- Lambda factor: ${suggestion.lambda.toFixed(3)}\n`);

  return suggestion;
}

/**
 * Example 2: Memory Profile Comparison
 */
export function memoryProfileComparison() {
  console.log("=== Memory Profile Comparison ===\n");

  const baseInput: StudySessionInput = {
    userId: "test",
    contentId: "test-content",
    tDias: 5,
    historico: 0.6,
    tempoEstudo: 0.7,
    confianca: 0.5,
    intervaloAnterior: 1,
    acertouUltima: true,
  };

  const baseContent: ContentItem = {
    id: "test-content",
    s0: 1,
    dificuldade: 0.8,
  };

  const profiles = [
    { name: "Good Memory", profile: MemoryProfile.GOOD },
    { name: "Poor Memory", profile: MemoryProfile.POOR },
    { name: "Terrible Memory", profile: MemoryProfile.TERRIBLE },
  ];

  profiles.forEach(({ name, profile }) => {
    const testProfile: UserProfile = {
      id: "test",
      pUsuario: profile,
      performanceMedia: 0.65,
      beta: 0.5,
    };

    const suggestion = suggestReview(baseInput, baseContent, testProfile, DEFAULT_COEFFICIENTS);

    console.log(`${name} (${profile}):`);
    console.log(`  Probability: ${(suggestion.probabilidade * 100).toFixed(2)}%`);
    console.log(`  Needs review: ${suggestion.revisar}`);
    console.log(`  Next interval: ${suggestion.tProximo.toFixed(1)} days\n`);
  });
}

/**
 * Example 3: ML Training Demonstration
 */
export function mlTrainingExample() {
  console.log("=== ML Training Example ===\n");

  // Generate some training examples
  const trainingExamples: TrainingExample[] = [
    // User remembered - good conditions
    {
      dificuldade: 0.3, // Easy
      historico: 0.9,   // Good history
      tempoEstudo: 0.9, // Studied well
      confianca: 0.8,   // Confident
      intervaloAnterior: 1, // Remembered last time
      lembrou: 1, // Remembered
    },
    // User forgot - poor conditions
    {
      dificuldade: 0.9, // Hard
      historico: 0.3,   // Poor history
      tempoEstudo: 0.3, // Didn't study well
      confianca: 0.2,   // Not confident
      intervaloAnterior: 0, // Forgot last time
      lembrou: 0, // Forgot
    },
    // Mixed case
    {
      dificuldade: 0.6, // Medium
      historico: 0.7,   // Decent history
      tempoEstudo: 0.6, // Average study
      confianca: 0.6,   // Somewhat confident
      intervaloAnterior: 1, // Remembered last time
      lembrou: 1, // Remembered
    },
  ];

  console.log("Training Examples:");
  trainingExamples.forEach((ex, i) => {
    console.log(`Example ${i + 1}: Difficulty=${ex.dificuldade}, History=${ex.historico}, Study=${ex.tempoEstudo}, Confidence=${ex.confianca}, Prev=${ex.intervaloAnterior}, Remembered=${ex.lembrou}`);
  });
  console.log();

  // Initial coefficients
  const initialCoeffs = { ...DEFAULT_COEFFICIENTS };
  console.log("Initial Coefficients:");
  console.log(`α₁=${initialCoeffs.alpha1}, α₂=${initialCoeffs.alpha2}, α₃=${initialCoeffs.alpha3}, α₄=${initialCoeffs.alpha4}, α₅=${initialCoeffs.alpha5}, β=${initialCoeffs.beta}\n`);

  // Train the model
  const trainedCoeffs = trainCoefficients(trainingExamples, initialCoeffs, 100);
  console.log("Trained Coefficients (after 100 epochs):");
  console.log(`α₁=${trainedCoeffs.alpha1.toFixed(3)}, α₂=${trainedCoeffs.alpha2.toFixed(3)}, α₃=${trainedCoeffs.alpha3.toFixed(3)}, α₄=${trainedCoeffs.alpha4.toFixed(3)}, α₅=${trainedCoeffs.alpha5.toFixed(3)}, β=${trainedCoeffs.beta.toFixed(3)}\n`);

  // Test predictions
  console.log("Predictions with trained model:");
  trainingExamples.forEach((ex, i) => {
    const testInput: StudySessionInput = {
      userId: "test",
      contentId: "test",
      tDias: 1,
      historico: ex.historico,
      tempoEstudo: ex.tempoEstudo,
      confianca: ex.confianca,
      intervaloAnterior: ex.intervaloAnterior,
      acertouUltima: ex.intervaloAnterior === 1,
    };

    const testContent: ContentItem = {
      id: "test",
      s0: 1,
      dificuldade: ex.dificuldade,
    };

    const testProfile: UserProfile = {
      id: "test",
      pUsuario: 0.4,
      performanceMedia: 0.65,
      beta: trainedCoeffs.beta,
    };

    const prediction = suggestReview(testInput, testContent, testProfile, trainedCoeffs);
    console.log(`Example ${i + 1}: Predicted P=${(prediction.probabilidade * 100).toFixed(2)}%, Actual=${ex.lembrou === 1 ? 'Remembered' : 'Forgot'}`);
  });

  return trainedCoeffs;
}

/**
 * Example 4: Custom Memory Profile
 */
export function customMemoryProfileExample() {
  console.log("=== Custom Memory Profile Example ===\n");

  // User with excellent memory (custom value)
  const excellentMemoryProfile: UserProfile = {
    id: "excellent-user",
    pUsuario: 0.1, // Excellent memory (lower than good profile)
    performanceMedia: 0.85, // Above average performance
    beta: 0.5,
  };

  const averageInput: StudySessionInput = {
    userId: "excellent-user",
    contentId: "calculus",
    tDias: 7, // A week since last review
    historico: 0.8, // Good history
    tempoEstudo: 0.8, // Studied well
    confianca: 0.7, // Confident
    intervaloAnterior: 1, // Remembered last time
    acertouUltima: true,
  };

  const calculusContent: ContentItem = {
    id: "calculus",
    s0: 1,
    dificuldade: 0.7, // Moderately hard
  };

  const suggestion = suggestReview(averageInput, calculusContent, excellentMemoryProfile, DEFAULT_COEFFICIENTS);

  console.log("Excellent Memory User Results:");
  console.log(`- Memory profile: ${excellentMemoryProfile.pUsuario} (Excellent)`);
  console.log(`- Days since review: ${averageInput.tDias}`);
  console.log(`- Probability of remembering: ${(suggestion.probabilidade * 100).toFixed(2)}%`);
  console.log(`- Needs review: ${suggestion.revisar}`);
  console.log(`- Recommended next interval: ${suggestion.tProximo.toFixed(1)} days\n`);

  // Compare with poor memory user
  const poorMemoryProfile: UserProfile = {
    ...excellentMemoryProfile,
    pUsuario: MemoryProfile.TERRIBLE, // 0.8
    performanceMedia: 0.5, // Below average
  };

  const poorSuggestion = suggestReview(averageInput, calculusContent, poorMemoryProfile, DEFAULT_COEFFICIENTS);

  console.log("Poor Memory User Results (same conditions):");
  console.log(`- Memory profile: ${poorMemoryProfile.pUsuario} (Terrible)`);
  console.log(`- Probability of remembering: ${(poorSuggestion.probabilidade * 100).toFixed(2)}%`);
  console.log(`- Needs review: ${poorSuggestion.revisar}`);
  console.log(`- Recommended next interval: ${poorSuggestion.tProximo.toFixed(1)} days\n`);

  console.log("Comparison:");
  console.log(`- Probability difference: ${((poorSuggestion.probabilidade - suggestion.probabilidade) * 100).toFixed(2)} percentage points`);
  console.log(`- Interval difference: ${(poorSuggestion.tProximo - suggestion.tProximo).toFixed(1)} days`);
}

/**
 * Run all examples
 */
export function runAllExamples() {
  console.log("🚀 Spaced Review Engine Examples\n");
  console.log("=" .repeat(50));

  mariaExample();
  console.log("=" .repeat(50));

  memoryProfileComparison();
  console.log("=" .repeat(50));

  mlTrainingExample();
  console.log("=" .repeat(50));

  customMemoryProfileExample();
  console.log("=" .repeat(50));

  console.log("✅ All examples completed!");
}

// Uncomment to run examples in browser console
// runAllExamples();

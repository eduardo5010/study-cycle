# Spaced Review Engine - Advanced Personalized Spaced Repetition System

## Overview

The Spaced Review Engine is a sophisticated implementation of spaced repetition algorithms that uses the Ebbinghaus forgetting curve combined with machine learning to personalize review intervals for each user based on their memory profile and learning patterns.

## Features

- **Personalized Memory Profiles**: Support for Good (0.2), Poor (0.4), and Terrible (0.8) memory profiles
- **Multivariate Memory Stability**: Calculates memory stability using content difficulty, historical performance, study time, confidence, and previous interval success
- **User-Specific Calibration**: Lambda factor adjusts predictions based on individual performance
- **Machine Learning Training**: Gradient descent optimization of model coefficients
- **Pure Functions**: All core functions are pure and testable
- **TypeScript**: Fully typed with comprehensive interfaces

## Mathematical Foundation

### 1. Ebbinghaus Forgetting Curve
```
R(t) = e^(-t/S)
```
Where:
- `R(t)` = retention at time t
- `t` = time since last review (days)
- `S` = memory stability factor

### 2. Multivariate Memory Stability
```
S = S₀ × (1 + α₁×dificuldade + α₂×historico + α₃×tempoEstudo + α₄×confiança + α₅×intervaloAnterior)
```
Where `α₁-α₅` are learned coefficients.

### 3. User Calibration Factor
```
λ = 1 + β × (performanceMedia - 0.7)
```
Adjusts predictions based on user's historical performance.

### 4. Integrated Probability
```
P(t) = e^(-t/S) × λ × pUsuario
```
Where `pUsuario` is the memory profile multiplier.

## API Reference

### Enums

```typescript
enum MemoryProfile {
  GOOD = 0.2,      // Good memory
  POOR = 0.4,      // Poor memory (default)
  TERRIBLE = 0.8,  // Terrible memory
}
```

### Interfaces

```typescript
interface UserProfile {
  id: string;
  pUsuario: number;        // Memory profile multiplier
  performanceMedia: number; // Average performance (0-1)
  beta: number;            // Calibration coefficient
}

interface ContentItem {
  id: string;
  s0: number;        // Base stability factor (days)
  dificuldade: number; // Content difficulty (0-1)
}

interface StudySessionInput {
  userId: string;
  contentId: string;
  tDias: number;           // Days since last review
  historico: number;       // Historical accuracy (0-1)
  tempoEstudo: number;     // Study time (normalized 0-1)
  confianca: number;       // Confidence level (0-1)
  intervaloAnterior: number; // Previous success (0 or 1)
  limiar?: number;         // Custom threshold (default: 0.3)
  acertouUltima?: boolean; // Last review success
}

interface ReviewSuggestion {
  probabilidade: number; // Probability of remembering (0-1)
  revisar: boolean;      // Whether to review
  tProximo: number;      // Next interval in days
  S: number;            // Memory stability factor
  lambda: number;       // User calibration factor
}
```

### Core Functions

#### `computeS(input, content, coefs)`
Calculates memory stability factor using multivariate approach.

#### `computeLambda(profile)`
Computes user-specific calibration factor.

#### `computeProbability(t, S, lambda, pUsuario)`
Calculates probability of remembering using integrated formula.

#### `shouldReview(P, limiar?)`
Determines if content needs review based on probability threshold.

#### `nextInterval(S, acertouUltima, limiar?)`
Calculates optimal next review interval.

#### `suggestReview(input, content, profile, coefs)`
Main orchestrator providing complete review suggestions.

### Machine Learning Functions

#### `trainCoefficients(examples, initial, epochs, learningRate)`
Trains model coefficients using gradient descent.

#### `predictRememberProbability(input, content, profile, coefs, t)`
Predicts remembering probability for validation.

## Usage Examples

### Basic Usage

```typescript
import { MemoryProfile, suggestReview, DEFAULT_COEFFICIENTS } from './spaced-review-engine';

const userProfile = {
  id: "user123",
  pUsuario: MemoryProfile.POOR, // 0.4
  performanceMedia: 0.65,
  beta: 0.5,
};

const content = {
  id: "calculus-derivatives",
  s0: 1, // 1 day base stability
  dificuldade: 0.8, // Hard content
};

const sessionInput = {
  userId: "user123",
  contentId: "calculus-derivatives",
  tDias: 5, // 5 days since review
  historico: 0.6, // 60% historical accuracy
  tempoEstudo: 0.7, // Studied 70% of optimal time
  confianca: 0.5, // Moderate confidence
  intervaloAnterior: 1, // Remembered last time
  acertouUltima: true,
};

const suggestion = suggestReview(sessionInput, content, userProfile, DEFAULT_COEFFICIENTS);

console.log(`Probability: ${(suggestion.probabilidade * 100).toFixed(1)}%`);
console.log(`Needs review: ${suggestion.revisar}`);
console.log(`Next interval: ${suggestion.tProximo.toFixed(1)} days`);
```

### Training Custom Coefficients

```typescript
import { trainCoefficients, DEFAULT_COEFFICIENTS } from './spaced-review-engine';

const trainingExamples = [
  {
    dificuldade: 0.8, historico: 0.6, tempoEstudo: 0.7,
    confianca: 0.5, intervaloAnterior: 1, lembrou: 1,
  },
  {
    dificuldade: 0.5, historico: 0.8, tempoEstudo: 0.9,
    confianca: 0.8, intervaloAnterior: 0, lembrou: 0,
  },
  // ... more examples
];

const trainedCoefficients = trainCoefficients(
  trainingExamples,
  DEFAULT_COEFFICIENTS,
  100, // epochs
  0.01 // learning rate
);
```

### Using the Engine Class

```typescript
import { SpacedReviewEngine } from './spaced-review-engine';

const engine = new SpacedReviewEngine();
await engine.initialize();

// Set memory profile
await engine.setMemoryProfile("user123", MemoryProfile.GOOD);

// Get review suggestion
const suggestion = await engine.getReviewSuggestion(sessionInput);
if (suggestion) {
  // Handle suggestion
}

// Train model with user data
await engine.trainModel(trainingExamples, 50);
```

## Maria's Example (Specification)

```typescript
// Maria's parameters from the specification
const mariaInput = {
  userId: "maria",
  contentId: "derivadas",
  tDias: 5,
  historico: 0.6,
  tempoEstudo: 0.7,
  confianca: 0.5,
  intervaloAnterior: 1,
  acertouUltima: true,
};

const mariaContent = {
  id: "derivadas",
  s0: 1,
  dificuldade: 0.8,
};

const mariaProfile = {
  id: "maria",
  pUsuario: MemoryProfile.POOR, // 0.4
  performanceMedia: 0.65,
  beta: 0.5,
};

const suggestion = suggestReview(mariaInput, mariaContent, mariaProfile, DEFAULT_COEFFICIENTS);

// Expected results:
// Probability: ~8.9% (needs urgent review)
// Next interval: ~1.5 days
```

## Default Coefficients

```typescript
export const DEFAULT_COEFFICIENTS = {
  alpha1: -0.3,  // Difficulty factor
  alpha2: 0.5,   // Historical performance factor
  alpha3: 0.4,   // Study time factor
  alpha4: 0.3,   // Confidence factor
  alpha5: 0.6,   // Previous interval factor
  beta: 0.5,     // Memory calibration factor
};
```

## Memory Profile Guidelines

- **Good Memory (0.2)**: Users who remember information well with longer intervals
- **Poor Memory (0.4)**: Standard profile, balanced approach (default)
- **Terrible Memory (0.8)**: Users who need frequent reviews

## Integration with StudyCycle

The engine integrates with the existing StudyCycle architecture through:

1. **Storage Layer**: `StudyCycleStore` class handles persistence
2. **User Profiles**: Memory profiles stored in user preferences
3. **Content Items**: Difficulty and stability metadata
4. **ML Training**: Continuous learning from user performance data

## Performance Considerations

- Pure functions enable easy testing and optimization
- Gradient descent is computationally light for real-time use
- Coefficients can be cached and updated periodically
- Memory profiles can be adjusted based on user feedback

## Future Enhancements

- Neural network-based prediction models
- Time-series analysis of learning patterns
- Multi-factor authentication for coefficient updates
- A/B testing framework for algorithm improvements
- Integration with cognitive assessments

## Testing

Run the comprehensive test suite:

```typescript
import { runAllExamples } from './spaced-review-engine-example';

// Run all examples in browser console
runAllExamples();
```

## License

This implementation is part of the StudyCycle project and follows the same licensing terms.

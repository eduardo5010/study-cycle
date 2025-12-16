/**
 * Spaced Review Engine - Advanced Personalized Spaced Repetition System
 *
 * This module implements a sophisticated spaced repetition algorithm that uses
 * the Ebbinghaus forgetting curve combined with machine learning to personalize
 * review intervals for each user based on their memory profile and learning patterns.
 */

/**
 * Memory profile enumeration for user memory quality
 */
export enum MemoryProfile {
  GOOD = 0.2,      // Good memory: lower retention probability threshold
  POOR = 0.4,      // Poor memory: higher retention probability threshold
  TERRIBLE = 0.8,  // Terrible memory: very high retention probability threshold
}

/**
 * User profile interface containing memory-related information
 */
export interface UserProfile {
  /** Unique user identifier */
  id: string;
  /** Memory profile multiplier (0.2 = good, 0.4 = poor, 0.8 = terrible) */
  pUsuario: number;
  /** User's average performance (0-1 scale) */
  performanceMedia: number;
  /** ML calibration coefficient */
  beta: number;
}

/**
 * Content item interface representing study material
 */
export interface ContentItem {
  /** Unique content identifier */
  id: string;
  /** Base stability factor in days */
  s0: number;
  /** Content difficulty (0-1 scale) */
  dificuldade: number;
}

/**
 * Input data for study session calculations
 */
export interface StudySessionInput {
  /** User identifier */
  userId: string;
  /** Content identifier */
  contentId: string;
  /** Days since last review */
  tDias: number;
  /** Historical accuracy for this content (0-1 scale) */
  historico: number;
  /** Time spent studying (normalized 0-1) */
  tempoEstudo: number;
  /** User's confidence level (0-1 scale) */
  confianca: number;
  /** Whether user remembered in the previous interval (1 = remembered, 0 = forgot) */
  intervaloAnterior: number;
  /** Custom probability threshold override (default: 0.3) */
  limiar?: number;
  /** Whether user correctly answered the last review */
  acertouUltima?: boolean;
}

/**
 * AI/ML model coefficients for personalization
 */
export interface ModelCoefficients {
  /** Difficulty coefficient */
  alpha1: number;
  /** Historical performance coefficient */
  alpha2: number;
  /** Study time coefficient */
  alpha3: number;
  /** Confidence coefficient */
  alpha4: number;
  /** Previous interval success coefficient */
  alpha5: number;
  /** Memory calibration coefficient */
  beta: number;
}

/**
 * Review suggestion output
 */
export interface ReviewSuggestion {
  /** Calculated probability of remembering (0-1) */
  probabilidade: number;
  /** Whether item should be reviewed immediately */
  revisar: boolean;
  /** Recommended next review interval in days */
  tProximo: number;
  /** Calculated memory stability factor */
  S: number;
  /** User-specific lambda calibration factor */
  lambda: number;
}

/**
 * Training example for ML model
 */
export interface TrainingExample {
  /** Content difficulty (0-1) */
  dificuldade: number;
  /** Historical performance (0-1) */
  historico: number;
  /** Study time (normalized 0-1) */
  tempoEstudo: number;
  /** Confidence level (0-1) */
  confianca: number;
  /** Previous interval success (0 or 1) */
  intervaloAnterior: number;
  /** Whether user remembered the content (0 or 1) */
  lembrou: number;
}

/**
 * Default model coefficients (initial values)
 */
export const DEFAULT_COEFFICIENTS: ModelCoefficients = {
  alpha1: -0.3,  // Difficulty factor
  alpha2: 0.5,   // Historical performance factor
  alpha3: 0.4,   // Study time factor
  alpha4: 0.3,   // Confidence factor
  alpha5: 0.6,   // Previous interval factor
  beta: 0.5,     // Memory calibration factor
};

/**
 * Computes memory stability factor S using multivariate approach
 * @param input Study session input data
 * @param content Content item data
 * @param coefs Trained model coefficients
 * @returns Memory stability factor in days
 */
export function computeS(
  input: StudySessionInput,
  content: ContentItem,
  coefs: ModelCoefficients
): number {
  const { historico, tempoEstudo, confianca, intervaloAnterior } = input;
  const { s0, dificuldade } = content;
  const { alpha1, alpha2, alpha3, alpha4, alpha5 } = coefs;

  // Normalize inputs to 0-1 range (ensure they are within bounds)
  const normDificuldade = Math.max(0, Math.min(1, dificuldade));
  const normHistorico = Math.max(0, Math.min(1, historico));
  const normTempoEstudo = Math.max(0, Math.min(1, tempoEstudo));
  const normConfianca = Math.max(0, Math.min(1, confianca));

  // Calculate multivariate stability factor
  const S = s0 * (1 +
    alpha1 * normDificuldade +
    alpha2 * normHistorico +
    alpha3 * normTempoEstudo +
    alpha4 * normConfianca +
    alpha5 * intervaloAnterior
  );

  // Ensure S is positive and reasonable
  return Math.max(0.1, Math.min(365, S));
}

/**
 * Computes user-specific lambda calibration factor
 * @param profile User profile with memory information
 * @returns Lambda calibration factor
 */
export function computeLambda(profile: UserProfile): number {
  const { performanceMedia, beta } = profile;

  // Lambda adjusts probability based on user's historical performance
  // performanceMedia < 0.7 means below average memory, lambda > 1 increases retention probability
  // performanceMedia > 0.7 means above average memory, lambda < 1 decreases retention probability
  const lambda = 1 + beta * (performanceMedia - 0.7);

  // Ensure lambda is within reasonable bounds
  return Math.max(0.1, Math.min(3.0, lambda));
}

/**
 * Computes probability of remembering using Ebbinghaus forgetting curve
 * @param t Time since last review in days
 * @param S Memory stability factor
 * @param lambda User calibration factor
 * @param pUsuario Memory profile multiplier
 * @returns Probability of remembering (0-1)
 */
export function computeProbability(
  t: number,
  S: number,
  lambda: number,
  pUsuario: number
): number {
  // Ebbinghaus forgetting curve: R(t) = e^(-t/S)
  // Adjusted with user factors: P = R(t) * λ * pUsuario
  const baseProbability = Math.exp(-t / S);
  const adjustedProbability = baseProbability * lambda * pUsuario;

  // Ensure probability is within 0-1 bounds
  return Math.max(0, Math.min(1, adjustedProbability));
}

/**
 * Determines if content should be reviewed based on probability threshold
 * @param P Current probability of remembering
 * @param limiar Probability threshold (default: 0.3)
 * @returns Whether item should be reviewed
 */
export function shouldReview(P: number, limiar: number = 0.3): boolean {
  return P < limiar;
}

/**
 * Calculates optimal next review interval
 * @param S Current memory stability factor
 * @param acertouUltima Whether user correctly answered last review
 * @param limiar Probability threshold for next review
 * @returns Recommended next interval in days
 */
export function nextInterval(
  S: number,
  acertouUltima: boolean,
  limiar: number = 0.3
): number {
  // Solve for t in: e^(-t/S) = limiar
  // t = -S * ln(limiar)
  const baseInterval = -S * Math.log(limiar);

  // Apply adjustment factor based on last review success
  const factorAjuste = acertouUltima ? 1.3 : 0.5;
  const adjustedInterval = baseInterval * factorAjuste;

  // Ensure interval is reasonable (minimum 0.5 days, maximum 365 days)
  return Math.max(0.5, Math.min(365, adjustedInterval));
}

/**
 * Main orchestrator function that provides complete review suggestions
 * @param input Study session input data
 * @param content Content item information
 * @param profile User profile data
 * @param coefs Trained model coefficients
 * @returns Complete review suggestion
 */
export function suggestReview(
  input: StudySessionInput,
  content: ContentItem,
  profile: UserProfile,
  coefs: ModelCoefficients
): ReviewSuggestion {
  // Calculate memory stability factor
  const S = computeS(input, content, coefs);

  // Calculate user calibration factor
  const lambda = computeLambda(profile);

  // Calculate current probability of remembering
  const probabilidade = computeProbability(input.tDias, S, lambda, profile.pUsuario);

  // Determine if review is needed
  const limiar = input.limiar || 0.3;
  const revisar = shouldReview(probabilidade, limiar);

  // Calculate next review interval
  const acertouUltima = input.acertouUltima ?? true;
  const tProximo = nextInterval(S, acertouUltima, limiar);

  return {
    probabilidade,
    revisar,
    tProximo,
    S,
    lambda,
  };
}

/**
 * Trains model coefficients using gradient descent on training examples
 * @param examples Array of training examples
 * @param initial Initial coefficient values
 * @param epochs Number of training epochs
 * @param learningRate Learning rate for gradient descent
 * @returns Trained model coefficients
 */
export function trainCoefficients(
  examples: TrainingExample[],
  initial: ModelCoefficients,
  epochs: number = 100,
  learningRate: number = 0.01
): ModelCoefficients {
  let coefs = { ...initial };

  for (let epoch = 0; epoch < epochs; epoch++) {
    let totalLoss = 0;

    // Calculate gradients for each example
    for (const example of examples) {
      // Create mock input and content for this example
      const mockInput: StudySessionInput = {
        userId: "training",
        contentId: "training",
        tDias: 1, // Fixed for training
        historico: example.historico,
        tempoEstudo: example.tempoEstudo,
        confianca: example.confianca,
        intervaloAnterior: example.intervaloAnterior,
        acertouUltima: example.intervaloAnterior === 1,
      };

      const mockContent: ContentItem = {
        id: "training",
        s0: 1,
        dificuldade: example.dificuldade,
      };

      const mockProfile: UserProfile = {
        id: "training",
        pUsuario: 0.4, // Standard for training
        performanceMedia: 0.65,
        beta: coefs.beta,
      };

      // Calculate prediction
      const prediction = predictRememberProbability(mockInput, mockContent, mockProfile, coefs, 1);

      // Calculate loss (binary cross-entropy)
      const loss = -(
        example.lembrou * Math.log(prediction + 1e-8) +
        (1 - example.lembrou) * Math.log(1 - prediction + 1e-8)
      );
      totalLoss += loss;

      // Calculate gradients (simplified approximation)
      const error = prediction - example.lembrou;

      // Update coefficients using gradient descent
      coefs.alpha1 -= learningRate * error * example.dificuldade;
      coefs.alpha2 -= learningRate * error * example.historico;
      coefs.alpha3 -= learningRate * error * example.tempoEstudo;
      coefs.alpha4 -= learningRate * error * example.confianca;
      coefs.alpha5 -= learningRate * error * example.intervaloAnterior;
      coefs.beta -= learningRate * error * (mockProfile.performanceMedia - 0.7);
    }

    // Log progress every 10 epochs
    if (epoch % 10 === 0) {
      console.log(`Epoch ${epoch}, Average Loss: ${(totalLoss / examples.length).toFixed(4)}`);
    }
  }

  return coefs;
}

/**
 * Predicts probability of remembering for training/validation
 * @param input Study session input
 * @param content Content item
 * @param profile User profile
 * @param coefs Model coefficients
 * @param tDiasOverride Override for days since review
 * @returns Predicted probability of remembering
 */
export function predictRememberProbability(
  input: StudySessionInput,
  content: ContentItem,
  profile: UserProfile,
  coefs: ModelCoefficients,
  tDiasOverride?: number
): number {
  const t = tDiasOverride ?? input.tDias;
  const S = computeS(input, content, coefs);
  const lambda = computeLambda(profile);
  return computeProbability(t, S, lambda, profile.pUsuario);
}

/**
 * StudyCycle Storage Service for spaced review data
 */
export class StudyCycleStore {
  /**
   * Gets user profile with memory information
   * @param userId User identifier
   * @returns User profile or null if not found
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await fetch(`/api/user/profile/${userId}`);
      if (!response.ok) return null;

      const user = await response.json();
      return {
        id: userId,
        pUsuario: user.memoryProfile || MemoryProfile.POOR,
        performanceMedia: user.averageAccuracy || 0.65,
        beta: 0.5,
      };
    } catch (error) {
      console.error("Failed to get user profile:", error);
      return null;
    }
  }

  /**
   * Updates user profile memory settings
   * @param userId User identifier
   * @param updates Partial profile updates
   * @returns Success status
   */
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      const response = await fetch(`/api/user/profile/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      return response.ok;
    } catch (error) {
      console.error("Failed to update user profile:", error);
      return false;
    }
  }

  /**
   * Gets content item information
   * @param contentId Content identifier
   * @returns Content item or null if not found
   */
  async getContentItem(contentId: string): Promise<ContentItem | null> {
    try {
      // This would integrate with your content management system
      // For now, return default values
      return {
        id: contentId,
        s0: 1, // Default 1 day base stability
        dificuldade: 0.5, // Medium difficulty default
      };
    } catch (error) {
      console.error("Failed to get content item:", error);
      return null;
    }
  }

  /**
   * Saves trained model coefficients
   * @param coefs Model coefficients to save
   * @returns Success status
   */
  async saveCoefficients(coefs: ModelCoefficients): Promise<boolean> {
    try {
      // Store coefficients in localStorage for now
      // In production, this would save to database
      localStorage.setItem("spacedReviewCoefficients", JSON.stringify(coefs));
      return true;
    } catch (error) {
      console.error("Failed to save coefficients:", error);
      return false;
    }
  }

  /**
   * Loads trained model coefficients
   * @returns Model coefficients or defaults if not found
   */
  async loadCoefficients(): Promise<ModelCoefficients> {
    try {
      const stored = localStorage.getItem("spacedReviewCoefficients");
      if (stored) {
        return { ...DEFAULT_COEFFICIENTS, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error("Failed to load coefficients:", error);
    }
    return { ...DEFAULT_COEFFICIENTS };
  }
}

/**
 * Main Spaced Review Engine class
 */
export class SpacedReviewEngine {
  private store: StudyCycleStore;
  private coefficients: ModelCoefficients;

  constructor() {
    this.store = new StudyCycleStore();
    this.coefficients = DEFAULT_COEFFICIENTS;
  }

  /**
   * Initializes the engine by loading user coefficients
   */
  async initialize(): Promise<void> {
    this.coefficients = await this.store.loadCoefficients();
  }

  /**
   * Sets user memory profile
   * @param userId User identifier
   * @param memoryProfile Memory profile enum value
   */
  async setMemoryProfile(userId: string, memoryProfile: MemoryProfile): Promise<boolean> {
    return this.store.updateUserProfile(userId, { pUsuario: memoryProfile });
  }

  /**
   * Gets personalized review suggestion for content
   * @param input Study session input data
   * @returns Review suggestion
   */
  async getReviewSuggestion(input: StudySessionInput): Promise<ReviewSuggestion | null> {
    try {
      const [profile, content] = await Promise.all([
        this.store.getUserProfile(input.userId),
        this.store.getContentItem(input.contentId),
      ]);

      if (!profile || !content) {
        return null;
      }

      return suggestReview(input, content, profile, this.coefficients);
    } catch (error) {
      console.error("Failed to get review suggestion:", error);
      return null;
    }
  }

  /**
   * Trains the model with new data
   * @param examples Training examples
   * @param epochs Number of training epochs
   */
  async trainModel(examples: TrainingExample[], epochs: number = 100): Promise<void> {
    this.coefficients = trainCoefficients(examples, this.coefficients, epochs);
    await this.store.saveCoefficients(this.coefficients);
  }

  /**
   * Gets current model coefficients
   * @returns Current coefficients
   */
  getCoefficients(): ModelCoefficients {
    return { ...this.coefficients };
  }
}

// Export singleton instance
export const spacedReviewEngine = new SpacedReviewEngine();

// Initialize on module load
spacedReviewEngine.initialize().catch(console.error);

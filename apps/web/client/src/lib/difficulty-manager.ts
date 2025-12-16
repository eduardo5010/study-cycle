/**
 * Sistema de Dificuldade Desejável - Difficulty Manager
 *
 * Baseado em neuroaprendizagem, este sistema implementa o conceito de
 * "dificuldade desejável" que maximiza a retenção de longo prazo através
 * do equilíbrio perfeito entre desafio e habilidade.
 */

export type DifficultyLevel = 'very_easy' | 'easy' | 'optimal' | 'challenging' | 'very_challenging';

export interface UserCognitiveProfile {
  baselineDifficulty: DifficultyLevel;
  attentionSpan: number; // minutos
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  fatigueLevel: number; // 0-100
  motivationLevel: number; // 0-100
  preferredChallenge: number; // 0-100 (0 = muito fácil, 100 = muito difícil)
  cognitiveLoadTolerance: number; // capacidade de processamento cognitivo
  lastAssessment: Date;
}

export interface StudySessionMetrics {
  startTime: Date;
  endTime?: Date;
  correctAnswers: number;
  incorrectAnswers: number;
  averageResponseTime: number;
  difficultyProgression: DifficultyLevel[];
  engagementScore: number; // 0-100
  frustrationIndicators: number; // 0-100
  flowStateDuration: number; // minutos em estado de fluxo
}

export interface AdaptiveContent {
  id: string;
  baseDifficulty: DifficultyLevel;
  content: any;
  hints?: string[];
  variations: ContentVariation[];
  cognitiveDemand: number; // 1-10
  estimatedTime: number; // segundos
}

export interface ContentVariation {
  level: DifficultyLevel;
  content: any;
  hints: string[];
  timeMultiplier: number; // quanto tempo adicional necessário
}

export class DifficultyManager {
  private static instance: DifficultyManager;
  private userProfiles: Map<string, UserCognitiveProfile> = new Map();

  static getInstance(): DifficultyManager {
    if (!DifficultyManager.instance) {
      DifficultyManager.instance = new DifficultyManager();
    }
    return DifficultyManager.instance;
  }

  /**
   * Avalia o perfil cognitivo inicial do usuário
   */
  async assessUserProfile(userId: string, assessmentResults: any): Promise<UserCognitiveProfile> {
    // Análise baseada em tempo de resposta, acertos/erros, padrões de dificuldade
    const baselineDifficulty = this.calculateBaselineDifficulty(assessmentResults);
    const attentionSpan = this.estimateAttentionSpan(assessmentResults);
    const learningStyle = this.detectLearningStyle(assessmentResults);

    const profile: UserCognitiveProfile = {
      baselineDifficulty,
      attentionSpan,
      learningStyle,
      fatigueLevel: 20, // começar otimista
      motivationLevel: 80,
      preferredChallenge: this.calculatePreferredChallenge(assessmentResults),
      cognitiveLoadTolerance: this.estimateCognitiveLoad(assessmentResults),
      lastAssessment: new Date()
    };

    this.userProfiles.set(userId, profile);
    return profile;
  }

  /**
   * Ajusta dificuldade baseada em métricas da sessão atual
   */
  adjustDifficulty(
    userId: string,
    currentMetrics: StudySessionMetrics,
    targetRetention: number = 0.85
  ): DifficultyLevel {
    const profile = this.userProfiles.get(userId);
    if (!profile) return 'optimal';

    const performance = currentMetrics.correctAnswers /
                       (currentMetrics.correctAnswers + currentMetrics.incorrectAnswers);

    // Algoritmo de ajuste baseado em neuroaprendizagem
    const flowZone = this.calculateFlowZone(profile, currentMetrics);

    if (performance < 0.6) {
      // Muito difícil - reduzir desafio
      return this.decreaseDifficulty(flowZone);
    } else if (performance > 0.9) {
      // Muito fácil - aumentar desafio
      return this.increaseDifficulty(flowZone);
    } else {
      // Na zona ideal - manter ou ajustar sutilmente
      return this.optimizeDifficulty(flowZone, currentMetrics);
    }
  }

  /**
   * Gera conteúdo adaptativo baseado no perfil do usuário
   */
  generateAdaptiveContent(
    baseContent: any,
    userId: string,
    context: 'study' | 'review' | 'practice'
  ): AdaptiveContent {
    const profile = this.userProfiles.get(userId);

    const adaptiveContent: AdaptiveContent = {
      id: `adaptive_${Date.now()}`,
      baseDifficulty: profile?.baselineDifficulty || 'optimal',
      content: baseContent,
      hints: this.generateHints(baseContent, profile),
      variations: this.generateVariations(baseContent, profile),
      cognitiveDemand: this.calculateCognitiveDemand(baseContent, profile),
      estimatedTime: this.estimateCompletionTime(baseContent, profile)
    };

    return adaptiveContent;
  }

  /**
   * Calcula se o usuário está na "zona de fluxo" ideal
   */
  private calculateFlowZone(profile: UserCognitiveProfile, metrics: StudySessionMetrics): DifficultyLevel {
    const performance = metrics.correctAnswers / (metrics.correctAnswers + metrics.incorrectAnswers);
    const engagement = metrics.engagementScore / 100;
    const frustration = metrics.frustrationIndicators / 100;

    // Algoritmo de detecção de zona de fluxo baseado em Csikszentmihalyi
    if (performance > 0.7 && engagement > 0.7 && frustration < 0.3) {
      return 'optimal'; // Estado de fluxo
    } else if (performance < 0.5 || frustration > 0.6) {
      return 'easy'; // Muito difícil
    } else if (performance > 0.9 && engagement < 0.5) {
      return 'challenging'; // Muito fácil
    } else {
      return 'optimal'; // Equilibrado
    }
  }

  /**
   * Calcula dificuldade baseline baseada em avaliação inicial
   */
  private calculateBaselineDifficulty(results: any): DifficultyLevel {
    const avgAccuracy = results.accuracy || 0.75;
    const avgResponseTime = results.avgResponseTime || 30;
    const errorPatterns = results.errorPatterns || {};

    if (avgAccuracy > 0.85 && avgResponseTime < 20) {
      return 'very_challenging';
    } else if (avgAccuracy > 0.75 && avgResponseTime < 30) {
      return 'challenging';
    } else if (avgAccuracy > 0.65 && avgResponseTime < 45) {
      return 'optimal';
    } else if (avgAccuracy > 0.5) {
      return 'easy';
    } else {
      return 'very_easy';
    }
  }

  /**
   * Estima span de atenção baseado em padrões de resposta
   */
  private estimateAttentionSpan(results: any): number {
    const sessionDuration = results.sessionDuration || 25;
    const attentionDecay = results.attentionDecay || 0.1;

    // Modelo de decaimento de atenção baseado em pesquisa
    const estimatedSpan = sessionDuration * (1 - attentionDecay);
    return Math.max(5, Math.min(90, estimatedSpan));
  }

  /**
   * Detecta estilo de aprendizado baseado em padrões de resposta
   */
  private detectLearningStyle(results: any): 'visual' | 'auditory' | 'kinesthetic' | 'reading' {
    // Análise simplificada baseada em tipos de erro e tempo de resposta
    const visualErrors = results.visualErrors || 0;
    const auditoryErrors = results.auditoryErrors || 0;
    const kinestheticErrors = results.kinestheticErrors || 0;
    const readingErrors = results.readingErrors || 0;

    const minErrors = Math.min(visualErrors, auditoryErrors, kinestheticErrors, readingErrors);

    if (minErrors === visualErrors) return 'visual';
    if (minErrors === auditoryErrors) return 'auditory';
    if (minErrors === kinestheticErrors) return 'kinesthetic';
    return 'reading';
  }

  /**
   * Calcula nível de desafio preferido pelo usuário
   */
  private calculatePreferredChallenge(results: any): number {
    const accuracy = results.accuracy || 0.75;
    const avgResponseTime = results.avgResponseTime || 30;

    // Usuários que respondem rápido e com alta acurácia preferem mais desafio
    const speedBonus = Math.max(0, (45 - avgResponseTime) / 45) * 20;
    const accuracyBonus = (accuracy - 0.5) * 40;

    return Math.max(20, Math.min(80, 50 + speedBonus + accuracyBonus));
  }

  /**
   * Estima tolerância a carga cognitiva
   */
  private estimateCognitiveLoad(results: any): number {
    const taskSwitching = results.taskSwitching || 0.5;
    const memoryLoad = results.memoryLoad || 0.5;
    const processingSpeed = results.processingSpeed || 0.5;

    return (taskSwitching + memoryLoad + processingSpeed) / 3 * 10;
  }

  /**
   * Diminui dificuldade quando muito desafiador
   */
  private decreaseDifficulty(current: DifficultyLevel): DifficultyLevel {
    switch (current) {
      case 'very_challenging': return 'challenging';
      case 'challenging': return 'optimal';
      case 'optimal': return 'easy';
      case 'easy': return 'very_easy';
      default: return 'very_easy';
    }
  }

  /**
   * Aumenta dificuldade quando muito fácil
   */
  private increaseDifficulty(current: DifficultyLevel): DifficultyLevel {
    switch (current) {
      case 'very_easy': return 'easy';
      case 'easy': return 'optimal';
      case 'optimal': return 'challenging';
      case 'challenging': return 'very_challenging';
      default: return 'very_challenging';
    }
  }

  /**
   * Otimiza dificuldade na zona de fluxo
   */
  private optimizeDifficulty(current: DifficultyLevel, metrics: StudySessionMetrics): DifficultyLevel {
    const engagement = metrics.engagementScore;
    const frustration = metrics.frustrationIndicators;

    // Pequenos ajustes baseados em engajamento e frustração
    if (engagement > 80 && frustration < 20) {
      return this.increaseDifficulty(current);
    } else if (engagement < 60 || frustration > 40) {
      return this.decreaseDifficulty(current);
    }

    return current;
  }

  /**
   * Gera dicas adaptativas baseadas no perfil do usuário
   */
  private generateHints(baseContent: any, profile?: UserCognitiveProfile): string[] {
    const hints: string[] = [];

    if (!profile) return hints;

    // Dicas baseadas no estilo de aprendizado
    switch (profile.learningStyle) {
      case 'visual':
        hints.push("Tente visualizar a informação como uma imagem mental");
        break;
      case 'auditory':
        hints.push("Diga a resposta em voz alta antes de verificar");
        break;
      case 'kinesthetic':
        hints.push("Use gestos ou movimentos para representar o conceito");
        break;
      case 'reading':
        hints.push("Leia a pergunta várias vezes em voz baixa");
        break;
    }

    // Dicas baseadas na dificuldade
    if (profile.baselineDifficulty === 'very_easy' || profile.baselineDifficulty === 'easy') {
      hints.push("Quebre a informação em partes menores");
      hints.push("Conecte com algo que você já conhece");
    }

    return hints;
  }

  /**
   * Gera variações de conteúdo para diferentes níveis de dificuldade
   */
  private generateVariations(baseContent: any, profile?: UserCognitiveProfile): ContentVariation[] {
    return [
      {
        level: 'very_easy',
        content: this.simplifyContent(baseContent, 0.3),
        hints: ['Pense em exemplos simples', 'Use analogias básicas'],
        timeMultiplier: 1.5
      },
      {
        level: 'easy',
        content: this.simplifyContent(baseContent, 0.6),
        hints: ['Conecte com conceitos conhecidos'],
        timeMultiplier: 1.2
      },
      {
        level: 'optimal',
        content: baseContent,
        hints: [],
        timeMultiplier: 1.0
      },
      {
        level: 'challenging',
        content: this.complexifyContent(baseContent, 0.3),
        hints: ['Considere múltiplas perspectivas'],
        timeMultiplier: 0.8
      },
      {
        level: 'very_challenging',
        content: this.complexifyContent(baseContent, 0.6),
        hints: ['Integre com conceitos avançados'],
        timeMultiplier: 0.6
      }
    ];
  }

  /**
   * Simplifica conteúdo para níveis mais fáceis
   */
  private simplifyContent(content: any, factor: number): any {
    // Implementação básica - em produção seria mais sofisticada
    if (typeof content === 'string') {
      // Simplificar removendo complexidade
      return content.replace(/\([^)]*\)/g, ''); // Remove parênteses
    }
    return content;
  }

  /**
   * Torna conteúdo mais complexo para níveis desafiadores
   */
  private complexifyContent(content: any, factor: number): any {
    // Implementação básica - em produção seria mais sofisticada
    if (typeof content === 'string') {
      // Adicionar profundidade
      return content + " (considere aplicações práticas)";
    }
    return content;
  }

  /**
   * Calcula demanda cognitiva do conteúdo
   */
  private calculateCognitiveDemand(content: any, profile?: UserCognitiveProfile): number {
    let demand = 5; // baseline

    if (typeof content === 'string') {
      // Análise básica de complexidade
      const wordCount = content.split(' ').length;
      const complexWords = (content.match(/\b\w{8,}\b/g) || []).length;
      const technicalTerms = (content.match(/\b[A-Z][a-z]+\b/g) || []).length;

      demand += Math.floor(wordCount / 20);
      demand += complexWords;
      demand += technicalTerms;
    }

    // Ajustar baseado no perfil do usuário
    if (profile) {
      if (profile.baselineDifficulty === 'very_easy') demand *= 0.7;
      if (profile.baselineDifficulty === 'very_challenging') demand *= 1.3;
    }

    return Math.max(1, Math.min(10, demand));
  }

  /**
   * Estima tempo de conclusão baseado no conteúdo e perfil
   */
  private estimateCompletionTime(content: any, profile?: UserCognitiveProfile): number {
    const baseTime = 30; // 30 segundos baseline

    let multiplier = 1.0;

    if (profile) {
      // Ajustar baseado na dificuldade baseline
      switch (profile.baselineDifficulty) {
        case 'very_easy': multiplier = 1.3; break;
        case 'easy': multiplier = 1.1; break;
        case 'challenging': multiplier = 0.9; break;
        case 'very_challenging': multiplier = 0.7; break;
      }

      // Ajustar baseado na fadiga
      multiplier *= (1 + (profile.fatigueLevel / 100) * 0.5);

      // Ajustar baseado na atenção
      multiplier *= Math.max(0.5, profile.attentionSpan / 30);
    }

    return Math.floor(baseTime * multiplier);
  }
}

// Exportar singleton
export const difficultyManager = DifficultyManager.getInstance();

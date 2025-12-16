import OpenAI from 'openai';

// Interfaces para os tipos de conteúdo gerado
export interface GeneratedCourse {
  title: string;
  description: string;
  subjects: Array<{
    title: string;
    description: string;
    modules: Array<{
      title: string;
      description: string;
      units: Array<{
        title: string;
        description: string;
        lessons: Array<{
          title: string;
          content: string;
          type: 'text' | 'video' | 'quiz';
        }>;
      }>;
    }>;
  }>;
}

export interface GeneratedFlashcard {
  front: string;
  back: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface GeneratedExercise {
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  difficulty: 'easy' | 'medium' | 'hard';
}

export class AIGenerator {
  private openai: OpenAI | null = null;
  private useLocalModel: boolean = false;

  constructor() {
    // Tentar usar OpenAI primeiro (créditos gratuitos)
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } else {
      // Fallback para modelo local gratuito
      this.useLocalModel = true;
      console.log('OpenAI API key not found, using local model fallback');
    }
  }

  async generateCourse(topic: string, level: string, language: string = 'pt-br'): Promise<GeneratedCourse> {
    const prompt = `Crie um curso completo sobre "${topic}" para nível ${level} em português do Brasil.

Estrutura obrigatória:
- Título do curso (atraente e específico)
- Descrição (2-3 frases)
- Pelo menos 3 assuntos principais
- Cada assunto deve ter pelo menos 2 módulos
- Cada módulo deve ter pelo menos 2 unidades
- Cada unidade deve ter pelo menos 2 lições

IMPORTANTE: Responda APENAS com JSON válido, sem texto adicional.`;

    try {
      const content = await this.callAI(prompt);
      return this.parseCourseResponse(content);
    } catch (error) {
      console.error('Error generating course:', error);
      throw new Error('Falha ao gerar curso');
    }
  }

  async generateFlashcards(topic: string, count: number = 10, language: string = 'pt-br'): Promise<GeneratedFlashcard[]> {
    const prompt = `Crie ${count} flashcards sobre "${topic}" em português do Brasil.

Cada flashcard deve ter:
- Frente: pergunta ou conceito (curta)
- Verso: resposta ou explicação completa
- Dificuldade: easy, medium, ou hard
- Tags: 2-3 tags relevantes

Formato JSON: array de objetos com front, back, difficulty, tags.
IMPORTANTE: Responda APENAS com JSON válido.`;

    try {
      const content = await this.callAI(prompt);
      return this.parseFlashcardsResponse(content);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      throw new Error('Falha ao gerar flashcards');
    }
  }

  async generateExercises(topic: string, count: number = 5, language: string = 'pt-br'): Promise<GeneratedExercise[]> {
    const prompt = `Crie ${count} exercícios sobre "${topic}" em português do Brasil.

Tipos de exercício:
- Múltipla escolha (4 opções, 1 correta)
- Verdadeiro/Falso
- Resposta curta

Cada exercício deve ter:
- Pergunta
- Opções (se múltipla escolha)
- Resposta correta
- Explicação
- Tipo
- Dificuldade

Formato JSON: array de objetos.
IMPORTANTE: Responda APENAS com JSON válido.`;

    try {
      const content = await this.callAI(prompt);
      return this.parseExercisesResponse(content);
    } catch (error) {
      console.error('Error generating exercises:', error);
      throw new Error('Falha ao gerar exercícios');
    }
  }

  private async callAI(prompt: string): Promise<string> {
    if (this.openai && !this.useLocalModel) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo', // Modelo gratuito/inicial
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 4000,
          temperature: 0.7,
        });
        return response.choices[0]?.message?.content || '';
      } catch (error) {
        console.warn('OpenAI failed, falling back to local model');
        this.useLocalModel = true;
      }
    }

    // Fallback: simular resposta (em produção, integrar com Ollama ou similar)
    return this.generateMockResponse(prompt);
  }

  private generateMockResponse(prompt: string): string {
    // Mock responses para desenvolvimento - em produção integrar com Ollama
    if (prompt.includes('curso')) {
      return JSON.stringify({
        title: "Curso de Matemática Básica",
        description: "Aprenda os fundamentos da matemática com exercícios práticos e aplicações reais.",
        subjects: [
          {
            title: "Álgebra Fundamental",
            description: "Conceitos básicos de álgebra",
            modules: [
              {
                title: "Equações Lineares",
                description: "Resolução de equações",
                units: [
                  {
                    title: "Introdução às Equações",
                    description: "O que são equações",
                    lessons: [
                      {
                        title: "Conceito de Equação",
                        content: "Uma equação é uma afirmação matemática que estabelece a igualdade entre duas expressões.",
                        type: "text"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      });
    }

    if (prompt.includes('flashcard')) {
      return JSON.stringify([
        {
          front: "O que é uma equação?",
          back: "Uma equação é uma afirmação matemática que estabelece a igualdade entre duas expressões.",
          subject: "Matemática",
          difficulty: "easy",
          tags: ["álgebra", "conceitos básicos"]
        }
      ]);
    }

    return JSON.stringify([]);
  }

  private parseCourseResponse(content: string): GeneratedCourse {
    try {
      const parsed = JSON.parse(content);
      return parsed as GeneratedCourse;
    } catch (error) {
      console.error('Failed to parse course response:', error);
      throw new Error('Resposta da IA inválida para curso');
    }
  }

  private parseFlashcardsResponse(content: string): GeneratedFlashcard[] {
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Failed to parse flashcards response:', error);
      return [];
    }
  }

  private parseExercisesResponse(content: string): GeneratedExercise[] {
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Failed to parse exercises response:', error);
      return [];
    }
  }
}

export const aiGenerator = new AIGenerator();

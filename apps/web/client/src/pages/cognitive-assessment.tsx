import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { difficultyManager, type DifficultyLevel, type UserCognitiveProfile } from "@/lib/difficulty-manager";
import {
  Brain,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Heart,
  Eye,
  RotateCcw,
  ArrowRight,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  Star
} from "lucide-react";

interface AssessmentQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'pattern_recognition' | 'memory_test';
  difficulty: DifficultyLevel;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  timeLimit: number; // segundos
  cognitiveDomain: 'attention' | 'memory' | 'processing_speed' | 'problem_solving';
}

interface AssessmentResult {
  questionId: string;
  userAnswer: string | number;
  correct: boolean;
  responseTime: number;
  difficulty: DifficultyLevel;
  cognitiveDomain: string;
}

export default function CognitiveAssessmentPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [cognitiveProfile, setCognitiveProfile] = useState<UserCognitiveProfile | null>(null);

  // Questões de avaliação adaptativa
  const assessmentQuestions: AssessmentQuestion[] = [
    {
      id: 'q1',
      type: 'multiple_choice',
      difficulty: 'easy',
      question: 'Qual é a capital do Brasil?',
      options: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
      correctAnswer: 'Brasília',
      timeLimit: 30,
      cognitiveDomain: 'memory'
    },
    {
      id: 'q2',
      type: 'pattern_recognition',
      difficulty: 'optimal',
      question: 'Complete a sequência: 2, 4, 8, 16, ?',
      options: ['24', '32', '18', '20'],
      correctAnswer: '32',
      timeLimit: 45,
      cognitiveDomain: 'problem_solving'
    },
    {
      id: 'q3',
      type: 'true_false',
      difficulty: 'easy',
      question: 'A Terra gira em torno do Sol.',
      options: ['Verdadeiro', 'Falso'],
      correctAnswer: 'Verdadeiro',
      timeLimit: 20,
      cognitiveDomain: 'attention'
    },
    {
      id: 'q4',
      type: 'multiple_choice',
      difficulty: 'challenging',
      question: 'Qual das seguintes opções representa melhor o conceito de "dificuldade desejável" na aprendizagem?',
      options: [
        'Material muito fácil que não desafia',
        'Material tão difícil que causa frustração',
        'Equilíbrio perfeito entre desafio e habilidade',
        'Material que exige memorização pura'
      ],
      correctAnswer: 'Equilíbrio perfeito entre desafio e habilidade',
      timeLimit: 60,
      cognitiveDomain: 'problem_solving'
    },
    {
      id: 'q5',
      type: 'memory_test',
      difficulty: 'optimal',
      question: 'Lembre-se desta sequência de palavras: maçã, cadeira, oceano, montanha, relógio. Qual era a terceira palavra?',
      options: ['maçã', 'cadeira', 'oceano', 'montanha'],
      correctAnswer: 'oceano',
      timeLimit: 40,
      cognitiveDomain: 'memory'
    }
  ];

  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / assessmentQuestions.length) * 100;

  useEffect(() => {
    if (currentQuestion && !startTime) {
      setStartTime(new Date());
      setTimeLeft(currentQuestion.timeLimit);
      setSelectedAnswer(null);
    }
  }, [currentQuestion, startTime]);

  useEffect(() => {
    if (timeLeft > 0 && startTime) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && startTime) {
      handleAnswer(null); // Tempo esgotado
    }
  }, [timeLeft, startTime]);

  const handleAnswer = (answer: string | number | null) => {
    if (!startTime || !currentQuestion) return;

    const responseTime = (new Date().getTime() - startTime.getTime()) / 1000;
    const correct = answer === currentQuestion.correctAnswer;

    const result: AssessmentResult = {
      questionId: currentQuestion.id,
      userAnswer: answer || '',
      correct,
      responseTime,
      difficulty: currentQuestion.difficulty,
      cognitiveDomain: currentQuestion.cognitiveDomain
    };

    setResults(prev => [...prev, result]);

    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setStartTime(null);
    } else {
      completeAssessment([...results, result]);
    }
  };

  const completeAssessment = async (finalResults: AssessmentResult[]) => {
    try {
      // Calcular métricas da avaliação
      const totalQuestions = finalResults.length;
      const correctAnswers = finalResults.filter(r => r.correct).length;
      const accuracy = correctAnswers / totalQuestions;

      const avgResponseTime = finalResults.reduce((sum, r) => sum + r.responseTime, 0) / totalQuestions;

      const difficultyDistribution = finalResults.reduce((acc, r) => {
        acc[r.difficulty] = (acc[r.difficulty] || 0) + 1;
        return acc;
      }, {} as Record<DifficultyLevel, number>);

      const cognitiveDomainPerformance = finalResults.reduce((acc, r) => {
        if (!acc[r.cognitiveDomain]) {
          acc[r.cognitiveDomain] = { correct: 0, total: 0 };
        }
        acc[r.cognitiveDomain].total++;
        if (r.correct) acc[r.cognitiveDomain].correct++;
        return acc;
      }, {} as Record<string, { correct: number; total: number }>);

      // Detectar padrões de erro
      const errorPatterns = {
        timeoutErrors: finalResults.filter(r => !r.correct && r.responseTime >= currentQuestion.timeLimit * 0.9).length,
        difficultyStruggles: finalResults.filter(r => !r.correct && r.difficulty === 'challenging').length,
        attentionLapses: finalResults.filter(r => r.cognitiveDomain === 'attention' && !r.correct).length,
        memoryIssues: finalResults.filter(r => r.cognitiveDomain === 'memory' && !r.correct).length
      };

      // Estimar span de atenção baseado em decaimento de performance
      const attentionDecay = calculateAttentionDecay(finalResults);

      const assessmentData = {
        accuracy,
        avgResponseTime,
        difficultyDistribution,
        cognitiveDomainPerformance,
        errorPatterns,
        sessionDuration: finalResults.reduce((sum, r) => sum + r.responseTime, 0),
        attentionDecay,
        // Simular dados para outros aspectos
        visualErrors: Math.floor(Math.random() * 3),
        auditoryErrors: Math.floor(Math.random() * 3),
        kinestheticErrors: Math.floor(Math.random() * 3),
        readingErrors: Math.floor(Math.random() * 3),
        taskSwitching: Math.random(),
        memoryLoad: Math.random(),
        processingSpeed: Math.random()
      };

      // Gerar perfil cognitivo
      const profile = await difficultyManager.assessUserProfile(user?.id || 'anonymous', assessmentData);
      setCognitiveProfile(profile);
      setIsComplete(true);

      // Salvar perfil no backend
      await fetch('/api/user/cognitive-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, assessmentResults: finalResults })
      });

      toast({
        title: "Avaliação Completa!",
        description: "Seu perfil de aprendizagem foi criado com sucesso.",
      });

    } catch (error) {
      console.error('Erro ao completar avaliação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível completar a avaliação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const calculateAttentionDecay = (results: AssessmentResult[]): number => {
    // Simular decaimento de atenção baseado em performance ao longo do tempo
    const firstHalf = results.slice(0, Math.floor(results.length / 2));
    const secondHalf = results.slice(Math.floor(results.length / 2));

    const firstHalfAccuracy = firstHalf.filter(r => r.correct).length / firstHalf.length;
    const secondHalfAccuracy = secondHalf.filter(r => r.correct).length / secondHalf.length;

    return Math.max(0, firstHalfAccuracy - secondHalfAccuracy);
  };

  const restartAssessment = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setTimeLeft(0);
    setResults([]);
    setStartTime(null);
    setIsComplete(false);
    setCognitiveProfile(null);
  };

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case 'very_easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'easy': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'optimal': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'challenging': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'very_challenging': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    }
  };

  const getDifficultyIcon = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case 'very_easy': return <Heart className="h-4 w-4" />;
      case 'easy': return <Target className="h-4 w-4" />;
      case 'optimal': return <Star className="h-4 w-4" />;
      case 'challenging': return <Zap className="h-4 w-4" />;
      case 'very_challenging': return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (isComplete && cognitiveProfile) {
    const correctCount = results.filter(r => r.correct).length;
    const totalQuestions = results.length;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Avaliação Completa!</h1>
          <p className="text-muted-foreground">
            Seu perfil de aprendizagem foi criado com sucesso
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Resultados Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Desempenho Geral
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{accuracy}%</div>
                <p className="text-sm text-muted-foreground">Taxa de Acerto</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{correctCount}</div>
                  <p className="text-xs text-muted-foreground">Corretas</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{totalQuestions - correctCount}</div>
                  <p className="text-xs text-muted-foreground">Incorretas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Perfil Cognitivo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Seu Perfil Cognitivo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dificuldade Baseline</span>
                  <Badge className={getDifficultyColor(cognitiveProfile.baselineDifficulty)}>
                    {getDifficultyIcon(cognitiveProfile.baselineDifficulty)}
                    <span className="ml-1 capitalize">{cognitiveProfile.baselineDifficulty.replace('_', ' ')}</span>
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Estilo de Aprendizado</span>
                  <Badge variant="outline" className="capitalize">
                    {cognitiveProfile.learningStyle}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Span de Atenção</span>
                  <span className="text-sm font-medium">{cognitiveProfile.attentionSpan} min</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Preferência de Desafio</span>
                  <span className="text-sm font-medium">{cognitiveProfile.preferredChallenge}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recomendações */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Recomendações Personalizadas
            </CardTitle>
            <CardDescription>
              Baseado no seu perfil, aqui estão algumas dicas para maximizar seu aprendizado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Seu Estilo de Aprendizado</h4>
                <p className="text-sm text-muted-foreground">
                  {cognitiveProfile.learningStyle === 'visual' && "Você aprende melhor com imagens e diagramas. Use flashcards visuais e mapas mentais."}
                  {cognitiveProfile.learningStyle === 'auditory' && "Você aprende melhor ouvindo. Grave-se lendo em voz alta e use áudios explicativos."}
                  {cognitiveProfile.learningStyle === 'kinesthetic' && "Você aprende melhor fazendo. Use exemplos práticos e exercícios interativos."}
                  {cognitiveProfile.learningStyle === 'reading' && "Você aprende melhor lendo. Foque em textos bem estruturados e anotações detalhadas."}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Dificuldade Ideal</h4>
                <p className="text-sm text-muted-foreground">
                  {cognitiveProfile.baselineDifficulty === 'very_easy' && "Comece com conteúdos básicos e aumente gradualmente a complexidade."}
                  {cognitiveProfile.baselineDifficulty === 'easy' && "Materiais de nível intermediário são ideais para você."}
                  {cognitiveProfile.baselineDifficulty === 'optimal' && "Você se sai bem com desafios equilibrados - continue assim!"}
                  {cognitiveProfile.baselineDifficulty === 'challenging' && "Conteúdos avançados são perfeitos para manter seu engajamento."}
                  {cognitiveProfile.baselineDifficulty === 'very_challenging' && "Você prospera com os maiores desafios - busque materiais experts."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Button onClick={restartAssessment} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Refazer Avaliação
          </Button>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowRight className="h-4 w-4 mr-2" />
            Ir para Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Avaliação Cognitiva</h1>
        <p className="text-muted-foreground mb-4">
          Vamos descobrir seu perfil de aprendizagem para personalizar sua experiência
        </p>

        <div className="flex items-center justify-center gap-4 mb-4">
          <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
            {getDifficultyIcon(currentQuestion.difficulty)}
            <span className="ml-1 capitalize">{currentQuestion.difficulty.replace('_', ' ')}</span>
          </Badge>
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            {timeLeft}s
          </Badge>
        </div>

        <Progress value={progress} className="w-full max-w-md mx-auto" />
        <p className="text-sm text-muted-foreground mt-2">
          Questão {currentQuestionIndex + 1} de {assessmentQuestions.length}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === option ? "default" : "outline"}
                className="w-full justify-start text-left h-auto p-4"
                onClick={() => setSelectedAnswer(option)}
                disabled={timeLeft === 0}
              >
                <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-muted-foreground">
              Tempo restante: <span className={timeLeft < 10 ? "text-red-500 font-bold" : ""}>{timeLeft}s</span>
            </div>

            <Button
              onClick={() => handleAnswer(selectedAnswer)}
              disabled={selectedAnswer === null || timeLeft === 0}
            >
              {timeLeft === 0 ? "Tempo Esgotado" : "Responder"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Esta avaliação ajuda a personalizar seu aprendizado para máxima retenção
        </p>
      </div>
    </div>
  );
}

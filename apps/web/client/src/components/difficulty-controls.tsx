import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { difficultyManager, type DifficultyLevel } from "@/lib/difficulty-manager";
import {
  Brain,
  Target,
  Zap,
  Heart,
  Star,
  AlertCircle,
  TrendingUp,
  Settings,
  Lightbulb,
  Gauge,
  Clock,
  Eye
} from "lucide-react";

interface DifficultyControlsProps {
  onDifficultyChange?: (difficulty: DifficultyLevel) => void;
  onAdaptiveModeChange?: (enabled: boolean) => void;
  onChallengePreferenceChange?: (level: number) => void;
  currentDifficulty?: DifficultyLevel;
  adaptiveMode?: boolean;
  challengePreference?: number;
  showAdvanced?: boolean;
}

export function DifficultyControls({
  onDifficultyChange,
  onAdaptiveModeChange,
  onChallengePreferenceChange,
  currentDifficulty = 'optimal',
  adaptiveMode = true,
  challengePreference = 70,
  showAdvanced = false
}: DifficultyControlsProps) {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(currentDifficulty);
  const [adaptive, setAdaptive] = useState(adaptiveMode);
  const [challengeLevel, setChallengeLevel] = useState(challengePreference);
  const [showAdvancedControls, setShowAdvancedControls] = useState(showAdvanced);

  useEffect(() => {
    setDifficulty(currentDifficulty);
  }, [currentDifficulty]);

  useEffect(() => {
    setAdaptive(adaptiveMode);
  }, [adaptiveMode]);

  useEffect(() => {
    setChallengeLevel(challengePreference);
  }, [challengePreference]);

  const handleDifficultyChange = (newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);
    onDifficultyChange?.(newDifficulty);
  };

  const handleAdaptiveToggle = (enabled: boolean) => {
    setAdaptive(enabled);
    onAdaptiveModeChange?.(enabled);
  };

  const handleChallengeChange = (value: number[]) => {
    const newLevel = value[0];
    setChallengeLevel(newLevel);
    onChallengePreferenceChange?.(newLevel);
  };

  const getDifficultyColor = (level: DifficultyLevel) => {
    switch (level) {
      case 'very_easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'easy': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'optimal': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'challenging': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'very_challenging': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    }
  };

  const getDifficultyIcon = (level: DifficultyLevel) => {
    switch (level) {
      case 'very_easy': return <Heart className="h-4 w-4" />;
      case 'easy': return <Target className="h-4 w-4" />;
      case 'optimal': return <Star className="h-4 w-4" />;
      case 'challenging': return <Zap className="h-4 w-4" />;
      case 'very_challenging': return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getChallengeLevelDescription = (level: number) => {
    if (level < 30) return "Muito Fácil - Foco em reforço básico";
    if (level < 50) return "Fácil - Aprendizado gradual";
    if (level < 70) return "Equilibrado - Desafio ideal";
    if (level < 90) return "Desafiador - Alto engajamento";
    return "Muito Desafiador - Máximo aprendizado";
  };

  const difficultyOptions: { value: DifficultyLevel; label: string; description: string }[] = [
    {
      value: 'very_easy',
      label: 'Muito Fácil',
      description: 'Ideal para iniciantes ou revisão básica'
    },
    {
      value: 'easy',
      label: 'Fácil',
      description: 'Aprendizado gradual com pouco desafio'
    },
    {
      value: 'optimal',
      label: 'Ideal',
      description: 'Equilíbrio perfeito entre desafio e habilidade'
    },
    {
      value: 'challenging',
      label: 'Desafiador',
      description: 'Alto engajamento com dificuldade moderada'
    },
    {
      value: 'very_challenging',
      label: 'Muito Desafiador',
      description: 'Máximo aprendizado através de desafio intenso'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Controle de Dificuldade Desejável
        </CardTitle>
        <CardDescription>
          Ajuste o nível de desafio para maximizar sua retenção de longo prazo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Modo Adaptativo */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Modo Adaptativo
            </Label>
            <p className="text-sm text-muted-foreground">
              Sistema ajusta automaticamente a dificuldade baseada no seu desempenho
            </p>
          </div>
          <Switch
            checked={adaptive}
            onCheckedChange={handleAdaptiveToggle}
          />
        </div>

        {!adaptive && (
          /* Seleção Manual de Dificuldade */
          <div className="space-y-3">
            <Label>Dificuldade Manual</Label>
            <Select value={difficulty} onValueChange={handleDifficultyChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficultyOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {getDifficultyIcon(option.value)}
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(difficulty)}>
                {getDifficultyIcon(difficulty)}
                <span className="ml-1 capitalize">{difficulty.replace('_', ' ')}</span>
              </Badge>
            </div>
          </div>
        )}

        {/* Controle de Preferência de Desafio */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Nível de Desafio Preferido
          </Label>
          <div className="px-3">
            <Slider
              value={[challengeLevel]}
              onValueChange={handleChallengeChange}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Conservador</span>
            <Badge variant="outline">{challengeLevel}%</Badge>
            <span className="text-muted-foreground">Agressivo</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {getChallengeLevelDescription(challengeLevel)}
          </p>
        </div>

        {/* Toggle Controles Avançados */}
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Controles Avançados
          </Label>
          <Switch
            checked={showAdvancedControls}
            onCheckedChange={setShowAdvancedControls}
          />
        </div>

        {/* Controles Avançados */}
        {showAdvancedControls && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Configurações Avançadas
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Estilo de Aprendizado</Label>
                <Select defaultValue="adaptive">
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adaptive">Adaptativo (Recomendado)</SelectItem>
                    <SelectItem value="visual">Visual</SelectItem>
                    <SelectItem value="auditory">Auditivo</SelectItem>
                    <SelectItem value="kinesthetic">Cinestésico</SelectItem>
                    <SelectItem value="reading">Leitura</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Duração da Sessão</Label>
                <Select defaultValue="25">
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="25">25 minutos</SelectItem>
                    <SelectItem value="45">45 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Frequência de Avaliação</Label>
                <Select defaultValue="auto">
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Automática</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="session">Por Sessão</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Feedback em Tempo Real</Label>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">Zona de Fluxo Atual</span>
              <Badge className={getDifficultyColor(difficulty)}>
                {getDifficultyIcon(difficulty)}
                <span className="ml-1 capitalize">{difficulty.replace('_', ' ')}</span>
              </Badge>
            </div>
          </div>
        )}

        {/* Informações Educacionais */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">
                Sobre Dificuldade Desejável
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Baseado em neuroaprendizagem, este sistema mantém você na "zona proximal de desenvolvimento"
                onde o material é desafiador o suficiente para ser interessante, mas não tão difícil que cause frustração.
                Estudos mostram que isso aumenta a retenção em até 50%.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente de status da dificuldade atual
export function DifficultyStatus({ currentLevel, engagementScore, frustrationLevel }: {
  currentLevel: DifficultyLevel;
  engagementScore: number;
  frustrationLevel: number;
}) {
  const getStatusColor = () => {
    if (engagementScore > 80 && frustrationLevel < 20) {
      return 'text-green-600 dark:text-green-400';
    } else if (frustrationLevel > 40) {
      return 'text-red-600 dark:text-red-400';
    } else {
      return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  const getStatusMessage = () => {
    if (engagementScore > 80 && frustrationLevel < 20) {
      return 'Estado de fluxo - aprendizado ótimo!';
    } else if (frustrationLevel > 40) {
      return 'Muito desafiador - reduzindo dificuldade...';
    } else if (engagementScore < 60) {
      return 'Pouco engajamento - aumentando desafio...';
    } else {
      return 'Equilibrado - mantendo ritmo atual';
    }
  };

  return (
    <div className={`flex items-center gap-2 text-sm ${getStatusColor()}`}>
      <Brain className="h-4 w-4" />
      <span>{getStatusMessage()}</span>
    </div>
  );
}

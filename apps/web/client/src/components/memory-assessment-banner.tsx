import React, { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Brain,
  AlertCircle,
  CheckCircle,
  X,
  TrendingUp,
  Clock,
  Target
} from "lucide-react";

interface MemoryAssessmentBannerProps {
  onStartAssessment: () => void;
  onDismiss: () => void;
  className?: string;
}

export function MemoryAssessmentBanner({
  onStartAssessment,
  onDismiss,
  className = ""
}: MemoryAssessmentBannerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(true);

  const dismissMutation = useMutation({
    mutationFn: async () => {
      // Store dismissal preference (could be stored in user preferences)
      localStorage.setItem(`memory-assessment-dismissed-${user?.id}`, 'true');
    },
    onSuccess: () => {
      setIsVisible(false);
      onDismiss();
    }
  });

  const handleDismiss = () => {
    dismissMutation.mutate();
  };

  const handleStartAssessment = () => {
    setIsVisible(false);
    onStartAssessment();
  };

  if (!user || user.memoryType || !isVisible) {
    return null;
  }

  return (
    <Card className={`border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-primary/10 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Brain className="h-6 w-6 text-primary" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Personalize sua Experiência de Aprendizado
                </h3>
                <Badge variant="secondary" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  2 min
                </Badge>
              </div>

              <p className="text-muted-foreground max-w-2xl">
                Complete uma avaliação rápida de memória para personalizar seu algoritmo de aprendizado.
                Isso nos ajuda a ajustar intervalos de revisão e dificuldade para maximizar sua retenção.
              </p>

              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <span>Avaliação de 4 perguntas</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>Melhora retenção em até 50%</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4" />
                  <span>Personalização automática</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              disabled={dismissMutation.isPending}
            >
              <X className="h-4 w-4 mr-1" />
              Agora não
            </Button>

            <Button
              onClick={handleStartAssessment}
              className="bg-primary hover:bg-primary/90"
            >
              <Brain className="h-4 w-4 mr-2" />
              Fazer Avaliação
            </Button>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Por que isso importa?</span>
            <span className="text-xs">
              Usuários que fazem a avaliação têm 50% mais retenção de conteúdo
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook para gerenciar estado da avaliação de memória
export function useMemoryAssessmentBanner() {
  const { user } = useAuth();
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);

  const shouldShowBanner = user && !user.memoryType && !localStorage.getItem(`memory-assessment-dismissed-${user.id}`);

  const handleStartAssessment = () => {
    setShowAssessmentModal(true);
  };

  const handleDismiss = () => {
    // Banner será automaticamente oculto
  };

  const handleAssessmentComplete = () => {
    setShowAssessmentModal(false);
    // O banner será automaticamente oculto quando user.memoryType for definido
  };

  return {
    showBanner: !!shouldShowBanner,
    showAssessmentModal,
    onStartAssessment: handleStartAssessment,
    onDismiss: handleDismiss,
    onAssessmentComplete: handleAssessmentComplete
  };
}

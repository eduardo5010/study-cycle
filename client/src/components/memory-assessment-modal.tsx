import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  Brain,
  CheckCircle,
  X,
  AlertCircle
} from "lucide-react";

interface MemoryOption {
  value: 'good' | 'average' | 'poor';
  label: string;
  description: string;
  lambda: number;
  color: string;
  details: string;
}

interface MemoryAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (memoryType: 'good' | 'average' | 'poor') => void;
}

export default function MemoryAssessmentModal({ isOpen, onClose, onComplete }: MemoryAssessmentModalProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedMemoryType, setSelectedMemoryType] = useState<'good' | 'average' | 'poor' | null>(null);

  const questions = [
    {
      id: 'q1',
      question: 'How often do you need to review material to remember it?',
      options: [
        { value: 'rarely', label: 'Rarely - once or twice is enough', points: 3 },
        { value: 'sometimes', label: 'Sometimes - a few times', points: 2 },
        { value: 'often', label: 'Often - many times', points: 1 }
      ]
    },
    {
      id: 'q2',
      question: 'How long does it take you to learn new concepts?',
      options: [
        { value: 'quick', label: 'Quick - I pick up things fast', points: 3 },
        { value: 'moderate', label: 'Moderate - takes some time', points: 2 },
        { value: 'slow', label: 'Slow - takes a lot of repetition', points: 1 }
      ]
    },
    {
      id: 'q3',
      question: 'How well do you remember information from a week ago?',
      options: [
        { value: 'excellent', label: 'Excellent - most details', points: 3 },
        { value: 'good', label: 'Good - main points', points: 2 },
        { value: 'poor', label: 'Poor - very little', points: 1 }
      ]
    },
    {
      id: 'q4',
      question: 'How do you perform on surprise quizzes?',
      options: [
        { value: 'excellent', label: 'Excellent - I usually do well', points: 3 },
        { value: 'average', label: 'Average - hit or miss', points: 2 },
        { value: 'poor', label: 'Poor - I struggle', points: 1 }
      ]
    }
  ];

  const memoryTypes: Record<'good' | 'average' | 'poor', MemoryOption> = {
    good: {
      value: 'good',
      label: 'Good Memory',
      description: 'You can easily remember information after studying once or twice',
      lambda: 0.2,
      color: 'text-green-600',
      details: 'Your learning algorithm will space reviews further apart, optimizing for efficient learners.'
    },
    average: {
      value: 'average',
      label: 'Average Memory',
      description: 'You need to review information several times to remember it well',
      lambda: 0.4,
      color: 'text-yellow-600',
      details: 'Your learning algorithm will use standard spacing for balanced review intervals.'
    },
    poor: {
      value: 'poor',
      label: 'Poor Memory',
      description: 'You struggle to remember information and need frequent reviews',
      lambda: 0.8,
      color: 'text-red-600',
      details: 'Your learning algorithm will schedule more frequent reviews to help you retain information.'
    }
  };

  const calculateMemoryType = (answers: Record<string, string>): 'good' | 'average' | 'poor' => {
    const totalPoints = Object.values(answers).reduce((sum, answer) => {
      const question = questions.find(q => q.id === Object.keys(answers).find(k => answers[k] === answer));
      const option = question?.options.find(opt => opt.value === answer);
      return sum + (option?.points || 0);
    }, 0);

    if (totalPoints >= 10) return 'good';
    if (totalPoints >= 6) return 'average';
    return 'poor';
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      const memoryType = calculateMemoryType(answers);
      setSelectedMemoryType(memoryType);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    if (selectedMemoryType) {
      onComplete(selectedMemoryType);
      onClose();
    }
  };

  const currentQuestion = questions[currentStep - 1];
  const progress = (currentStep / (questions.length + 1)) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Memory Assessment</CardTitle>
                <CardDescription>
                  Help us personalize your learning experience. You can change this later in Settings.
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep <= questions.length ? (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">
                  Question {currentStep} of {questions.length}
                </h3>
                <p className="text-muted-foreground">
                  {currentQuestion.question}
                </p>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(currentQuestion.id, option.value)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all hover:border-primary/50 ${
                      answers[currentQuestion.id] === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        answers[currentQuestion.id] === option.value
                          ? 'bg-primary border-primary'
                          : 'border-muted-foreground'
                      }`} />
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id]}
                >
                  {currentStep === questions.length ? 'See Results' : 'Next'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Assessment Complete!</h3>
                <p className="text-muted-foreground">
                  Based on your answers, we've determined your memory type.
                </p>
              </div>

              {selectedMemoryType && (
                <Card className="border-2 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        {memoryTypes[selectedMemoryType].label}
                      </Badge>
                      <p className="text-muted-foreground">
                        {memoryTypes[selectedMemoryType].description}
                      </p>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm">
                          {memoryTypes[selectedMemoryType].details}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          λ = {memoryTypes[selectedMemoryType].lambda}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => {
                  setCurrentStep(1);
                  setAnswers({});
                  setSelectedMemoryType(null);
                }}>
                  Retake Assessment
                </Button>
                <Button onClick={handleComplete}>
                  Apply Settings
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

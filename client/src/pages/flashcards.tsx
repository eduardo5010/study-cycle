import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  RotateCcw,
  CheckCircle,
  XCircle,
  BookOpen,
  Brain,
  Target,
  Clock,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Eye,
  EyeOff,
  Shuffle,
  Star,
  TrendingUp,
  Zap
} from "lucide-react";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  type: 'text' | 'image' | 'audio' | 'video';
  subjectId: string;
  subjectName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  lastReviewed?: Date;
  nextReview?: Date;
  easeFactor: number;
  interval: number;
  repetitions: number;
  mediaUrl?: string;
}

interface StudySession {
  currentCard: Flashcard | null;
  totalCards: number;
  studiedCards: number;
  correctAnswers: number;
  incorrectAnswers: number;
  sessionStart: Date;
  timeSpent: number;
}

export default function FlashcardsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const [currentSession, setCurrentSession] = useState<StudySession>({
    currentCard: null,
    totalCards: 0,
    studiedCards: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    sessionStart: new Date(),
    timeSpent: 0
  });

  const [showAnswer, setShowAnswer] = useState(false);
  const [studyMode, setStudyMode] = useState<'review' | 'learn' | 'practice'>('review');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  // Mock flashcards data - in real app, this would come from API
  const [flashcards] = useState<Flashcard[]>([
    {
      id: "1",
      front: "What is the capital of France?",
      back: "Paris",
      type: "text",
      subjectId: "geography",
      subjectName: "Geography",
      difficulty: "easy",
      tags: ["capitals", "europe"],
      easeFactor: 2.5,
      interval: 1,
      repetitions: 2
    },
    {
      id: "2",
      front: "What is Newton's Second Law?",
      back: "F = ma (Force equals mass times acceleration)",
      type: "text",
      subjectId: "physics",
      subjectName: "Physics",
      difficulty: "medium",
      tags: ["laws", "mechanics"],
      easeFactor: 2.3,
      interval: 3,
      repetitions: 1
    },
    {
      id: "3",
      front: "What is the derivative of x²?",
      back: "2x",
      type: "text",
      subjectId: "math",
      subjectName: "Mathematics",
      difficulty: "medium",
      tags: ["calculus", "derivatives"],
      easeFactor: 2.7,
      interval: 6,
      repetitions: 3
    },
    {
      id: "4",
      front: "What is the powerhouse of the cell?",
      back: "Mitochondria",
      type: "text",
      subjectId: "biology",
      subjectName: "Biology",
      difficulty: "easy",
      tags: ["cell", "organelles"],
      easeFactor: 2.8,
      interval: 12,
      repetitions: 4
    },
    {
      id: "5",
      front: "What is the formula for the area of a circle?",
      back: "A = πr²",
      type: "text",
      subjectId: "math",
      subjectName: "Mathematics",
      difficulty: "easy",
      tags: ["geometry", "area"],
      easeFactor: 2.9,
      interval: 25,
      repetitions: 5
    }
  ]);

  // Filter cards based on study mode and subject
  const getFilteredCards = () => {
    let cards = flashcards;

    // Filter by subject
    if (selectedSubject !== 'all') {
      cards = cards.filter(card => card.subjectId === selectedSubject);
    }

    // Filter by study mode
    switch (studyMode) {
      case 'review':
        // Cards due for review (simplified - in real app, check nextReview date)
        cards = cards.filter(card => card.repetitions > 0);
        break;
      case 'learn':
        // New cards (never reviewed)
        cards = cards.filter(card => card.repetitions === 0);
        break;
      case 'practice':
        // All cards for practice
        break;
    }

    return cards;
  };

  const filteredCards = getFilteredCards();
  const progressPercentage = filteredCards.length > 0
    ? (currentSession.studiedCards / filteredCards.length) * 100
    : 0;

  useEffect(() => {
    if (filteredCards.length > 0 && !currentSession.currentCard) {
      setCurrentSession(prev => ({
        ...prev,
        currentCard: filteredCards[0],
        totalCards: filteredCards.length
      }));
    }
  }, [filteredCards, currentSession.currentCard]);

  const handleAnswer = (correct: boolean) => {
    if (!currentSession.currentCard) return;

    const card = currentSession.currentCard;
    let newEaseFactor = card.easeFactor;
    let newInterval = card.interval;
    let newRepetitions = card.repetitions;

    if (correct) {
      // Correct answer - increase interval
      if (newRepetitions === 0) {
        newInterval = 1;
      } else if (newRepetitions === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(card.interval * card.easeFactor);
      }
      newEaseFactor = Math.max(1.3, card.easeFactor + 0.1);
      newRepetitions += 1;
    } else {
      // Incorrect answer - reset progress
      newInterval = 1;
      newEaseFactor = Math.max(1.3, card.easeFactor - 0.2);
      newRepetitions = 0;
    }

    // Move to next card
    const currentIndex = filteredCards.findIndex(c => c.id === card.id);
    const nextCard = filteredCards[currentIndex + 1] || null;

    setCurrentSession(prev => {
      const newSession = {
        ...prev,
        currentCard: nextCard,
        studiedCards: prev.studiedCards + 1,
        correctAnswers: correct ? prev.correctAnswers + 1 : prev.correctAnswers,
        incorrectAnswers: correct ? prev.incorrectAnswers : prev.incorrectAnswers + 1
      };

      if (!nextCard) {
        // Session complete
        setTimeout(() => {
          toast({
            title: "Study session completed!",
            description: `You reviewed ${newSession.studiedCards} cards. Great job!`
          });
        }, 100);
      }

      return newSession;
    });

    setShowAnswer(false);
  };

  const handleShuffle = () => {
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
    setCurrentSession(prev => ({
      ...prev,
      currentCard: shuffled[0] || null
    }));
    setShowAnswer(false);
  };

  const subjects = [
    { id: 'all', name: 'All Subjects' },
    { id: 'math', name: 'Mathematics' },
    { id: 'physics', name: 'Physics' },
    { id: 'biology', name: 'Biology' },
    { id: 'geography', name: 'Geography' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Brain className="h-8 w-8" />
          Flashcards
        </h1>
        <p className="text-muted-foreground">
          Master concepts with spaced repetition learning
        </p>
      </div>

      {/* Study Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Study Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant={studyMode === 'review' ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setStudyMode('review')}
              >
                <Target className="h-4 w-4 mr-2" />
                Review
              </Button>
              <Button
                variant={studyMode === 'learn' ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setStudyMode('learn')}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Learn New
              </Button>
              <Button
                variant={studyMode === 'practice' ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setStudyMode('practice')}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Practice
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {subjects.map(subject => (
                <Button
                  key={subject.id}
                  variant={selectedSubject === subject.id ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setSelectedSubject(subject.id)}
                >
                  {subject.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Session Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {currentSession.correctAnswers + currentSession.incorrectAnswers}
              </div>
              <div className="text-sm text-muted-foreground">Cards Studied</div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-green-600">{currentSession.correctAnswers}</div>
                <div className="text-xs text-muted-foreground">Correct</div>
              </div>
              <div>
                <div className="text-xl font-bold text-red-600">{currentSession.incorrectAnswers}</div>
                <div className="text-xs text-muted-foreground">Incorrect</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flashcard Display */}
      {currentSession.currentCard ? (
        <div className="max-w-2xl mx-auto">
          <Card className="min-h-[400px] flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{currentSession.currentCard.subjectName}</Badge>
                  <Badge variant={
                    currentSession.currentCard.difficulty === 'easy' ? 'default' :
                    currentSession.currentCard.difficulty === 'medium' ? 'secondary' : 'destructive'
                  }>
                    {currentSession.currentCard.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleShuffle}>
                    <Shuffle className="h-4 w-4" />
                  </Button>
                  {currentSession.currentCard.type === 'audio' && (
                    <Button variant="ghost" size="sm">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-center">
              <div className="text-center space-y-6">
                {/* Front of card */}
                <div className="min-h-[150px] flex items-center justify-center">
                  <div className="text-xl font-medium leading-relaxed max-w-md">
                    {currentSession.currentCard.front}
                  </div>
                </div>

                {/* Show Answer Button */}
                {!showAnswer && (
                  <Button onClick={() => setShowAnswer(true)} size="lg">
                    <Eye className="h-5 w-5 mr-2" />
                    Show Answer
                  </Button>
                )}

                {/* Back of card */}
                {showAnswer && (
                  <div className="space-y-4">
                    <div className="min-h-[100px] flex items-center justify-center p-6 bg-muted/50 rounded-lg">
                      <div className="text-lg font-medium text-primary max-w-md">
                        {currentSession.currentCard.back}
                      </div>
                    </div>

                    <div className="flex gap-3 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => handleAnswer(false)}
                        className="flex items-center gap-2"
                      >
                        <XCircle className="h-5 w-5 text-red-500" />
                        Again
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleAnswer(false)}
                        className="flex items-center gap-2"
                      >
                        <Clock className="h-5 w-5 text-yellow-500" />
                        Hard
                      </Button>
                      <Button
                        onClick={() => handleAnswer(true)}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Good
                      </Button>
                      <Button
                        onClick={() => handleAnswer(true)}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
                      >
                        <Star className="h-5 w-5" />
                        Easy
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>

            <div className="p-4 border-t">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Card {currentSession.studiedCards + 1} of {currentSession.totalCards}</span>
                <div className="flex gap-2">
                  {currentSession.currentCard.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {filteredCards.length === 0 ? "No cards available" : "Session Complete!"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {filteredCards.length === 0
                ? "No flashcards match your current filters. Try changing the subject or study mode."
                : `Great job! You've completed your study session. You got ${currentSession.correctAnswers} out of ${currentSession.studiedCards} cards correct.`
              }
            </p>
            {filteredCards.length > 0 && (
              <div className="flex gap-3 justify-center">
                <Button onClick={() => window.location.reload()}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Study Again
                </Button>
                <Button variant="outline" onClick={() => setStudyMode('practice')}>
                  <Target className="h-4 w-4 mr-2" />
                  Practice Mode
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="mt-8 flex justify-center gap-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <Button variant="outline">
          <TrendingUp className="h-4 w-4 mr-2" />
          View Statistics
        </Button>
      </div>
    </div>
  );
}

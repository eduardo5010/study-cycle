import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Target, TrendingUp, Clock, BookOpen, Lightbulb, Zap, AlertCircle } from "lucide-react";
import { SpacedReviewEngine, MemoryProfile } from "@/lib/spaced-review-engine";
import type { GamificationStats } from "@shared/schema";
import { Link } from "wouter";

interface PersonalizedStudyRecommendationsProps {
  userId: string;
}

export default function PersonalizedStudyRecommendations({ userId }: PersonalizedStudyRecommendationsProps) {
  // Initialize Spaced Review Engine
  const [spacedReviewEngine] = React.useState(() => new SpacedReviewEngine());

  // Fetch user profile for memory settings
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: [`user-profile-${userId}`],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/user/profile/${userId}`);
        if (!response.ok) return null;
        return await response.json();
      } catch (error) {
        console.error("Failed to get user profile:", error);
        return null;
      }
    },
    enabled: !!userId,
  });

  // Fetch gamification data
  const { data: gamificationData } = useQuery<GamificationStats>({
    queryKey: [`/api/gamification/${userId}`],
    enabled: !!userId,
  });

  // Generate personalized recommendations based on Spaced Review Engine
  const { data: recommendations, isLoading: recsLoading } = useQuery({
    queryKey: [`spaced-recommendations-${userId}`],
    queryFn: async () => {
      if (!userProfile) return [];

      const recommendations = [];

      // Memory profile specific recommendations
      if (userProfile.pUsuario === MemoryProfile.GOOD) {
        recommendations.push("🎯 Your excellent memory allows for longer study intervals. Focus on challenging material!");
      } else if (userProfile.pUsuario === MemoryProfile.POOR) {
        recommendations.push("📚 Regular reviews are crucial for your learning style. Stay consistent!");
      } else if (userProfile.pUsuario === MemoryProfile.TERRIBLE) {
        recommendations.push("⚡ Frequent, short study sessions work best for your memory type.");
      }

      // Performance-based recommendations
      if (gamificationData) {
        if (gamificationData.stats.averageAccuracy < 0.7) {
          recommendations.push("📖 Focus on understanding core concepts before moving to advanced topics.");
        } else if (gamificationData.stats.averageAccuracy > 0.9) {
          recommendations.push("🚀 You're performing excellently! Try tackling more challenging material.");
        }

        if (gamificationData.streak.current === 0) {
          recommendations.push("🔥 Start a daily study streak to build consistency and improve retention.");
        } else if (gamificationData.streak.current >= 7) {
          recommendations.push("🌟 Amazing! Your study streak is strengthening your long-term memory.");
        }
      }

      // Time-based recommendations
      const currentHour = new Date().getHours();
      if (currentHour >= 6 && currentHour <= 12) {
        recommendations.push("🌅 Morning studies enhance memory consolidation. Great time to review!");
      } else if (currentHour >= 20 || currentHour <= 2) {
        recommendations.push("🌙 Evening reviews help transfer learning to long-term memory during sleep.");
      }

      return recommendations;
    },
    enabled: !!userId && !!userProfile,
  });

  // Generate study insights using Spaced Review Engine
  const { data: studyInsights, isLoading: insightsLoading } = useQuery({
    queryKey: [`study-insights-${userId}`],
    queryFn: async () => {
      const insights = {
        optimalStudyTime: "2-3 hours daily",
        bestIntervals: "45-90 minutes with breaks",
        recommendedDifficulty: "adaptive",
        memoryStrength: "calculating...",
      };

      if (userProfile) {
        // Calculate optimal study time based on memory profile
        if (userProfile.pUsuario === MemoryProfile.GOOD) {
          insights.optimalStudyTime = "1.5-2 hours daily";
          insights.bestIntervals = "60-120 minutes with breaks";
          insights.memoryStrength = "Excellent - Long intervals optimal";
        } else if (userProfile.pUsuario === MemoryProfile.POOR) {
          insights.optimalStudyTime = "2-3 hours daily";
          insights.bestIntervals = "30-60 minutes with breaks";
          insights.memoryStrength = "Good - Regular reviews needed";
        } else {
          insights.optimalStudyTime = "3-4 hours daily";
          insights.bestIntervals = "20-45 minutes with frequent breaks";
          insights.memoryStrength = "Needs support - Frequent reviews essential";
        }

        // Performance-based insights
        if (gamificationData) {
          const accuracy = gamificationData.stats.averageAccuracy;
          if (accuracy > 0.85) {
            insights.recommendedDifficulty = "increase challenge";
          } else if (accuracy < 0.65) {
            insights.recommendedDifficulty = "focus on fundamentals";
          } else {
            insights.recommendedDifficulty = "maintain current level";
          }
        }
      }

      return insights;
    },
    enabled: !!userId && !!userProfile,
  });

  if (profileLoading || recsLoading || insightsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI-Powered Study Recommendations
          </CardTitle>
          <CardDescription>Analyzing your learning patterns with advanced algorithms...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Memory Profile Status */}
      {userProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Your Memory Profile
            </CardTitle>
            <CardDescription>
              AI-analyzed learning preferences and optimal study patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg">
                <div className="text-2xl mb-2">
                  {userProfile.pUsuario === MemoryProfile.GOOD ? "🧠" :
                   userProfile.pUsuario === MemoryProfile.POOR ? "📚" : "⚡"}
                </div>
                <div className="font-medium">
                  {userProfile.pUsuario === MemoryProfile.GOOD ? "Excellent Memory" :
                   userProfile.pUsuario === MemoryProfile.POOR ? "Good Memory" : "Needs Frequent Review"}
                </div>
                <Badge variant="outline" className="mt-2">
                  {userProfile.pUsuario}x retention factor
                </Badge>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg">
                <div className="text-2xl mb-2">📊</div>
                <div className="font-medium">Performance Score</div>
                <div className="text-lg font-bold text-green-600">
                  {(userProfile.performanceMedia * 100).toFixed(0)}%
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-medium">AI Confidence</div>
                <div className="text-lg font-bold text-purple-600">
                  {(userProfile.beta * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Study Insights */}
      {studyInsights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              AI Study Insights
            </CardTitle>
            <CardDescription>
              Personalized recommendations based on your memory profile and performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Optimal Study Time
                </h4>
                <p className="text-2xl font-bold text-blue-600">{studyInsights.optimalStudyTime}</p>
                <p className="text-sm text-muted-foreground">{studyInsights.bestIntervals}</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Recommended Difficulty
                </h4>
                <p className="text-2xl font-bold text-green-600 capitalize">{studyInsights.recommendedDifficulty}</p>
                <p className="text-sm text-muted-foreground">{studyInsights.memoryStrength}</p>
              </div>
            </div>

            {gamificationData && (
              <div className="pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-orange-600">{gamificationData.streak.current}</div>
                    <div className="text-xs text-muted-foreground">Day Streak</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-blue-600">
                      {(gamificationData.stats.averageAccuracy * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-600">{gamificationData.stats.flashcardsReviewed}</div>
                    <div className="text-xs text-muted-foreground">Cards Reviewed</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-purple-600">{gamificationData.stats.subjectsMastered}</div>
                    <div className="text-xs text-muted-foreground">Subjects Done</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Study Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Smart Study Recommendations
            </CardTitle>
            <CardDescription>
              AI-powered suggestions optimized for your learning style
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-lg mt-0.5">{recommendation.split(' ')[0]}</div>
                  <p className="text-sm leading-relaxed">{recommendation.substring(recommendation.indexOf(' ') + 1)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Algorithm Status */}
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <Zap className="h-5 w-5" />
            Spaced Review Engine Active
          </CardTitle>
          <CardDescription>
            Advanced algorithm continuously optimizing your learning intervals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <div className="text-lg font-bold text-green-600">Ebbinghaus</div>
              <div className="text-xs text-muted-foreground">Forgetting Curve</div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <div className="text-lg font-bold text-blue-600">ML-Powered</div>
              <div className="text-xs text-muted-foreground">Personalized Coefficients</div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <div className="text-lg font-bold text-purple-600">Adaptive</div>
              <div className="text-xs text-muted-foreground">Real-time Optimization</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Quick Study Actions
          </CardTitle>
          <CardDescription>
            Start your AI-optimized learning session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button asChild className="justify-start bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Link href="/flashcards">
                <Zap className="h-4 w-4 mr-2" />
                Start AI Review Session
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <Link href="/ai-flashcards">
                <Brain className="h-4 w-4 mr-2" />
                Generate Smart Cards
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <Link href="/settings">
                <Target className="h-4 w-4 mr-2" />
                Adjust Memory Profile
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <Link href="/cognitive-assessment">
                <AlertCircle className="h-4 w-4 mr-2" />
                Retake Assessment
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

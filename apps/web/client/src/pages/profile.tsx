import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  User,
  BookOpen,
  GraduationCap,
  Trophy,
  Star,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  Users,
  MessageSquare,
  Heart,
  Zap,
  Target,
  Brain,
  ArrowLeft,
  Edit3,
  Plus,
  Play,
  Eye,
  ThumbsUp,
  Share2,
  Bookmark,
  ExternalLink,
  CheckCircle
} from "lucide-react";

export default function PublicProfilePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for demonstration - in real app, this would come from API based on user ID
  const profileData = {
    id: user?.id || "user-123",
    name: user?.name || "João Silva",
    email: user?.email || "joao@example.com",
    bio: "Estudante apaixonado por tecnologia e desenvolvimento de software. Sempre buscando aprender e compartilhar conhecimento.",
    avatar: null,
    coverImage: null,
    location: "São Paulo, SP",
    joinedAt: "2024-01-15",
    isTeacher: user?.isTeacher || false,
    isVerified: false,

    // Student stats
    studentStats: {
      totalStudyHours: 245,
      currentStreak: 12,
      completedSubjects: 8,
      totalFlashcards: 1240,
      averageScore: 87,
      achievements: 15,
      level: "Intermediate",
      xpPoints: 3450,
      learningStyle: "Visual",
      memoryType: "Average"
    },

    // Teacher stats
    teacherStats: {
      totalCourses: 0,
      totalStudents: 0,
      averageRating: 0,
      totalReviews: 0,
      publishedCourses: 0,
      draftCourses: 0,
      totalRevenue: 0,
      monthlyViews: 0,
      certifications: 0,
      specializations: []
    },

    // Recent activities
    recentActivities: [
      {
        id: "1",
        type: "study_session",
        title: "Completed study session",
        subject: "Mathematics",
        duration: 45,
        score: 92,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: "2",
        type: "achievement",
        title: "Unlocked achievement",
        achievement: "7-Day Streak",
        description: "Study for 7 consecutive days",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        id: "3",
        type: "flashcard_review",
        title: "Reviewed flashcards",
        subject: "Physics",
        cardsReviewed: 25,
        accuracy: 89,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    ],

    // Achievements
    achievements: [
      { id: "1", title: "First Steps", description: "Complete your first study session", icon: "🎯", unlockedAt: "2024-01-20" },
      { id: "2", title: "Dedicated Learner", description: "Study for 10 consecutive days", icon: "🔥", unlockedAt: "2024-01-25" },
      { id: "3", title: "Knowledge Seeker", description: "Complete 5 subjects", icon: "📚", unlockedAt: "2024-02-10" },
      { id: "4", title: "Flashcard Master", description: "Review 100 flashcards", icon: "🃏", unlockedAt: "2024-02-15" },
      { id: "5", title: "Speed Demon", description: "Complete 10 study sessions in one day", icon: "⚡", unlockedAt: "2024-03-01" }
    ],

    // Courses (if teacher)
    courses: [],

    // Badges
    badges: [
      { id: "1", name: "Early Adopter", color: "purple", earnedAt: "2024-01-15" },
      { id: "2", name: "Consistent Learner", color: "blue", earnedAt: "2024-02-01" },
      { id: "3", name: "Community Member", color: "green", earnedAt: "2024-02-20" }
    ]
  };

  // Fetch real user data
  const { data: userProfile } = useQuery({
    queryKey: ["/api/user/profile"],
    enabled: !!user
  });

  // Fetch teacher stats if user is teacher
  const { data: teacherStats } = useQuery({
    queryKey: ["/api/teacher/stats"],
    enabled: !!user && user.isTeacher
  });

  // Fetch gamification data
  const { data: gamificationData } = useQuery({
    queryKey: ["/api/gamification", user?.id],
    enabled: !!user
  });

  useEffect(() => {
    // Update profile data with real data when available
    if (userProfile) {
      // Merge real data with mock data
    }
  }, [userProfile, teacherStats, gamificationData]);

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('pt-BR');
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} dia${days > 1 ? 's' : ''} atrás`;
    if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
    return 'Agora mesmo';
  };

  const getLevelProgress = (xp: number) => {
    const levels = [
      { name: 'Iniciante', min: 0, max: 1000 },
      { name: 'Intermediário', min: 1000, max: 2500 },
      { name: 'Avançado', min: 2500, max: 5000 },
      { name: 'Especialista', min: 5000, max: 10000 }
    ];

    const currentLevel = levels.find(l => xp >= l.min && xp < l.max) || levels[0];
    const progress = ((xp - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100;

    return { level: currentLevel.name, progress: Math.min(progress, 100) };
  };

  const levelData = getLevelProgress(profileData.studentStats.xpPoints);

  const isOwnProfile = user?.id === profileData.id;

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/home')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            {isOwnProfile && (
              <Button variant="outline" size="sm">
                <Edit3 className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-8 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24 md:w-32 md:h-32">
                <AvatarImage src={profileData.avatar || undefined} />
                <AvatarFallback className="text-2xl">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{profileData.name}</h1>
                    {profileData.isVerified && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verificado
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{profileData.bio}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {profileData.isTeacher ? 'Professor' : 'Estudante'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Membro desde {formatDate(profileData.joinedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {profileData.location}
                    </span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{profileData.studentStats.totalStudyHours}</div>
                    <div className="text-xs text-muted-foreground">Horas de Estudo</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{profileData.studentStats.currentStreak}</div>
                    <div className="text-xs text-muted-foreground">Sequência Atual</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{profileData.studentStats.completedSubjects}</div>
                    <div className="text-xs text-muted-foreground">Matérias Completas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{profileData.studentStats.achievements}</div>
                    <div className="text-xs text-muted-foreground">Conquistas</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="student">Estudante</TabsTrigger>
            <TabsTrigger value="teacher">Professor</TabsTrigger>
            <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Student Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Atividades como Estudante
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Nível Atual</span>
                      <Badge variant="secondary">{levelData.level}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso</span>
                        <span>{profileData.studentStats.xpPoints} XP</span>
                      </div>
                      <Progress value={levelData.progress} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-primary">{profileData.studentStats.averageScore}%</div>
                        <div className="text-xs text-muted-foreground">Pontuação Média</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-primary">{profileData.studentStats.totalFlashcards}</div>
                        <div className="text-xs text-muted-foreground">Flashcards</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Teacher Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Atividades como Professor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profileData.isTeacher && profileData.teacherStats.totalCourses > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{profileData.teacherStats.totalCourses}</div>
                          <div className="text-xs text-muted-foreground">Cursos Criados</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{profileData.teacherStats.totalStudents}</div>
                          <div className="text-xs text-muted-foreground">Alunos</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{profileData.teacherStats.averageRating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({profileData.teacherStats.totalReviews} avaliações)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-2">Ainda não há atividades como professor</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {profileData.isTeacher
                          ? "Este usuário ainda não criou cursos ou conteúdos como professor."
                          : "Este usuário ainda não iniciou atividades como professor na plataforma."
                        }
                      </p>
                      {isOwnProfile && (
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Começar como Professor
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Atividades Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profileData.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        {activity.type === 'study_session' && <BookOpen className="h-4 w-4 text-primary" />}
                        {activity.type === 'achievement' && <Trophy className="h-4 w-4 text-yellow-500" />}
                        {activity.type === 'flashcard_review' && <Brain className="h-4 w-4 text-blue-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.subject && `${activity.subject} • `}
                          {activity.timestamp && formatTimeAgo(activity.timestamp)}
                        </p>
                        {activity.score && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            {activity.score}% de acerto
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Student Tab */}
          <TabsContent value="student" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas de Estudo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Horas Totais</span>
                      <span className="font-semibold">{profileData.studentStats.totalStudyHours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Sequência Atual</span>
                      <span className="font-semibold">{profileData.studentStats.currentStreak} dias</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Matérias Completas</span>
                      <span className="font-semibold">{profileData.studentStats.completedSubjects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Pontuação Média</span>
                      <span className="font-semibold">{profileData.studentStats.averageScore}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Perfil de Aprendizado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Estilo de Aprendizado</span>
                      <Badge variant="outline">{profileData.studentStats.learningStyle}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tipo de Memória</span>
                      <Badge variant="outline">{profileData.studentStats.memoryType}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Nível Atual</span>
                      <Badge>{profileData.studentStats.level}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Teacher Tab */}
          <TabsContent value="teacher" className="space-y-6">
            {profileData.isTeacher && profileData.teacherStats.totalCourses > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Estatísticas como Professor</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Cursos Criados</span>
                        <span className="font-semibold">{profileData.teacherStats.totalCourses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Cursos Publicados</span>
                        <span className="font-semibold">{profileData.teacherStats.publishedCourses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total de Alunos</span>
                        <span className="font-semibold">{profileData.teacherStats.totalStudents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Avaliação Média</span>
                        <span className="font-semibold">{profileData.teacherStats.averageRating} ⭐</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Engajamento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Visualizações Mensais</span>
                        <span className="font-semibold">{profileData.teacherStats.monthlyViews}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Certificações</span>
                        <span className="font-semibold">{profileData.teacherStats.certifications}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Receita Total</span>
                        <span className="font-semibold">R$ {profileData.teacherStats.totalRevenue}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-12 pb-12">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <GraduationCap className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {profileData.isTeacher ? "Nenhuma atividade como professor ainda" : "Este usuário ainda não iniciou como professor"}
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      {profileData.isTeacher
                        ? "Este professor ainda não criou cursos ou conteúdos na plataforma. Volte em breve para ver as primeiras criações!"
                        : "Este usuário ainda não começou a jornada como professor. Quando iniciar, suas atividades aparecerão aqui."
                      }
                    </p>
                    {isOwnProfile && !profileData.isTeacher && (
                      <Button>
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Começar como Professor
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Conquistas Desbloqueadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profileData.achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{achievement.title}</p>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {formatDate(achievement.unlockedAt)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Emblemas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {profileData.badges.map((badge) => (
                      <div key={badge.id} className="text-center">
                        <div className={`w-12 h-12 rounded-full bg-${badge.color}-100 dark:bg-${badge.color}-900/30 flex items-center justify-center mx-auto mb-2`}>
                          <Award className={`h-6 w-6 text-${badge.color}-600`} />
                        </div>
                        <p className="text-xs font-medium">{badge.name}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(badge.earnedAt)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Subject, StudySettings } from "@shared/schema";
import { generateStudySchedule } from "@/lib/schedule-generator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Award, TrendingUp, Flame, Users, Calendar as CalendarIcon } from "lucide-react";
import DashboardOverview from "@/components/dashboard-overview";
import WeeklySchedule from "@/components/weekly-schedule";
import QuickActions from "@/components/quick-actions";
import StudySettingsComponent from "@/components/study-settings";
import SubjectList from "@/components/subject-list";
import AddSubjectModal from "@/components/add-subject-modal";
import CurrentSubject from "@/components/current-subject";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InsertSubject } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch subjects
  const { data: subjects = [], isLoading: subjectsLoading } = useQuery<Subject[]>({
    queryKey: ["/api/subjects"],
  });

  // Fetch study settings
  const { data: settings, isLoading: settingsLoading } = useQuery<StudySettings>({
    queryKey: ["/api/study-settings"],
  });

  // Add subject mutation
  const addSubjectMutation = useMutation({
    mutationFn: async (data: InsertSubject) => {
      const response = await apiRequest("POST", "/api/subjects", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subjects"] });
      toast({
        title: t('toast.subjectAdded'),
        description: t('toast.subjectAddedDesc'),
      });
    },
  });

  const isLoading = subjectsLoading || settingsLoading;

  // Mock gamification data
  const currentCourse = {
    title: "Desenvolvimento Web Full Stack",
    progress: 65,
    currentModule: "React Avançado",
  };

  const stats = {
    tasksCompleted: 24,
    projectsCompleted: 5,
    certificatesEarned: 2,
  };

  const streak = {
    current: 7,
    days: ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
    status: [true, true, true, true, true, true, true],
  };

  const leagueData = {
    name: "Liga Ouro",
    rank: 3,
    xp: 1240,
    topUsers: [
      { name: "Ana Silva", xp: 1850 },
      { name: "Carlos Santos", xp: 1560 },
      { name: user?.name || "Você", xp: 1240 },
    ],
    daysLeft: 12,
  };

  const xpData = {
    total: 1240,
    monthlyGain: 85,
  };

  const achievements = {
    current: 12,
    total: 50,
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex-1 p-8">
        <p className="text-muted-foreground">Erro ao carregar configurações.</p>
      </div>
    );
  }

  const weeks = generateStudySchedule(subjects, settings, language);
  
  const totalCycleMinutes = subjects.reduce((total, subject) => {
    return total + (subject.hours * 60 + subject.minutes);
  }, 0);
  
  const totalCycleTime = {
    hours: Math.floor(totalCycleMinutes / 60),
    minutes: totalCycleMinutes % 60,
  };

  const handleAddSubject = async (data: InsertSubject) => {
    await addSubjectMutation.mutateAsync(data);
  };

  const handleNewCycle = () => {
    toast({
      title: t('toast.featureInDev'),
      description: t('toast.newCycleInDev'),
    });
  };

  const handleCompleteCycle = () => {
    if (confirm(t('toast.cycleCompletedConfirm'))) {
      subjects.forEach(subject => {
        fetch(`/api/subjects/${subject.id}`, { method: 'DELETE' });
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/subjects'] });
      
      toast({
        title: t('toast.cycleCompleted'),
        description: t('toast.cycleCompletedDesc'),
      });
    }
  };

  const handleConfigureSchedule = () => {
    toast({
      title: t('toast.featureInDev'),
      description: t('toast.configureInDev'),
    });
  };

  const handleExportSchedule = () => {
    if (weeks.length === 0) {
      toast({
        title: t('toast.noScheduleExport'),
        description: t('toast.noScheduleExportDesc'),
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: t('toast.featureInDev'),
      description: t('toast.exportInDev'),
    });
  };

  const handleEditSettings = () => {
    toast({
      title: t('toast.featureInDev'),
      description: t('toast.editInDev'),
    });
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8 space-y-8" data-testid="home-page">
        {/* Seção 1: Gamificação */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground" data-testid="section-gamification">
            {t('home.welcome')}, {user?.name?.split(' ')[0] || 'Estudante'}!
          </h2>

          {/* Linha 1: Curso Atual + Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card do Curso Atual */}
            <Card data-testid="card-current-course">
              <CardHeader>
                <CardTitle>{currentCourse.title}</CardTitle>
                <CardDescription>{currentCourse.currentModule}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">{t('course.progress')}</span>
                    <span className="font-bold">{currentCourse.progress}%</span>
                  </div>
                  <Progress value={currentCourse.progress} />
                </div>
                <Button className="w-full" data-testid="button-continue-course">
                  {t('course.continue')}
                </Button>
              </CardContent>
            </Card>

            {/* Card de Stats */}
            <Card data-testid="card-stats">
              <CardHeader>
                <CardTitle>{t('stats.overview')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-sm">{t('stats.tasksCompleted')}</span>
                  </div>
                  <span className="font-bold" data-testid="stat-tasks">{stats.tasksCompleted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-sm">{t('stats.projectsCompleted')}</span>
                  </div>
                  <span className="font-bold" data-testid="stat-projects">{stats.projectsCompleted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm">{t('stats.certificatesEarned')}</span>
                  </div>
                  <span className="font-bold" data-testid="stat-certificates">{stats.certificatesEarned}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Linha 2: Liga + Streak & XP */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card da Liga */}
            <Card data-testid="card-league">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{leagueData.name}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{leagueData.daysLeft} {t('league.daysLeft')}</span>
                  </div>
                </div>
                <CardDescription>{t('league.yourRank')}: #{leagueData.rank}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leagueData.topUsers.map((u, i) => (
                    <div 
                      key={i} 
                      className={`flex items-center justify-between p-2 rounded ${
                        u.name === (user?.name || 'Você') ? 'bg-primary/10' : ''
                      }`}
                      data-testid={`league-user-${i+1}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-muted-foreground">#{i + 1}</span>
                        <span className="text-sm">{u.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-yellow-600" />
                        <span className="text-sm font-bold">{u.xp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cards de Streak e XP */}
            <div className="space-y-6">
              {/* Streak */}
              <Card data-testid="card-streak">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-600" />
                    {t('streak.title')}
                  </CardTitle>
                  <CardDescription>{streak.current} {t('streak.days')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between gap-1">
                    {streak.days.map((day, i) => (
                      <div 
                        key={i} 
                        className="flex flex-col items-center gap-1"
                        data-testid={`streak-day-${i}`}
                      >
                        <span className="text-xs text-muted-foreground">{day}</span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          streak.status[i] 
                            ? 'bg-orange-600 dark:bg-orange-500' 
                            : 'bg-muted'
                        }`}>
                          {streak.status[i] && <Flame className="h-4 w-4 text-white" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* XP */}
              <Card data-testid="card-xp">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    {t('xp.monthly')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">{xpData.total}</span>
                    <span className="text-sm text-green-600 dark:text-green-400">+{xpData.monthlyGain} {t('xp.today')}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Linha 3: Certificados + Conquistas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card data-testid="card-certificates">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-600" />
                  {t('certificates.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.certificatesEarned}</p>
              </CardContent>
            </Card>

            <Card data-testid="card-achievements">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  {t('achievements.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{achievements.current}/{achievements.total}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Seção 2: StudyCycle */}
        <section className="space-y-6">

          <DashboardOverview
            subjects={subjects}
            settings={settings}
            totalWeeks={weeks.length}
            onNewCycle={handleNewCycle}
            onCompleteCycle={handleCompleteCycle}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <CurrentSubject weeks={weeks} subjects={subjects} />
              <WeeklySchedule weeks={weeks} subjects={subjects} />
            </div>

            <div className="space-y-6">
              <QuickActions
                onAddSubject={() => setIsAddSubjectModalOpen(true)}
                onConfigureSchedule={handleConfigureSchedule}
                onExportSchedule={handleExportSchedule}
              />

              <StudySettingsComponent
                settings={settings}
                totalCycleTime={totalCycleTime}
                onEdit={handleEditSettings}
              />

              <SubjectList subjects={subjects} />
            </div>
          </div>
        </section>
      </div>

      <AddSubjectModal
        isOpen={isAddSubjectModalOpen}
        onClose={() => setIsAddSubjectModalOpen(false)}
        onSubmit={handleAddSubject}
      />
    </div>
  );
}
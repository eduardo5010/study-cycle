import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Subject, StudySettings } from "@shared/schema";
import { generateStudySchedule } from "@/lib/schedule-generator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
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

  // Empty state - project is just starting
  const hasNoData = !isLoading && subjects.length === 0;

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
        {/* Welcome Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground" data-testid="section-welcome">
            {t('home.welcome')}, {user?.name?.split(' ')[0] || 'Estudante'}!
          </h2>

          {/* Early Stage Notice */}
          {hasNoData && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  {t('home.earlyStage.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {t('home.earlyStage.description')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('home.earlyStage.pricing')}
                </p>
              </CardContent>
            </Card>
          )}
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
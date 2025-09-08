import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Subject, StudySettings, InsertSubject } from "@shared/schema";
import { generateStudySchedule } from "@/lib/schedule-generator";
import Header from "@/components/header";
import DashboardOverview from "@/components/dashboard-overview";
import WeeklySchedule from "@/components/weekly-schedule";
import QuickActions from "@/components/quick-actions";
import StudySettingsComponent from "@/components/study-settings";
import SubjectList from "@/components/subject-list";
import AddSubjectModal from "@/components/add-subject-modal";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
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
        title: "Disciplina adicionada",
        description: "A disciplina foi adicionada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a disciplina.",
        variant: "destructive",
      });
    },
  });

  const isLoading = subjectsLoading || settingsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mb-2"></div>
            <div className="h-4 bg-muted rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card p-6 rounded-xl border border-border h-24"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Erro ao carregar configurações do sistema.</p>
          </div>
        </main>
      </div>
    );
  }

  // Generate schedule based on current subjects and settings
  const weeks = generateStudySchedule(subjects, settings);
  
  // Calculate total cycle time
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
      title: "Funcionalidade em desenvolvimento",
      description: "A criação de novos ciclos será implementada em breve.",
    });
  };

  const handleConfigureSchedule = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A configuração de horários será implementada em breve.",
    });
  };

  const handleExportSchedule = () => {
    if (weeks.length === 0) {
      toast({
        title: "Nenhum cronograma para exportar",
        description: "Adicione disciplinas para gerar um cronograma.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A exportação de cronograma será implementada em breve.",
    });
  };

  const handleEditSettings = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A edição de configurações será implementada em breve.",
    });
  };

  return (
    <div className="min-h-screen" data-testid="dashboard-page">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardOverview
          subjects={subjects}
          settings={settings}
          totalWeeks={weeks.length}
          onNewCycle={handleNewCycle}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <WeeklySchedule weeks={weeks} subjects={subjects} />

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
      </main>

      <AddSubjectModal
        isOpen={isAddSubjectModalOpen}
        onClose={() => setIsAddSubjectModalOpen(false)}
        onSubmit={handleAddSubject}
      />
    </div>
  );
}

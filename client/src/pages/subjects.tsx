import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { GlobalSubject, InsertGlobalSubject } from "@shared/schema";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import GlobalSubjectsList from "@/components/global-subjects-list";
import AddGlobalSubjectModal from "@/components/add-global-subject-modal";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SubjectsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useLanguage();

  // Fetch global subjects
  const { data: globalSubjects = [], isLoading } = useQuery({
    queryKey: ["/api/global-subjects"],
    queryFn: () => fetch("/api/global-subjects").then(res => res.json()) as Promise<GlobalSubject[]>,
  });

  // Create global subject mutation
  const createGlobalSubjectMutation = useMutation({
    mutationFn: (data: InsertGlobalSubject) =>
      apiRequest("/api/global-subjects", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/global-subjects"] });
      toast({
        title: t('toast.globalSubjectAdded'),
        description: t('toast.globalSubjectAddedDesc'),
      });
    },
    onError: () => {
      toast({
        title: t('toast.error'),
        description: t('toast.globalSubjectError'),
        variant: "destructive",
      });
    },
  });

  // Delete global subject mutation
  const deleteGlobalSubjectMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/global-subjects/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/global-subjects"] });
      toast({
        title: t('toast.globalSubjectDeleted'),
        description: t('toast.globalSubjectDeletedDesc'),
      });
    },
    onError: () => {
      toast({
        title: t('toast.error'),
        description: t('toast.globalSubjectDeleteError'),
        variant: "destructive",
      });
    },
  });

  const handleAddSubject = (data: InsertGlobalSubject) => {
    createGlobalSubjectMutation.mutate(data);
  };

  const handleDeleteSubject = (subjectId: string) => {
    if (confirm(t('subjects.confirmDelete'))) {
      deleteGlobalSubjectMutation.mutate(subjectId);
    }
  };

  const handleEditSubject = (subject: GlobalSubject) => {
    toast({
      title: t('toast.featureInDev'),
      description: t('toast.editSubjectInDev'),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">{t('common.loading')}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground" data-testid="page-title">
                {t('subjects.pageTitle')}
              </h1>
              <p className="text-muted-foreground mt-2" data-testid="page-description">
                {t('subjects.pageDescription')}
              </p>
            </div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2"
              data-testid="button-add-global-subject"
            >
              <Plus className="h-4 w-4" />
              {t('subjects.addGlobal')}
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <GlobalSubjectsList
            subjects={globalSubjects}
            onEdit={handleEditSubject}
            onDelete={handleDeleteSubject}
          />
        </div>

        <AddGlobalSubjectModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddSubject}
        />
      </main>
    </div>
  );
}
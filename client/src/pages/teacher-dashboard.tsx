import React from "react";
import { CourseCreationForm } from "@/components/forms/course-creation-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle } from "lucide-react";

import { TeacherLayout } from "@/components/teacher-layout";
import FileUploader from "@/components/file-uploader";
import { useAuth } from "@/contexts/auth-context";

export function TeacherDashboard() {
  const { user } = useAuth();
  const [isCreatingCourse, setIsCreatingCourse] = React.useState(false);

  return (
    <TeacherLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Área do Professor</h1>
        <p className="text-gray-600">
          Crie e gerencie seus cursos, monitore o progresso dos alunos e mais.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Novo Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog open={isCreatingCourse} onOpenChange={setIsCreatingCourse}>
              <DialogTrigger asChild>
                <Button className="w-full" size="lg">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Criar Curso
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Criar Novo Curso</DialogTitle>
                </DialogHeader>
                <CourseCreationForm />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Aqui virão outros cards com estatísticas e ações rápidas */}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Uploads</h2>
        <FileUploader userId={user?.id || ""} />
      </div>

      {/* Lista de cursos existentes */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Meus Cursos</h2>
        <ScrollArea className="h-[400px]">
          {/* Lista de cursos do professor */}
        </ScrollArea>
      </div>
    </TeacherLayout>
  );
}

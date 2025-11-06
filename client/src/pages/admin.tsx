import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { User, Subject, StudyCycle, Course } from "@shared/types";

const AdminPage = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Estados para dados
  const [users, setUsers] = useState<User[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [cycles, setCycles] = useState<StudyCycle[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<{
    type: "user" | "subject" | "cycle" | "course";
    data: any;
  } | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteItemType, setDeleteItemType] = useState<
    "user" | "subject" | "cycle" | "course" | null
  >(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Carrega os dados iniciais
  useEffect(() => {
    if (!user || user.userType !== "admin") {
      setLocation("/dashboard");
      return;
    }

    loadData();
  }, [user, setLocation]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersData, subjectsData, cyclesData, coursesData] =
        await Promise.all([
          fetch("/api/users").then((res) => res.json()),
          fetch("/api/subjects").then((res) => res.json()),
          fetch("/api/cycles").then((res) => res.json()),
          fetch("/api/courses").then((res) => res.json()),
        ]);

      setUsers(usersData);
      setSubjects(subjectsData);
      setCycles(cyclesData);
      setCourses(coursesData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (
    type: "user" | "subject" | "cycle" | "course",
    data: any
  ) => {
    setCurrentEditItem({ type, data });
    setIsEditModalOpen(true);
  };

  const handleCreate = (type: "user" | "subject" | "cycle" | "course") => {
    setCurrentEditItem({ type, data: null });
    setIsCreateModalOpen(true);
  };

  const handleSave = async (type: string, data: any, isEditing: boolean) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/${type}s${isEditing ? `/${data.id}` : ""}`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao salvar");
      }

      // Recarrega os dados após salvar
      await loadData();

      // Fecha os modais
      setIsEditModalOpen(false);
      setIsCreateModalOpen(false);
      setCurrentEditItem(null);
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (
    id: string,
    type: "user" | "subject" | "cycle" | "course"
  ) => {
    setDeleteItemId(id);
    setDeleteItemType(type);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteItemId || !deleteItemType) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/${deleteItemType}s/${deleteItemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar");
      }

      // Recarrega os dados após deletar
      await loadData();
    } catch (error) {
      console.error(`Erro ao deletar ${deleteItemType}:`, error);
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setDeleteItemId(null);
      setDeleteItemType(null);
    }
  };

  if (!user || user.userType !== "admin") {
    return null;
  }

  const usersColumns: Column<User>[] = [
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { header: "Type", accessorKey: "userType" },
    { header: "Verified", accessorKey: "isVerified" },
    {
      header: "Actions",
      accessorKey: "id",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit("user", row)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.id, "user")}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const subjectsColumns: Column<Subject>[] = [
    { header: "Name", accessorKey: "name" },
    { header: "Hours", accessorKey: "hours" },
    { header: "Minutes", accessorKey: "minutes" },
    {
      header: "Actions",
      accessorKey: "id",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit("subject", row)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.id, "subject")}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const cyclesColumns: Column<StudyCycle>[] = [
    { header: "Name", accessorKey: "name" },
    { header: "Total Weeks", accessorKey: "totalWeeks" },
    {
      header: "Actions",
      accessorKey: "id",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit("cycle", row)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.id, "cycle")}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const coursesColumns: Column<Course>[] = [
    { header: "Title", accessorKey: "title" },
    { header: "Creator", accessorKey: "creatorId" },
    { header: "Published", accessorKey: "isPublished" },
    {
      header: "Actions",
      accessorKey: "id",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit("course", row)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.id, "course")}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const getDeleteMessage = () => {
    switch (deleteItemType) {
      case "user":
        return "Are you sure you want to delete this user? This action cannot be undone.";
      case "subject":
        return "Are you sure you want to delete this subject? This will remove it from all study cycles.";
      case "cycle":
        return "Are you sure you want to delete this study cycle? This will remove all associated data.";
      case "course":
        return "Are you sure you want to delete this course? All associated content will be removed.";
      default:
        return "Are you sure you want to delete this item? This action cannot be undone.";
    }
  };

  return (
    <div className="container mx-auto p-6 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {getDeleteMessage()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="cycles">Study Cycles</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Usuários</h2>
              <Button onClick={() => handleCreate("user")}>Novo Usuário</Button>
            </div>
            <DataTable<User> columns={usersColumns} data={users} />
          </Card>
        </TabsContent>

        <TabsContent value="subjects">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Disciplinas</h2>
              <Button onClick={() => handleCreate("subject")}>
                Nova Disciplina
              </Button>
            </div>
            <DataTable<Subject> columns={subjectsColumns} data={subjects} />
          </Card>
        </TabsContent>

        <TabsContent value="cycles">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Ciclos de Estudo</h2>
              <Button onClick={() => handleCreate("cycle")}>Novo Ciclo</Button>
            </div>
            <DataTable<StudyCycle> columns={cyclesColumns} data={cycles} />
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Cursos</h2>
              <Button onClick={() => handleCreate("course")}>Novo Curso</Button>
            </div>
            <DataTable<Course> columns={coursesColumns} data={courses} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;

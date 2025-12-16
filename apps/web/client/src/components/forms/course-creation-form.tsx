import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type {
  Course,
  Subject,
  Module,
  Unit,
  Chapter,
  Lesson,
  Skill,
} from "@shared/types/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const videoUrlSchema = z.string().refine((url) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+$/;
  return youtubeRegex.test(url) || vimeoRegex.test(url);
}, "URL deve ser do YouTube ou Vimeo");

const skillSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string(),
  exercises: z.array(
    z.object({
      title: z.string().min(1, "Título é obrigatório"),
      description: z.string(),
      content: z.string().min(1, "Conteúdo é obrigatório"),
      type: z.enum([
        "PRACTICE",
        "UNIT_TEST",
        "MODULE_TEST",
        "SUBJECT_TEST",
        "COURSE_TEST",
      ]),
      difficulty: z.enum(["BASIC", "INTERMEDIATE", "ADVANCED"]),
    })
  ),
});

const lessonSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string(),
  videoUrl: videoUrlSchema.optional(),
  theory: z.string().optional(),
  skills: z.array(skillSchema),
  quiz: z
    .object({
      title: z.string(),
      questions: z.array(
        z.object({
          question: z.string(),
          options: z.array(z.string()),
          correctOption: z.number(),
        })
      ),
    })
    .optional(),
  assignments: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      dueDate: z.date().optional(),
    })
  ),
});

const chapterSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string(),
  lessons: z.array(lessonSchema),
});

const unitSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string(),
  chapters: z.array(chapterSchema),
  unitTest: skillSchema.shape.exercises.element.optional(),
});

const moduleSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string(),
  units: z.array(unitSchema),
  moduleTest: skillSchema.shape.exercises.element.optional(),
});

const subjectSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string(),
  modules: z.array(moduleSchema),
  subjectTest: skillSchema.shape.exercises.element.optional(),
});

const courseSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string(),
  subjects: z.array(subjectSchema),
  isPublished: z.boolean(),
  courseTest: skillSchema.shape.exercises.element.optional(),
});

export function CourseCreationForm() {
  const [activeTab, setActiveTab] = React.useState("info");
  const [courseData, setCourseData] = React.useState<Partial<Course>>({
    title: "",
    description: "",
    subjects: [],
    isPublished: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: courseData,
  });

  const onSubmit = async (data: z.infer<typeof courseSchema>) => {
    // Aqui você enviaria os dados para a API
    console.log("Dados do curso:", data);
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="info">Informações Básicas</TabsTrigger>
                <TabsTrigger value="subjects">Disciplinas</TabsTrigger>
                <TabsTrigger value="tests">Testes</TabsTrigger>
              </TabsList>

              <TabsContent value="info">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="text-sm font-medium">
                      Título do Curso
                    </label>
                    <Input id="title" {...register("title")} className="mt-1" />
                    {errors.title && (
                      <span className="text-sm text-red-500">
                        {errors.title.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      Descrição
                    </label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      className="mt-1"
                    />
                    {errors.description && (
                      <span className="text-sm text-red-500">
                        {errors.description.message}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="isPublished" {...register("isPublished")} />
                    <label
                      htmlFor="isPublished"
                      className="text-sm font-medium"
                    >
                      Publicar curso imediatamente
                    </label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="subjects">
                <ScrollArea className="h-[500px] rounded-md border p-4">
                  <Button
                    type="button"
                    onClick={() => {
                      const newSubject: Subject = {
                        id: String(Date.now()),
                        title: "",
                        description: "",
                        modules: [],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                      };
                      setCourseData((prev) => ({
                        ...prev,
                        subjects: [...(prev.subjects || []), newSubject],
                      }));
                    }}
                  >
                    Adicionar Disciplina
                  </Button>

                  {courseData.subjects?.map((subject, index) => (
                    <Card key={subject.id} className="mt-4">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Disciplina {index + 1}</CardTitle>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setCourseData((prev) => ({
                                ...prev,
                                subjects: prev.subjects?.filter(
                                  (s) => s.id !== subject.id
                                ),
                              }));
                            }}
                          >
                            Remover
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Formulário da disciplina */}
                      </CardContent>
                    </Card>
                  ))}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="tests">
                <div className="space-y-4">
                  {/* Interface para criar teste do curso */}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="submit">Salvar Curso</Button>
        </div>
      </form>
    </div>
  );
}

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Search, BookOpen, Clock, Star } from "lucide-react";
import { CourseView } from "@/components/course-view";
import { CourseEditor } from "@/components/course-editor";

export default function CoursesPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock courses data with complete structure
  const enrolledCourses = [
    {
      id: "1",
      title: "Desenvolvimento Web Full Stack",
      description: "Aprenda a criar aplicações web completas",
      subjects: [
        {
          id: "s1",
          title: "Frontend Development",
          description: "Desenvolvimento de interfaces web",
          modules: [
            {
              id: "m1",
              title: "HTML & CSS Foundations",
              description: "Fundamentos de HTML e CSS",
              units: [
                {
                  id: "u1",
                  title: "HTML Basics",
                  description: "Conceitos básicos de HTML",
                  chapters: [
                    {
                      id: "c1",
                      title: "Estrutura HTML",
                      description: "Entendendo a estrutura básica do HTML",
                      lessons: [
                        {
                          id: "l1",
                          title: "Tags HTML",
                          description: "Aprendendo as principais tags HTML",
                          videoUrl:
                            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                          theory:
                            "HTML (HyperText Markup Language) é a linguagem padrão para criar páginas web...",
                          skills: [
                            {
                              id: "sk1",
                              title: "Estruturação HTML",
                              description:
                                "Capacidade de estruturar documentos HTML",
                              level: "NOT_STARTED",
                              exercises: [],
                              createdAt: new Date(),
                              updatedAt: new Date(),
                            },
                          ],
                          createdAt: new Date(),
                          updatedAt: new Date(),
                        },
                      ],
                      createdAt: new Date(),
                      updatedAt: new Date(),
                    },
                  ],
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      isPublished: true,
      createdBy: {
        id: "t1",
        name: "Professor Silva",
        type: "TEACHER",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const availableCourses = [
    {
      id: "3",
      title: "Machine Learning Fundamentals",
      description: "Introdução ao aprendizado de máquina",
      estimatedHours: 40,
      rating: 4.8,
      enrollmentCount: 1250,
      category: "Programming",
      level: "advanced",
      thumbnail: "",
    },
    {
      id: "4",
      title: "React Avançado",
      description: "Técnicas avançadas em React",
      estimatedHours: 30,
      rating: 4.9,
      enrollmentCount: 3200,
      category: "Programming",
      level: "advanced",
      thumbnail: "",
    },
    {
      id: "5",
      title: "Cálculo I",
      description: "Fundamentos de cálculo diferencial e integral",
      estimatedHours: 60,
      rating: 4.5,
      enrollmentCount: 850,
      category: "Math",
      level: "beginner",
      thumbnail: "",
    },
    {
      id: "6",
      title: "Física Quântica",
      description: "Introdução à mecânica quântica",
      estimatedHours: 50,
      rating: 4.7,
      enrollmentCount: 420,
      category: "Science",
      level: "advanced",
      thumbnail: "",
    },
  ];

  // Define o tipo do curso
  type CourseType = {
    id: string;
    title: string;
    description: string;
    subjects: {
      id: string;
      title: string;
      description: string;
      modules: any[];
      createdAt: Date;
      updatedAt: Date;
    }[];
    isPublished: boolean;
    createdBy: {
      id: string;
      name: string;
      type: string;
    };
    createdAt: Date;
    updatedAt: Date;
    progress?: number;
  };

  const filteredCourses = availableCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { user } = useAuth();
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  // Calcula o progresso total do curso com base nos subitems
  const calculateProgress = (items: any[]): number => {
    if (!items || items.length === 0) return 0;

    const progress = items.reduce((total, item) => {
      if (item.subjects) {
        return total + calculateProgress(item.subjects);
      }
      if (item.modules) {
        return total + calculateProgress(item.modules);
      }
      if (item.units) {
        return total + calculateProgress(item.units);
      }
      if (item.chapters) {
        return total + calculateProgress(item.chapters);
      }
      if (item.lessons) {
        return total + calculateProgress(item.lessons);
      }
      // Se é um item final (skill/exercício), verifica se está concluído
      return total + (item.isCompleted ? 1 : 0);
    }, 0);

    return (progress / items.length) * 100;
  };

  // Atualiza o progresso nos cursos matriculados
  const coursesWithProgress = enrolledCourses.map((course) => ({
    ...course,
    progress: calculateProgress(course.subjects),
  }));

  return (
    <div className="flex-1 overflow-y-auto">
      <div
        className="max-w-7xl mx-auto p-8 space-y-8"
        data-testid="courses-page"
      >
        {/* Editor de Cursos (apenas para professores e admins) */}
        {(user?.isTeacher || user?.isAdmin) && editingCourseId && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">
                {t("course.editor")}
              </h2>
              <Button onClick={() => setEditingCourseId(null)}>
                {t("course.finishEditing")}
              </Button>
            </div>
            <CourseEditor
              courseId={editingCourseId}
              onChange={async (data) => {
                // TODO: Implementar atualização do curso no backend
                console.log("Course data updated:", data);
              }}
            />
          </section>
        )}

        {/* Cursos Matriculados */}
        <section className="space-y-4">
          <h2
            className="text-2xl font-bold text-foreground"
            data-testid="section-enrolled-courses"
          >
            {t("courses.enrolled")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesWithProgress.map((course: CourseType) => (
              <Card
                key={course.id}
                data-testid={`enrolled-course-${course.id}`}
              >
                <CardHeader>
                  <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg mb-4 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t("course.progress")}
                    </span>
                    <span className="font-bold">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} />
                </CardContent>
                <CardFooter>
                  <div className="w-full space-y-2">
                    <Button
                      className="w-full"
                      data-testid={`continue-course-${course.id}`}
                    >
                      {t("course.continue")}
                    </Button>
                    {(user?.isTeacher || user?.isAdmin) && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setEditingCourseId(course.id)}
                      >
                        {t("course.edit")}
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Todos os Cursos Disponíveis */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2
              className="text-2xl font-bold text-foreground"
              data-testid="section-available-courses"
            >
              {t("courses.available")}
            </h2>
            <div className="w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t("courses.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-courses"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                data-testid={`available-course-${course.id}`}
              >
                <CardHeader>
                  <div className="w-full h-32 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-lg mb-4 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-secondary" />
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{course.estimatedHours}h</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="font-medium">{course.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                      {t(`categories.${course.category.toLowerCase()}`)}
                    </span>
                    <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded">
                      {t(`levels.${course.level}`)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {course.enrollmentCount.toLocaleString()}{" "}
                    {t("courses.students")}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant="outline"
                    data-testid={`enroll-course-${course.id}`}
                  >
                    {t("courses.enroll")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

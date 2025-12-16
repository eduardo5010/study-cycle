import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CourseCreationForm } from "@/components/forms/course-creation-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlusCircle,
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  Star,
  Clock,
  BarChart3,
  Settings,
  MessageSquare,
  Award,
  Calendar,
  FileText,
  Video,
  Image,
  Target,
  Zap,
  GraduationCap,
  Lightbulb,
  Trophy,
  PieChart,
  Activity,
  UserCheck,
  Upload,
  Download,
  Share2,
  Eye,
  Heart,
  ThumbsUp,
  Bell,
  Mail,
  Phone,
  MessageCircle,
  UserPlus,
  Book,
  Presentation,
  Mic,
  Camera,
  Edit3,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Info,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Grid,
  List,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  X,
  Plus,
  Minus
} from "lucide-react";

import { TeacherLayout } from "@/components/teacher-layout";
import FileUploader from "@/components/file-uploader";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

export function TeacherDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreatingCourse, setIsCreatingCourse] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("overview");

  // Fetch teacher stats from API
  const { data: teacherStats = {
    totalStudents: 0,
    activeCourses: 0,
    totalRevenue: 0,
    averageRating: 0,
    completionRate: 0,
    monthlyGrowth: 0
  }, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/teacher/stats"],
    queryFn: async () => {
      const response = await fetch('/api/teacher/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch teacher stats');
      }
      return await response.json();
    }
  });

  // Fetch recent courses from API
  const { data: recentCourses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/teacher/courses"],
    queryFn: async () => {
      const response = await fetch('/api/teacher/courses');
      if (!response.ok) {
        throw new Error('Failed to fetch teacher courses');
      }
      return await response.json();
    }
  });

  const quickActions = [
    {
      title: "Criar Novo Curso",
      description: "Comece um novo curso do zero",
      icon: PlusCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      action: () => setIsCreatingCourse(true),
      featured: true
    },
    {
      title: "Gerenciar Alunos",
      description: "Veja progresso e interaja",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      action: () => toast({ title: "Funcionalidade em desenvolvimento" })
    },
    {
      title: "Analytics Avançado",
      description: "Relatórios detalhados",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      action: () => toast({ title: "Funcionalidade em desenvolvimento" })
    },
    {
      title: "Marketing Tools",
      description: "Promova seus cursos",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      action: () => toast({ title: "Funcionalidade em desenvolvimento" })
    },
    {
      title: "Certificados",
      description: "Gerencie certificações",
      icon: Award,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      action: () => toast({ title: "Funcionalidade em desenvolvimento" })
    },
    {
      title: "Live Sessions",
      description: "Agende aulas ao vivo",
      icon: Video,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      action: () => toast({ title: "Funcionalidade em desenvolvimento" })
    }
  ];

  const contentTools = [
    {
      title: "Criar Vídeo Aula",
      description: "Grave ou faça upload de vídeo",
      icon: Video,
      color: "text-red-600",
      action: () => toast({ title: "Ferramenta em desenvolvimento" })
    },
    {
      title: "Quiz Interativo",
      description: "Crie testes e avaliações",
      icon: Target,
      color: "text-blue-600",
      action: () => toast({ title: "Ferramenta em desenvolvimento" })
    },
    {
      title: "Material PDF",
      description: "Upload de documentos",
      icon: FileText,
      color: "text-green-600",
      action: () => toast({ title: "Ferramenta em desenvolvimento" })
    },
    {
      title: "Galeria de Imagens",
      description: "Slides e apresentações",
      icon: Image,
      color: "text-purple-600",
      action: () => toast({ title: "Ferramenta em desenvolvimento" })
    },
    {
      title: "Áudio Lessons",
      description: "Podcasts e narrações",
      icon: Mic,
      color: "text-orange-600",
      action: () => toast({ title: "Ferramenta em desenvolvimento" })
    },
    {
      title: "Live Coding",
      description: "Sessões práticas",
      icon: Zap,
      color: "text-cyan-600",
      action: () => toast({ title: "Ferramenta em desenvolvimento" })
    }
  ];

  return (
    <TeacherLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Área do Professor</h1>
                <p className="text-muted-foreground">Bem-vindo de volta, {user?.name}!</p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Crie cursos incríveis, engaje alunos, acompanhe seu sucesso e construa sua comunidade de aprendizado.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Dialog open={isCreatingCourse} onOpenChange={setIsCreatingCourse}>
              <DialogTrigger asChild>
                <Button size="lg" className="min-w-[160px]">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Novo Curso
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Criar Novo Curso</DialogTitle>
                </DialogHeader>
                <CourseCreationForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="courses">Meus Cursos</TabsTrigger>
            <TabsTrigger value="content">Criar Conteúdo</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total de Alunos</CardTitle>
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{teacherStats.totalStudents.toLocaleString()}</div>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    +{teacherStats.monthlyGrowth}% este mês
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 border-green-200 dark:border-green-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Cursos Ativos</CardTitle>
                  <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">{teacherStats.activeCourses}</div>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Todos publicados
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Receita Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">R$ {teacherStats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    +12% vs mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30 border-orange-200 dark:border-orange-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Avaliação Média</CardTitle>
                  <Star className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{teacherStats.averageRating}</div>
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    Baseado em 892 avaliações
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Card
                    key={index}
                    className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${action.featured ? 'ring-2 ring-primary' : ''}`}
                    onClick={action.action}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center`}>
                          <Icon className={`h-6 w-6 ${action.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Recent Activity & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-1">
                      <UserPlus className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">15 novos alunos matriculados</p>
                      <p className="text-xs text-muted-foreground">em "Python para Iniciantes"</p>
                      <p className="text-xs text-muted-foreground">2 horas atrás</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-1">
                      <Star className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nova avaliação 5⭐</p>
                      <p className="text-xs text-muted-foreground">em "Machine Learning Avançado"</p>
                      <p className="text-xs text-muted-foreground">4 horas atrás</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mt-1">
                      <DollarSign className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Pagamento recebido</p>
                      <p className="text-xs text-muted-foreground">R$ 89,90 de mensalidade</p>
                      <p className="text-xs text-muted-foreground">6 horas atrás</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Notificações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mt-1">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Atualização da plataforma</p>
                      <p className="text-xs text-muted-foreground">Novas ferramentas disponíveis</p>
                      <Badge variant="destructive" className="text-xs mt-1">Importante</Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-1">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Pergunta de aluno</p>
                      <p className="text-xs text-muted-foreground">Dúvida sobre exercício 3</p>
                      <Badge variant="secondary" className="text-xs mt-1">Responder</Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Curso aprovado</p>
                      <p className="text-xs text-muted-foreground">"Data Science com R" publicado</p>
                      <Badge variant="default" className="text-xs mt-1 bg-green-500">Sucesso</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Meus Cursos</h2>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recentCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {course.students} alunos
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-current text-yellow-500" />
                            {course.rating}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            R$ {course.revenue.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                        {course.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Atualizado em {new Date(course.lastUpdate).toLocaleDateString('pt-BR')}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Content Creation Tab */}
          <TabsContent value="content" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ferramentas de Criação de Conteúdo</h2>
              <p className="text-muted-foreground">Crie conteúdo envolvente e interativo para seus alunos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contentTools.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200"
                    onClick={tool.action}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                        tool.color === 'text-red-600' ? 'bg-red-100 dark:bg-red-900/30' :
                        tool.color === 'text-blue-600' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        tool.color === 'text-green-600' ? 'bg-green-100 dark:bg-green-900/30' :
                        tool.color === 'text-purple-600' ? 'bg-purple-100 dark:bg-purple-900/30' :
                        tool.color === 'text-orange-600' ? 'bg-orange-100 dark:bg-orange-900/30' :
                        'bg-cyan-100 dark:bg-cyan-900/30'
                      }`}>
                        <Icon className={`h-8 w-8 ${tool.color}`} />
                      </div>
                      <h3 className="font-semibold mb-2">{tool.title}</h3>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload de Materiais
                </CardTitle>
                <CardDescription>
                  Faça upload de vídeos, PDFs, imagens e outros materiais para seus cursos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader userId={user?.id || ""} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Analytics e Relatórios</h2>
              <p className="text-muted-foreground">Acompanhe o desempenho dos seus cursos e alunos</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    Distribuição de Alunos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Python para Iniciantes</span>
                      <span className="text-sm font-medium">245 alunos (20%)</span>
                    </div>
                    <Progress value={20} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Machine Learning</span>
                      <span className="text-sm font-medium">189 alunos (15%)</span>
                    </div>
                    <Progress value={15} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Data Science com R</span>
                      <span className="text-sm font-medium">156 alunos (13%)</span>
                    </div>
                    <Progress value={13} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Receita Mensal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">R$ 3.240</div>
                  <p className="text-sm text-green-600 mb-4">+23% em relação ao mês passado</p>
                  <div className="h-32 bg-muted/50 rounded flex items-end justify-center">
                    <div className="text-center">
                      <div className="w-8 h-16 bg-primary rounded mb-2"></div>
                      <div className="w-8 h-20 bg-primary rounded mb-2"></div>
                      <div className="w-8 h-24 bg-primary rounded mb-2"></div>
                      <div className="w-8 h-18 bg-primary rounded mb-2"></div>
                      <div className="w-8 h-22 bg-primary rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-primary" />
                    Taxa de Conclusão
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">78%</div>
                  <p className="text-sm text-muted-foreground mb-4">Taxa média de conclusão dos cursos</p>
                  <Progress value={78} className="h-3" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Avaliações Recebidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">4.8</div>
                  <p className="text-sm text-muted-foreground mb-4">Avaliação média geral</p>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-current text-yellow-500" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TeacherLayout>
  );
}

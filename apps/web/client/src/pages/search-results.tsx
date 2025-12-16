import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { TeacherLayout } from "@/components/teacher-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  BookOpen,
  Users,
  FileText,
  HelpCircle,
  Bell,
  GraduationCap,
  Star,
  Clock,
  ArrowRight,
  Filter,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function SearchResultsPage() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Extract query from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1]);
    const query = urlParams.get('q') || '';
    setSearchQuery(query);
  }, [location]);

  // Search API call
  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ["/api/search", { q: searchQuery }],
    enabled: searchQuery.length >= 2,
    queryFn: () => apiRequest("GET", `/api/search?q=${encodeURIComponent(searchQuery)}`)
  });

  const handleSearch = (query: string) => {
    if (query.trim().length >= 2) {
      setLocation(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setLocation("/search");
  };

  if (isLoading) {
    return (
      <TeacherLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Resultados da Busca</h1>
              <p className="text-muted-foreground mt-2">Procurando por "{searchQuery}"...</p>
            </div>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </TeacherLayout>
    );
  }

  if (error) {
    return (
      <TeacherLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Resultados da Busca</h1>
              <p className="text-muted-foreground mt-2">Erro ao buscar resultados</p>
            </div>
          </div>

          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Ocorreu um erro ao buscar os resultados. Tente novamente.</p>
            </CardContent>
          </Card>
        </div>
      </TeacherLayout>
    );
  }

  const results = (searchResults as any)?.results || {};
  const totalResults = (searchResults as any)?.totalResults || 0;

  const renderCourseResult = (course: any) => (
    <Card key={course.id} className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg truncate">{course.title}</h3>
              <Badge variant="secondary">Curso</Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{course.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4" />
                {course.category}
              </span>
              {course.price > 0 && (
                <span className="flex items-center gap-1">
                  R$ {course.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm">
            Ver Curso
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderUserResult = (user: any) => (
    <Card key={user.id} className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-full flex items-center justify-center flex-shrink-0">
            <Users className="h-8 w-8 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg truncate">{user.name}</h3>
              <Badge variant={user.isTeacher ? "default" : "secondary"}>
                {user.isTeacher ? "Professor" : "Estudante"}
              </Badge>
            </div>
            {user.bio && (
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{user.bio}</p>
            )}
          </div>
          <Button variant="outline" size="sm">
            Ver Perfil
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderHelpResult = (help: any) => (
    <Card key={help.id} className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <HelpCircle className="h-8 w-8 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg truncate">{help.title}</h3>
              <Badge variant="outline">Ajuda</Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{help.content}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {help.category}
              </Badge>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Ver Artigo
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderNotificationResult = (notification: any) => (
    <Card key={notification.id} className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <Bell className="h-8 w-8 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg truncate">{notification.title}</h3>
              <Badge variant="outline">Notificação</Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-3">{notification.message}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {notification.type}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header with Search */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Resultados da Busca</h1>
            {searchQuery && (
              <p className="text-muted-foreground mt-2">
                {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''} para "{searchQuery}"
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar em todo o Study Cycle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button onClick={() => handleSearch(searchQuery)} disabled={searchQuery.length < 2}>
              Buscar
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && searchResults ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                Todos ({totalResults})
              </TabsTrigger>
              <TabsTrigger value="courses">
                Cursos ({results.courses?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="users">
                Usuários ({results.users?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="help">
                Ajuda ({results.help?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="notifications">
                Notificações ({results.notifications?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {totalResults === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Nenhum resultado encontrado</h3>
                    <p className="text-muted-foreground mb-4">
                      Não encontramos resultados para "{searchQuery}". Tente outros termos ou verifique a ortografia.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                        Programação
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                        Matemática
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                        Ciência
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {results.courses?.map(renderCourseResult)}
                  {results.users?.map(renderUserResult)}
                  {results.help?.map(renderHelpResult)}
                  {results.notifications?.map(renderNotificationResult)}
                </>
              )}
            </TabsContent>

            <TabsContent value="courses" className="space-y-4">
              {results.courses?.length > 0 ? (
                results.courses.map(renderCourseResult)
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum curso encontrado</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              {results.users?.length > 0 ? (
                results.users.map(renderUserResult)
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum usuário encontrado</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="help" className="space-y-4">
              {results.help?.length > 0 ? (
                results.help.map(renderHelpResult)
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum artigo de ajuda encontrado</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              {results.notifications?.length > 0 ? (
                results.notifications.map(renderNotificationResult)
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhuma notificação encontrada</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Busca Universal</h3>
              <p className="text-muted-foreground mb-6">
                Pesquise por cursos, professores, alunos, artigos de ajuda e muito mais no Study Cycle.
              </p>
              <div className="max-w-md mx-auto">
                <Input
                  type="text"
                  placeholder="Digite sua busca..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-center"
                />
                <Button
                  onClick={() => handleSearch(searchQuery)}
                  disabled={searchQuery.length < 2}
                  className="mt-4 w-full"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-3">Sugestões populares:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleSearch("Python")}
                  >
                    Python
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleSearch("Machine Learning")}
                  >
                    Machine Learning
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleSearch("Matemática")}
                  >
                    Matemática
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleSearch("Professores")}
                  >
                    Professores
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TeacherLayout>
  );
}

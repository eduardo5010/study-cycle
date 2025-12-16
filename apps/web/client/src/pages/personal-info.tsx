import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import Header from "@/components/header";
import LeftSidebar from "@/components/left-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  BookOpen,
  Award,
  Camera,
  Save,
  Loader2
} from "lucide-react";

const personalInfoSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  bio: z.string().max(500, "Bio deve ter no máximo 500 caracteres").optional(),
  location: z.string().optional(),
  dateOfBirth: z.string().optional(),
  education: z.string().optional(),
  interests: z.string().optional(),
});

type PersonalInfoForm = z.infer<typeof personalInfoSchema>;

export default function PersonalInfoPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user profile data
  const { data: profile, isLoading } = useQuery<any>({
    queryKey: ["/api/user/profile"],
    enabled: !!user,
  });

  const form = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: profile?.name || user?.name || "",
      email: profile?.email || user?.email || "",
      phone: profile?.phone || "",
      bio: profile?.bio || "",
      location: profile?.location || "",
      dateOfBirth: profile?.dateOfBirth || "",
      education: profile?.education || "",
      interests: profile?.interests || "",
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: PersonalInfoForm) => {
      const response = await apiRequest("PUT", "/api/user/profile", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      setIsEditing(false);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações pessoais foram salvas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PersonalInfoForm) => {
    updateProfileMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <main className="flex-1 p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-96 bg-muted rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const userData = profile || {
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar,
    joinDate: new Date().toISOString(),
    totalStudyTime: 0,
    completedSubjects: 0,
    currentStreak: 0,
    achievements: [],
    ...form.getValues()
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Informações Pessoais</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie suas informações pessoais e preferências de estudo
            </p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
          >
            {isEditing ? "Cancelar" : "Editar Perfil"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
                {/* Personal Information Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Informações Básicas
                    </CardTitle>
                    <CardDescription>
                      Suas informações pessoais principais
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isEditing ? (
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input
                              id="name"
                              {...form.register("name")}
                              placeholder="Seu nome completo"
                            />
                            {form.formState.errors.name && (
                              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              {...form.register("email")}
                              placeholder="seu@email.com"
                            />
                            {form.formState.errors.email && (
                              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Telefone</Label>
                            <Input
                              id="phone"
                              {...form.register("phone")}
                              placeholder="(11) 99999-9999"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                            <Input
                              id="dateOfBirth"
                              type="date"
                              {...form.register("dateOfBirth")}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="location">Localização</Label>
                          <Input
                            id="location"
                            {...form.register("location")}
                            placeholder="Cidade, Estado, País"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="education">Formação Acadêmica</Label>
                          <Input
                            id="education"
                            {...form.register("education")}
                            placeholder="Seu nível de formação"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            {...form.register("bio")}
                            placeholder="Conte um pouco sobre você..."
                            rows={4}
                          />
                          {form.formState.errors.bio && (
                            <p className="text-sm text-destructive">{form.formState.errors.bio.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="interests">Interesses</Label>
                          <Input
                            id="interests"
                            {...form.register("interests")}
                            placeholder="Áreas de interesse separadas por vírgula"
                          />
                        </div>

                        <div className="flex justify-end gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="submit"
                            disabled={updateProfileMutation.isPending}
                          >
                            {updateProfileMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Salvando...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Salvar Alterações
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Nome</p>
                              <p className="text-sm text-muted-foreground">{userData.name || "Não informado"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Email</p>
                              <p className="text-sm text-muted-foreground">{userData.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Telefone</p>
                              <p className="text-sm text-muted-foreground">{userData.phone || "Não informado"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Data de Nascimento</p>
                              <p className="text-sm text-muted-foreground">{userData.dateOfBirth || "Não informado"}</p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Localização</p>
                              <p className="text-sm text-muted-foreground">{userData.location || "Não informado"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <GraduationCap className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Formação</p>
                              <p className="text-sm text-muted-foreground">{userData.education || "Não informado"}</p>
                            </div>
                          </div>
                        </div>

                        {(userData.bio || userData.interests) && (
                          <>
                            <Separator />
                            <div className="space-y-4">
                              {userData.bio && (
                                <div>
                                  <p className="text-sm font-medium mb-2">Bio</p>
                                  <p className="text-sm text-muted-foreground">{userData.bio}</p>
                                </div>
                              )}
                              {userData.interests && (
                                <div>
                                  <p className="text-sm font-medium mb-2">Interesses</p>
                                  <div className="flex flex-wrap gap-2">
                                    {userData.interests.split(',').map((interest, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {interest.trim()}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Study Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Estatísticas de Estudo
                    </CardTitle>
                    <CardDescription>
                      Seu progresso e conquistas no Study Cycle
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                          <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-2xl font-bold">{userData.totalStudyTime || 0}h</p>
                        <p className="text-sm text-muted-foreground">Tempo Total</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-2xl font-bold">{userData.completedSubjects || 0}</p>
                        <p className="text-sm text-muted-foreground">Matérias</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <p className="text-2xl font-bold">{userData.currentStreak || 0}</p>
                        <p className="text-sm text-muted-foreground">Sequência</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <p className="text-2xl font-bold">{userData.achievements?.length || 0}</p>
                        <p className="text-sm text-muted-foreground">Conquistas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Profile Picture */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Foto do Perfil</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <Avatar className="w-24 h-24 mx-auto">
                      <AvatarImage src={userData.avatar} />
                      <AvatarFallback className="text-lg">
                        {userData.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" className="w-full">
                      <Camera className="h-4 w-4 mr-2" />
                      Alterar Foto
                    </Button>
                  </CardContent>
                </Card>

                {/* Account Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informações da Conta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Membro desde</span>
                      <span className="text-sm font-medium">
                        {new Date(userData.joinDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant="default">
                        {user?.isTeacher ? "Professor" : "Estudante"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tipo de conta</span>
                      <Badge variant="secondary">Premium</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
        </div>
      </div>
        </main>
      </div>
    </div>
  );
}

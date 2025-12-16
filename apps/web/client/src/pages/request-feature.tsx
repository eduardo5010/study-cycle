import Header from "@/components/header";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import LeftSidebar from "@/components/left-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Lightbulb,
  Send,
  CheckCircle,
  Clock,
  Users,
  Star,
  MessageSquare,
  Zap,
  BookOpen,
  Calendar,
  Bell,
  Shield,
  Loader2,
  Sparkles
} from "lucide-react";

const requestFeatureSchema = z.object({
  title: z.string().min(5, "Título deve ter pelo menos 5 caracteres").max(100, "Título deve ter no máximo 100 caracteres"),
  description: z.string().min(20, "Descrição deve ter pelo menos 20 caracteres").max(1000, "Descrição deve ter no máximo 1000 caracteres"),
  category: z.enum(["study_tools", "social_features", "gamification", "content", "technical", "ui_ux", "other"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  featureType: z.enum(["new_feature", "improvement", "bug_fix", "integration"]),
});

type RequestFeatureForm = z.infer<typeof requestFeatureSchema>;

export default function RequestFeaturePage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<RequestFeatureForm>({
    resolver: zodResolver(requestFeatureSchema),
    defaultValues: {
      category: "study_tools",
      priority: "medium",
      featureType: "new_feature",
    },
  });

  // Submit feature request mutation
  const submitFeatureRequestMutation = useMutation({
    mutationFn: async (data: RequestFeatureForm) => {
      const response = await apiRequest("POST", "/api/feature-requests", data);
      return response.json();
    },
    onSuccess: () => {
      form.reset();
      toast({
        title: "Solicitação enviada!",
        description: "Sua sugestão foi registrada com sucesso. Agradecemos seu feedback!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua solicitação. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RequestFeatureForm) => {
    submitFeatureRequestMutation.mutate(data);
  };

  const categories = [
    {
      value: "study_tools",
      label: "Ferramentas de Estudo",
      icon: BookOpen,
      description: "Flashcards, cronômetros, calendários, etc.",
      color: "text-blue-600"
    },
    {
      value: "social_features",
      label: "Recursos Sociais",
      icon: Users,
      description: "Grupos de estudo, mensagens, fóruns, etc.",
      color: "text-green-600"
    },
    {
      value: "gamification",
      label: "Gamificação",
      icon: Star,
      description: "Conquistas, níveis, rankings, recompensas",
      color: "text-yellow-600"
    },
    {
      value: "content",
      label: "Conteúdo",
      icon: Lightbulb,
      description: "Cursos, materiais, bibliotecas, etc.",
      color: "text-purple-600"
    },
    {
      value: "technical",
      label: "Técnico",
      icon: Zap,
      description: "Performance, segurança, integrações",
      color: "text-red-600"
    },
    {
      value: "ui_ux",
      label: "Interface e UX",
      icon: Sparkles,
      description: "Design, usabilidade, acessibilidade",
      color: "text-pink-600"
    },
    {
      value: "other",
      label: "Outros",
      icon: MessageSquare,
      description: "Outras sugestões e ideias",
      color: "text-gray-600"
    }
  ];

  const priorities = [
    {
      value: "low",
      label: "Baixa",
      description: "Seria bom ter, mas não é urgente",
      color: "text-gray-600",
      bgColor: "bg-gray-100 dark:bg-gray-900/30"
    },
    {
      value: "medium",
      label: "Média",
      description: "Importante para melhorar a experiência",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      value: "high",
      label: "Alta",
      description: "Muito importante para o sucesso",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30"
    },
    {
      value: "critical",
      label: "Crítica",
      description: "Essencial para o funcionamento adequado",
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30"
    }
  ];

  const featureTypes = [
    {
      value: "new_feature",
      label: "Nova Funcionalidade",
      description: "Algo completamente novo",
      icon: Lightbulb
    },
    {
      value: "improvement",
      label: "Melhoria",
      description: "Aprimorar algo que já existe",
      icon: Star
    },
    {
      value: "bug_fix",
      label: "Correção de Bug",
      description: "Resolver um problema ou erro",
      icon: Shield
    },
    {
      value: "integration",
      label: "Integração",
      description: "Conectar com outros serviços",
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Solicitar Funcionalidade</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Sua opinião é muito importante! Ajude-nos a melhorar o Study Cycle sugerindo novas funcionalidades,
                melhorias ou relatando problemas que você encontrou.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="h-5 w-5 text-primary" />
                      Detalhes da Solicitação
                    </CardTitle>
                    <CardDescription>
                      Preencha as informações abaixo para nos ajudar a entender sua sugestão
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Title */}
                      <div className="space-y-2">
                        <Label htmlFor="title">Título da Solicitação *</Label>
                        <Input
                          id="title"
                          {...form.register("title")}
                          placeholder="Ex: Adicionar modo escuro para flashcards"
                        />
                        {form.formState.errors.title && (
                          <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                        )}
                      </div>

                      {/* Category */}
                      <div className="space-y-3">
                        <Label>Categoria *</Label>
                        <RadioGroup
                          value={form.watch("category")}
                          onValueChange={(value) => form.setValue("category", value as any)}
                          className="grid grid-cols-1 md:grid-cols-2 gap-3"
                        >
                          {categories.map((category) => {
                            const Icon = category.icon;
                            return (
                              <div key={category.value}>
                                <RadioGroupItem
                                  value={category.value}
                                  id={category.value}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={category.value}
                                  className="flex items-center space-x-3 rounded-lg border-2 border-muted p-3 cursor-pointer hover:bg-accent peer-checked:border-primary peer-checked:bg-primary/5"
                                >
                                  <Icon className={`h-5 w-5 ${category.color}`} />
                                  <div className="flex-1">
                                    <div className="font-medium">{category.label}</div>
                                    <div className="text-sm text-muted-foreground">{category.description}</div>
                                  </div>
                                </Label>
                              </div>
                            );
                          })}
                        </RadioGroup>
                        {form.formState.errors.category && (
                          <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
                        )}
                      </div>

                      {/* Feature Type */}
                      <div className="space-y-3">
                        <Label>Tipo de Solicitação *</Label>
                        <Select
                          value={form.watch("featureType")}
                          onValueChange={(value) => form.setValue("featureType", value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {featureTypes.map((type) => {
                              const Icon = type.icon;
                              return (
                                <SelectItem key={type.value} value={type.value}>
                                  <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    <div>
                                      <div className="font-medium">{type.label}</div>
                                      <div className="text-xs text-muted-foreground">{type.description}</div>
                                    </div>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        {form.formState.errors.featureType && (
                          <p className="text-sm text-destructive">{form.formState.errors.featureType.message}</p>
                        )}
                      </div>

                      {/* Priority */}
                      <div className="space-y-3">
                        <Label>Prioridade *</Label>
                        <RadioGroup
                          value={form.watch("priority")}
                          onValueChange={(value) => form.setValue("priority", value as any)}
                          className="grid grid-cols-2 md:grid-cols-4 gap-3"
                        >
                          {priorities.map((priority) => (
                            <div key={priority.value}>
                              <RadioGroupItem
                                value={priority.value}
                                id={priority.value}
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor={priority.value}
                                className={`flex flex-col items-center space-y-2 rounded-lg border-2 p-3 cursor-pointer hover:bg-accent text-center ${
                                  form.watch("priority") === priority.value
                                    ? "border-primary bg-primary/5"
                                    : "border-muted"
                                }`}
                              >
                                <Badge variant="outline" className={priority.color}>
                                  {priority.label}
                                </Badge>
                                <div className="text-xs text-muted-foreground">
                                  {priority.description}
                                </div>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        {form.formState.errors.priority && (
                          <p className="text-sm text-destructive">{form.formState.errors.priority.message}</p>
                        )}
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <Label htmlFor="description">Descrição Detalhada *</Label>
                        <Textarea
                          id="description"
                          {...form.register("description")}
                          placeholder="Descreva sua sugestão em detalhes. Inclua exemplos de uso, benefícios esperados e qualquer informação adicional que possa ajudar nossa equipe a entender melhor sua ideia."
                          rows={6}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Dicas: Seja específico, inclua exemplos e explique o impacto esperado</span>
                          <span>{form.watch("description")?.length || 0}/1000</span>
                        </div>
                        {form.formState.errors.description && (
                          <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                        )}
                      </div>

                      {/* Submit */}
                      <div className="flex justify-end pt-4">
                        <Button
                          type="submit"
                          disabled={submitFeatureRequestMutation.isPending}
                          className="min-w-[140px]"
                        >
                          {submitFeatureRequestMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Enviar Solicitação
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Guidelines */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Dicas para Boas Solicitações</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <strong>Seja específico:</strong> Descreva exatamente o que você quer e como funcionaria
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <strong>Inclua exemplos:</strong> Mostre casos de uso reais da sua sugestão
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <strong>Explique o impacto:</strong> Como isso beneficiaria você e outros usuários
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <strong>Verifique duplicatas:</strong> Procure se alguém já sugeriu algo similar
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Requests */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Solicitações Recentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Modo offline para flashcards</p>
                          <p className="text-xs text-muted-foreground">2 dias atrás • Em análise</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Grupos de estudo por disciplina</p>
                          <p className="text-xs text-muted-foreground">1 semana atrás • Em desenvolvimento</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                          <Star className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Sistema de conquistas aprimorado</p>
                          <p className="text-xs text-muted-foreground">2 semanas atrás • Implementado</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Impacto da Comunidade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">247</div>
                        <div className="text-sm text-muted-foreground">Funcionalidades implementadas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">1.2k</div>
                        <div className="text-sm text-muted-foreground">Solicitações enviadas</div>
                      </div>
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

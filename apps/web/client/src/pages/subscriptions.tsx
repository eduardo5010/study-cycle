import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import Header from "@/components/header";
import LeftSidebar from "@/components/left-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Crown,
  Star,
  CheckCircle,
  Calendar,
  CreditCard,
  Zap,
  BookOpen,
  Users,
  HeadphonesIcon,
  Download,
  MessageSquare,
  Shield,
  Sparkles,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function SubscriptionsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user subscription data
  const { data: subscription, isLoading } = useQuery<any>({
    queryKey: ["/api/user/subscription"],
    enabled: !!user,
  });

  // Fetch available plans
  const { data: plans } = useQuery<any>({
    queryKey: ["/api/subscriptions/plans"],
  });

  // Upgrade subscription mutation
  const upgradeMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await apiRequest("POST", "/api/subscriptions/upgrade", { planId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/subscription"] });
      toast({
        title: "Assinatura atualizada",
        description: "Sua assinatura foi atualizada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a assinatura. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Cancel subscription mutation
  const cancelMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/subscriptions/cancel");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/subscription"] });
      toast({
        title: "Assinatura cancelada",
        description: "Sua assinatura foi cancelada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível cancelar a assinatura. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleUpgrade = (planId: string) => {
    upgradeMutation.mutate(planId);
  };

  const handleCancel = () => {
    if (confirm("Tem certeza que deseja cancelar sua assinatura?")) {
      cancelMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <main className="flex-1 p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-muted rounded"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  const currentPlan = subscription || {
    plan: "free",
    status: "active",
    expiresAt: null,
    features: ["Acesso básico", "5 matérias", "Suporte por email"],
    usage: {
      subjects: 2,
      subjectsLimit: 5,
      flashcards: 50,
      flashcardsLimit: 100,
    }
  };

  const availablePlans = plans || [
    {
      id: "free",
      name: "Gratuito",
      price: 0,
      period: "mês",
      features: [
        "Até 5 matérias",
        "100 flashcards",
        "Suporte por email",
        "Acesso básico aos cursos"
      ],
      color: "gray",
      icon: BookOpen,
      popular: false
    },
    {
      id: "premium",
      name: "Premium",
      price: 19.99,
      period: "mês",
      features: [
        "Matérias ilimitadas",
        "Flashcards ilimitados",
        "Suporte prioritário",
        "Cursos premium",
        "Relatórios avançados",
        "Grupos de estudo exclusivos"
      ],
      color: "primary",
      icon: Crown,
      popular: true
    },
    {
      id: "pro",
      name: "Profissional",
      price: 39.99,
      period: "mês",
      features: [
        "Tudo do Premium",
        "Criação de cursos",
        "Análises detalhadas",
        "Suporte 24/7",
        "API access",
        "White-label options"
      ],
      color: "purple",
      icon: Sparkles,
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Assinaturas</h1>
                <p className="text-muted-foreground mt-2">
                  Gerencie seu plano e benefícios do Study Cycle
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Current Plan */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-primary" />
                      Plano Atual
                    </CardTitle>
                    <CardDescription>
                      Seu plano ativo e benefícios
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Crown className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold capitalize">{currentPlan.plan}</h3>
                      <Badge
                        variant={currentPlan.status === "active" ? "default" : "secondary"}
                        className="mt-2"
                      >
                        {currentPlan.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-semibold">Recursos Inclusos</h4>
                      <ul className="space-y-2">
                        {currentPlan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-semibold">Uso Atual</h4>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Matérias</span>
                            <span>{currentPlan.usage.subjects}/{currentPlan.usage.subjectsLimit}</span>
                          </div>
                          <Progress
                            value={(currentPlan.usage.subjects / currentPlan.usage.subjectsLimit) * 100}
                            className="h-2"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Flashcards</span>
                            <span>{currentPlan.usage.flashcards}/{currentPlan.usage.flashcardsLimit}</span>
                          </div>
                          <Progress
                            value={(currentPlan.usage.flashcards / currentPlan.usage.flashcardsLimit) * 100}
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>

                    {currentPlan.expiresAt && (
                      <>
                        <Separator />
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Renova em {new Date(currentPlan.expiresAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </>
                    )}

                    {currentPlan.plan !== "free" && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleCancel}
                        disabled={cancelMutation.isPending}
                      >
                        {cancelMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Cancelando...
                          </>
                        ) : (
                          "Cancelar Assinatura"
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Available Plans */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availablePlans.map((plan) => {
                    const Icon = plan.icon;
                    const isCurrentPlan = plan.id === currentPlan.plan;

                    return (
                      <Card
                        key={plan.id}
                        className={`relative ${plan.popular ? 'ring-2 ring-primary' : ''} ${isCurrentPlan ? 'bg-primary/5' : ''}`}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-primary text-primary-foreground">
                              Mais Popular
                            </Badge>
                          </div>
                        )}

                        <CardHeader className="text-center pb-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${
                            plan.color === 'primary' ? 'bg-primary/10' :
                            plan.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                            'bg-gray-100 dark:bg-gray-900/30'
                          }`}>
                            <Icon className={`h-6 w-6 ${
                              plan.color === 'primary' ? 'text-primary' :
                              plan.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                              'text-gray-600 dark:text-gray-400'
                            }`} />
                          </div>
                          <CardTitle className="text-xl">{plan.name}</CardTitle>
                          <div className="text-3xl font-bold">
                            {plan.price === 0 ? "Grátis" : `R$ ${plan.price}`}
                            {plan.price > 0 && <span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>}
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <ul className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>

                          <Separator />

                          <Button
                            className="w-full"
                            variant={isCurrentPlan ? "outline" : plan.color === 'primary' ? "default" : "secondary"}
                            disabled={isCurrentPlan || upgradeMutation.isPending}
                            onClick={() => handleUpgrade(plan.id)}
                          >
                            {upgradeMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Processando...
                              </>
                            ) : isCurrentPlan ? (
                              "Plano Atual"
                            ) : plan.price === 0 ? (
                              "Selecionar"
                            ) : (
                              `Assinar ${plan.name}`
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Billing History */}
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Histórico de Cobrança
                    </CardTitle>
                    <CardDescription>
                      Suas faturas e pagamentos recentes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b">
                        <div>
                          <p className="font-medium">Assinatura Premium</p>
                          <p className="text-sm text-muted-foreground">01 Jan 2025</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R$ 19,99</p>
                          <Badge variant="default" className="text-xs">Pago</Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b">
                        <div>
                          <p className="font-medium">Assinatura Premium</p>
                          <p className="text-sm text-muted-foreground">01 Dez 2024</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R$ 19,99</p>
                          <Badge variant="default" className="text-xs">Pago</Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium">Assinatura Premium</p>
                          <p className="text-sm text-muted-foreground">01 Nov 2024</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R$ 19,99</p>
                          <Badge variant="default" className="text-xs">Pago</Badge>
                        </div>
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

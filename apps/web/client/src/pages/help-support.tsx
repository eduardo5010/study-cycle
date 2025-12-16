import Header from "@/components/header";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { useMutation } from "@tanstack/react-query";
import LeftSidebar from "@/components/left-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  HelpCircle,
  MessageSquare,
  Book,
  Video,
  Mail,
  Phone,
  Search,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Users,
  Settings,
  CreditCard,
  Shield,
  Loader2,
  ExternalLink,
  Download,
  FileText
} from "lucide-react";

const supportTicketSchema = z.object({
  subject: z.string().min(5, "Assunto deve ter pelo menos 5 caracteres").max(100, "Assunto deve ter no máximo 100 caracteres"),
  category: z.enum(["account", "billing", "technical", "study_tools", "courses", "other"]),
  priority: z.enum(["low", "normal", "high", "urgent"]),
  message: z.string().min(20, "Mensagem deve ter pelo menos 20 caracteres").max(2000, "Mensagem deve ter no máximo 2000 caracteres"),
});

type SupportTicketForm = z.infer<typeof supportTicketSchema>;

export default function HelpSupportPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<SupportTicketForm>({
    resolver: zodResolver(supportTicketSchema),
    defaultValues: {
      category: "other",
      priority: "normal",
    },
  });

  // Submit support ticket mutation
  const submitTicketMutation = useMutation({
    mutationFn: async (data: SupportTicketForm) => {
      const response = await apiRequest("POST", "/api/support/tickets", data);
      return response.json();
    },
    onSuccess: () => {
      form.reset();
      toast({
        title: "Ticket enviado!",
        description: "Recebemos sua solicitação. Responderemos em até 24 horas.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o ticket. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SupportTicketForm) => {
    submitTicketMutation.mutate(data);
  };

  const faqs = [
    {
      question: "Como posso redefinir minha senha?",
      answer: "Para redefinir sua senha, clique em 'Esqueci minha senha' na página de login. Você receberá um email com instruções para criar uma nova senha.",
      category: "account"
    },
    {
      question: "Como cancelar minha assinatura?",
      answer: "Acesse Configurações > Assinaturas e clique em 'Cancelar Assinatura'. Você continuará tendo acesso até o final do período pago.",
      category: "billing"
    },
    {
      question: "Os meus dados estão seguros?",
      answer: "Sim! Utilizamos criptografia de ponta a ponta e seguimos os mais altos padrões de segurança. Seus dados nunca são compartilhados sem sua permissão.",
      category: "technical"
    },
    {
      question: "Como criar flashcards eficazes?",
      answer: "Use a técnica Feynman: explique o conceito em suas próprias palavras, seja conciso, inclua exemplos práticos e revise regularmente usando nosso sistema de repetição espaçada.",
      category: "study_tools"
    },
    {
      question: "Posso fazer download dos materiais dos cursos?",
      answer: "Sim, na maioria dos cursos você pode fazer download dos materiais em PDF. Procure pelo ícone de download nas páginas dos cursos.",
      category: "courses"
    },
    {
      question: "Como entro em contato com meu professor?",
      answer: "Use o sistema de mensagens integrado. Clique no nome do professor no perfil do curso ou na seção de professores.",
      category: "courses"
    },
    {
      question: "O app funciona offline?",
      answer: "Atualmente, alguns recursos como flashcards podem ser acessados offline após sincronização. Estamos trabalhando para expandir o suporte offline.",
      category: "technical"
    },
    {
      question: "Como personalizar minhas configurações de estudo?",
      answer: "Acesse Configurações > Preferências de Estudo. Você pode ajustar horários, metas diárias, tipos de memória e outras preferências.",
      category: "study_tools"
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickActions = [
    {
      title: "Verificar Status da Conta",
      description: "Confira informações da sua conta e assinatura",
      icon: Shield,
      action: () => window.open("/profile", "_blank"),
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      title: "Gerenciar Pagamentos",
      description: "Atualizar métodos de pagamento e ver faturas",
      icon: CreditCard,
      action: () => window.open("/payment-methods", "_blank"),
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30"
    },
    {
      title: "Configurações de Estudo",
      description: "Ajustar preferências de aprendizado",
      icon: Settings,
      action: () => window.open("/settings", "_blank"),
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      title: "Central de Ajuda",
      description: "Artigos detalhados e guias completos",
      icon: Book,
      action: () => window.open("https://help.study-cycle.com", "_blank"),
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30"
    }
  ];

  const contactMethods = [
    {
      title: "Chat ao Vivo",
      description: "Converse com nossa equipe em tempo real",
      icon: MessageSquare,
      available: "Disponível 24/7",
      responseTime: "Resposta imediata",
      action: () => {/* Open chat widget */},
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30"
    },
    {
      title: "Email",
      description: "Envie-nos um email detalhado",
      icon: Mail,
      available: "Segunda a Sexta",
      responseTime: "Até 24 horas",
      action: () => window.open("mailto:support@study-cycle.com"),
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      title: "Central de Ajuda",
      description: "Base de conhecimento completa",
      icon: Book,
      available: "Sempre disponível",
      responseTime: "Imediato",
      action: () => window.open("https://help.study-cycle.com", "_blank"),
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 p-8 overflow-y-auto content-scroll">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Ajuda & Suporte</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Estamos aqui para ajudar! Encontre respostas rápidas, entre em contato conosco ou explore nossa documentação completa.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={action.action}>
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                        <Icon className={`h-6 w-6 ${action.color}`} />
                      </div>
                      <h3 className="font-semibold mb-2">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Tabs defaultValue="faq" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="faq">Perguntas Frequentes</TabsTrigger>
                <TabsTrigger value="contact">Fale Conosco</TabsTrigger>
                <TabsTrigger value="ticket">Abrir Ticket</TabsTrigger>
              </TabsList>

              {/* FAQ Tab */}
              <TabsContent value="faq" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-primary" />
                      Encontre Respostas Rápidas
                    </CardTitle>
                    <CardDescription>
                      Pesquise em nossa base de conhecimento
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Digite sua pergunta..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Perguntas Frequentes</CardTitle>
                    <CardDescription>
                      As dúvidas mais comuns dos nossos usuários
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFaqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>

                    {filteredFaqs.length === 0 && (
                      <div className="text-center py-8">
                        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Nenhuma pergunta encontrada para "{searchQuery}"
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Contact Tab */}
              <TabsContent value="contact" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {contactMethods.map((method, index) => {
                    const Icon = method.icon;
                    return (
                      <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={method.action}>
                        <CardHeader className="text-center pb-4">
                          <div className={`w-12 h-12 ${method.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                            <Icon className={`h-6 w-6 ${method.color}`} />
                          </div>
                          <CardTitle className="text-lg">{method.title}</CardTitle>
                          <CardDescription>{method.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-2">
                          <div className="flex items-center justify-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{method.available}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {method.responseTime}
                          </Badge>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-primary" />
                      Informações de Contato
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Suporte Técnico</h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p>Email: support@study-cycle.com</p>
                          <p>Horário: Segunda a Sexta, 9h às 18h (GMT-3)</p>
                          <p>Resposta média: 4 horas</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold">Suporte Comercial</h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p>Email: sales@study-cycle.com</p>
                          <p>Horário: Segunda a Sexta, 9h às 17h (GMT-3)</p>
                          <p>Resposta média: 2 horas</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        Para questões urgentes fora do horário comercial, utilize nosso chat ao vivo
                      </p>
                      <Button>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Iniciar Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Support Ticket Tab */}
              <TabsContent value="ticket" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Send className="h-5 w-5 text-primary" />
                          Abrir Ticket de Suporte
                        </CardTitle>
                        <CardDescription>
                          Para questões complexas que precisam de análise detalhada
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="subject">Assunto *</Label>
                              <Input
                                id="subject"
                                {...form.register("subject")}
                                placeholder="Descreva brevemente o problema"
                              />
                              {form.formState.errors.subject && (
                                <p className="text-sm text-destructive">{form.formState.errors.subject.message}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label>Categoria *</Label>
                              <Select
                                value={form.watch("category")}
                                onValueChange={(value) => form.setValue("category", value as any)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="account">Conta e Perfil</SelectItem>
                                  <SelectItem value="billing">Assinatura e Pagamento</SelectItem>
                                  <SelectItem value="technical">Problemas Técnicos</SelectItem>
                                  <SelectItem value="study_tools">Ferramentas de Estudo</SelectItem>
                                  <SelectItem value="courses">Cursos e Conteúdo</SelectItem>
                                  <SelectItem value="other">Outros</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Prioridade *</Label>
                            <Select
                              value={form.watch("priority")}
                              onValueChange={(value) => form.setValue("priority", value as any)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a prioridade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                    Baixa - Não urgente
                                  </div>
                                </SelectItem>
                                <SelectItem value="normal">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    Normal - Resposta em até 24h
                                  </div>
                                </SelectItem>
                                <SelectItem value="high">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                    Alta - Resposta em até 12h
                                  </div>
                                </SelectItem>
                                <SelectItem value="urgent">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                    Urgente - Resposta em até 4h
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="message">Mensagem Detalhada *</Label>
                            <Textarea
                              id="message"
                              {...form.register("message")}
                              placeholder="Descreva seu problema ou pergunta em detalhes. Inclua passos para reproduzir o problema, mensagens de erro, e qualquer informação adicional que possa ajudar."
                              rows={8}
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>Dicas: Seja específico e inclua capturas de tela se possível</span>
                              <span>{form.watch("message")?.length || 0}/2000</span>
                            </div>
                            {form.formState.errors.message && (
                              <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>
                            )}
                          </div>

                          <div className="flex justify-end">
                            <Button
                              type="submit"
                              disabled={submitTicketMutation.isPending}
                              className="min-w-[140px]"
                            >
                              {submitTicketMutation.isPending ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Enviando...
                                </>
                              ) : (
                                <>
                                  <Send className="h-4 w-4 mr-2" />
                                  Abrir Ticket
                                </>
                              )}
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    {/* Response Times */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Tempos de Resposta</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Baixa</span>
                          <span className="text-sm text-muted-foreground">Até 48h</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Normal</span>
                          <span className="text-sm text-muted-foreground">Até 24h</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Alta</span>
                          <span className="text-sm text-muted-foreground">Até 12h</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Urgente</span>
                          <span className="text-sm text-muted-foreground">Até 4h</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Useful Links */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Links Úteis</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button variant="ghost" className="w-full justify-start" asChild>
                          <a href="https://help.study-cycle.com" target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4 mr-2" />
                            Central de Ajuda
                            <ExternalLink className="h-3 w-3 ml-auto" />
                          </a>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                          <a href="https://status.study-cycle.com" target="_blank" rel="noopener noreferrer">
                            <Zap className="h-4 w-4 mr-2" />
                            Status do Sistema
                            <ExternalLink className="h-3 w-3 ml-auto" />
                          </a>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                          <a href="https://blog.study-cycle.com" target="_blank" rel="noopener noreferrer">
                            <Book className="h-4 w-4 mr-2" />
                            Blog e Novidades
                            <ExternalLink className="h-3 w-3 ml-auto" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}

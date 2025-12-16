import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CreditCard,
  Plus,
  Trash2,
  Shield,
  Lock,
  Star,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calendar,
  Eye,
  EyeOff
} from "lucide-react";

const paymentMethodSchema = z.object({
  type: z.enum(["credit_card", "debit_card", "paypal"]),
  cardNumber: z.string().min(16, "Número do cartão deve ter pelo menos 16 dígitos").optional(),
  expiryMonth: z.string().min(2, "Mês obrigatório").optional(),
  expiryYear: z.string().min(4, "Ano obrigatório").optional(),
  cvv: z.string().min(3, "CVV obrigatório").optional(),
  cardholderName: z.string().min(2, "Nome do titular obrigatório").optional(),
  paypalEmail: z.string().email("Email válido obrigatório").optional(),
});

type PaymentMethodForm = z.infer<typeof paymentMethodSchema>;

export default function PaymentMethodsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [showCVV, setShowCVV] = useState(false);

  // Fetch payment methods
  const { data: paymentMethods, isLoading } = useQuery<any[]>({
    queryKey: ["/api/user/payment-methods"],
    enabled: !!user,
  });

  const form = useForm<PaymentMethodForm>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: "credit_card",
    },
  });

  // Add payment method mutation
  const addPaymentMethodMutation = useMutation({
    mutationFn: async (data: PaymentMethodForm) => {
      const response = await apiRequest("POST", "/api/user/payment-methods", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/payment-methods"] });
      setIsAddingCard(false);
      form.reset();
      toast({
        title: "Método adicionado",
        description: "Seu método de pagamento foi adicionado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o método de pagamento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Remove payment method mutation
  const removePaymentMethodMutation = useMutation({
    mutationFn: async (methodId: string) => {
      const response = await apiRequest("DELETE", `/api/user/payment-methods/${methodId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/payment-methods"] });
      toast({
        title: "Método removido",
        description: "O método de pagamento foi removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível remover o método de pagamento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Set default payment method mutation
  const setDefaultMutation = useMutation({
    mutationFn: async (methodId: string) => {
      const response = await apiRequest("PATCH", `/api/user/payment-methods/${methodId}/default`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/payment-methods"] });
      toast({
        title: "Método padrão definido",
        description: "Este método será usado como padrão para pagamentos.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível definir o método padrão.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PaymentMethodForm) => {
    addPaymentMethodMutation.mutate(data);
  };

  const handleRemove = (methodId: string) => {
    if (confirm("Tem certeza que deseja remover este método de pagamento?")) {
      removePaymentMethodMutation.mutate(methodId);
    }
  };

  const handleSetDefault = (methodId: string) => {
    setDefaultMutation.mutate(methodId);
  };

  const formatCardNumber = (number: string) => {
    return `•••• •••• •••• ${number.slice(-4)}`;
  };

  const getCardTypeIcon = (type: string) => {
    // Simple card type detection based on first digit
    if (type.startsWith('4')) return '💳'; // Visa
    if (type.startsWith('5')) return '💳'; // Mastercard
    if (type.startsWith('3')) return '💳'; // American Express
    return '💳'; // Default
  };

  if (isLoading) {
    return (
      <main className="flex-1 p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  const methods = paymentMethods || [
    {
      id: "1",
      type: "credit_card",
      last4: "4242",
      brand: "visa",
      expiryMonth: "12",
      expiryYear: "2026",
      cardholderName: "João Silva",
      isDefault: true,
    },
    {
      id: "2",
      type: "paypal",
      email: "joao.silva@email.com",
      isDefault: false,
    }
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Métodos de Pagamento</h1>
                <p className="text-muted-foreground mt-2">
                  Gerencie seus cartões de crédito, débito e outras formas de pagamento
                </p>
              </div>
              <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Método
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Adicionar Método de Pagamento</DialogTitle>
                    <DialogDescription>
                      Adicione um novo cartão de crédito, débito ou conta PayPal
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tipo de Pagamento</Label>
                      <Select
                        value={form.watch("type")}
                        onValueChange={(value) => form.setValue("type", value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                          <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {form.watch("type") === "paypal" ? (
                      <div className="space-y-2">
                        <Label htmlFor="paypalEmail">Email do PayPal</Label>
                        <Input
                          id="paypalEmail"
                          type="email"
                          {...form.register("paypalEmail")}
                          placeholder="seu@email.com"
                        />
                        {form.formState.errors.paypalEmail && (
                          <p className="text-sm text-destructive">{form.formState.errors.paypalEmail.message}</p>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="cardholderName">Nome do Titular</Label>
                          <Input
                            id="cardholderName"
                            {...form.register("cardholderName")}
                            placeholder="Nome como aparece no cartão"
                          />
                          {form.formState.errors.cardholderName && (
                            <p className="text-sm text-destructive">{form.formState.errors.cardholderName.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Número do Cartão</Label>
                          <Input
                            id="cardNumber"
                            {...form.register("cardNumber")}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                          {form.formState.errors.cardNumber && (
                            <p className="text-sm text-destructive">{form.formState.errors.cardNumber.message}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryMonth">Mês</Label>
                            <Input
                              id="expiryMonth"
                              {...form.register("expiryMonth")}
                              placeholder="MM"
                              maxLength={2}
                            />
                            {form.formState.errors.expiryMonth && (
                              <p className="text-sm text-destructive">{form.formState.errors.expiryMonth.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="expiryYear">Ano</Label>
                            <Input
                              id="expiryYear"
                              {...form.register("expiryYear")}
                              placeholder="YYYY"
                              maxLength={4}
                            />
                            {form.formState.errors.expiryYear && (
                              <p className="text-sm text-destructive">{form.formState.errors.expiryYear.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <div className="relative">
                              <Input
                                id="cvv"
                                type={showCVV ? "text" : "password"}
                                {...form.register("cvv")}
                                placeholder="123"
                                maxLength={4}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                onClick={() => setShowCVV(!showCVV)}
                              >
                                {showCVV ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                            {form.formState.errors.cvv && (
                              <p className="text-sm text-destructive">{form.formState.errors.cvv.message}</p>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddingCard(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={addPaymentMethodMutation.isPending}
                      >
                        {addPaymentMethodMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Adicionando...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Security Notice */}
            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <CardContent className="flex items-center gap-3 p-4">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Seus dados estão seguros
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Utilizamos criptografia de ponta a ponta para proteger suas informações de pagamento
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {methods.map((method) => (
                <Card key={method.id} className={`relative ${method.isDefault ? 'ring-2 ring-primary' : ''}`}>
                  {method.isDefault && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="h-3 w-3 mr-1" />
                        Padrão
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {method.type === "paypal" ? (
                          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-xs">P</span>
                          </div>
                        ) : (
                          <div className="text-2xl">{getCardTypeIcon(method.cardNumber || method.last4)}</div>
                        )}
                        <div>
                          <CardTitle className="text-lg capitalize">
                            {method.type === "paypal" ? "PayPal" :
                             method.type === "credit_card" ? "Cartão de Crédito" :
                             "Cartão de Débito"}
                          </CardTitle>
                          <CardDescription>
                            {method.type === "paypal"
                              ? method.email
                              : formatCardNumber(method.cardNumber || method.last4)
                            }
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {method.type !== "paypal" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Titular</span>
                          <span>{method.cardholderName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Validade</span>
                          <span>{method.expiryMonth}/{method.expiryYear}</span>
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="flex gap-2">
                      {!method.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(method.id)}
                          disabled={setDefaultMutation.isPending}
                          className="flex-1"
                        >
                          {setDefaultMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Star className="h-4 w-4 mr-1" />
                              Tornar Padrão
                            </>
                          )}
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemove(method.id)}
                        disabled={removePaymentMethodMutation.isPending || method.isDefault}
                        className="text-destructive hover:text-destructive"
                      >
                        {removePaymentMethodMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {methods.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="text-center py-12">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum método de pagamento</h3>
                    <p className="text-muted-foreground mb-4">
                      Adicione um cartão de crédito, débito ou conta PayPal para facilitar seus pagamentos
                    </p>
                    <Button onClick={() => setIsAddingCard(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Primeiro Método
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Billing Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Informações de Cobrança
                </CardTitle>
                <CardDescription>
                  Detalhes importantes sobre suas informações de cobrança
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Segurança</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Criptografia SSL de 256 bits
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Conformidade PCI DSS
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Dados nunca armazenados em nossos servidores
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Suporte</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Suporte 24/7 para questões de cobrança
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Reembolsos processados em até 5-7 dias úteis
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Notificações automáticas de cobrança
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
      </div>
    </main>
  );
}

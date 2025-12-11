import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginData } from "@shared/schema";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import Header from "@/components/header";
import { LogIn, UserPlus, ArrowLeft, Github, Chrome } from "lucide-react";

export default function AuthLoginPage() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginData) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      // redirect to home
      window.location.href = "/home";
    } catch (err) {
      console.error(err);
      alert(t("auth.loginError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex-1 flex items-center justify-center p-6 pt-24">
        <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <LogIn className="h-7 w-7 text-primary" />
              {t("auth.login")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("auth.loginDescription") || "Entre com sua conta para continuar"}
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                {t("auth.email")}
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder={t("auth.emailPlaceholder") || "seu@email.com"}
                {...form.register("email")} 
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                {t("auth.password")}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={t("auth.passwordPlaceholder") || "••••••••"}
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    {t("modal.loading")}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    {t("auth.login")}
                  </span>
                )}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    {t("auth.or") || "ou"}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                asChild
              >
                <Link href="/auth/register">
                  <UserPlus className="h-4 w-4 mr-2" />
                  {t("auth.register")}
                </Link>
              </Button>

              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-3 text-center">
                  {t("auth.orSignInWith")}
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    asChild
                  >
                    <a href="/api/auth/oauth/github">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    asChild
                  >
                    <a href="/api/auth/oauth/google">
                      <Chrome className="h-4 w-4 mr-2" />
                      Google
                    </a>
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  asChild
                >
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t("auth.backToHome") || "Voltar para a página inicial"}
                  </Link>
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

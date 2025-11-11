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
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">{t("auth.login")}</h2>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-foreground mb-2"
            >
              {t("auth.email")}
            </Label>
            <Input id="email" type="email" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
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
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t("modal.loading") : t("auth.login")}
            </Button>

            <div className="flex gap-3">
              <Link
                href="/auth/register"
                className="flex-1 text-center py-2 border rounded"
              >
                {t("auth.register")}
              </Link>
            </div>

            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-2">
                {t("auth.orSignInWith")}
              </p>
              <div className="flex gap-2">
                <a
                  href="/api/auth/oauth/github"
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border rounded"
                >
                  GitHub
                </a>
                <a
                  href="/api/auth/oauth/google"
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border rounded"
                >
                  Google
                </a>
                <a
                  href="/api/auth/oauth/facebook"
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border rounded"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

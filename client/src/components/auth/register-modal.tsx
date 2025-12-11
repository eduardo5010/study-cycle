import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, InsertUser } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Github, Mail } from "lucide-react";

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: RegisterModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();
  const { register } = useAuth();
  const { toast } = useToast();

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      bio: "",
    },
  });

  const handleSubmit = async (data: InsertUser) => {
    setIsSubmitting(true);
    try {
      await register(data);
      form.reset();
      onClose();
      toast({
        title: t("auth.registerSuccess"),
        description: t("auth.welcomeMessage"),
      });
    } catch (error) {
      toast({
        title: t("toast.error"),
        description: t("auth.registerError"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md max-h-[90vh] overflow-y-auto"
        data-testid="modal-register"
      >
        <DialogHeader>
          <DialogTitle data-testid="modal-title">
            {t("auth.register")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-foreground mb-2"
            >
              {t("auth.name")}
            </Label>
            <Input
              id="name"
              type="text"
              placeholder={t("auth.namePlaceholder")}
              {...form.register("name")}
              className="w-full"
              data-testid="input-name"
            />
            {form.formState.errors.name && (
              <p
                className="text-sm text-destructive mt-1"
                data-testid="error-name"
              >
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

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
              placeholder={t("auth.emailPlaceholder")}
              {...form.register("email")}
              className="w-full"
              data-testid="input-email"
            />
            {form.formState.errors.email && (
              <p
                className="text-sm text-destructive mt-1"
                data-testid="error-email"
              >
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="userType"
              className="block text-sm font-medium text-foreground mb-2"
            >
              {t("auth.userType")}
            </Label>
            <Select
              defaultValue="student"
              onValueChange={(value) => {
                form.setValue("isStudent", value === "student");
                form.setValue("isTeacher", value === "teacher");
                form.setValue("isAdmin", value === "admin");
              }}
            >
              <SelectTrigger data-testid="select-user-type">
                <SelectValue placeholder={t("auth.selectUserType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student" data-testid="option-student">
                  {t("auth.student")}
                </SelectItem>
                <SelectItem value="teacher" data-testid="option-teacher">
                  {t("auth.teacher")}
                </SelectItem>
              </SelectContent>
            </Select>
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
              placeholder={t("auth.passwordPlaceholder")}
              {...form.register("password")}
              className="w-full"
              data-testid="input-password"
            />
            {form.formState.errors.password && (
              <p
                className="text-sm text-destructive mt-1"
                data-testid="error-password"
              >
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-foreground mb-2"
            >
              {t("auth.confirmPassword")}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t("auth.confirmPasswordPlaceholder")}
              {...form.register("confirmPassword")}
              className="w-full"
              data-testid="input-confirm-password"
            />
            {form.formState.errors.confirmPassword && (
              <p
                className="text-sm text-destructive mt-1"
                data-testid="error-confirm-password"
              >
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="bio"
              className="block text-sm font-medium text-foreground mb-2"
            >
              {t("auth.bio")} ({t("auth.optional")})
            </Label>
            <Input
              id="bio"
              type="text"
              placeholder={t("auth.bioPlaceholder")}
              {...form.register("bio")}
              className="w-full"
              data-testid="input-bio"
            />
          </div>

          {/* OAuth Section */}
          <div className="pt-4">
            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background px-2 text-xs text-muted-foreground">
                  ou continue com
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  window.location.href = `${window.location.origin}/api/auth/oauth/github`;
                }}
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  window.location.href = `${window.location.origin}/api/auth/oauth/google`;
                }}
              >
                <GoogleIcon />
                <span className="ml-2">Google</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              data-testid="button-register-submit"
            >
              <Mail className="w-4 h-4 mr-2" />
              {isSubmitting ? t("modal.loading") : t("auth.register")}
            </Button>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                data-testid="button-cancel"
              >
                {t("modal.cancel")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={onSwitchToLogin}
                className="flex-1"
                data-testid="button-switch-login"
              >
                {t("auth.switchToLogin")}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

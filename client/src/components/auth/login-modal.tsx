import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LoginData) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      form.reset();
      onClose();
      toast({
        title: t('auth.loginSuccess'),
        description: t('auth.welcomeBack'),
      });
    } catch (error) {
      toast({
        title: t('toast.error'),
        description: t('auth.loginError'),
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
      <DialogContent className="sm:max-w-md" data-testid="modal-login">
        <DialogHeader>
          <DialogTitle data-testid="modal-title">{t('auth.login')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              {t('auth.email')}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              {...form.register("email")}
              className="w-full"
              data-testid="input-email"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive mt-1" data-testid="error-email">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              {t('auth.password')}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={t('auth.passwordPlaceholder')}
              {...form.register("password")}
              className="w-full"
              data-testid="input-password"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive mt-1" data-testid="error-password">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          
          <div className="flex flex-col gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full"
              data-testid="button-login-submit"
            >
              {isSubmitting ? t('modal.loading') : t('auth.login')}
            </Button>
            
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                className="flex-1"
                data-testid="button-cancel"
              >
                {t('modal.cancel')}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onSwitchToRegister}
                className="flex-1"
                data-testid="button-switch-register"
              >
                {t('auth.switchToRegister')}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
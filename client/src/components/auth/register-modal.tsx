import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, InsertUser } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
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
      userType: "student",
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
        title: t('auth.registerSuccess'),
        description: t('auth.welcomeMessage'),
      });
    } catch (error) {
      toast({
        title: t('toast.error'),
        description: t('auth.registerError'),
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" data-testid="modal-register">
        <DialogHeader>
          <DialogTitle data-testid="modal-title">{t('auth.register')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              {t('auth.name')}
            </Label>
            <Input
              id="name"
              type="text"
              placeholder={t('auth.namePlaceholder')}
              {...form.register("name")}
              className="w-full"
              data-testid="input-name"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1" data-testid="error-name">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

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
            <Label htmlFor="userType" className="block text-sm font-medium text-foreground mb-2">
              {t('auth.userType')}
            </Label>
            <Select 
              value={form.watch("userType")} 
              onValueChange={(value) => form.setValue("userType", value)}
            >
              <SelectTrigger data-testid="select-user-type">
                <SelectValue placeholder={t('auth.selectUserType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student" data-testid="option-student">
                  {t('auth.student')}
                </SelectItem>
                <SelectItem value="teacher" data-testid="option-teacher">
                  {t('auth.teacher')}
                </SelectItem>
              </SelectContent>
            </Select>
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

          <div>
            <Label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
              {t('auth.confirmPassword')}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t('auth.confirmPasswordPlaceholder')}
              {...form.register("confirmPassword")}
              className="w-full"
              data-testid="input-confirm-password"
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive mt-1" data-testid="error-confirm-password">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="bio" className="block text-sm font-medium text-foreground mb-2">
              {t('auth.bio')} ({t('auth.optional')})
            </Label>
            <Input
              id="bio"
              type="text"
              placeholder={t('auth.bioPlaceholder')}
              {...form.register("bio")}
              className="w-full"
              data-testid="input-bio"
            />
          </div>
          
          <div className="flex flex-col gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full"
              data-testid="button-register-submit"
            >
              {isSubmitting ? t('modal.loading') : t('auth.register')}
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
                onClick={onSwitchToLogin}
                className="flex-1"
                data-testid="button-switch-login"
              >
                {t('auth.switchToLogin')}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
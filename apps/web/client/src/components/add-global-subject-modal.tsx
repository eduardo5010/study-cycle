import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGlobalSubjectSchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface AddGlobalSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: z.infer<typeof insertGlobalSubjectSchema>) => void;
}

export default function AddGlobalSubjectModal({ isOpen, onClose, onSubmit }: AddGlobalSubjectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  const form = useForm<z.infer<typeof insertGlobalSubjectSchema>>({
    resolver: zodResolver(insertGlobalSubjectSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof insertGlobalSubjectSchema>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
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
      <DialogContent className="sm:max-w-md" data-testid="modal-add-global-subject">
        <DialogHeader>
          <DialogTitle data-testid="modal-title">{t('subjects.addGlobal')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              {t('subjects.name')}
            </Label>
            <Input
              id="name"
              type="text"
              placeholder={t('subjects.nameExample')}
              {...form.register("name")}
              className="w-full"
              data-testid="input-subject-name"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1" data-testid="error-subject-name">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          
          <div className="flex gap-3 pt-4">
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
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
              data-testid="button-add-global-subject-submit"
            >
              {isSubmitting ? t('modal.adding') : t('modal.add')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
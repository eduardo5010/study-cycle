import { useState } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSubjectSchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const formSchema = insertSubjectSchema.extend({
  hours: z.number().min(0).max(23),
  minutes: z.number().min(0).max(59),
});

type FormData = z.infer<typeof formSchema>;

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
}

export default function AddSubjectModal({ isOpen, onClose, onSubmit }: AddSubjectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      hours: 2,
      minutes: 0,
    },
  });

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error adding subject:", error);
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
      <DialogContent className="max-w-md" data-testid="modal-add-subject">
        <DialogHeader>
          <DialogTitle data-testid="modal-title">Adicionar Nova Disciplina</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" data-testid="form-add-subject">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Nome da Disciplina
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Ex: Matemática"
              {...form.register("name")}
              className="w-full"
              data-testid="input-subject-name"
            />
            {form.formState.errors.name && (
              <p className="text-destructive text-sm mt-1" data-testid="error-subject-name">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hours" className="block text-sm font-medium text-foreground mb-2">
                Horas
              </Label>
              <Input
                id="hours"
                type="number"
                min="0"
                max="23"
                placeholder="2"
                {...form.register("hours", { valueAsNumber: true })}
                className="w-full"
                data-testid="input-subject-hours"
              />
              {form.formState.errors.hours && (
                <p className="text-destructive text-sm mt-1" data-testid="error-subject-hours">
                  {form.formState.errors.hours.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="minutes" className="block text-sm font-medium text-foreground mb-2">
                Minutos
              </Label>
              <Select 
                value={form.watch("minutes")?.toString() || "0"}
                onValueChange={(value) => form.setValue("minutes", parseInt(value))}
              >
                <SelectTrigger className="w-full" data-testid="select-subject-minutes">
                  <SelectValue placeholder="00" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">00</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="45">45</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.minutes && (
                <p className="text-destructive text-sm mt-1" data-testid="error-subject-minutes">
                  {form.formState.errors.minutes.message}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
              data-testid="button-cancel"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
              data-testid="button-add-subject-submit"
            >
              {isSubmitting ? "Adicionando..." : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

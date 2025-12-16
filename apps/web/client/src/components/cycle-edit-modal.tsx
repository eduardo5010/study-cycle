import { useState } from "react";
import { Trash2, Edit3, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Subject } from "@shared/schema";

interface CycleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onCycleDeleted: () => void;
}

export default function CycleEditModal({ 
  isOpen, 
  onClose, 
  subjects,
  onCycleDeleted 
}: CycleEditModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleDeleteCycle = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/cycles/clear", {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Ciclo excluído com sucesso",
          description: "Todos os dados do ciclo foram removidos.",
        });
        onCycleDeleted();
        onClose();
      } else {
        throw new Error('Failed to delete cycle');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir o ciclo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleClose = () => {
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-cycle-edit">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" data-testid="modal-title">
            <Edit3 className="h-5 w-5" />
            Editar Ciclo
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foreground">
              Informações do Ciclo Atual
            </h3>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">
                Número de disciplinas: <span className="font-medium text-foreground">{subjects.length}</span>
              </p>
              {subjects.length > 0 && (
                <div className="space-y-1">
                  {subjects.slice(0, 3).map((subject) => (
                    <p key={subject.id} className="text-sm text-foreground">
                      • {subject.name} ({subject.hours}h {subject.minutes}min)
                    </p>
                  ))}
                  {subjects.length > 3 && (
                    <p className="text-sm text-muted-foreground">
                      ... e mais {subjects.length - 3} disciplinas
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foreground">
              Zona de Perigo
            </h3>
            
            {!showDeleteConfirm ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-destructive mb-1">
                      Excluir Ciclo Completo
                    </h4>
                    <p className="text-sm text-destructive/80 mb-3">
                      Esta ação irá remover permanentemente todas as disciplinas, horários e dados do ciclo atual. Esta ação não pode ser desfeita.
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteCycle}
                      disabled={isDeleting}
                      data-testid="button-delete-cycle"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir Ciclo
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-destructive rounded-lg p-4">
                <div className="text-center space-y-3">
                  <AlertTriangle className="h-8 w-8 text-destructive-foreground mx-auto" />
                  <div>
                    <h4 className="font-medium text-destructive-foreground mb-1">
                      Tem certeza absoluta?
                    </h4>
                    <p className="text-sm text-destructive-foreground/80">
                      Esta ação não pode ser desfeita e removerá todos os dados do ciclo.
                    </p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                      data-testid="button-cancel-delete"
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteCycle}
                      disabled={isDeleting}
                      data-testid="button-confirm-delete"
                    >
                      {isDeleting ? "Excluindo..." : "Sim, Excluir Definitivamente"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={handleClose}
            data-testid="button-close"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
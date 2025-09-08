import { Plus, Settings, Download } from "lucide-react";

interface QuickActionsProps {
  onAddSubject: () => void;
  onConfigureSchedule: () => void;
  onExportSchedule: () => void;
}

export default function QuickActions({ 
  onAddSubject, 
  onConfigureSchedule, 
  onExportSchedule 
}: QuickActionsProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4" data-testid="title-quick-actions">
        Ações Rápidas
      </h3>
      <div className="space-y-3">
        <button 
          onClick={onAddSubject}
          className="w-full flex items-center space-x-3 p-3 text-left hover:bg-accent rounded-lg transition-colors"
          data-testid="button-add-subject"
        >
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Plus className="text-primary h-4 w-4" />
          </div>
          <span className="font-medium text-foreground">Adicionar Disciplina</span>
        </button>
        <button 
          onClick={onConfigureSchedule}
          className="w-full flex items-center space-x-3 p-3 text-left hover:bg-accent rounded-lg transition-colors"
          data-testid="button-configure-schedule"
        >
          <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Settings className="text-secondary h-4 w-4" />
          </div>
          <span className="font-medium text-foreground">Configurar Horários</span>
        </button>
        <button 
          onClick={onExportSchedule}
          className="w-full flex items-center space-x-3 p-3 text-left hover:bg-accent rounded-lg transition-colors"
          data-testid="button-export-schedule"
        >
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Download className="text-green-600 h-4 w-4" />
          </div>
          <span className="font-medium text-foreground">Exportar Cronograma</span>
        </button>
      </div>
    </div>
  );
}

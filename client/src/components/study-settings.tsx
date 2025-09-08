import { Edit } from "lucide-react";
import { StudySettings } from "@shared/schema";
import { formatDuration } from "@/lib/schedule-generator";

interface StudySettingsProps {
  settings: StudySettings;
  totalCycleTime: { hours: number; minutes: number };
  onEdit: () => void;
}

export default function StudySettingsComponent({ 
  settings, 
  totalCycleTime, 
  onEdit 
}: StudySettingsProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4" data-testid="title-study-settings">
        Configurações Atuais
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center" data-testid="setting-wake-time">
          <span className="text-sm text-muted-foreground">Horário de Acordar</span>
          <span className="text-sm font-medium text-foreground font-mono" data-testid="value-wake-time">
            {settings.wakeTime}
          </span>
        </div>
        <div className="flex justify-between items-center" data-testid="setting-sleep-time">
          <span className="text-sm text-muted-foreground">Horário de Dormir</span>
          <span className="text-sm font-medium text-foreground font-mono" data-testid="value-sleep-time">
            {settings.sleepTime}
          </span>
        </div>
        <div className="flex justify-between items-center" data-testid="setting-daily-study-time">
          <span className="text-sm text-muted-foreground">Tempo Diário de Estudo</span>
          <span className="text-sm font-medium text-foreground font-mono" data-testid="value-daily-study-time">
            {formatDuration(settings.dailyStudyHours, settings.dailyStudyMinutes)}
          </span>
        </div>
        <hr className="border-border" />
        <div className="flex justify-between items-center" data-testid="setting-total-cycle-time">
          <span className="text-sm text-muted-foreground">Tempo Total do Ciclo</span>
          <span className="text-sm font-medium text-foreground font-mono" data-testid="value-total-cycle-time">
            {formatDuration(totalCycleTime.hours, totalCycleTime.minutes)}
          </span>
        </div>
      </div>
      <button 
        onClick={onEdit}
        className="w-full mt-4 bg-muted text-muted-foreground px-4 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
        data-testid="button-edit-settings"
      >
        <Edit className="w-4 h-4 mr-2 inline" />
        Editar Configurações
      </button>
    </div>
  );
}

import { Plus, Calendar, Book, Clock, TrendingUp } from "lucide-react";
import { Subject, StudySettings } from "@shared/schema";
import { formatDuration } from "@/lib/schedule-generator";
import { useLanguage } from "@/contexts/LanguageContext";

interface DashboardOverviewProps {
  subjects: Subject[];
  settings: StudySettings;
  totalWeeks: number;
  onNewCycle: () => void;
}

export default function DashboardOverview({ 
  subjects, 
  settings, 
  totalWeeks, 
  onNewCycle 
}: DashboardOverviewProps) {
  const { t } = useLanguage();
  
  const totalStudyTime = subjects.reduce((total, subject) => {
    return total + (subject.hours * 60 + subject.minutes);
  }, 0);
  
  const totalStudyHours = Math.floor(totalStudyTime / 60);
  const totalStudyMinutes = totalStudyTime % 60;
  
  // Mock progress calculation
  const progress = subjects.length > 0 ? 67 : 0;

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="title-current-cycle">
            {t('dashboard.currentCycle')}
          </h2>
          <p className="text-muted-foreground" data-testid="text-subtitle">
            {t('app.subtitle')}
          </p>
        </div>
        <button 
          onClick={onNewCycle}
          className="mt-4 md:mt-0 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
          data-testid="button-new-cycle"
        >
          <Plus className="w-4 h-4 mr-2 inline" />
          {t('dashboard.newCycle')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm" data-testid="card-total-weeks">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">{t('dashboard.totalWeeks')}</p>
              <p className="text-2xl font-bold text-foreground mt-1" data-testid="text-total-weeks">
                {totalWeeks}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calendar className="text-primary h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm" data-testid="card-subjects">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">{t('dashboard.subjects')}</p>
              <p className="text-2xl font-bold text-foreground mt-1" data-testid="text-subjects-count">
                {subjects.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Book className="text-secondary h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm" data-testid="card-daily-hours">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">{t('dashboard.dailyHours')}</p>
              <p className="text-2xl font-bold text-foreground mt-1" data-testid="text-daily-hours">
                {formatDuration(settings.dailyStudyHours, settings.dailyStudyMinutes)}
              </p>
            </div>
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
              <Clock className="text-accent-foreground h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm" data-testid="card-progress">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">{t('dashboard.progress')}</p>
              <p className="text-2xl font-bold text-foreground mt-1" data-testid="text-progress-percent">
                {progress}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-green-600 h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 w-full bg-muted rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
              data-testid="progress-bar"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { WeekSchedule } from "@shared/schema";
import { getSubjectBgColor, getSubjectDotColor } from "@/lib/schedule-generator";
import { useLanguage } from "@/contexts/LanguageContext";

interface WeeklyScheduleProps {
  weeks: WeekSchedule[];
  subjects: any[];
}

export default function WeeklySchedule({ weeks, subjects }: WeeklyScheduleProps) {
  const [currentWeek, setCurrentWeek] = useState(0);
  const { t } = useLanguage();

  if (weeks.length === 0) {
    return (
      <div className="lg:col-span-2">
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6" data-testid="title-weekly-schedule">
            {t('schedule.title')}
          </h3>
          <div className="text-center py-12" data-testid="empty-schedule">
            <p className="text-muted-foreground">
              {t('schedule.empty')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentWeekData = weeks[currentWeek];

  const getSubjectIndex = (subjectId: string) => {
    return subjects.findIndex(s => s.id === subjectId);
  };

  return (
    <div className="lg:col-span-2">
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground" data-testid="title-weekly-schedule">
            {t('schedule.title')}
          </h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
              disabled={currentWeek === 0}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              data-testid="button-prev-week"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-foreground px-3 py-1 bg-muted rounded-lg" data-testid="text-current-week">
              {t('schedule.week')} {currentWeekData?.weekNumber || 1}
            </span>
            <button 
              onClick={() => setCurrentWeek(Math.min(weeks.length - 1, currentWeek + 1))}
              disabled={currentWeek === weeks.length - 1}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              data-testid="button-next-week"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex space-x-2 mb-6 overflow-x-auto" data-testid="week-navigation">
          {weeks.map((week, index) => (
            <button
              key={week.weekNumber}
              onClick={() => setCurrentWeek(index)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                index === currentWeek
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              data-testid={`button-week-${week.weekNumber}`}
            >
              {t('schedule.week')} {week.weekNumber}
            </button>
          ))}
        </div>

        {/* Daily Schedule */}
        <div className="space-y-4">
          {currentWeekData?.days.map((day, dayIndex) => (
            <div key={dayIndex} className="border border-border rounded-lg p-4" data-testid={`day-${dayIndex}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-foreground" data-testid={`day-name-${dayIndex}`}>
                  {day.day}
                </h4>
                <span className="text-sm text-muted-foreground" data-testid={`day-total-${dayIndex}`}>
                  {Math.floor(day.totalMinutes / 60)}h {day.totalMinutes % 60}min {t('dashboard.plannedTime')}
                </span>
              </div>
              {day.slots.length > 0 ? (
                <div className="space-y-2">
                  {day.slots.map((slot, slotIndex) => {
                    const subjectIndex = getSubjectIndex(slot.subjectId);
                    return (
                      <div 
                        key={slotIndex} 
                        className={`flex items-center justify-between p-3 rounded-lg ${getSubjectBgColor(subjectIndex)}`}
                        data-testid={`slot-${dayIndex}-${slotIndex}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getSubjectDotColor(subjectIndex)}`} />
                          <span className="font-medium" data-testid={`slot-subject-${dayIndex}-${slotIndex}`}>
                            {slot.subjectName}
                          </span>
                        </div>
                        <div className="text-sm font-mono" data-testid={`slot-time-${dayIndex}-${slotIndex}`}>
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4" data-testid={`day-empty-${dayIndex}`}>
                  <p className="text-sm text-muted-foreground">{t('schedule.noStudy')}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Subject } from "@shared/schema";
import { formatDuration, getSubjectDotColor } from "@/lib/schedule-generator";
import { useLanguage } from "@/contexts/LanguageContext";

interface SubjectListProps {
  subjects: Subject[];
}

export default function SubjectList({ subjects }: SubjectListProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground" data-testid="title-subject-list">
          {t('subjects.title')}
        </h3>
        <span className="text-sm text-muted-foreground" data-testid="subjects-count">
          {subjects.length} {subjects.length === 1 ? t('subjects.count') : t('subjects.countPlural')}
        </span>
      </div>
      
      {subjects.length === 0 ? (
        <div className="text-center py-8" data-testid="empty-subjects">
          <p className="text-muted-foreground text-sm">
            {t('subjects.empty')}
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto" data-testid="subjects-list">
          {subjects.map((subject, index) => (
            <div 
              key={subject.id} 
              className="flex items-center justify-between p-3 border border-border rounded-lg"
              data-testid={`subject-item-${index}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getSubjectDotColor(index)}`} />
                <span className="text-sm font-medium text-foreground" data-testid={`subject-name-${index}`}>
                  {subject.name}
                </span>
              </div>
              <span className="text-sm text-muted-foreground font-mono" data-testid={`subject-duration-${index}`}>
                {formatDuration(subject.hours, subject.minutes)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

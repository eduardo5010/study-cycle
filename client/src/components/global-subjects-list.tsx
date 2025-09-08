import { Edit2, Trash2 } from "lucide-react";
import { GlobalSubject } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface GlobalSubjectsListProps {
  subjects: GlobalSubject[];
  onEdit?: (subject: GlobalSubject) => void;
  onDelete?: (subjectId: string) => void;
}

export default function GlobalSubjectsList({ subjects, onEdit, onDelete }: GlobalSubjectsListProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground" data-testid="title-global-subjects">
          {t('subjects.globalTitle')}
        </h3>
        <span className="text-sm text-muted-foreground" data-testid="global-subjects-count">
          {subjects.length} {subjects.length === 1 ? t('subjects.count') : t('subjects.countPlural')}
        </span>
      </div>

      {subjects.length === 0 ? (
        <div className="text-center py-8" data-testid="empty-global-subjects">
          <p className="text-muted-foreground text-sm">
            {t('subjects.emptyGlobal')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50"
              data-testid={`global-subject-${subject.id}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-foreground" data-testid={`subject-name-${subject.id}`}>
                    {subject.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {t('subjects.createdAt')}: {new Date(subject.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(subject)}
                    className="h-8 w-8 p-0"
                    data-testid={`button-edit-subject-${subject.id}`}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(subject.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    data-testid={`button-delete-subject-${subject.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
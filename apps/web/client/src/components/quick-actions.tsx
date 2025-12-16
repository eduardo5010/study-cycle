import { Plus, Settings, Download, Edit3, Share, MessageCircle, Users, Trophy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface QuickActionsProps {
  onAddSubject: () => void;
  onConfigureSchedule: () => void;
  onExportSchedule: () => void;
  onEditCycle?: () => void;
}

export default function QuickActions({ 
  onAddSubject, 
  onConfigureSchedule, 
  onExportSchedule,
  onEditCycle
}: QuickActionsProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4" data-testid="title-quick-actions">
        {t('actions.title')}
      </h3>
      <div className="space-y-3">
        <button 
          onClick={onAddSubject}
          className="w-full flex items-center space-x-3 p-3 text-left hover:bg-accent rounded-lg transition-colors min-h-[52px]"
          data-testid="button-add-subject"
        >
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Plus className="text-primary h-4 w-4" />
          </div>
          <span className="font-medium text-foreground truncate">{t('actions.addSubject')}</span>
        </button>
        <button 
          onClick={onConfigureSchedule}
          className="w-full flex items-center space-x-3 p-3 text-left hover:bg-accent rounded-lg transition-colors min-h-[52px]"
          data-testid="button-configure-schedule"
        >
          <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Settings className="text-secondary h-4 w-4" />
          </div>
          <span className="font-medium text-foreground truncate">{t('actions.configureSchedule')}</span>
        </button>
        <button 
          onClick={onExportSchedule}
          className="w-full flex items-center space-x-3 p-3 text-left hover:bg-accent rounded-lg transition-colors min-h-[52px]"
          data-testid="button-export-schedule"
        >
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <Download className="text-green-600 dark:text-green-300 h-4 w-4" />
          </div>
          <span className="font-medium text-foreground truncate">{t('actions.exportSchedule')}</span>
        </button>
        
        {onEditCycle && (
          <button 
            onClick={onEditCycle}
            className="w-full flex items-center space-x-3 p-3 text-left hover:bg-accent rounded-lg transition-colors min-h-[52px]"
            data-testid="button-edit-cycle"
          >
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <Edit3 className="text-orange-600 dark:text-orange-300 h-4 w-4" />
            </div>
            <span className="font-medium text-foreground truncate">{t('actions.editCycle')}</span>
          </button>
        )}
      </div>

      {/* Social Actions Section */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="text-sm font-semibold text-muted-foreground mb-3">Community</h4>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start" asChild>
            <Link href="/feed">
              <Share className="h-4 w-4 mr-2" />
              Share Achievement
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start" asChild>
            <Link href="/chats">
              <MessageCircle className="h-4 w-4 mr-2" />
              Join Study Group
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start" asChild>
            <Link href="/calendar">
              <Users className="h-4 w-4 mr-2" />
              Plan Study Session
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start" asChild>
            <Link href="/feed">
              <Trophy className="h-4 w-4 mr-2" />
              View Leaderboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

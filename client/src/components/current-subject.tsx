import { useState, useEffect } from "react";
import { Clock, Play, Book, Share } from "lucide-react";
import { Subject, WeekSchedule } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface CurrentSubjectProps {
  weeks: WeekSchedule[];
  subjects: Subject[];
}

interface CurrentSubjectData {
  subject: Subject;
  endTime: string;
  timeRemaining: number;
}

export default function CurrentSubject({ weeks, subjects }: CurrentSubjectProps) {
  const { t } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentSubject, setCurrentSubject] = useState<CurrentSubjectData | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    findCurrentSubject();
  }, [currentTime, weeks, subjects]);

  const findCurrentSubject = () => {
    const now = new Date();
    const today = now.toLocaleDateString('pt-BR', { weekday: 'long' });
    const currentTimeStr = now.toTimeString().slice(0, 5); // HH:MM format

    // Find today's schedule in the current week
    const currentWeek = weeks[0]; // Assuming we're showing the current week
    if (!currentWeek) {
      setCurrentSubject(null);
      return;
    }

    const todaySchedule = currentWeek.days.find(day => 
      day.day.toLowerCase().includes(today.toLowerCase().slice(0, 3))
    );

    if (!todaySchedule) {
      setCurrentSubject(null);
      return;
    }

    // Find current active slot
    const activeSlot = todaySchedule.slots.find(slot => {
      const startTime = slot.startTime;
      const endTime = slot.endTime;
      return currentTimeStr >= startTime && currentTimeStr <= endTime;
    });

    if (activeSlot) {
      const subject = subjects.find(s => s.id === activeSlot.subjectId);
      if (subject) {
        const endTime = new Date(`${now.toDateString()} ${activeSlot.endTime}`);
        const timeRemaining = Math.max(0, endTime.getTime() - now.getTime());
        
        setCurrentSubject({
          subject,
          endTime: activeSlot.endTime,
          timeRemaining: Math.floor(timeRemaining / 1000 / 60) // minutes
        });
        return;
      }
    }

    setCurrentSubject(null);
  };

  const formatTimeRemaining = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6" data-testid="current-subject-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Clock className="text-primary h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold text-foreground" data-testid="current-subject-title">
          {t('currentSubject.title')}
        </h3>
      </div>

      {currentSubject ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Book className="text-primary-foreground h-4 w-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground" data-testid="active-subject-name">
                {currentSubject.subject.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                até {currentSubject.endTime}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {t('currentSubject.timeRemaining')}
                </p>
                <p className="text-lg font-bold text-primary" data-testid="time-remaining">
                  {formatTimeRemaining(currentSubject.timeRemaining)}
                </p>
              </div>
              <Button
                className="flex items-center gap-2"
                data-testid="button-start-studying"
              >
                <Play className="h-4 w-4" />
                {t('currentSubject.startStudying')}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                asChild
              >
                <Link href="/feed">
                  <Share className="h-4 w-4 mr-2" />
                  Share Progress
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                asChild
              >
                <Link href="/calendar">
                  <Clock className="h-4 w-4 mr-2" />
                  View Schedule
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8" data-testid="no-active-subject">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Book className="text-muted-foreground h-8 w-8" />
          </div>
          <p className="text-muted-foreground text-sm">
            {t('currentSubject.noActive')}
          </p>
        </div>
      )}
    </div>
  );
}

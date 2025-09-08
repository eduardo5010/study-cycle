import { Subject, StudySettings, WeekSchedule, DaySchedule, ScheduleSlot } from "@shared/schema";

// Day names mapping for different languages
const getDayNames = (language: string = 'pt') => {
  const dayMappings: Record<string, string[]> = {
    'pt': ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'],
    'en': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    'es': ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    'fr': ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
    'de': ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
    'it': ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'],
    'ru': ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
    'zh': ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
    'ja': ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日'],
    'ko': ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'],
    'ar': ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'],
    'hi': ['सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार', 'रविवार'],
    'tr': ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
    'pl': ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'],
    'nl': ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'],
    'sv': ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'],
    'da': ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'],
    'no': ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'],
    'fi': ['Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai', 'Sunnuntai'],
    'cs': ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle']
  };
  return dayMappings[language] || dayMappings['pt'];
};

export function generateStudySchedule(
  subjects: Subject[],
  settings: StudySettings,
  language: string = 'pt'
): WeekSchedule[] {
  if (subjects.length === 0) return [];

  const days = getDayNames(language);
  
  // Convert time strings to minutes
  const wakeMinutes = timeToMinutes(settings.wakeTime);
  const sleepMinutes = timeToMinutes(settings.sleepTime);
  const totalDayMinutes = sleepMinutes > wakeMinutes ? 
    sleepMinutes - wakeMinutes : 
    (24 * 60) - wakeMinutes + sleepMinutes;
  
  const dailyStudyMinutes = settings.dailyStudyHours * 60 + settings.dailyStudyMinutes;
  const weeklyStudyMinutes = dailyStudyMinutes * 7;
  
  // Calculate total study time needed
  const totalStudyMinutes = subjects.reduce((total, subject) => {
    return total + (subject.hours * 60 + subject.minutes);
  }, 0);
  
  // Calculate number of weeks needed
  const weeksNeeded = Math.ceil(totalStudyMinutes / weeklyStudyMinutes);
  
  // Create a copy of subjects with remaining time
  const subjectQueue = subjects.map(s => ({
    ...s,
    remainingMinutes: s.hours * 60 + s.minutes
  })).filter(s => s.remainingMinutes > 0);
  
  const weeks: WeekSchedule[] = [];
  
  for (let weekNum = 1; weekNum <= weeksNeeded; weekNum++) {
    const weekDays: DaySchedule[] = [];
    
    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
      const dayDate = new Date();
      dayDate.setDate(dayDate.getDate() + (weekNum - 1) * 7 + dayIdx);
      
      const daySchedule: DaySchedule = {
        day: days[dayIdx],
        date: dayDate.toISOString().split('T')[0],
        slots: [],
        totalMinutes: 0
      };
      
      let currentTime = wakeMinutes;
      let remainingDailyMinutes = dailyStudyMinutes;
      
      // Distribute subjects for this day
      while (remainingDailyMinutes > 0 && subjectQueue.some(s => s.remainingMinutes > 0)) {
        // Find next subject with remaining time
        const subject = subjectQueue.find(s => s.remainingMinutes > 0);
        if (!subject) break;
        
        // Determine slot duration (minimum 30 minutes, maximum 3 hours)
        const maxSlotMinutes = Math.min(180, remainingDailyMinutes, subject.remainingMinutes);
        const slotMinutes = Math.min(maxSlotMinutes, Math.max(30, subject.remainingMinutes));
        
        // Check if we have enough time in the day
        if (currentTime + slotMinutes > sleepMinutes && sleepMinutes > wakeMinutes) {
          break;
        }
        
        const slot: ScheduleSlot = {
          subjectId: subject.id,
          subjectName: subject.name,
          startTime: minutesToTime(currentTime),
          endTime: minutesToTime(currentTime + slotMinutes),
          duration: slotMinutes
        };
        
        daySchedule.slots.push(slot);
        daySchedule.totalMinutes += slotMinutes;
        
        subject.remainingMinutes -= slotMinutes;
        remainingDailyMinutes -= slotMinutes;
        currentTime += slotMinutes + 15; // 15 minute break
      }
      
      weekDays.push(daySchedule);
    }
    
    weeks.push({
      weekNumber: weekNum,
      days: weekDays
    });
    
    // If all subjects are completed, break
    if (!subjectQueue.some(s => s.remainingMinutes > 0)) {
      break;
    }
  }
  
  return weeks;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export function formatDuration(hours: number, minutes: number): string {
  const totalMinutes = hours * 60 + minutes;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  
  if (h === 0) {
    return `${m}min`;
  } else if (m === 0) {
    return `${h}h`;
  } else {
    return `${h}h ${m}min`;
  }
}

export function getSubjectColor(index: number): string {
  return `subject-color-${index % 8}`;
}

export function getSubjectDotColor(index: number): string {
  return `subject-dot-${index % 8}`;
}

export function getSubjectBgColor(index: number): string {
  return `subject-bg-${index % 8}`;
}

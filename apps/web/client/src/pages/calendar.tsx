import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, BookOpen, Target } from "lucide-react";

interface StudySession {
  id: string;
  date: Date;
  subject: string;
  duration: number; // in minutes
  completed: boolean;
  type: 'study' | 'review' | 'practice';
}

export default function CalendarPage() {
  const { t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Mock study sessions data
  const studySessions: StudySession[] = [
    {
      id: "1",
      date: new Date(2025, 11, 15), // December 15, 2025
      subject: "Mathematics",
      duration: 90,
      completed: true,
      type: "study"
    },
    {
      id: "2",
      date: new Date(2025, 11, 16),
      subject: "Physics",
      duration: 60,
      completed: false,
      type: "review"
    },
    {
      id: "3",
      date: new Date(2025, 11, 17),
      subject: "English",
      duration: 45,
      completed: true,
      type: "practice"
    },
    {
      id: "4",
      date: new Date(2025, 11, 18),
      subject: "Chemistry",
      duration: 120,
      completed: false,
      type: "study"
    }
  ];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const getSessionsForDate = (date: Date) => {
    return studySessions.filter(session =>
      isSameDay(session.date, date)
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'study': return 'bg-blue-500';
      case 'review': return 'bg-green-500';
      case 'practice': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'study': return <BookOpen className="h-3 w-3" />;
      case 'review': return <Target className="h-3 w-3" />;
      case 'practice': return <Clock className="h-3 w-3" />;
      default: return <CalendarIcon className="h-3 w-3" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <CalendarIcon className="h-8 w-8" />
          Study Calendar
        </h1>
        <p className="text-muted-foreground">
          Track your study sessions and plan your learning schedule
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {format(currentDate, 'MMMM yyyy')}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={previousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {monthDays.map((day, index) => {
                  const sessions = getSessionsForDate(day);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        relative h-16 p-2 border rounded-lg text-left hover:bg-accent transition-colors
                        ${isSelected ? 'ring-2 ring-primary' : ''}
                        ${isToday ? 'bg-primary/10 border-primary' : 'border-border'}
                        ${!isSameMonth(day, currentDate) ? 'text-muted-foreground' : ''}
                      `}
                    >
                      <div className="text-sm font-medium mb-1">
                        {format(day, 'd')}
                      </div>
                      {sessions.length > 0 && (
                        <div className="space-y-1">
                          {sessions.slice(0, 2).map(session => (
                            <div
                              key={session.id}
                              className={`text-xs px-1 py-0.5 rounded text-white ${getTypeColor(session.type)} flex items-center gap-1`}
                            >
                              {getTypeIcon(session.type)}
                              <span className="truncate">{session.subject}</span>
                            </div>
                          ))}
                          {sessions.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{sessions.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with details */}
        <div className="space-y-6">
          {/* Study Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">This Month</CardTitle>
              <CardDescription>Your study progress overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Study Sessions</span>
                <Badge variant="secondary">{studySessions.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Hours</span>
                <Badge variant="secondary">
                  {Math.round(studySessions.reduce((acc, s) => acc + s.duration, 0) / 60)}h
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Completed</span>
                <Badge variant="secondary">
                  {studySessions.filter(s => s.completed).length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Selected Date Details */}
          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {format(selectedDate, 'MMMM d, yyyy')}
                </CardTitle>
                <CardDescription>
                  Study sessions for this day
                </CardDescription>
              </CardHeader>
              <CardContent>
                {getSessionsForDate(selectedDate).length > 0 ? (
                  <div className="space-y-3">
                    {getSessionsForDate(selectedDate).map(session => (
                      <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getTypeColor(session.type)}`} />
                          <div>
                            <p className="font-medium text-sm">{session.subject}</p>
                            <p className="text-xs text-muted-foreground">
                              {session.duration} minutes • {session.type}
                            </p>
                          </div>
                        </div>
                        <Badge variant={session.completed ? "default" : "secondary"}>
                          {session.completed ? "Done" : "Pending"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No study sessions scheduled for this day
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Schedule Study Session
              </Button>
              <Button className="w-full" variant="outline">
                <Target className="h-4 w-4 mr-2" />
                Set Goals
              </Button>
              <Button className="w-full" variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                View Progress
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

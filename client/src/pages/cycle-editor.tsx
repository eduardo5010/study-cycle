import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Clock,
  BookOpen,
  Calendar,
  Settings,
  RotateCcw,
  Pin,
  Target,
  BarChart3
} from "lucide-react";

interface CycleSubject {
  id: string;
  globalSubjectId: string;
  name: string;
  hours: number;
  minutes: number;
  type: 'fixed' | 'rotating';
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  weeklySchedule: {
    [key: string]: {
      startTime: string;
      duration: number;
      enabled: boolean;
    };
  };
}

interface StudyCycle {
  id: string;
  name: string;
  description: string;
  totalWeeks: number;
  settings: {
    wakeTime: string;
    sleepTime: string;
    dailyStudyHours: number;
    dailyStudyMinutes: number;
  };
  subjects: CycleSubject[];
  createdAt: Date;
}

const daysOfWeek = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
];

export default function CycleEditorPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("subjects");
  const [editingSubject, setEditingSubject] = useState<CycleSubject | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Mock cycle data - in real app, this would come from API
  const [cycle, setCycle] = useState<StudyCycle>({
    id: "cycle-1",
    name: "My Study Cycle",
    description: "Personalized learning journey",
    totalWeeks: 12,
    settings: {
      wakeTime: "07:00",
      sleepTime: "23:00",
      dailyStudyHours: 6,
      dailyStudyMinutes: 0
    },
    subjects: [
      {
        id: "subj-1",
        globalSubjectId: "math",
        name: "Mathematics",
        hours: 8,
        minutes: 30,
        type: 'fixed',
        difficulty: 'medium',
        weeklySchedule: {
          monday: { startTime: "09:00", duration: 90, enabled: true },
          wednesday: { startTime: "14:00", duration: 90, enabled: true },
          friday: { startTime: "10:00", duration: 120, enabled: true }
        }
      },
      {
        id: "subj-2",
        globalSubjectId: "physics",
        name: "Physics",
        hours: 6,
        minutes: 0,
        type: 'rotating',
        difficulty: 'hard',
        weeklySchedule: {
          tuesday: { startTime: "13:00", duration: 120, enabled: true },
          thursday: { startTime: "15:00", duration: 120, enabled: true }
        }
      }
    ],
    createdAt: new Date()
  });

  const saveCycle = useMutation({
    mutationFn: async (data: StudyCycle) => {
      // In real app, this would call the API
      await new Promise(resolve => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Cycle saved successfully!",
        description: "Your study cycle has been updated."
      });
    }
  });

  const handleSaveCycle = () => {
    saveCycle.mutate(cycle);
  };

  const handleAddSubject = () => {
    const newSubject: CycleSubject = {
      id: `subj-${Date.now()}`,
      globalSubjectId: `subject-${Date.now()}`,
      name: "",
      hours: 1,
      minutes: 0,
      type: 'fixed',
      difficulty: 'medium',
      weeklySchedule: {}
    };
    setEditingSubject(newSubject);
    setIsCreatingNew(true);
  };

  const handleEditSubject = (subject: CycleSubject) => {
    setEditingSubject({ ...subject });
    setIsCreatingNew(false);
  };

  const handleSaveSubject = (updatedSubject: CycleSubject) => {
    if (isCreatingNew) {
      setCycle(prev => ({
        ...prev,
        subjects: [...prev.subjects, updatedSubject]
      }));
    } else {
      setCycle(prev => ({
        ...prev,
        subjects: prev.subjects.map(s =>
          s.id === updatedSubject.id ? updatedSubject : s
        )
      }));
    }
    setEditingSubject(null);
    setIsCreatingNew(false);
  };

  const handleDeleteSubject = (subjectId: string) => {
    setCycle(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s.id !== subjectId)
    }));
  };

  const handleSubjectScheduleChange = (subjectId: string, day: string, field: string, value: any) => {
    setCycle(prev => ({
      ...prev,
      subjects: prev.subjects.map(subject => {
        if (subject.id === subjectId) {
          return {
            ...subject,
            weeklySchedule: {
              ...subject.weeklySchedule,
              [day]: {
                ...subject.weeklySchedule[day],
                [field]: value
              }
            }
          };
        }
        return subject;
      })
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Settings className="h-8 w-8" />
              Study Cycle Editor
            </h1>
            <p className="text-muted-foreground">
              Configure your personalized learning journey
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setLocation("/home")}>
              Cancel
            </Button>
            <Button onClick={handleSaveCycle} disabled={saveCycle.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {saveCycle.isPending ? "Saving..." : "Save Cycle"}
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="subjects" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Subjects
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Study Subjects</CardTitle>
                  <CardDescription>
                    Add and configure subjects for your study cycle
                  </CardDescription>
                </div>
                <Button onClick={handleAddSubject}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subject
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cycle.subjects.map(subject => (
                  <Card key={subject.id} className="border-l-4 border-l-primary">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{subject.name}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant={subject.type === 'fixed' ? 'default' : 'secondary'}>
                                {subject.type === 'fixed' ? <Pin className="h-3 w-3 mr-1" /> : <RotateCcw className="h-3 w-3 mr-1" />}
                                {subject.type === 'fixed' ? 'Fixed' : 'Rotating'}
                              </Badge>
                              <Badge variant="outline">
                                <Target className="h-3 w-3 mr-1" />
                                {subject.difficulty}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {subject.hours}h {subject.minutes}m
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditSubject(subject)}>
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteSubject(subject.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {daysOfWeek.map(day => {
                          const schedule = subject.weeklySchedule[day.key];
                          return (
                            <div key={day.key} className="text-center p-2 bg-muted/50 rounded">
                              <div className="text-xs font-medium">{day.label.slice(0, 3)}</div>
                              {schedule?.enabled ? (
                                <div className="text-xs text-muted-foreground">
                                  {schedule.startTime} ({schedule.duration}min)
                                </div>
                              ) : (
                                <div className="text-xs text-muted-foreground">-</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {editingSubject && (
            <SubjectEditor
              subject={editingSubject}
              onSave={handleSaveSubject}
              onCancel={() => setEditingSubject(null)}
              onScheduleChange={handleSubjectScheduleChange}
            />
          )}
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>
                Configure when each subject should be studied
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {cycle.subjects.map(subject => (
                  <div key={subject.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-semibold">{subject.name}</h3>
                      <Badge variant={subject.type === 'fixed' ? 'default' : 'secondary'}>
                        {subject.type}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {daysOfWeek.map(day => {
                        const schedule = subject.weeklySchedule[day.key] || {
                          startTime: "09:00",
                          duration: 60,
                          enabled: false
                        };

                        return (
                          <Card key={day.key} className={schedule.enabled ? "border-primary/50" : ""}>
                            <CardContent className="pt-4">
                              <div className="flex items-center justify-between mb-3">
                                <span className="font-medium text-sm">{day.label}</span>
                                <Switch
                                  checked={schedule.enabled}
                                  onCheckedChange={(checked) =>
                                    handleSubjectScheduleChange(subject.id, day.key, 'enabled', checked)
                                  }
                                />
                              </div>

                              {schedule.enabled && (
                                <div className="space-y-2">
                                  <div>
                                    <Label className="text-xs">Start Time</Label>
                                    <Input
                                      type="time"
                                      value={schedule.startTime}
                                      onChange={(e) =>
                                        handleSubjectScheduleChange(subject.id, day.key, 'startTime', e.target.value)
                                      }
                                      className="text-xs"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Duration (min)</Label>
                                    <Input
                                      type="number"
                                      value={schedule.duration}
                                      onChange={(e) =>
                                        handleSubjectScheduleChange(subject.id, day.key, 'duration', parseInt(e.target.value))
                                      }
                                      className="text-xs"
                                    />
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cycle Settings</CardTitle>
              <CardDescription>
                Configure your study preferences and schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cycleName">Cycle Name</Label>
                    <Input
                      id="cycleName"
                      value={cycle.name}
                      onChange={(e) => setCycle(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={cycle.description}
                      onChange={(e) => setCycle(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalWeeks">Total Weeks</Label>
                    <Input
                      id="totalWeeks"
                      type="number"
                      value={cycle.totalWeeks}
                      onChange={(e) => setCycle(prev => ({ ...prev, totalWeeks: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="wakeTime">Wake Time</Label>
                    <Input
                      id="wakeTime"
                      type="time"
                      value={cycle.settings.wakeTime}
                      onChange={(e) => setCycle(prev => ({
                        ...prev,
                        settings: { ...prev.settings, wakeTime: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sleepTime">Sleep Time</Label>
                    <Input
                      id="sleepTime"
                      type="time"
                      value={cycle.settings.sleepTime}
                      onChange={(e) => setCycle(prev => ({
                        ...prev,
                        settings: { ...prev.settings, sleepTime: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Daily Study Goal</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={cycle.settings.dailyStudyHours}
                        onChange={(e) => setCycle(prev => ({
                          ...prev,
                          settings: { ...prev.settings, dailyStudyHours: parseInt(e.target.value) }
                        }))}
                        className="w-20"
                      />
                      <span className="flex items-center">hours</span>
                      <Input
                        type="number"
                        value={cycle.settings.dailyStudyMinutes}
                        onChange={(e) => setCycle(prev => ({
                          ...prev,
                          settings: { ...prev.settings, dailyStudyMinutes: parseInt(e.target.value) }
                        }))}
                        className="w-20"
                      />
                      <span className="flex items-center">minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cycle Preview</CardTitle>
              <CardDescription>
                Overview of your study cycle configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {cycle.subjects.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Subjects</div>
                </div>
                <div className="text-center p-4 bg-green-500/5 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {cycle.totalWeeks}
                  </div>
                  <div className="text-sm text-muted-foreground">Weeks</div>
                </div>
                <div className="text-center p-4 bg-blue-500/5 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {cycle.subjects.reduce((acc, s) => acc + s.hours, 0)}h
                  </div>
                  <div className="text-sm text-muted-foreground">Total Hours</div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="font-semibold">Weekly Schedule Preview</h3>
                <div className="grid grid-cols-7 gap-2">
                  {daysOfWeek.map(day => (
                    <div key={day.key} className="text-center">
                      <div className="font-medium text-sm mb-2">{day.label.slice(0, 3)}</div>
                      <div className="space-y-1">
                        {cycle.subjects
                          .filter(subject => subject.weeklySchedule[day.key]?.enabled)
                          .map(subject => (
                            <div key={subject.id} className="text-xs bg-primary/10 rounded px-1 py-0.5">
                              {subject.name.slice(0, 8)}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface SubjectEditorProps {
  subject: CycleSubject;
  onSave: (subject: CycleSubject) => void;
  onCancel: () => void;
  onScheduleChange: (subjectId: string, day: string, field: string, value: any) => void;
}

function SubjectEditor({ subject, onSave, onCancel, onScheduleChange }: SubjectEditorProps) {
  const [editedSubject, setEditedSubject] = useState<CycleSubject>(subject);

  const handleSave = () => {
    onSave(editedSubject);
  };

  const handleScheduleChange = (day: string, field: string, value: any) => {
    setEditedSubject(prev => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule[day],
          [field]: value
        }
      }
    }));
  };

  return (
    <Card className="border-primary">
      <CardHeader>
        <CardTitle>Edit Subject</CardTitle>
        <CardDescription>
          Configure subject details and schedule
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="subjectName">Subject Name</Label>
            <Input
              id="subjectName"
              value={editedSubject.name}
              onChange={(e) => setEditedSubject(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <Label>Subject Type</Label>
            <Select
              value={editedSubject.type}
              onValueChange={(value: 'fixed' | 'rotating') =>
                setEditedSubject(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed Schedule</SelectItem>
                <SelectItem value="rotating">Rotating Schedule</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Hours</Label>
            <Input
              type="number"
              value={editedSubject.hours}
              onChange={(e) => setEditedSubject(prev => ({ ...prev, hours: parseInt(e.target.value) }))}
            />
          </div>
          <div>
            <Label>Minutes</Label>
            <Input
              type="number"
              value={editedSubject.minutes}
              onChange={(e) => setEditedSubject(prev => ({ ...prev, minutes: parseInt(e.target.value) }))}
            />
          </div>
          <div>
            <Label>Difficulty</Label>
            <Select
              value={editedSubject.difficulty}
              onValueChange={(value: 'easy' | 'medium' | 'hard' | 'adaptive') =>
                setEditedSubject(prev => ({ ...prev, difficulty: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
                <SelectItem value="adaptive">Adaptive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Subject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

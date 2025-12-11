import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  Plus,
  ArrowRight,
  BookOpen,
  Target,
  Clock,
  TrendingUp,
  Users,
  Star,
  CheckCircle,
  Sparkles,
  Move,
  GripVertical,
  Calendar,
  Trash2,
  Copy
} from "lucide-react";

interface CycleTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number; // weeks
  subjects: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
}

const cycleTemplates: CycleTemplate[] = [
  {
    id: "university-prep",
    name: "University Entrance Prep",
    description: "Comprehensive preparation for university entrance exams",
    category: "Academic",
    duration: 24,
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Portuguese"],
    difficulty: "advanced",
    icon: "🎓"
  },
  {
    id: "programming-bootcamp",
    name: "Programming Bootcamp",
    description: "Intensive programming skills development",
    category: "Technology",
    duration: 12,
    subjects: ["JavaScript", "Python", "Data Structures", "Algorithms", "Web Development", "Databases"],
    difficulty: "intermediate",
    icon: "💻"
  },
  {
    id: "language-mastery",
    name: "Language Mastery",
    description: "Complete language learning journey",
    category: "Languages",
    duration: 16,
    subjects: ["Grammar", "Vocabulary", "Listening", "Speaking", "Reading", "Writing"],
    difficulty: "intermediate",
    icon: "🌍"
  },
  {
    id: "professional-cert",
    name: "Professional Certification",
    description: "Prepare for industry certifications",
    category: "Career",
    duration: 8,
    subjects: ["Core Concepts", "Practice Tests", "Case Studies", "Review Sessions"],
    difficulty: "intermediate",
    icon: "📜"
  },
  {
    id: "personal-growth",
    name: "Personal Growth",
    description: "Self-improvement and skill development",
    category: "Personal",
    duration: 12,
    subjects: ["Goal Setting", "Time Management", "Communication", "Leadership", "Finance", "Health"],
    difficulty: "beginner",
    icon: "🌱"
  }
];

export default function CycleCreatePage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<CycleTemplate | null>(null);
  const [customSubjects, setCustomSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [draggedSubject, setDraggedSubject] = useState<string | null>(null);
  const [scheduleSettings, setScheduleSettings] = useState({
    wakeTime: "07:00",
    sleepTime: "23:00",
    dailyHours: 6,
    dailyMinutes: 0,
    studyDaysPerWeek: 6,
    weeklySchedule: [] as any[]
  });

  const steps = [
    { id: 1, name: "Choose Template", description: "Select a study cycle template" },
    { id: 2, name: "Customize Subjects", description: "Add or modify subjects" },
    { id: 3, name: "Set Schedule", description: "Configure your study schedule" },
    { id: 4, name: "Review & Create", description: "Review and create your cycle" }
  ];

  const createCycle = useMutation({
    mutationFn: async (data: any) => {
      // In real app, this would call the API
      await new Promise(resolve => setTimeout(resolve, 2000));
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Study cycle created!",
        description: "Your personalized learning journey begins now."
      });
      // Redirect to home to see the new cycle
      setLocation("/home");
    }
  });

  const handleTemplateSelect = (template: CycleTemplate) => {
    setSelectedTemplate(template);
    setCustomSubjects(template.subjects);
  };

  const handleAddSubject = () => {
    if (newSubject.trim() && !customSubjects.includes(newSubject.trim())) {
      setCustomSubjects(prev => [...prev, newSubject.trim()]);
      setNewSubject("");
    }
  };

  const handleRemoveSubject = (subject: string) => {
    setCustomSubjects(prev => prev.filter(s => s !== subject));
  };

  const handleDragStart = (e: React.DragEvent, subject: string) => {
    setDraggedSubject(subject);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropSubject: string) => {
    e.preventDefault();
    if (!draggedSubject || draggedSubject === dropSubject) return;

    const draggedIndex = customSubjects.indexOf(draggedSubject);
    const dropIndex = customSubjects.indexOf(dropSubject);

    const newSubjects = [...customSubjects];
    newSubjects.splice(draggedIndex, 1);
    newSubjects.splice(dropIndex, 0, draggedSubject);

    setCustomSubjects(newSubjects);
    setDraggedSubject(null);
  };

  const handleDragEnd = () => {
    setDraggedSubject(null);
  };

  const handleCreateCycle = () => {
    if (!selectedTemplate) return;

    const cycleData = {
      name: selectedTemplate.name,
      description: selectedTemplate.description,
      templateId: selectedTemplate.id,
      subjects: customSubjects,
      duration: selectedTemplate.duration,
      difficulty: selectedTemplate.difficulty
    };

    createCycle.mutate(cycleData);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          Create Your Study Cycle
        </h1>
        <p className="text-muted-foreground">
          Build a personalized learning journey tailored to your goals
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step.id <= currentStep
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-muted-foreground/30 text-muted-foreground'
              }`}>
                {step.id < currentStep ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <div className="ml-3 hidden sm:block">
                <div className={`text-sm font-medium ${
                  step.id <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {step.description}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${
                  step.id < currentStep ? 'bg-primary' : 'bg-muted-foreground/30'
                }`} />
              )}
            </div>
          ))}
        </div>
        <Progress value={(currentStep / steps.length) * 100} className="h-2" />
      </div>

      {/* Step 1: Choose Template */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Choose a Study Template</CardTitle>
              <CardDescription>
                Start with a pre-built template or create your own from scratch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cycleTemplates.map(template => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate?.id === template.id
                        ? 'ring-2 ring-primary border-primary'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{template.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{template.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {template.description}
                          </p>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{template.category}</Badge>
                            <Badge
                              variant="secondary"
                              className={`${getDifficultyColor(template.difficulty)} text-white`}
                            >
                              {template.difficulty}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {template.duration} weeks
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {template.subjects.length} subjects
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Custom Template Option */}
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md border-dashed ${
                    selectedTemplate?.id === 'custom'
                      ? 'ring-2 ring-primary border-primary'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedTemplate({
                    id: 'custom',
                    name: 'Custom Cycle',
                    description: 'Build your own study cycle from scratch',
                    category: 'Custom',
                    duration: 8,
                    subjects: [],
                    difficulty: 'beginner',
                    icon: '🎯'
                  })}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center h-32">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🎯</div>
                        <h3 className="font-semibold">Custom Cycle</h3>
                        <p className="text-sm text-muted-foreground">
                          Build from scratch
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={() => setCurrentStep(2)}
              disabled={!selectedTemplate}
              className="min-w-32"
            >
              Next Step
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Customize Subjects */}
      {currentStep === 2 && selectedTemplate && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customize Subjects</CardTitle>
              <CardDescription>
                Add, remove, or modify the subjects in your study cycle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a new subject..."
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
                />
                <Button onClick={handleAddSubject} disabled={!newSubject.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground mb-3">
                  Drag and drop subjects to reorder them
                </div>
                {customSubjects.map((subject, index) => (
                  <div
                    key={subject}
                    draggable
                    onDragStart={(e) => handleDragStart(e, subject)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, subject)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-3 p-3 bg-muted/50 rounded-lg cursor-move transition-all ${
                      draggedSubject === subject ? 'opacity-50 scale-95' : 'hover:bg-muted/70'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GripVertical className="h-4 w-4" />
                      <span className="text-xs font-medium">{index + 1}</span>
                    </div>
                    <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium flex-1">{subject}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSubject(subject)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive flex-shrink-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {customSubjects.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No subjects added yet</p>
                  <p className="text-sm">Add subjects to continue</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              Previous
            </Button>
            <Button
              onClick={() => setCurrentStep(3)}
              disabled={customSubjects.length === 0}
            >
              Next Step
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Set Schedule */}
      {currentStep === 3 && selectedTemplate && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Set Your Schedule</CardTitle>
              <CardDescription>
                Configure your daily study routine by dragging subjects to time slots
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="wakeTime">Wake Time</Label>
                    <Input
                      id="wakeTime"
                      type="time"
                      value={scheduleSettings.wakeTime}
                      onChange={(e) => setScheduleSettings(prev => ({ ...prev, wakeTime: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sleepTime">Sleep Time</Label>
                    <Input
                      id="sleepTime"
                      type="time"
                      value={scheduleSettings.sleepTime}
                      onChange={(e) => setScheduleSettings(prev => ({ ...prev, sleepTime: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Daily Study Goal</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={scheduleSettings.dailyHours}
                        onChange={(e) => setScheduleSettings(prev => ({ ...prev, dailyHours: parseInt(e.target.value) || 0 }))}
                        className="w-20"
                        min="0"
                        max="24"
                      />
                      <span className="flex items-center">hours</span>
                      <Input
                        type="number"
                        value={scheduleSettings.dailyMinutes}
                        onChange={(e) => setScheduleSettings(prev => ({ ...prev, dailyMinutes: parseInt(e.target.value) || 0 }))}
                        className="w-20"
                        min="0"
                        max="59"
                      />
                      <span className="flex items-center">minutes</span>
                    </div>
                  </div>
                  <div>
                    <Label>Study Days per Week</Label>
                    <Input
                      type="number"
                      value={scheduleSettings.studyDaysPerWeek}
                      onChange={(e) => setScheduleSettings(prev => ({ ...prev, studyDaysPerWeek: parseInt(e.target.value) || 1 }))}
                      min="1"
                      max="7"
                    />
                  </div>
                </div>
              </div>

              {/* Weekly Schedule with Drag & Drop */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Weekly Schedule</h3>
                <p className="text-sm text-muted-foreground">
                  Drag subjects from the list below to assign them to specific time slots
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Available Subjects */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Available Subjects
                    </h4>
                    <div className="space-y-2">
                      {customSubjects.map(subject => (
                        <div
                          key={subject}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', subject);
                            e.dataTransfer.effectAllowed = 'copy';
                          }}
                          className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg cursor-grab hover:bg-primary/15 transition-colors"
                        >
                          <Move className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{subject}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weekly Calendar */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Time Slots
                    </h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <div key={day} className="border rounded-lg p-3">
                          <h5 className="font-medium text-sm mb-2">{day}</h5>
                          <div
                            className="min-h-12 border-2 border-dashed border-muted-foreground/25 rounded p-2 text-center text-sm text-muted-foreground hover:border-primary/50 transition-colors"
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.add('border-primary/50', 'bg-primary/5');
                            }}
                            onDragLeave={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.remove('border-primary/50', 'bg-primary/5');
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.remove('border-primary/50', 'bg-primary/5');
                              const subject = e.dataTransfer.getData('text/plain');
                              if (subject) {
                                e.currentTarget.textContent = subject;
                                e.currentTarget.classList.add('bg-primary/10', 'text-primary', 'font-medium');
                              }
                            }}
                          >
                            Drop subject here
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(2)}>
              Previous
            </Button>
            <Button onClick={() => setCurrentStep(4)}>
              Next Step
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Create */}
      {currentStep === 4 && selectedTemplate && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Your Study Cycle</CardTitle>
              <CardDescription>
                Confirm your settings before creating your cycle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Cycle Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Template:</span>
                        <span>{selectedTemplate.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span>{selectedTemplate.duration} weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Difficulty:</span>
                        <Badge className={getDifficultyColor(selectedTemplate.difficulty)}>
                          {selectedTemplate.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Schedule Preview</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Daily Goal:</span>
                        <span>6 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Study Days:</span>
                        <span>6 days/week</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Wake Time:</span>
                        <span>7:00 AM</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Subjects ({customSubjects.length})</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {customSubjects.map(subject => (
                      <div key={subject} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="text-sm">{subject}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Ready to Start Your Journey!</h4>
                    <p className="text-sm text-muted-foreground">
                      Your personalized study cycle will help you achieve your learning goals.
                      You can always modify settings later.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(3)}>
              Previous
            </Button>
            <Button
              onClick={handleCreateCycle}
              disabled={createCycle.isPending}
              className="min-w-40"
            >
              {createCycle.isPending ? (
                "Creating Cycle..."
              ) : (
                <>
                  Create Study Cycle
                  <Sparkles className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

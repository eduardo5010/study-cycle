import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Subject, StudySettings } from "@shared/schema";
import { generateStudySchedule } from "@/lib/schedule-generator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Users, Share, MessageCircle, Heart, TrendingUp, Flame, Target, BookOpen, Calendar, MessageSquare, Sparkles,
  Brain, Zap, Award, Settings, User, Bell, FileText, PenTool, Gamepad2, BarChart3, Clock,
  Lightbulb, GraduationCap, Mic, Video, Camera, Upload, Star, Trophy, ChevronRight
} from "lucide-react";
import DashboardOverview from "@/components/dashboard-overview";
import WeeklySchedule from "@/components/weekly-schedule";
import QuickActions from "@/components/quick-actions";
import StudySettingsComponent from "@/components/study-settings";
import SubjectList from "@/components/subject-list";
import AddSubjectModal from "@/components/add-subject-modal";
import CurrentSubject from "@/components/current-subject";
import SkillsProgress from "@/components/skills-progress";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InsertSubject } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function HomePage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch subjects
  const { data: subjects = [], isLoading: subjectsLoading } = useQuery<Subject[]>({
    queryKey: ["/api/subjects"],
  });

  // Fetch study settings
  const { data: settings, isLoading: settingsLoading } = useQuery<StudySettings>({
    queryKey: ["/api/study-settings"],
  });

  // Fetch study cycles
  const { data: studyCycles = [], isLoading: cyclesLoading } = useQuery<any[]>({
    queryKey: ["/api/study-cycles"],
  });

  // Add subject mutation
  const addSubjectMutation = useMutation({
    mutationFn: async (data: InsertSubject) => {
      const response = await apiRequest("POST", "/api/subjects", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subjects"] });
      toast({
        title: t('toast.subjectAdded'),
        description: t('toast.subjectAddedDesc'),
      });
    },
  });

  const isLoading = subjectsLoading || settingsLoading;

  // Empty state - project is just starting
  const hasNoData = !isLoading && subjects.length === 0;
  const hasCycles = !cyclesLoading && studyCycles.length > 0;

  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex-1 p-8">
        <p className="text-muted-foreground">Erro ao carregar configurações.</p>
      </div>
    );
  }

  const weeks = generateStudySchedule(subjects, settings, language);
  
  const totalCycleMinutes = subjects.reduce((total, subject) => {
    return total + (subject.hours * 60 + subject.minutes);
  }, 0);
  
  const totalCycleTime = {
    hours: Math.floor(totalCycleMinutes / 60),
    minutes: totalCycleMinutes % 60,
  };

  const handleAddSubject = async (data: InsertSubject) => {
    await addSubjectMutation.mutateAsync(data);
  };

  const handleNewCycle = () => {
    toast({
      title: t('toast.featureInDev'),
      description: t('toast.newCycleInDev'),
    });
  };

  const handleCompleteCycle = () => {
    if (confirm(t('toast.cycleCompletedConfirm'))) {
      subjects.forEach(subject => {
        fetch(`/api/subjects/${subject.id}`, { method: 'DELETE' });
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/subjects'] });
      
      toast({
        title: t('toast.cycleCompleted'),
        description: t('toast.cycleCompletedDesc'),
      });
    }
  };

  const handleConfigureSchedule = () => {
    toast({
      title: t('toast.featureInDev'),
      description: t('toast.configureInDev'),
    });
  };

  const handleExportSchedule = () => {
    if (weeks.length === 0) {
      toast({
        title: t('toast.noScheduleExport'),
        description: t('toast.noScheduleExportDesc'),
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: t('toast.featureInDev'),
      description: t('toast.exportInDev'),
    });
  };

  const handleEditSettings = () => {
    toast({
      title: t('toast.featureInDev'),
      description: t('toast.editInDev'),
    });
  };

  return (
    <div className="flex-1 overflow-y-auto content-scroll">
      <div className="max-w-7xl mx-auto p-8 space-y-12" data-testid="home-page">

        {/* Header Welcome */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Welcome back, {user?.name?.split(' ')[0] || 'Scholar'}! 👋
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your personalized learning hub. Access all your study tools, connect with peers, and track your progress.
          </p>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Button asChild size="sm" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
              <Link href="/cycle/create">
                <Sparkles className="h-4 w-4 mr-2" />
                Quick Start
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/flashcards">
                <Zap className="h-4 w-4 mr-2" />
                Study Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/feed">
                <MessageSquare className="h-4 w-4 mr-2" />
                Community
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
          </div>
        </div>

        {/* Recent Activity & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest study sessions and achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Completed Mathematics session</p>
                    <p className="text-sm text-muted-foreground">2 hours ago • 95% accuracy</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">+25 XP</Badge>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Reviewed 20 flashcards</p>
                    <p className="text-sm text-muted-foreground">4 hours ago • Physics chapter 3</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">+15 XP</Badge>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Achieved 7-day study streak</p>
                    <p className="text-sm text-muted-foreground">Yesterday • Keep it up!</p>
                  </div>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">+50 XP</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Today's Goals
              </CardTitle>
              <CardDescription>Track your daily progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Study Time</span>
                    <span>2.5h / 3h</span>
                  </div>
                  <Progress value={83} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Flashcards</span>
                    <span>45 / 50</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Subjects</span>
                    <span>3 / 4</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">7</div>
                    <div className="text-xs text-muted-foreground">Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">92%</div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">1,250</div>
                    <div className="text-xs text-muted-foreground">XP</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Study Hub - Core Learning Features */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Study Hub</h2>
            <Badge variant="secondary" className="ml-auto">Core Learning</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Create Study Cycle */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-3">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Create Cycle</CardTitle>
                <CardDescription>Build your personalized study plan</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full hover:scale-105 transition-transform">
                  <Link href="/cycle/create">
                    Get Started
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Flashcards */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-purple-200 hover:border-purple-400">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-3">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Flashcards</CardTitle>
                <CardDescription>Review and memorize concepts</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild className="w-full hover:scale-105 transition-transform">
                  <Link href="/flashcards">
                    Study Now
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* AI Generator */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-cyan-200 hover:border-cyan-400">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-3">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">AI Generator</CardTitle>
                <CardDescription>Create content with AI assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild className="w-full hover:scale-105 transition-transform">
                  <Link href="/ai-flashcards">
                    Generate
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Calendar */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-orange-200 hover:border-orange-400">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-3">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Calendar</CardTitle>
                <CardDescription>Schedule and track study sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild className="w-full hover:scale-105 transition-transform">
                  <Link href="/calendar">
                    View Schedule
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Edit Current Cycle */}
            {hasCycles && (
              <Card className="group hover:shadow-lg transition-all duration-300 border-amber-200 hover:border-amber-400">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center mb-3">
                    <PenTool className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Edit Cycle</CardTitle>
                  <CardDescription>Modify your current study plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" asChild className="w-full hover:scale-105 transition-transform">
                    <Link href="/cycle/edit">
                      Edit Plan
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Community Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Community</h2>
            <Badge variant="secondary" className="ml-auto">Connect & Share</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feed */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-indigo-200 hover:border-indigo-400">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-3">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Study Feed</CardTitle>
                <CardDescription>Share achievements and get inspired</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild className="w-full hover:scale-105 transition-transform">
                  <Link href="/feed">
                    Explore Feed
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Study Groups */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-teal-200 hover:border-teal-400">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-green-600 rounded-lg flex items-center justify-center mb-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Study Groups</CardTitle>
                <CardDescription>Collaborate with fellow learners</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild className="w-full hover:scale-105 transition-transform">
                  <Link href="/study-groups">
                    Join Groups
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Chats */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-emerald-200 hover:border-emerald-400">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mb-3">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Messages</CardTitle>
                <CardDescription>Chat with study partners</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild className="w-full group-hover:scale-105 transition-transform">
                  <Link href="/chats">
                    Open Chats
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tools & Analytics */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Tools & Analytics</h2>
            <Badge variant="secondary" className="ml-auto">Track Progress</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Leaderboard */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-yellow-200 hover:border-yellow-400">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center mb-3">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Leaderboard</CardTitle>
                <CardDescription>Compete and see rankings</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild className="w-full group-hover:scale-105 transition-transform">
                  <Link href="/leaderboard">
                    View Rankings
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-red-200 hover:border-red-400">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center mb-3">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Notifications</CardTitle>
                <CardDescription>Stay updated with activities</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild className="w-full group-hover:scale-105 transition-transform">
                  <Link href="/notifications">
                    View All
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-gray-400">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-slate-600 rounded-lg flex items-center justify-center mb-3">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Settings</CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild className="w-full group-hover:scale-105 transition-transform">
                  <Link href="/settings">
                    Configure
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Profile */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-violet-200 hover:border-violet-400">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center mb-3">
                  <User className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Profile</CardTitle>
                <CardDescription>Manage your account</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild className="w-full group-hover:scale-105 transition-transform">
                  <Link href="/profile">
                    View Profile
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Content Creation */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
              <PenTool className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Content Creation</h2>
            <Badge variant="secondary" className="ml-auto">Create & Share</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Course Builder */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-rose-200 hover:border-rose-400">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center mb-3">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Course Builder</CardTitle>
                <CardDescription>Create and publish courses</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild className="w-full group-hover:scale-105 transition-transform">
                  <Link href="/course-builder">
                    Create Course
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Teacher Dashboard */}
            {user?.isTeacher && (
              <Card className="group hover:shadow-lg transition-all duration-300 border-blue-200 hover:border-blue-400">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-3">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Teacher Hub</CardTitle>
                  <CardDescription>Manage your teaching content</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" asChild className="w-full group-hover:scale-105 transition-transform">
                    <Link href="/teacher">
                      Teacher Dashboard
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Upload Content */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-lime-200 hover:border-lime-400">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-lime-500 to-green-600 rounded-lg flex items-center justify-center mb-3">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Upload Files</CardTitle>
                <CardDescription>Share documents and resources</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild className="w-full group-hover:scale-105 transition-transform">
                  <Link href="/profile">
                    Upload Now
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Stats & Progress */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            Your Progress
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flame className="h-8 w-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-orange-600">7</div>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-600">42h</div>
                <p className="text-sm text-muted-foreground">This Week</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-purple-600">12</div>
                <p className="text-sm text-muted-foreground">Subjects</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-green-600">4.8</div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* No Study Cycle - Create First Cycle (fallback) */}
        {hasNoData && (
          <section className="space-y-6">
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardHeader>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Ready to Start Learning?</CardTitle>
                  <CardDescription className="text-lg">
                    Create your first study cycle and unlock all features
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <Button size="lg" asChild className="min-w-48">
                  <Link href="/cycle/create">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Create Study Cycle
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Study Cycle Overview (when cycles exist) */}
        {hasCycles && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              Current Study Cycle
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <CurrentSubject weeks={weeks} subjects={subjects} />
                <WeeklySchedule weeks={weeks} subjects={subjects} />
              </div>

              <div className="space-y-6">
                <QuickActions
                  onAddSubject={() => setIsAddSubjectModalOpen(true)}
                  onConfigureSchedule={handleConfigureSchedule}
                  onExportSchedule={handleExportSchedule}
                />
                <StudySettingsComponent
                  settings={settings}
                  totalCycleTime={totalCycleTime}
                  onEdit={handleEditSettings}
                />
                <SubjectList subjects={subjects} />
              </div>
            </div>
          </section>
        )}

      </div>

      <AddSubjectModal
        isOpen={isAddSubjectModalOpen}
        onClose={() => setIsAddSubjectModalOpen(false)}
        onSubmit={handleAddSubject}
      />
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  User,
  Shield,
  Bell,
  Palette,
  Clock,
  Globe,
  Volume2,
  Eye,
  Lock,
  Smartphone,
  Database,
  Cloud,
  Settings as SettingsIcon,
  Target,
  Brain,
  Zap,
  Save,
  RotateCcw,
  Download,
  Upload,
  Trash2,
  Plus,
  Edit,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Trophy,
  Heart,
  Star,
  BarChart3,
  Lightbulb,
  Compass,
  Rocket,
  GraduationCap,
  BookOpen,
  Calendar,
  Mail,
  MessageSquare,
  ExternalLink,
  TrendingUp
} from "lucide-react";
import { SpacedReviewEngine, MemoryProfile } from "@/lib/spaced-review-engine";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { DifficultyControls } from "@/components/difficulty-controls";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [, navigate] = useLocation();
  const [settings, setSettings] = useState({
    // Profile settings
    displayName: "Study Master",
    bio: "Passionate learner and teacher",
    email: "",
    language: "pt-br",

    // Study settings
    dailyStudyHours: 6,
    dailyStudyMinutes: 0,
    studyTechnique: "pomodoro",
    breakDuration: 5,
    longBreakDuration: 15,
    enableGamification: true,
    showProgressBars: true,

    // Notification settings
    pushEnabled: true,
    emailEnabled: true,
    studyReminders: true,
    achievementNotifications: true,
    reminderTime: "09:00",
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",

    // Appearance settings
    theme: "system",
    colorScheme: "blue",
    fontSize: "medium",
    compactMode: false,
    animationsEnabled: true,
    highContrast: false,

    // Privacy settings
    profileVisibility: "public",
    activityVisibility: "friends",
    dataSharing: false,
    analyticsTracking: true,
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();

  // Fetch settings from API
  const { data: apiSettings, isLoading } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: () => fetch('/api/settings').then(res => res.json()),
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (updates: any) =>
      fetch('/api/settings/general', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (apiSettings) {
      setSettings(prev => ({ ...prev, ...apiSettings }));
    }
  }, [apiSettings]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateSettingsMutation.mutate(settings);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all settings to default?")) {
      setSettings({
        displayName: user?.name || "Study Master",
        bio: "",
        email: user?.email || "",
        language: "pt-br",
        dailyStudyHours: 6,
        dailyStudyMinutes: 0,
        studyTechnique: "pomodoro",
        breakDuration: 5,
        longBreakDuration: 15,
        enableGamification: true,
        showProgressBars: true,
        pushEnabled: true,
        emailEnabled: true,
        studyReminders: true,
        achievementNotifications: true,
        reminderTime: "09:00",
        quietHoursStart: "22:00",
        quietHoursEnd: "08:00",
        theme: "system",
        colorScheme: "blue",
        fontSize: "medium",
        compactMode: false,
        animationsEnabled: true,
        highContrast: false,
        profileVisibility: "public",
        activityVisibility: "friends",
        dataSharing: false,
        analyticsTracking: true,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <SettingsIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">
                Customize your learning experience and preferences
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={handleSave} disabled={updateSettingsMutation.isPending}>
              {updateSettingsMutation.isPending ? (
                <>
                  <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 max-w-4xl">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Learning
            </TabsTrigger>
            <TabsTrigger value="memory" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Memory
            </TabsTrigger>
            <TabsTrigger value="study" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Study
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Settings
                </CardTitle>
                <CardDescription>
                  Manage your public profile and personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={settings.displayName}
                      onChange={(e) => handleSettingChange('displayName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleSettingChange('email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell others about yourself..."
                    value={settings.bio}
                    onChange={(e) => handleSettingChange('bio', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>
                  Control who can see your information and activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="profileVisibility">Profile Visibility</Label>
                  <Select value={settings.profileVisibility} onValueChange={(value) => handleSettingChange('profileVisibility', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can see</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activityVisibility">Activity Visibility</Label>
                  <Select value={settings.activityVisibility} onValueChange={(value) => handleSettingChange('activityVisibility', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Data Sharing</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow anonymous usage data to help improve the platform
                    </p>
                  </div>
                  <Switch
                    checked={settings.dataSharing}
                    onCheckedChange={(checked) => handleSettingChange('dataSharing', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learning" className="space-y-6">
            <DifficultyControls
              adaptiveMode={true}
              challengePreference={70}
              currentDifficulty="optimal"
            />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Avaliação Cognitiva
                </CardTitle>
                <CardDescription>
                  Faça uma avaliação para personalizar seu aprendizado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Status da Avaliação</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.memoryType
                        ? "Avaliação realizada - Personalização ativa"
                        : "Avaliação não realizada - Complete para personalização avançada"
                      }
                    </p>
                  </div>
                  {user?.memoryType ? (
                    <Button variant="outline" size="sm" onClick={() => navigate('/cognitive-assessment')}>
                      <Brain className="h-4 w-4 mr-2" />
                      Refazer Avaliação
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => navigate('/cognitive-assessment')}>
                      <Brain className="h-4 w-4 mr-2" />
                      Fazer Avaliação
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className={`text-center p-4 rounded-lg ${user?.memoryType ? 'bg-green-50 dark:bg-green-950/30' : 'bg-blue-50 dark:bg-blue-950/30'}`}>
                    <Target className={`h-8 w-8 mx-auto mb-2 ${user?.memoryType ? 'text-green-600' : 'text-blue-600'}`} />
                    <p className="text-sm font-medium">Perfil Cognitivo</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.memoryType ? `${user.memoryType} - Avaliado` : 'Não avaliado'}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <Lightbulb className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <p className="text-sm font-medium">Estilo de Aprendizado</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.memoryType ? 'Personalizado' : 'Adaptativo'}
                    </p>
                  </div>
                  <div className={`text-center p-4 rounded-lg ${user?.memoryType ? 'bg-purple-50 dark:bg-purple-950/30' : 'bg-gray-50 dark:bg-gray-950/30'}`}>
                    <TrendingUp className={`h-8 w-8 mx-auto mb-2 ${user?.memoryType ? 'text-purple-600' : 'text-gray-600'}`} />
                    <p className="text-sm font-medium">Dificuldade Ideal</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.memoryType ? 'Otimizada' : 'Padrão'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Técnicas de Estudo Inteligentes
                </CardTitle>
                <CardDescription>
                  Configure técnicas adaptativas baseadas em neuroaprendizagem
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Revisão Espaçada</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Intervalos Adaptativos</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Dificuldade Progressiva</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Reforço Seletivo</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Técnicas Interativas</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Revelação Gradual</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Dicas Contextuais</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Feedback em Tempo Real</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Modos de Estudo Especiais</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <div className="text-center">
                        <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                        <h5 className="font-medium text-sm">Modo Fluxo</h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          Sessões imersivas de alta concentração
                        </p>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-center">
                        <Heart className="h-8 w-8 mx-auto mb-2 text-pink-500" />
                        <h5 className="font-medium text-sm">Modo Suave</h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          Aprendizado gradual e confortável
                        </p>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-center">
                        <Zap className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <h5 className="font-medium text-sm">Modo Desafiador</h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          Máximo aprendizado através do desafio
                        </p>
                      </div>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Memory Tab */}
          <TabsContent value="memory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Memory Profile Settings
                </CardTitle>
                <CardDescription>
                  Configure your spaced repetition algorithm based on your memory type
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Memory Profile</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose your memory profile to optimize review intervals. This affects how frequently you see flashcards.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className={`p-4 cursor-pointer transition-all ${
                      user?.memoryProfile === MemoryProfile.GOOD
                        ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-950/30'
                        : 'hover:shadow-md'
                    }`}>
                      <div className="text-center">
                        <Star className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <h4 className="font-medium">Good Memory</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Longer intervals, fewer reviews needed
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          0.2x retention factor
                        </Badge>
                      </div>
                    </Card>

                    <Card className={`p-4 cursor-pointer transition-all ${
                      (!user?.memoryProfile || user?.memoryProfile === MemoryProfile.POOR)
                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/30'
                        : 'hover:shadow-md'
                    }`}>
                      <div className="text-center">
                        <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <h4 className="font-medium">Poor Memory</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Standard intervals, balanced approach
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          0.4x retention factor
                        </Badge>
                      </div>
                    </Card>

                    <Card className={`p-4 cursor-pointer transition-all ${
                      user?.memoryProfile === MemoryProfile.TERRIBLE
                        ? 'ring-2 ring-red-500 bg-red-50 dark:bg-red-950/30'
                        : 'hover:shadow-md'
                    }`}>
                      <div className="text-center">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                        <h4 className="font-medium">Terrible Memory</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Shorter intervals, more frequent reviews
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          0.8x retention factor
                        </Badge>
                      </div>
                    </Card>
                  </div>

                  <div className="flex gap-3 justify-center mt-6">
                    <Button
                      variant={user?.memoryProfile === MemoryProfile.GOOD ? 'default' : 'outline'}
                      onClick={async () => {
                        if (!user) return;
                        const engine = new SpacedReviewEngine();
                        const success = await engine.setMemoryProfile(user.id, MemoryProfile.GOOD);
                        if (success) {
                          toast({
                            title: "Memory profile updated",
                            description: "Good memory profile activated",
                          });
                        }
                      }}
                    >
                      Set Good Memory
                    </Button>
                    <Button
                      variant={(!user?.memoryProfile || user?.memoryProfile === MemoryProfile.POOR) ? 'default' : 'outline'}
                      onClick={async () => {
                        if (!user) return;
                        const engine = new SpacedReviewEngine();
                        const success = await engine.setMemoryProfile(user.id, MemoryProfile.POOR);
                        if (success) {
                          toast({
                            title: "Memory profile updated",
                            description: "Poor memory profile activated",
                          });
                        }
                      }}
                    >
                      Set Poor Memory
                    </Button>
                    <Button
                      variant={user?.memoryProfile === MemoryProfile.TERRIBLE ? 'default' : 'outline'}
                      onClick={async () => {
                        if (!user) return;
                        const engine = new SpacedReviewEngine();
                        const success = await engine.setMemoryProfile(user.id, MemoryProfile.TERRIBLE);
                        if (success) {
                          toast({
                            title: "Memory profile updated",
                            description: "Terrible memory profile activated",
                          });
                        }
                      }}
                    >
                      Set Terrible Memory
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Spaced Repetition Algorithm</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Algorithm Settings</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Adaptive Intervals</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Difficulty Adjustment</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Performance Calibration</Label>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Review Threshold</h4>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">
                          Minimum retention probability before review
                        </Label>
                        <Slider
                          defaultValue={[30]}
                          max={50}
                          min={10}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>10%</span>
                          <span>30% (default)</span>
                          <span>50%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Machine Learning</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Model Training</h4>
                      <p className="text-xs text-muted-foreground">
                        The algorithm learns from your performance to optimize intervals
                      </p>
                      <Button variant="outline" size="sm">
                        <Zap className="h-4 w-4 mr-2" />
                        Retrain Model
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Training Data</h4>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <BarChart3 className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {user?.id ? 'Personalized model active' : 'Collecting training data...'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm text-blue-900 dark:text-blue-100">
                        How Memory Profiles Work
                      </h4>
                      <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
                        Your memory profile affects how often you review material. Better memory = longer intervals.
                        The algorithm continuously adapts based on your actual performance.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Study Tab */}
          <TabsContent value="study" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Study Preferences
                </CardTitle>
                <CardDescription>
                  Configure your learning habits and techniques
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Daily Study Goal</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={settings.dailyStudyHours}
                        onChange={(e) => handleSettingChange('dailyStudyHours', parseInt(e.target.value))}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">hours</span>
                      <Input
                        type="number"
                        value={settings.dailyStudyMinutes}
                        onChange={(e) => handleSettingChange('dailyStudyMinutes', parseInt(e.target.value))}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">minutes</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="studyTechnique">Study Technique</Label>
                    <Select value={settings.studyTechnique} onValueChange={(value) => handleSettingChange('studyTechnique', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pomodoro">Pomodoro (25 min work)</SelectItem>
                        <SelectItem value="custom">Custom Intervals</SelectItem>
                        <SelectItem value="continuous">Continuous Study</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {settings.studyTechnique === 'pomodoro' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Break Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={settings.breakDuration}
                        onChange={(e) => handleSettingChange('breakDuration', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Long Break Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={settings.longBreakDuration}
                        onChange={(e) => handleSettingChange('longBreakDuration', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Gamification</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable points, badges, and achievements
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableGamification}
                    onCheckedChange={(checked) => handleSettingChange('enableGamification', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Progress Bars</Label>
                    <p className="text-sm text-muted-foreground">
                      Show progress indicators throughout the app
                    </p>
                  </div>
                  <Switch
                    checked={settings.showProgressBars}
                    onCheckedChange={(checked) => handleSettingChange('showProgressBars', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how and when you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications on your device
                    </p>
                  </div>
                  <Switch
                    checked={settings.pushEnabled}
                    onCheckedChange={(checked) => handleSettingChange('pushEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailEnabled}
                    onCheckedChange={(checked) => handleSettingChange('emailEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Study Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminded to study regularly
                    </p>
                  </div>
                  <Switch
                    checked={settings.studyReminders}
                    onCheckedChange={(checked) => handleSettingChange('studyReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Achievement Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Celebrate your learning milestones
                    </p>
                  </div>
                  <Switch
                    checked={settings.achievementNotifications}
                    onCheckedChange={(checked) => handleSettingChange('achievementNotifications', checked)}
                  />
                </div>

                {settings.studyReminders && (
                  <div className="space-y-2">
                    <Label htmlFor="reminderTime">Reminder Time</Label>
                    <Input
                      id="reminderTime"
                      type="time"
                      value={settings.reminderTime}
                      onChange={(e) => handleSettingChange('reminderTime', e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <Label>Quiet Hours</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quietStart">Start Time</Label>
                      <Input
                        id="quietStart"
                        type="time"
                        value={settings.quietHoursStart}
                        onChange={(e) => handleSettingChange('quietHoursStart', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quietEnd">End Time</Label>
                      <Input
                        id="quietEnd"
                        type="time"
                        value={settings.quietHoursEnd}
                        onChange={(e) => handleSettingChange('quietHoursEnd', e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No notifications will be sent during these hours
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance Settings
                </CardTitle>
                <CardDescription>
                  Customize how the app looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={settings.theme} onValueChange={(value) => handleSettingChange('theme', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colorScheme">Color Scheme</Label>
                  <Select value={settings.colorScheme} onValueChange={(value) => handleSettingChange('colorScheme', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <Select value={settings.fontSize} onValueChange={(value) => handleSettingChange('fontSize', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="xl">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use less space for a denser layout
                    </p>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => handleSettingChange('compactMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Animations</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable smooth transitions and animations
                    </p>
                  </div>
                  <Switch
                    checked={settings.animationsEnabled}
                    onCheckedChange={(checked) => handleSettingChange('animationsEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>High Contrast</Label>
                    <p className="text-sm text-muted-foreground">
                      Increase contrast for better visibility
                    </p>
                  </div>
                  <Switch
                    checked={settings.highContrast}
                    onCheckedChange={(checked) => handleSettingChange('highContrast', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </main>
  );
}

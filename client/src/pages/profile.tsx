import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Settings,
  Trophy,
  BookOpen,
  Brain,
  Target,
  Calendar,
  TrendingUp,
  Award,
  Star,
  Zap,
  Clock,
  CheckCircle,
  Edit3,
  Save,
  Camera
} from "lucide-react";

export default function ProfilePage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [memoryAssessment, setMemoryAssessment] = useState<'good' | 'average' | 'poor' | null>(null);

  // Mock user data - in real app, this would come from API
  const [profileData, setProfileData] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john@example.com",
    bio: "Passionate learner focused on personal growth and academic excellence.",
    avatar: "",
    location: "São Paulo, Brazil",
    timezone: "America/Sao_Paulo",
    learningGoals: "Become a software engineer and master multiple programming languages",
    studyStreak: 7,
    totalStudyHours: 156,
    completedSubjects: 12,
    currentLevel: "Intermediate",
    xpPoints: 2450,
    achievements: 8,
    memoryType: null as 'good' | 'average' | 'poor' | null,
    preferredStudyTime: "morning",
    notificationsEnabled: true,
    socialSharingEnabled: true
  });

  const memoryOptions = [
    {
      value: 'good',
      label: 'Good Memory',
      description: 'I can easily remember information after studying once or twice',
      lambda: 0.2,
      color: 'text-green-600'
    },
    {
      value: 'average',
      label: 'Average Memory',
      description: 'I need to review information several times to remember it well',
      lambda: 0.4,
      color: 'text-yellow-600'
    },
    {
      value: 'poor',
      label: 'Poor Memory',
      description: 'I struggle to remember information and need frequent reviews',
      lambda: 0.8,
      color: 'text-red-600'
    }
  ];

  const handleMemoryAssessment = (memoryType: 'good' | 'average' | 'poor') => {
    setMemoryAssessment(memoryType);
    setProfileData(prev => ({ ...prev, memoryType }));

    // In real app, save to backend
    toast({
      title: "Memory assessment saved!",
      description: `Your learning algorithm has been optimized for ${memoryType} memory.`
    });
  };

  const updateProfile = useMutation({
    mutationFn: async (data: typeof profileData) => {
      // In real app, this would call the API
      await new Promise(resolve => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Profile updated!",
        description: "Your profile information has been saved successfully."
      });
      setIsEditing(false);
    }
  });

  const handleSaveProfile = () => {
    updateProfile.mutate(profileData);
  };

  const getLevelProgress = (xp: number) => {
    const levels = [
      { name: 'Beginner', min: 0, max: 1000 },
      { name: 'Intermediate', min: 1000, max: 2500 },
      { name: 'Advanced', min: 2500, max: 5000 },
      { name: 'Expert', min: 5000, max: 10000 }
    ];

    const currentLevel = levels.find(l => xp >= l.min && xp < l.max) || levels[0];
    const progress = ((xp - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100;

    return { level: currentLevel.name, progress: Math.min(progress, 100) };
  };

  const levelData = getLevelProgress(profileData.xpPoints);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <User className="h-8 w-8" />
          My Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and learning preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback className="text-2xl">
                      {profileData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <h2 className="text-xl font-semibold">{profileData.name}</h2>
                  <p className="text-sm text-muted-foreground">{profileData.email}</p>
                  <Badge variant="secondary" className="mt-2">
                    {levelData.level}
                  </Badge>
                </div>

                <div className="w-full space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">XP Progress</span>
                    <span className="text-sm font-medium">{profileData.xpPoints} XP</span>
                  </div>
                  <Progress value={levelData.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    {Math.round(levelData.progress)}% to next level
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{profileData.studyStreak}</div>
                    <div className="text-xs text-muted-foreground">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{profileData.totalStudyHours}</div>
                    <div className="text-xs text-muted-foreground">Study Hours</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="memory" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Memory
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Update your profile information and bio
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="goals">Learning Goals</Label>
                        <Textarea
                          id="goals"
                          value={profileData.learningGoals}
                          onChange={(e) => setProfileData(prev => ({ ...prev, learningGoals: e.target.value }))}
                          rows={2}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleSaveProfile} disabled={updateProfile.isPending}>
                          <Save className="h-4 w-4 mr-2" />
                          {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Bio</Label>
                        <p className="mt-1">{profileData.bio}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Learning Goals</Label>
                        <p className="mt-1">{profileData.learningGoals}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                        <p className="mt-1">{profileData.location}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Memory Assessment Tab */}
            <TabsContent value="memory" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Memory Assessment
                  </CardTitle>
                  <CardDescription>
                    Help us optimize your learning algorithm by assessing your memory type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!profileData.memoryType ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Brain className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Assess Your Memory</h3>
                        <p className="text-muted-foreground mb-6">
                          This helps us personalize your study schedule and review intervals
                        </p>
                      </div>

                      <div className="space-y-4">
                        {memoryOptions.map((option) => (
                          <Card
                            key={option.value}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              memoryAssessment === option.value
                                ? 'ring-2 ring-primary border-primary'
                                : 'hover:border-primary/50'
                            }`}
                            onClick={() => handleMemoryAssessment(option.value as any)}
                          >
                            <CardContent className="pt-4">
                              <div className="flex items-start gap-3">
                                <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                                  memoryAssessment === option.value
                                    ? 'bg-primary border-primary'
                                    : 'border-muted-foreground'
                                }`} />
                                <div className="flex-1">
                                  <h4 className={`font-semibold ${option.color}`}>
                                    {option.label}
                                  </h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {option.description}
                                  </p>
                                  <Badge variant="outline" className="mt-2 text-xs">
                                    λ = {option.lambda}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold">Memory Assessment Complete</h3>
                      <p className="text-muted-foreground">
                        Your memory type has been set to <strong>
                          {memoryOptions.find(opt => opt.value === profileData.memoryType)?.label}
                        </strong>
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setProfileData(prev => ({ ...prev, memoryType: null }));
                          setMemoryAssessment(null);
                        }}
                      >
                        Retake Assessment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      Study Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Study Time</span>
                      <Badge variant="secondary">{profileData.totalStudyHours}h</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Current Streak</span>
                      <Badge variant="secondary">{profileData.studyStreak} days</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Completed Subjects</span>
                      <Badge variant="secondary">{profileData.completedSubjects}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Achievements Unlocked</span>
                      <Badge variant="secondary">{profileData.achievements}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-purple-500" />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="text-2xl">🏆</div>
                        <div>
                          <p className="font-medium text-sm">7-Day Streak</p>
                          <p className="text-xs text-muted-foreground">Study for 7 consecutive days</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl">📚</div>
                        <div>
                          <p className="font-medium text-sm">Subject Master</p>
                          <p className="text-xs text-muted-foreground">Complete 5 subjects</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl">⚡</div>
                        <div>
                          <p className="font-medium text-sm">Speed Learner</p>
                          <p className="text-xs text-muted-foreground">Complete 10 study sessions in one day</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Preferences</CardTitle>
                  <CardDescription>
                    Manage your account settings and privacy preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Study Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive reminders for study sessions</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={profileData.notificationsEnabled}
                        onChange={(e) => setProfileData(prev => ({ ...prev, notificationsEnabled: e.target.checked }))}
                        className="rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Social Sharing</Label>
                        <p className="text-xs text-muted-foreground">Share achievements on your profile</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={profileData.socialSharingEnabled}
                        onChange={(e) => setProfileData(prev => ({ ...prev, socialSharingEnabled: e.target.checked }))}
                        className="rounded"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Preferred Study Time</Label>
                      <Select
                        value={profileData.preferredStudyTime}
                        onValueChange={(value) => setProfileData(prev => ({ ...prev, preferredStudyTime: value }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
                          <SelectItem value="evening">Evening (6PM - 12AM)</SelectItem>
                          <SelectItem value="night">Night (12AM - 6AM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button variant="destructive" className="w-full">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

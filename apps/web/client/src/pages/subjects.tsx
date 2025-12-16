import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Filter,
  Star,
  TrendingUp,
  BookOpen,
  Calculator,
  Atom,
  Globe,
  Heart,
  Brain,
  Code,
  Palette,
  Music,
  Languages,
  History,
  Microscope,
  Zap,
  Target,
  Award,
  Clock,
  Users,
  Flame,
  Eye,
  Heart as HeartIcon,
  Share2,
  MoreHorizontal,
  ChevronRight,
  Sparkles,
  GraduationCap,
  Trophy,
  BarChart3,
  Lightbulb,
  Compass,
  Rocket,
  TreePine,
  Camera,
  Gamepad2,
  Dumbbell,
  ChefHat,
  Wrench,
  Pill,
  Scale,
  Briefcase,
  Newspaper,
  Theater,
  Settings
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { GlobalSubject, InsertGlobalSubject } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import GlobalSubjectsList from "@/components/global-subjects-list";
import AddGlobalSubjectModal from "@/components/add-global-subject-modal";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";

interface SubjectCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  description: string;
  subjects: string[];
}

interface SubjectStats {
  totalSubjects: number;
  studiedSubjects: number;
  averageProgress: number;
  favoriteCategory: string;
  studyStreak: number;
}

export default function SubjectsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("explore");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"name" | "popularity" | "recent">("name");

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();

  // Subject categories with beautiful icons and colors
  const categories: SubjectCategory[] = [
    {
      id: "mathematics",
      name: "Mathematics",
      icon: Calculator,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      description: "Numbers, logic, and problem-solving",
      subjects: ["Algebra", "Geometry", "Calculus", "Statistics", "Trigonometry"]
    },
    {
      id: "sciences",
      name: "Sciences",
      icon: Atom,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      description: "Physics, Chemistry, Biology",
      subjects: ["Physics", "Chemistry", "Biology", "Astronomy", "Geology"]
    },
    {
      id: "languages",
      name: "Languages",
      icon: Languages,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      description: "Communication and literature",
      subjects: ["English", "Spanish", "French", "Portuguese", "German"]
    },
    {
      id: "technology",
      name: "Technology",
      icon: Code,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
      description: "Programming and digital skills",
      subjects: ["Python", "JavaScript", "Java", "Web Development", "Data Science"]
    },
    {
      id: "arts",
      name: "Arts",
      icon: Palette,
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/30",
      description: "Creativity and expression",
      subjects: ["Drawing", "Music", "Photography", "Design", "Literature"]
    },
    {
      id: "social",
      name: "Social Sciences",
      icon: Globe,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      description: "History, geography, society",
      subjects: ["History", "Geography", "Psychology", "Sociology", "Philosophy"]
    },
    {
      id: "health",
      name: "Health & Medicine",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      description: "Health, medicine, wellness",
      subjects: ["Anatomy", "Nutrition", "Psychology", "First Aid", "Public Health"]
    },
    {
      id: "business",
      name: "Business",
      icon: Briefcase,
      color: "text-indigo-600",
      bgColor: "bg-indigo-900/30",
      description: "Economics, management, finance",
      subjects: ["Economics", "Marketing", "Finance", "Management", "Entrepreneurship"]
    }
  ];

  // Fetch global subjects
  const { data: globalSubjects = [], isLoading } = useQuery({
    queryKey: ["/api/global-subjects"],
    queryFn: () => fetch("/api/global-subjects").then(res => res.json()) as Promise<GlobalSubject[]>,
  });

  // Mock stats - in real app, this would come from API
  const subjectStats: SubjectStats = {
    totalSubjects: globalSubjects.length,
    studiedSubjects: Math.floor(globalSubjects.length * 0.7),
    averageProgress: 65,
    favoriteCategory: "mathematics",
    studyStreak: 12
  };

  // Create global subject mutation
  const createGlobalSubjectMutation = useMutation({
    mutationFn: (data: InsertGlobalSubject) =>
      apiRequest("/api/global-subjects", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/global-subjects"] });
      toast({
        title: t('toast.globalSubjectAdded'),
        description: t('toast.globalSubjectAddedDesc'),
      });
    },
    onError: () => {
      toast({
        title: t('toast.error'),
        description: t('toast.globalSubjectError'),
        variant: "destructive",
      });
    },
  });

  // Delete global subject mutation
  const deleteGlobalSubjectMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/global-subjects/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/global-subjects"] });
      toast({
        title: t('toast.globalSubjectDeleted'),
        description: t('toast.globalSubjectDeletedDesc'),
      });
    },
    onError: () => {
      toast({
        title: t('toast.error'),
        description: t('toast.globalSubjectDeleteError'),
        variant: "destructive",
      });
    },
  });

  // Filter and sort subjects
  const filteredSubjects = useMemo(() => {
    let filtered = globalSubjects.filter(subject =>
      subject.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedCategory !== "all") {
      filtered = filtered.filter(subject => {
        const category = categories.find(cat => cat.id === selectedCategory);
        return category?.subjects.some(catSubject =>
          subject.name.toLowerCase().includes(catSubject.toLowerCase())
        );
      });
    }

    // Sort subjects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "popularity":
          // Mock popularity sorting - in real app, this would be based on usage stats
          return Math.random() - 0.5;
        default:
          return 0;
      }
    });

    return filtered;
  }, [globalSubjects, searchQuery, selectedCategory, sortBy]);

  const handleAddSubject = (data: InsertGlobalSubject) => {
    createGlobalSubjectMutation.mutate(data);
  };

  const handleDeleteSubject = (subjectId: string) => {
    if (confirm(t('subjects.confirmDelete'))) {
      deleteGlobalSubjectMutation.mutate(subjectId);
    }
  };

  const handleEditSubject = (subject: GlobalSubject) => {
    toast({
      title: t('toast.featureInDev'),
      description: t('toast.editSubjectInDev'),
    });
  };

  const toggleFavorite = (subjectId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(subjectId)) {
        newFavorites.delete(subjectId);
      } else {
        newFavorites.add(subjectId);
      }
      return newFavorites;
    });
  };

  const getSubjectIcon = (subjectName: string) => {
    const name = subjectName.toLowerCase();

    if (name.includes('math') || name.includes('algebra') || name.includes('calculus')) {
      return Calculator;
    }
    if (name.includes('physics') || name.includes('chemistry') || name.includes('biology')) {
      return Atom;
    }
    if (name.includes('english') || name.includes('spanish') || name.includes('french')) {
      return Languages;
    }
    if (name.includes('programming') || name.includes('python') || name.includes('javascript')) {
      return Code;
    }
    if (name.includes('history') || name.includes('geography')) {
      return Globe;
    }
    if (name.includes('art') || name.includes('drawing') || name.includes('music')) {
      return Palette;
    }

    return BookOpen;
  };

  const getSubjectColor = (subjectName: string) => {
    const colors = [
      "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
      "text-green-600 bg-green-100 dark:bg-green-900/30",
      "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
      "text-orange-600 bg-orange-100 dark:bg-orange-900/30",
      "text-red-600 bg-red-100 dark:bg-red-900/30",
      "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30",
      "text-pink-600 bg-pink-100 dark:bg-pink-900/30",
      "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30"
    ];
    return colors[Math.abs(subjectName.length) % colors.length];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {[...Array(8)].map((_, i) => (
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Sparkles className="h-4 w-4" />
          Discover Your Learning Path
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Master Any Subject
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Explore thousands of subjects, track your progress, and build your knowledge foundation with our comprehensive learning platform.
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
          <TabsTrigger value="explore" className="flex items-center gap-2">
            <Compass className="h-4 w-4" />
            Explore
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Manage
          </TabsTrigger>
        </TabsList>

        {/* Explore Tab */}
        <TabsContent value="explore" className="space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">Total Subjects</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{subjectStats.totalSubjects}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-700 dark:text-green-300 text-sm font-medium">Studied</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">{subjectStats.studiedSubjects}</p>
                  </div>
                  <Target className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-700 dark:text-purple-300 text-sm font-medium">Avg Progress</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{subjectStats.averageProgress}%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
                <Progress value={subjectStats.averageProgress} className="mt-3" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-700 dark:text-orange-300 text-sm font-medium">Study Streak</p>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{subjectStats.studyStreak}</p>
                  </div>
                  <Flame className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Featured Categories */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Rocket className="h-6 w-6 text-primary" />
              Popular Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((category) => {
                const Icon = category.icon;
                return (
                  <Card
                    key={category.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 group"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-xl ${category.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-8 w-8 ${category.color}`} />
                      </div>
                      <h3 className="font-semibold mb-2">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                      <Badge variant="secondary" className="text-xs">
                        {category.subjects.length} subjects
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                All Subjects
              </h2>
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Sort: {sortBy === 'name' ? 'Name' : sortBy === 'recent' ? 'Recent' : 'Popularity'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortBy('name')}>
                      Name (A-Z)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('recent')}>
                      Recently Added
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('popularity')}>
                      Popularity
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {user?.isTeacher && (
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Subject
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSubjects.map((subject) => {
                const Icon = getSubjectIcon(subject.name);
                const colorClass = getSubjectColor(subject.name);
                const isFavorite = favorites.has(subject.id);

                return (
                  <Card key={subject.id} className="hover:shadow-lg transition-all duration-200 group cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-lg ${colorClass} flex items-center justify-center`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(subject.id);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <HeartIcon className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                        </Button>
                      </div>

                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                        {subject.name}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-4">
                        Added {new Date(subject.createdAt).toLocaleDateString()}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-muted-foreground">Active</span>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            {user?.isTeacher && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleEditSubject(subject)}>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteSubject(subject.id)}
                                  className="text-destructive"
                                >
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Explore by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover subjects organized by field of knowledge. Find your passion and start learning today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 group"
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setActiveTab("explore");
                  }}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl ${category.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className={`h-10 w-10 ${category.color}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{category.name}</h3>
                    <p className="text-muted-foreground mb-4">{category.description}</p>
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {category.subjects.slice(0, 3).map((subject) => (
                        <Badge key={subject} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                      {category.subjects.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{category.subjects.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Explore {category.name}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Your Learning Progress</h2>
            <p className="text-muted-foreground">
              Track your journey and celebrate your achievements
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Progress Overview */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Learning Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm text-muted-foreground">{subjectStats.averageProgress}%</span>
                    </div>
                    <Progress value={subjectStats.averageProgress} className="h-3" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary mb-1">{subjectStats.studiedSubjects}</div>
                      <div className="text-sm text-muted-foreground">Subjects Studied</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">{subjectStats.studyStreak}</div>
                      <div className="text-sm text-muted-foreground">Day Streak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">First Week Champion</h4>
                        <p className="text-sm text-muted-foreground">Studied for 7 consecutive days</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <Award className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Subject Master</h4>
                        <p className="text-sm text-muted-foreground">Completed Mathematics section</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <Award className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Speed Learner</h4>
                        <p className="text-sm text-muted-foreground">Learned 50 flashcards in one session</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Learning Goals */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Learning Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Study 30 min daily</span>
                      <Badge variant="default" className="text-xs">Active</Badge>
                    </div>
                    <Progress value={75} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Complete 5 subjects</span>
                      <Badge variant="secondary" className="text-xs">3/5</Badge>
                    </div>
                    <Progress value={60} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Maintain 14-day streak</span>
                      <Badge variant="outline" className="text-xs">12/14</Badge>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-sm mb-1">Continue with Mathematics</h4>
                      <p className="text-xs text-muted-foreground">You're doing great! Keep it up.</p>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-sm mb-1">Try Physics next</h4>
                      <p className="text-xs text-muted-foreground">Based on your math progress.</p>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-sm mb-1">Review flashcards daily</h4>
                      <p className="text-xs text-muted-foreground">Spaced repetition works best.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Manage Tab */}
        <TabsContent value="manage" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Manage Subjects</h2>
              <p className="text-muted-foreground">Add, edit, and organize global subjects</p>
            </div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Global Subject
            </Button>
          </div>

          <GlobalSubjectsList
            subjects={globalSubjects}
            onEdit={handleEditSubject}
            onDelete={handleDeleteSubject}
          />
        </TabsContent>
      </Tabs>

      <AddGlobalSubjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubject}
      />
    </main>
  );
}

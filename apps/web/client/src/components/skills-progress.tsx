import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Code,
  Calculator,
  Beaker,
  Languages,
  History,
  Palette,
  Music,
  Globe,
  Brain,
  Trophy,
  Target,
  TrendingUp,
  Star,
  Zap
} from "lucide-react";

interface SkillProgress {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  xpEarned: number;
  xpRequired: number;
  level: number;
  isCompleted: boolean;
  lastActivity: string;
  category: 'academic' | 'technical' | 'creative' | 'language';
}

interface SkillsProgressProps {
  className?: string;
}

export default function SkillsProgress({ className }: SkillsProgressProps) {
  // Mock skills data - in real app, this would come from API
  const skills: SkillProgress[] = [
    {
      id: "math",
      name: "Mathematics",
      icon: <Calculator className="h-5 w-5" />,
      color: "bg-blue-500",
      xpEarned: 2450,
      xpRequired: 3000,
      level: 3,
      isCompleted: false,
      lastActivity: "2 hours ago",
      category: "academic"
    },
    {
      id: "programming",
      name: "Programming",
      icon: <Code className="h-5 w-5" />,
      color: "bg-green-500",
      xpEarned: 3200,
      xpRequired: 4000,
      level: 4,
      isCompleted: false,
      lastActivity: "1 day ago",
      category: "technical"
    },
    {
      id: "physics",
      name: "Physics",
      icon: <Zap className="h-5 w-5" />,
      color: "bg-purple-500",
      xpEarned: 1800,
      xpRequired: 2500,
      level: 2,
      isCompleted: false,
      lastActivity: "3 days ago",
      category: "academic"
    },
    {
      id: "chemistry",
      name: "Chemistry",
      icon: <Beaker className="h-5 w-5" />,
      color: "bg-orange-500",
      xpEarned: 1200,
      xpRequired: 2000,
      level: 1,
      isCompleted: false,
      lastActivity: "1 week ago",
      category: "academic"
    },
    {
      id: "english",
      name: "English",
      icon: <Languages className="h-5 w-5" />,
      color: "bg-red-500",
      xpEarned: 2800,
      xpRequired: 3000,
      level: 3,
      isCompleted: false,
      lastActivity: "5 hours ago",
      category: "language"
    },
    {
      id: "spanish",
      name: "Spanish",
      icon: <Globe className="h-5 w-5" />,
      color: "bg-yellow-500",
      xpEarned: 800,
      xpRequired: 1500,
      level: 1,
      isCompleted: false,
      lastActivity: "2 days ago",
      category: "language"
    },
    {
      id: "history",
      name: "History",
      icon: <History className="h-5 w-5" />,
      color: "bg-indigo-500",
      xpEarned: 950,
      xpRequired: 1800,
      level: 1,
      isCompleted: false,
      lastActivity: "4 days ago",
      category: "academic"
    },
    {
      id: "art",
      name: "Digital Art",
      icon: <Palette className="h-5 w-5" />,
      color: "bg-pink-500",
      xpEarned: 600,
      xpRequired: 1200,
      level: 1,
      isCompleted: false,
      lastActivity: "1 week ago",
      category: "creative"
    }
  ];

  const completedSkills = skills.filter(skill => skill.isCompleted);
  const inProgressSkills = skills.filter(skill => !skill.isCompleted);
  const totalXpEarned = skills.reduce((sum, skill) => sum + skill.xpEarned, 0);
  const totalXpRequired = skills.reduce((sum, skill) => sum + skill.xpRequired, 0);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'technical': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'creative': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      case 'language': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Skills Progress
            </CardTitle>
            <CardDescription>
              Track your learning journey across different subjects
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{totalXpEarned.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total XP Earned</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{Math.round((totalXpEarned / totalXpRequired) * 100)}%</span>
          </div>
          <Progress
            value={(totalXpEarned / totalXpRequired) * 100}
            className="h-3"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{completedSkills.length} skills completed</span>
            <span>{totalXpRequired - totalXpEarned} XP remaining</span>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inProgressSkills.slice(0, 8).map(skill => {
            const percentage = (skill.xpEarned / skill.xpRequired) * 100;

            return (
              <div
                key={skill.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-card"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${skill.color} text-white`}>
                    {skill.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{skill.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        Level {skill.level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getCategoryColor(skill.category)}`}
                      >
                        {skill.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {skill.lastActivity}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">
                      {skill.xpEarned}/{skill.xpRequired} XP
                    </span>
                  </div>
                  <div className="relative">
                    <Progress
                      value={percentage}
                      className="h-2"
                    />
                    <div
                      className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{Math.round(percentage)}% complete</span>
                    <span>{skill.xpRequired - skill.xpEarned} XP to next level</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completed Skills */}
        {completedSkills.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Completed Skills ({completedSkills.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {completedSkills.map(skill => (
                <div
                  key={skill.id}
                  className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                >
                  <div className={`p-1 rounded ${skill.color} text-white`}>
                    {React.cloneElement(skill.icon as React.ReactElement, { className: "h-3 w-3" })}
                  </div>
                  <span className="text-sm font-medium">{skill.name}</span>
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" size="sm" className="flex-1">
            <Target className="h-4 w-4 mr-2" />
            View All Skills
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <TrendingUp className="h-4 w-4 mr-2" />
            Skill Analytics
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <BookOpen className="h-4 w-4 mr-2" />
            Recommended
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

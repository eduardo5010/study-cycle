import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  Trophy,
  Medal,
  Crown,
  Star,
  Target,
  Users,
  TrendingUp,
  Award,
  Zap,
  Heart,
  Shield,
  Flame,
  Calendar,
  BarChart3,
  ChevronUp,
  ChevronDown,
  Minus,
  Search,
  Filter
} from "lucide-react";

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  xpPoints: number;
  competitiveScore: number;
  collaborativeScore: number;
  rank: number;
  previousRank?: number;
  streak: number;
  achievements: number;
  league: string;
  isCurrentUser: boolean;
  change: 'up' | 'down' | 'same';
  changeValue?: number;
  wins: number;
  losses: number;
  draws: number;
  studyGroupsJoined: number;
  peersHelped: number;
}

interface LeagueInfo {
  id: string;
  name: string;
  color: string;
  icon: string;
  minXp: number;
  maxXp?: number;
  currentParticipants: number;
  description: string;
}

interface ChallengeInfo {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  category: 'competitive' | 'collaborative' | 'learning';
  progress: number;
  target: number;
  reward: string;
  endDate: Date;
  participants: number;
}

export default function LeaderboardPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("overall");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("all");

  // Check if gamification is enabled (2+ users)
  const { data: gamificationEnabled = false } = useQuery({
    queryKey: ["gamification-status"],
    queryFn: async () => {
      // In real app, check user count
      return true; // Mock: assume enabled
    }
  });

  // Mock leaderboard data
  const leaderboardData: LeaderboardEntry[] = [
    {
      id: "user-1",
      name: "Sarah Johnson",
      avatar: "S",
      level: 15,
      xpPoints: 8750,
      competitiveScore: 2450,
      collaborativeScore: 1800,
      rank: 1,
      previousRank: 2,
      streak: 12,
      achievements: 28,
      league: "Diamond",
      isCurrentUser: false,
      change: 'up',
      changeValue: 1,
      wins: 15,
      losses: 3,
      draws: 2,
      studyGroupsJoined: 8,
      peersHelped: 12
    },
    {
      id: "user-2",
      name: "Mike Chen",
      avatar: "M",
      level: 14,
      xpPoints: 8420,
      competitiveScore: 2200,
      collaborativeScore: 1950,
      rank: 2,
      previousRank: 1,
      streak: 8,
      achievements: 25,
      league: "Diamond",
      isCurrentUser: false,
      change: 'down',
      changeValue: 1,
      wins: 12,
      losses: 5,
      draws: 1,
      studyGroupsJoined: 6,
      peersHelped: 15
    },
    {
      id: user?.id || "current-user",
      name: user?.name || "You",
      avatar: user?.name?.charAt(0) || "Y",
      level: 12,
      xpPoints: 6780,
      competitiveScore: 1800,
      collaborativeScore: 1650,
      rank: 3,
      previousRank: 3,
      streak: 5,
      achievements: 18,
      league: "Gold",
      isCurrentUser: true,
      change: 'same',
      wins: 8,
      losses: 7,
      draws: 3,
      studyGroupsJoined: 4,
      peersHelped: 9
    },
    {
      id: "user-4",
      name: "Emma Wilson",
      avatar: "E",
      level: 11,
      xpPoints: 5940,
      competitiveScore: 1650,
      collaborativeScore: 1400,
      rank: 4,
      previousRank: 5,
      streak: 3,
      achievements: 15,
      league: "Gold",
      isCurrentUser: false,
      change: 'up',
      changeValue: 1,
      wins: 6,
      losses: 8,
      draws: 4,
      studyGroupsJoined: 5,
      peersHelped: 7
    },
    {
      id: "user-5",
      name: "Alex Rodriguez",
      avatar: "A",
      level: 10,
      xpPoints: 5230,
      competitiveScore: 1500,
      collaborativeScore: 1350,
      rank: 5,
      previousRank: 4,
      streak: 7,
      achievements: 12,
      league: "Silver",
      isCurrentUser: false,
      change: 'down',
      changeValue: 1,
      wins: 4,
      losses: 9,
      draws: 2,
      studyGroupsJoined: 3,
      peersHelped: 5
    }
  ];

  const leagues: LeagueInfo[] = [
    {
      id: "bronze",
      name: "Bronze League",
      color: "text-amber-600",
      icon: "🥉",
      minXp: 0,
      maxXp: 1000,
      currentParticipants: 45,
      description: "Starting your learning journey"
    },
    {
      id: "silver",
      name: "Silver League",
      color: "text-gray-400",
      icon: "🥈",
      minXp: 1000,
      maxXp: 2500,
      currentParticipants: 32,
      description: "Building consistent study habits"
    },
    {
      id: "gold",
      name: "Gold League",
      color: "text-yellow-500",
      icon: "🥇",
      minXp: 2500,
      maxXp: 5000,
      currentParticipants: 18,
      description: "Mastering advanced study techniques"
    },
    {
      id: "diamond",
      name: "Diamond League",
      color: "text-blue-400",
      icon: "💎",
      minXp: 5000,
      maxXp: 10000,
      currentParticipants: 8,
      description: "Elite learners pushing boundaries"
    },
    {
      id: "master",
      name: "Master League",
      color: "text-purple-500",
      icon: "👑",
      minXp: 10000,
      currentParticipants: 2,
      description: "Legendary scholars inspiring others"
    }
  ];

  const challenges: ChallengeInfo[] = [
    {
      id: "weekly-study",
      title: "Weekly Study Champion",
      description: "Study for 20 hours this week",
      type: "weekly",
      category: "learning",
      progress: 14,
      target: 20,
      reward: "500 XP + Study Streak Badge",
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      participants: 23
    },
    {
      id: "group-help",
      title: "Community Helper",
      description: "Help 5 peers in study groups",
      type: "weekly",
      category: "collaborative",
      progress: 2,
      target: 5,
      reward: "300 XP + Helper Badge",
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      participants: 15
    },
    {
      id: "flashcard-master",
      title: "Flashcard Master",
      description: "Review 100 flashcards this week",
      type: "weekly",
      category: "competitive",
      progress: 67,
      target: 100,
      reward: "400 XP + Memory Champion Badge",
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      participants: 31
    }
  ];

  const filteredLeaderboard = leaderboardData.filter(entry => {
    const matchesSearch = entry.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLeague = selectedLeague === 'all' || entry.league.toLowerCase().includes(selectedLeague.toLowerCase());
    return matchesSearch && matchesLeague;
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getChangeIcon = (change: string) => {
    switch (change) {
      case 'up': return <ChevronUp className="h-4 w-4 text-green-500" />;
      case 'down': return <ChevronDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getLeagueInfo = (leagueName: string) => {
    return leagues.find(l => l.name.includes(leagueName)) || leagues[0];
  };

  if (!gamificationEnabled) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Gamification Coming Soon!</h2>
            <p className="text-muted-foreground mb-6">
              Leaderboards and achievements will be unlocked when we have 2 or more active users.
            </p>
            <div className="text-sm text-muted-foreground">
              Current users: 1 | Required: 2+
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Trophy className="h-8 w-8 text-primary" />
          Leaderboard & Achievements
        </h1>
        <p className="text-muted-foreground">
          Compete with peers and celebrate your learning achievements
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overall" className="flex items center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overall
          </TabsTrigger>
          <TabsTrigger value="competitive" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Competitive
          </TabsTrigger>
          <TabsTrigger value="collaborative" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Collaborative
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Challenges
          </TabsTrigger>
        </TabsList>

        {/* Overall Leaderboard */}
        <TabsContent value="overall" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Leagues</option>
              {leagues.map(league => (
                <option key={league.id} value={league.id}>{league.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current User Stats */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Your Ranking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const userEntry = leaderboardData.find(entry => entry.isCurrentUser);
                  if (!userEntry) return null;

                  const league = getLeagueInfo(userEntry.league);

                  return (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>{userEntry.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{userEntry.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {getRankIcon(userEntry.rank)} Rank • Level {userEntry.level}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>XP Progress</span>
                          <span>{userEntry.xpPoints} XP</span>
                        </div>
                        <Progress value={75} className="h-2" />
                        <div className="text-xs text-muted-foreground text-center">
                          1,250 XP to next level
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                        <span className="text-sm">{league.icon}</span>
                        <span className="text-sm font-medium">{league.name}</span>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Top 3 Podium */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboardData.slice(0, 3).map((entry, index) => (
                    <div key={entry.id} className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                        {getRankIcon(entry.rank)}
                      </div>
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{entry.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{entry.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {entry.xpPoints} XP • Level {entry.level}
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {entry.league}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* League Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">League Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leagues.map(league => (
                    <div key={league.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{league.icon}</span>
                        <span className="text-sm font-medium">{league.name.split(' ')[0]}</span>
                      </div>
                      <Badge variant="outline">{league.currentParticipants}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Full Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Full Rankings</CardTitle>
              <CardDescription>
                Complete leaderboard of all participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredLeaderboard.map(entry => (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                      entry.isCurrentUser ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-16">
                      {getRankIcon(entry.rank)}
                      {entry.change !== 'same' && (
                        <div className="flex items-center text-xs">
                          {getChangeIcon(entry.change)}
                          {entry.changeValue && <span className="ml-1">{entry.changeValue}</span>}
                        </div>
                      )}
                    </div>

                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{entry.avatar}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="font-medium">{entry.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Level {entry.level} • {entry.xpPoints} XP
                      </div>
                    </div>

                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">
                        🔥 {entry.streak}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        🏆 {entry.achievements}
                      </div>
                    </div>

                    <Badge variant="secondary">
                      {getLeagueInfo(entry.league).icon} {entry.league}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitive Leaderboard */}
        <TabsContent value="competitive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Competitive Rankings
              </CardTitle>
              <CardDescription>
                Rankings based on competitive achievements and challenges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboardData
                  .sort((a, b) => b.competitiveScore - a.competitiveScore)
                  .map((entry, index) => (
                    <div key={entry.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50">
                      <div className="w-8 text-center font-bold">
                        #{index + 1}
                      </div>
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{entry.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{entry.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {entry.competitiveScore} competitive points
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{entry.wins}W - {entry.losses}L</div>
                        <div className="text-xs text-muted-foreground">
                          {entry.draws} draws
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Collaborative Leaderboard */}
        <TabsContent value="collaborative" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Collaborative Rankings
              </CardTitle>
              <CardDescription>
                Rankings based on community contributions and peer support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboardData
                  .sort((a, b) => b.collaborativeScore - a.collaborativeScore)
                  .map((entry, index) => (
                    <div key={entry.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50">
                      <div className="w-8 text-center font-bold">
                        #{index + 1}
                      </div>
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{entry.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{entry.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {entry.collaborativeScore} collaborative points
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{entry.studyGroupsJoined} groups</div>
                        <div className="text-xs text-muted-foreground">
                          Helped {entry.peersHelped} peers
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Challenges */}
        <TabsContent value="challenges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map(challenge => (
              <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {challenge.description}
                      </CardDescription>
                    </div>
                    <Badge variant={
                      challenge.category === 'competitive' ? 'default' :
                      challenge.category === 'collaborative' ? 'secondary' : 'outline'
                    }>
                      {challenge.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{challenge.progress}/{challenge.target}</span>
                    </div>
                    <Progress value={(challenge.progress / challenge.target) * 100} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {challenge.participants} joined
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {Math.ceil((challenge.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                    </span>
                  </div>

                  <div className="p-3 bg-primary/5 rounded-lg">
                    <div className="text-sm font-medium mb-1">Reward:</div>
                    <div className="text-sm text-primary">{challenge.reward}</div>
                  </div>

                  <Button className="w-full" variant="outline">
                    Join Challenge
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

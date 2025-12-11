import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Plus,
  Video,
  MessageCircle,
  Calendar,
  Clock,
  MapPin,
  UserPlus,
  Settings,
  Crown,
  Mic,
  MicOff,
  VideoIcon,
  VideoOff,
  Phone,
  PhoneOff,
  Monitor,
  Share,
  MoreHorizontal,
  CheckCircle,
  X,
  Search
} from "lucide-react";

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subject: string;
  ownerId: string;
  ownerName: string;
  maxMembers: number;
  currentMembers: number;
  isPrivate: boolean;
  meetingLink?: string;
  nextMeeting?: Date;
  tags: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
}

interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'moderator' | 'member';
  isOnline: boolean;
  joinedAt: Date;
  studyStreak: number;
  level: string;
}

interface StudySession {
  id: string;
  groupId: string;
  title: string;
  description: string;
  startTime: Date;
  duration: number; // minutes
  participants: GroupMember[];
  meetingLink: string;
  isLive: boolean;
  recordings?: string[];
}

export default function StudyGroupsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);

  // Mock data - in real app, this would come from API
  const [studyGroups] = useState<StudyGroup[]>([
    {
      id: "group-1",
      name: "Advanced Calculus Study Group",
      description: "Weekly sessions covering differential equations, integrals, and advanced calculus topics.",
      subject: "Mathematics",
      ownerId: "user-1",
      ownerName: "Dr. Sarah Johnson",
      maxMembers: 15,
      currentMembers: 12,
      isPrivate: false,
      nextMeeting: new Date(Date.now() + 86400000), // Tomorrow
      tags: ["calculus", "advanced", "weekly"],
      level: "advanced",
      language: "English"
    },
    {
      id: "group-2",
      name: "Organic Chemistry Lab Prep",
      description: "Preparing for organic chemistry lab work with hands-on practice and theory review.",
      subject: "Chemistry",
      ownerId: "user-2",
      ownerName: "Prof. Michael Chen",
      maxMembers: 8,
      currentMembers: 6,
      isPrivate: false,
      nextMeeting: new Date(Date.now() + 172800000), // 2 days
      tags: ["organic", "lab", "practical"],
      level: "intermediate",
      language: "English"
    },
    {
      id: "group-3",
      name: "Spanish Conversation Practice",
      description: "Practice real Spanish conversations, improve fluency, and learn cultural nuances.",
      subject: "Spanish",
      ownerId: "user-3",
      ownerName: "Maria Rodriguez",
      maxMembers: 10,
      currentMembers: 8,
      isPrivate: false,
      meetingLink: "https://meet.google.com/abc-defg-hij",
      nextMeeting: new Date(Date.now() + 3600000), // 1 hour
      tags: ["conversation", "fluency", "culture"],
      level: "intermediate",
      language: "Spanish"
    }
  ]);

  const [myGroups] = useState<StudyGroup[]>([
    {
      id: "my-group-1",
      name: "Physics Problem Solving",
      description: "Group sessions focused on solving complex physics problems together.",
      subject: "Physics",
      ownerId: user?.id || "current-user",
      ownerName: user?.name || "You",
      maxMembers: 12,
      currentMembers: 9,
      isPrivate: false,
      nextMeeting: new Date(Date.now() + 259200000), // 3 days
      tags: ["physics", "problem-solving", "group-study"],
      level: "advanced",
      language: "English"
    }
  ]);

  const [upcomingSessions] = useState<StudySession[]>([
    {
      id: "session-1",
      groupId: "group-1",
      title: "Differential Equations Review",
      description: "Review of first and second order differential equations",
      startTime: new Date(Date.now() + 86400000),
      duration: 90,
      participants: [],
      meetingLink: "https://zoom.us/j/123456789",
      isLive: false
    },
    {
      id: "session-2",
      groupId: "group-3",
      title: "Spanish Conversation: Travel",
      description: "Practice conversations about travel and tourism",
      startTime: new Date(Date.now() + 3600000),
      duration: 60,
      participants: [],
      meetingLink: "https://meet.google.com/xyz-uvwx-yz",
      isLive: true
    }
  ]);

  const filteredGroups = studyGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || group.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const subjects = [
    { value: 'all', label: 'All Subjects' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Biology', label: 'Biology' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'English', label: 'English' }
  ];

  const joinGroup = useMutation({
    mutationFn: async (groupId: string) => {
      // In real app, this would call the API
      await new Promise(resolve => setTimeout(resolve, 1000));
      return groupId;
    },
    onSuccess: (groupId) => {
      toast({
        title: "Joined study group!",
        description: "Welcome to the group. Check the calendar for upcoming sessions."
      });
    }
  });

  const startSession = (session: StudySession) => {
    setActiveSession(session);
  };

  const formatTimeUntil = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (diff < 0) return "Started";
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          Study Groups
        </h1>
        <p className="text-muted-foreground">
          Join collaborative study sessions and learn together with peers
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="discover" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Discover
          </TabsTrigger>
          <TabsTrigger value="my-groups" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            My Groups
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create
          </TabsTrigger>
        </TabsList>

        {/* Discover Tab */}
        <TabsContent value="discover" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search study groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject.value} value={subject.value}>
                    {subject.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map(group => (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {group.description}
                      </CardDescription>
                    </div>
                    {group.isPrivate && (
                      <Badge variant="secondary">Private</Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{group.subject}</Badge>
                    <Badge variant="secondary">{group.level}</Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {group.currentMembers}/{group.maxMembers}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {group.language}
                    </div>
                  </div>

                  {group.nextMeeting && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>Next: {formatTimeUntil(group.nextMeeting)}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {group.currentMembers < group.maxMembers ? (
                      <Button
                        className="flex-1"
                        onClick={() => joinGroup.mutate(group.id)}
                        disabled={joinGroup.isPending}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {joinGroup.isPending ? 'Joining...' : 'Join Group'}
                      </Button>
                    ) : (
                      <Button variant="outline" className="flex-1" disabled>
                        Group Full
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredGroups.length === 0 && (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No groups found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or create your own study group.
                </p>
                <Button onClick={() => setActiveTab("create")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* My Groups Tab */}
        <TabsContent value="my-groups" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myGroups.map(group => (
              <Card key={group.id} className="border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-yellow-500" />
                        {group.name}
                      </CardTitle>
                      <CardDescription>{group.description}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{group.subject}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {group.currentMembers} members
                    </span>
                  </div>

                  {group.nextMeeting && (
                    <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                      <Calendar className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Next Meeting</p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimeUntil(group.nextMeeting)}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button className="flex-1" variant="outline">
                      <Video className="h-4 w-4 mr-2" />
                      Start Session
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <div className="space-y-4">
            {upcomingSessions.map(session => (
              <Card key={session.id} className={session.isLive ? "border-green-500 bg-green-50/50 dark:bg-green-900/10" : ""}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{session.title}</h3>
                        {session.isLive && (
                          <Badge className="bg-green-500">
                            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                            LIVE
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {session.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {session.duration} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {session.participants.length} attending
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant={session.isLive ? "default" : "outline"}
                        onClick={() => startSession(session)}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        {session.isLive ? 'Join Now' : 'Join Session'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Create Tab */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Study Group</CardTitle>
              <CardDescription>
                Start your own study group and invite others to learn together
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="groupName">Group Name</Label>
                  <Input id="groupName" placeholder="e.g., Advanced Calculus Study Group" />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.slice(1).map(subject => (
                        <SelectItem key={subject.value} value={subject.value}>
                          {subject.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your study group will focus on..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="maxMembers">Max Members</Label>
                  <Select defaultValue="10">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 members</SelectItem>
                      <SelectItem value="10">10 members</SelectItem>
                      <SelectItem value="15">15 members</SelectItem>
                      <SelectItem value="20">20 members</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="level">Level</Label>
                  <Select defaultValue="intermediate">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="English">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="Portuguese">Portuguese</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="isPrivate" className="rounded" />
                <Label htmlFor="isPrivate">Make this group private</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Study Group
                </Button>
                <Button variant="outline">
                  Schedule First Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Video Call Modal */}
      {activeSession && (
        <Dialog open={!!activeSession} onOpenChange={() => setActiveSession(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                {activeSession.title}
              </DialogTitle>
              <DialogDescription>
                {activeSession.isLive ? "Session is live - you're connected!" : "Join the study session"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Video Grid Placeholder */}
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <VideoIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Video call interface would go here</p>
                  <p className="text-sm text-muted-foreground">
                    Integration with Zoom, Google Meet, or WebRTC
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" size="lg">
                  <Mic className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <VideoIcon className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Monitor className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share className="h-5 w-5" />
                </Button>
                <Button variant="destructive" size="lg" onClick={() => setActiveSession(null)}>
                  <PhoneOff className="h-5 w-5" />
                </Button>
              </div>

              {/* Participants */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 min-w-[80px]">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>U{i + 1}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-center">User {i + 1}</span>
                  </div>
                ))}
              </div>

              {/* Chat/Notes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Study Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Take notes during the session..."
                        rows={4}
                        className="resize-none"
                      />
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full" size="sm">
                        Share Screen
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        Record Session
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        Invite Others
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  TrendingUp,
  Users,
  Trophy,
  BookOpen,
  Play,
  Image,
  Mic,
  Target,
  Flame,
  Star,
  ThumbsUp,
  MessageSquare,
  Send,
  MoreHorizontal
} from "lucide-react";

interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'achievement';
  mediaUrl?: string;
  timestamp: Date;
  likes: number;
  comments: Comment[];
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  tags: string[];
  achievement?: {
    title: string;
    description: string;
    icon: string;
  };
}

interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: Date;
  likes: number;
}

interface Story {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  mediaUrl?: string;
  type: 'text' | 'image' | 'achievement';
  timestamp: Date;
  expiresAt: Date;
}

export default function FeedPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("feed");
  const [newPost, setNewPost] = useState("");
  const [selectedPostType, setSelectedPostType] = useState<'text' | 'achievement'>('text');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      authorId: "user1",
      authorName: "Sarah Johnson",
      authorAvatar: "S",
      content: "Just finished my calculus exam! 📐 Feeling accomplished after 3 weeks of intensive study. Remember everyone: consistency is key! 💪",
      type: "achievement",
      timestamp: new Date(Date.now() - 3600000),
      likes: 24,
      comments: [
        {
          id: "c1",
          authorId: "user2",
          authorName: "Mike Chen",
          authorAvatar: "M",
          content: "Congratulations! 🎉 What's your secret for staying motivated?",
          timestamp: new Date(Date.now() - 3300000),
          likes: 3
        }
      ],
      shares: 5,
      isLiked: true,
      isBookmarked: false,
      tags: ["calculus", "exam", "motivation"],
      achievement: {
        title: "Exam Conqueror",
        description: "Completed a challenging exam",
        icon: "🎯"
      }
    },
    {
      id: "2",
      authorId: "user3",
      authorName: "Dr. Emma Wilson",
      authorAvatar: "E",
      content: "New study tip: Try the Pomodoro Technique! 25 minutes focused study + 5 minute break. It really helps maintain concentration. 🍅⏱️",
      type: "text",
      timestamp: new Date(Date.now() - 7200000),
      likes: 67,
      comments: [],
      shares: 12,
      isLiked: false,
      isBookmarked: true,
      tags: ["study-tips", "pomodoro", "productivity"]
    },
    {
      id: "3",
      authorId: "user4",
      authorName: "Alex Rodriguez",
      authorAvatar: "A",
      content: "Anyone else struggling with organic chemistry? Need study partners for the upcoming test! 🧪📚",
      type: "text",
      timestamp: new Date(Date.now() - 10800000),
      likes: 15,
      comments: [
        {
          id: "c2",
          authorId: "user5",
          authorName: "Lisa Park",
          authorAvatar: "L",
          content: "I'm in the same boat! Let's create a study group?",
          timestamp: new Date(Date.now() - 9000000),
          likes: 5
        }
      ],
      shares: 3,
      isLiked: false,
      isBookmarked: false,
      tags: ["chemistry", "study-group", "help"]
    }
  ]);

  const [stories, setStories] = useState<Story[]>([
    {
      id: "s1",
      authorId: "user1",
      authorName: "Sarah Johnson",
      authorAvatar: "S",
      content: "Completed 50 study sessions this month! 📊",
      type: "achievement",
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    {
      id: "s2",
      authorId: "user3",
      authorName: "Dr. Emma Wilson",
      authorAvatar: "E",
      content: "Just published a new study guide! Check it out 📖",
      type: "text",
      timestamp: new Date(Date.now() - 3600000),
      expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000)
    }
  ]);

  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const handleBookmark = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post
      )
    );
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      authorId: user?.id || "current",
      authorName: user?.name || "You",
      authorAvatar: user?.name?.charAt(0) || "Y",
      content: newPost,
      type: selectedPostType,
      timestamp: new Date(),
      likes: 0,
      comments: [],
      shares: 0,
      isLiked: false,
      isBookmarked: false,
      tags: [],
      ...(selectedPostType === 'achievement' && {
        achievement: {
          title: "New Achievement",
          description: "Shared a study milestone",
          icon: "🏆"
        }
      })
    };

    setPosts(prevPosts => [post, ...prevPosts]);
    setNewPost("");
    toast({
      title: "Post created!",
      description: "Your post has been shared with the community."
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Users className="h-8 w-8" />
          Study Feed
        </h1>
        <p className="text-muted-foreground">
          Connect with fellow learners, share achievements, and get inspired
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Feed
          </TabsTrigger>
          <TabsTrigger value="discover" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Discover
          </TabsTrigger>
          <TabsTrigger value="following" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Following
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          {/* Stories Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Study Stories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {/* Add Story Button */}
                <div className="flex flex-col items-center gap-2 min-w-[80px]">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                    <span className="text-white text-2xl">+</span>
                  </div>
                  <span className="text-xs text-center">Add Story</span>
                </div>

                {/* Stories */}
                {stories.map(story => (
                  <div key={story.id} className="flex flex-col items-center gap-2 min-w-[80px]">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full p-0.5 cursor-pointer hover:scale-105 transition-transform">
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                        <Avatar className="w-14 h-14">
                          <AvatarFallback className="text-sm">{story.authorAvatar}</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    <span className="text-xs text-center truncate w-full">{story.authorName.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Create Post */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Textarea
                    placeholder="Share your study progress, ask questions, or celebrate achievements..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />

                  {/* Post Type Selector */}
                  <div className="flex gap-2">
                    <Button
                      variant={selectedPostType === 'text' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPostType('text')}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Post
                    </Button>
                    <Button
                      variant={selectedPostType === 'achievement' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPostType('achievement')}
                    >
                      <Trophy className="h-4 w-4 mr-1" />
                      Achievement
                    </Button>
                    <Button variant="outline" size="sm">
                      <Image className="h-4 w-4 mr-1" />
                      Photo
                    </Button>
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-1" />
                      Video
                    </Button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <span>Share with community</span>
                    </div>
                    <Button onClick={handleCreatePost} disabled={!newPost.trim()}>
                      <Send className="h-4 w-4 mr-2" />
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.map(post => (
              <Card key={post.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{post.authorAvatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-sm">{post.authorName}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(post.timestamp)}
                        </span>
                        {post.type === 'achievement' && (
                          <Badge variant="secondary" className="text-xs">
                            Achievement
                          </Badge>
                        )}
                      </div>

                      {post.achievement && (
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 mb-3 border">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{post.achievement.icon}</span>
                            <div>
                              <h4 className="font-semibold text-sm">{post.achievement.title}</h4>
                              <p className="text-xs text-muted-foreground">{post.achievement.description}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <p className="text-sm mb-3">{post.content}</p>

                      {post.tags.length > 0 && (
                        <div className="flex gap-1 mb-3">
                          {post.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(post.id)}
                            className={`gap-2 ${post.isLiked ? 'text-red-500' : ''}`}
                          >
                            <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <MessageCircle className="h-4 w-4" />
                            {post.comments.length}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Share className="h-4 w-4" />
                            {post.shares}
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleBookmark(post.id)}
                        >
                          <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                        </Button>
                      </div>

                      {post.comments.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {post.comments.slice(0, 3).map(comment => (
                            <div key={comment.id} className="flex gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">{comment.authorAvatar}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 bg-muted rounded-lg p-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-semibold">{comment.authorName}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatTimeAgo(comment.timestamp)}
                                  </span>
                                </div>
                                <p className="text-xs">{comment.content}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    {comment.likes}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discover" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Study Challenges
                </CardTitle>
                <CardDescription>Join community challenges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">30-Day Reading Challenge</h4>
                    <p className="text-xs text-muted-foreground mb-2">Read for 30 consecutive days</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">15 joined</Badge>
                      <Button size="sm">Join</Button>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Math Problem Solver</h4>
                    <p className="text-xs text-muted-foreground mb-2">Solve 50 math problems this week</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">8 joined</Badge>
                      <Button size="sm">Join</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Top Contributors
                </CardTitle>
                <CardDescription>This week's most active learners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Sarah Johnson", points: 1250, badge: "📚" },
                    { name: "Mike Chen", points: 1100, badge: "🧮" },
                    { name: "Dr. Emma Wilson", points: 980, badge: "🏆" },
                    { name: "Alex Rodriguez", points: 850, badge: "⚡" }
                  ].map((user, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm">
                        {user.badge}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.points} points</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="following" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Following Activity</CardTitle>
              <CardDescription>Recent posts from people you follow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Follow Study Friends</h3>
                <p className="text-muted-foreground mb-4">
                  Connect with other learners to see their study progress and achievements
                </p>
                <Button>Find People to Follow</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

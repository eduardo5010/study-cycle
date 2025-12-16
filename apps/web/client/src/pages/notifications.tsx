import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  Bell,
  Clock,
  Trophy,
  MessageCircle,
  Users,
  BookOpen,
  Target,
  CheckCircle,
  X,
  Settings
} from "lucide-react";

interface Notification {
  id: string;
  type: 'study_reminder' | 'achievement' | 'social' | 'system' | 'group_invite';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  metadata?: any;
}

export default function NotificationsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "study_reminder",
      title: "Time to study Mathematics!",
      message: "Your scheduled study session for Calculus starts in 30 minutes.",
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      isRead: false,
      actionUrl: "/calendar"
    },
    {
      id: "2",
      type: "achievement",
      title: "Congratulations! 🎉",
      message: "You've completed 7 consecutive study days! Keep up the great work!",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      isRead: false,
      metadata: { streakDays: 7 }
    },
    {
      id: "3",
      type: "social",
      title: "New comment on your post",
      message: "Sarah commented on your achievement: 'Amazing progress! 💪'",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      isRead: true,
      actionUrl: "/feed"
    },
    {
      id: "4",
      type: "group_invite",
      title: "Study Group Invitation",
      message: "You've been invited to join 'Advanced Physics Study Group'",
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      isRead: true,
      actionUrl: "/chats"
    },
    {
      id: "5",
      type: "system",
      title: "Welcome to StudyCycle!",
      message: "Thanks for joining our community. Start by creating your first study cycle.",
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      isRead: true,
      actionUrl: "/cycle/create"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );
    toast({
      title: "All notifications marked as read",
      description: "You've caught up on all your notifications."
    });
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(n => n.id !== notificationId)
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'study_reminder': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'achievement': return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'social': return <MessageCircle className="h-5 w-5 text-green-500" />;
      case 'group_invite': return <Users className="h-5 w-5 text-purple-500" />;
      case 'system': return <Bell className="h-5 w-5 text-gray-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const allNotifications = notifications;
  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Bell className="h-8 w-8" />
              Notifications
            </h1>
            <p className="text-muted-foreground">
              Stay updated with your study progress and community activity
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              Mark All as Read ({unreadCount})
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            All ({allNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="read">
            Read ({readNotifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {allNotifications.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No notifications yet</h3>
                  <p className="text-muted-foreground">
                    Your notifications will appear here as you start studying and engaging with the community.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <NotificationList
              notifications={allNotifications}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
              getIcon={getNotificationIcon}
              formatTime={formatTimeAgo}
            />
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          {unreadNotifications.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">
                    You have no unread notifications. Great job staying on top of things!
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <NotificationList
              notifications={unreadNotifications}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
              getIcon={getNotificationIcon}
              formatTime={formatTimeAgo}
            />
          )}
        </TabsContent>

        <TabsContent value="read" className="space-y-4">
          {readNotifications.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
              </CardContent>
            </Card>
          ) : (
            <NotificationList
              notifications={readNotifications}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
              getIcon={getNotificationIcon}
              formatTime={formatTimeAgo}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Notification Settings */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Customize how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Study Reminders</Label>
                <p className="text-xs text-muted-foreground">Get notified before scheduled study sessions</p>
              </div>
              <Badge variant="secondary">Enabled</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Achievement Alerts</Label>
                <p className="text-xs text-muted-foreground">Celebrate your study milestones</p>
              </div>
              <Badge variant="secondary">Enabled</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Social Activity</Label>
                <p className="text-xs text-muted-foreground">Comments, likes, and community updates</p>
              </div>
              <Badge variant="secondary">Enabled</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Study Group Invites</Label>
                <p className="text-xs text-muted-foreground">Invitations to join study groups</p>
              </div>
              <Badge variant="secondary">Enabled</Badge>
            </div>

            <Button variant="outline" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Customize Notification Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  getIcon: (type: string) => React.ReactNode;
  formatTime: (date: Date) => string;
}

function NotificationList({ notifications, onMarkAsRead, onDelete, getIcon, formatTime }: NotificationListProps) {
  return (
    <div className="space-y-3">
      {notifications.map(notification => (
        <Card
          key={notification.id}
          className={`transition-all hover:shadow-md ${
            !notification.isRead ? 'border-l-4 border-l-primary bg-primary/5' : ''
          }`}
        >
          <CardContent className="pt-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                {getIcon(notification.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{formatTime(notification.timestamp)}</p>
                  </div>

                  <div className="flex gap-2 ml-4">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkAsRead(notification.id)}
                        className="h-8 w-8 p-0"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(notification.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {notification.actionUrl && (
                  <div className="mt-3">
                    <Button variant="outline" size="sm" asChild>
                      <a href={notification.actionUrl}>
                        Take Action
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

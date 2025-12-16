import {
  Home, Brain, Zap, Calendar, MessageSquare, Users, Trophy, Settings, User,
  Bell, FileText, PenTool, GraduationCap, BarChart3, Target, BookOpen,
  Sparkles, ChevronRight, Flame
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";

export default function LeftSidebar() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [location] = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const menuItems = [
    {
      id: "home",
      label: "Dashboard",
      icon: Home,
      href: "/home",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      id: "cycle-create",
      label: "Create Cycle",
      icon: Sparkles,
      href: "/cycle/create",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      id: "cycle-edit",
      label: "Edit Cycle",
      icon: Target,
      href: "/cycle/edit",
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-900/20"
    },
    {
      id: "flashcards",
      label: "Flashcards",
      icon: Zap,
      href: "/flashcards",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      id: "ai-flashcards",
      label: "AI Flashcards",
      icon: Brain,
      href: "/ai-flashcards",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/20"
    },
    {
      id: "ai-courses",
      label: "AI Course Generator",
      icon: Sparkles,
      href: "/ai/courses",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20"
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: Calendar,
      href: "/calendar",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    },
    {
      id: "feed",
      label: "Study Feed",
      icon: MessageSquare,
      href: "/feed",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20"
    },
    {
      id: "study-groups",
      label: "Study Groups",
      icon: Users,
      href: "/study-groups",
      color: "text-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-900/20"
    },
    {
      id: "chats",
      label: "Messages",
      icon: MessageSquare,
      href: "/chats",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20"
    },
    {
      id: "leaderboard",
      label: "Leaderboard",
      icon: Trophy,
      href: "/leaderboard",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      href: "/notifications",
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20"
    },
    {
      id: "course-builder",
      label: "Course Builder",
      icon: PenTool,
      href: "/course-builder",
      color: "text-rose-600",
      bgColor: "bg-rose-50 dark:bg-rose-900/20",
      teacherOnly: true
    },
    {
      id: "teacher-profile",
      label: "Teacher Hub",
      icon: GraduationCap,
      href: "/teacher",
      color: "text-blue-700",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      teacherOnly: true
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/settings",
      color: "text-gray-600",
      bgColor: "bg-gray-50 dark:bg-gray-900/20"
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      href: "/profile",
      color: "text-violet-600",
      bgColor: "bg-violet-50 dark:bg-violet-900/20"
    }
  ];

  // Filter menu items based on user type and teacher status
  const visibleMenuItems = menuItems.filter(item => {
    if (item.teacherOnly && !user?.isTeacher) {
      return false;
    }
    return true;
  });

  // Group items by category for better organization
  const studyItems = visibleMenuItems.filter(item =>
    ['home', 'cycle-create', 'cycle-edit', 'flashcards', 'ai-flashcards', 'ai-courses', 'calendar'].includes(item.id)
  );

  const communityItems = visibleMenuItems.filter(item =>
    ['feed', 'study-groups', 'chats'].includes(item.id)
  );

  const toolsItems = visibleMenuItems.filter(item =>
    ['leaderboard', 'notifications'].includes(item.id)
  );

  const creationItems = visibleMenuItems.filter(item =>
    ['course-builder', 'teacher-profile'].includes(item.id)
  );

  const accountItems = visibleMenuItems.filter(item =>
    ['settings', 'profile'].includes(item.id)
  );

  // Handle mouse events for auto-collapse
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleMouseEnter = () => setIsExpanded(true);
    const handleMouseLeave = () => setIsExpanded(false);

    sidebar.addEventListener('mouseenter', handleMouseEnter);
    sidebar.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      sidebar.removeEventListener('mouseenter', handleMouseEnter);
      sidebar.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "bg-card border-r border-border h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto sidebar-scroll transition-all duration-300 ease-in-out",
        isExpanded ? "w-64" : "w-16"
      )}
    >
      <nav className={cn("transition-all duration-300", isExpanded ? "p-4 space-y-6" : "p-2 space-y-4")}>

        {/* Study Hub Section */}
        <div className="space-y-2">
          {isExpanded && (
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                  <Brain className="h-3 w-3 text-white" />
                </div>
                Study Hub
              </h3>
            </div>
          )}
          {studyItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;

            return (
              <Link key={item.id} href={item.href}>
                <a
                  className={cn(
                    "flex items-center justify-center px-2 py-3 rounded-lg transition-all duration-200 group relative",
                    isExpanded ? "gap-3" : "gap-0",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground hover:shadow-sm"
                  )}
                  data-testid={`sidebar-${item.id}`}
                  title={!isExpanded ? item.label : undefined}
                >
                  <div className={cn(
                    "rounded-lg flex items-center justify-center transition-colors",
                    isExpanded ? "w-8 h-8" : "w-10 h-10",
                    isActive && "bg-primary-foreground/10"
                  )}>
                    <Icon className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-primary-foreground" : item.color
                    )} />
                  </div>
                  {isExpanded && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  )}
                </a>
              </Link>
            );
          })}
        </div>

        {/* Community Section */}
        {communityItems.length > 0 && (
          <div className="space-y-2">
            {isExpanded && (
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-rose-600 rounded-md flex items-center justify-center">
                    <Users className="h-3 w-3 text-white" />
                  </div>
                  Community
                </h3>
              </div>
            )}
            {communityItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;

              return (
                <Link key={item.id} href={item.href}>
                  <a
                    className={cn(
                      "flex items-center justify-center px-2 py-3 rounded-lg transition-all duration-200 group relative",
                      isExpanded ? "gap-3" : "gap-0",
                      isActive
                        ? "bg-primary text-primary-foreground font-medium shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground hover:shadow-sm"
                    )}
                    data-testid={`sidebar-${item.id}`}
                    title={!isExpanded ? item.label : undefined}
                  >
                    <div className={cn(
                      "rounded-lg flex items-center justify-center transition-colors",
                      isExpanded ? "w-8 h-8" : "w-10 h-10",
                      isActive && "bg-primary-foreground/10"
                    )}>
                      <Icon className={cn(
                        "h-4 w-4 transition-colors",
                        isActive ? "text-primary-foreground" : item.color
                      )} />
                    </div>
                    {isExpanded && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </>
                    )}
                  </a>
                </Link>
              );
            })}
          </div>
        )}

        {/* Tools & Analytics */}
        {toolsItems.length > 0 && (
          <div className="space-y-2">
            {isExpanded && (
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-md flex items-center justify-center">
                    <BarChart3 className="h-3 w-3 text-white" />
                  </div>
                  Tools & Analytics
                </h3>
              </div>
            )}
            {toolsItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;

              return (
                <Link key={item.id} href={item.href}>
                  <a
                    className={cn(
                      "flex items-center justify-center px-2 py-3 rounded-lg transition-all duration-200 group relative",
                      isExpanded ? "gap-3" : "gap-0",
                      isActive
                        ? "bg-primary text-primary-foreground font-medium shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground hover:shadow-sm"
                    )}
                    data-testid={`sidebar-${item.id}`}
                    title={!isExpanded ? item.label : undefined}
                  >
                    <div className={cn(
                      "rounded-lg flex items-center justify-center transition-colors relative",
                      isExpanded ? "w-8 h-8" : "w-10 h-10",
                      isActive && "bg-primary-foreground/10"
                    )}>
                      <Icon className={cn(
                        "h-4 w-4 transition-colors",
                        isActive ? "text-primary-foreground" : item.color
                      )} />
                      {item.id === 'notifications' && !isExpanded && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs px-1 py-0 h-4 min-w-[16px] flex items-center justify-center text-[10px]">
                          3
                        </Badge>
                      )}
                    </div>
                    {isExpanded && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {item.id === 'notifications' && (
                          <Badge variant="destructive" className="text-xs px-1.5 py-0.5 h-5 min-w-[20px] flex items-center justify-center">
                            3
                          </Badge>
                        )}
                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </>
                    )}
                  </a>
                </Link>
              );
            })}
          </div>
        )}

        {/* Content Creation (Teacher Only) */}
        {creationItems.length > 0 && (
          <div className="space-y-2">
            {isExpanded && (
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-rose-500 to-pink-600 rounded-md flex items-center justify-center">
                    <PenTool className="h-3 w-3 text-white" />
                  </div>
                  Content Creation
                </h3>
                <Badge variant="secondary" className="text-xs">Teacher</Badge>
              </div>
            )}
            {creationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;

              return (
                <Link key={item.id} href={item.href}>
                  <a
                    className={cn(
                      "flex items-center justify-center px-2 py-3 rounded-lg transition-all duration-200 group relative",
                      isExpanded ? "gap-3" : "gap-0",
                      isActive
                        ? "bg-primary text-primary-foreground font-medium shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground hover:shadow-sm"
                    )}
                    data-testid={`sidebar-${item.id}`}
                    title={!isExpanded ? item.label : undefined}
                  >
                    <div className={cn(
                      "rounded-lg flex items-center justify-center transition-colors",
                      isExpanded ? "w-8 h-8" : "w-10 h-10",
                      isActive && "bg-primary-foreground/10"
                    )}>
                      <Icon className={cn(
                        "h-4 w-4 transition-colors",
                        isActive ? "text-primary-foreground" : item.color
                      )} />
                    </div>
                    {isExpanded && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </>
                    )}
                  </a>
                </Link>
              );
            })}
          </div>
        )}

        {/* Account & Settings */}
        <div className="space-y-2">
          {isExpanded && (
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-md flex items-center justify-center">
                  <User className="h-3 w-3 text-white" />
                </div>
                Account
              </h3>
            </div>
          )}
          {accountItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;

            return (
              <Link key={item.id} href={item.href}>
                <a
                  className={cn(
                    "flex items-center justify-center px-2 py-3 rounded-lg transition-all duration-200 group relative",
                    isExpanded ? "gap-3" : "gap-0",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground hover:shadow-sm"
                  )}
                  data-testid={`sidebar-${item.id}`}
                  title={!isExpanded ? item.label : undefined}
                >
                  <div className={cn(
                    "rounded-lg flex items-center justify-center transition-colors",
                    isExpanded ? "w-8 h-8" : "w-10 h-10",
                    isActive && "bg-primary-foreground/10"
                  )}>
                    <Icon className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-primary-foreground" : item.color
                    )} />
                  </div>
                  {isExpanded && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  )}
                </a>
              </Link>
            );
          })}
        </div>

        {/* User Status */}
        <div className={cn(
          "bg-muted/50 rounded-lg border transition-all duration-300",
          isExpanded ? "px-4 py-3" : "px-2 py-2"
        )}>
          <div className={cn(
            "flex items-center transition-all duration-300",
            isExpanded ? "gap-3" : "justify-center"
          )}>
            <div className={cn(
              "bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center transition-all duration-300",
              isExpanded ? "w-10 h-10" : "w-8 h-8"
            )}>
              <User className={cn(
                "text-primary-foreground transition-all duration-300",
                isExpanded ? "h-5 w-5" : "h-4 w-4"
              )} />
            </div>
            {isExpanded && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Flame className="h-3 w-3 text-orange-500" />
                  {user?.isTeacher ? 'Teacher' : 'Student'}
                </p>
              </div>
            )}
          </div>
        </div>

      </nav>
    </aside>
  );
}

import { Home, BookOpen, Calendar, MessageSquare, Trophy, Globe } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export default function LeftSidebar() {
  const { t } = useLanguage();
  const [location] = useLocation();

  const menuItems = [
    { id: "home", label: t('sidebar.home'), icon: Home, href: "/home" },
    { id: "courses", label: t('sidebar.courses'), icon: BookOpen, href: "/courses" },
    { id: "calendar", label: t('sidebar.calendar'), icon: Calendar, href: "/calendar" },
    { id: "chats", label: t('sidebar.chats'), icon: MessageSquare, href: "/chats" },
    { id: "events", label: t('sidebar.events'), icon: Trophy, href: "/events" },
    { id: "english", label: t('sidebar.english'), icon: Globe, href: "/english" },
    { id: "mandarin", label: t('sidebar.mandarin'), icon: Globe, href: "/mandarin" },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.id} href={item.href}>
              <a
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
                data-testid={`sidebar-${item.id}`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
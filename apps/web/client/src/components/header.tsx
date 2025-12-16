import {
  Bell,
  User,
  GraduationCap,
  LogIn,
  LogOut,
  Search,
  Menu,
  Flame,
  ChevronDown,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { RoleSwitch } from "./role-switch";
import LanguageSelector from "@/components/language-selector";
import ThemeToggle from "@/components/theme-toggle";
import LoginModal from "@/components/auth/login-modal";
import RegisterModal from "@/components/auth/register-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export default function Header() {
  const { t } = useLanguage();
  const { user, logout, switchToTeacher } = useAuth();
  const [location] = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch real data from API
  const { data: userData } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  const currentStreak = 0; // Will be fetched from API when available
  const notifications: any[] = []; // Will be fetched from API when available
  const unreadNotifications = 0;

  // Check if we're on the landing page or auth pages
  const isLandingPage = location === "/";
  const isAuthPage = location.startsWith("/auth/");

  // Landing Page Header (simplified version) - used for landing and auth pages
  if (isLandingPage || isAuthPage) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={user ? "/home" : "/"} className="flex items-center space-x-4">
            <GraduationCap className="h-8 w-8" />
            <span className="text-xl font-bold">{t("app.title")}</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="#courses"
              className="text-sm font-medium hover:text-primary"
            >
              {t("landing.nav.courses")}
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-primary"
            >
              {t("landing.nav.pricing")}
            </Link>
            <Link
              href="#early-stage"
              className="text-sm font-medium hover:text-primary"
            >
              {t("landing.nav.earlyStage")}
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <ThemeToggle />
            {user ? (
              <Button asChild>
                <Link href="/home">
                  {t("landing.nav.dashboard")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" asChild>
                  <Link href="/auth/login">{t("auth.login")}</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">{t("auth.register")}</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </header>
    );
  }

  // Authenticated User Header (full version - from new-header.tsx)
  if (user) {
    return (
      <>
        <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 gap-4">
              {/* Logo + Nome */}
              <Link
                href="/home"
                className="flex items-center space-x-3 flex-shrink-0"
                data-testid="logo-link"
              >
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-primary-foreground h-6 w-6" />
                </div>
                <h1 className="text-xl font-bold text-foreground hidden md:block">
                  {t("app.title")}
                </h1>
              </Link>

              {/* Botão Explorar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden lg:flex items-center gap-2 transition-smooth hover-scale"
                    data-testid="button-explore"
                  >
                    <Menu className="h-4 w-4" />
                    {t("nav.explore")}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  <DropdownMenuLabel>{t("nav.knowledgeAreas")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem data-testid="explore-programming">
                    {t("courses.programming")}
                  </DropdownMenuItem>
                  <DropdownMenuItem data-testid="explore-math">
                    {t("courses.math")}
                  </DropdownMenuItem>
                  <DropdownMenuItem data-testid="explore-science">
                    {t("courses.science")}
                  </DropdownMenuItem>
                  <DropdownMenuItem data-testid="explore-languages">
                    {t("courses.languages")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Barra de Pesquisa Universal */}
              <div className="flex-1 max-w-xl hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t("search.placeholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                    data-testid="input-search"
                  />
                </div>
              </div>

              {/* Botões de Navegação */}
              <nav className="hidden lg:flex items-center space-x-2">
                <Link
                  href="/home"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors transition-smooth hover-scale focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                  data-testid="nav-dashboard"
                >
                  {t("nav.dashboard")}
                </Link>
                <Link
                  href="/feed"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors transition-smooth hover-scale focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                  data-testid="nav-feed"
                >
                  Feed
                </Link>
                <Link
                  href="/subjects"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors transition-smooth hover-scale focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                  data-testid="nav-subjects"
                >
                  {t("nav.subjects")}
                </Link>
                {user?.isTeacher && (
                  <Link
                    href="/teacher"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors transition-smooth hover-scale focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                    data-testid="nav-teacher"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Dashboard do Professor
                  </Link>
                )}
                <Link
                  href="/settings"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors transition-smooth hover-scale focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                  data-testid="nav-settings"
                >
                  {t("nav.settings")}
                </Link>
              </nav>

              {/* Controles à direita */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <ThemeToggle />
                <LanguageSelector />
                <RoleSwitch />

                {/* Streak Counter */}
                <div
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg"
                  data-testid="streak-counter"
                >
                  <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                    {currentStreak}
                  </span>
                </div>

                {/* Notificações */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="relative p-2 text-muted-foreground hover:text-foreground transition-colors transition-smooth hover-scale"
                      data-testid="button-notifications"
                    >
                      <Bell className="h-5 w-5" />
                      {unreadNotifications > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>
                      {t("notifications.title")}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex flex-col items-start p-3"
                      >
                        <p className="font-medium text-sm">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.message}
                        </p>
                      </DropdownMenuItem>
                    ))}
                    {notifications.length === 0 && (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        {t("notifications.empty")}
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Menu de Perfil */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="w-9 h-9 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors transition-smooth hover-scale"
                      data-testid="avatar-user"
                    >
                      <User className="text-muted-foreground h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel className="flex flex-col">
                      <span className="font-semibold">{user.name}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {user.email}
                      </span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem data-testid="menu-student-home">
                      {t("profile.studentHome")}
                    </DropdownMenuItem>
                    <DropdownMenuItem data-testid="menu-personal-info">
                      {t("profile.personalInfo")}
                    </DropdownMenuItem>
                    <DropdownMenuItem data-testid="menu-subscriptions">
                      {t("profile.subscriptions")}
                    </DropdownMenuItem>
                    <DropdownMenuItem data-testid="menu-payment">
                      {t("profile.paymentMethods")}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {user.userType === "admin" && (
                      <DropdownMenuItem asChild data-testid="menu-admin">
                        <Link href="/admin">{t("nav.adminDashboard")}</Link>
                      </DropdownMenuItem>
                    )}

                    {user.userType === "student" && (
                      <DropdownMenuItem
                        asChild
                        data-testid="menu-switch-teacher"
                      >
                        <Link href="/teacher">
                          {t("auth.switchToTeacher")}
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem data-testid="menu-request-feature">
                      {t("profile.requestFeature")}
                    </DropdownMenuItem>
                    <DropdownMenuItem data-testid="menu-help">
                      {t("profile.help")}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      data-testid="menu-logout"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t("auth.logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>
      </>
    );
  }

  // Unauthenticated User Header (intermediate version - from header.tsx)
  return (
    <>
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-primary-foreground h-5 w-5" />
              </div>
              <h1 className="text-xl font-bold text-foreground">{t('app.title')}</h1>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <a href="/dashboard" className="text-primary font-medium border-b-2 border-primary pb-1" data-testid="nav-dashboard">
                {t('nav.dashboard')}
              </a>
              <a href="/subjects" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-subjects">
                {t('nav.subjects')}
              </a>
              <a href="#settings" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-settings">
                {t('nav.settings')}
              </a>
            </nav>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <LanguageSelector />
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsLoginModalOpen(true)}
                  data-testid="button-login"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  {t('auth.login')}
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setIsRegisterModalOpen(true)}
                  data-testid="button-register"
                >
                  {t('auth.register')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />
      
      <RegisterModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </>
  );
}

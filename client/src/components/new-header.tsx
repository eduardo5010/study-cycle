import { Bell, User, GraduationCap, LogIn, LogOut, Search, Menu, Flame, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
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

export default function NewHeader() {
  const { t } = useLanguage();
  const { user, logout, switchToTeacher } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for streak
  const currentStreak = 7;

  // Mock notifications
  const notifications = [
    { id: "1", title: "Nova conquista!", message: "Você completou 7 dias consecutivos", isRead: false },
    { id: "2", title: "Novo curso disponível", message: "Python Avançado está disponível", isRead: false },
  ];

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  return (
    <>
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            {/* Logo + Nome */}
            <Link href="/home">
              <a className="flex items-center space-x-3 flex-shrink-0" data-testid="logo-link">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-primary-foreground h-6 w-6" />
                </div>
                <h1 className="text-xl font-bold text-foreground hidden md:block">
                  {t('app.title')}
                </h1>
              </a>
            </Link>

            {/* Botão Explorar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden lg:flex items-center gap-2" data-testid="button-explore">
                  <Menu className="h-4 w-4" />
                  {t('nav.explore')}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>{t('nav.knowledgeAreas')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem data-testid="explore-programming">
                  {t('courses.programming')}
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="explore-math">
                  {t('courses.math')}
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="explore-science">
                  {t('courses.science')}
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="explore-languages">
                  {t('courses.languages')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Barra de Pesquisa Universal */}
            <div className="flex-1 max-w-xl hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t('search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                  data-testid="input-search"
                />
              </div>
            </div>

            {/* Botões de Navegação */}
            <nav className="hidden lg:flex items-center space-x-2">
              <Link href="/home">
                <a>
                  <Button variant="ghost" size="sm" data-testid="nav-dashboard">
                    {t('nav.dashboard')}
                  </Button>
                </a>
              </Link>
              <Link href="/subjects">
                <a>
                  <Button variant="ghost" size="sm" data-testid="nav-subjects">
                    {t('nav.subjects')}
                  </Button>
                </a>
              </Link>
              <Link href="/settings">
                <a>
                  <Button variant="ghost" size="sm" data-testid="nav-settings">
                    {t('nav.settings')}
                  </Button>
                </a>
              </Link>
            </nav>

            {/* Controles à direita */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <ThemeToggle />
              <LanguageSelector />
              
              {user && (
                <>
                  {/* Streak Counter */}
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg" data-testid="streak-counter">
                    <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                      {currentStreak}
                    </span>
                  </div>

                  {/* Notificações */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors" data-testid="button-notifications">
                        <Bell className="h-5 w-5" />
                        {unreadNotifications > 0 && (
                          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        )}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <DropdownMenuLabel>{t('notifications.title')}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {notifications.map((notification) => (
                        <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                        </DropdownMenuItem>
                      ))}
                      {notifications.length === 0 && (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          {t('notifications.empty')}
                        </div>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Menu de Perfil */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-9 h-9 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors" data-testid="avatar-user">
                        <User className="text-muted-foreground h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                      <DropdownMenuLabel className="flex flex-col">
                        <span className="font-semibold">{user.name}</span>
                        <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem data-testid="menu-student-home">
                        {t('profile.studentHome')}
                      </DropdownMenuItem>
                      <DropdownMenuItem data-testid="menu-personal-info">
                        {t('profile.personalInfo')}
                      </DropdownMenuItem>
                      <DropdownMenuItem data-testid="menu-subscriptions">
                        {t('profile.subscriptions')}
                      </DropdownMenuItem>
                      <DropdownMenuItem data-testid="menu-payment">
                        {t('profile.paymentMethods')}
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      {user.userType === 'student' && (
                        <DropdownMenuItem onClick={switchToTeacher} data-testid="menu-switch-teacher">
                          {t('auth.switchToTeacher')}
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuItem data-testid="menu-request-feature">
                        {t('profile.requestFeature')}
                      </DropdownMenuItem>
                      <DropdownMenuItem data-testid="menu-help">
                        {t('profile.help')}
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} data-testid="menu-logout">
                        <LogOut className="h-4 w-4 mr-2" />
                        {t('auth.logout')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}

              {!user && (
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
              )}
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
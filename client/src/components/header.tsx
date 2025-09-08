import { Bell, User, GraduationCap, LogIn, LogOut } from "lucide-react";
import { useState } from "react";
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

export default function Header() {
  const { t } = useLanguage();
  const { user, logout, switchToTeacher } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <>
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-primary-foreground h-5 w-5" />
              </div>
              <h1 className="text-xl font-bold text-foreground">{t('app.title')}</h1>
            </div>
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
              
              {user ? (
                <>
                  <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" data-testid="button-notifications">
                    <Bell className="h-4 w-4" />
                  </button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-8 h-8 bg-muted rounded-full flex items-center justify-center" data-testid="avatar-user">
                        <User className="text-muted-foreground h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                      <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                        {user.userType === 'teacher' ? t('auth.teacher') : t('auth.student')}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      {user.userType === 'student' && (
                        <DropdownMenuItem onClick={switchToTeacher} data-testid="menu-switch-teacher">
                          {t('auth.switchToTeacher')}
                        </DropdownMenuItem>
                      )}
                      
                      {user.userType === 'teacher' && (
                        <DropdownMenuItem data-testid="menu-create-content">
                          {t('content.create')}
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} data-testid="menu-logout">
                        <LogOut className="h-4 w-4 mr-2" />
                        {t('auth.logout')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
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
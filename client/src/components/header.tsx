import { Bell, User, GraduationCap } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="text-primary-foreground h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-foreground">StudyCycle</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#dashboard" className="text-primary font-medium border-b-2 border-primary pb-1" data-testid="nav-dashboard">
              Dashboard
            </a>
            <a href="#subjects" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-subjects">
              Disciplinas
            </a>
            <a href="#settings" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-settings">
              Configurações
            </a>
          </nav>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" data-testid="button-notifications">
              <Bell className="h-4 w-4" />
            </button>
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center" data-testid="avatar-user">
              <User className="text-muted-foreground h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider } from "@/contexts/auth-context";
import { WithMainLayout } from "@/components/with-main-layout";
import HomePage from "@/pages/home";
import ProtectedRoute from "@/components/protected-route";
import LandingPage from "@/pages/landing";
import AuthLoginPage from "@/pages/auth/login";
import AuthRegisterPage from "@/pages/auth/register";
import AuthCallbackPage from "@/pages/auth/callback";
import CoursesPage from "@/pages/courses";
import SubjectsPage from "@/pages/subjects";
import AdminPage from "@/pages/admin";
import { TeacherDashboard } from "@/pages/teacher-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <WithMainLayout>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route
          path="/home"
          component={() => (
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          )}
        />
        <Route path="/auth/login" component={AuthLoginPage} />
        <Route path="/auth/register" component={AuthRegisterPage} />
        <Route path="/auth/callback" component={AuthCallbackPage} />
        <Route path="/courses" component={CoursesPage} />
        <Route path="/subjects" component={SubjectsPage} />
        <Route
          path="/teacher"
          component={() => (
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/calendar"
          component={() => <PlaceholderPage title="Calendário" />}
        />
        <Route
          path="/chats"
          component={() => <PlaceholderPage title="Chats" />}
        />
        <Route
          path="/events"
          component={() => <PlaceholderPage title="Eventos" />}
        />
        <Route
          path="/english"
          component={() => <PlaceholderPage title="Inglês" />}
        />
        <Route
          path="/mandarin"
          component={() => <PlaceholderPage title="Mandarim" />}
        />
        <Route
          path="/settings"
          component={() => <PlaceholderPage title="Configurações" />}
        />
        <Route path="/admin" component={AdminPage} />
        <Route component={NotFound} />
      </Switch>
    </WithMainLayout>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">{title}</h1>
        <p className="text-muted-foreground">
          Esta página está em desenvolvimento.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

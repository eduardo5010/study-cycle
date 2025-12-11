import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider } from "@/contexts/auth-context";
import { WithMainLayout } from "@/components/with-main-layout";
import MemoryAssessmentWrapper from "@/components/memory-assessment-wrapper";
import HomePage from "@/pages/home";
import ProtectedRoute from "@/components/protected-route";
import LandingPage from "@/pages/landing";
import AuthLoginPage from "@/pages/auth/login";
import AuthRegisterPage from "@/pages/auth/register";
import AuthCallbackPage from "@/pages/auth/callback";
import CoursesPage from "@/pages/courses";
import SubjectsPage from "@/pages/subjects";
import AdminPage from "@/pages/admin";
import SettingsPage from "@/pages/settings";
import CalendarPage from "@/pages/calendar";
import ChatsPage from "@/pages/chats";
import FeedPage from "@/pages/feed";
import CycleCreatePage from "@/pages/cycle-create";
import CycleEditorPage from "@/pages/cycle-editor";
import NotificationsPage from "@/pages/notifications";
import ProfilePage from "@/pages/profile";
import FlashcardsPage from "@/pages/flashcards";
import AIFlashcardGeneratorPage from "@/pages/ai-flashcard-generator";
import StudyGroupsPage from "@/pages/study-groups";
import LeaderboardPage from "@/pages/leaderboard";
import TeacherProfilePage from "@/pages/teacher-profile";
import CourseBuilderPage from "@/pages/course-builder";
import { TeacherDashboard } from "@/pages/teacher-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <WithMainLayout>
      <Switch>
        {/* Public routes */}
        <Route path="/" component={LandingPage} />
        <Route path="/auth/login" component={AuthLoginPage} />
        <Route path="/auth/register" component={AuthRegisterPage} />
        <Route path="/auth/callback" component={AuthCallbackPage} />
        
        {/* Protected routes - require authentication */}
        <Route
          path="/home"
          component={() => (
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/courses"
          component={() => (
            <ProtectedRoute>
              <CoursesPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/subjects"
          component={() => (
            <ProtectedRoute>
              <SubjectsPage />
            </ProtectedRoute>
          )}
        />
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
          component={() => (
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/chats"
          component={() => (
            <ProtectedRoute>
              <ChatsPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/feed"
          component={() => (
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/cycle/create"
          component={() => (
            <ProtectedRoute>
              <CycleCreatePage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/cycle/edit"
          component={() => (
            <ProtectedRoute>
              <CycleEditorPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/events"
          component={() => (
            <ProtectedRoute>
              <PlaceholderPage title="Community Events" description="Join study events, webinars, and community meetups" />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/english"
          component={() => (
            <ProtectedRoute>
              <PlaceholderPage title="English Learning" description="Interactive English courses with native speakers" />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/mandarin"
          component={() => (
            <ProtectedRoute>
              <PlaceholderPage title="Mandarin Learning" description="Master Chinese with our comprehensive Mandarin courses" />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/profile"
          component={() => (
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/flashcards"
          component={() => (
            <ProtectedRoute>
              <FlashcardsPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/ai-flashcards"
          component={() => (
            <ProtectedRoute>
              <AIFlashcardGeneratorPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/study-groups"
          component={() => (
            <ProtectedRoute>
              <StudyGroupsPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/leaderboard"
          component={() => (
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          )}
        />
        <Route path="/teacher/:teacherId" component={TeacherProfilePage} />
        <Route
          path="/course-builder"
          component={() => (
            <ProtectedRoute>
              <CourseBuilderPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/notifications"
          component={() => (
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/settings"
          component={() => (
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin"
          component={() => (
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          )}
        />
        <Route component={NotFound} />
      </Switch>
    </WithMainLayout>
  );
}

function PlaceholderPage({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">{title}</h1>
        <p className="text-muted-foreground mb-4">
          {description || "Esta página está em desenvolvimento."}
        </p>
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 border">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Coming Soon!</h3>
            <p className="text-sm text-muted-foreground">
              We're working hard to bring you amazing features. Stay tuned for updates!
            </p>
          </div>
        </div>
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
              <MemoryAssessmentWrapper>
                <Toaster />
                <Router />
              </MemoryAssessmentWrapper>
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

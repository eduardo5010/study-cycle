import Header from "@/components/header";
import LeftSidebar from "@/components/left-sidebar";
import ReviewScheduler from "@/hooks/use-review-scheduler";
import { useAuth } from "@/contexts/auth-context";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header visible only for authenticated users */}
      {!isLoading && user && <Header />}

      {/* If user is authenticated show sidebar + main, otherwise render children full width */}
      {user ? (
        <div className="flex">
          <LeftSidebar />
          <main className="flex-1">
            {/* Scheduler runs in background and will open modals when reviews are due */}
            <ReviewScheduler />
            {children}
          </main>
        </div>
      ) : (
        <main className="flex-1 p-4">{children}</main>
      )}
    </div>
  );
}

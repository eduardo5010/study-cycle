import NewHeader from "@/components/new-header";
import LeftSidebar from "@/components/left-sidebar";
import ReviewScheduler from "@/hooks/use-review-scheduler";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <NewHeader />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1">
          {/* Scheduler runs in background and will open modals when reviews are due */}
          <ReviewScheduler />
          {children}
        </main>
      </div>
    </div>
  );
}

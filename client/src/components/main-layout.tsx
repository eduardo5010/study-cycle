import NewHeader from "@/components/new-header";
import LeftSidebar from "@/components/left-sidebar";

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
          {children}
        </main>
      </div>
    </div>
  );
}
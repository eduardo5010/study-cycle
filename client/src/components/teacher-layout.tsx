import React from "react";
import NewHeader from "@/components/new-header";
import { useAuth } from "@/contexts/auth-context";

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export function TeacherLayout({ children }: TeacherLayoutProps) {
  const { user, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {!isLoading && user && <NewHeader />}
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}

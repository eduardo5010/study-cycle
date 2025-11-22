import React from "react";
import Header from "@/components/header";
import { useAuth } from "@/contexts/auth-context";

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export function TeacherLayout({ children }: TeacherLayoutProps) {
  const { user, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {!isLoading && user && <Header />}
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}

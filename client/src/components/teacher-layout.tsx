import React from "react";
import NewHeader from "@/components/new-header";

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export function TeacherLayout({ children }: TeacherLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <NewHeader />
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}

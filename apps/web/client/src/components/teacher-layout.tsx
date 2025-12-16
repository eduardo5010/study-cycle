import React from "react";
import Header from "@/components/header";
import LeftSidebar from "@/components/left-sidebar";

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export function TeacherLayout({ children }: TeacherLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}

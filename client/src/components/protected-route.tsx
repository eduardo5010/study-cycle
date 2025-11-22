import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      // Redirect unauthenticated users to login
      setLocation("/auth/login");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-40"></div>
          <div className="h-4 bg-muted rounded w-64"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

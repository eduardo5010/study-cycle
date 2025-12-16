import React, { useEffect } from "react";
import { useLocation } from "wouter";

export default function AuthCallbackPage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      try {
        localStorage.setItem("sc_token", token);
      } catch (e) {
        console.warn("Failed to store token", e);
      }
      // navigate to home so AuthProvider can re-check on reload
      window.location.href = "/home";
    } else {
      // no token, go to login
      setLocation("/auth/login");
    }
  }, [setLocation]);

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center">
        <h2 className="text-xl font-bold">Processing authentication...</h2>
        <p className="text-sm text-muted-foreground mt-2">
          If you are not redirected automatically, please wait or return to the
          login page.
        </p>
      </div>
    </div>
  );
}

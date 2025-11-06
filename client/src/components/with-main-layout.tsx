import { useLocation } from "wouter";
import MainLayout from "./main-layout";

interface WithMainLayoutProps {
  children: React.ReactNode;
}

export function WithMainLayout({ children }: WithMainLayoutProps) {
  const [location] = useLocation();

  // Não mostrar o layout principal na landing page
  if (location === "/") {
    return <>{children}</>;
  }

  return <MainLayout>{children}</MainLayout>;
}

import { useLocation } from "wouter";
import MainLayout from "./main-layout";

interface WithMainLayoutProps {
  children: React.ReactNode;
}

export function WithMainLayout({ children }: WithMainLayoutProps) {
  const [location] = useLocation();

  // Não mostrar o layout principal na landing page e nas páginas de auth
  // (elas já têm o Header incluído)
  // Também não mostrar na rota do professor (já tem seu próprio layout)
  if (location === "/" || location.startsWith("/auth/") || location === "/teacher") {
    return <>{children}</>;
  }

  return <MainLayout>{children}</MainLayout>;
}

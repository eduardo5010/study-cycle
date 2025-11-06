interface LandingLayoutProps {
  children: React.ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return <div className="min-h-screen bg-background">{children}</div>;
}

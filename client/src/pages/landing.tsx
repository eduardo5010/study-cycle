import React from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/language-selector";
import ThemeToggle from "@/components/theme-toggle";
import LandingLayout from "@/components/landing-layout";
import {
  BookOpen,
  Braces,
  GraduationCap,
  MessageCircle,
  Star,
  ChevronRight,
} from "lucide-react";

function LandingPageHeader() {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <GraduationCap className="h-8 w-8" />
          <span className="text-xl font-bold">Study Cycle</span>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="#courses"
            className="text-sm font-medium hover:text-primary"
          >
            {t("landing.nav.courses")}
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium hover:text-primary"
          >
            {t("landing.nav.pricing")}
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium hover:text-primary"
          >
            {t("landing.nav.testimonials")}
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <LanguageSelector />
          <ThemeToggle />
          {user ? (
            <Button asChild>
              <Link href="/home">
                {t("landing.nav.dashboard")}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <Link href="/auth/login">{t("auth.login")}</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">{t("auth.register")}</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg border bg-card">
      <Icon className="h-12 w-12 mb-4 text-primary" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function PricingCard({
  title,
  price,
  description,
  features,
  isPopular,
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}) {
  const { t } = useLanguage();

  return (
    <div
      className={`p-6 rounded-lg border ${
        isPopular ? "border-primary" : "bg-card"
      } relative`}
    >
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
          {t("landing.pricing.popular")}
        </span>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">{price}</span>
        {price !== t("landing.pricing.free") && (
          <span className="text-muted-foreground">/mo</span>
        )}
      </div>
      <p className="text-muted-foreground mb-4">{description}</p>
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Star className="h-4 w-4 mr-2 text-primary" />
            {feature}
          </li>
        ))}
      </ul>
      <Button className="w-full" variant={isPopular ? "default" : "outline"}>
        {t("landing.pricing.getStarted")}
      </Button>
    </div>
  );
}

function TestimonialCard({
  name,
  role,
  content,
  image,
}: {
  name: string;
  role: string;
  content: string;
  image: string;
}) {
  return (
    <div className="p-6 rounded-lg border bg-card">
      <div className="flex items-center space-x-4 mb-4">
        <img src={image} alt={name} className="h-12 w-12 rounded-full" />
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
      <p className="text-muted-foreground">{content}</p>
    </div>
  );
}

export default function LandingPage() {
  const { t } = useLanguage();

  const features = [
    {
      icon: BookOpen,
      title: t("landing.features.courses.title"),
      description: t("landing.features.courses.description"),
    },
    {
      icon: Braces,
      title: t("landing.features.skills.title"),
      description: t("landing.features.skills.description"),
    },
    {
      icon: MessageCircle,
      title: t("landing.features.community.title"),
      description: t("landing.features.community.description"),
    },
  ];

  const pricingPlans = [
    {
      title: t("landing.pricing.pro.title"),
      // Base price: R$50/month and US$50/month as requested.
      price: t("landing.pricing.pro.price"),
      description: t("landing.pricing.pro.description"),
      features: [
        t("landing.pricing.pro.feature1"),
        t("landing.pricing.pro.feature2"),
        t("landing.pricing.pro.feature3"),
        t("landing.pricing.pro.feature4"),
      ],
      isPopular: true,
    },
  ];

  const testimonials = [
    {
      name: "João Silva",
      role: t("landing.testimonials.role.student"),
      content: t("landing.testimonials.content1"),
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=João",
    },
    {
      name: "Maria Santos",
      role: t("landing.testimonials.role.teacher"),
      content: t("landing.testimonials.content2"),
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    },
    {
      name: "Carlos Oliveira",
      role: t("landing.testimonials.role.parent"),
      content: t("landing.testimonials.content3"),
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    },
  ];

  return (
    <div className="min-h-screen">
      <LandingPageHeader />

      {/* Wrap the main content in LandingLayout */}
      <LandingLayout>
        {/* Hero Section */}
        <section className="pt-32 pb-16 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t("landing.hero.title")}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("landing.hero.description")}
            </p>
            <Button size="lg" asChild>
              <Link href={user ? "/home" : "/auth/login"}>
                {t("landing.hero.cta")}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="courses" className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t("landing.features.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t("landing.pricing.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan) => (
                <PricingCard key={plan.title} {...plan} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t("landing.testimonials.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.name} {...testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">
              © 2025 Study Cycle. {t("landing.footer.rights")}
            </p>
          </div>
        </footer>
      </LandingLayout>
    </div>
  );
}

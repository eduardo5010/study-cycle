import React from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import LandingLayout from "@/components/landing-layout";
import {
  BookOpen,
  Braces,
  MessageCircle,
  Star,
  ChevronRight,
} from "lucide-react";

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
      {price !== t("landing.pricing.free") && t("landing.pricing.pro.priceNote") && (
        <p className="text-xs text-muted-foreground mb-4 italic">
          {t("landing.pricing.pro.priceNote")}
        </p>
      )}
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
  const { user } = useAuth();

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

  // Testimonials removed - project is in early stage
  const testimonials: any[] = [];

  return (
    <div className="min-h-screen">
      <Header />
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

        {/* Early Stage Notice Section */}
        <section id="early-stage" className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                {t("landing.earlyStage.title")}
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                {t("landing.earlyStage.description")}
              </p>
              <p className="text-muted-foreground mb-6">
                {t("landing.earlyStage.pricing")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("landing.earlyStage.noProof")}
              </p>
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

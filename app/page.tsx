"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Sparkles,
  Calendar,
  Brain,
  Zap,
  Users,
  Star,
  Check,
  ArrowRight,
  Menu,
  X,
  Globe,
  Heart,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features: Feature[] = [
    {
      icon: <Globe className="h-6 w-6 text-violet-500" />,
      title: "Multi-Source Aggregation",
      description:
        "We scrape Eventbrite, Meetup, Facebook Groups, local subreddits, and Instagram so you never miss a hidden gem.",
    },
    {
      icon: <Brain className="h-6 w-6 text-violet-500" />,
      title: "AI Interest Profiling",
      description:
        "Our LLM learns your taste over time. The more you interact, the better your recommendations get.",
    },
    {
      icon: <Calendar className="h-6 w-6 text-violet-500" />,
      title: "Weekly Monday Digest",
      description:
        "Every Monday, receive a beautifully curated briefing with vibe descriptions — not just raw listings.",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-violet-500" />,
      title: "Vibe-Based Descriptions",
      description:
        "We add context, crowd descriptions, and atmosphere notes so you know exactly what to expect.",
    },
    {
      icon: <Heart className="h-6 w-6 text-violet-500" />,
      title: "Community-First Discovery",
      description:
        "No promoter-paid listings. We surface authentic grassroots events that locals actually attend.",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-violet-500" />,
      title: "Smart Onboarding Quiz",
      description:
        "Answer a short quiz about your interests, schedule, and social style to kickstart personalization.",
    },
  ];

  const steps: Step[] = [
    {
      number: "01",
      title: "Take the Quiz",
      description:
        "Answer a 2-minute onboarding quiz about your interests, social energy, and neighborhood preferences.",
      icon: <Zap className="h-8 w-8 text-violet-500" />,
    },
    {
      number: "02",
      title: "AI Learns Your Taste",
      description:
        "Our AI analyzes your profile and starts matching you with events from dozens of fragmented sources.",
      icon: <Brain className="h-8 w-8 text-violet-500" />,
    },
    {
      number: "03",
      title: "Get Your Monday Briefing",
      description:
        "Every Monday, open your personalized digest with curated picks, vibe notes, and easy RSVPs.",
      icon: <Calendar className="h-8 w-8 text-violet-500" />,
    },
  ];

  const pricingTiers: PricingTier[] = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out LocalPulse in your new city.",
      features: [
        "Weekly digest with 5 picks",
        "Basic interest profiling",
        "1 neighborhood radius",
        "Email delivery",
      ],
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      description: "For the socially ambitious who want to maximize city life.",
      features: [
        "Unlimited curated picks",
        "Advanced AI taste learning",
        "Multiple neighborhoods",
        "Mid-week bonus digest",
        "Calendar integration",
        "Priority event alerts",
      ],
      highlighted: true,
      badge: "Most Popular",
    },
    {
      name: "Social Circle",
      price: "$19",
      period: "per month",
      description: "Share the local pulse with your friend group.",
      features: [
        "Everything in Pro",
        "Up to 5 friend profiles",
        "Group event matching",
        "Shared calendar",
        "Weekend special editions",
        "Concierge suggestions",
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-violet-600" />
              <span className="text-xl font-bold text-gray-900">LocalPulse</span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <a href="/login">
                <Button variant="ghost" className="text-sm">
                  Sign In
                </Button>
              </a>
              <a href="/register">
                <Button className="text-sm bg-violet-600 hover:bg-violet-700 text-white">
                  Get Started
                </Button>
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-sm text-gray-600 hover:text-gray-900">
                Features
              </a>
              <a href="#how-it-works" className="block text-sm text-gray-600 hover:text-gray-900">
                How It Works
              </a>
              <a href="#pricing" className="block text-sm text-gray-600 hover:text-gray-900">
                Pricing
              </a>
              <a href="#faq" className="block text-sm text-gray-600 hover:text-gray-900">
                FAQ
              </a>
              <Separator />
              <div className="flex flex-col gap-2 pt-2">
                <a href="/login">
                  <Button variant="ghost" className="w-full text-sm">
                    Sign In
                  </Button>
                </a>
                <a href="/register">
                  <Button className="w-full text-sm bg-violet-600 hover:bg-violet-700 text-white">
                    Get Started
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            AI-Powered Local Discovery
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 max-w-4xl mx-auto leading-tight">
            Never miss what{"'"}s actually worth doing{" "}
            <span className="text-violet-600">near you</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your AI neighborhood curator aggregates events from Eventbrite, Meetup, Reddit, Instagram
            {"&"} more — then delivers a personalized weekly digest matched to your taste.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/register">
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-base">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="px-8 py-6 text-base">
                See How It Works
              </Button>
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Free forever plan available. No credit card required.
          </p>

          {/* Social proof */}
          <div className="mt-16 flex flex-col items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 border-2 border-white flex items-center justify-center"
                >
                  <Users className="h-4 w-4 text-white" />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Loved by 2,000+ young professionals who recently relocated
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything you need to find your scene
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Stop juggling Luma, Eventbrite, Meetup, and Reddit simultaneously.
              LocalPulse brings it all together — intelligently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border border-gray-200 hover:border-violet-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-violet-50 flex items-center justify-center mb-2">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              From new in town to in-the-know in 3 steps
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Set up takes 2 minutes. Then sit back and let AI do the scouting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-6">
                  {step.icon}
                </div>
                <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">
                  Step {step.number}
                </span>
                <h3 className="mt-2 text-xl font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 right-0 translate-x-1/2 w-8">
                    <ArrowRight className="h-5 w-5 text-violet-300" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sample digest preview */}
          <div className="mt-16 max-w-2xl mx-auto">
            <Card className="border-2 border-violet-100 bg-gradient-to-br from-violet-50 to-white">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-violet-600" />
                  <span className="text-sm font-medium text-violet-600">Monday Digest Preview</span>
                </div>
                <CardTitle className="text-xl">Your Week in Austin, TX</CardTitle>
                <CardDescription>Curated for you based on your love of live music, food pop-ups, and tech meetups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Rooftop Jazz {"&"} Natural Wine Night</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Intimate 40-person crowd, chill vibes, great for meeting fellow creatives
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0" />
                    <div>
                      <p className="font-medium text-sm">AI Builders Meetup at Capital Factory</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Hands-on demos, 80 attendees expected, mix of founders and engineers
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Korean Street Food Pop-up at Cosmic</p>
                      <p className="text-xs text-gray-500 mt-1">
                        First-come-first-served, usually sells out by 8pm, outdoor seating
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Simple pricing, powerful discovery
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Start free and upgrade when you want deeper personalization and more picks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative ${
                  tier.highlighted
                    ? "border-2 border-violet-500 shadow-xl scale-105"
                    : "border border-gray-200"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-violet-600 text-white">{tier.badge}</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-gray-500 ml-1">/{tier.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-violet-500 shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <a href="/register" className="w-full">
                    <Button
                      className={`w-full ${
                        tier.highlighted
                          ? "bg-violet-600 hover:bg-violet-700 text-white"
                          : ""
                      }`}
                      variant={tier.highlighted ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Frequently asked questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How does LocalPulse find events that other apps miss?</AccordionTrigger>
              <AccordionContent>
                We use NLP-powered scraping to aggregate events from Eventbrite, Meetup, Facebook Groups, local
                subreddits, Instagram accounts, and community boards. Most apps only show promoter-paid listings.
                We surface authentic grassroots events that locals actually attend — the kind you{"'"}d only find
                by being deeply embedded in a community.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What cities are currently supported?</AccordionTrigger>
              <AccordionContent>
                We{"'"}re currently live in 25+ major US cities including Austin, NYC, SF, LA, Chicago, Denver,
                Seattle, Portland, Nashville, and more. We{"'"}re expanding to new cities every month based on
                user demand. Sign up and tell us your city — we{"'"}ll prioritize it.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How does the AI learn my taste over time?</AccordionTrigger>
              <AccordionContent>
                After the initial onboarding quiz, our AI tracks which events you save, click on, RSVP to, and
                rate after attending. It builds a dynamic taste profile that evolves with you — from the type of
                crowd you prefer to the time of day you{"'"}re most social.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Can I switch from the free plan to Pro anytime?</AccordionTrigger>
              <AccordionContent>
                Absolutely! You can upgrade or downgrade at any time. Your taste profile and preferences carry
                over. Pro unlocks unlimited picks, multiple neighborhoods, mid-week bonus digests, and calendar
                integration.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Is my data shared with event organizers?</AccordionTrigger>
              <AccordionContent>
                Never. Your profile data and preferences are used exclusively to improve your recommendations.
                We don{"'"}t sell your data to event organizers or advertisers. Our business model is
                subscription-based, not ad-based.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-violet-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Stop feeling like a tourist in your own city
          </h2>
          <p className="mt-4 text-lg text-violet-100 max-w-2xl mx-auto">
            Join thousands of relocated professionals who discovered their new city{"'"}s hidden scene
            through LocalPulse. Your first digest arrives this Monday.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/register">
              <Button size="lg" className="bg-white text-violet-700 hover:bg-gray-100 px-8 py-6 text-base font-semibold">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
          <p className="mt-4 text-sm text-violet-200">
            No credit card required. Free plan includes 5 curated picks every week.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-violet-400" />
              <span className="text-lg font-bold text-white">LocalPulse</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
              <a href="/login" className="hover:text-white transition-colors">Sign In</a>
            </div>
            <p className="text-sm">
              © 2024 LocalPulse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
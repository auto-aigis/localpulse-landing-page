"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { paymentsApi, authApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_components/AuthProvider";
import { Check, Zap, Crown, Sparkles, CreditCard, ArrowRight } from "lucide-react";

const PLANS = {
  explorer: {
    name: "Explorer",
    monthly: 9,
    yearly: 96,
    description: "Curated event digests delivered to your inbox",
    features: [
      "Full weekly digest (6-10 events)",
      "Monday morning email delivery",
      "Event feedback to improve recommendations",
      "Access to digest history",
    ],
  },
  local: {
    name: "Local",
    monthly: 19,
    yearly: 192,
    description: "Everything in Explorer, plus real-time alerts",
    features: [
      "Expanded digest (up to 15 events)",
      "Real-time pop-up event alerts",
      "Early access to new cities",
      "Priority taste model updates",
    ],
  },
};

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const router = useRouter();
  const { user, refresh } = useAuth();

  useEffect(() => {
    const loadSub = async () => {
      try {
        const sub = await authApi.subscription();
        setSubscription(sub);
      } catch {}
    };
    loadSub();
  }, []);

  const handleCheckout = async (tier: string) => {
    if (!user) {
      router.push("/login");
      return;
    }
    setLoading(tier);
    try {
      const billingInterval = annual ? "yearly" : "monthly";
      const { price_id, client_token } = await paymentsApi.checkout(tier, billingInterval);

      const paddle = (window as any).Paddle;
      if (paddle) {
        paddle.Checkout.open({
          items: [{ priceId: price_id, quantity: 1 }],
          customData: { user_id: user.id },
          settings: { displayMode: "overlay" },
        });
      } else {
        throw new Error("Paddle not initialized");
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(null);
    }
  };

  const currentTier = subscription?.tier || "free";
  const isActive = (tier: string) => currentTier === tier;
  const isHigher = (tier: string) => {
    const order = ["free", "explorer", "local"];
    return order.indexOf(tier) > order.indexOf(currentTier);
  };

  return (
    <div className="mx-auto max-w-4xl py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Choose your plan</h1>
        <p className="mt-2 text-gray-600">Get the most out of Austin&apos;s event scene</p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-8">
        <Label htmlFor="annual-toggle" className={annual ? "text-gray-500" : "font-medium text-gray-900"}>
          Monthly
        </Label>
        <Switch
          id="annual-toggle"
          checked={annual}
          onCheckedChange={setAnnual}
        />
        <Label htmlFor="annual-toggle" className={annual ? "font-medium text-gray-900" : "text-gray-500"}>
          Annual
        </Label>
        {annual && (
          <span className="ml-2 text-sm text-green-600 font-medium">Save up to 16%</span>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Explorer */}
        <Card className={currentTier === "explorer" ? "border-[#c4592e] ring-1 ring-[#c4592e]" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#c4592e]" />
                Explorer
              </CardTitle>
              {isActive("explorer") && (
                <span className="text-sm text-green-600 font-medium">Current Plan</span>
              )}
            </div>
            <CardDescription>{PLANS.explorer.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-3xl font-bold text-gray-900">
                ${annual ? PLANS.explorer.yearly : PLANS.explorer.monthly}
              </span>
              <span className="text-gray-500">/{annual ? "year" : "month"}</span>
            </div>
            <ul className="space-y-2">
              {PLANS.explorer.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleCheckout("explorer")}
              disabled={loading === "explorer" || isActive("explorer")}
              className="w-full bg-[#c4592e] hover:bg-[#a84d26]"
              variant={isHigher("explorer") ? "default" : "outline"}
            >
              {loading === "explorer" ? (
                <span className="flex items-center gap-2">Processing...</span>
              ) : isActive("explorer") ? (
                "Current Plan"
              ) : (
                <>
                  {currentTier === "free" ? "Get Started" : "Upgrade"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Local */}
        <Card className={currentTier === "local" ? "border-[#c4592e] ring-1 ring-[#c4592e]" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-[#c4592e]" />
                Local
              </CardTitle>
              {isActive("local") && (
                <span className="text-sm text-green-600 font-medium">Current Plan</span>
              )}
            </div>
            <CardDescription>{PLANS.local.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-3xl font-bold text-gray-900">
                ${annual ? PLANS.local.yearly : PLANS.local.monthly}
              </span>
              <span className="text-gray-500">/{annual ? "year" : "month"}</span>
            </div>
            <ul className="space-y-2">
              {PLANS.local.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleCheckout("local")}
              disabled={loading === "local" || isActive("local")}
              className="w-full bg-[#2d5a3d] hover:bg-[#234a31]"
              variant={isHigher("local") ? "default" : "outline"}
            >
              {loading === "local" ? (
                <span className="flex items-center gap-2">Processing...</span>
              ) : isActive("local") ? (
                "Current Plan"
              ) : (
                <>
                  {currentTier === "free" ? "Get Started" : "Upgrade"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {currentTier !== "free" && (
        <p className="mt-6 text-center text-sm text-gray-500">
          Manage your subscription from{" "}
          <Link href="/settings" className="text-[#c4592e] hover:underline">
            Settings
          </Link>
        </p>
      )}

      {currentTier === "free" && (
        <p className="mt-6 text-center text-sm text-gray-500">
          Or{" "}
          <Link href="/dashboard" className="text-[#c4592e] hover:underline">
            skip for now
          </Link>{" "}
          and see your 3-event preview
        </p>
      )}
    </div>
  );
}

"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { digestApi, feedbackApi, paymentsApi, authApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_components/AuthProvider";
import { Loader2, ThumbsUp, ThumbsDown, Calendar, MapPin, ExternalLink, Crown, Sparkles, Clock, RefreshCw, History } from "lucide-react";

interface DigestData {
  digest?: {
    id: string;
    generated_at: string;
    events: {
      id: string;
      event: {
        id: string;
        title: string;
        description: string;
        event_date: string;
        location: string;
        category: string;
        source_url: string;
        source_name: string;
      };
      ai_vibe_description: string;
      rank_order: number;
    }[];
  };
  subscription_tier: string;
  can_upgrade: boolean;
}

export default function DashboardPage() {
  const [data, setData] = useState<DigestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<Record<string, string>>({});
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refresh } = useAuth();

  const checkoutSuccess = searchParams.get("checkout") === "success";
  const transactionId = searchParams.get("transaction_id");

  const loadDigest = async () => {
    try {
      const d = await digestApi.getCurrent();
      setData(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

const verifyTransaction = useCallback(async (txnId: string) => {
    try {
      await paymentsApi.verifyTransaction(txnId);
      await refresh();
      const url = new URL(window.location.href);
      url.searchParams.delete("checkout");
      url.searchParams.delete("transaction_id");
      window.history.replaceState({}, "", url.toString());
      loadDigest();
    } catch (err) {
      console.error("Transaction verification failed:", err);
    }
  }, [refresh]);

  useEffect(() => {
    setLoading(true);
    loadDigest();
  }, []);

  useEffect(() => {
    if (checkoutSuccess && transactionId) {
      setProcessing(true);
      verifyTransaction(transactionId).finally(() => setProcessing(false));
    }
  }, [checkoutSuccess, transactionId, verifyTransaction]);
  useEffect(() => {
    setLoading(true);
    loadDigest();
  }, []);

  useEffect(() => {
    if (checkoutSuccess && transactionId) {
      setProcessing(true);
      verifyTransaction(transactionId).finally(() => setProcessing(false));
    }
  }, [checkoutSuccess, transactionId]);

  const handleFeedback = async (eventId: string, rating: string) => {
    if (!data?.digest) return;
    try {
      await feedbackApi.submit(eventId, rating, data.digest.id, "web");
      setFeedbackStatus({ ...feedbackStatus, [eventId]: rating });
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await digestApi.generate();
      await loadDigest();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const h = await digestApi.getHistory();
      setHistory(h);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleHistory = async () => {
    if (!showHistory) {
      await loadHistory();
    }
    setShowHistory(!showHistory);
  };

  if (loading || processing) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#c4592e]" />
      </div>
    );
  }

  const tier = data?.subscription_tier || "free";
  const events = data?.digest?.events || [];
  const displayEvents = tier === "free" ? events.slice(0, 3) : events;

  return (
    <div className="space-y-8">
      {processing && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-center gap-3 py-4">
            <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
            <span className="text-amber-800">Payment processing... please wait.</span>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Your Weekly Digest</h1>
          <p className="text-gray-600">Curated events for your taste</p>
        </div>
        <div className="flex gap-2">
          {tier !== "free" && (
            <Button variant="outline" size="sm" onClick={toggleHistory}>
              <History className="mr-2 h-4 w-4" />
              Past Digests
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleGenerate} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Regenerate
          </Button>
        </div>
      </div>

      {tier === "free" && data?.can_upgrade && events.length > 3 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-4">
            <p className="text-amber-800">
              You&apos;re viewing 3 of {events.length} events.{" "}
              <Link href="/pricing" className="font-medium underline underline-offset-2">
                Upgrade to unlock the full digest
              </Link>
            </p>
          </CardContent>
        </Card>
      )}

      {events.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Sparkles className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No events yet</h3>
            <p className="mt-2 text-gray-600">Complete the taste quiz to get your personalized digest.</p>
            <Link href="/quiz">
              <Button className="mt-4 bg-[#c4592e] hover:bg-[#a84d26]">Take the Quiz</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {displayEvents.map((item, idx) => {
            const date = new Date(item.event.event_date);
            const feedback = feedbackStatus[item.event.id];
            return (
              <Card key={item.id} className="overflow-hidden">
                <div className="bg-gradient-to-r from-[#c4592e]/5 to-transparent p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-[#2d5a3d] text-white">
                          {item.event.category}
                        </Badge>
                        <Badge variant="outline">{item.event.source_name}</Badge>
                      </div>
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        {item.ai_vibe_description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {date.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {item.event.location}
                        </span>
                      </div>
                    </div>
                    <a
                      href={item.event.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 shrink-0"
                    >
                      <Button variant="outline" size="sm">
                        RSVP
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Button>
                    </a>
                  </div>
                </div>
                {tier !== "free" && (
                  <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between bg-gray-50/50">
                    <span className="text-sm text-gray-500">Was this a good match?</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleFeedback(item.event.id, "thumbs_up")}
                        disabled={!!feedback}
                        className={`p-2 rounded-lg transition-colors ${
                          feedback === "thumbs_up"
                            ? "bg-green-100 text-green-700"
                            : "hover:bg-gray-200 text-gray-500"
                        }`}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleFeedback(item.event.id, "thumbs_down")}
                        disabled={!!feedback}
                        className={`p-2 rounded-lg transition-colors ${
                          feedback === "thumbs_down"
                            ? "bg-red-100 text-red-700"
                            : "hover:bg-gray-200 text-gray-500"
                        }`}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {tier === "free" && events.length > 3 && (
        <Card className="border-[#c4592e]/20 bg-[#c4592e]/5">
          <CardContent className="py-6 text-center">
            <Crown className="mx-auto h-8 w-8 text-[#c4592e]" />
            <h3 className="mt-3 text-lg font-medium text-gray-900">Unlock the full digest</h3>
            <p className="mt-1 text-gray-600">
              Get up to {events.length} events, weekly emails, and feedback to improve recommendations.
            </p>
            <Link href="/pricing">
              <Button className="mt-4 bg-[#c4592e] hover:bg-[#a84d26]">
                View Plans
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {showHistory && history.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Past Digests</h2>
          {history.map((digest) => (
            <Card key={digest.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  {new Date(digest.generated_at).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </CardTitle>
                <CardDescription>{digest.events.length} events</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { quizApi, settingsApi, authApi, digestApi } from "@/app/_lib/api";
import { QUIZ_QUESTIONS } from "@/app/_lib/types";
import { useAuth } from "@/app/_components/AuthProvider";
import { Settings as SettingsIcon, Save, Key, Bell, Loader2, Check, ChevronRight } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newApiKey, setNewApiKey] = useState("");
  const [alertsOptedIn, setAlertsOptedIn] = useState(false);
  const { refresh } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileData, subData, keysData] = await Promise.all([
        quizApi.get().catch(() => null),
        authApi.subscription().catch(() => null),
        settingsApi.getKeys().catch(() => []),
      ]);
      setProfile(profileData);
      setSubscription(subData);
      setApiKeys(keysData);
      if (subData?.tier === "local") {
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    setMessage("");
    try {
      await quizApi.save({
        event_types: profile.event_types,
        social_comfort: profile.social_comfort,
        budget_range: profile.budget_range,
        schedule_prefs: profile.schedule_prefs,
        neighborhood: profile.neighborhood,
        vibe_description: profile.vibe_description,
      });
      await digestApi.generate();
      setMessage("Preferences saved!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveApiKey = async () => {
    if (!newApiKey.trim()) return;
    setSaving(true);
    try {
      await settingsApi.saveKey("openai", newApiKey);
      setNewApiKey("");
      loadData();
      setMessage("API key saved!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to save API key");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteApiKey = async (serviceName: string) => {
    setSaving(true);
    try {
      await settingsApi.deleteKey(serviceName);
      loadData();
      setMessage("API key deleted");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setSaving(false);
    }
  };

  const toggleOption = (field: string, value: string) => {
    if (!profile) return;
    const current = (profile[field] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setProfile({ ...profile, [field]: updated });
  };

  const toggleAlerts = async () => {
    if (subscription?.tier !== "local") {
      router.push("/pricing");
      return;
    }
    const newValue = !alertsOptedIn;
    setSaving(true);
    try {
      await settingsApi.updateAlerts(newValue);
      setAlertsOptedIn(newValue);
      setMessage(newValue ? "Alerts enabled!" : "Alerts disabled");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#c4592e]" />
      </div>
    );
  }

  const questionsWithOptions = QUIZ_QUESTIONS.filter((q) => q.options.length > 0);
  const tier = subscription?.tier || "free";

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your preferences and account</p>
      </div>

      {message && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 border border-green-100 flex items-center gap-2">
          <Check className="h-4 w-4" />
          {message}
        </div>
      )}

      {/* Taste Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-[#c4592e]" />
            Taste Preferences
          </CardTitle>
          <CardDescription>Update your event preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {questionsWithOptions.map((q) => {
            const isMulti = q.type === "multi";
            const values = (profile?.[q.id] as string[]) || [];
            return (
              <div key={q.id}>
                <Label className="text-base font-medium block mb-3">{q.question}</Label>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => {
                    const isSelected = isMulti
                      ? values.includes(opt.value)
                      : values[0] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() =>
                          isMulti
                            ? toggleOption(q.id, opt.value)
                            : setProfile({ ...profile, [q.id]: [opt.value] })
                        }
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          isSelected
                            ? "bg-[#c4592e] text-white border-[#c4592e]"
                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div>
            <Label className="text-base font-medium block mb-3">
              {QUIZ_QUESTIONS.find((q) => q.id === "vibe_description")?.question}
            </Label>
            <Textarea
              value={profile?.vibe_description || ""}
              onChange={(e) => setProfile({ ...profile, vibe_description: e.target.value })}
              placeholder="Describe your ideal Saturday night in Austin..."
              className="min-h-[100px]"
            />
          </div>

          <Button onClick={handleSaveProfile} disabled={saving} className="bg-[#c4592e] hover:bg-[#a84d26]">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-[#c4592e]" />
            Custom OpenAI Key
          </CardTitle>
          <CardDescription>
            Use your own API key for digest generation (optional)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiKeys.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {apiKeys.map((key) => (
                <Badge key={key.id} variant="secondary" className="flex items-center gap-2">
                  {key.service_name}: {key.masked_key}
                  <button onClick={() => handleDeleteApiKey(key.service_name)} className="hover:text-red-500">
                    &times;
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="sk-..."
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
            />
            <Button onClick={handleSaveApiKey} disabled={saving || !newApiKey.trim()}>
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Alerts (Local tier only) */}
      {tier === "local" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#c4592e]" />
              Real-time Alerts
            </CardTitle>
            <CardDescription>
              Get notified about last-minute pop-up events (within 48 hours)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Enable alerts</span>
              <Switch checked={alertsOptedIn} onCheckedChange={toggleAlerts} />
            </div>
          </CardContent>
        </Card>
      )}

      {tier !== "local" && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-4">
            <p className="text-amber-800">
              Real-time alerts are available on the Local plan.{" "}
              <button onClick={() => router.push("/pricing")} className="font-medium underline underline-offset-2">
                Upgrade
              </button>{" "}
              to enable this feature.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Subscription Info */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Your current plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-medium text-gray-900 capitalize">{tier}</p>
              <p className="text-sm text-gray-500">
                {subscription?.billing_interval || "No active subscription"}
              </p>
            </div>
            {tier !== "local" && (
              <Button variant="outline" onClick={() => router.push("/pricing")}>
                Upgrade
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

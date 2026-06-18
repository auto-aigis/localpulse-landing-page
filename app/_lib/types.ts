"use client";

export interface User {
  id: string;
  email: string;
  display_name?: string;
  is_email_verified: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  tier: "free" | "explorer" | "local";
  status: string;
  billing_interval?: "monthly" | "yearly";
  current_period_end?: string;
}

export interface TasteProfile {
  id: string;
  user_id: string;
  event_types: string[];
  social_comfort?: string;
  budget_range?: string;
  schedule_prefs: string[];
  neighborhood: string;
  vibe_description?: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  category: string;
  source_url: string;
  source_name: string;
  vibe_tags: string[];
}

export interface DigestEvent {
  id: string;
  event: Event;
  ai_vibe_description: string;
  rank_order: number;
}

export interface Digest {
  id: string;
  user_id: string;
  generated_at: string;
  events: DigestEvent[];
  tier_snapshot?: string;
  is_email_sent: boolean;
}

export interface DigestResponse {
  digest?: Digest;
  subscription_tier: string;
  can_upgrade: boolean;
}

export interface EventFeedback {
  id: string;
  user_id: string;
  event_id: string;
  rating: string;
  source: string;
  created_at: string;
}

export interface APIKey {
  id: string;
  service_name: string;
  masked_key: string;
  created_at: string;
}

export type QuizQuestion = {
  id: string;
  question: string;
  options: { value: string; label: string }[];
  type: "single" | "multi";
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "event_types",
    question: "What types of events are you into?",
    type: "multi",
    options: [
      { value: "music", label: "Live Music" },
      { value: "art", label: "Art & Galleries" },
      { value: "food", label: "Food & Drink" },
      { value: "outdoor", label: "Outdoor & Nature" },
      { value: "sports", label: "Sports & Fitness" },
      { value: "networking", label: "Networking & Tech" },
      { value: "theater", label: "Theater & Performance" },
      { value: "markets", label: "Markets & Shopping" },
    ],
  },
  {
    id: "social_comfort",
    question: "How do you prefer to experience events?",
    type: "single",
    options: [
      { value: "solo", label: "I like flying solo" },
      { value: "small_group", label: "Small groups (2-5 people)" },
      { value: "large_group", label: "Big crowds energize me" },
      { value: "any", label: "I'm flexible" },
    ],
  },
  {
    id: "budget_range",
    question: "What's your typical budget for an event?",
    type: "single",
    options: [
      { value: "free", label: "Free (count me in!)" },
      { value: "low", label: "$0–$15" },
      { value: "medium", label: "$15–$40" },
      { value: "high", label: "$40+ (treat myself!)" },
    ],
  },
  {
    id: "schedule_prefs",
    question: "When are you usually available?",
    type: "multi",
    options: [
      { value: "weekday_evenings", label: "Weekday evenings" },
      { value: "weekday_days", label: "Weekday daytime" },
      { value: "weekend_days", label: "Weekend daytime" },
      { value: "weekend_nights", label: "Weekend nights" },
      { value: "spontaneous", label: "Last-minute / spontaneous" },
    ],
  },
  {
    id: "neighborhood",
    question: "Which part of Austin do you prefer?",
    type: "single",
    options: [
      { value: "downtown", label: "Downtown" },
      { value: "east_austin", label: "East Austin" },
      { value: "south_congress", label: "South Congress" },
      { value: "hyde_park", label: "Hyde Park" },
      { value: "north_austin", label: "North Austin" },
      { value: "south_austin", label: "South Austin" },
      { value: "round_rock", label: "Round Rock / Georgetown" },
      { value: "any", label: "Anywhere in Austin!" },
    ],
  },
  {
    id: "vibe_description",
    question: "Describe your ideal Saturday night in Austin in 2 sentences.",
    type: "single",
    options: [],
  },
];

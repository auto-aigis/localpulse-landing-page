"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let msg = `API error: ${res.status}`;
    try {
      const err = await res.json();
      const d = err.detail;
      if (typeof d === "string") msg = d;
      else if (Array.isArray(d)) msg = d.map((e: any) => e.msg).join(", ");
      else if (err.message) msg = err.message;
      else if (err.error) msg = err.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const authApi = {
  register: (email: string, password: string, displayName?: string) =>
    apiFetch<{ status: string; email: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, display_name: displayName }),
    }),

  login: (email: string, password: string) =>
    apiFetch<{
      id: string;
      email: string;
      display_name?: string;
      is_email_verified: boolean;
      created_at: string;
    }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () => apiFetch<{ status: string }>("/api/auth/logout", { method: "POST" }),

  me: () =>
    apiFetch<{
      id: string;
      email: string;
      display_name?: string;
      is_email_verified: boolean;
      created_at: string;
    }>("/api/auth/me"),

  subscription: () =>
    apiFetch<{
      id: string;
      tier: string;
      status: string;
      billing_interval?: string;
      current_period_end?: string;
    }>("/api/auth/subscription"),

  verifyEmail: (token: string) =>
    apiFetch<{ status: string }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  resendVerification: (email: string) =>
    apiFetch<{ status: string }>("/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};

export const quizApi = {
  get: () =>
    apiFetch<{
      id: string;
      user_id: string;
      event_types: string[];
      social_comfort?: string;
      budget_range?: string;
      schedule_prefs: string[];
      neighborhood: string;
      vibe_description?: string;
      updated_at: string;
    }>("/api/quiz"),

  save: (data: {
    event_types?: string[];
    social_comfort?: string;
    budget_range?: string;
    schedule_prefs?: string[];
    neighborhood?: string;
    vibe_description?: string;
  }) =>
    apiFetch<{
      id: string;
      user_id: string;
      event_types: string[];
      social_comfort?: string;
      budget_range?: string;
      schedule_prefs: string[];
      neighborhood: string;
      vibe_description?: string;
      updated_at: string;
    }>("/api/quiz", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const digestApi = {
  getCurrent: () =>
    apiFetch<{
      digest?: {
        id: string;
        user_id: string;
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
            vibe_tags: string[];
          };
          ai_vibe_description: string;
          rank_order: number;
        }[];
        tier_snapshot?: string;
        is_email_sent: boolean;
      };
      subscription_tier: string;
      can_upgrade: boolean;
    }>("/api/digest/current"),

  getHistory: () =>
    apiFetch<
      {
        id: string;
        user_id: string;
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
            vibe_tags: string[];
          };
          ai_vibe_description: string;
          rank_order: number;
        }[];
        tier_snapshot?: string;
        is_email_sent: boolean;
      }[]
    >("/api/digest/history"),

  generate: () =>
    apiFetch<{
      id: string;
      user_id: string;
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
          vibe_tags: string[];
        };
        ai_vibe_description: string;
        rank_order: number;
      }[];
      tier_snapshot: string;
      is_email_sent: boolean;
    }>("/api/digest/generate", { method: "POST" }),
};

export const feedbackApi = {
  submit: (eventId: string, rating: string, digestId?: string, source = "web") =>
    apiFetch<{
      id: string;
      user_id: string;
      event_id: string;
      rating: string;
      source: string;
      created_at: string;
    }>("/api/feedback", {
      method: "POST",
      body: JSON.stringify({ event_id: eventId, digest_id: digestId, rating, source }),
    }),
};

export const settingsApi = {
  getKeys: () =>
    apiFetch<
      { id: string; service_name: string; masked_key: string; created_at: string }[]
    >("/api/settings/keys"),

  saveKey: (serviceName: string, apiKey: string) =>
    apiFetch<{ status: string; service: string }>("/api/settings/keys/" + serviceName, {
      method: "PUT",
      body: JSON.stringify({ service_name: serviceName, api_key: apiKey }),
    }),

  deleteKey: (serviceName: string) =>
    apiFetch<{ status: string }>("/api/settings/keys/" + serviceName, { method: "DELETE" }),

  updateAlerts: (optedIn: boolean) =>
    apiFetch<{ status: string; opted_in: boolean }>("/api/settings/alerts", {
      method: "PUT",
      body: JSON.stringify({ opted_in: optedIn }),
    }),
};

export const paymentsApi = {
  checkout: (tier: string, billingInterval: string) =>
    apiFetch<{ price_id: string; client_token: string }>("/api/payments/checkout", {
      method: "POST",
      body: JSON.stringify({ tier, billing_interval: billingInterval }),
    }),

  verifyTransaction: (transactionId: string) =>
    apiFetch<{ status: string; tier?: string }>("/api/payments/verify-transaction", {
      method: "POST",
      body: JSON.stringify({ transaction_id: transactionId }),
    }),

  getManageUrl: () => apiFetch<{ url: string }>("/api/subscription/manage"),
};

export const eventsApi = {
  list: (limit?: number, category?: string) => {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (category) params.append("category", category);
    const query = params.toString();
    return apiFetch<
      {
        id: string;
        title: string;
        description: string;
        event_date: string;
        location: string;
        category: string;
        source_url: string;
        source_name: string;
        vibe_tags: string[];
      }[]
    >("/api/events" + (query ? `?${query}` : ""));
  },

  aggregate: () =>
    apiFetch<{ status: string; total_events: number }>("/api/events/aggregate", {
      method: "POST",
    }),
};

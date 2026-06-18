"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

declare global {
  interface Window {
    Paddle?: typeof import("@paddle/paddle-js");
    PaddleCheckout?: any;
  }
}

export function PaddleProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token || initialized) return;

    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => {
      if (window.Paddle) {
        window.Paddle.Environment.set(process.env.NODE_ENV === "production" ? "production" : "sandbox");
        window.Paddle.Initialize({
          token,
          eventCallback: (event: Record<string, unknown>) => {
            const evt = event as { name?: string; data?: { transaction_id?: string } };
            if (evt.name === "checkout.completed") {
              const txnId = evt.data?.transaction_id || "";
              window.location.href = `/dashboard?checkout=success&transaction_id=${txnId}`;
            }
          },
        });
        setInitialized(true);
      }
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [initialized]);

  return <>{children}</>;
}

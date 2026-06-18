"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_components/AuthProvider";
import { Loader2, CheckCircle, XCircle, Mail } from "lucide-react";

function VerifyEmailContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (token) {
      const verify = async () => {
        try {
          await authApi.verifyEmail(token);
          await refresh();
          setStatus("success");
          setMessage("Email verified successfully!");
          setTimeout(() => router.push("/quiz"), 1500);
        } catch (err) {
          setStatus("error");
          setMessage(err instanceof Error ? err.message : "Verification failed");
        }
      };
      verify();
    } else if (email) {
      setStatus("loading");
      setMessage("Check your inbox for the verification link");
    } else {
      setStatus("error");
      setMessage("Invalid verification link");
    }
  }, [token, email, router, refresh]);

  const handleResend = async () => {
    if (!email) return;
    try {
      await authApi.resendVerification(email);
      alert("Verification email sent!");
    } catch {
      alert("Failed to resend. Please try again.");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#c4592e]" />
            <p className="mt-4 text-gray-600">{message || "Verifying your email..."}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <p className="mt-4 text-lg font-medium text-gray-900">{message}</p>
            <p className="mt-2 text-gray-600">Redirecting to quiz...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <CardTitle>Verification Failed</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {email && (
            <Button onClick={handleResend} variant="outline" className="w-full">
              Resend verification email
            </Button>
          )}
          <p className="text-center text-sm">
            <Link href="/login" className="text-[#c4592e] hover:underline">
              Back to Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-[#c4592e]" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

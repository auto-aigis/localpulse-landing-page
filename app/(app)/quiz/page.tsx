"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { quizApi, digestApi } from "@/app/_lib/api";
import { QUIZ_QUESTIONS } from "@/app/_lib/types";
import { Loader2, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const profile = await quizApi.get();
        if (profile.event_types?.length || profile.schedule_prefs?.length) {
          router.push("/dashboard");
        }
      } catch {}
    };
    loadQuiz();
  }, [router]);

  const question = QUIZ_QUESTIONS[step];
  const isMulti = question.type === "multi";
  const isVibe = question.id === "vibe_description";

  const handleSelect = (value: string) => {
    if (isMulti) {
      const current = (answers[question.id] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setAnswers({ ...answers, [question.id]: updated });
    } else {
      setAnswers({ ...answers, [question.id]: value });
    }
  };

  const handleNext = () => {
    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await quizApi.save(answers);
      await digestApi.generate();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save quiz");
    } finally {
      setLoading(false);
    }
  };

  const canProceed = isVibe
    ? (answers[question.id] as string)?.length > 0
    : isMulti
      ? ((answers[question.id] as string[]) || []).length > 0
      : !!answers[question.id];

  const progress = ((step + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#c4592e]/10">
          <Sparkles className="h-8 w-8 text-[#c4592e]" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Tell us your vibe</h1>
        <p className="mt-2 text-gray-600">Step {step + 1} of {QUIZ_QUESTIONS.length}</p>
      </div>

      <div className="mb-6 h-2 rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-[#c4592e] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
              {error}
            </div>
          )}

          {isVibe ? (
            <Textarea
              placeholder="Describe your ideal Saturday night in Austin..."
              value={(answers[question.id] as string) || ""}
              onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
              className="min-h-[120px]"
            />
          ) : question.options.length > 0 ? (
            <div className="space-y-3">
              {question.options.map((opt) => {
                const isSelected = isMulti
                  ? ((answers[question.id] as string[]) || []).includes(opt.value)
                  : answers[question.id] === opt.value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                      isSelected
                        ? "border-[#c4592e] bg-[#c4592e]/5"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {isMulti ? (
                      <Checkbox checked={isSelected} />
                    ) : (
                      <div
                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? "border-[#c4592e] bg-[#c4592e]" : "border-gray-300"
                        }`}
                      >
                        {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                    )}
                    <Label className="cursor-pointer font-normal">{opt.label}</Label>
                  </div>
                );
              })}
            </div>
          ) : null}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 0 || loading}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed || loading}
              className="bg-[#c4592e] hover:bg-[#a84d26]"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : step === QUIZ_QUESTIONS.length - 1 ? (
                "Generate My Digest"
              ) : (
                <>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

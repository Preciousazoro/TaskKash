"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  Star,
  MessageSquare,
  User,
  Mail,
  ShieldAlert,
  CheckCircle2,
  ThumbsUp,
  Flag,
  Eye,
} from "lucide-react";

// Navigation
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserHeader from "@/components/user-dashboard/UserHeader";

export default function FeedbackPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Auto-pull user info on mount
  useEffect(() => {
    async function loadUserData() {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        if (data.user) {
          setName(data.user.username || data.user.name || "");
          setEmail(data.user.email || "");
        }
      } catch (err) {
        console.error("Error pulling account details:", err);
      }
    }
    loadUserData();
  }, []);

  // Derived preview values
  const previewName = isAnonymous ? "Anonymous User" : name || "Your Name";
  const previewSubject = subject.trim() || "Your review subject will appear here...";
  const previewMessage =
    message.trim() ||
    "Your review description will appear here as you type...";
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please provide a star rating before submitting.");
      return;
    }
    if (!subject.trim()) {
      toast.error("Your feedback needs a subject line.");
      return;
    }
    if (!message.trim()) {
      toast.error("Please write a description about your experience.");
      return;
    }
    if (!termsAccepted) {
      toast.error("Please accept the terms declaration.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Sending your feedback...");

    try {
      const payload = {
        starRating: rating,
        subject,
        message,
        anonymous: isAnonymous,
      };

      const response = await fetch("/api/user-dashboard/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit feedback");
      }

      toast.update(toastId, {
        render: "Feedback submitted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      resetForm();
    } catch (error) {
      console.error("Submission error:", error);
      toast.update(toastId, {
        render: "Couldn't submit feedback. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setSubject("");
    setMessage("");
    setIsAnonymous(false);
    setTermsAccepted(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <UserSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <UserHeader />

        <div className="flex-1 flex flex-col overflow-y-auto">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 mb-20">
            <div className="max-w-7xl mx-auto space-y-10">

              {/* Page Title */}
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                  Share Your Feedback
                </h1>
                <p className="text-muted-foreground text-sm">
                  Your feedback helps us improve the platform. Tell us exactly what you think!
                </p>
              </div>

              {/* Two-column layout: Form + Live Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                {/* ── LEFT: Form ── */}
                <form onSubmit={handleSubmit}>
                  <div className="bg-card rounded-xl shadow-sm border border-border">
                    <div className="px-6 py-4 border-b border-border">
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        <span>Review Details</span>
                      </h3>
                    </div>

                    <div className="p-6 space-y-6">

                      {/* 1. Star Rating */}
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-foreground">
                          Star Rating
                        </label>
                        <div className="flex items-center gap-1.5 py-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className="p-1 focus:outline-none scale-100 hover:scale-110 transition-transform cursor-pointer"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                            >
                              <Star
                                className={`w-8 h-8 transition-colors duration-150 ${
                                  (hoverRating || rating) >= star
                                    ? "text-yellow-500"
                                    : "text-gray-400"
                                }`}
                                fill={
                                  (hoverRating || rating) >= star
                                    ? "currentColor"
                                    : "none"
                                }
                                stroke={
                                  (hoverRating || rating) >= star
                                    ? "currentColor"
                                    : "#9ca3af"
                                }
                              />
                            </button>
                          ))}
                          {rating > 0 && (
                            <span className="text-xs ml-2 font-semibold text-muted-foreground">
                              ({rating} out of 5)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 2. Subject */}
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-foreground">
                          Subject Line / Title
                        </label>
                        <input
                          type="text"
                          required
                          placeholder='e.g., "Great platform" or "UI needs improvement"'
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-input bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      {/* 3. Review Message */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="block text-sm font-bold text-foreground">
                            Review Message
                          </label>
                          <span className="text-xs text-muted-foreground">
                            {message.length} / 1000 chars
                          </span>
                        </div>
                        <textarea
                          required
                          maxLength={1000}
                          rows={5}
                          placeholder="Detail your experience, bugs encountered, or suggestions for missing features..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-input bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        />
                      </div>

                      {/* 4. Anonymous toggle */}
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/50">
                        <div className="space-y-0.5">
                          <label
                            className="text-sm font-bold text-foreground cursor-pointer"
                            htmlFor="anonymous-toggle"
                          >
                            Submit anonymously
                          </label>
                          <p className="text-xs text-muted-foreground">
                            Hides your account identification from public views.
                          </p>
                        </div>
                        <input
                          id="anonymous-toggle"
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="w-4 h-4 rounded cursor-pointer accent-primary"
                        />
                      </div>

                      {/* 5. Name & Email (when not anonymous) */}
                      {!isAnonymous && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div className="space-y-1.5 opacity-80">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                              <User className="w-3.5 h-3.5" /> Display Name
                            </span>
                            <input
                              type="text"
                              disabled
                              value={name || "Not Logged In"}
                              className="w-full px-3 py-3 text-sm rounded-lg bg-muted border border-input text-muted-foreground cursor-not-allowed"
                            />
                          </div>
                          <div className="space-y-1.5 opacity-80">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5" /> Connected Email
                            </span>
                            <input
                              type="email"
                              disabled
                              value={email || "No email detected"}
                              className="w-full px-3 py-3 text-sm rounded-lg bg-muted border border-input text-muted-foreground cursor-not-allowed"
                            />
                          </div>
                        </div>
                      )}

                      {/* 6. Terms Acceptance */}
                      <div className="flex items-start gap-3 pt-2">
                        <input
                          id="terms-check"
                          type="checkbox"
                          required
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded cursor-pointer accent-primary"
                        />
                        <label
                          htmlFor="terms-check"
                          className="text-sm text-muted-foreground cursor-pointer select-none"
                        >
                          I confirm this review represents an accurate description of my actual platform experience and remains respectful.
                        </label>
                      </div>
                    </div>

                    {/* Form Actions Footer */}
                    <div className="px-6 py-4 border-t border-border bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                        <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Submissions undergo review processing</span>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
                        <button
                          type="button"
                          onClick={resetForm}
                          className="px-5 py-3 rounded-lg text-sm font-medium bg-muted hover:bg-muted/80 text-muted-foreground transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-5 py-3 rounded-lg text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isSubmitting ? "Sending..." : "Submit Review"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                {/* ── RIGHT: Live Preview ── */}
                <div className="space-y-4 lg:sticky lg:top-6">

                  {/* Preview header label */}
                  <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    <Eye className="w-4 h-4" />
                    <span>Live Preview — How your review will appear</span>
                  </div>

                  {/* Preview card */}
                  <div className="bg-card rounded-xl p-6 shadow-sm border border-border transition-all flex flex-col justify-between space-y-4">
                    {/* Top Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-foreground">
                              {previewName}
                            </span>
                            {!isAnonymous && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-200/40">
                                <CheckCircle2 className="w-3 h-3" /> Verified
                                User
                              </span>
                            )}
                          </div>
                          {/* Star display */}
                          <div className="flex items-center gap-0.5 text-yellow-500 pt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < (hoverRating || rating)
                                    ? "fill-current"
                                    : "text-gray-300 dark:text-gray-700"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        {today}
                      </span>
                    </div>

                    {/* Content Body */}
                    <div className="space-y-1.5">
                      <h3
                        className={`text-base font-bold ${
                          subject.trim()
                            ? "text-foreground"
                            : "text-muted-foreground italic"
                        }`}
                      >
                        {previewSubject}
                      </h3>
                      <p
                        className={`text-sm leading-relaxed ${
                          message.trim()
                            ? "text-muted-foreground"
                            : "text-muted-foreground italic"
                        }`}
                      >
                        {previewMessage}
                      </p>
                    </div>

                    {/* Interactive Footer — non-functional in preview */}
                    <div className="pt-2 flex items-center justify-between border-t border-border text-xs font-semibold">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-muted-foreground">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Helpful</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-muted-foreground">
                        <Flag className="w-3.5 h-3.5" />
                        <span>Report</span>
                      </div>
                    </div>
                  </div>

                  {/* Preview hint note */}
                  <p className="text-xs text-muted-foreground text-center">
                    This preview updates in real time as you fill in the form.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

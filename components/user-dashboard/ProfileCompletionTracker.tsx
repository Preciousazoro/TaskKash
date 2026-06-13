"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

interface ProfileCompletionTrackerProps {
  userId?: string;
}

export default function ProfileCompletionTracker({
  userId,
}: ProfileCompletionTrackerProps) {
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletionData = async () => {
      try {
        const response = await fetch("/api/user/profile-completion");
        if (response.ok) {
          const data = await response.json();
          setCompletionPercentage(data.completionPercentage);
        }
      } catch (error) {
        console.error("Error fetching completion data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletionData();
  }, []);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-4 animate-pulse space-y-3">
        <div className="flex justify-between items-center w-full">
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-16" />
        </div>
        <div className="h-2.5 bg-muted rounded-full w-full" />
        <div className="h-3 bg-muted rounded w-1/2" />
      </div>
    );
  }

  const isComplete = completionPercentage === 100;

  return (
    <>
      <style jsx global>{`
        @property --border-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes spinBorder {
          to { --border-angle: 360deg; }
        }
        @keyframes progressShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .animated-border-wrap {
          padding: 2px;
          border-radius: 14px;
          animation: spinBorder 3s linear infinite;
          background: conic-gradient(
            from var(--border-angle),
            #f59e0b,
            #22c55e,
            #3b82f6,
            #a855f7,
            #f59e0b
          );
        }
        .progress-shimmer-effect {
          animation: progressShimmer 2s linear infinite;
        }
      `}</style>

      <div className="animated-border-wrap">
        <div
          className={`relative overflow-hidden rounded-xl p-2 px-4 transition-all bg-card ${
            isComplete
              ? "bg-green-500/[0.03]"
              : "bg-amber-500/[0.03]"
          }`}
        >

          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="hidden md:flex lg:flex">
                  {isComplete ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  )}
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  {isComplete
                    ? "Profile complete"
                    : "Complete your profile to withdraw"}
                </h3>
              </div>
              <span className="text-[11px] font-black text-green-500">
                {completionPercentage}%
              </span>
            </div>

            <div className="relative w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="relative h-full bg-green-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${completionPercentage}%` }}
              >
                {!isComplete && (
                  <div className="progress-shimmer-effect absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              {isComplete ? (
                <div className="flex items-center gap-1 text-xs font-semibold text-green-500">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Eligible for payouts</span>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Complete all required profile sections to unlock withdrawals.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
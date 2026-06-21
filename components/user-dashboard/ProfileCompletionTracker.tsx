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
    <div className="bg-card border border-border rounded-xl p-4 w-full">
      <div className="space-y-3">
        
        {/* Header Text & Percentage */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="hidden md:flex">
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

        {/* Clean Static Progress Bar */}
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        {/* Subtitle / Descriptive Status Text */}
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
  );
}
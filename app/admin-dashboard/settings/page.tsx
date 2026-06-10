"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";

export default function AdminSettingsPage() {
  const [isWithdrawalVisible, setIsWithdrawalVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithdrawalVisibility();
  }, []);

  const fetchWithdrawalVisibility = async () => {
    try {
      const response = await fetch("/api/admin/withdrawal-visibility");
      const data = await response.json();
      if (data.isVisible !== undefined) {
        setIsWithdrawalVisible(data.isVisible);
      }
    } catch (error) {
      console.error("Failed to fetch withdrawal visibility:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleChange = async (newValue: boolean) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/withdrawal-visibility", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isVisible: newValue }),
      });

      const data = await response.json();

      if (data.success) {
        setIsWithdrawalVisible(newValue);
        toast.success(
          newValue
            ? "Withdrawals unlocked - Users have been notified"
            : "Withdrawals locked - Users have been notified"
        );
      } else {
        toast.error(data.error || "Failed to update withdrawal visibility");
        // Revert the toggle if failed
        setIsWithdrawalVisible(!newValue);
      }
    } catch (error) {
      console.error("Failed to update withdrawal visibility:", error);
      toast.error("Failed to update withdrawal visibility");
      // Revert the toggle if failed
      setIsWithdrawalVisible(!newValue);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* ── Page Header ── */}
            <header>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none">
                Admin Settings
              </h1>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1">
                Configure core platform visibility and user options.
              </p>
            </header>

            {/* ── Main Settings Card ── */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between gap-6">
                
                {/* Write-up Copy */}
                <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase tracking-tight">
                    Withdrawal Visibility
                  </h3>
                  <p className="text-xs font-bold text-muted-foreground max-w-xl normal-case tracking-normal">
                    When you toggle this off, the withdrawal page will not be accessible to any user and when it's on it will be visible for users.
                  </p>
                </div>

                {/* Animated Green Toggle */}
                <label className="inline-flex items-center cursor-pointer relative shrink-0">
  <input
    type="checkbox"
    className="sr-only peer"
    checked={isWithdrawalVisible}
    onChange={(e) => handleToggleChange(e.target.checked)}
    disabled={isLoading || isSaving}
  />
  {/* Track */}
  <div className="w-12 h-6 bg-muted border border-border/40 rounded-full duration-200 ease-in-out peer-checked:bg-green-500/20 peer-checked:border-green-500/40" />
  {/* Knob — sibling of input, so peer-checked works */}
  <div className="absolute left-[4px] w-4 h-4 bg-muted-foreground rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-6 peer-checked:bg-green-400" />
</label>

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
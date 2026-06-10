"use client";

import React from "react";
import { Lock, ShieldAlert, Clock, HelpCircle, Info } from "lucide-react";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";

export default function WithdrawalLockedPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <UserSidebar />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <UserHeader />

        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full px-4 py-8 pb-25 md:px-8 md:py-10 flex items-start md:items-center justify-center">
            <div className="max-w-2xl w-full mx-auto space-y-6">

              {/* ─── Top Notice Badge ─── */}
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em]">
                  <ShieldAlert className="w-3 h-3" /> System Status: Temporary Freeze
                </span>
              </div>

              {/* ─── Main Lock Card ─── */}
              <div className="bg-card border-2 border-border/80 rounded-[1.5rem] p-6 md:p-12 shadow-xl relative overflow-hidden text-center space-y-8">
                {/* Glow backdrop */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/5 blur-[80px] pointer-events-none rounded-full" />

                {/* Lock Icon */}
                <div className="relative mx-auto w-20 h-20 flex items-center justify-center rounded-2xl bg-muted/40 border-2 border-border">
                  <Lock className="w-8 h-8 text-muted-foreground animate-pulse" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 rounded-full border-4 border-card" />
                </div>

                {/* Heading */}
                <div className="space-y-3">
                  <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none">
                    Withdrawals Temporarily Locked
                  </h1>
                  <p className="text-xs font-bold text-muted-foreground max-w-md mx-auto normal-case tracking-normal leading-relaxed">
                    Payout operations are currently locked by administration for scheduled protocol maintenance and secure ledger audit processing.
                  </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-muted/20 border border-border/60 rounded-xl p-4 text-left space-y-1">
                    <div className="flex items-center gap-2 text-amber-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-wider">Expected Return</span>
                    </div>
                    <p className="text-xs font-bold text-foreground">Unlocking Soon / Stay Tuned</p>
                  </div>

                  <div className="bg-muted/20 border border-border/60 rounded-xl p-4 text-left space-y-1">
                    <div className="flex items-center gap-2 text-primary">
                      <Info className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-wider">Your Funds Status</span>
                    </div>
                    <p className="text-xs font-bold text-green-400">100% Safe & Untouched</p>
                  </div>
                </div>

                {/* Footer Context */}
                <div className="pt-6 border-t border-border/50 flex gap-3 items-start text-left">
                  <HelpCircle className="hidden lg:block w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      What does this mean?
                    </h4>
                    <p className="text-[11px] font-medium text-muted-foreground/80 leading-relaxed">
                      To maintain absolute security on our platform, payouts are systematically paused during internal data handshakes and routine financial processing cycles. Your current Task Points (TP) balance remains entirely unaffected. Operations will resume automatically as soon as operations conclude.
                    </p>
                  </div>
                </div>
              </div>

              {/* ─── Footer Note ─── */}
              <p className="text-center text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60 pb-4">
                Need immediate assistance? Please contact platform support.
              </p>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
"use client";

import TaskKashHeader from "@/components/landing-page/TaskKashHeader";
import TaskKashFooter from "@/components/landing-page/TaskKashFooter";
import Hero from "@/components/landing-page/Hero";
import InstallApp from "@/components/landing-page/InstallApp";
import HowWeWork from "@/components/landing-page/HowWeWork";
import Payout from "@/components/landing-page/Payout";
import TaskCards from "@/components/landing-page/TaskCards";
import NumbersThatSpeaks from "@/components/landing-page/NumbersThatSpeaks";
import Campaign from "@/components/landing-page/Campaign";
import FAQ from "@/components/landing-page/FAQ";
import CookieConsent from "@/components/landing-page/CookieConsent";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
      <TaskKashHeader />
      <Hero />
      <HowWeWork />
      <InstallApp />
      <Payout />
      <TaskCards />
      {/* <NumbersThatSpeaks /> */}
      <Campaign />
      <FAQ />
      <CookieConsent />
      <TaskKashFooter />
    </main>
  );
}
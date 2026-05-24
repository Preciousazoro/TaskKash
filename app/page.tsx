"use client";

import TaskKashHeader from "@/components/landing-page/TaskKashHeader";
import TaskKashFooter from "@/components/landing-page/TaskKashFooter";
import Hero from "@/components/landing-page/Hero";
import InstallApp from "@/components/landing-page/InstallApp";
import HowWeWork from "@/components/landing-page/HowWeWork";
import Payout from "@/components/landing-page/Payout";
import Participation from "@/components/landing-page/Participation";
import Engagement from "@/components/landing-page/Engagement";
import NumbersThatSpeaks from "@/components/landing-page/NumbersThatSpeaks";
import FAQ from "@/components/landing-page/FAQ";
import LaunchCampaign from "@/components/landing-page/LaunchCampaign";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
      <TaskKashHeader />
      <Hero />
      <InstallApp />
      <HowWeWork />
      <Payout />
      <Participation />
      <Engagement />
      <NumbersThatSpeaks />
      <FAQ />
      <LaunchCampaign />
      <TaskKashFooter />
    </main>
  );
}
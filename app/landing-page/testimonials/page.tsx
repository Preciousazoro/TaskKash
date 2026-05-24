"use client";

import React from "react";
import TaskKashHeader from "@/components/landing-page/TaskKashHeader";
import TaskKashFooter from "@/components/landing-page/TaskKashFooter";
import Testimonials from "@/components/landing-page/Testimonials";
import NumbersThatSpeaks from "@/components/landing-page/NumbersThatSpeaks";


export default function TestimonialPage() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden flex flex-col">
      <TaskKashHeader />
      
      <Testimonials />
      <NumbersThatSpeaks />

      
      <TaskKashFooter />

      {/* Tailwind Animation Injections */}
      <style jsx global>{`
        @keyframes marquee-up {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        @keyframes marquee-down {
          from { transform: translateY(-50%); }
          to { transform: translateY(0); }
        }
        .animate-marquee-up {
          animation: marquee-up 30s linear infinite;
        }
        .animate-marquee-down {
          animation: marquee-down 30s linear infinite;
        }
      `}</style>
    </main>
  );
}
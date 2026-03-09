"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import TaskKashHeader from "@/components/ui/TaskKashHeader";
import TaskKashFooter from "@/components/ui/TaskKashFooter";

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden transition-colors duration-300">
      <TaskKashHeader />

      <main className="relative min-h-screen bg-background text-foreground overflow-hidden transition-colors duration-300">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-linear-to-r from-green-400/20 via-cyan-400/10 to-purple-500/20 blur-3xl dark:from-green-400/20 dark:via-cyan-400/10 dark:to-purple-500/20 light:from-green-600/10 light:via-cyan-600/5 light:to-purple-600/10" />
      </div>

      {/* Container */}
      <div className="relative mx-auto max-w-6xl px-6 py-24 space-y-28">
        {/* HERO */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="bg-linear-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              About
            </span>{" "}
            <span className="bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              TaskKash
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Where brands and users connect through meaningful engagement and real
            rewards.
          </p>
        </section>

        {/* VISION & MISSION */}
        <section className="grid gap-10 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-8 backdrop-blur">
            <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              At TaskKash, we envision a world where brands and users collaborate
              seamlessly. A platform where engagement feels natural, trust is
              built through transparency, and every interaction delivers real
              value.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 backdrop-blur">
            <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To bridge the gap between brands and users by providing innovative
              tools that foster trust, meaningful engagement, and mutual growth.
            </p>
          </div>
        </section>

        {/* WHY TASKKASH */}
        <section className="grid gap-12 md:grid-cols-2">
          {/* Brands */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              Why Brands Choose TaskKash
            </h2>
            <p className="text-muted-foreground">
              TaskKash gives brands a smarter way to connect with the right
              audience and drive measurable results.
            </p>

            <ul className="space-y-3 text-muted-foreground">
              <li>🎯 Targeted outreach to real users</li>
              <li>📊 Real-time analytics and insights</li>
              <li>🛠 Customizable, performance-driven campaigns</li>
            </ul>
          </div>

          {/* Users */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              Why Users Love TaskKash
            </h2>
            <p className="text-muted-foreground">
              TaskKash is more than a platform — it’s a community where effort is
              rewarded.
            </p>

            <ul className="space-y-3 text-muted-foreground">
              <li>🎁 Earn rewards for simple, engaging tasks</li>
              <li>🔓 Access exclusive offers and content</li>
              <li>🤝 Authentic interactions with real brands</li>
            </ul>
          </div>
        </section>

        {/* ROADMAP */}
        <section className="space-y-10">
          <h2 className="text-center text-3xl font-bold">
            TaskKash Roadmap
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Card */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h4 className="font-semibold mb-2">✅ Beta Testing</h4>
              <p className="text-muted-foreground text-sm">
                Extensive testing, user feedback, and feature refinement to
                improve the overall experience.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h4 className="font-semibold mb-2">✅ Website Launch</h4>
              <p className="text-muted-foreground text-sm">
                MVP released with core features, smooth UI, and early brand
                partnerships.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h4 className="font-semibold mb-2">🚀 By April 2026</h4>
              <p className="text-muted-foreground text-sm">
                Reach 500–1,000 active users and expand brand collaborations.
              </p>
            </div>
          </div>
        </section>

        {/* LONG TERM */}
        <section className="rounded-3xl border border-border bg-card p-10 text-center space-y-4">
          <h2 className="text-2xl font-semibold">Long-Term Vision</h2>
          <p className="mx-auto max-w-3xl text-muted-foreground">
            We are committed to continuous improvement, community building, and
            global expansion — creating a platform where brands and users grow
            together.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center">
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-green-400 to-purple-500 px-8 py-3 font-medium text-foreground transition hover:opacity-90"
          >
            Get Started with TaskKash <ArrowRight size={18} />
          </Link>
        </section>
      </div>
      </main>
      <TaskKashFooter />
      
      <style jsx>{`
        .gradient-text {
          background: linear-gradient(90deg, #00ff9d, #8a2be2);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}


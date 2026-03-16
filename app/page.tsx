"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  ClipboardList,
  Wallet,
} from "lucide-react";
import TaskKashHeader from "@/components/ui/TaskKashHeader";
import TaskKashFooter from "@/components/ui/TaskKashFooter";

const faqs = [
  {
    question: "How do I earn rewards?",
    answer:
      "Users can browse available tasks on TaskKash, complete the required actions, and submit proof of completion. Once verified, rewards are added to their account.",
  },
  {
    question: "What are Task Points?",
    answer:
      "Task Points (TP) are the platform reward units earned for completing tasks. Users can accumulate TP and convert them into SOL based on the platform’s conversion rules.",
  },
  {
    question: "How do brands measure engagement?",
    answer:
      "Brands get access to campaign analytics that show participation, engagement, completion activity, and conversion performance across tasks.",
  },
  {
    question: "Is reward conversion transparent?",
    answer:
      "Yes. TaskKash keeps the reward structure visible so users can understand how TP is earned and how conversion to SOL works.",
  },
];

const howItWorks = [
  {
    title: "Connect Wallet",
    description: "Link your wallet in seconds and access available tasks.",
    icon: Wallet,
  },
  {
    title: "Complete Tasks",
    description:
      "Finish micro-tasks and campaigns to earn Task Points (TP).",
    icon: Check,
  },
  {
    title: "Convert TP to SOL",
    description: "Convert your points into SOL and withdraw directly.",
    icon: ArrowRight,
  },
  {
    title: "Track Participation",
    description:
      "Monitor completed tasks and reward history in real time.",
    icon: ClipboardList,
  },
];

const userBenefits = [
  "Complete simple interactive tasks",
  "Earn TP through verified participation and convert it to SOL",
  "Discover new Web3 communities and emerging projects",
  "Turn your everyday online activity into real rewards",
];

const brandBenefits = [
  "Launch structured engagement campaigns",
  "Reward verified participation",
  "Increase retention rates",
  "Access measurable participation data",
];

const metrics = [
  { value: "120K+", label: "Users Onboarded" },
  { value: "2.5M+", label: "Tasks Completed" },
  { value: "15K+", label: "SOL Distributed" },
  { value: "350+", label: "Active Campaigns" },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden">
      <TaskKashHeader />

      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_32%),radial-gradient(circle_at_right,rgba(147,51,234,0.14),transparent_30%)]" />
        <div className="relative container mx-auto px-4 sm:px-6 pb-16 pt-24 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36">
          <div className="max-w-6xl mx-auto grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="mb-5 flex w-full items-center justify-center rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-400 sm:inline-flex sm:w-auto sm:justify-start">
              Turn actions into rewards
            </div>

            <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl md:text-5xl lg:text-6xl">
              Turn Everyday Actions into{" "}
              <span className="bg-linear-to-r from-emerald-500 to-purple-600 bg-clip-text text-transparent">
                On-Chain Rewards
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
              Complete structured tasks, earn Task Points (TP), and convert them
              to SOL.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-emerald-500 to-purple-600 px-5 py-3 text-base font-bold text-white shadow-xl shadow-emerald-500/20 transition hover:scale-[1.02] sm:px-6 sm:py-4"
              >
                Start Earning
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border-2 border-emerald-500 px-5 py-3 text-base font-bold text-emerald-600 dark:text-emerald-400 transition hover:bg-emerald-500 hover:text-white sm:px-6 sm:py-4"
              >
                Launch Campaign
              </Link>
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="rounded-[1.5rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-2xl shadow-slate-200/60 dark:shadow-slate-900/60 sm:rounded-[2rem] sm:p-6 md:p-8">
              <div className="grid gap-5">
                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-4 sm:p-5 md:p-6">
                  <div className="mb-3 h-2 w-24 rounded-full bg-slate-200 dark:bg-slate-700 sm:mb-4 sm:h-3 sm:w-32" />
                  <div className="mb-3 flex items-center justify-between rounded-xl bg-white dark:bg-slate-900 px-3 py-2 shadow-sm sm:mb-4 sm:px-4 sm:py-3 md:px-5 md:py-4">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                      Follow campaign page
                    </span>
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      Done
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white dark:bg-slate-900 px-3 py-2 shadow-sm sm:px-4 sm:py-3">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                      Submit proof
                    </span>
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      Verified
                    </span>
                  </div>
                </div>

                <div className="ml-auto w-full max-w-xs rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-linear-to-br from-white to-emerald-50 dark:from-slate-900 dark:to-emerald-900/20 p-4 shadow-lg sm:max-w-sm sm:p-6">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 sm:text-sm">Wallet Updated</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 sm:mt-2">You received</p>
                  <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400 sm:mt-2 sm:text-3xl">0.25 SOL</p>
                  <div className="mt-3 inline-flex rounded-full bg-linear-to-r from-emerald-500 to-purple-600 px-2 py-1 text-xs font-black text-white sm:mt-4 sm:px-3 sm:py-1">
                    Success
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      <section id="how" className="bg-white dark:bg-slate-950 container mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl lg:text-4xl">
              How TaskKash Works
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400 sm:text-lg">
              A simple path from participation to rewards.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
            {howItWorks.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-xl sm:rounded-3xl"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 sm:mb-5 sm:h-14 sm:w-14">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 sm:text-xl">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:mt-3">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="users"
        className="bg-slate-950 container mx-auto px-4 sm:px-6 py-16 text-white sm:py-20 lg:py-24"
      >
        <div className="max-w-6xl mx-auto grid w-full items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-black sm:text-3xl lg:text-4xl">
              For Users — Participation That Pays
            </h2>
            <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg sm:mt-5">
              Simple actions, transparent rewards. No trading skills required.
            </p>

            <ul className="mt-8 space-y-4">
              {userBenefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-slate-200">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-base sm:text-lg font-medium">{benefit}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/auth/signup"
              className="mt-8 inline-flex rounded-xl bg-linear-to-r from-emerald-500 to-purple-600 px-6 py-4 font-bold text-white shadow-xl shadow-emerald-500/20"
            >
              Start Earning Now
            </Link>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-slate-800 bg-slate-900 p-4 shadow-2xl lg:mt-0 sm:p-5 lg:rounded-[2rem]">
            <div className="rounded-[1.2rem] border border-slate-800 bg-white dark:bg-slate-800 p-4 text-slate-900 dark:text-slate-100 sm:rounded-[1.5rem] sm:p-5">
              <div className="rounded-xl bg-slate-900 dark:bg-slate-700 px-3 py-2 text-sm font-black text-white sm:px-4 sm:py-3">
                User Dashboard
              </div>

              <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-700 p-4">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 sm:text-sm">Available Tasks</p>
                  <p className="mt-1 text-2xl font-black sm:mt-2">12</p>
                </div>
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-700 p-4">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 sm:text-sm">TP Balance</p>
                  <p className="mt-1 text-2xl font-black text-purple-600 dark:text-purple-400 sm:mt-2">1,250</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 p-4">
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 sm:text-sm">Total SOL</p>
                  <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400 sm:mt-2">4.5</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 dark:bg-slate-700 p-3 sm:mt-5 sm:p-4">
                <p className="mb-3 text-sm font-black text-slate-900 dark:text-slate-100 sm:mb-4">Recent Rewards</p>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-white dark:bg-slate-800 px-4 py-3">
                    <span className="h-2 w-20 rounded-full bg-slate-200 dark:bg-slate-600 sm:h-3 sm:w-28" />
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-xs font-black text-emerald-700 dark:text-emerald-400">
                      +120 TP
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white dark:bg-slate-800 px-4 py-3">
                    <span className="h-2 w-16 rounded-full bg-slate-200 dark:bg-slate-600 sm:h-3 sm:w-24" />
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-xs font-black text-emerald-700 dark:text-emerald-400">
                      +0.15 SOL
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="brands" className="bg-white dark:bg-slate-950 container mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto grid w-full items-center gap-12 lg:grid-cols-2">
          <div className="order-2 mt-8 rounded-[1.5rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-xl lg:order-1 lg:mt-0 sm:p-5 lg:rounded-[2rem]">
            <div className="rounded-[1.2rem] bg-slate-50 dark:bg-slate-800 p-4 sm:rounded-[1.5rem] sm:p-5">
              <div className="rounded-xl bg-white dark:bg-slate-900 px-3 py-2 text-sm font-black text-slate-900 dark:text-slate-100 shadow-sm sm:px-4 sm:py-3">
                Brand Campaign Analytics
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-[1.2fr_1fr] sm:mt-6">
                <div className="flex items-end gap-2 rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-sm sm:gap-3 sm:p-5">
                  {[65, 52, 74, 45].map((h, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div
                        className={`w-6 rounded-t-md sm:w-8 ${
                          i === 2 ? "bg-emerald-500" : "bg-purple-500"
                        }`}
                        style={{ height: `${h * 1.5}px` }}
                      />
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {["Mon", "Tue", "Wed", "Thu"][i]}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-sm">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 sm:text-sm">Total Engagement</p>
                    <p className="mt-1 text-xl font-black text-slate-900 dark:text-slate-100 sm:mt-2 sm:text-2xl">25.3K</p>
                  </div>
                  <div className="rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-sm">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 sm:text-sm">Conversion Rate</p>
                    <p className="mt-1 text-xl font-black text-emerald-600 dark:text-emerald-400 sm:mt-2 sm:text-2xl">18.5%</p>
                  </div>
                  <div className="rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-sm">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 sm:text-sm">Active Users</p>
                    <p className="mt-1 text-xl font-black text-amber-500 dark:text-amber-400 sm:mt-2 sm:text-2xl">4.1K</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 sm:text-3xl lg:text-4xl">
              For Brands — Engagement That Converts
            </h2>
            <p className="mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-400 sm:text-lg sm:mt-5">
              Verify user participation and drive measurable growth with structured campaigns.
            </p>

            <ul className="mt-8 space-y-4">
              {brandBenefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-base sm:text-lg font-medium">{benefit}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className="mt-8 inline-flex rounded-xl bg-linear-to-r from-emerald-500 to-purple-600 px-6 py-4 font-bold text-white shadow-xl shadow-emerald-500/20"
            >
              Launch Campaign
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-linear-to-r from-emerald-500 to-purple-600 container mx-auto px-4 sm:px-6 py-16 text-white sm:py-20">
        <div className="max-w-6xl mx-auto grid w-full gap-6 text-center sm:grid-cols-2 sm:gap-8 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm sm:rounded-3xl sm:p-6">
              <h3 className="text-3xl font-black sm:text-4xl lg:text-5xl">{metric.value}</h3>
              <p className="mt-2 text-xs font-bold text-white/85 sm:text-sm sm:mt-2">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="bg-slate-50 dark:bg-slate-900 container mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="mb-10 text-center sm:mb-12">
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 sm:text-3xl lg:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm sm:rounded-2xl"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex max-w-full items-center justify-between px-4 py-4 text-left sm:px-6 sm:py-5"
                  >
                    <span
                      className={`text-sm font-black sm:text-lg ${
                        isOpen ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-slate-100"
                      }`}
                    >
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-500 dark:text-slate-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-slate-600 dark:text-slate-400 sm:px-6 sm:pb-6">
                      <p className="text-sm sm:text-base">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-950 container mx-auto px-4 sm:px-6 py-16 text-white sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.18),rgba(147,51,234,0.16))]" />
        <div className="relative max-w-6xl mx-auto w-full text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Ready to Earn or Launch a Campaign?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg sm:mt-5">
            Join thousands of users earning rewards or brands driving real growth.
            Get started today.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:mt-8 sm:flex-row sm:gap-4">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-emerald-500 to-purple-600 px-5 py-3 text-base font-bold text-white shadow-xl shadow-emerald-500/20 sm:px-6 sm:py-4"
            >
              Get Started
            </Link>
            <a
              href="/about"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/30 px-5 py-3 text-base font-bold text-white hover:bg-white hover:text-slate-900 sm:px-6 sm:py-4"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      <TaskKashFooter />
    </main>
  );
}
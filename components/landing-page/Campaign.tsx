"use client";

import React, { useEffect, useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  FileText,
  ShieldCheck,
  Rocket,
  BadgeCheck,
  Zap,
} from "lucide-react";

const STEPS = [
  {
    icon: FileText,
    title: "Submit Your Request",
    desc: "Tell us about your project, target audience and campaign goals.",
  },
  {
    icon: ShieldCheck,
    title: "We Tailor a Verified Path",
    desc: "Our team reviews your details and builds a verified task structure for your project.",
  },
];

const inputClass =
  "w-full pl-10 pr-4 py-3 bg-background/60 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 transition-all duration-200 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20";

const labelClass =
  "text-[11px] font-semibold uppercase tracking-widest text-muted-foreground";

export default function BookCampaign() {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit booking request");
      }

      setSubmitStatus("success");
      setFormData({ companyName: "", email: "", phone: "", message: "" });
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const reveal = (delay = 0): React.CSSProperties => ({
    opacity: ready ? 1 : 0,
    transform: ready ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  return (
    <section
      id="book-campaign"
      className="relative w-full overflow-hidden bg-background via-background to-muted/30 py-10 md:py-15"
    >
      {/* Background texture + glows */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 35%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 35%, transparent 75%)",
        }}
      />
      <div className="pointer-events-none absolute -left-40 top-20 z-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-10 z-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-[130px]" />

      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-4 md:px-8 xl:px-8">
        {/* ───────── HEADER ───────── */}
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16" style={reveal(0)}>

          <h2 className="mb-3 text-3xl font-black uppercase tracking-tight text-foreground md:text-4xl xl:text-4xl">
            Book a{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Campaign
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-muted-foreground md:text-lg">
            Fill out the details below, and our team will tailor a verified path
            for your project.
          </p>
        </div>

        {/* ───────── TWO-COLUMN LAYOUT ───────── */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-10">
          {/* LEFT: Visual + steps */}
          <div className="order-1 space-y-8 lg:order-1 lg:col-span-5" style={reveal(0.15)}>
            {/* Image card with floating stat chips */}
            <div className="group relative h-[280px] overflow-hidden rounded-3xl border border-border shadow-xl sm:h-[340px] lg:h-[380px]">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url("https://i.postimg.cc/zXCTWLcc/Whats-App-Image-2026-06-21-at-5-43-10-PM.jpg")`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

              {/* Floating chips */}
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
                100% Verified Proof
              </div>
              <div className="absolute right-4 top-14 flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-100 backdrop-blur-md">
                <Zap className="h-3.5 w-3.5 text-emerald-300" />
                Instant SOL Payouts
              </div>

              {/* Bottom caption */}
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-6">
                <div>
                  <p className="text-3xl font-black leading-none text-white">250+</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-white/70">
                    Active Campaigns
                  </p>
                </div>
                <div className="h-10 w-px bg-white/25" />
                <div>
                  <p className="text-sm font-extrabold uppercase leading-tight text-white">
                    Scale Rise
                  </p>
                  <p className="mt-1 text-xs text-white/70">New Opportunities</p>
                </div>
              </div>
            </div>

            {/* Steps timeline */}
            <div className="relative space-y-6 pl-1">
              <div className="absolute bottom-6 left-[23px] top-6 w-px bg-gradient-to-b from-emerald-500/50 via-border to-transparent" />
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.title} className="relative flex items-start gap-4">
                    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-500">
                      <Icon className="h-5 w-5" />
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white">
                        {i + 1}
                      </span>
                    </div>
                    <div className="pt-0.5">
                      <h3 className="text-sm font-extrabold uppercase tracking-wide text-foreground">
                        {s.title}
                      </h3>
                      <p className="mt-1 text-sm font-medium leading-relaxed text-muted-foreground">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Form card */}
          <div className="order-2 lg:order-2 lg:col-span-7" style={reveal(0.3)}>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card/80 backdrop-blur-sm">
              {/* Top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500" />

              <div className="p-6 sm:p-10">
                {submitStatus === "success" ? (
                  /* ── SUCCESS PANEL ── */
                  <div className="flex min-h-[460px] flex-col items-center justify-center text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                      <CheckCircle className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h3 className="mb-2 text-2xl font-black uppercase tracking-tight text-foreground">
                      Booking Submitted Successfully!
                    </h3>
                    <p className="mb-8 max-w-sm text-sm text-muted-foreground">
                      Our team will review your request and get back to you soon.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitStatus("idle")}
                      className="rounded-full border border-border bg-background/60 px-6 py-3 text-xs font-bold uppercase tracking-widest text-foreground transition-all hover:border-emerald-500/40 hover:bg-emerald-500/5"
                    >
                      Send Another Request
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h3 className="text-xl font-black uppercase tracking-tight text-foreground">
                        Project Request
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Fields marked <span className="text-emerald-500">*</span> are required.
                      </p>
                    </div>

                    {/* Error Message */}
                    {submitStatus === "error" && (
                      <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                        <div>
                          <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                            Submission Failed
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">{errorMessage}</p>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Company + Email side by side */}
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <label htmlFor="companyName" className={labelClass}>
                            Company Name <span className="text-emerald-500">*</span>
                          </label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                            <input
                              id="companyName"
                              type="text"
                              name="companyName"
                              placeholder="e.g. Acme Corp"
                              required
                              value={formData.companyName}
                              onChange={(e) =>
                                setFormData({ ...formData, companyName: e.target.value })
                              }
                              className={inputClass}
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="email" className={labelClass}>
                            Email Address <span className="text-emerald-500">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                            <input
                              id="email"
                              type="email"
                              name="email"
                              placeholder="you@example.com"
                              required
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                              }
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label htmlFor="phone" className={labelClass}>
                          Phone Number{" "}
                          <span className="text-muted-foreground/50">(optional)</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                          <input
                            id="phone"
                            type="tel"
                            name="phone"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                            className={inputClass}
                          />
                        </div>
                      </div>

                      {/* Message */}
                      <div className="space-y-1.5">
                        <label htmlFor="message" className={labelClass}>
                          Project Details <span className="text-emerald-500">*</span>
                        </label>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/70" />
                          <textarea
                            id="message"
                            name="message"
                            placeholder="Tell us about your project, target audience, and campaign goals..."
                            required
                            rows={5}
                            value={formData.message}
                            onChange={(e) =>
                              setFormData({ ...formData, message: e.target.value })
                            }
                            className={`${inputClass} resize-none`}
                          />
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 py-4 text-xs font-extrabold uppercase tracking-widest text-white shadow-[0_10px_30px_-8px_rgba(16,185,129,0.6)] transition-all duration-200 hover:scale-[1.02] hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-emerald-500"
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="h-3.5 w-3.5 animate-spin"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Request
                            <Send className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                          </>
                        )}
                      </button>

                      <p className="flex items-center justify-center gap-2 pt-1 text-center text-[11px] font-medium text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                        Your details are only used to review your campaign request.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
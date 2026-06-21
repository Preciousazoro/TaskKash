"use client";

import React, { useState } from "react";
import { Building2, Mail, Phone, MessageSquare, Send, CheckCircle, AlertCircle } from "lucide-react";

export default function BookCampaign() {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit booking request');
      }

      setSubmitStatus('success');
      setFormData({ companyName: "", email: "", phone: "", message: "" });
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="book-campaign"
      className="mx-auto max-w-[1400px] px-4 lg:px-8 py-10 lg:pt-30 w-full"
    >
      {/* Main Container leveraging a 12-column system to skew width priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-border bg-card overflow-hidden shadow-sm min-h-[650px]">
        
        {/* Left Side: Visual Pane (Narrower: 5/12 columns) */}
        <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-end p-8 bg-gradient-to-t from-black/80 via-black/30 to-transparent overflow-hidden group">
          {/* Background Image */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url("https://i.postimg.cc/zXCTWLcc/Whats-App-Image-2026-06-21-at-5-43-10-PM.jpg")`
            }}
          />

          <div className="absolute inset-0 z-[1] bg-emerald-950/10 mix-blend-multiply" />

          {/* Text Container with a stylized darker blurred background overlay */}
          <div className="relative z-10 w-full rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 p-6 shadow-2xl">
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-3 text-white">
              Launch Your Next Campaign
            </h3>
            <p className="text-zinc-200 text-sm leading-relaxed font-light">
              Connect directly with verified micro-task participants, scale your ecosystem 
              visibility, and distribute rewards efficiently in SOL.
            </p>
          </div>
        </div>

        {/* Right Side: Form Pane (Wider: 7/12 columns) */}
        <div className="flex flex-col justify-center lg:col-span-7 p-5 py-8 sm:p-12 lg:p-10 bg-card relative">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-medium uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Grow
              </span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground mb-2">
              Book a Campaign
            </h2>
            <p className="text-sm text-muted-foreground font-light">
              Fill out the details below, and our team will tailor a verified path for your project.
            </p>
          </div>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  Booking Submitted Successfully!
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Our team will review your request and get back to you soon.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                  Submission Failed
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          {/* Form Implementation */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Company Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Company Name <span className="text-emerald-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                <input
                  type="text"
                  name="companyName"
                  placeholder="e.g. Acme Corp"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 text-foreground"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Email Address <span className="text-emerald-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 text-foreground"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Phone Number <span className="text-muted-foreground/50">(optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 text-foreground"
                />
              </div>
            </div>

            {/* Message Area */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Project Details <span className="text-emerald-500">*</span>
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/70" />
                <textarea
                  name="message"
                  placeholder="Tell us about your project, target audience, and campaign goals..."
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 text-foreground resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all duration-200 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-500 dark:disabled:hover:bg-emerald-600"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  Send Request
                  <Send className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
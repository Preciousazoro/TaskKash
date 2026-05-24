// app/contact/page.tsx
"use client";

import { useState } from "react";
import { Montserrat, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { toast } from 'react-toastify';
import { 
  Mail, 
  Twitter, 
  Calendar, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  X
} from "lucide-react";

import TaskKashHeader from "@/components/landing-page/TaskKashHeader";
import TaskKashFooter from "@/components/landing-page/TaskKashFooter";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["700", "800", "900"]
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
});

export default function ContactPage() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    subscribedToUpdates: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }

      toast.success('Message sent successfully!');
      setIsSubmitted(true);
      
      setFormData({
        name: '', email: '', subject: '', message: '', subscribedToUpdates: false
      });
      
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Strategy session request received!');
    setIsBookingModalOpen(false);
  };

  const resetForm = () => {
    setIsSubmitted(false);
  };

  return (
    <div className={`${spaceGrotesk.className} bg-background text-foreground min-h-screen transition-colors duration-300 selection:bg-emerald-500 selection:text-white relative overflow-x-hidden`}>
      <TaskKashHeader />

      {/* Background glow templates */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/4 -z-10 w-full max-w-7xl h-[600px]"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(16,185,129,0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 20% 40%, rgba(139,92,246,0.06) 0%, transparent 70%)",
        }}
      />

      <main className="container mx-auto px-6 py-32 md:py-40">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-20 text-center md:text-left">
            <div className={`${jetbrainsMono.className} inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-purple-500 dark:text-purple-400 mb-4 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5`}>
              Connect with us
            </div>
            <h1 className={`${montserrat.className} text-5xl md:text-7xl font-black uppercase tracking-tight leading-none mb-6`}>
              Get In <span className="bg-gradient-to-r from-emerald-500 to-purple-500 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
              Have a question about the Solana ecosystem or want to launch a campaign? Our protocol growth team is ready to scale with you.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Info Cards */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Brands Card */}
              <div className="group p-8 rounded-[1.5rem] border border-emerald-500/20 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01] hover:bg-gradient-to-br hover:from-emerald-600 hover:to-emerald-500 hover:border-transparent hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)] transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3.5 bg-card border border-emerald-500/10 text-emerald-500 rounded-2xl group-hover:bg-white group-hover:text-emerald-600 transition-colors">
                    <Calendar size={22} />
                  </div>
                  <h2 className={`${montserrat.className} text-2xl font-black uppercase tracking-tight group-hover:text-white`}>For Brands</h2>
                </div>
                <p className="text-muted-foreground group-hover:text-emerald-50 mb-8 font-medium text-sm md:text-base leading-relaxed">
                  Discuss project user-acquisition goals, custom proof-of-work tasks, and how to instantly distribute automated milestones directly to verified on-chain users.
                </p>
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="flex items-center gap-2 font-black uppercase tracking-wider text-xs md:text-sm text-emerald-500 dark:text-emerald-400 group-hover:text-white transition-colors"
                >
                  Book a Strategy Session <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Support Links */}
              <div className="p-8 rounded-[1.5rem] bg-card border border-emerald-500/10 dark:border-purple-500/10">
                <h3 className={`${montserrat.className} text-lg font-black uppercase mb-6 tracking-tight text-foreground`}>Direct Channels</h3>
                <div className="space-y-6">
                  <a href="mailto:info@taskkash.xyz" className="flex items-center gap-4 group">
                    <span className="shrink-0 w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/10 group-hover:scale-105 transition-transform">
                      <Mail size={18} />
                    </span>
                    <div>
                      <div className={`${jetbrainsMono.className} text-[10px] font-black uppercase tracking-widest text-muted-foreground/60`}>Email Us</div>
                      <div className="font-bold group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors tracking-tight text-foreground">info@taskkash.xyz</div>
                    </div>
                  </a>
                  <a href="https://x.com/TaskKash" target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                    <span className="shrink-0 w-11 h-11 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/10 group-hover:scale-105 transition-transform">
                      <Twitter size={18} />
                    </span>
                    <div>
                      <div className={`${jetbrainsMono.className} text-[10px] font-black uppercase tracking-widest text-muted-foreground/60`}>Twitter / X</div>
                      <div className="font-bold group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors tracking-tight text-foreground">@TaskKash</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="relative p-8 md:p-12 rounded-[1.5rem] border border-emerald-500/10 dark:border-purple-500/10 bg-card/40 shadow-xl shadow-emerald-500/[0.01]">
                {isSubmitted ? (
                  <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className={`${montserrat.className} text-3xl font-black uppercase mb-4`}>Message Sent!</h3>
                    <p className="text-muted-foreground font-medium mb-8">
                      We've received your inquiry. An ecosystem coordinator will review and reach out within 24 hours.
                    </p>
                    <button
                      onClick={resetForm}
                      className="px-8 py-4 bg-foreground text-background font-black uppercase tracking-widest text-xs rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className={`${jetbrainsMono.className} text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground`}>Your Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="John Doe"
                          className="w-full bg-transparent border-b border-emerald-500/10 dark:border-purple-500/10 focus:border-emerald-500 outline-none py-3 font-bold text-foreground transition-colors placeholder:text-muted-foreground/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className={`${jetbrainsMono.className} text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground`}>Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="john@solana.com"
                          className="w-full bg-transparent border-b border-emerald-500/10 dark:border-purple-500/10 focus:border-emerald-500 outline-none py-3 font-bold text-foreground transition-colors placeholder:text-muted-foreground/30"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={`${jetbrainsMono.className} text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground`}>Subject / Intent</label>
                      <div className="relative">
                        <select 
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="w-full bg-transparent border-b border-emerald-500/10 dark:border-purple-500/10 focus:border-emerald-500 outline-none py-3 font-bold text-foreground transition-colors appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-card dark:bg-slate-900">Select Purpose</option>
                          <option value="brand" className="bg-card dark:bg-slate-900">Brand Collaboration</option>
                          <option value="partnership" className="bg-card dark:bg-slate-900">Partnership Development</option>
                          <option value="support" className="bg-card dark:bg-slate-900">Technical Support</option>
                          <option value="other" className="bg-card dark:bg-slate-900">Other Inquiries</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground/50">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={`${jetbrainsMono.className} text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground`}>Your Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        placeholder="Tell us about your campaign goals or request parameters..."
                        className="w-full bg-transparent border-b border-emerald-500/10 dark:border-purple-500/10 focus:border-emerald-500 outline-none py-3 font-bold text-foreground transition-colors resize-none placeholder:text-muted-foreground/30"
                      />
                    </div>

                    <div className="flex items-start gap-3 pt-4">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          id="newsletter"
                          name="subscribedToUpdates"
                          checked={formData.subscribedToUpdates}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-emerald-500 focus:ring-emerald-500/30 border-emerald-500/20 rounded accent-emerald-500 cursor-pointer"
                        />
                      </div>
                      <label htmlFor="newsletter" className="text-xs font-bold text-muted-foreground uppercase tracking-tight cursor-pointer select-none">
                        Keep me updated on TaskKash platform features and ecosystem milestones
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full group relative flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black uppercase tracking-widest text-xs md:text-sm rounded-xl transition-all overflow-hidden disabled:opacity-50 shadow-lg shadow-emerald-500/10"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          Send Message <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── BRAND BOOKING STRATEGY MODAL ────────────────────────────────────── */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-card border border-emerald-500/20 rounded-[1.5rem] p-8 md:p-10 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 text-foreground">
            {/* Close Button */}
            <button 
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="space-y-2">
              <div className={`${jetbrainsMono.className} text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500`}>
                Campaign Acceleration
              </div>
              <h3 className={`${montserrat.className} text-2xl font-black uppercase tracking-tight`}>
                Request Strategy Call
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Provide your workspace domain to coordinate directly with one of our core smart-contract integration specialists.
              </p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className={`${jetbrainsMono.className} text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground`}>Corporate Website</label>
                <input 
                  type="text" 
                  placeholder="https://yourbrand.io" 
                  required
                  className="w-full bg-background border border-emerald-500/10 rounded-xl px-4 py-3.5 text-sm font-semibold outline-none focus:border-emerald-500 transition-colors placeholder:text-muted-foreground/30"
                />
              </div>
              <div className="space-y-1">
                <label className={`${jetbrainsMono.className} text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground`}>Target Active Budget (USD)</label>
                <input 
                  type="text" 
                  placeholder="e.g. $5,000 / month" 
                  required
                  className="w-full bg-background border border-emerald-500/10 rounded-xl px-4 py-3.5 text-sm font-semibold outline-none focus:border-emerald-500 transition-colors placeholder:text-muted-foreground/30"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-black uppercase tracking-wider text-xs rounded-xl transition-all shadow-lg shadow-purple-500/10"
              >
                Submit Consultation Request
              </button>
            </form>
          </div>
        </div>
      )}

      <TaskKashFooter />
    </div>
  );
}
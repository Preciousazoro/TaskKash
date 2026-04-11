"use client";

import { useState } from "react";
import { Montserrat } from "next/font/google";
import { toast } from 'react-toastify';
import { 
  Mail, 
  Twitter, 
  Calendar, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Users 
} from "lucide-react";

import BookingModal from "@/components/booking/BookingModal";
import TaskKashHeader from "@/components/ui/TaskKashHeader";
import TaskKashFooter from "@/components/ui/TaskKashFooter";

const montserrat = Montserrat({ subsets: ["latin"] });

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

  const resetForm = () => {
    setIsSubmitted(false);
  };

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen selection:bg-emerald-500 selection:text-white">
      <TaskKashHeader />

      <main className="container mx-auto px-6 py-24">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-20 text-center md:text-left">
            <h1 className={`${montserrat.className} text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6`}>
              Get In <span className="text-emerald-500">Touch</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
              Have a question about the Solana ecosystem or want to launch a campaign? Our team is ready to scale with you.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-16">
            
            {/* Left Column: Info Cards */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Brands Card */}
              <div className="group p-8 rounded-3xl border-2 border-slate-900 dark:border-white bg-transparent hover:bg-emerald-500 hover:border-emerald-500 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl group-hover:bg-white group-hover:text-emerald-500 transition-colors">
                    <Calendar size={24} />
                  </div>
                  <h2 className={`${montserrat.className} text-2xl font-black uppercase group-hover:text-white`}>For Brands</h2>
                </div>
                <p className="text-slate-500 dark:text-slate-400 group-hover:text-emerald-50 mb-6 font-medium leading-relaxed">
                  Discuss project goals, custom tasks, and how to reach verified on-chain users.
                </p>
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="flex items-center gap-2 font-black uppercase tracking-widest text-sm group-hover:text-white"
                >
                  Book a Session <ArrowRight size={16} />
                </button>
              </div>

              {/* Support Links */}
              <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border-2 border-transparent">
                <h3 className={`${montserrat.className} text-xl font-black uppercase mb-6 tracking-tight`}>Direct Channels</h3>
                <div className="space-y-6">
                  <a href="mailto:info@taskkash.xyz" className="flex items-center gap-4 group">
                    <Mail className="text-emerald-500" size={20} />
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Us</div>
                      <div className="font-bold group-hover:text-emerald-500 transition-colors tracking-tight">info@taskkash.xyz</div>
                    </div>
                  </a>
                  <a href="https://x.com/TaskKash" target="_blank" className="flex items-center gap-4 group">
                    <Twitter className="text-emerald-500" size={20} />
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Twitter / X</div>
                      <div className="font-bold group-hover:text-emerald-500 transition-colors tracking-tight">@TaskKash</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="relative p-8 md:p-12 rounded-3xl border-2 border-slate-900 dark:border-white">
                {isSubmitted ? (
                  <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className={`${montserrat.className} text-3xl font-black uppercase mb-4`}>Message Sent!</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                      We've received your inquiry. A team member will reach out within 24 hours.
                    </p>
                    <button
                      onClick={resetForm}
                      className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest text-sm hover:opacity-90 transition-opacity"
                    >
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Your Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="John Doe"
                          className="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-800 focus:border-emerald-500 outline-none py-3 font-bold transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="john@solana.com"
                          className="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-800 focus:border-emerald-500 outline-none py-3 font-bold transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Subject</label>
                      <select 
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-800 focus:border-emerald-500 outline-none py-3 font-bold transition-colors appearance-none cursor-pointer"
                      >
                        <option value="" className="dark:bg-slate-900">Select Purpose</option>
                        <option value="brand" className="dark:bg-slate-900">Brand Collaboration</option>
                        <option value="partnership" className="dark:bg-slate-900">Partnership</option>
                        <option value="support" className="dark:bg-slate-900">Technical Support</option>
                        <option value="other" className="dark:bg-slate-900">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Your Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        placeholder="Tell us about your project..."
                        className="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-800 focus:border-emerald-500 outline-none py-3 font-bold transition-colors resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <input
                        type="checkbox"
                        id="newsletter"
                        name="subscribedToUpdates"
                        checked={formData.subscribedToUpdates}
                        onChange={handleInputChange}
                        className="w-5 h-5 accent-emerald-500 rounded border-slate-300"
                      />
                      <label htmlFor="newsletter" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                        Keep me updated on TaskKash ecosystem milestones
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full group relative flex items-center justify-center gap-3 px-8 py-5 bg-emerald-500 text-white font-black uppercase tracking-[0.2em] text-sm hover:bg-emerald-600 transition-all overflow-hidden disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          Send Message <Send size={18} className="group-hover:translate-x-1 transition-transform" />
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

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
      <TaskKashFooter />
    </div>
  );
}

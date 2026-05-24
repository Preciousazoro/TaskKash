"use client";

import { useEffect, useState } from "react";
import { Download, ArrowRight, Rocket } from "lucide-react";
import Link from "next/link";

export default function InstallAppSection() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isReadyToInstall, setIsReadyToInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsReadyToInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }
    // We've used the prompt, and can't use it again
    setDeferredPrompt(null);
    setIsReadyToInstall(false);
  };

  return (
    <section className="mx-auto max-w-[1400px] px-4 lg:px-8 pb-30 w-full">
      <div className="relative overflow-hidden rounded-[1.5rem] bg-primary px-6 py-10 md:px-12 md:py-10">
        
        {/* Background Image / Mockup */}
        <img 
          src="/app-view.png" 
          alt="App View Interface" 
          className="absolute bottom-0 right-0 w-[250px] md:w-[350px] h-auto object-contain opacity-60 md:opacity-100 pointer-events-none translate-x-10 translate-y-10 lg:translate-x-0 lg:translate-y-5"
        />


        <div className="relative z-10 max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/10 border border-white/20 text-[10px] font-bold uppercase tracking-[.2em] mb-4 text-primary-foreground">
            <Rocket className="w-3 h-3" />
            Grow with TaskKash
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4 text-primary-foreground">
            Launch a Campaign?
          </h2>
          
          <p className="text-primary-foreground/90 text-base font-semibold md:text-base max-w-md mb-8 leading-relaxed">
            AJoin thousands of users earning rewards or brands driving real
          growth. Get started today and experience the future of Web3 engagement.
          </p>

<Link href="/auth/signup">
          <button 
            className="w-full lg:w-auto justify-center items-center bg-white text-primary cursor-pointer dark:bg-black dark:text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex gap-3 shadow-lg hover:scale-105 active:scale-95"
          > Get Started Now
            <ArrowRight className="w-4 h-4" />
          </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
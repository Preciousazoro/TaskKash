"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="
        fixed bottom-8 right-6 z-[60]      
        bg-linear-to-r from-emerald-500 to-purple-600 
        text-white
        w-12 h-12 rounded-xl
        flex items-center justify-center
        shadow-[0_0_20px_rgba(16,185,129,0.3)]
        hover:scale-110 hover:-translate-y-1 active:scale-95
        transition-all duration-300 cursor-pointer
        group
      "
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-6 h-6 group-hover:animate-bounce" />
    </button>
  );
}

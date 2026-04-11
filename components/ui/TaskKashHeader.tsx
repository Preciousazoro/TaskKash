"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

export default function TaskKashHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect for header background
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 shadow-md backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-17">
            
            {/* LEFT: LOGO */}
            <Link
              href="/"
              className="flex items-center gap-3 bg-linear-to-r from-emerald-500 via-green-500 to-purple-600 bg-clip-text text-xl md:text-2xl font-extrabold text-transparent"
            >
              <img
                src="/taskkash-logo.png"
                alt="TaskKash Logo"
                className="h-8 w-8 object-contain"
              />
              TaskKash
            </Link>

            {/* MIDDLE: NAV LINKS (Desktop) */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 bg-slate-100/50 dark:bg-slate-800/40 px-6 py-3 rounded-full border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
              <a href="/#how" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors">How It Works</a>
              <a href="/#users" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors">For Users</a>
              <a href="/#brands" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors">For Brands</a>
              <Link href="/about" className={`text-sm font-medium transition-colors ${
                pathname === "/about" 
                  ? "text-emerald-600 font-semibold" 
                  : "text-slate-700 dark:text-slate-300 hover:text-emerald-600"
              }`}>About Us</Link>
              <Link href="/whitepaper" className={`text-sm font-medium transition-colors ${
                pathname === "/whitepaper" 
                  ? "text-emerald-600 font-semibold" 
                  : "text-slate-700 dark:text-slate-300 hover:text-emerald-600"
              }`}>Whitepaper</Link>
            </nav>

            {/* RIGHT: THEME + AUTH */}
            <div className="flex items-center gap-2 md:gap-4">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              )}

              {/* Desktop Buttons */}
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-xl bg-linear-to-r from-emerald-500 to-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02]"
                >
                  Sign Up
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col transform transition-transform duration-500 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-slate-100 dark:border-slate-800">
          <span className="font-black tracking-widest text-xs opacity-50 uppercase text-slate-500">Menu</span>
          <button 
            onClick={() => setMobileOpen(false)} 
            className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar Links */}
        <div className="flex-1 overflow-y-auto p-8">
          <nav className="flex flex-col gap-6">
            <Link href="/about" onClick={handleNavClick} className={`text-sm font-bold border-b pb-2 ${
              pathname === "/about" 
                ? "text-emerald-600 border-emerald-600" 
                : "text-slate-900 dark:text-white border-slate-50 dark:border-slate-900"
            }`}>About Us</Link>
            <a href="/#how" onClick={handleNavClick} className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-900 pb-2">How It Works</a>
            <a href="/#users" onClick={handleNavClick} className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-900 pb-2">For Users</a>
            <a href="/#brands" onClick={handleNavClick} className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-900 pb-2">For Brands</a>
            <Link href="/whitepaper" onClick={handleNavClick} className={`text-sm font-medium border-b pb-2 ${
              pathname === "/whitepaper" 
                ? "text-emerald-600 border-emerald-600 font-bold" 
                : "text-slate-700 dark:text-slate-300 border-transparent hover:text-emerald-600"
            }`}>Whitepaper</Link>
            <Link href="/contact" onClick={handleNavClick} className={`text-sm font-bold border-b pb-2 ${
              pathname === "/contact" 
                ? "text-emerald-600 border-emerald-600" 
                : "text-slate-900 dark:text-white border-slate-50 dark:border-slate-900"
            }`}>Contact Support</Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
          <div className="flex flex-col gap-4">
            <Link
              href="/auth/login"
              onClick={handleNavClick}
              className="w-full py-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center font-bold text-slate-700 dark:text-slate-300"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              onClick={handleNavClick}
              className="w-full py-4 rounded-xl bg-linear-to-r from-emerald-500 to-purple-600 text-white text-center font-bold shadow-xl shadow-emerald-500/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

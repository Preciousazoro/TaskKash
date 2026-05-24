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


  const mobileLinkStyles = (href: string, exact: boolean = true) => {
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return `relative flex items-center px-1 py-3.5 text-[15px] font-bold tracking-wide transition-colors
    border-b border-border/40 last:border-b-0
    after:absolute after:bottom-0 after:left-0 after:h-[2px]
    after:rounded-full after:transition-all after:duration-300
    ${
      isActive
        ? "text-emerald-600 after:w-full after:bg-emerald-500"
        : "text-muted-foreground hover:text-foreground after:w-0 hover:after:w-full hover:after:bg-border"
    }`;
};


  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-border/80 bg-background/95 shadow-md backdrop-blur-md"
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
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 bg-secondary/50 px-6 py-3 rounded-full border border-border/50 backdrop-blur-sm">
              <Link href="/" className={`text-sm font-medium transition-colors ${
                pathname === "/" 
                  ? "text-emerald-600 font-semibold" 
                  : "text-muted-foreground hover:text-emerald-600"
              }`}>Home</Link>
              <Link href="/landing-page/about" className={`text-sm font-medium transition-colors ${
                pathname === "/landing-page/about" 
                  ? "text-emerald-600 font-semibold" 
                  : "text-muted-foreground hover:text-emerald-600"
              }`}>About Us</Link>
              <Link href="/landing-page/whitepaper" className={`text-sm font-medium transition-colors ${
                pathname === "/landing-page/whitepaper" 
                  ? "text-emerald-600 font-semibold" 
                  : "text-muted-foreground hover:text-emerald-600"
              }`}>Whitepaper</Link>
              <Link href="/landing-page/testimonials" className={`text-sm font-medium transition-colors ${
                pathname === "/landing-page/testimonials" 
                  ? "text-emerald-600 font-semibold" 
                  : "text-muted-foreground hover:text-emerald-600"
              }`}>Testimonials</Link>
              <Link href="/landing-page/contact" className={`text-sm font-medium transition-colors ${
                pathname === "/landing-page/contact" 
                  ? "text-emerald-600 font-semibold" 
                  : "text-muted-foreground hover:text-emerald-600"
              }`}>Contact Us</Link>
            </nav>

            {/* RIGHT: THEME + AUTH */}
            <div className="flex items-center gap-2 md:gap-4">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 text-foreground hover:bg-secondary rounded-full transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              )}

              {/* Desktop Buttons */}
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white transition hover:scale-[1.02] hover:bg-emerald-600"
                >
                  Register Account
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>




      {/* MOBILE SIDEBAR */}
      {/* MOBILE MENU BACKDROP */}
<div
  onClick={() => setMobileOpen(false)}
  className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
    mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
  }`}
/>

{/* MOBILE SIDEBAR */}
<aside
  className={`fixed right-0 top-0 h-full w-full bg-background border-l border-border shadow-2xl z-[100] transform transition-transform duration-300 ease-in-out md:hidden ${
    mobileOpen ? "translate-x-0" : "translate-x-full"
  }`}
>
  <div className="p-6 h-full flex flex-col">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <span className="font-black tracking-widest text-xs opacity-50 uppercase text-muted-foreground">
        Menu
      </span>

      <button
        onClick={() => setMobileOpen(false)}
        className="p-2 hover:bg-secondary rounded-full"
      >
        <X className="h-5 w-5" />
      </button>
    </div>

    {/* Nav Links */}
    <nav className="flex flex-col">
      <Link
        href="/"
        onClick={handleNavClick}
        className={mobileLinkStyles("/")}
      >
        Home
      </Link>

      <a
        href="/#how"
        onClick={handleNavClick}
        className={mobileLinkStyles("/#how", false)}
      >
        How It Works
      </a>
{/* 
      <a
        href="/#users"
        onClick={handleNavClick}
        className={mobileLinkStyles("/#users", false)}
      >
        For Users
      </a>

      <a
        href="/#brands"
        onClick={handleNavClick}
        className={mobileLinkStyles("/#brands", false)}
      >
        For Brands
      </a> */}

      <Link
        href="/landing-page/about"
        onClick={handleNavClick}
        className={mobileLinkStyles("/landing-page/about")}
      >
        About Task Kash
      </Link>

      <Link
        href="/landing-page/whitepaper"
        onClick={handleNavClick}
        className={mobileLinkStyles("/landing-page/whitepaper")}
      >
        Our Whitepaper
      </Link>

      <Link
        href="/landing-page/testimonials"
        onClick={handleNavClick}
        className={mobileLinkStyles("/landing-page/testimonials")}
      >
        Users Testimonials
      </Link>

      <Link
        href="/landing-page/contact"
        onClick={handleNavClick}
        className={mobileLinkStyles("/landing-page/contact")}
      >
        Contact Support
      </Link>
    </nav>

    {/* Bottom Auth */}
    <div className="mt-auto flex flex-col gap-3 border-t border-border pt-6">
      <Link
        href="/auth/login"
        onClick={handleNavClick}
        className="w-full py-4 rounded-xl border border-border text-center text-sm font-bold text-muted-foreground hover:text-foreground transition"
      >
        Login Account
      </Link>

      <Link
        href="/auth/signup"
        onClick={handleNavClick}
        className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-center text-sm font-bold transition"
      >
       Register Account
      </Link>

      <p className="text-center text-[11px] text-muted-foreground mt-2 px-4">
        Earn rewards, complete tasks, and grow with TaskKash.
      </p>
    </div>
  </div>
</aside>
    </>
  );
}
import Link from "next/link";
import { FaXTwitter, FaDiscord, FaTelegram, FaYoutube } from "react-icons/fa6";

const socialLinks = [
  { name: "Twitter", href: "https://twitter.com/taskkash", icon: FaXTwitter },
  { name: "Discord", href: "https://discord.gg/taskkash", icon: FaDiscord },
  { name: "Telegram", href: "https://t.me/taskkash", icon: FaTelegram },
  { name: "YouTube", href: "https://youtube.com/@taskkash", icon: FaYoutube },
];

export default function TaskKashFooter() {
  return (
    <footer className="relative bg-slate-950 text-slate-300">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-950 pointer-events-none" />
      
      <div className="relative mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 xl:gap-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-emerald-500 via-green-500 to-purple-600 bg-clip-text text-2xl font-black text-transparent transition-all duration-300 hover:opacity-80 sm:text-3xl"
            >
              TaskKash
            </Link>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-slate-400 sm:text-lg">
              Turn actions into on-chain rewards.
            </p>
            
            {/* Social Icons */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800/50 text-slate-400 transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-purple-600 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/25"
                    aria-label={social.name}
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white sm:text-xl">Product</h3>
            <ul className="space-y-4">
              <li>
                <a href="/#how" className="block text-base transition-all duration-200 hover:text-white hover:translate-x-1">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/#users" className="block text-base transition-all duration-200 hover:text-white hover:translate-x-1">
                  For Users
                </a>
              </li>
              <li>
                <a href="/#brands" className="block text-base transition-all duration-200 hover:text-white hover:translate-x-1">
                  For Brands
                </a>
              </li>
              <li>
                <Link href="/auth/signup" className="block text-base transition-all duration-200 hover:text-white hover:translate-x-1">
                  Earn Rewards
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white sm:text-xl">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="block text-base transition-all duration-200 hover:text-white hover:translate-x-1">
                  About
                </Link>
              </li>
              <li>
                <Link href="/whitepaper" className="block text-base transition-all duration-200 hover:text-white hover:translate-x-1">
                  Whitepaper
                </Link>
              </li>
              <li>
                <Link href="/careers" className="block text-base transition-all duration-200 hover:text-white hover:translate-x-1">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="block text-base transition-all duration-200 hover:text-white hover:translate-x-1">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white sm:text-xl">Resources</h3>
            <ul className="space-y-4">
              <li>
                <a href="/#faq" className="block text-base transition-all duration-200 hover:text-white hover:translate-x-1">
                  FAQ
                </a>
              </li>
              <li>
                <Link href="/docs" className="block text-base transition-all duration-200 hover:text-white hover:translate-x-1">
                  Docs
                </Link>
              </li>
              <li>
                <Link href="/support" className="block text-base transition-all duration-200 hover:text-white hover:translate-x-1">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/api" className="block text-base transition-all duration-200 hover:text-white hover:translate-x-1">
                  API
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-16 border-t border-slate-800 sm:mt-20" />

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-slate-500 sm:text-base">
            © 2026 TaskKash. All rights reserved.
          </p>
          
          <div className="flex gap-6 text-sm sm:gap-8 sm:text-base">
            <Link 
              href="/terms" 
              className="text-slate-500 transition-all duration-200 hover:text-white hover:underline"
            >
              Terms of Service
            </Link>
            <Link 
              href="/privacy" 
              className="text-slate-500 transition-all duration-200 hover:text-white hover:underline"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/security" 
              className="text-slate-500 transition-all duration-200 hover:text-white hover:underline"
            >
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

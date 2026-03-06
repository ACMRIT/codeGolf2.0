"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Format", href: "#format" },
  { label: "Rules", href: "#rules" },
  { label: "Schedule", href: "#schedule" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = [...navLinks].map((l) => l.href.replace("#", ""));
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const wasOpen = mobileOpen;
    setMobileOpen(false);
    // Delay until the drawer close animation (250ms) finishes, so the
    // page layout has settled before we calculate the scroll target.
    setTimeout(() => {
      const el = document.getElementById(href.replace("#", ""));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, wasOpen ? 280 : 0);
  };

  return (
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0c0f14]/95 md:bg-[#0c0f14]/90 md:backdrop-blur-md">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 h-20">
        <div className="flex h-full items-center justify-between">

          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollTo("#home"); }}
            className="flex items-center"
          >
            <Image
              src="/acm-logo.png"
              alt="ACM Student Chapter"
              width={180}
              height={56}
              className="h-14 w-auto object-contain"
              priority
            />
          </a>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={`font-almendra text-sm uppercase tracking-[0.18em] transition-colors duration-200 ${
                    isActive ? "text-[#f4f6fb]" : "text-[#aab4c4] hover:text-[#f4f6fb]"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            {/* Register CTA */}
            <Link
              href="/register"
              className="font-almendra text-sm uppercase tracking-[0.18em] px-4 py-1.5 rounded-md bg-blue-600/80 hover:bg-blue-500 text-white transition-all duration-200 shadow-[0_0_12px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
            >
              Register
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="inline-flex min-h-11 min-w-11 md:hidden items-center justify-center text-[#f4f6fb]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-white/10 bg-[#0c0f14]/95 backdrop-blur-md"
          >
            <div className="flex flex-col px-6 py-4 gap-1">
              {navLinks.map((link, i) => {
                const isActive = activeSection === link.href.replace("#", "");
                return (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => scrollTo(link.href)}
                    className={`text-left py-3 font-almendra text-sm uppercase tracking-[0.18em] border-b border-white/5 last:border-0 transition-colors ${
                      isActive ? "text-[#f4f6fb]" : "text-[#aab4c4]"
                    }`}
                  >
                    {link.label}
                  </motion.button>
                );
              })}              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="mt-2 text-center py-3 font-almendra text-sm uppercase tracking-[0.18em] rounded-md bg-blue-600/80 hover:bg-blue-500 text-white transition-all duration-200"
              >
                Register
              </Link>            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

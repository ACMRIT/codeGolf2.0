"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";

// Floating symbols data
const floatingSymbols = [
  { symbol: "{", x: "8%", y: "20%", delay: 0, size: "text-3xl" },
  { symbol: "}", x: "92%", y: "15%", delay: 0.5, size: "text-3xl" },
  { symbol: "<", x: "15%", y: "65%", delay: 1.0, size: "text-2xl" },
  { symbol: ">", x: "85%", y: "70%", delay: 1.5, size: "text-2xl" },
  { symbol: "/", x: "5%", y: "45%", delay: 0.8, size: "text-4xl" },
  { symbol: ";", x: "95%", y: "45%", delay: 1.2, size: "text-2xl" },
  { symbol: "()", x: "20%", y: "85%", delay: 0.3, size: "text-xl" },
  { symbol: "=>", x: "75%", y: "30%", delay: 0.7, size: "text-xl" },
  { symbol: "//", x: "50%", y: "8%", delay: 1.8, size: "text-lg" },
  { symbol: "&&", x: "60%", y: "88%", delay: 2.0, size: "text-lg" },
];

// Terminal typing lines
const terminalLines = [
  { text: "$ codegolf --init challenge.py", delay: 0 },
  { text: "> loading problem set...", delay: 800 },
  { text: "> solving challenge...", delay: 1600 },
  { text: "> optimizing code...", delay: 2400 },
  { text: "> characters reduced: 34 ✓", delay: 3200 },
  { text: "> leaderboard loading...", delay: 4000 },
  { text: "> rank #1 achieved! 🏆", delay: 4800 },
];

function TerminalWindow() {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [currentTyping, setCurrentTyping] = useState<{ index: number; text: string } | null>(null);

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
    const cycle = () => {
      setVisibleLines([]);
      setCurrentTyping(null);
      terminalLines.forEach((line, i) => {
        const t = setTimeout(() => {
          setCurrentTyping({ index: i, text: "" });
          const chars = line.text.split("");
          chars.forEach((_, ci) => {
            const ct = setTimeout(() => {
              setCurrentTyping({ index: i, text: line.text.slice(0, ci + 1) });
              if (ci === chars.length - 1) {
                setVisibleLines((prev) => [...prev, i]);
                setCurrentTyping(null);
              }
            }, ci * 28);
            timeouts.push(ct);
          });
        }, line.delay);
        timeouts.push(t);
      });
      // Restart after all lines done
      const restart = setTimeout(() => cycle(), 7000);
      timeouts.push(restart);
    };
    cycle();
    return () => timeouts.forEach(clearTimeout);
  }, []);

  const getLineColor = (text: string) => {
    if (text.startsWith("$")) return "text-blue-300";
    if (text.includes("✓")) return "text-emerald-400";
    if (text.includes("🏆")) return "text-yellow-400";
    if (text.includes("loading")) return "text-slate-400";
    return "text-slate-300";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      className="relative w-full max-w-lg"
    >
      {/* Glow behind terminal */}
      <div className="absolute -inset-4 bg-blue-600/20 rounded-2xl blur-2xl" />
      <div className="relative rounded-xl border border-white/10 overflow-hidden shadow-2xl bg-[#0d0d1a]/90 backdrop-blur-sm">
        {/* Terminal title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs text-slate-500 font-mono">codegolf@acm ~ bash</span>
        </div>
        {/* Terminal body */}
        <div className="p-5 font-mono text-sm min-h-[220px] space-y-1.5">
          {terminalLines.map((line, i) => (
            <div key={i} className="h-5">
              {visibleLines.includes(i) ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={getLineColor(line.text)}
                >
                  {line.text}
                </motion.span>
              ) : currentTyping?.index === i ? (
                <span className={getLineColor(line.text)}>
                  {currentTyping.text}
                  <span className="inline-block w-2 h-4 bg-blue-400 ml-0.5 animate-pulse align-middle" />
                </span>
              ) : null}
            </div>
          ))}
          {visibleLines.length === 0 && !currentTyping && (
            <span className="text-slate-600">
              <span className="inline-block w-2 h-4 bg-blue-400/50 animate-pulse align-middle" />
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function CountdownTimer() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date("2026-03-12T09:00:00").getTime();
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Mins", value: time.minutes },
    { label: "Secs", value: time.seconds },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
      className="mt-8"
    >
      <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-mono">
        — Event starts in —
      </p>
      <div className="flex gap-3">
        {units.map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center glass-card px-4 py-3 min-w-[64px] glow-border"
          >
            <motion.span
              key={value}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl font-bold font-mono text-blue-300 tabular-nums"
            >
              {String(value).padStart(2, "0")}
            </motion.span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
              {label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const scrollToRegister = () => {
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-[#060914]">
        <div className="absolute inset-0 bg-mesh" />
        <div className="hidden md:block absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-800/15 blur-[120px]" />
        <div className="hidden md:block absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-sky-700/15 blur-[100px]" />
      </div>

      {/* Floating symbols */}
      {floatingSymbols.map((s, i) => (
        <motion.div
          key={i}
          className={`absolute font-mono font-bold text-blue-500/15 select-none pointer-events-none ${s.size}`}
          style={{ left: s.x, top: s.y }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.1, 0.25, 0.1],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 5 + (i % 3),
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        >
          {s.symbol}
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left column */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/15 border border-blue-500/25 text-blue-300 text-xs font-mono mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              ACM Student Chapter · ESB Seminar Hall 1 · March 12, 2026
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-6xl sm:text-7xl font-black leading-none tracking-tight mb-4"
            >
              <span className="text-white">Code</span>
              <br />
              <span className="text-gradient">Golf 2.0</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-slate-300 font-light mb-6 leading-relaxed"
            >
              Think smarter.{" "}
              <span className="text-blue-400 font-medium">Code shorter.</span>{" "}
              Win faster.
            </motion.p>

            {/* Event info pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-wrap gap-3 mb-6"
            >
              {[
                { icon: Calendar, text: "March 12, 2026" },
                { icon: Users, text: "ACM Student Chapter" },
                { icon: MapPin, text: "ESB Seminar Hall 1" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-sm"
                >
                  <Icon className="w-3.5 h-3.5 text-blue-400" />
                  {text}
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/register"
                className="group flex items-center gap-2.5 px-8 py-3.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-almendra uppercase tracking-widest text-sm transition-colors duration-200"
              >
                Register Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <motion.button
                onClick={scrollToAbout}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-lg bg-transparent text-slate-300 hover:text-white font-almendra uppercase tracking-widest text-sm border border-white/15 hover:border-blue-400/50 hover:bg-white/5 transition-all duration-300"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Learn More
              </motion.button>
            </motion.div>

            {/* Countdown */}
            <CountdownTimer />
          </div>

          {/* Right column – Terminal */}
          <div className="flex justify-center lg:justify-end">
            <TerminalWindow />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={scrollToAbout}
      >
        <span className="text-xs text-slate-600 font-mono">scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-4 h-4 text-slate-600" />
        </motion.div>
      </motion.div>
    </section>
  );
}

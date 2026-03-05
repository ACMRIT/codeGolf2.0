"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, Target, Trophy } from "lucide-react";

const normalCode = `sum = 0
for i in arr:
    sum += i
print(sum)`;

const golfCode = `print(sum(arr))`;

function CodeBlock({
  title,
  code,
  lang,
  badge,
  badgeColor,
}: {
  title: string;
  code: string;
  lang: string;
  badge: string;
  badgeColor: string;
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0d0d1a]/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2 text-xs text-slate-400 font-mono">{title}</span>
        </div>
        <span className={`text-xs font-mono px-2 py-0.5 rounded ${badgeColor}`}>{badge}</span>
      </div>
      <pre className="p-4 font-mono text-sm leading-relaxed overflow-x-auto">
        <code className="text-slate-200">{code}</code>
      </pre>
    </div>
  );
}

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <section id="about" className="relative py-24 overflow-hidden">
      {/* Background glows */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-blue-700/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute right-0 top-1/4 w-48 h-48 bg-sky-700/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">
            // section 01
          </span>
          <h2 className="mt-2 text-4xl font-bold text-white">
            About the Event
          </h2>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-12 items-start"
        >
          {/* Left — About */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="glass-card glow-border p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/20">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">What is CodeGolf 2.0?</h3>
              </div>
              <p className="text-slate-400 leading-relaxed text-base">
                CodeGolf 2.0 is a{" "}
                <span className="text-blue-300 font-medium">competitive programming event</span>{" "}
                designed to test participants&apos; ability to solve problems using the most concise
                and efficient code possible. Participants tackle algorithmic challenges and attempt
                to produce correct solutions using{" "}
                <span className="text-blue-300 font-medium">minimal lines of code</span>.
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                {[
                  { icon: Zap, label: "2 Rounds", sub: "Individual + Team" },
                  { icon: Trophy, label: "₹6000", sub: "Prize Pool" },
                  { icon: Target, label: "6 Problems", sub: "Across rounds" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="text-center p-3 rounded-lg bg-white/5 border border-white/5">
                    <Icon className="w-4 h-4 text-blue-400 mx-auto mb-1.5" />
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key highlights */}
            <div className="space-y-3">
              {[
                "Algorithmic problem solving with a conciseness twist",
                "Compete individually and as a team in two rounds",
                "Judged by shortest valid code — not just correctness",
                "Open to all students regardless of experience level",
              ].map((point, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="flex items-start gap-3 px-4 py-3 rounded-lg bg-white/3 border border-white/5 hover:border-blue-500/20 transition-colors"
                >
                  <span className="text-blue-400 font-mono text-xs mt-0.5">
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  <span className="text-slate-300 text-sm">{point}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — What is Code Golf */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="glass-card glow-border p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-600/20 border border-emerald-500/20">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">What is Code Golf?</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Code Golf is a programming challenge where the goal is to write the{" "}
                <span className="text-emerald-300 font-medium">shortest possible source code</span>{" "}
                to solve a given problem. Every character counts — the fewer, the better.
              </p>

              {/* Code comparison */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span className="text-xs text-yellow-400 font-mono uppercase tracking-wider">
                      Normal Solution — 47 chars
                    </span>
                  </div>
                  <CodeBlock
                    title="solution.py"
                    code={normalCode}
                    lang="python"
                    badge="47 chars"
                    badgeColor="bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"
                  />
                </div>

                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-2 text-blue-400 text-sm font-mono">
                    <span className="text-slate-600">────</span>
                    <Zap className="w-4 h-4" />
                    <span>Code Golf it!</span>
                    <Zap className="w-4 h-4" />
                    <span className="text-slate-600">────</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-emerald-400 font-mono uppercase tracking-wider">
                      Code Golf Solution — 15 chars
                    </span>
                  </div>
                  <CodeBlock
                    title="golf.py"
                    code={golfCode}
                    lang="python"
                    badge="15 chars ✓"
                    badgeColor="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                  />
                </div>
              </div>

              {/* Reduction badge */}
              <div className="flex items-center justify-center gap-3 p-3 rounded-lg bg-blue-600/10 border border-blue-500/20">
                <span className="text-slate-400 text-sm font-mono">characters reduced:</span>
                <span className="text-2xl font-black text-blue-300 font-mono">68%</span>
                <span className="text-emerald-400 text-sm">↓</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

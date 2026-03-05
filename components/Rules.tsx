"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Scale,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
} from "lucide-react";

const rules = [
  {
    id: "r1",
    title: "Time Limits",
    icon: Clock,
    content:
      "Participants must complete all challenges within the designated time limits. Round 1 is 2 hours. The Surprise Round duration will be announced on the day. No extensions will be granted.",
    accent: "blue",
  },
  {
    id: "r2",
    title: "Solution Validity",
    icon: CheckCircle2,
    content:
      "Solutions must pass all test cases to be considered valid. A shorter solution that fails any test case will not be scored. Correctness is required before conciseness is measured.",
    accent: "emerald",
  },
  {
    id: "r3",
    title: "Scoring Criteria",
    icon: Scale,
    content:
      "Shortest code wins. The scoring is based on the total character count of your submitted source code. Whitespace, comments, and all characters count toward the total.",
    accent: "yellow",
  },
  {
    id: "r4",
    title: "Internet Access",
    icon: Shield,
    content:
      "Internet access is not allowed unless explicitly permitted by the organizers for specific rounds. Any unauthorized use of online resources will result in disqualification.",
    accent: "red",
  },
  {
    id: "r5",
    title: "Plagiarism Policy",
    icon: AlertCircle,
    content:
      "Plagiarism leads to immediate disqualification. All submissions are checked for similarity. Sharing solutions during the contest, or submitting solutions found online, is strictly prohibited.",
    accent: "red",
  },
  {
    id: "r6",
    title: "Submission Platform",
    icon: Zap,
    content:
      "All solutions must be submitted through HackerRank on the official contest link provided on event day. Submissions outside the platform will not be accepted.",
    accent: "sky",
  },
];

const judgingCriteria = [
  {
    rank: "01",
    title: "Shortest Valid Code",
    description:
      "The primary scoring criterion is the total character count of the source code that passes all test cases. Fewer characters = higher rank.",
    badge: "Primary",
    badgeColor: "bg-blue-500/15 text-blue-300 border-blue-500/25",
  },
  {
    rank: "02",
    title: "Earlier Submission Time",
    description:
      "In the event of a tie in character count, the participant who submitted their solution earlier will be ranked higher.",
    badge: "Tie Breaker 1",
    badgeColor: "bg-blue-500/15 text-blue-300 border-blue-500/25",
  },
  {
    rank: "03",
    title: "Execution Efficiency",
    description:
      "If both character count and submission time are identical, execution time and runtime performance will be used as the final tiebreaker.",
    badge: "Tie Breaker 2",
    badgeColor: "bg-slate-500/15 text-slate-300 border-slate-500/25",
  },
];

const accentMap: Record<string, string> = {
  blue: "border-blue-500/20 hover:border-blue-400/30",
  emerald: "border-emerald-500/20 hover:border-emerald-400/30",
  yellow: "border-yellow-500/20 hover:border-yellow-400/30",
  red: "border-red-500/20 hover:border-red-400/30",
  sky: "border-sky-500/20 hover:border-sky-400/30",
};

const iconAccentMap: Record<string, string> = {
  blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  red: "text-red-400 bg-red-500/10 border-red-500/20",
  sky: "text-sky-400 bg-sky-500/10 border-sky-500/20",
};

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof rules)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const Icon = item.icon;
  return (
    <div
      className={`glass-card border transition-all duration-300 overflow-hidden ${
        accentMap[item.accent]
      } ${isOpen ? "shadow-[0_0_20px_rgba(59,130,246,0.08)]" : ""}`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border ${iconAccentMap[item.accent]}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-medium text-white text-sm">{item.title}</span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 pt-0">
              <div className="border-t border-white/5 pt-4">
                <p className="text-slate-400 text-sm leading-relaxed">{item.content}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Rules() {
  const [openItem, setOpenItem] = useState<string | null>("r1");

  return (
    <section id="rules" className="relative py-24 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-800/5 rounded-full blur-[150px] pointer-events-none" />

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
            // section 03
          </span>
          <h2 className="mt-2 text-4xl font-bold text-white">Rules & Judging</h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto">
            Know the rules. Play fair. Code shortest.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left — Rules accordion */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Contest Rules
            </h3>
            <div className="space-y-3">
              {rules.map((rule) => (
                <AccordionItem
                  key={rule.id}
                  item={rule}
                  isOpen={openItem === rule.id}
                  onToggle={() => setOpenItem(openItem === rule.id ? null : rule.id)}
                />
              ))}
            </div>
          </motion.div>

          {/* Right — Judging criteria */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-400" />
              Judging Criteria
            </h3>
            <div className="space-y-4">
              {judgingCriteria.map((c, i) => (
                <motion.div
                  key={c.rank}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className="glass-card p-6 border border-white/10 hover:border-blue-500/20 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="font-mono text-3xl font-black text-white/10">{c.rank}</div>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded border ${c.badgeColor}`}>
                      {c.badge}
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-white mb-2">{c.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{c.description}</p>
                </motion.div>
              ))}

              {/* Note box */}
              <div className="mt-4 p-4 rounded-xl bg-blue-600/8 border border-blue-500/15">
                <p className="text-xs text-blue-300 font-mono leading-relaxed">
                  <span className="text-blue-400">{"// Note: "}</span>
                  All submissions are stored and compared automatically by the HackerRank platform.
                  Final results are verified by organizers before announcement.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

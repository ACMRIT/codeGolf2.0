"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Mic,
  Code2,
  Coffee,
  Users,
  BarChart2,
  Trophy,
  Award,
  Medal,
  Star,
} from "lucide-react";

const schedule = [
  {
    time: "09:00 AM",
    title: "Opening Ceremony",
    description: "Welcome address, event overview, and platform orientation.",
    icon: Mic,
    accent: "blue",
  },
  {
    time: "10:00 AM",
    title: "Round 1 — Pair Programming Golf",
    description: "3 DSA problems (Easy / Medium / Hard). 2-hour window. Shortest valid code wins.",
    icon: Code2,
    accent: "sky",
  },
  {
    time: "12:00 PM",
    title: "Lunch + Shortlisting",
    description: "Lunch break while organizers shortlist top performers for the Surprise Round.",
    icon: Coffee,
    accent: "yellow",
  },
  {
    time: "01:30 PM",
    title: "Surprise Round",
    description: "Format revealed on the day. Top qualifiers from Round 1 compete in a mystery challenge.",
    icon: Users,
    accent: "emerald",
  },
  {
    time: "04:30 PM",
    title: "Evaluation",
    description: "Judges verify submissions, handle edge cases, and finalize rankings.",
    icon: BarChart2,
    accent: "blue",
  },
  {
    time: "05:30 PM",
    title: "Winner Announcement",
    description: "Prize distribution, certificates for all participants, and closing remarks.",
    icon: Trophy,
    accent: "amber",
  },
];

const prizes = [
  {
    rank: "1st",
    amount: "₹5,000",
    label: "First Prize",
    icon: Trophy,
    gradient: "from-yellow-500/20 to-amber-500/10",
    border: "border-yellow-500/30 hover:border-yellow-400/50",
    textColor: "text-yellow-400",
    glow: "hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]",
    size: "lg",
  },
  {
    rank: "2nd",
    amount: "₹3,000",
    label: "Second Prize",
    icon: Award,
    gradient: "from-slate-400/15 to-slate-500/10",
    border: "border-slate-400/30 hover:border-slate-300/50",
    textColor: "text-slate-300",
    glow: "hover:shadow-[0_0_30px_rgba(148,163,184,0.15)]",
    size: "md",
  },
  {
    rank: "3rd",
    amount: "₹2,000",
    label: "Third Prize",
    icon: Medal,
    gradient: "from-amber-700/20 to-amber-800/10",
    border: "border-amber-700/30 hover:border-amber-600/50",
    textColor: "text-amber-600",
    glow: "hover:shadow-[0_0_30px_rgba(180,83,9,0.15)]",
    size: "sm",
  },
];

const accentDot: Record<string, string> = {
  blue: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]",
  sky: "bg-sky-500 shadow-[0_0_8px_rgba(56,189,248,0.8)]",
  yellow: "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]",
  emerald: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]",
  amber: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]",
};

const accentIcon: Record<string, string> = {
  blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  sky: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

export default function Schedule() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="schedule" className="relative py-24 overflow-hidden">
      <div className="hidden md:block absolute right-1/4 top-0 w-72 h-72 bg-amber-700/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="hidden md:block absolute left-0 bottom-1/3 w-56 h-56 bg-blue-800/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="mt-2 text-4xl font-bold text-white">Schedule & Prizes</h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto">
            March 12, 2026 — Full day event
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-white mb-8 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-blue-400" />
              Event Timeline
            </h3>
            <div ref={ref} className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-600/40 via-sky-500/20 to-transparent" />

              <div className="space-y-6">
                {schedule.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="relative flex gap-5 pl-16"
                    >
                      {/* Dot */}
                      <div
                        className={`absolute left-4 top-3 w-4 h-4 rounded-full border-2 border-[#060914] ${accentDot[item.accent]} z-10`}
                      />
                      {/* Card */}
                      <div className="flex-1 glass-card p-4 border border-white/8 hover:border-white/15 transition-colors group">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg border ${accentIcon[item.accent]}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                          </div>
                          <span className="text-xs font-mono text-slate-500 whitespace-nowrap ml-2">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right — Prizes */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h3 className="text-lg font-semibold text-white mb-8 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Prize Pool
            </h3>

            {/* Prize cards — podium order: 2nd, 1st, 3rd */}
            <div className="flex items-end justify-center gap-4 mb-8">
              {[prizes[1], prizes[0], prizes[2]].map((prize, i) => {
                const Icon = prize.icon;
                const heights = ["pb-4", "pb-8", "pb-2"];
                return (
                  <motion.div
                    key={prize.rank}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + 0.3 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className={`flex-1 glass-card bg-gradient-to-b ${prize.gradient} border ${prize.border} ${prize.glow} transition-all duration-300 p-5 text-center ${heights[i]} rounded-xl`}
                  >
                    <div
                      className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-3 bg-gradient-to-b ${prize.gradient} border ${prize.border}`}
                    >
                      <Icon className={`w-5 h-5 ${prize.textColor}`} />
                    </div>
                    <p className={`text-2xl font-black ${prize.textColor} mb-1`}>{prize.amount}</p>
                    <p className="text-xs text-slate-400 font-mono">{prize.label}</p>
                    <div
                      className={`mt-2 text-xs font-bold ${prize.textColor} font-mono`}
                    >
                      {prize.rank} Place
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Certificates note */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="glass-card p-5 border border-white/8 flex items-start gap-4"
            >
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 flex-shrink-0">
                <Star className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-1">
                  Participation Certificates
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  All registered participants who compete will receive an official participation
                  certificate from the ACM Student Chapter.
                </p>
              </div>
            </motion.div>

            {/* Total pool */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="mt-4 text-center"
            >
              <span className="text-xs text-slate-600 font-mono">Total Prize Pool: </span>
              <span className="text-lg font-black text-gradient font-mono">₹10,000</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

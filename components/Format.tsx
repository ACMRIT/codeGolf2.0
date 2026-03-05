"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Users, Clock, Star, Layers } from "lucide-react";

const rounds = [
  {
    number: "01",
    title: "DSA Code Golf",
    type: "Individual Round",
    icon: Code2,
    duration: "2 Hours",
    accentColor: "blue",
    questions: [
      { label: "Easy", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
      { label: "Medium", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
      { label: "Hard", color: "text-red-400 bg-red-500/10 border-red-500/20" },
    ],
    description:
      "Solve 3 data structures & algorithms challenges individually. Write the most concise valid code to climb the leaderboard.",
    details: [
      "3 problems (Easy / Medium / Hard)",
      "Scored by character count",
      "All solutions via HackerRank",
      "Top performers advance to Surprise Round",
    ],
  },
  {
    number: "02",
    title: "Surprise Round",
    type: "Team Challenge",
    icon: Users,
    duration: "3 Hours",
    accentColor: "sky",
    questions: [
      { label: "???", color: "text-sky-400 bg-sky-500/10 border-sky-500/20" },
      { label: "Secret", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
      { label: "Revealed at Event", color: "text-slate-400 bg-slate-500/10 border-slate-500/20" },
    ],
    description:
      "Details of this round are kept secret until the day of the event. Stay sharp — anything can happen.",
    details: [
      "Format revealed on the day",
      "Expect the unexpected",
      "Think fast, adapt faster",
      "Finals determine prize winners",
    ],
  },
];

export default function Format() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="format" className="relative py-24 overflow-hidden">
      <div className="absolute right-0 top-0 w-72 h-72 bg-sky-700/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute left-1/4 bottom-0 w-56 h-56 bg-blue-700/8 rounded-full blur-[100px] pointer-events-none" />

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
            // section 02
          </span>
          <h2 className="mt-2 text-4xl font-bold text-white">Event Format</h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto">
            Two rounds. Two challenges. One winner.
          </p>
        </motion.div>

        {/* Round cards */}
        <div ref={ref} className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {rounds.map((round, i) => {
            const Icon = round.icon;
            const isViolet = round.accentColor === "blue";
            return (
              <motion.div
                key={round.number}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.2, ease: "easeOut" }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`relative glass-card p-8 group cursor-default overflow-hidden ${
                    isViolet ? "border-blue-500/20 hover:border-blue-500/40 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]"
                    : "border-sky-500/20 hover:border-sky-500/40 hover:shadow-[0_0_40px_rgba(14,165,233,0.15)]"
                } transition-all duration-300`}
              >
                {/* Background decoration */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    isViolet ? "bg-blue-600/20" : "bg-sky-600/20"
                  }`}
                />

                {/* Round number */}
                <div className="absolute top-4 right-5 font-mono text-4xl font-black opacity-5 text-white">
                  {round.number}
                </div>

                {/* Icon + type */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className={`p-2.5 rounded-xl ${
                      isViolet
                        ? "bg-blue-600/15 border border-blue-500/20"
                        : "bg-sky-600/15 border border-sky-500/20"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${isViolet ? "text-blue-400" : "text-sky-400"}`}
                    />
                  </div>
                  <span
                    className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
                      isViolet
                        ? "border-blue-500/25 text-blue-400 bg-blue-500/10"
                        : "border-sky-500/25 text-sky-400 bg-sky-500/10"
                    }`}
                  >
                    {round.type}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-1">
                  Round {round.number} — {round.title}
                </h3>

                {/* Duration */}
                <div className="flex items-center gap-1.5 mb-4">
                  <Clock
                    className={`w-3.5 h-3.5 ${isViolet ? "text-blue-400" : "text-sky-400"}`}
                  />
                  <span className="text-sm text-slate-400 font-mono">Duration: {round.duration}</span>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed mb-5">
                  {round.description}
                </p>

                {/* Question difficulty badges */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {round.questions.map((q) => (
                    <span
                      key={q.label}
                      className={`text-xs font-mono px-2.5 py-1 rounded border ${q.color}`}
                    >
                      {q.label}
                    </span>
                  ))}
                </div>

                {/* Details list */}
                <ul className="space-y-2">
                  {round.details.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm text-slate-400">
                      <span
                        className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          isViolet ? "bg-blue-400" : "bg-sky-400"
                        }`}
                      />
                      {d}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom info banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 max-w-5xl mx-auto"
        >
          <div className="glass-card p-5 flex flex-wrap items-center justify-center gap-6 text-center">
            {[
              { icon: Layers, label: "Platform", value: "HackerRank" },
              { icon: Star, label: "Scoring", value: "Character Count" },
              { icon: Users, label: "Format", value: "Individual → Team" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-blue-400" />
                <div className="text-left">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-semibold text-white">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

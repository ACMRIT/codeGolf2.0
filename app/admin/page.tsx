"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Users, RefreshCw, Download } from "lucide-react";

interface Member {
  name: string;
  usn: string;
  branch: string;
  year: string;
  email?: string;
  phone?: string;
  acmMemberId?: string;
}

interface Team {
  teamName?: string;
  lead: Member;
  member2: Member;
  registrationFee: number;
  registeredAt: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchData(pw: string, silent = false) {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch(`/api/admin?pw=${encodeURIComponent(pw)}`);
      const json = await res.json();
      if (!res.ok) {
        const msg = res.status === 401 ? "Wrong password." : `Error ${res.status}: ${json.error ?? "server error"}`;
        setError(msg);
        setUnlocked(false);
      } else {
        setTeams(json.teams);
        setCount(json.count);
        setUnlocked(true);
        setError("");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    fetchData(password);
  }

  function downloadCSV() {
    const rows = [
      [
        "Team #",
        "Team Name",
        "S1 Name", "S1 USN", "S1 Branch", "S1 Year", "S1 Email", "S1 Phone", "S1 ACM",
        "S2 Name", "S2 USN", "S2 Branch", "S2 Year", "S2 ACM",
        "Fee", "Registered At",
      ],
      ...teams.map((t, i) => [
        i + 1,
        t.teamName ?? "",
        t.lead.name, t.lead.usn, t.lead.branch, t.lead.year, t.lead.email ?? "", t.lead.phone ?? "", t.lead.acmMemberId ?? "",
        t.member2.name, t.member2.usn, t.member2.branch, t.member2.year, t.member2.acmMemberId ?? "",
        `₹${t.registrationFee}`,
        t.registeredAt ? new Date(t.registeredAt).toLocaleString("en-IN") : "",
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `codegolf2_registrations_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[#060914] text-white flex flex-col">
      {/* mesh bg */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-sky-900/8 rounded-full blur-[100px]" />
      </div>

      <main className="relative flex-1 flex flex-col items-center justify-start px-4 py-16">
        <div className="w-full max-w-6xl">

          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">// admin</span>
            <h1 className="mt-2 text-3xl font-bold text-white tracking-tight">Registration Dashboard</h1>
          </div>

          <AnimatePresence mode="wait">
            {/* ── Login ── */}
            {!unlocked && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="mx-auto w-full max-w-sm"
              >
                <div className="glass-card glow-border rounded-2xl p-8">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/15 border border-blue-500/25 mx-auto mb-6">
                    <Lock className="w-6 h-6 text-blue-400" />
                  </div>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-400">Admin Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        autoFocus
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                      />
                      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
                    </div>
                    <button
                      type="submit"
                      disabled={loading || !password}
                      className="w-full font-almendra text-xs uppercase tracking-widest bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-all duration-200"
                    >
                      {loading ? "Checking…" : "Enter"}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* ── Dashboard ── */}
            {unlocked && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-6"
              >
                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="glass-card rounded-xl p-5 border border-white/8">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-mono mb-1">Teams Registered</p>
                    <p className="text-4xl font-bold text-white">{count}</p>
                  </div>
                  <div className="glass-card rounded-xl p-5 border border-white/8">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-mono mb-1">Participants</p>
                    <p className="text-4xl font-bold text-white">{count * 2}</p>
                  </div>
                  <div className="glass-card rounded-xl p-5 border border-white/8 col-span-2 sm:col-span-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-mono mb-1">Total Collected</p>
                    <p className="text-4xl font-bold text-emerald-400">
                      ₹{teams.reduce((s, t) => s + (t.registrationFee ?? 0), 0)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{count} team{count !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => fetchData(password, true)}
                      disabled={refreshing}
                      className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white border border-white/10 hover:border-white/20 px-3 py-2 rounded-lg transition-all"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                      Refresh
                    </button>
                    <button
                      onClick={downloadCSV}
                      disabled={count === 0}
                      className="flex items-center gap-2 text-xs font-mono text-blue-400 hover:text-blue-300 border border-blue-500/25 hover:border-blue-400/40 px-3 py-2 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export CSV
                    </button>
                  </div>
                </div>

                {/* Teams table / cards */}
                {count === 0 ? (
                  <div className="glass-card rounded-2xl border border-white/8 p-12 text-center">
                    <p className="text-slate-500 text-sm">No registrations yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {teams.map((team, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="glass-card rounded-2xl border border-white/8 p-5"
                      >
                        {/* Team header */}
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-xs font-bold text-blue-400">
                              {idx + 1}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-white">{team.teamName || "—"}</p>
                              <p className="text-xs text-slate-500">{team.lead.name} · {team.lead.email} · {team.lead.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-xs px-2.5 py-1 rounded-md font-mono font-semibold border ${
                                team.registrationFee === 50
                                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                                  : "bg-blue-500/10 border-blue-500/25 text-blue-400"
                              }`}
                            >
                              ₹{team.registrationFee}
                            </span>
                            {team.registeredAt && (
                              <span className="text-xs text-slate-600 font-mono">
                                {new Date(team.registeredAt).toLocaleString("en-IN", {
                                  day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                                })}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Members */}
                        <div className="grid sm:grid-cols-2 gap-3">
                          {[
                            { label: "Student 1", m: team.lead },
                            { label: "Student 2", m: team.member2 },
                          ].map(({ label, m }) => (
                            <div key={label} className="bg-white/3 rounded-xl p-4 border border-white/5">
                              <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">{label}</p>
                              <p className="text-sm font-semibold text-white">{m.name}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{m.usn} · {m.branch} · {m.year}</p>
                              {m.acmMemberId && (
                                <p className="text-xs text-emerald-400 mt-1 font-mono">
                                  ACM: {m.acmMemberId}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Lock again */}
                <div className="text-center pt-4">
                  <button
                    onClick={() => { setUnlocked(false); setPassword(""); setTeams([]); }}
                    className="text-xs text-slate-600 hover:text-slate-400 transition-colors font-mono"
                  >
                    lock dashboard
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

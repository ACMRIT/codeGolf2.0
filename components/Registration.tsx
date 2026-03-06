"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  User,
  Hash,
  BookOpen,
  GraduationCap,
  Mail,
  Phone,
  CreditCard,
  Send,
  ChevronDown,
  MessageSquare,
  MapPin,
  ExternalLink,
  CheckCircle,
  BadgeCheck,
  XCircle,
  Loader2,
  Users,
} from "lucide-react";

const GOOGLE_FORM_URL = "https://forms.gle/kdaAf4vVYzyarM3y5";

type AcmStatus = "idle" | "verifying" | "valid" | "invalid" | "already_registered";

interface MemberForm {
  name: string;
  usn: string;
  branch: string;
  year: string;
  acmMemberId: string;
  acmStatus: AcmStatus;
  acmVerifiedName: string;
}

interface LeadForm extends MemberForm {
  email: string;
  phone: string;
}

const emptyMember = (): MemberForm => ({
  name: "",
  usn: "",
  branch: "",
  year: "",
  acmMemberId: "",
  acmStatus: "idle",
  acmVerifiedName: "",
});

const emptyLead = (): LeadForm => ({
  ...emptyMember(),
  email: "",
  phone: "",
});

const faqs = [
  {
    id: "f1",
    question: "Who can participate?",
    answer:
      "Any student currently enrolled in an undergraduate or postgraduate program can participate. The event is open to all departments and years.",
  },
  {
    id: "f2",
    question: "Is competitive programming experience required?",
    answer:
      "No. While experience in DSA helps, the event is designed to be accessible to all skill levels. Even beginners can compete — curiosity and creativity are what matter most.",
  },
  {
    id: "f3",
    question: "Which programming languages are allowed?",
    answer:
      "All languages supported by HackerRank are allowed. Python, C++, Java, JavaScript, and more. Choose whichever helps you write the shortest code!",
  },
  {
    id: "f4",
    question: "Is the event individual or team based?",
    answer:
      "It's pair programming! Both rounds are competed as a 2-member team. Round 1 is DSA Code Golf and the Surprise Round format is revealed on the day of the event. Expect the unexpected!",
  },
  {
    id: "f5",
    question: "Will certificates be provided?",
    answer:
      "Yes. All participants who compete will receive an official participation certificate from the ACM Student Chapter. Winners will receive additional merit certificates.",
  },
];

const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year", "PG"];

function FAQItem({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between py-4 text-left gap-4"
      >
        <span className="text-sm font-medium text-slate-200 leading-relaxed">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 mt-0.5"
        >
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="pb-4 text-sm text-slate-400 leading-relaxed">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TextField({
  label,
  type = "text",
  placeholder,
  icon: Icon,
  value,
  onChange,
  required = false,
}: {
  label: string;
  type?: string;
  placeholder: string;
  icon: React.ElementType;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
        {label}
        {required && <span className="text-blue-400">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
          autoComplete="off"
        />
      </div>
    </div>
  );
}

function YearSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
        Year of Study <span className="text-blue-400">*</span>
      </label>
      <div className="relative">
        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none z-10" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors appearance-none"
          required
        >
          <option value="" disabled className="bg-[#0d0d1a]">Select Year</option>
          {yearOptions.map((y) => (
            <option key={y} value={y} className="bg-[#0d0d1a]">{y}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
      </div>
    </div>
  );
}

function AcmVerifyField({
  value,
  status,
  verifiedName,
  onChange,
  onVerify,
}: {
  value: string;
  status: AcmStatus;
  verifiedName: string;
  onChange: (value: string) => void;
  onVerify: () => void;
}) {
  const statusConfig = {
    idle: null,
    verifying: null,
    valid: { icon: BadgeCheck, color: "text-emerald-400", msg: `Verified: ${verifiedName}` },
    invalid: { icon: XCircle, color: "text-red-400", msg: "ACM Membership ID is invalid." },
    already_registered: { icon: XCircle, color: "text-amber-400", msg: "This ACM ID is already used in another registration." },
  }[status];

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
        ACM Membership ID
        <span className="text-slate-600 text-xs">(optional — both verified = ₹50)</span>
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="e.g. 4266905"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border text-slate-200 placeholder:text-slate-600 text-sm focus:outline-none focus:ring-1 transition-colors ${
              status === "valid"
                ? "border-emerald-500/50 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                : status === "invalid" || status === "already_registered"
                ? "border-red-500/40 focus:border-red-500/40 focus:ring-red-500/20"
                : "border-white/10 focus:border-blue-500/50 focus:ring-blue-500/20"
            }`}
            autoComplete="off"
          />
        </div>
        <button
          type="button"
          onClick={onVerify}
          disabled={status === "verifying" || !value.trim()}
          className="px-3 py-2.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-medium hover:bg-blue-600/30 hover:border-blue-400/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all whitespace-nowrap flex items-center gap-1.5"
        >
          {status === "verifying" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <BadgeCheck className="w-3.5 h-3.5" />
          )}
          {status === "verifying" ? "Verifying…" : "Verify ID"}
        </button>
      </div>
      {statusConfig && (
        <p className={`text-xs flex items-center gap-1 ${statusConfig.color}`}>
          <statusConfig.icon className="w-3.5 h-3.5 flex-shrink-0" />
          {statusConfig.msg}
        </p>
      )}
    </div>
  );
}


export default function Registration() {
  const [teamName, setTeamName] = useState("");
  const [lead, setLead] = useState<LeadForm>(emptyLead());
  const [member2, setMember2] = useState<MemberForm>(emptyMember());
  const [googleFormChecked, setGoogleFormChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const updateLead = (field: keyof LeadForm, value: string) => {
    setLead((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "acmMemberId") { updated.acmStatus = "idle"; updated.acmVerifiedName = ""; }
      return updated;
    });
  };

  const updateMember2 = (field: keyof MemberForm, value: string) => {
    setMember2((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "acmMemberId") { updated.acmStatus = "idle"; updated.acmVerifiedName = ""; }
      return updated;
    });
  };

  const verifyAcm = async (who: "lead" | "member2") => {
    const id = who === "lead" ? lead.acmMemberId : member2.acmMemberId;
    if (!id.trim()) return;

    const setStatus = (status: AcmStatus, name = "") => {
      if (who === "lead") setLead((p) => ({ ...p, acmStatus: status, acmVerifiedName: name }));
      else setMember2((p) => ({ ...p, acmStatus: status, acmVerifiedName: name }));
    };

    setStatus("verifying");
    try {
      const res = await fetch(`/api/verify-acm?id=${encodeURIComponent(id.trim())}`);
      const data = await res.json();
      if (data.valid) {
        setStatus("valid", data.name);
        toast.success(`ACM ID verified: ${data.name}`);
      } else if (data.reason === "already_registered") {
        setStatus("already_registered", data.name || "");
        toast.error("This ACM ID is already used in another registration.");
      } else {
        setStatus("invalid");
        toast.error("Invalid ACM Membership ID.");
      }
    } catch {
      setStatus("idle");
      toast.error("Verification failed. Please try again.");
    }
  };

  const bothAcmVerified = lead.acmStatus === "valid" && member2.acmStatus === "valid";
  const fee = bothAcmVerified ? 50 : 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleFormChecked) {
      toast.error("Please submit the payment Google Form and check the confirmation box.");
      return;
    }
    if (lead.acmMemberId.trim() && lead.acmStatus !== "valid") {
      toast.error("Student 1: Please verify your ACM Membership ID before submitting.");
      return;
    }
    if (member2.acmMemberId.trim() && member2.acmStatus !== "valid") {
      toast.error("Student 2: Please verify your ACM Membership ID before submitting.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName,
          lead: {
            name: lead.name,
            usn: lead.usn,
            branch: lead.branch,
            year: lead.year,
            email: lead.email,
            phone: lead.phone,
            acmMemberId: lead.acmStatus === "valid" ? lead.acmMemberId : null,
          },
          member2: {
            name: member2.name,
            usn: member2.usn,
            branch: member2.branch,
            year: member2.year,
            acmMemberId: member2.acmStatus === "valid" ? member2.acmMemberId : null,
          },
          registrationFee: fee,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Something went wrong.");
      } else {
        setSubmitted(true);
        setTeamName("");
        setLead(emptyLead());
        setMember2(emptyMember());
        setGoogleFormChecked(false);
        toast.success(data.message || "Registered successfully!");
      }
    } catch {
      toast.error("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="register" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="mt-2 text-4xl font-bold text-white">Register & Connect</h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto">
            Secure your spot at CodeGolf 2.0. Limited seats available.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Registration form — col span 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="glass-card glow-border p-8">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-400" />
                Registration Form
              </h3>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-12 text-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h4 className="text-xl font-bold text-white">You&apos;re Registered!</h4>
                    <p className="text-slate-400 text-sm max-w-sm">
                      See you at CodeGolf 2.0 on March 12, 2026. Keep an eye on your email for
                      event details.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-2 font-almendra text-xs uppercase tracking-widest text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:border-blue-400/40 px-4 py-1.5 rounded-md transition-all duration-200"
                    >
                      Register another team
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Team Name */}
                    <TextField
                      label="Team Name"
                      placeholder="e.g. Team Segfault"
                      icon={Users}
                      value={teamName}
                      onChange={setTeamName}
                      required
                    />

                    {/* ── Student 1 (Lead) ── */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-white/5" />
                        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider px-2">
                          Student 1 (Lead)
                        </span>
                        <div className="h-px flex-1 bg-white/5" />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <TextField label="Full Name" placeholder="John Doe" icon={User} value={lead.name} onChange={(v) => updateLead("name", v)} required />
                        <TextField label="USN" placeholder="1MS23CS001" icon={Hash} value={lead.usn} onChange={(v) => updateLead("usn", v)} required />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <TextField label="Branch / Department" placeholder="Computer Science" icon={BookOpen} value={lead.branch} onChange={(v) => updateLead("branch", v)} required />
                        <YearSelect value={lead.year} onChange={(v) => updateLead("year", v)} />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <TextField label="Email Address" type="email" placeholder="you@example.com" icon={Mail} value={lead.email} onChange={(v) => updateLead("email", v)} required />
                        <TextField label="Phone Number" type="tel" placeholder="9876543210" icon={Phone} value={lead.phone} onChange={(v) => updateLead("phone", v)} required />
                      </div>
                      <AcmVerifyField value={lead.acmMemberId} status={lead.acmStatus} verifiedName={lead.acmVerifiedName} onChange={(v) => updateLead("acmMemberId", v)} onVerify={() => verifyAcm("lead")} />
                    </div>

                    {/* ── Student 2 ── */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-white/5" />
                        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider px-2">
                          Student 2
                        </span>
                        <div className="h-px flex-1 bg-white/5" />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <TextField label="Full Name" placeholder="Jane Doe" icon={User} value={member2.name} onChange={(v) => updateMember2("name", v)} required />
                        <TextField label="USN" placeholder="1MS23CS002" icon={Hash} value={member2.usn} onChange={(v) => updateMember2("usn", v)} required />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <TextField label="Branch / Department" placeholder="Computer Science" icon={BookOpen} value={member2.branch} onChange={(v) => updateMember2("branch", v)} required />
                        <YearSelect value={member2.year} onChange={(v) => updateMember2("year", v)} />
                      </div>
                      <AcmVerifyField value={member2.acmMemberId} status={member2.acmStatus} verifiedName={member2.acmVerifiedName} onChange={(v) => updateMember2("acmMemberId", v)} onVerify={() => verifyAcm("member2")} />
                    </div>

                    {/* Fee Banner */}
                    <div className={`rounded-lg px-4 py-3 flex items-center justify-between border text-sm transition-all duration-500 ${
                      bothAcmVerified
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        : "bg-white/4 border-white/10 text-slate-400"
                    }`}>
                      <span>
                        {bothAcmVerified
                          ? "ACM member discount applied — both members verified!"
                          : "Verify both ACM IDs to get the ₹50 member discount."}
                      </span>
                      <span className="font-bold text-base ml-4 shrink-0">₹{fee}</span>
                    </div>

                    {/* Google Form Payment */}
                    <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 space-y-3">
                      <p className="text-sm text-slate-300 font-medium">Payment Submission</p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Pay ₹{fee} via UPI and submit your payment screenshot along with your team name using the Google Form below. Registration is confirmed only after payment verification.
                      </p>
                      <a
                        href={GOOGLE_FORM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/25 hover:border-blue-400/40 px-3 py-2 rounded-md transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open Payment Submission Form
                      </a>
                      <label className="flex items-start gap-2.5 cursor-pointer group mt-1">
                        <input
                          type="checkbox"
                          checked={googleFormChecked}
                          onChange={(e) => setGoogleFormChecked(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded accent-blue-500 cursor-pointer"
                        />
                        <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
                          I have submitted my payment screenshot to the Google Form
                        </span>
                      </label>
                    </div>

                    {/* Submit */}
                    <div className="pt-1">
                      <motion.button
                        type="submit"
                        disabled={loading || !googleFormChecked}
                        className="group relative w-full flex items-center justify-center gap-2.5 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-almendra uppercase tracking-widest text-sm transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] overflow-hidden"
                        whileHover={!loading && googleFormChecked ? { scale: 1.02 } : {}}
                        whileTap={!loading && googleFormChecked ? { scale: 0.98 } : {}}
                      >
                        <span className="relative z-10 flex items-center gap-2.5">
                          {loading ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Registering...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Register for CodeGolf 2.0
                            </>
                          )}
                        </span>
                        {!loading && googleFormChecked && (
                          <span className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-white/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        )}
                      </motion.button>
                      {!googleFormChecked && (
                        <p className="text-xs text-amber-400/80 text-center mt-2">
                          Submit the payment Google Form and check the box above to enable registration.
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 text-center">
                      Fields marked with <span className="text-blue-400">*</span> are required.
                      Your data is stored securely.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          {/* Right side — FAQ + Contact — col span 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* FAQ */}
            <div className="glass-card p-6 border border-white/8">
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                Frequently Asked
              </h3>
              <div>
                {faqs.map((faq) => (
                  <FAQItem
                    key={faq.id}
                    item={faq}
                    isOpen={openFaq === faq.id}
                    onToggle={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  />
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="glass-card p-6 border border-white/8">
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                Contact & Organizers
              </h3>
              <div className="space-y-4">
                {/* Faculty Coordinator */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/8 border border-blue-500/20">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 text-xs font-bold">FC</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Dr. Jamuna S Murthy</p>
                    <p className="text-xs text-blue-400/80">Faculty Coordinator</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-mono">
                    Event Coordinators
                  </p>
                  {[
                    { name: "Mayeraa Singh", role: "Event Coordinator", phone: "+91 9606973155" },
                    { name: "Swanand Gadwe", role: "Technical Lead", phone: "+91 6364097357" },
                  ].map((person) => (
                    <div
                      key={person.name}
                      className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-bold text-white">{person.name}</p>
                        <p className="text-xs text-slate-400">{person.role}</p>
                      </div>
                      <a
                        href={`tel:${person.phone.replace(/\s/g, "")}`}
                        className="text-xs font-mono font-semibold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-md"
                      >
                        {person.phone}
                      </a>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-mono">
                    Email
                  </p>
                  <a
                    href="mailto:acm.ritb@gmail.com"
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors group"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    acm.ritb@gmail.com
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>

                <div className="pt-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-mono">
                    Organized by
                  </p>
                  <p className="text-sm text-slate-300 font-medium">ACM Student Chapter</p>
                  <p className="text-xs text-slate-500">RIT Bengaluru</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-20 border-t border-white/5 pt-8 text-center"
      >
        <p className="text-slate-600 text-sm font-mono">
          © 2026 ACM Student Chapter · CodeGolf 2.0 · Built with{" "}
          <span className="text-blue-400">{"</>"}</span>
        </p>
      </motion.div>
    </section>
  );
}

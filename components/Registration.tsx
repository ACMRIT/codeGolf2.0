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
} from "lucide-react";

interface FormData {
  name: string;
  studentId: string;
  branch: string;
  year: string;
  email: string;
  phone: string;
  acmMemberId: string;
}

const initialForm: FormData = {
  name: "",
  studentId: "",
  branch: "",
  year: "",
  email: "",
  phone: "",
  acmMemberId: "",
};

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
      "Both! Round 1 is individual. Top performers advance to the Surprise Round — the format is revealed on the day of the event. Expect the unexpected!",
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

function InputField({
  label,
  name,
  type = "text",
  placeholder,
  icon: Icon,
  value,
  onChange,
  required = false,
}: {
  label: string;
  name: keyof FormData;
  type?: string;
  placeholder: string;
  icon: React.ElementType;
  value: string;
  onChange: (name: keyof FormData, value: string) => void;
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
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
          autoComplete="off"
        />
      </div>
    </div>
  );
}

export default function Registration() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const handleChange = (name: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Something went wrong.");
      } else {
        setSubmitted(true);
        setForm(initialForm);
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
          <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">
            // section 05
          </span>
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
                      Register another participant
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <InputField
                        label="Full Name"
                        name="name"
                        placeholder="John Doe"
                        icon={User}
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                      <InputField
                        label="Student ID / USN"
                        name="studentId"
                        placeholder="1RI21CS001"
                        icon={Hash}
                        value={form.studentId}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <InputField
                        label="Branch / Department"
                        name="branch"
                        placeholder="Computer Science"
                        icon={BookOpen}
                        value={form.branch}
                        onChange={handleChange}
                        required
                      />
                      {/* Year of Study — select */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
                          Year of Study <span className="text-blue-400">*</span>
                        </label>
                        <div className="relative">
                          <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none z-10" />
                          <select
                            value={form.year}
                            onChange={(e) => handleChange("year", e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors appearance-none"
                            required
                          >
                            <option value="" disabled className="bg-[#0d0d1a]">
                              Select Year
                            </option>
                            {yearOptions.map((y) => (
                              <option key={y} value={y} className="bg-[#0d0d1a]">
                                {y}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <InputField
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        icon={Mail}
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                      <InputField
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        placeholder="9876543210"
                        icon={Phone}
                        value={form.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <InputField
                      label="ACM Membership ID (Optional)"
                      name="acmMemberId"
                      placeholder="ACM-XXXXXXXX"
                      icon={CreditCard}
                      value={form.acmMemberId}
                      onChange={handleChange}
                    />

                    <div className="pt-2">
                      <motion.button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex items-center justify-center gap-2.5 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-almendra uppercase tracking-widest text-sm transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] overflow-hidden"
                        whileHover={!loading ? { scale: 1.02 } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
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
                        {!loading && <span className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-white/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />}
                      </motion.button>
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

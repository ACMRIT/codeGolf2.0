"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
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
  CheckCircle,
  ArrowLeft,
  Users,
  IndianRupee,
  Tag,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface StudentData {
  name: string;
  usn: string;
  branch: string;
  year: string;
  email: string;
  phone: string;
  acmMemberId: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const yearOptions = ["1st Year", "2nd Year", "3rd Year"];

const VALID_ACM_IDS = new Set([
  "4266905", "1076965", "5601374", "6890167", "4695167",
  "655603",  "2422614", "3927235", "9564698", "2336746",
  "740830",  "7150123", "4113150", "6885030", "2166279",
  "4974272", "2101131", "2185690", "4344093", "3077719",
]);

const emptyStudent = (): StudentData => ({
  name: "",
  usn: "",
  branch: "",
  year: "",
  email: "",
  phone: "",
  acmMemberId: "",
});

const USN_REGEX = /^\d[A-Z]{2}\d{2}[A-Z]{2,3}\d{3}$/i;

// ── Sub-components ────────────────────────────────────────────────────────────

function InputField({
  label,
  type = "text",
  placeholder,
  icon: Icon,
  value,
  onChange,
  required = false,
  hint,
}: {
  label: string;
  type?: string;
  placeholder: string;
  icon: React.ElementType;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
        {label}
        {required && <span className="text-blue-400">*</span>}
        {hint && <span className="text-slate-600 font-normal ml-1">{hint}</span>}
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

function YearSelect({
  value,
  onChange,
  required = false,
}: {
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
        Year of Study {required && <span className="text-blue-400">*</span>}
      </label>
      <div className="relative">
        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none z-10" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors appearance-none"
          required={required}
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

function StudentSection({
  index,
  data,
  onChange,
}: {
  index: 1 | 2;
  data: StudentData;
  onChange: (field: keyof StudentData, value: string) => void;
}) {
  const label = index === 1 ? "Student 1 — Team Lead" : "Student 2";

  return (
    <div className="space-y-4">
      {/* Section heading */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
          <Users className="w-3 h-3 text-blue-400" />
        </div>
        <span className="text-sm font-semibold text-white">{label}</span>
        <span className="ml-auto text-xs font-mono text-blue-500/70 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
          required
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <InputField
          label="Full Name"
          placeholder={index === 1 ? "Arjun Kumar" : "Priya Sharma"}
          icon={User}
          value={data.name}
          onChange={(v) => onChange("name", v)}
          required
        />
        <InputField
          label="USN"
          placeholder="1MS23CS001"
          icon={Hash}
          value={data.usn}
          onChange={(v) => onChange("usn", v)}
          required
          hint="e.g. 1MS23CS001"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <InputField
          label="Branch / Department"
          placeholder="Computer Science"
          icon={BookOpen}
          value={data.branch}
          onChange={(v) => onChange("branch", v)}
          required
        />
        <YearSelect value={data.year} onChange={(v) => onChange("year", v)} required />
      </div>

      {index === 1 && (
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField
            label="Email Address"
            type="email"
            placeholder="arjun@example.com"
            icon={Mail}
            value={data.email}
            onChange={(v) => onChange("email", v)}
            required
          />
          <InputField
            label="Phone Number"
            type="tel"
            placeholder="9876543210"
            icon={Phone}
            value={data.phone}
            onChange={(v) => onChange("phone", v)}
            required
          />
        </div>
      )}

      <InputField
        label="ACM Membership ID"
        placeholder="ACM-XXXXXXXX"
        icon={CreditCard}
        value={data.acmMemberId}
        onChange={(v) => onChange("acmMemberId", v)}
        hint="(optional — affects registration fee)"
      />
    </div>
  );
}

// ── Fee banner ────────────────────────────────────────────────────────────────

function FeeBanner({ fee, hasDiscount }: { fee: number; hasDiscount: boolean }) {
  return (
    <motion.div
      key={fee}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
        hasDiscount
          ? "bg-emerald-500/8 border-emerald-500/25"
          : "bg-blue-500/8 border-blue-500/20"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${
          hasDiscount ? "bg-emerald-500/15" : "bg-blue-500/15"
        }`}
      >
        <IndianRupee
          className={`w-4 h-4 ${hasDiscount ? "text-emerald-400" : "text-blue-400"}`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400">
          Registration Fee
          {hasDiscount && (
            <span className="ml-2 inline-flex items-center gap-1 text-emerald-400">
              <Tag className="w-3 h-3" /> ACM member discount applied
            </span>
          )}
        </p>
        <p className={`text-lg font-bold ${hasDiscount ? "text-emerald-300" : "text-white"}`}>
          ₹{fee}{" "}
          {hasDiscount && (
            <span className="text-sm font-normal line-through text-slate-600">₹100</span>
          )}
        </p>
      </div>
      <p className="text-xs text-slate-500 text-right hidden sm:block">
        per team · scan QR to pay
      </p>
    </motion.div>
  );
}

// ── QR Panel ──────────────────────────────────────────────────────────────────

function QRPanel({ fee }: { fee: number }) {
  return (
    <div className="glass-card border border-white/8 rounded-2xl p-6 flex flex-col items-center gap-4">
      <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
        Scan to Pay
      </p>
      <div className="relative rounded-xl overflow-hidden border border-white/10 bg-white p-2">
        <Image
          src="/qr.png"
          alt="Payment QR Code"
          width={200}
          height={200}
          className="rounded-lg object-contain"
          priority
        />
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-white">₹{fee}</p>
        <p className="text-xs text-slate-500 mt-1">
          Pay first, share screenshot on{" "}
          <a
            href="https://wa.me/919606973155"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
          >
            WhatsApp
          </a>
          , then register
        </p>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const [student1, setStudent1] = useState<StudentData>(emptyStudent());
  const [student2, setStudent2] = useState<StudentData>(emptyStudent());
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  const hasAcm =
    (student1.acmMemberId.trim().length > 0 && VALID_ACM_IDS.has(student1.acmMemberId.trim())) ||
    (student2.acmMemberId.trim().length > 0 && VALID_ACM_IDS.has(student2.acmMemberId.trim()));
  const fee = hasAcm ? 50 : 100;

  function update1(field: keyof StudentData, value: string) {
    setStudent1((p) => ({ ...p, [field]: value }));
  }
  function update2(field: keyof StudentData, value: string) {
    setStudent2((p) => ({ ...p, [field]: value }));
  }

  function validate(): string | null {
    // Student 1
    if (!student1.name.trim() || student1.name.trim().length < 2)
      return "Student 1: Full name is required.";
    if (!USN_REGEX.test(student1.usn.trim()))
      return "Student 1: USN must follow format like 1MS23CS001.";
    if (!student1.branch.trim()) return "Student 1: Branch is required.";
    if (!student1.year) return "Student 1: Year of study is required.";
    if (!student1.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student1.email))
      return "Student 1: A valid email is required.";
    if (!student1.phone || !/^[6-9]\d{9}$/.test(student1.phone.replace(/\s/g, "")))
      return "Student 1: A valid 10-digit Indian phone number is required.";

    // Student 2
    if (!student2.name.trim() || student2.name.trim().length < 2)
      return "Student 2: Full name is required.";
    if (!USN_REGEX.test(student2.usn.trim()))
      return "Student 2: USN must follow format like 1MS23CS001.";
    if (!student2.branch.trim()) return "Student 2: Branch is required.";
    if (!student2.year) return "Student 2: Year of study is required.";

    if (student1.usn.trim().toUpperCase() === student2.usn.trim().toUpperCase())
      return "Both students cannot have the same USN.";

    // ACM ID validation
    if (student1.acmMemberId.trim() && !VALID_ACM_IDS.has(student1.acmMemberId.trim()))
      return "Student 1: ACM Membership ID is not valid. Please check and re-enter.";
    if (student2.acmMemberId.trim() && !VALID_ACM_IDS.has(student2.acmMemberId.trim()))
      return "Student 2: ACM Membership ID is not valid. Please check and re-enter.";

    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err, { duration: 4500 });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        lead: {
          name: student1.name.trim(),
          usn: student1.usn.trim().toUpperCase(),
          branch: student1.branch.trim(),
          year: student1.year,
          email: student1.email.toLowerCase().trim(),
          phone: student1.phone.trim(),
          acmMemberId: student1.acmMemberId.trim() || null,
        },
        member2: {
          name: student2.name.trim(),
          usn: student2.usn.trim().toUpperCase(),
          branch: student2.branch.trim(),
          year: student2.year,
          acmMemberId: student2.acmMemberId.trim() || null,
        },
        member3: null,
        registrationFee: fee,
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Something went wrong.", { duration: 5000 });
      } else {
        setSubmittedName(student1.name.trim());
        setSubmitted(true);
        setStudent1(emptyStudent());
        setStudent2(emptyStudent());
        toast.success("Registration successful!", {
          description: `2 members registered. See you at CodeGolf 2.0!`,
          duration: 6000,
          icon: "🎉",
        });
      }
    } catch {
      toast.error("Network error. Please check your connection.", { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060914] text-white">
      {/* Mesh bg */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-sky-900/10 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0c0f14]/90 backdrop-blur-md">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/acm-logo.png"
              alt="ACM Student Chapter"
              width={180}
              height={56}
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 font-almendra text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">

          {/* Page heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="mt-2 text-4xl font-bold text-white tracking-tight">
              Team Registration
            </h1>
            <p className="mt-3 text-slate-400 text-sm max-w-md mx-auto">
              Register your team of 2. Both members are required. If either holds an ACM membership, the fee drops to ₹50.
            </p>
          </motion.div>

          {/* ── Pay-first notice ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mb-10 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5 sm:p-6"
          >
            <p className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-3">// before you register</p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Step 1 */}
              <div className="flex gap-3 flex-1">
                <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-400 text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Scan &amp; Pay</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Pay <span className="text-white font-bold">₹{fee}</span> using the QR code on this page.
                    {hasAcm && <span className="text-emerald-400"> (ACM discount applied)</span>}
                  </p>
                </div>
              </div>
              {/* Step 2 */}
              <div className="flex gap-3 flex-1">
                <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-400 text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Share Screenshot</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Send your payment screenshot to coordinator on{" "}
                    <a
                      href="https://wa.me/919606973155"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.558 4.14 1.535 5.874L.057 23.93l6.231-1.453A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.791 9.791 0 01-5.021-1.384l-.36-.214-3.698.863.927-3.595-.234-.369A9.772 9.772 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                      </svg>
                      WhatsApp Mayeraa Singh
                    </a>
                  </p>
                </div>
              </div>
              {/* Step 3 */}
              <div className="flex gap-3 flex-1">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Fill &amp; Submit</p>
                  <p className="text-xs text-slate-400 mt-0.5">Fill the registration form below and submit once payment is confirmed.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Two-column layout: form + QR */}
          <div className="grid lg:grid-cols-3 gap-8 items-start">

            {/* ── Form col (2/3) ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="glass-card glow-border p-8 rounded-2xl">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    /* ── Success ── */
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center justify-center py-14 text-center gap-5"
                    >
                      <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-emerald-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">You&apos;re In!</h2>
                        <p className="mt-2 text-slate-400 text-sm max-w-sm">
                          <span className="text-white font-medium">{submittedName}</span>&apos;s
                          team is registered for CodeGolf 2.0. See you on March 12, 2026!
                        </p>
                      </div>
                      {/* WhatsApp group CTA */}
                      <a
                        href="https://chat.whatsapp.com/LyN96l7IDUh1GqcXaI7hl2?mode=gi_t"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors duration-200"
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.558 4.14 1.535 5.874L.057 23.93l6.231-1.453A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.791 9.791 0 01-5.021-1.384l-.36-.214-3.698.863.927-3.595-.234-.369A9.772 9.772 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                        </svg>
                        Join CodeGolf WhatsApp Group
                      </a>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => setSubmitted(false)}
                          className="font-almendra text-xs uppercase tracking-widest text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:border-blue-400/40 px-5 py-2 rounded-md transition-all duration-200"
                        >
                          Register another team
                        </button>
                        <Link
                          href="/"
                          className="font-almendra text-xs uppercase tracking-widest text-slate-400 hover:text-white border border-white/10 hover:border-white/20 px-5 py-2 rounded-md transition-all duration-200 text-center"
                        >
                          Back to Home
                        </Link>
                      </div>
                    </motion.div>
                  ) : (
                    /* ── Form ── */
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-8"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <StudentSection index={1} data={student1} onChange={update1} />

                      {/* Divider */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-white/8" />
                        <span className="text-xs font-mono text-slate-600 uppercase tracking-widest">
                          Student 2
                        </span>
                        <div className="flex-1 h-px bg-white/8" />
                      </div>

                      <StudentSection index={2} data={student2} onChange={update2} />

                      {/* Fee banner */}
                      <FeeBanner fee={fee} hasDiscount={hasAcm} />

                      {/* Submit */}
                      <div className="pt-1">
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
                                Register Team · ₹{fee}
                              </>
                            )}
                          </span>
                          {!loading && (
                            <span className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-white/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                          )}
                        </motion.button>
                      </div>

                      <p className="text-xs text-slate-600 text-center">
                        Fields marked with <span className="text-blue-400">*</span> are required. Pay the registration fee via the QR code after submitting.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* ── QR col (1/3) ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1 lg:sticky lg:top-28"
            >
              <QRPanel fee={fee} />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}


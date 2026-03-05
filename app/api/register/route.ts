import { NextRequest, NextResponse } from "next/server";
import getClientPromise from "@/lib/mongodb";

interface MemberData {
  name: string;
  usn: string;
  branch: string;
  year: string;
  acmMemberId?: string | null;
}

interface LeadData extends MemberData {
  email: string;
  phone: string;
}

interface TeamPayload {
  lead: LeadData;
  member2: MemberData;
  member3: null;
  registrationFee: number;
}

const USN_REGEX = /^\d[A-Z]{2}\d{2}[A-Z]{2,3}\d{3}$/i;

function validateTeam(payload: Partial<TeamPayload>): string | null {
  const { lead, member2 } = payload;

  if (!lead) return "Lead member details are required.";
  if (!lead.name || lead.name.trim().length < 2)
    return "Student 1: Full name is required.";
  if (!USN_REGEX.test((lead.usn || "").trim()))
    return "Student 1: USN must follow format like 1MS23CS001.";
  if (!lead.branch || lead.branch.trim().length < 2)
    return "Student 1: Branch is required.";
  if (!lead.year) return "Student 1: Year of study is required.";
  if (!lead.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email))
    return "Student 1: A valid email is required.";
  if (!lead.phone || !/^[6-9]\d{9}$/.test(lead.phone.replace(/\s/g, "")))
    return "Student 1: A valid 10-digit Indian phone number is required.";

  if (!member2) return "Student 2 details are required.";
  if (!member2.name || member2.name.trim().length < 2)
    return "Student 2: Full name is required.";
  if (!USN_REGEX.test((member2.usn || "").trim()))
    return "Student 2: USN must follow format like 1MS23CS001.";
  if (!member2.branch || member2.branch.trim().length < 2)
    return "Student 2: Branch is required.";
  if (!member2.year) return "Student 2: Year of study is required.";

  if (lead.usn.trim().toUpperCase() === member2.usn.trim().toUpperCase())
    return "Both students cannot have the same USN.";

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<TeamPayload>;

    const validationError = validateTeam(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { lead, member2, registrationFee } = body as TeamPayload;

    const client = await getClientPromise();
    const db = client.db("codegolf");
    const collection = db.collection("codegolf_registrations");

    const existing = await collection.findOne({
      $or: [
        { "lead.email": lead.email.toLowerCase().trim() },
        { "lead.usn": lead.usn.trim().toUpperCase() },
        { "member2.usn": lead.usn.trim().toUpperCase() },
        { "lead.usn": member2.usn.trim().toUpperCase() },
        { "member2.usn": member2.usn.trim().toUpperCase() },
      ],
    });
    if (existing) {
      // Identify which field caused the conflict for a clear error message
      const leadUsn = lead.usn.trim().toUpperCase();
      const mem2Usn = member2.usn.trim().toUpperCase();
      if (
        existing.lead?.usn === leadUsn ||
        existing.member2?.usn === leadUsn
      ) {
        return NextResponse.json(
          { error: `USN ${leadUsn} is already registered.` },
          { status: 409 }
        );
      }
      if (
        existing.lead?.usn === mem2Usn ||
        existing.member2?.usn === mem2Usn
      ) {
        return NextResponse.json(
          { error: `USN ${mem2Usn} is already registered.` },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "This email is already registered." },
        { status: 409 }
      );
    }

    const hasAcm =
      !!(lead.acmMemberId?.trim()) || !!(member2.acmMemberId?.trim());

    const registration = {
      lead: {
        name: lead.name.trim(),
        usn: lead.usn.trim().toUpperCase(),
        branch: lead.branch.trim(),
        year: lead.year,
        email: lead.email.toLowerCase().trim(),
        phone: lead.phone.trim(),
        acmMemberId: lead.acmMemberId?.trim() || null,
      },
      member2: {
        name: member2.name.trim(),
        usn: member2.usn.trim().toUpperCase(),
        branch: member2.branch.trim(),
        year: member2.year,
        acmMemberId: member2.acmMemberId?.trim() || null,
      },
      member3: null,
      memberCount: 2,
      hasAcmMember: hasAcm,
      registrationFee: hasAcm ? 50 : 100,
      registeredAt: new Date(),
    };

    await collection.insertOne(registration);

    return NextResponse.json(
      { message: "Registration successful! See you at CodeGolf 2.0 🎉" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "CodeGolf 2.0 Registration API" });
}

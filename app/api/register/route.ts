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
  teamName: string;
  transactionId: string;
  lead: LeadData;
  member2: MemberData;
  registrationFee: number;
}

const USN_REGEX = /^\d[A-Z]{2}\d{2}[A-Z]{2,3}\d{3}$/i;

function validateTeam(payload: Partial<TeamPayload>): string | null {
  const { teamName, transactionId, lead, member2 } = payload;

  if (!teamName || teamName.trim().length < 2)
    return "Team name is required.";

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

    const { teamName, transactionId, lead, member2, registrationFee } = body as TeamPayload;

    const client = await getClientPromise();
    const db = client.db("ACM_RIT");
    const collection = db.collection("codeGolf2.0");
    const membersCollection = db.collection("members");

    // Registration cap: reject once 140 teams are registered
    const teamCount = await collection.countDocuments();
    if (teamCount >= 150) {
      return NextResponse.json(
        { error: "REGISTRATION_CLOSED" },
        { status: 403 }
      );
    }

    // Validate ACM IDs against DB if provided
    if (lead.acmMemberId?.trim()) {
      const member = await membersCollection.findOne({ member_id: lead.acmMemberId.trim() });
      if (!member) {
        return NextResponse.json({ error: "Student 1: ACM Membership ID is not valid." }, { status: 400 });
      }
    }
    if (member2.acmMemberId?.trim()) {
      const member = await membersCollection.findOne({ member_id: member2.acmMemberId.trim() });
      if (!member) {
        return NextResponse.json({ error: "Student 2: ACM Membership ID is not valid." }, { status: 400 });
      }
    }

    // Check ACM IDs are not already used in another registration (race condition guard)
    if (lead.acmMemberId?.trim()) {
      const acmTaken = await collection.findOne({
        $or: [
          { "lead.acmMemberId": lead.acmMemberId.trim() },
          { "member2.acmMemberId": lead.acmMemberId.trim() },
        ],
      });
      if (acmTaken) {
        return NextResponse.json(
          { error: "Student 1: This ACM Membership ID is already used in another registration." },
          { status: 409 }
        );
      }
    }
    if (member2.acmMemberId?.trim()) {
      const acmTaken = await collection.findOne({
        $or: [
          { "lead.acmMemberId": member2.acmMemberId.trim() },
          { "member2.acmMemberId": member2.acmMemberId.trim() },
        ],
      });
      if (acmTaken) {
        return NextResponse.json(
          { error: "Student 2: This ACM Membership ID is already used in another registration." },
          { status: 409 }
        );
      }
    }

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

    // Both must have valid ACM IDs for the ₹50 member discount
    const hasAcm = !!(lead.acmMemberId?.trim() && member2.acmMemberId?.trim());

    const registration = {
      teamName: teamName.trim(),
      transactionId: transactionId.trim(),
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

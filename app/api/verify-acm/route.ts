import { NextRequest, NextResponse } from "next/server";
import getClientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  const memberId = req.nextUrl.searchParams.get("id");
  if (!memberId?.trim()) {
    return NextResponse.json({ error: "Member ID is required" }, { status: 400 });
  }

  try {
    const client = await getClientPromise();
    const db = client.db("ACM_RIT");
    const membersCollection = db.collection("members");
    const registrationsCollection = db.collection("codeGolf2.0");

    const member = await membersCollection.findOne({ member_id: memberId.trim() });
    if (!member) {
      return NextResponse.json({ valid: false, reason: "invalid" });
    }

    const alreadyRegistered = await registrationsCollection.findOne({
      $or: [
        { "lead.acmMemberId": memberId.trim() },
        { "member2.acmMemberId": memberId.trim() },
      ],
    });

    if (alreadyRegistered) {
      return NextResponse.json({
        valid: false,
        reason: "already_registered",
        name: `${member.first_name} ${member.last_name}`,
      });
    }

    return NextResponse.json({
      valid: true,
      name: `${member.first_name} ${member.last_name}`,
    });
  } catch (error) {
    console.error("ACM verify error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

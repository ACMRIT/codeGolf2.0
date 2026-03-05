import { NextRequest, NextResponse } from "next/server";
import getClientPromise from "@/lib/mongodb";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function GET(req: NextRequest) {
  const pw = req.nextUrl.searchParams.get("pw");
  if (pw !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await getClientPromise();
    const db = client.db("codegolf");
    const collection = db.collection("codegolf_registrations");

    const teams = await collection
      .find({}, { projection: { _id: 0 } })
      .sort({ registeredAt: -1 })
      .toArray();

    return NextResponse.json({ count: teams.length, teams });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

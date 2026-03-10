import { NextResponse } from "next/server";
import getClientPromise from "@/lib/mongodb";

const REGISTRATION_CAP = 140;

export async function GET() {
  try {
    const client = await getClientPromise();
    const collection = client.db("ACM_RIT").collection("codeGolf2.0");
    const count = await collection.countDocuments();
    return NextResponse.json({ count, full: count >= REGISTRATION_CAP });
  } catch {
    return NextResponse.json({ count: 0, full: false }, { status: 500 });
  }
}

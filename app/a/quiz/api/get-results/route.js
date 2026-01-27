import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("dosha_quiz");
    const collection = db.collection("quiz_results");

    const results = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ message: "Internal server error" });
  }
}

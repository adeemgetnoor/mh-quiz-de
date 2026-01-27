import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Define which HTTP methods to handle
export const dynamic = 'force-dynamic'; // Disable static optimization
export const runtime = 'nodejs';

// Handle both POST and OPTIONS for CORS
export async function POST(request) {
  // Handle CORS preflight request
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // Accept POST requests regardless of query parameters
  if (request.method !== 'POST') {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("dosha_quiz");
    const collection = db.collection("quiz_results");

    const bodyOfReq = await request.json();

    console.log("Request body:", bodyOfReq);

    const quizData = {
      ...bodyOfReq,
      createdAt: new Date(),
      dateOfBirth: `${bodyOfReq.year}-${bodyOfReq.month.padStart(
        2,
        "0"
      )}-${bodyOfReq.day.padStart(2, "0")}`,
    };

    const result = await collection.insertOne(quizData);

    // Determine dominant dosha
    const { vata, pitta, kapha } = quizData.scores;
    let dominantDosha = "vata";
    let scoreURLText = "vata";

    if (pitta > vata && pitta > kapha) {
      dominantDosha = "pitta";
      scoreURLText = "pitta";
    } else if (kapha > vata && kapha > pitta) {
      dominantDosha = "kapha";
      scoreURLText = "kafa";
    }

    // Check for dual doshas
    const sortedScores = [
      { name: "vata", score: vata },
      { name: "pitta", score: pitta },
      { name: "kapha", score: kapha },
    ].sort((a, b) => b.score - a.score);

    const diff = sortedScores[0].score - sortedScores[1].score;
    if (diff <= 10) {
      // If difference is small, it's a dual dosha
      const combo = [sortedScores[0].name, sortedScores[1].name]
        .sort()
        .join("-");
      scoreURLText = `quiz-result-${combo}`;
    }

    const responseData = {
      success: true,
      id: result.insertedId,
      dominantDosha,
      scoreURLText,
      first_name: quizData.name,
      vata_score: vata,
      pitta_score: pitta,
      kapha_score: kapha,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

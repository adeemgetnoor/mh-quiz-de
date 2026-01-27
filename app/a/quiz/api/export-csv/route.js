import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("dosha_quiz");
    const collection = db.collection("quiz_results");

    const results = await collection.find({}).toArray();

    // Convert to CSV format
    const csvHeaders = [
      "NAME",
      "DATE OF BIRTH",
      "EMAIL ADDRESS",
      "PHONE NO",
      "VATA SCORE",
      "PITTA SCORE",
      "KAPHA SCORE",
      "CREATED TIME",
    ];

    const csvRows = results.map((result) => [
      result.name || "",
      result.dateOfBirth || "",
      result.email || "",
      result.phone || "",
      result.scores?.vata || 0,
      result.scores?.pitta || 0,
      result.scores?.kapha || 0,
      result.createdAt ? new Date(result.createdAt).toLocaleString() : "",
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=dosha-quiz-results.csv",
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function analyzeReviews(reviews: string[]) {
  try {
    const combinedReviews = reviews.join("\n\n");

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a movie review sentiment analyst. Always respond in pure JSON only.",
        },
        {
          role: "user",
          content: `
Analyze the following audience reviews.

Determine the OVERALL majority sentiment.

If most reviews are positive → classify as "Positive".
If clearly divided → "Mixed".
If mostly negative → "Negative".

Return strictly valid JSON:

{
  "summary": "...",
  "sentiment": "Positive | Mixed | Negative"
}

Reviews:
${combinedReviews}
          `,
        },
      ],
      temperature: 0.2,
    });

    const rawContent = response.choices[0].message.content || "";

    // Extract JSON safely
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("No JSON found in AI response");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Groq Parsing Error:", error);

    return {
      summary:
        "Audience feedback is generally positive with strong praise and minor criticism.",
      sentiment: "Mixed",
    };
  }
}

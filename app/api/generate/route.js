import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { input } = await req.json();

    const prompt = `
You are an expert product thinker.

Analyze the input and return ONLY valid JSON.

Format:
[
  {
    "title": "short insight title",
    "points": ["point 1", "point 2"],
    "conflict": "short conflict statement",
    "implication": "what this means for PMs"
  }
]

Rules:
- Return 3-4 insights
- No markdown
- No bold text
- No explanation outside JSON
- Output must be valid JSON

Content:
${input}
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    console.log("OPENAI RESPONSE:", data);

if (!data.choices) {
  return NextResponse.json(
    { error: data.error?.message || "OpenAI failed" },
    { status: 500 }
  );
}

return NextResponse.json({
  result: data.choices[0].message.content,
});
    console.log("FULL OPENAI RESPONSE:", data);

    return NextResponse.json({
      result: data.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
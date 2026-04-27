import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req) {
  try {
    const { input, pmMode } = await req.json();    

    let content = input;

    // ✅ Step 1: Detect URL
    const isUrl = input.startsWith("http");

    if (isUrl) {
      try {
        const page = await fetch(input, {
          headers: {
            "User-Agent": "Mozilla/5.0",
          },
        });

        const html = await page.text();

        // ✅ Step 2: Extract text
        const $ = cheerio.load(html);

        let text = "";

        $("p").each((_, el) => {
          text += $(el).text() + "\n";
        });

        // fallback if extraction fails
        content = text || input;
      } catch (err) {
        console.error("Scraping failed:", err);
        content = input; // fallback
      }
    }

    // ✅ Step 3: Use content instead of raw input
    const prompt = pmMode
    ? `
  You are a sharp product thinker.
  
  Return ONLY valid JSON.
  
  Format:
  [
    {
      "summary": "one-line insight",
      "details": "expanded explanation",
      "conflict": "tension",
      "implication": "what to do"
    }
  ]
  
  Rules:
  - Insights must be sharp, opinionated
  - Ordered by importance
  - No markdown
  - JSON only
  
  Content:
  ${content.slice(0, 8000)}
  `
    : `
  You are an intelligent analyst.
  
  Return ONLY valid JSON.
  
  Format:
  [
    {
      "summary": "one-line key takeaway",
      "details": "clear explanation"
    }
  ]
  
  Rules:
  - Keep insights simple and readable
  - No jargon
  - Ordered by importance or flow
  - No markdown
  - JSON only
  
  Content:
  ${content.slice(0, 8000)}
  `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (!data.choices) {
      return NextResponse.json(
        { error: data.error?.message || "OpenAI failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      result: data.choices[0].message.content,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
import { openai } from "@/lib/openai";
import { buildMonsterDataPrompt } from "@/lib/prompts";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const requestBody = await request.json();
  const { count } = requestBody;

  const completion = await openai.chat.completions.create({
    model: "google/gemini-2.0-flash-001",
    messages: [{ role: "user", content: buildMonsterDataPrompt(count) }],
  });

  let content = completion.choices[0].message.content as string;
  if (content.startsWith("```json")) {
    content = content.slice(7, -3);
  }
  if (content.startsWith("```")) {
    content = content.slice(3, -3);
  }
  try {
    const data = JSON.parse(content);
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Failed to parse monster data", content },
      { status: 400 }
    );
  }
}

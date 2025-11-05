import { openai } from "@/lib/openai";
import { buildMonsterImagePrompt } from "@/lib/prompts";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const monster = await request.json();

  const completion = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash-image",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: buildMonsterImagePrompt(monster) },
          {
            type: "image_url",
            image_url: { url: process.env.EXAMPLE_IMAGE_URL! },
          },
        ],
      },
    ],
  });

  const content = completion.choices[0].message.content as string;
  try {
    const base64 = completion.choices[0].message.images[0].image_url;
    return NextResponse.json({ base64 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to generate monster image: ${error}`, content },
      { status: 400 }
    );
  }
}

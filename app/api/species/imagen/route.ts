import { openai } from "@/lib/openai";
import { buildMonsterImagePrompt } from "@/lib/prompts";
import { NextResponse } from "next/server";
import sharp from "sharp";

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
    const base64BeforeTrim = (completion.choices[0].message as any).images[0]
      .image_url.url;
    const bufferBeforeTrim = Buffer.from(
      base64BeforeTrim.split(",")[1],
      "base64"
    );
    const bufferAfterTrim = await sharp(bufferBeforeTrim)
      .trim()
      .resize(400)
      .toBuffer();
    const base64AfterTrim = bufferAfterTrim.toString("base64");
    return NextResponse.json({
      base64: `data:image/png;base64,${base64AfterTrim}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to generate monster image: ${error}`, content },
      { status: 400 }
    );
  }
}

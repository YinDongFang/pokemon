import { openRouter } from "@/lib/openrouter";
import { buildMonsterDataPrompt } from "@/lib/prompts";

export async function POST(request: Request) {
  const requestBody = await request.json();
  const { count } = requestBody;

  const completion = await openRouter.chat.send({
    model: "google/gemini-2.0-flash-001",
    messages: [{ role: "user", content: buildMonsterDataPrompt(count) }],
    stream: false,
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
    return Response.json({ data });
  } catch {
    return Response.json(
      { error: "Failed to parse monster data", content },
      { status: 400 }
    );
  }
}

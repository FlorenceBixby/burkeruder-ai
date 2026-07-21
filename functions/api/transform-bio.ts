interface Env {
  ANTHROPIC_API_KEY: string;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const { bio } = await request.json() as { bio: string };

  if (!bio?.trim()) {
    return Response.json({ error: "No bio provided." }, { status: 400, headers: CORS });
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `Rewrite the following bio in the style of a Wes Anderson film — precise, deadpan, whimsical, slightly melancholic, with meticulous detail and dry wit. Keep it under 280 characters. Return only the rewritten bio, nothing else.\n\nBio: ${bio}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return Response.json({ error: `API error: ${err}` }, { status: 500, headers: CORS });
  }

  const data = await res.json() as { content: Array<{ text: string }> };
  const transformed = data.content[0]?.text?.trim() ?? "";

  return Response.json({ transformed }, { headers: CORS });
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, { headers: CORS });

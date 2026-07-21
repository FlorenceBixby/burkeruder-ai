interface Env {
  ANTHROPIC_API_KEY: string;
  DB: D1Database;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function checkRateLimit(db: D1Database, ip: string, endpoint: string, limit: number): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - 3600;
  const row = await db.prepare(
    "SELECT count, window_start FROM rate_limits WHERE ip = ? AND endpoint = ?"
  ).bind(ip, endpoint).first<{ count: number; window_start: number }>();

  if (!row || row.window_start < windowStart) {
    await db.prepare(
      "INSERT OR REPLACE INTO rate_limits (ip, endpoint, count, window_start) VALUES (?, ?, 1, ?)"
    ).bind(ip, endpoint, now).run();
    return true;
  }
  if (row.count >= limit) return false;
  await db.prepare(
    "UPDATE rate_limits SET count = count + 1 WHERE ip = ? AND endpoint = ?"
  ).bind(ip, endpoint).run();
  return true;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const allowed = await checkRateLimit(env.DB, ip, "transform-bio", 10);
  if (!allowed) {
    return Response.json({ error: "Too many requests. Try again later." }, { status: 429, headers: CORS });
  }

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

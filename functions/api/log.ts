interface Env { DB: D1Database; ADMIN_TOKEN: string; }

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization" };

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: CORS });

  if (request.method === "GET") {
    const { results } = await env.DB.prepare(
      "SELECT id, day, title, body, created_at FROM log_entries WHERE published = 1 ORDER BY day DESC LIMIT 50"
    ).all();
    return Response.json(results, { headers: CORS });
  }

  if (request.method === "POST") {
    const auth = request.headers.get("Authorization") || "";
    if (auth.replace("Bearer ", "") !== env.ADMIN_TOKEN) {
      return Response.json({ error: "Unauthorized" }, { status: 401, headers: CORS });
    }
    const body = await request.json() as { day?: number; title?: string; body?: string; published?: boolean };
    if (!body.day || !body.title || !body.body) {
      return Response.json({ error: "day, title, and body are required" }, { status: 400, headers: CORS });
    }
    const id = crypto.randomUUID().slice(0, 16);
    await env.DB.prepare(
      "INSERT INTO log_entries (id, day, title, body, published) VALUES (?, ?, ?, ?, ?)"
    ).bind(id, body.day, body.title, body.body, body.published ? 1 : 0).run();
    return Response.json({ success: true, id }, { headers: CORS });
  }

  return new Response("Method not allowed", { status: 405 });
};

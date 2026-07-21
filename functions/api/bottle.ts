interface Env { DB: D1Database; ADMIN_TOKEN: string; }

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization" };

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: CORS });

  if (request.method === "GET") {
    const url = new URL(request.url);
    const auth = request.headers.get("Authorization") || "";
    const isAdmin = auth.replace("Bearer ", "") === env.ADMIN_TOKEN;
    const pending = url.searchParams.get("pending");

    if (isAdmin && pending === "1") {
      const { results } = await env.DB.prepare(
        "SELECT id, message, author, created_at FROM bottles WHERE approved = 0 ORDER BY created_at DESC"
      ).all();
      return Response.json(results, { headers: CORS });
    }
    const { results } = await env.DB.prepare(
      "SELECT id, message, author, created_at FROM bottles WHERE approved = 1 ORDER BY RANDOM() LIMIT 20"
    ).all();
    return Response.json(results, { headers: CORS });
  }

  if (request.method === "POST") {
    const url = new URL(request.url);
    // Admin approve/reject
    const auth = request.headers.get("Authorization") || "";
    if (auth.replace("Bearer ", "") === env.ADMIN_TOKEN && url.searchParams.get("action")) {
      const body = await request.json() as { id: string; action: "approve" | "reject" };
      if (body.action === "approve") {
        await env.DB.prepare("UPDATE bottles SET approved = 1 WHERE id = ?").bind(body.id).run();
      } else {
        await env.DB.prepare("DELETE FROM bottles WHERE id = ?").bind(body.id).run();
      }
      return Response.json({ success: true }, { headers: CORS });
    }

    // Public submit
    const body = await request.json() as { message?: string; author?: string };
    const message = body.message?.trim();
    if (!message || message.length < 10) {
      return Response.json({ error: "Your message needs at least 10 characters." }, { status: 400, headers: CORS });
    }
    if (message.length > 500) {
      return Response.json({ error: "Messages are limited to 500 characters." }, { status: 400, headers: CORS });
    }
    const id = crypto.randomUUID().slice(0, 16);
    await env.DB.prepare(
      "INSERT INTO bottles (id, message, author) VALUES (?, ?, ?)"
    ).bind(id, message, body.author?.trim() || null).run();
    return Response.json({ success: true, message: "Your message has been cast into the deep." }, { headers: CORS });
  }

  return new Response("Method not allowed", { status: 405 });
};

interface Env { DB: D1Database; ADMIN_TOKEN: string; }

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (request.method === "OPTIONS") return new Response(null, { headers: CORS });

  const section = url.searchParams.get("section") ?? "crew";

  if (request.method === "GET") {
    if (section === "crew") {
      const { results } = await env.DB.prepare(
        "SELECT id, name, role, site_url, photo_key, bio, email, twitter, created_at FROM crew WHERE approved = 0 ORDER BY created_at DESC"
      ).all();
      return Response.json(results, { headers: CORS });
    }
    if (section === "approved-crew") {
      const { results } = await env.DB.prepare(
        "SELECT id, name, role, photo_key, bio, email, twitter, position, created_at FROM crew WHERE approved = 1 ORDER BY position ASC"
      ).all();
      return Response.json(results, { headers: CORS });
    }
    if (section === "bottles") {
      const { results } = await env.DB.prepare(
        "SELECT id, message, author, created_at FROM bottles WHERE approved = 0 ORDER BY created_at DESC"
      ).all();
      return Response.json(results, { headers: CORS });
    }
    if (section === "subscribers") {
      const { results } = await env.DB.prepare(
        "SELECT id, name, email, confirmed, created_at FROM subscribers ORDER BY created_at DESC"
      ).all();
      return Response.json(results, { headers: CORS });
    }
    if (section === "log") {
      const { results } = await env.DB.prepare(
        "SELECT id, day, title, body, published, created_at FROM log_entries ORDER BY day DESC"
      ).all();
      return Response.json(results, { headers: CORS });
    }
    return Response.json({ error: "Unknown section" }, { status: 400, headers: CORS });
  }

  if (request.method === "POST") {
    const body = await request.json() as { id?: string; action?: string; day?: number; title?: string; body?: string; published?: boolean };

    if (section === "crew") {
      const { id, action } = body;
      if (action === "approve") {
        // Set position = count of already-approved + 1
        const count = await env.DB.prepare("SELECT COUNT(*) as c FROM crew WHERE approved = 1").first<{ c: number }>();
        const position = (count?.c ?? 0) + 1;
        await env.DB.prepare("UPDATE crew SET approved = 1, position = ? WHERE id = ?").bind(position, id).run();
        return Response.json({ success: true, message: "Crew member approved.", position }, { headers: CORS });
      }
      if (action === "reject" || action === "remove") {
        await env.DB.prepare("DELETE FROM crew WHERE id = ?").bind(body.id).run();
        return Response.json({ success: true, message: action === "remove" ? "Crew member removed." : "Crew member rejected." }, { headers: CORS });
      }
    }

    if (section === "bottles") {
      const { id, action } = body;
      if (action === "approve") {
        await env.DB.prepare("UPDATE bottles SET approved = 1 WHERE id = ?").bind(id).run();
      } else if (action === "reject") {
        await env.DB.prepare("DELETE FROM bottles WHERE id = ?").bind(id).run();
      }
      return Response.json({ success: true }, { headers: CORS });
    }

    if (section === "log") {
      if (body.action === "publish") {
        await env.DB.prepare("UPDATE log_entries SET published = 1 WHERE id = ?").bind(body.id).run();
        return Response.json({ success: true }, { headers: CORS });
      }
      if (body.action === "unpublish") {
        await env.DB.prepare("UPDATE log_entries SET published = 0 WHERE id = ?").bind(body.id).run();
        return Response.json({ success: true }, { headers: CORS });
      }
      if (body.action === "delete") {
        await env.DB.prepare("DELETE FROM log_entries WHERE id = ?").bind(body.id).run();
        return Response.json({ success: true }, { headers: CORS });
      }
      // Create new entry
      if (body.day && body.title && body.body) {
        const id = crypto.randomUUID().slice(0, 16);
        await env.DB.prepare(
          "INSERT INTO log_entries (id, day, title, body, published) VALUES (?, ?, ?, ?, ?)"
        ).bind(id, body.day, body.title, body.body, body.published ? 1 : 0).run();
        return Response.json({ success: true, id }, { headers: CORS });
      }
    }
  }

  return new Response("Method not allowed", { status: 405 });
};

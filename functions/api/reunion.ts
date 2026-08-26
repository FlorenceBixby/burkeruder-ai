interface Env {
  DB: D1Database;
  REUNION_CODE?: string;
  ADMIN_TOKEN: string;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Shared family word. Override in production with a Pages secret named REUNION_CODE.
const DEFAULT_CODE = "FAMILY-2027";

type Vote = "yes" | "maybe" | "no";
const VOTES: Vote[] = ["yes", "maybe", "no"];

function codeOk(env: Env, supplied: string | null): boolean {
  const expected = (env.REUNION_CODE || DEFAULT_CODE).trim().toLowerCase();
  return (supplied || "").trim().toLowerCase() === expected;
}

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

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: CORS });

  const url = new URL(request.url);

  if (request.method === "GET") {
    const auth = request.headers.get("Authorization")?.replace("Bearer ", "") || "";
    const isAdmin = env.ADMIN_TOKEN && auth === env.ADMIN_TOKEN;
    if (!isAdmin && !codeOk(env, url.searchParams.get("code"))) {
      return Response.json({ error: "That word isn't on the guest list." }, { status: 401, headers: CORS });
    }

    const { results } = await env.DB.prepare(
      "SELECT id, name, household, party_size, picks, note, created_at FROM reunion_rsvps ORDER BY created_at ASC"
    ).all<{ id: string; name: string; household: string | null; party_size: number; picks: string; note: string | null; created_at: string }>();

    const ballots = results.map((r) => {
      let picks: Record<string, Vote> = {};
      try { picks = JSON.parse(r.picks) as Record<string, Vote>; } catch { picks = {}; }
      return { ...r, picks };
    });

    return Response.json({ ballots }, { headers: { ...CORS, "Cache-Control": "no-store" } });
  }

  if (request.method === "POST") {
    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    if (!(await checkRateLimit(env.DB, ip, "reunion", 30))) {
      return Response.json({ error: "Too many ballots from this address. Try again in an hour." }, { status: 429, headers: CORS });
    }

    const body = await request.json() as {
      code?: string; name?: string; household?: string;
      partySize?: number; picks?: Record<string, string>; note?: string;
    };

    if (!codeOk(env, body.code ?? null)) {
      return Response.json({ error: "That word isn't on the guest list." }, { status: 401, headers: CORS });
    }

    const name = body.name?.trim();
    if (!name) return Response.json({ error: "We need a name on the ballot." }, { status: 400, headers: CORS });
    if (name.length > 60) return Response.json({ error: "That name is too long for the box score." }, { status: 400, headers: CORS });

    const household = body.household?.trim().slice(0, 60) || null;
    const partySize = Math.min(Math.max(Math.round(Number(body.partySize) || 1), 1), 30);
    const note = body.note?.trim().slice(0, 280) || null;

    // Keep only well-formed votes; the page's calendar is the source of truth for which
    // dates are selectable, so unknown keys (e.g. dates outside the polled months) are
    // simply carried along rather than rejected here.
    const picks: Record<string, Vote> = {};
    for (const [k, v] of Object.entries(body.picks ?? {})) {
      if (typeof k === "string" && k.length <= 40 && VOTES.includes(v as Vote)) picks[k] = v as Vote;
    }
    if (Object.keys(picks).length === 0) {
      return Response.json({ error: "Mark at least one day before you file." }, { status: 400, headers: CORS });
    }

    // Same name + same household = an amended ballot, not a second voter.
    const nameKey = `${name.toLowerCase()}|${(household ?? "").toLowerCase()}`;
    const existing = await env.DB.prepare(
      "SELECT id FROM reunion_rsvps WHERE name_key = ?"
    ).bind(nameKey).first<{ id: string }>();

    if (existing) {
      await env.DB.prepare(
        "UPDATE reunion_rsvps SET name = ?, household = ?, party_size = ?, picks = ?, note = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
      ).bind(name, household, partySize, JSON.stringify(picks), note, existing.id).run();
      return Response.json({ success: true, amended: true, message: "Ballot amended — the standings have been restated." }, { headers: CORS });
    }

    await env.DB.prepare(
      "INSERT INTO reunion_rsvps (id, name_key, name, household, party_size, picks, note) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(crypto.randomUUID().slice(0, 16), nameKey, name, household, partySize, JSON.stringify(picks), note).run();

    return Response.json({ success: true, amended: false, message: "Ballot filed. You're in the box score." }, { headers: CORS });
  }

  return new Response("Method not allowed", { status: 405, headers: CORS });
};

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

// The family word lives ONLY in the REUNION_CODE secret. This repo is public, so a
// fallback constant here would publish the gate combination alongside the lock — the
// endpoint fails closed instead, with an error the page can explain to a human.
//   npx wrangler pages secret put REUNION_CODE --project-name burkeruder-ai

type Vote = "yes" | "maybe" | "no";
const VOTES: Vote[] = ["yes", "maybe", "no"];

function codeConfigured(env: Env): boolean {
  return !!env.REUNION_CODE && env.REUNION_CODE.trim().length > 0;
}

function codeOk(env: Env, supplied: string | null): boolean {
  if (!codeConfigured(env)) return false;
  const expected = env.REUNION_CODE!.trim().toLowerCase();
  const given = (supplied || "").trim().toLowerCase();
  return given.length > 0 && given === expected;
}

const NOT_CONFIGURED = {
  error: "The family word hasn't been set up yet — Burke needs to set the REUNION_CODE secret.",
  code: "not_configured",
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

// The attendees column arrived after the first ballots were filed. Probing for it keeps
// this function deployable in either order relative to the D1 migration, instead of
// hard-failing every request until someone remembers to run the ALTER TABLE.
// Only a positive result is cached. Caching "missing" would outlive the ALTER TABLE and
// keep silently discarding attendee names until the isolate happened to recycle.
let attendeesColumnCache = false;
async function attendeesColumnExists(db: D1Database): Promise<boolean> {
  if (attendeesColumnCache) return true;
  try {
    const { results } = await db.prepare("PRAGMA table_info(reunion_rsvps)").all<{ name: string }>();
    attendeesColumnCache = results.some((c) => c.name === "attendees");
  } catch {
    return false;
  }
  return attendeesColumnCache;
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: CORS });

  const url = new URL(request.url);

  if (request.method === "GET") {
    const auth = request.headers.get("Authorization")?.replace("Bearer ", "") || "";
    const isAdmin = env.ADMIN_TOKEN && auth === env.ADMIN_TOKEN;
    if (!isAdmin && !codeConfigured(env)) {
      return Response.json(NOT_CONFIGURED, { status: 503, headers: CORS });
    }
    if (!isAdmin && !codeOk(env, url.searchParams.get("code"))) {
      return Response.json({ error: "That word isn't on the guest list." }, { status: 401, headers: CORS });
    }

    const hasAttendees = await attendeesColumnExists(env.DB);
    const cols = `id, name, household, party_size, picks, note, created_at${hasAttendees ? ", attendees" : ""}`;
    const { results } = await env.DB.prepare(
      `SELECT ${cols} FROM reunion_rsvps ORDER BY created_at ASC`
    ).all<{ id: string; name: string; household: string | null; party_size: number; picks: string; note: string | null; created_at: string; attendees?: string | null }>();

    const ballots = results.map((r) => {
      let picks: Record<string, Vote> = {};
      try { picks = JSON.parse(r.picks) as Record<string, Vote>; } catch { picks = {}; }
      let attendees: string[] = [];
      try { attendees = JSON.parse(r.attendees || "[]") as string[]; } catch { attendees = []; }
      // Ballots filed before the roster switched from a party-size count to real names
      // still only know how many people were coming, so stand in the filer's name.
      if (!Array.isArray(attendees) || attendees.length === 0) attendees = [r.name];
      return { ...r, picks, attendees };
    });

    return Response.json({ ballots }, { headers: { ...CORS, "Cache-Control": "no-store" } });
  }

  if (request.method === "POST") {
    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    if (!(await checkRateLimit(env.DB, ip, "reunion", 30))) {
      return Response.json({ error: "Too many ballots from this address. Try again in an hour." }, { status: 429, headers: CORS });
    }

    let body: {
      code?: string; name?: string; household?: string; ballotId?: string;
      attendees?: unknown; picks?: Record<string, string>; note?: string;
    };
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Could not read that ballot." }, { status: 400, headers: CORS });
    }

    if (!codeConfigured(env)) {
      return Response.json(NOT_CONFIGURED, { status: 503, headers: CORS });
    }
    if (!codeOk(env, body.code ?? null)) {
      return Response.json({ error: "That word isn't on the guest list." }, { status: 401, headers: CORS });
    }

    const name = body.name?.trim();
    if (!name) return Response.json({ error: "We need a name on the ballot." }, { status: 400, headers: CORS });
    if (name.length > 60) return Response.json({ error: "That name is too long for the box score." }, { status: 400, headers: CORS });

    const household = body.household?.trim().slice(0, 60) || null;
    const note = body.note?.trim().slice(0, 280) || null;

    // The ballot now names everyone coming rather than counting them. The filer is always
    // the first attendee, so party_size stays meaningful for anything reading the old column.
    const attendees = (Array.isArray(body.attendees) ? body.attendees : [])
      .map((a) => String(a ?? "").trim())
      .filter(Boolean)
      .map((a) => a.slice(0, 60))
      .filter((a, i, arr) => arr.findIndex((b) => b.toLowerCase() === a.toLowerCase()) === i)
      .slice(0, 30);
    if (attendees.length === 0 || attendees[0].toLowerCase() !== name.toLowerCase()) {
      attendees.unshift(name);
    }
    const partySize = attendees.length;

    // Keys must be plain ISO calendar dates, and there is a hard ceiling on how many a
    // single ballot can carry — the page only ever sends ~60, and without a cap one
    // request could park an unbounded JSON blob in the row.
    const MAX_PICKS = 400;
    const picks: Record<string, Vote> = {};
    for (const [k, v] of Object.entries(body.picks ?? {})) {
      if (Object.keys(picks).length >= MAX_PICKS) break;
      if (typeof k === "string" && /^\d{4}-\d{2}-\d{2}$/.test(k) && VOTES.includes(v as Vote)) {
        picks[k] = v as Vote;
      }
    }
    if (Object.keys(picks).length === 0) {
      return Response.json({ error: "Mark at least one day before you file." }, { status: 400, headers: CORS });
    }

    // Identity is normally name+household, but that alone means editing the household
    // field files a *second* ballot and double-counts the household. So a client that
    // already knows its ballot id amends that row directly, whatever it renames itself to.
    const nameKey = `${name.toLowerCase()}|${(household ?? "").toLowerCase()}`;
    const ballotId = typeof body.ballotId === "string" && /^[A-Za-z0-9-]{1,36}$/.test(body.ballotId)
      ? body.ballotId
      : null;

    const byKey = await env.DB.prepare(
      "SELECT id FROM reunion_rsvps WHERE name_key = ?"
    ).bind(nameKey).first<{ id: string }>();

    let targetId: string | null = null;
    if (ballotId) {
      const own = await env.DB.prepare(
        "SELECT id FROM reunion_rsvps WHERE id = ?"
      ).bind(ballotId).first<{ id: string }>();
      targetId = own?.id ?? null;
    }
    // If some other row already answers to this name+household, that row wins the
    // identity — merging into it beats failing on the UNIQUE index.
    if (byKey && byKey.id !== targetId) targetId = byKey.id;

    const hasAttendees = await attendeesColumnExists(env.DB);
    const attendeesJson = JSON.stringify(attendees);
    const picksJson = JSON.stringify(picks);

    if (targetId) {
      const sets = ["name_key = ?", "name = ?", "household = ?", "party_size = ?", "picks = ?", "note = ?"];
      const vals: unknown[] = [nameKey, name, household, partySize, picksJson, note];
      if (hasAttendees) { sets.push("attendees = ?"); vals.push(attendeesJson); }
      await env.DB.prepare(
        `UPDATE reunion_rsvps SET ${sets.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      ).bind(...vals, targetId).run();
      return Response.json(
        { success: true, amended: true, id: targetId, message: "Ballot amended — the stretches have been recounted." },
        { headers: CORS }
      );
    }

    // New ballot. Still an upsert, so two people filing the same name at the same
    // instant can't collide on the UNIQUE index and 500.
    const id = crypto.randomUUID().slice(0, 16);
    const cols = ["id", "name_key", "name", "household", "party_size", "picks", "note"];
    const vals: unknown[] = [id, nameKey, name, household, partySize, picksJson, note];
    if (hasAttendees) { cols.push("attendees"); vals.push(attendeesJson); }
    const updates = cols
      .filter((c) => c !== "id" && c !== "name_key")
      .map((c) => `${c} = excluded.${c}`)
      .concat("updated_at = CURRENT_TIMESTAMP")
      .join(", ");

    await env.DB.prepare(
      `INSERT INTO reunion_rsvps (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")})
       ON CONFLICT(name_key) DO UPDATE SET ${updates}`
    ).bind(...vals).run();

    return Response.json({ success: true, amended: false, id, message: "Ballot filed. You're on the roster." }, { headers: CORS });
  }

  return new Response("Method not allowed", { status: 405, headers: CORS });
};

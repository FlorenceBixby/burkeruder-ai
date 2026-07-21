const BLOCKLIST = [
  "fuck","shit","ass","asshole","bitch","cunt","cock","dick","pussy","bastard",
  "damn","piss","crap","twat","wank","fag","slut","whore","nigger","nigga",
  "retard","spic","kike","chink","wetback","tranny","rape","porn","sex",
  "penis","vagina","boob","tit","nude","naked","horny","dildo","vibrator",
];

function containsProfanity(text: string): boolean {
  if (!text) return false;
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, "");
  return BLOCKLIST.some((word) => {
    const re = new RegExp(`\\b${word}\\b`);
    return re.test(normalized);
  });
}

function checkFields(...fields: string[]): boolean {
  return fields.some(containsProfanity);
}

interface Env {
  DB: D1Database;
  PHOTOS: R2Bucket;
  ADMIN_TOKEN: string;
  AI: Ai;
  MAILER: Fetcher;
}

async function isImageSafe(ai: Ai, bytes: Uint8Array): Promise<boolean> {
  try {
    const result = await (ai as any).run("@cf/llava-hf/llava-1.5-7b-hf", {
      image: Array.from(bytes),
      prompt: "Does this image contain nudity, explicit sexual content, or graphic violence? Answer with only the word 'yes' or 'no'.",
      max_tokens: 5,
    });
    const answer = (result?.description ?? result?.response ?? "").toLowerCase();
    return !answer.startsWith("yes");
  } catch {
    return true; // fail open — manual approval is the backstop
  }
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: CORS });
  }

  if (request.method === "GET") {
    const { results } = await env.DB.prepare(
      "SELECT id, name, role, site_url, photo_key, bio, twitter, github, linkedin, discord, instagram, email, position, created_at FROM crew WHERE approved = 1 ORDER BY created_at DESC"
    ).all();
    return Response.json(results, { headers: CORS });
  }

  if (request.method === "POST") {
    let name: string, role: string, site_url: string, bio: string;
    let twitter: string, github: string, linkedin: string, discord: string, instagram: string, email: string;
    let photo_key: string | null = null;

    const ct = request.headers.get("content-type") || "";

    if (ct.includes("multipart/form-data")) {
      const form = await request.formData();
      name      = (form.get("name") as string)?.trim();
      role      = (form.get("role") as string)?.trim();
      site_url  = (form.get("site_url") as string)?.trim();
      bio       = (form.get("bio") as string)?.trim();
      twitter   = (form.get("twitter") as string)?.trim();
      github    = (form.get("github") as string)?.trim();
      linkedin  = (form.get("linkedin") as string)?.trim();
      discord   = (form.get("discord") as string)?.trim();
      instagram = (form.get("instagram") as string)?.trim();
      email     = (form.get("email") as string)?.trim();

      // Prefer AI-generated uniform URL over raw file upload
      const uniformUrl = form.get("uniform_url") as string | null;
      if (uniformUrl) {
        photo_key = uniformUrl; // store external URL directly
      } else {
        const file = form.get("photo") as File | null;
        if (file && file.size > 0) {
          if (file.size > 5 * 1024 * 1024) {
            return Response.json({ error: "Photo must be under 5MB" }, { status: 400, headers: CORS });
          }
          const bytes = new Uint8Array(await file.arrayBuffer());
          const safe = await isImageSafe(env.AI, bytes);
          if (!safe) {
            return Response.json({ error: "The captain reviewed your photo and respectfully declined." }, { status: 400, headers: CORS });
          }
          const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
          const key = `crew/${crypto.randomUUID()}.${ext}`;
          await env.PHOTOS.put(key, bytes, { httpMetadata: { contentType: file.type } });
          photo_key = key;
        }
      }
    } else {
      const body = await request.json() as Record<string, string>;
      name      = body.name?.trim();
      role      = body.role?.trim();
      site_url  = body.site_url?.trim();
      bio       = body.bio?.trim();
      twitter   = body.twitter?.trim();
      github    = body.github?.trim();
      linkedin  = body.linkedin?.trim();
      discord   = body.discord?.trim();
      instagram = body.instagram?.trim();
      email     = body.email?.trim();
    }

    if (!name || !role) {
      return Response.json({ error: "Name and role are required" }, { status: 400, headers: CORS });
    }

    if (checkFields(name, bio)) {
      return Response.json({ error: "The captain doesn't allow that kind of language aboard the Belafonte." }, { status: 400, headers: CORS });
    }

    const id = crypto.randomUUID().slice(0, 16);
    await env.DB.prepare(
      "INSERT INTO crew (id, name, role, site_url, photo_key, bio, twitter, github, linkedin, discord, instagram, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(id, name, role, site_url || null, photo_key, bio || null,
      twitter || null, github || null, linkedin || null, discord || null, instagram || null, email || null
    ).run();

    // Notify Burke with approve/reject links
    try {
      const base = "https://burkeruder.ai";
      const approveUrl = `${base}/api/crew-action?token=${env.ADMIN_TOKEN}&id=${id}&action=approve`;
      const rejectUrl  = `${base}/api/crew-action?token=${env.ADMIN_TOKEN}&id=${id}&action=reject`;
      const photoHtml  = photo_key
        ? `<img src="${photo_key.startsWith("http") ? photo_key : `${base}/api/photos/${photo_key.replace("crew/", "")}`}" style="width:120px;height:120px;object-fit:cover;display:block;margin-bottom:16px;" />`
        : "";
      await env.MAILER.fetch("https://burkeruder-mailer.burkeruder.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "burke.ruder@gmail.com",
          toName: "Burke",
          subject: `New crew application: ${name}`,
          text: `${name} wants to join as ${role}.\n\n${bio || ""}\n\nApprove: ${approveUrl}\nReject: ${rejectUrl}`,
          html: `
            <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px;background:#F5F0E8;color:#1a1a1a;">
              <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#888;margin-bottom:24px;">TEAM ZISSOU — NEW RECRUIT</div>
              ${photoHtml}
              <h2 style="font-style:italic;margin:0 0 4px;">${name}</h2>
              <div style="font-family:'Courier New',monospace;font-size:11px;color:#C0392B;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px;">${role}</div>
              ${bio ? `<p style="font-family:'Courier New',monospace;font-size:13px;color:#555;line-height:1.7;margin-bottom:20px;">${bio}</p>` : ""}
              ${email ? `<div style="font-family:'Courier New',monospace;font-size:11px;color:#888;margin-bottom:4px;">${email}</div>` : ""}
              ${twitter ? `<div style="font-family:'Courier New',monospace;font-size:11px;color:#888;margin-bottom:20px;">${twitter}</div>` : ""}
              <div style="display:flex;gap:12px;margin-top:24px;">
                <a href="${approveUrl}" style="display:inline-block;padding:12px 28px;background:#2d6a4f;color:#F5F0E8;font-family:'Courier New',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;">✓ APPROVE</a>
                <a href="${rejectUrl}" style="display:inline-block;padding:12px 28px;background:#6a2d2d;color:#F5F0E8;font-family:'Courier New',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;">✕ REJECT</a>
              </div>
            </div>
          `,
        }),
      });
    } catch (_) { /* don't fail the submission if email errors */ }

    return Response.json({ success: true, id, message: "You're on the manifest — pending captain's approval." }, { headers: CORS });
  }

  return new Response("Method not allowed", { status: 405 });
};

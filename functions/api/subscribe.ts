interface Env {
  DB: D1Database;
  MAILER: Fetcher;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const body = await request.json() as { name?: string; email?: string };
  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();

  if (!name || !email) {
    return Response.json({ error: "Name and email are required." }, { status: 400, headers: CORS });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "That doesn't look like a valid email." }, { status: 400, headers: CORS });
  }

  const existing = await env.DB.prepare(
    "SELECT id, confirmed FROM subscribers WHERE email = ?"
  ).bind(email).first<{ id: string; confirmed: number }>();

  if (existing?.confirmed) {
    return Response.json({ error: "You're already aboard the dispatch list." }, { status: 409, headers: CORS });
  }

  const token = crypto.randomUUID();
  const id = existing?.id ?? crypto.randomUUID().slice(0, 16);

  if (existing) {
    await env.DB.prepare("UPDATE subscribers SET name = ?, confirm_token = ? WHERE id = ?").bind(name, token, id).run();
  } else {
    await env.DB.prepare(
      "INSERT INTO subscribers (id, name, email, confirm_token) VALUES (?, ?, ?, ?)"
    ).bind(id, name, email, token).run();
  }

  const confirmUrl = `https://burkeruder.ai/api/confirm?token=${token}`;

  const html = `
<div style="font-family:'Courier New',monospace;background:#040a18;color:#F5F0E8;padding:48px;max-width:560px;margin:0 auto;">
  <div style="border-top:3px solid #C0392B;border-bottom:3px solid #C0392B;padding:4px 12px;display:inline-block;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#C0392B;margin-bottom:32px;">
    Official Dispatch — Belafonte Command
  </div>
  <h1 style="font-family:Georgia,serif;font-style:italic;font-size:28px;margin:0 0 16px;color:#F5F0E8;">
    Welcome aboard, ${name}.
  </h1>
  <p style="line-height:1.8;color:#aaa;font-size:14px;margin-bottom:32px;">
    You've requested a berth on The Belafonte Dispatch — our monthly communiqué of new expeditions,
    photographs, crew dispatches, and deep-sea discoveries.<br><br>
    Confirm your berth by clicking the button below. If you didn't request this,
    simply ignore it and the form will self-destruct in 72 hours.
  </p>
  <a href="${confirmUrl}" style="display:inline-block;padding:14px 36px;background:#C0392B;color:#F5F0E8;text-decoration:none;font-size:12px;letter-spacing:0.25em;text-transform:uppercase;">
    → Confirm My Berth
  </a>
  <p style="margin-top:48px;font-size:11px;color:#666;font-style:italic;">
    "This message will self-destruct." — Steve Zissou<br>
    <a href="${confirmUrl}" style="color:#7fb5b0;font-size:10px;">${confirmUrl}</a>
  </p>
</div>`;

  // Call the mailer Worker via service binding
  await env.MAILER.fetch("https://mailer/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: email,
      toName: name,
      subject: "Confirm your berth aboard The Belafonte Dispatch",
      html,
      text: `Welcome aboard, ${name}.\n\nConfirm your berth:\n${confirmUrl}\n\n— Steve Zissou`,
    }),
  });

  return Response.json({ success: true, message: "Check your inbox to confirm your berth." }, { headers: CORS });
};

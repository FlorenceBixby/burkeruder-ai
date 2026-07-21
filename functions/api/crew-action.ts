interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const t = url.searchParams.get("t");

  if (!t) return html("Invalid Link", "This link is missing a token.", "#C0392B");

  const tokenRow = await env.DB.prepare(
    "SELECT crew_id, action, used FROM action_tokens WHERE token = ?"
  ).bind(t).first<{ crew_id: string; action: string; used: number }>();

  if (!tokenRow) return html("Invalid Link", "This link is invalid or has expired.", "#C0392B");
  if (tokenRow.used) return html("Already Used", "This link has already been used.", "#888");

  const { crew_id, action } = tokenRow;

  const member = await env.DB.prepare(
    "SELECT name, role, approved FROM crew WHERE id = ?"
  ).bind(crew_id).first<{ name: string; role: string; approved: number }>();

  if (!member) return html("Not Found", "This crew member no longer exists.", "#888");

  // Mark token used regardless of outcome
  await env.DB.prepare("UPDATE action_tokens SET used = 1 WHERE token = ?").bind(t).run();

  if (action === "approve") {
    if (member.approved === 1) return html("Already Approved", `${member.name} is already on the manifest.`, "#2d6a4f");
    const count = await env.DB.prepare("SELECT COUNT(*) as c FROM crew WHERE approved = 1").first<{ c: number }>();
    const position = (count?.c ?? 0) + 1;
    await env.DB.prepare("UPDATE crew SET approved = 1, position = ? WHERE id = ?").bind(position, crew_id).run();
    return html("Welcome Aboard", `${member.name} has been approved as ${member.role} — position #${position}.`, "#2d6a4f");
  }

  await env.DB.prepare("DELETE FROM crew WHERE id = ?").bind(crew_id).run();
  return html("Rejected", `${member.name}'s application has been rejected and removed.`, "#6a2d2d");
};

function html(title: string, message: string, color: string): Response {
  return new Response(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title} — Team Zissou</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;background:#F5F0E8;color:#1a1a1a;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}</style>
    </head><body>
    <div style="max-width:480px;text-align:center;padding:48px 40px;background:#fff;border:2px solid #ddd;position:relative;">
      <div style="position:absolute;top:0;left:0;right:0;height:4px;background:${color}"></div>
      <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:3px;color:#888;text-transform:uppercase;margin-bottom:24px;">TEAM ZISSOU</div>
      <h1 style="font-style:italic;font-size:1.8rem;margin-bottom:16px;color:${color}">${title}</h1>
      <p style="font-family:'Courier New',monospace;font-size:0.8rem;color:#555;line-height:1.8;">${message}</p>
      <a href="https://burkeruder.ai/crew" style="display:inline-block;margin-top:32px;padding:10px 24px;border:2px solid #ddd;font-family:'Courier New',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#555;text-decoration:none;">View the Manifest</a>
    </div>
    </body></html>`,
    { headers: { "Content-Type": "text/html;charset=utf-8" } }
  );
}

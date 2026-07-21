interface Env {
  DB: D1Database;
  ADMIN_TOKEN: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const token  = url.searchParams.get("token");
  const id     = url.searchParams.get("id");
  const action = url.searchParams.get("action");

  if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
    return html("Unauthorized", "Access denied.", "#C0392B");
  }

  if (!id || (action !== "approve" && action !== "reject")) {
    return html("Invalid", "Missing or invalid parameters.", "#C0392B");
  }

  const member = await env.DB.prepare("SELECT name, role, approved FROM crew WHERE id = ?").bind(id).first<{ name: string; role: string; approved: number }>();

  if (!member) {
    return html("Not Found", "This crew member no longer exists.", "#888");
  }

  if (member.approved === 1 && action === "approve") {
    return html("Already Approved", `${member.name} is already on the manifest.`, "#2d6a4f");
  }

  if (action === "approve") {
    const count = await env.DB.prepare("SELECT COUNT(*) as c FROM crew WHERE approved = 1").first<{ c: number }>();
    const position = (count?.c ?? 0) + 1;
    await env.DB.prepare("UPDATE crew SET approved = 1, position = ? WHERE id = ?").bind(position, id).run();
    return html("Welcome Aboard", `${member.name} has been approved as ${member.role} — position #${position}.`, "#2d6a4f");
  }

  await env.DB.prepare("DELETE FROM crew WHERE id = ?").bind(id).run();
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

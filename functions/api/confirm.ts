interface Env { DB: D1Database; }

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) return redirect("/?dispatch=invalid-token");

  const sub = await env.DB.prepare("SELECT id FROM subscribers WHERE confirm_token = ?").bind(token).first<{ id: string }>();
  if (!sub) return redirect("/?dispatch=token-expired");

  await env.DB.prepare("UPDATE subscribers SET confirmed = 1, confirm_token = NULL WHERE id = ?").bind(sub.id).run();
  return redirect("/?dispatch=confirmed");
};

function redirect(url: string) {
  return new Response(null, { status: 302, headers: { Location: url } });
}

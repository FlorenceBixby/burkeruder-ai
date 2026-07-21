interface Env { DB: D1Database; }

export const onRequest: PagesFunction<Env> = async ({ env }) => {
  const result = await env.DB.prepare(
    "SELECT COUNT(*) as count FROM crew WHERE approved = 1"
  ).first<{ count: number }>();
  return Response.json({ count: result?.count ?? 0 }, {
    headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store" },
  });
};

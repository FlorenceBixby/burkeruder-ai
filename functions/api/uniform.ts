interface Env {
  FAL_KEY: string;
  DB: D1Database;
}

const PROMPT =
  "cinematic portrait wearing a Team Zissou light blue short-sleeve uniform jumpsuit with a Team Zissou chest patch, red wool knit beanie cap, aboard a research vessel, Wes Anderson film aesthetic, 35mm film grain, warm desaturated color palette, centered composition, dramatic side lighting, photorealistic";

const NEGATIVE_PROMPT =
  "deformed, distorted, disfigured, blurry, bad anatomy, wrong hands, extra limbs, missing limbs, watermark, text";

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

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const ip = ctx.request.headers.get("CF-Connecting-IP") ?? "unknown";
  const allowed = await checkRateLimit(ctx.env.DB, ip, "uniform", 5);
  if (!allowed) {
    return Response.json({ error: "Too many requests. Try again in an hour." }, { status: 429 });
  }

  try {
    const formData = await ctx.request.formData();
    const file = formData.get("photo") as File | null;
    if (!file) return Response.json({ error: "No photo provided" }, { status: 400 });

    const initRes = await fetch("https://rest.alpha.fal.ai/storage/upload/initiate", {
      method: "POST",
      headers: {
        "Authorization": `Key ${ctx.env.FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ file_name: file.name || "photo.jpg", content_type: file.type || "image/jpeg" }),
    });
    if (!initRes.ok) {
      const txt = await initRes.text();
      return Response.json({ error: `Upload initiate failed: ${txt}` }, { status: 500 });
    }
    const { upload_url, file_url } = await initRes.json() as { upload_url: string; file_url: string };

    const bytes = await file.arrayBuffer();
    await fetch(upload_url, {
      method: "PUT",
      headers: { "Content-Type": file.type || "image/jpeg" },
      body: bytes,
    });

    const falRes = await fetch("https://fal.run/fal-ai/pulid", {
      method: "POST",
      headers: {
        "Authorization": `Key ${ctx.env.FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: PROMPT,
        negative_prompt: NEGATIVE_PROMPT,
        reference_images: [{ image_url: file_url }],
        num_images: 1,
        image_size: "portrait_4_3",
        num_inference_steps: 28,
        guidance_scale: 7,
      }),
    });

    if (!falRes.ok) {
      const txt = await falRes.text();
      return Response.json({ error: `Generation failed: ${txt}` }, { status: 500 });
    }

    const result = await falRes.json() as { images: { url: string }[] };
    const imageUrl = result.images?.[0]?.url;
    if (!imageUrl) return Response.json({ error: "No image returned" }, { status: 500 });

    return Response.json({ imageUrl });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
};

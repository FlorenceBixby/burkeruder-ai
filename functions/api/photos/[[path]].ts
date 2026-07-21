interface Env {
  PHOTOS: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const path = (context.params.path as string[]).join("/");
  const key = `crew/${path}`;
  const object = await context.env.PHOTOS.get(key);
  if (!object) return new Response("Not found", { status: 404 });
  return new Response(object.body, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType || "image/jpeg",
      "Cache-Control": "public, max-age=31536000",
    },
  });
};

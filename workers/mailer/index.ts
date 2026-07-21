import { EmailMessage } from "cloudflare:email";

interface Env {
  SEND_EMAIL: SendEmail;
}

interface MailPayload {
  to: string;
  toName: string;
  subject: string;
  html: string;
  text: string;
}

function buildRaw(from: string, payload: MailPayload): string {
  const boundary = `----CFBoundary${Date.now()}`;
  return [
    `From: ${from}`,
    `To: ${payload.toName} <${payload.to}>`,
    `Subject: ${payload.subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset=utf-8`,
    ``,
    payload.text,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    payload.html,
    ``,
    `--${boundary}--`,
  ].join("\r\n");
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

    const payload = await request.json() as MailPayload;

    if (!payload.to || !payload.subject) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const from = "dispatch@burkeruder.ai";
    const raw = buildRaw(`Burke Ruder <${from}>`, payload);
    const encoded = new TextEncoder().encode(raw);
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoded);
        controller.close();
      },
    });

    const message = new EmailMessage(from, payload.to, stream);
    await env.SEND_EMAIL.send(message);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  },
};

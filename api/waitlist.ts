import { kv } from '@vercel/kv';

export const config = { runtime: 'edge' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  let body: { email?: string; name?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const email = (body.email ?? '').trim().toLowerCase();
  const name = (body.name ?? '').trim().slice(0, 120);
  const source = (body.source ?? 'unknown').slice(0, 60);

  if (!email || !EMAIL_RE.test(email)) {
    return json({ error: 'Valid email required' }, 400);
  }

  try {
    const added = await kv.sadd('waitlist:emails', email);
    await kv.hset(`waitlist:entry:${email}`, {
      email,
      name,
      source,
      ts: Date.now(),
    });

    return json({ ok: true, alreadyOnList: added === 0 });
  } catch (err) {
    console.error('waitlist KV error', err);
    return json({ error: 'Storage error' }, 500);
  }
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

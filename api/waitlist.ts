import { createClient } from '@supabase/supabase-js';

export const config = { runtime: 'edge' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Vercel's Supabase integration injects SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
// Service role bypasses RLS so the function can insert from the server.
const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null;

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  if (!supabase) {
    console.error('Supabase env vars missing');
    return json({ error: 'Server not configured' }, 500);
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

  const { error } = await supabase
    .from('waitlist')
    .upsert({ email, name, source }, { onConflict: 'email' });

  if (error) {
    console.error('supabase insert error', error);
    return json({ error: 'Storage error' }, 500);
  }

  return json({ ok: true });
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

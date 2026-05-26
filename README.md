# aiwithamit

Landing page for the **Build websites with Claude** cohort. Vite + React + TypeScript + Tailwind + framer-motion, with a Vercel Edge function backed by Vercel KV for the waitlist.

## Local dev

```bash
npm install
npm run dev
```

## Waitlist storage (Vercel KV)

The waitlist form posts to `/api/waitlist`, which writes to a Vercel KV store.

**One-time setup in the Vercel dashboard:**

1. Open the `aiwithamit` project → **Storage** → **Create Database** → **KV**.
2. Connect the new store to the project. Vercel will auto-inject these env vars:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`
   - `KV_URL`
3. Redeploy. That's it — submissions land in the store immediately.

**Data layout:**

- `waitlist:emails` — a Redis set of every email that has signed up.
- `waitlist:entry:<email>` — a hash with `{ email, name, source, ts }`.

**Export signups (from the Vercel CLI):**

```bash
vercel env pull
node -e "import('@vercel/kv').then(async ({kv}) => { \
  const emails = await kv.smembers('waitlist:emails'); \
  for (const e of emails) console.log(JSON.stringify(await kv.hgetall('waitlist:entry:'+e))); \
})"
```

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS 3
- framer-motion (pull-up text, scroll-linked reveals, card entrances)
- lucide-react (icons)
- `@vercel/kv` (waitlist storage, Edge runtime)

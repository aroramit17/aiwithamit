# aiwithamit

Landing page for the **Build websites with Claude** cohort. Vite + React + TypeScript + Tailwind + framer-motion, with a Vercel Edge function backed by Vercel KV for the waitlist.

## Local dev

```bash
npm install
npm run dev
```

## Waitlist storage (Upstash Redis)

The waitlist form posts to `/api/waitlist`, an Edge function that writes to Upstash Redis.

**One-time setup in the Vercel dashboard:**

1. Open the `aiwithamit` project → **Storage** → **Create Database** → **Upstash → Redis**.
2. Connect it to the project. Vercel will auto-inject:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
3. Redeploy. Submissions land in Redis immediately.

**Data layout:**

- `waitlist:emails` — Redis set of every email that has signed up (deduped).
- `waitlist:entry:<email>` — hash with `{ email, name, source, ts }`.

**Export signups locally:**

```bash
vercel env pull
node -e "import('@upstash/redis').then(async ({Redis}) => { \
  const r = Redis.fromEnv(); \
  const emails = await r.smembers('waitlist:emails'); \
  for (const e of emails) console.log(JSON.stringify(await r.hgetall('waitlist:entry:'+e))); \
})"
```

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS 3
- framer-motion (pull-up text, scroll-linked reveals, card entrances)
- lucide-react (icons)
- `@vercel/kv` (waitlist storage, Edge runtime)

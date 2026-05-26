# aiwithamit

Landing page for the **Build websites with Claude** cohort. Vite + React + TypeScript + Tailwind + framer-motion, with a Vercel Edge function backed by Vercel KV for the waitlist.

## Local dev

```bash
npm install
npm run dev
```

## Waitlist storage (Supabase)

`/api/waitlist` is a Vercel Edge function that upserts into a Supabase `waitlist` table.

**One-time setup:**

1. **Vercel dashboard** → project `aiwithamit` → **Storage** → **Create Database** → **Supabase** → create or link a Supabase project. Vercel auto-injects:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (used by the Edge function)
   - plus `POSTGRES_*` connection strings (unused here)
2. **Supabase dashboard** → **SQL Editor** → paste the contents of `supabase/schema.sql` and run it. Creates the `public.waitlist` table with a unique email index and RLS on.
3. **Redeploy** the Vercel project. Submissions land in the table immediately.

**View signups:** Supabase dashboard → **Table Editor** → `waitlist`.

**Export via SQL:**

```sql
select email, name, source, created_at
from waitlist
order by created_at desc;
```

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS 3
- framer-motion (pull-up text, scroll-linked reveals, card entrances)
- lucide-react (icons)
- `@vercel/kv` (waitlist storage, Edge runtime)

# Bruca Blog

Standalone Next.js 15 app (App Router). Reads published articles from
the Bruca CMS (Payload) over its public REST API — no shared code,
no shared types, just `fetch`.

## Setup

```
npm install
cp .env.example .env.local   # fill in NEXT_PUBLIC_CMS_URL / NEXT_PUBLIC_SITE_URL
npm run dev                  # http://localhost:3000
```

## Deploy (Vercel)

- Root Directory: repo root
- Environment variables: `NEXT_PUBLIC_CMS_URL`, `NEXT_PUBLIC_SITE_URL`
- Domain: `blog.bruca.space`

## Notes

- `app/lib/cms.ts` is the only place that talks to the CMS.
- If cms is unreachable during a scheduled revalidation, Next.js keeps
  serving the last successful build of each page instead of failing
  (`next: { revalidate: 300 }`).

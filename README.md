# WorkXplorer

GitHub organization explorer — search any GitHub org and see its tech stack, top repositories, and contributors.

---

## Stack

- **Next.js 16** (App Router, static export)
- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **React Hook Form** + **Zod**
- **next-intl** — EN / RU / UZ
- **next-themes** — light / dark mode
- **GitHub REST API v3** (public, no auth required)

---

## Getting started

```bash
git clone https://github.com/Bekk-cap1/workxplorer.git
cd workxplorer
npm install
npm run dev
```

Open http://localhost:3000.

### Optional: GitHub token

Without a token the GitHub API allows 60 requests/hour per IP. Large orgs (e.g. `microsoft`) paginate over many repos and hit this limit quickly.

To raise the limit to 5 000/hour:

1. Create a Personal Access Token at https://github.com/settings/tokens (no scopes needed for public data)
2. Add it to `.env.local`:

```env
GITHUB_TOKEN=ghp_your_token_here
```

---

## Features

- **Search** any GitHub organization by slug
- **Tech stack bar chart** — aggregates language bytes across all public repos, normalized by repo size
- **Top repositories** — sorted by stars, with relative timestamps
- **Top contributors** — deduplicated across the top-3 repos by stars
- **Rate limit UI** — shows remaining requests and countdown on 403/429
- **Localization** — EN / RU / UZ, saved to localStorage
- **Light / dark theme**

---

## Project structure

```
app/
├── components/
│   ├── layout/       # SiteHeader, ThemeToggle
│   ├── org/          # OrgProfile, OrgHeader, LanguageBar, RepoCard, Contributors, RateLimitError
│   ├── providers/    # I18nProvider, ThemeProvider
│   ├── search/       # SearchPage, SearchForm, SuggestedOrgs
│   └── ui/           # Skeleton, ErrorCard
├── lib/
│   ├── github-client.ts          # browser-side GitHub API fetchers
│   ├── github-server.ts          # server-side GitHub API fetchers (unused in export mode)
│   ├── github-types.ts           # GitHub DTO types
│   ├── aggregateLanguages.ts
│   ├── deduplicateContributors.ts
│   ├── languageColors.ts
│   └── relativeTime.ts           # EN / RU / UZ relative time
├── messages/         # en.json, ru.json, uz.json
├── org/
│   ├── OrgClient.tsx # client component — fetches and renders org data
│   └── page.tsx      # static shell, reads ?q= param
├── layout.tsx
├── page.tsx          # search page
└── not-found.tsx
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Build static export to `out/` |
| `npm run lint` | Run ESLint |

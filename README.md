# WorkXplorer

GitHub organization explorer — search any org and instantly see its tech stack, top repositories, and contributors.

---

## What it does

Enter a GitHub organization slug (e.g. `vercel`, `google`, `microsoft`) and the app:

1. Fetches the organization's metadata from the GitHub API
2. Paginates through **all** public repositories (100/page)
3. Fetches language stats for every repo (8 requests concurrently)
4. Aggregates languages normalized by repo size to avoid vendored code skewing results
5. Shows the tech stack as a horizontal bar chart with percentage breakdown
6. Shows top-10 repos by stars with relative timestamps
7. Fetches contributors for the top-3 repos and deduplicates them across repos

---

## Tech stack

| Package | Version | Role |
|---|---|---|
| `next` | 16.2.4 | Framework, routing, `next/image` |
| `react` / `react-dom` | 19.2.4 | UI |
| `typescript` | 5 | Type safety, strict mode |
| `tailwindcss` | v4 | Styling |
| `next-intl` | 4.9.1 | i18n — EN / RU / UZ |
| `next-themes` | 0.4.6 | Dark / light mode |
| `react-hook-form` | 7.73.1 | Search form state |
| `@hookform/resolvers` + `zod` | latest | Form validation schema |
| `server-only` | 0.0.1 | Guard for server-only modules |

No database, no backend, no UI component library. Just Next.js + Tailwind + the public GitHub REST API v3.

---

## Getting started

**Requirements:** Node.js 18.18+ and npm 9+

```bash
git clone https://github.com/Bekk-cap1/workxplorer.git
cd workxplorer
npm install
npm run dev
```

Open http://localhost:3000.

### GitHub token (optional but recommended)

Without a token the GitHub API allows **60 requests/hour** per IP. Large orgs like `microsoft` easily exceed this — the app paginates all repos and fetches `/languages` for each one.

To raise the limit to **5 000/hour**:

1. Go to https://github.com/settings/tokens and create a Personal Access Token (Classic). No scopes needed — public data only.
2. Copy `.env.example` to `.env.local` and paste your token:

```env
GITHUB_TOKEN=ghp_your_token_here
```

The token is only used in `app/lib/github-server.ts` (server-side module, guarded by `server-only`) and never reaches the browser bundle.

### Build

```bash
npm run build   # generates static output in out/
npm run lint    # ESLint
```

---

## Project structure

```
app/
├── components/
│   ├── layout/
│   │   ├── SiteHeader.tsx          # sticky nav — logo, home link, language switcher, theme toggle
│   │   └── ThemeToggle.tsx         # sun/moon button, next-themes
│   ├── org/
│   │   ├── OrgProfile.tsx          # page layout — composes all org sections
│   │   ├── OrgHeader.tsx           # avatar, name, bio, stats, rate-limit badge
│   │   ├── LanguageBar.tsx         # stacked bar chart + legend
│   │   ├── RepoCard.tsx            # single repo card with relative time
│   │   ├── Contributors.tsx        # top-5 contributors list
│   │   └── RateLimitError.tsx      # 403/429 UI with live countdown
│   ├── providers/
│   │   ├── I18nProvider.tsx        # next-intl + localStorage locale persistence
│   │   └── ThemeProvider.tsx       # next-themes wrapper
│   ├── search/
│   │   ├── SearchPage.tsx          # landing page layout
│   │   ├── SearchForm.tsx          # RHF + Zod input, navigates to /org?q=
│   │   ├── SuggestedOrgs.tsx       # quick-access buttons (vercel, google, …)
│   │   └── searchSchema.ts         # Zod schema for slug field
│   └── ui/
│       ├── Skeleton.tsx            # animated loading placeholders
│       └── ErrorCard.tsx           # org-not-found card
├── lib/
│   ├── github-client.ts            # browser-side GitHub API fetchers (no auth)
│   ├── github-server.ts            # server-side variant (GITHUB_TOKEN, ISR revalidate)
│   ├── github-types.ts             # TypeScript DTOs for GitHub API responses
│   ├── aggregateLanguages.ts       # normalize bytes by repo.size, top-N + Other
│   ├── deduplicateContributors.ts  # merge contributor arrays, sum contributions
│   ├── languageColors.ts           # language name → hex color map
│   └── relativeTime.ts             # "3 days ago" with EN / RU / UZ grammar
├── messages/
│   ├── en.json
│   ├── ru.json
│   └── uz.json
├── org/
│   ├── OrgClient.tsx               # "use client" — state machine + data fetching
│   └── page.tsx                    # static shell, wraps OrgClient in Suspense
├── layout.tsx                      # ThemeProvider → I18nProvider → SiteHeader
├── page.tsx                        # / — renders SearchPage
└── not-found.tsx                   # 404 page
```

---

## Pages

### `/` — Search

- `SearchForm` — controlled input with react-hook-form + Zod schema
  - Required field, no spaces allowed
  - On submit: `router.push("/org?q=<slug>")`
- `SuggestedOrgs` — 5 hardcoded quick links: `vercel`, `google`, `microsoft`, `facebook`, `uzinfocom`

### `/org?q=<slug>` — Organization

Static page shell + `OrgClient` (client component).

`OrgClient` implements a state machine with 6 states:

| State | Trigger | What renders |
|---|---|---|
| `idle` | No `q` param | Empty |
| `loading` | Fetch started | Spinner |
| `not_found` | GitHub returned 404 | `ErrorCard` with slug |
| `rate_limit` | 403 or 429 | `RateLimitError` with countdown |
| `error` | Any other failure | Error message |
| `ok` | All fetches succeeded | `OrgProfile` |

### `not-found.tsx` — 404

Shown for any unknown route. Translated title + body + "Back home" button.

---

## Data flow

```
SearchForm → router.push("/org?q=vercel")
    ↓
OrgClient mounts, reads useSearchParams().get("q")
    ↓
1. fetchOrg("vercel")             → GET /orgs/vercel
2. fetchAllRepos("vercel")        → GET /orgs/vercel/repos (paginated, 100/page)
3. fetchLanguagesForRepos(...)    → GET /repos/vercel/{repo}/languages  × all repos, concurrency=8
4. aggregateLanguages()           → normalize by repo.size, sum across repos
   getTopLanguages()              → top 8 + "Other" with percentages
5. fetchTopContributors(top3)     → GET /repos/vercel/{repo}/contributors  × top-3 repos by stars
   deduplicateContributors()      → merge arrays, sum contributions, top 5
    ↓
setState({ status: "ok", org, topRepos, topLanguages, topContributors })
    ↓
<OrgProfile /> renders OrgHeader + LanguageBar + RepoCard × 10 + Contributors
```

Each fetch step checks for 403/429 (rate limit) and 404 before proceeding. A cancellation flag (`let cancelled = false`, set in the `useEffect` cleanup) prevents state updates if the user navigates away mid-fetch.

---

## GitHub API

Endpoints called:

| Endpoint | Purpose |
|---|---|
| `GET /orgs/{org}` | Org metadata (name, avatar, bio, repo count, followers) |
| `GET /orgs/{org}/repos?type=public&per_page=100&page={n}` | All public repos (paginated) |
| `GET /repos/{org}/{repo}/languages` | Language byte counts per repo |
| `GET /repos/{org}/{repo}/contributors?per_page=10` | Top contributors per repo |

**Rate limit handling:**

- Status 403 or 429 → show `RateLimitError`
- `X-RateLimit-Reset` header → Unix timestamp used for countdown timer
- `X-RateLimit-Remaining` header → shown in `OrgHeader` as "N requests remaining this hour"
- Contributor 404 (repo has no contributors) → silently skipped, not an error

**Two API modules:**

`github-client.ts` — used by `OrgClient` (runs in browser, no auth token)

`github-server.ts` — server-side variant: reads `process.env.GITHUB_TOKEN`, adds `Authorization` header, sets `next: { revalidate: 3600 }` for ISR caching. Available if the app is switched back to SSR mode.

---

## Language aggregation

`aggregateLanguages.ts`:

1. For each repo, divide each language's byte count by `repo.size` (normalization)
2. Sum the normalized scores across all repos
3. Sort descending, take top 8
4. Calculate each language's percentage of the total top-8 sum
5. Bundle the rest into "Other"

This prevents large repos with generated code from dominating the chart.

`languageColors.ts` maps language names to hex colors (TypeScript → `#3178c6`, Python → `#3572A5`, etc.) with a slate fallback for unknown languages.

---

## i18n

Three locales: **English** (default), **Russian**, **Uzbek**.

**Implementation:**

- `I18nProvider` (client component) loads all three JSON message files at build time
- Reads the saved locale from `localStorage` (`wx-locale`) on mount
- Wraps children in `NextIntlClientProvider` from `next-intl`
- `SiteHeader` renders a `<select>` that calls `setLocale()` and saves to `localStorage`
- Components call `useTranslations()` and `t("key")` from `next-intl`

**Russian pluralization** in `relativeTime.ts` handles the three grammatical forms: `1 минуту`, `2 минуты`, `5 минут`.

Message files live in `app/messages/{en,ru,uz}.json` and cover all UI strings: nav, search, org sections, errors, validation messages, and repo/contributor labels.

---

## Theming

- `ThemeProvider` wraps the app with `next-themes` (`attribute="class"`, `defaultTheme="system"`)
- Tailwind uses `dark:` variants throughout
- `ThemeToggle` in the header reads `resolvedTheme` and toggles between `"light"` and `"dark"`
- Selected theme persists to `localStorage` via `next-themes`
- `suppressHydrationWarning` on `<html>` prevents hydration mismatch from theme class

---

## Deployment

The app uses `output: "export"` in `next.config.ts` — it builds to a static `out/` directory with no Node.js server required.

```
npm run build   # → out/
```

The `out/` directory can be served from:
- **Vercel** (auto-detected as static export)
- **Netlify**, **GitHub Pages**, **S3 + CloudFront**, or any static host

**Image optimization** is disabled (`images: { unoptimized: true }`) since static export can't run the Next.js image optimization server. GitHub avatar URLs are allowed via `remotePatterns`.

---

## Error states summary

| Scenario | Component | UI |
|---|---|---|
| Empty search | `SearchForm` | Inline validation error under input |
| Spaces in slug | `SearchForm` | Inline validation error under input |
| Org not found | `ErrorCard` | Card with slug + "Try another org" button |
| Rate limited | `RateLimitError` | Countdown to reset + "Try again" button |
| No public repos | `OrgProfile` | Empty state with message |
| API failure | Inline error | Red error message |
| Unknown route | `not-found.tsx` | 404 page with "Back home" |

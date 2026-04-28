// wx-init
import "server-only"

import type {
  GitHubContributor,
  GitHubOrg,
  GitHubRepo,
  GitHubRepoWithLanguages,
} from "@/app/lib/github-types"

const REVALIDATE = 3600

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "WorkXplorer/1.0",
  }
  const token = process.env.GITHUB_TOKEN
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

export type FetchResult<T> =
  | { ok: true; data: T; rateRemaining: number | null }
  | {
      ok: false
      status: number
      resetUnix?: number | null
      error?: string
    }

function readReset(res: Response): number | null {
  const v = res.headers.get("X-RateLimit-Reset")
  if (!v) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function readRemaining(res: Response): number | null {
  const v = res.headers.get("X-RateLimit-Remaining")
  if (!v) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

async function ghFetch<T>(path: string): Promise<FetchResult<T>> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: githubHeaders(),
    next: { revalidate: REVALIDATE },
  })

  if (res.status === 404) return { ok: false, status: 404 }
  if (res.status === 403 || res.status === 429) {
    return {
      ok: false,
      status: res.status,
      resetUnix: readReset(res),
    }
  }
  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: `github ${res.status}`,
    }
  }

  const data = (await res.json()) as T
  return { ok: true, data, rateRemaining: readRemaining(res) }
}

export function fetchOrg(slug: string): Promise<FetchResult<GitHubOrg>> {
  return ghFetch<GitHubOrg>(`/orgs/${encodeURIComponent(slug)}`)
}

export async function fetchAllRepos(
  slug: string
): Promise<FetchResult<GitHubRepo[]>> {
  const all: GitHubRepo[] = []
  let page = 1
  let lastRemaining: number | null = null

  while (true) {
    const q = new URLSearchParams({
      type: "public",
      per_page: "100",
      page: String(page),
    })
    const r = await ghFetch<GitHubRepo[]>(
      `/orgs/${encodeURIComponent(slug)}/repos?${q}`
    )
    if (!r.ok) return r
    lastRemaining = r.rateRemaining ?? lastRemaining
    if (r.data.length === 0) break
    all.push(...r.data)
    if (r.data.length < 100) break
    page += 1
  }

  return { ok: true, data: all, rateRemaining: lastRemaining }
}

export async function fetchLanguagesForRepos(
  slug: string,
  repos: GitHubRepo[]
): Promise<FetchResult<GitHubRepoWithLanguages[]>> {
  const out: GitHubRepoWithLanguages[] = []
  let lastRemaining: number | null = null

  const concurrency = 8
  for (let i = 0; i < repos.length; i += concurrency) {
    const slice = repos.slice(i, i + concurrency)
    const results = await Promise.all(
      slice.map((repo) =>
        ghFetch<Record<string, number>>(
          `/repos/${encodeURIComponent(slug)}/${encodeURIComponent(repo.name)}/languages`
        )
      )
    )
    for (let j = 0; j < results.length; j += 1) {
      const r = results[j]
      if (!r.ok) return r
      lastRemaining = r.rateRemaining ?? lastRemaining
      out.push({ ...slice[j], languages: r.data })
    }
  }

  return { ok: true, data: out, rateRemaining: lastRemaining }
}

export async function fetchTopContributors(
  slug: string,
  topRepos: GitHubRepo[]
): Promise<FetchResult<GitHubContributor[][]>> {
  const lists: GitHubContributor[][] = []
  let lastRemaining: number | null = null

  for (const repo of topRepos) {
    const r = await ghFetch<GitHubContributor[]>(
      `/repos/${encodeURIComponent(slug)}/${encodeURIComponent(repo.name)}/contributors?per_page=10`
    )
    if (!r.ok) {
      if (r.status === 404) {
        lists.push([])
        continue
      }
      return r
    }
    lastRemaining = r.rateRemaining ?? lastRemaining
    lists.push(r.data)
  }

  return { ok: true, data: lists, rateRemaining: lastRemaining }
}

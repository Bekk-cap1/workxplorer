"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import OrgProfile from "@/app/components/org/OrgProfile"
import RateLimitError from "@/app/components/org/RateLimitError"
import ErrorCard from "@/app/components/ui/ErrorCard"
import { aggregateLanguages, getTopLanguages } from "@/app/lib/aggregateLanguages"
import { deduplicateContributors } from "@/app/lib/deduplicateContributors"
import {
  fetchAllRepos,
  fetchLanguagesForRepos,
  fetchOrg,
  fetchTopContributors,
  type FetchResult,
} from "@/app/lib/github-client"
import type { GitHubOrg, GitHubRepo } from "@/app/lib/github-types"

type PageState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "rate_limit"; resetUnix: number | null }
  | { status: "not_found"; slug: string }
  | { status: "error"; message: string }
  | {
      status: "ok"
      org: GitHubOrg
      topRepos: GitHubRepo[]
      topLanguages: ReturnType<typeof getTopLanguages>
      topContributors: ReturnType<typeof deduplicateContributors>
      rateRemaining: number | null
    }

function isRateLimit(r: { ok: false; status: number }): boolean {
  return r.status === 403 || r.status === 429
}

export default function OrgClient() {
  const params = useSearchParams()
  const slug = params.get("q") ?? ""
  const [state, setState] = useState<PageState>({ status: "idle" })

  useEffect(() => {
    if (!slug) { setState({ status: "idle" }); return }
    let cancelled = false

    async function load() {
      setState({ status: "loading" })

      const orgRes = await fetchOrg(slug)
      if (cancelled) return
      if (!orgRes.ok) {
        if (orgRes.status === 404) { setState({ status: "not_found", slug }); return }
        if (isRateLimit(orgRes)) { setState({ status: "rate_limit", resetUnix: orgRes.resetUnix ?? null }); return }
        setState({ status: "error", message: "Failed to load organization" }); return
      }

      const org = orgRes.data
      let rateRemaining = orgRes.rateRemaining

      if (org.public_repos === 0) {
        setState({ status: "ok", org, topRepos: [], topLanguages: [], topContributors: [], rateRemaining })
        return
      }

      const reposRes = await fetchAllRepos(slug)
      if (cancelled) return
      if (!reposRes.ok) {
        if (isRateLimit(reposRes)) { setState({ status: "rate_limit", resetUnix: reposRes.resetUnix ?? null }); return }
        setState({ status: "error", message: "Failed to load repositories" }); return
      }

      const allRepos = reposRes.data
      const topRepos = [...allRepos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 10)
      const top3 = [...allRepos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 3)

      const langRes = await fetchLanguagesForRepos(slug, allRepos)
      if (cancelled) return
      if (!langRes.ok) {
        if (isRateLimit(langRes)) { setState({ status: "rate_limit", resetUnix: langRes.resetUnix ?? null }); return }
        setState({ status: "error", message: "Failed to load languages" }); return
      }
      const topLanguages = getTopLanguages(aggregateLanguages(langRes.data))

      const contribRes = await fetchTopContributors(slug, top3)
      if (cancelled) return
      if (!contribRes.ok) {
        if (isRateLimit(contribRes)) { setState({ status: "rate_limit", resetUnix: contribRes.resetUnix ?? null }); return }
        setState({ status: "error", message: "Failed to load contributors" }); return
      }
      rateRemaining = contribRes.rateRemaining ?? rateRemaining
      const topContributors = deduplicateContributors(contribRes.data)

      setState({ status: "ok", org, topRepos, topLanguages, topContributors, rateRemaining })
    }

    load()
    return () => { cancelled = true }
  }, [slug])

  if (state.status === "idle" || state.status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <span className="text-sm text-zinc-400">
          {state.status === "loading" ? "Loading…" : ""}
        </span>
      </div>
    )
  }
  if (state.status === "not_found") return <ErrorCard orgSlug={state.slug} />
  if (state.status === "rate_limit") return <RateLimitError resetUnix={state.resetUnix} variant="page" />
  if (state.status === "error") return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
    </div>
  )

  return (
    <OrgProfile
      org={state.org}
      rateRemaining={state.rateRemaining}
      topRepos={state.topRepos}
      topLanguages={state.topLanguages}
      topContributors={state.topContributors}
    />
  )
}

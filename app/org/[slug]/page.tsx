import OrgProfile from "@/app/components/org/OrgProfile"
import RateLimitError from "@/app/components/org/RateLimitError"
import ErrorCard from "@/app/components/ui/ErrorCard"
import {
  aggregateLanguages,
  getTopLanguages,
} from "@/app/lib/aggregateLanguages"
import { deduplicateContributors } from "@/app/lib/deduplicateContributors"
import {
  fetchAllRepos,
  fetchLanguagesForRepos,
  fetchOrg,
  fetchTopContributors,
} from "@/app/lib/github-server"

export default async function OrgPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const orgRes = await fetchOrg(slug)
  if (!orgRes.ok) {
    if (orgRes.status === 404) return <ErrorCard orgSlug={slug} />
    if (orgRes.status === 403 || orgRes.status === 429) {
      return (
        <RateLimitError resetUnix={orgRes.resetUnix ?? null} variant="page" />
      )
    }
    throw new Error(orgRes.error ?? "Failed to load organization")
  }

  const org = orgRes.data
  const rateRemaining = orgRes.rateRemaining

  if (org.public_repos === 0) {
    return (
      <OrgProfile
        org={org}
        rateRemaining={rateRemaining}
        topRepos={[]}
        topLanguages={[]}
        topContributors={[]}
      />
    )
  }

  const reposRes = await fetchAllRepos(slug)
  if (!reposRes.ok) {
    if (reposRes.status === 403 || reposRes.status === 429) {
      return (
        <RateLimitError resetUnix={reposRes.resetUnix ?? null} variant="page" />
      )
    }
    throw new Error("Failed to load repositories")
  }

  const allRepos = reposRes.data
  const topRepos = [...allRepos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10)
  const top3 = [...allRepos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3)

  const langRes = await fetchLanguagesForRepos(slug, allRepos)
  if (!langRes.ok) {
    if (langRes.status === 403 || langRes.status === 429) {
      return (
        <RateLimitError resetUnix={langRes.resetUnix ?? null} variant="page" />
      )
    }
    throw new Error("Failed to load languages")
  }
  const topLanguages = getTopLanguages(aggregateLanguages(langRes.data))

  const contribRes = await fetchTopContributors(slug, top3)
  if (!contribRes.ok) {
    if (contribRes.status === 403 || contribRes.status === 429) {
      return (
        <RateLimitError
          resetUnix={contribRes.resetUnix ?? null}
          variant="page"
        />
      )
    }
    throw new Error("Failed to load contributors")
  }
  const topContributors = deduplicateContributors(contribRes.data)

  return (
    <OrgProfile
      org={org}
      rateRemaining={contribRes.rateRemaining ?? rateRemaining}
      topRepos={topRepos}
      topLanguages={topLanguages}
      topContributors={topContributors}
    />
  )
}

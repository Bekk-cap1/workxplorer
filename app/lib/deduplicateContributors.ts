// wx-init
import type { GitHubContributor } from "@/app/lib/github-types"

export function deduplicateContributors(
  contributorsArrays: GitHubContributor[][]
): GitHubContributor[] {
  const map = new Map<string, GitHubContributor>()
  for (const list of contributorsArrays) {
    for (const contributor of list) {
      const existing = map.get(contributor.login)
      if (existing) {
        existing.contributions += contributor.contributions
      } else {
        map.set(contributor.login, { ...contributor })
      }
    }
  }
  return Array.from(map.values())
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 5)
}

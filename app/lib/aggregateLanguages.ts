// wx-init
import type { GitHubRepoWithLanguages } from "@/app/lib/github-types"

type LanguageMap = Record<string, number>

export function aggregateLanguages(repos: GitHubRepoWithLanguages[]): LanguageMap {
  const totals: LanguageMap = {}

  for (const repo of repos) {
    if (!repo.languages) continue
    const size = repo.size > 0 ? repo.size : 1

    for (const [lang, bytes] of Object.entries(repo.languages)) {
      const normalized = bytes / size
      totals[lang] = (totals[lang] ?? 0) + normalized
    }
  }
  return totals
}

export type TopLanguageRow = { lang: string; percent: number }

export function getTopLanguages(
  langMap: LanguageMap,
  top = 8
): TopLanguageRow[] {
  const total = Object.values(langMap).reduce((a, b) => a + b, 0)
  if (total <= 0) return []

  const sorted = Object.entries(langMap).sort(([, a], [, b]) => b - a)
  const topEntries = sorted.slice(0, top)
  const topTotal = topEntries.reduce((acc, [, v]) => acc + v, 0)
  const otherTotal = total - topTotal

  const result: TopLanguageRow[] = topEntries.map(([lang, bytes]) => ({
    lang,
    percent: Math.round((bytes / total) * 100),
  }))

  if (otherTotal > 0) {
    result.push({
      lang: "Other",
      percent: Math.round((otherTotal / total) * 100),
    })
  }

  return result
}

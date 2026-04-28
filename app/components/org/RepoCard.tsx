"use client"

import { useLocale } from "next-intl"
import { useTranslations } from "next-intl"

import type { GitHubRepo } from "@/app/lib/github-types"
import { relativeTime, type RelativeTimeLocale } from "@/app/lib/relativeTime"

type Props = {
  repo: GitHubRepo
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, max - 1)}…`
}

export default function RepoCard({ repo }: Props) {
  const t = useTranslations()
  const locale = useLocale() as RelativeTimeLocale

  const description = repo.description
    ? truncate(repo.description, 100)
    : ""

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {repo.name}
        </h3>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs font-medium text-sky-600 hover:underline dark:text-sky-400"
        >
          {t("repo.viewRepo")}
        </a>
      </div>
      {description ? (
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      ) : (
        <p className="text-sm italic text-zinc-400 dark:text-zinc-600">
          —
        </p>
      )}
      <dl className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
        <div>
          <dt className="inline font-medium text-zinc-700 dark:text-zinc-300">
            {t("repo.stars")}:
          </dt>{" "}
          <dd className="inline tabular-nums">{repo.stargazers_count}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-zinc-700 dark:text-zinc-300">
            {t("repo.forks")}:
          </dt>{" "}
          <dd className="inline tabular-nums">{repo.forks_count}</dd>
        </div>
        {repo.language ? (
          <div>
            <dt className="sr-only">Language</dt>
            <dd>{repo.language}</dd>
          </div>
        ) : null}
        <div className="w-full sm:w-auto">
          <dt className="inline font-medium text-zinc-700 dark:text-zinc-300">
            {t("repo.lastUpdated")}:
          </dt>{" "}
          <dd className="inline">{relativeTime(repo.pushed_at, locale)}</dd>
        </div>
      </dl>
    </article>
  )
}

"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"

import Contributors from "@/app/components/org/Contributors"
import LanguageBar from "@/app/components/org/LanguageBar"
import OrgHeader from "@/app/components/org/OrgHeader"
import RepoCard from "@/app/components/org/RepoCard"
import type { TopLanguageRow } from "@/app/lib/aggregateLanguages"
import type {
  GitHubContributor,
  GitHubOrg,
  GitHubRepo,
} from "@/app/lib/github-types"

type Props = {
  org: GitHubOrg
  rateRemaining: number | null
  topRepos: GitHubRepo[]
  topLanguages: TopLanguageRow[]
  topContributors: GitHubContributor[]
}

export default function OrgProfile({
  org,
  rateRemaining,
  topRepos,
  topLanguages,
  topContributors,
}: Props) {
  const t = useTranslations()

  if (org.public_repos === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <OrgHeader org={org} rateRemaining={rateRemaining} />
        <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {t("org.empty.title")}
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {t("org.empty.body")}
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            {t("org.empty.back")}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6">
      <OrgHeader org={org} rateRemaining={rateRemaining} />

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {t("org.sections.techStack")}
        </h2>
        {topLanguages.length === 0 ? (
          <p className="text-sm text-zinc-500">{t("org.empty.body")}</p>
        ) : (
          <LanguageBar
            rows={topLanguages}
            otherLabel={t("org.languageOther")}
          />
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {t("org.sections.repositories")}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {topRepos.map((repo) => (
            <RepoCard key={repo.name} repo={repo} />
          ))}
        </div>
      </section>

      <Contributors contributors={topContributors} />
    </div>
  )
}

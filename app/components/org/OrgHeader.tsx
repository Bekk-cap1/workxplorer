"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

import type { GitHubOrg } from "@/app/lib/github-types"

type Props = {
  org: GitHubOrg
  rateRemaining: number | null
}

export default function OrgHeader({ org, rateRemaining }: Props) {
  const t = useTranslations()

  return (
    <section className="flex flex-col gap-6 border-b border-zinc-200 pb-8 dark:border-zinc-800 sm:flex-row sm:items-start">
      <Image
        src={org.avatar_url}
        alt=""
        width={88}
        height={88}
        className="h-[88px] w-[88px] shrink-0 rounded-2xl border border-zinc-200 bg-zinc-100 object-cover dark:border-zinc-700 dark:bg-zinc-800"
        priority
      />
      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {org.name ?? org.login}
          </h1>
          <a
            href={org.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {t("org.viewOnGitHub")}
          </a>
        </div>
        {org.bio ? (
          <p className="max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {org.bio}
          </p>
        ) : null}
        <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          {org.location ? (
            <div>
              <dt className="sr-only">Location</dt>
              <dd>{org.location}</dd>
            </div>
          ) : null}
          <div>
            <dt className="inline font-medium text-zinc-800 dark:text-zinc-200">
              {t("org.stats.repos")}:
            </dt>{" "}
            <dd className="inline">{org.public_repos}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-zinc-800 dark:text-zinc-200">
              {t("org.stats.followers")}:
            </dt>{" "}
            <dd className="inline">{org.followers}</dd>
          </div>
        </dl>
        {rateRemaining !== null ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            {t("org.rateLimit.remaining", { count: rateRemaining })}
          </p>
        ) : null}
      </div>
    </section>
  )
}

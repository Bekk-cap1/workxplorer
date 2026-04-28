"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

import type { GitHubContributor } from "@/app/lib/github-types"

type Props = {
  contributors: GitHubContributor[]
}

export default function Contributors({ contributors }: Props) {
  const t = useTranslations()

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {t("org.sections.contributors")}
      </h2>
      {contributors.length === 0 ? (
        <p className="text-sm text-zinc-500">—</p>
      ) : (
        <ul className="space-y-4">
          {contributors.map((c) => (
            <li key={c.login}>
              <a
                href={c.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-transparent px-1 py-1 transition hover:border-zinc-200 hover:bg-zinc-50 dark:hover:border-zinc-800 dark:hover:bg-zinc-900/60"
              >
                <Image
                  src={c.avatar_url}
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-full border border-zinc-200 dark:border-zinc-700"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {c.login}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {t("contributor.contributions", {
                      count: c.contributions,
                    })}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

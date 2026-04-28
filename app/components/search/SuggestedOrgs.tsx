"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"

const SUGGESTED = ["vercel", "google", "microsoft", "facebook", "uzinfocom"] as const

export default function SuggestedOrgs() {
  const t = useTranslations()

  return (
    <div className="w-full max-w-xl">
      <p className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400 sm:text-left">
        {t("search.suggestedTitle")}
      </p>
      <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
        {SUGGESTED.map((slug) => (
          <Link
            key={slug}
            href={`/org/${slug}`}
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-800 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
          >
            {slug}
          </Link>
        ))}
      </div>
    </div>
  )
}

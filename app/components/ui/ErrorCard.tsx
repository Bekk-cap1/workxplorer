"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"

type Props = {
  orgSlug: string
}

export default function ErrorCard({ orgSlug }: Props) {
  const t = useTranslations()

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col justify-center px-4 py-16">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {t("errors.notFoundTitle")}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {t("errors.notFoundBody", { slug: orgSlug })}
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          {t("errors.tryOther")}
        </Link>
      </div>
    </div>
  )
}

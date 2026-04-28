"use client"

import { useTranslations } from "next-intl"

import SearchForm from "@/app/components/search/SearchForm"
import SuggestedOrgs from "@/app/components/search/SuggestedOrgs"

export default function SearchPage() {
  const t = useTranslations()

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-16 sm:px-6 sm:py-24">
      <div className="mb-10 max-w-2xl text-center sm:mb-12">
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          {t("search.title")}
        </h1>
        <p className="mt-4 text-pretty text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
          {t("search.subtitle")}
        </p>
      </div>
      <SearchForm />
      <div className="mt-12 w-full">
        <SuggestedOrgs />
      </div>
    </div>
  )
}

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"

import { type SearchValues, searchSchema } from "@/app/components/search/searchSchema"

export default function SearchForm() {
  const t = useTranslations()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { slug: "" },
  })

  const onSubmit = (values: SearchValues) => {
    const slug = values.slug.trim()
    router.push(`/org/${encodeURIComponent(slug)}`)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-start"
    >
      <div className="flex-1">
        <label htmlFor="org-slug" className="sr-only">
          {t("search.placeholder")}
        </label>
        <input
          id="org-slug"
          autoComplete="off"
          placeholder={t("search.placeholder")}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none ring-zinc-400 transition placeholder:text-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:ring-zinc-600"
          {...register("slug")}
        />
        {errors.slug?.message ? (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">
            {t(errors.slug.message)}
          </p>
        ) : null}
      </div>
      <button
        type="submit"
        className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        {t("search.submit")}
      </button>
    </form>
  )
}

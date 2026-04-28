"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"

import ThemeToggle from "@/app/components/layout/ThemeToggle"
import { useAppLocale, type AppLocale } from "@/app/components/providers/I18nProvider"

export default function SiteHeader() {
  const t = useTranslations()
  const { locale, setLocale } = useAppLocale()

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          {t("nav.brand")}
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {t("nav.home")}
          </Link>
          <label className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <span className="sr-only">{t("language.label")}</span>
            <select
              aria-label={t("language.label")}
              value={locale}
              onChange={(e) => setLocale(e.target.value as AppLocale)}
              className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              <option value="en">{t("language.en")}</option>
              <option value="ru">{t("language.ru")}</option>
              <option value="uz">{t("language.uz")}</option>
            </select>
          </label>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}

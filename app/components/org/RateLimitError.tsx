"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"

type Props = {
  resetUnix: number | null
  variant?: "page" | "card"
}

export default function RateLimitError({
  resetUnix,
  variant = "page",
}: Props) {
  const t = useTranslations()
  const router = useRouter()
  const [secondsLeft, setSecondsLeft] = useState(0)

  useEffect(() => {
    if (!resetUnix) return
    const tick = () => {
      const now = Math.floor(Date.now() / 1000)
      setSecondsLeft(Math.max(0, resetUnix - now))
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [resetUnix])

  const shell =
    variant === "page"
      ? "mx-auto flex min-h-[50vh] max-w-lg flex-col justify-center px-4 py-16"
      : ""

  const panel =
    variant === "page"
      ? "rounded-2xl border border-amber-200 bg-amber-50 p-8 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/30"
      : "rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30"

  return (
    <div className={shell}>
      <div className={panel}>
        <h1 className="text-lg font-semibold text-amber-950 dark:text-amber-100">
          {t("org.rateLimit.title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-amber-900/90 dark:text-amber-100/90">
          {t("org.rateLimit.body")}
        </p>
        {resetUnix ? (
          <p className="mt-4 text-sm font-medium text-amber-950 dark:text-amber-50">
            {t("org.rateLimit.resetsIn", { seconds: secondsLeft })}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => router.refresh()}
          className="mt-6 rounded-xl bg-amber-900 px-4 py-2 text-sm font-medium text-amber-50 transition hover:bg-amber-800 dark:bg-amber-200 dark:text-amber-950 dark:hover:bg-amber-100"
        >
          {t("org.rateLimit.retry")}
        </button>
      </div>
    </div>
  )
}

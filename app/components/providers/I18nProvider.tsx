"use client"

import type { ReactNode } from "react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { NextIntlClientProvider } from "next-intl"

import en from "@/app/messages/en.json"
import ru from "@/app/messages/ru.json"
import uz from "@/app/messages/uz.json"

const messages = { en, ru, uz } as const

export type AppLocale = keyof typeof messages

const STORAGE_KEY = "wx-locale"

type LocaleContextValue = {
  locale: AppLocale
  setLocale: (locale: AppLocale) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function useAppLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error("useAppLocale must be used within I18nProvider")
  }
  return ctx
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>("en")

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as AppLocale | null
    if (stored && stored in messages) {
      setLocaleState(stored)
    }
  }, [])

  const setLocale = useCallback((next: AppLocale) => {
    setLocaleState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const ctx = useMemo(
    () => ({ locale, setLocale }),
    [locale, setLocale]
  )

  const activeMessages = messages[locale]

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={activeMessages}
      timeZone="UTC"
      now={new Date()}
    >
      <LocaleContext.Provider value={ctx}>{children}</LocaleContext.Provider>
    </NextIntlClientProvider>
  )
}

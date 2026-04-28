import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import SiteHeader from "@/app/components/layout/SiteHeader"
import { I18nProvider } from "@/app/components/providers/I18nProvider"
import { ThemeProvider } from "@/app/components/providers/ThemeProvider"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "WorkXplorer — Tech Stack Explorer",
  description:
    "Research employers by exploring public GitHub organizations: languages, repositories, and contributors.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <ThemeProvider>
          <I18nProvider>
            <SiteHeader />
            <main className="flex min-h-[calc(100vh-3.5rem)] flex-col">
              {children}
            </main>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

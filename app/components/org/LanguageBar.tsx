import { languageColor } from "@/app/lib/languageColors"
import type { TopLanguageRow } from "@/app/lib/aggregateLanguages"

type Props = {
  rows: TopLanguageRow[]
  otherLabel: string
}

export default function LanguageBar({ rows, otherLabel }: Props) {
  if (rows.length === 0) return null

  const labelFor = (lang: string) => (lang === "Other" ? otherLabel : lang)

  return (
    <div className="space-y-4">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        {rows.map((row) => (
          <div
            key={row.lang}
            className="h-full min-w-0 transition-[flex-grow] duration-500"
            style={{
              flexGrow: Math.max(row.percent, 1),
              flexBasis: 0,
              backgroundColor: languageColor(row.lang),
            }}
            title={`${labelFor(row.lang)} ${row.percent}%`}
          />
        ))}
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <li
            key={row.lang}
            className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-100"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: languageColor(row.lang) }}
            />
            <span className="min-w-0 flex-1 truncate font-medium">
              {labelFor(row.lang)}
            </span>
            <span className="tabular-nums text-zinc-500 dark:text-zinc-400">
              {row.percent}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

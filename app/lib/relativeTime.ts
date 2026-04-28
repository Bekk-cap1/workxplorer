// wx-init
export type RelativeTimeLocale = "en" | "ru" | "uz"

const dict = {
  en: {
    justNow: "just now",
    minute: (n: number) => (n === 1 ? "1 minute ago" : `${n} minutes ago`),
    hour: (n: number) => (n === 1 ? "1 hour ago" : `${n} hours ago`),
    day: (n: number) => (n === 1 ? "1 day ago" : `${n} days ago`),
    month: (n: number) => (n === 1 ? "1 month ago" : `${n} months ago`),
    year: (n: number) => (n === 1 ? "1 year ago" : `${n} years ago`),
  },
  ru: {
    justNow: "только что",
    minute: (n: number) => {
      const mod10 = n % 10
      const mod100 = n % 100
      if (mod100 >= 11 && mod100 <= 14) return `${n} минут назад`
      if (mod10 === 1) return `${n} минуту назад`
      if (mod10 >= 2 && mod10 <= 4) return `${n} минуты назад`
      return `${n} минут назад`
    },
    hour: (n: number) => {
      const mod10 = n % 10
      const mod100 = n % 100
      if (mod100 >= 11 && mod100 <= 14) return `${n} часов назад`
      if (mod10 === 1) return `${n} час назад`
      if (mod10 >= 2 && mod10 <= 4) return `${n} часа назад`
      return `${n} часов назад`
    },
    day: (n: number) => {
      const mod10 = n % 10
      const mod100 = n % 100
      if (mod100 >= 11 && mod100 <= 14) return `${n} дней назад`
      if (mod10 === 1) return `${n} день назад`
      if (mod10 >= 2 && mod10 <= 4) return `${n} дня назад`
      return `${n} дней назад`
    },
    month: (n: number) => {
      const mod10 = n % 10
      const mod100 = n % 100
      if (mod100 >= 11 && mod100 <= 14) return `${n} месяцев назад`
      if (mod10 === 1) return `${n} месяц назад`
      if (mod10 >= 2 && mod10 <= 4) return `${n} месяца назад`
      return `${n} месяцев назад`
    },
    year: (n: number) => {
      const mod10 = n % 10
      const mod100 = n % 100
      if (mod100 >= 11 && mod100 <= 14) return `${n} лет назад`
      if (mod10 === 1) return `${n} год назад`
      if (mod10 >= 2 && mod10 <= 4) return `${n} года назад`
      return `${n} лет назад`
    },
  },
  uz: {
    justNow: "hozirgina",
    minute: (n: number) => `${n} daqiqa oldin`,
    hour: (n: number) => `${n} soat oldin`,
    day: (n: number) => `${n} kun oldin`,
    month: (n: number) => `${n} oy oldin`,
    year: (n: number) => `${n} yil oldin`,
  },
} as const

export function relativeTime(
  dateString: string,
  locale: RelativeTimeLocale = "en"
): string {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  const t = dict[locale]

  if (seconds < 60) return t.justNow

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return t.minute(minutes)

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return t.hour(hours)

  const days = Math.floor(hours / 24)
  if (days < 30) return t.day(days)

  const months = Math.floor(days / 30)
  if (months < 12) return t.month(months)

  const years = Math.floor(months / 12)
  return t.year(years)
}

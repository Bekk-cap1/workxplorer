// wx-init
export type GitHubOrg = {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  location: string | null
  public_repos: number
  followers: number
  html_url: string
}

export type GitHubRepo = {
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  pushed_at: string
  html_url: string
  size: number
}

export type GitHubRepoWithLanguages = GitHubRepo & {
  languages?: Record<string, number>
}

export type GitHubContributor = {
  login: string
  avatar_url: string
  contributions: number
  html_url: string
}

export type GitHubErrorBody = {
  error: "not_found" | "rate_limited" | "bad_request"
  message?: string
}

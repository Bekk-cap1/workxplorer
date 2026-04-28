import {
  ContributorsSkeleton,
  OrgHeaderSkeleton,
  RepoListSkeleton,
  TechStackSkeleton,
} from "@/app/components/ui/Skeleton"

export default function OrgLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6">
      <OrgHeaderSkeleton />
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-4 h-6 w-40 rounded bg-zinc-200 dark:bg-zinc-700" />
        <TechStackSkeleton />
      </div>
      <div>
        <div className="mb-4 h-6 w-48 rounded bg-zinc-200 dark:bg-zinc-700" />
        <RepoListSkeleton />
      </div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-4 h-6 w-56 rounded bg-zinc-200 dark:bg-zinc-700" />
        <ContributorsSkeleton />
      </div>
    </div>
  )
}

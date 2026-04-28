import { Suspense } from "react"
import OrgClient from "./OrgClient"

export default function OrgPage() {
  return (
    <Suspense>
      <OrgClient />
    </Suspense>
  )
}

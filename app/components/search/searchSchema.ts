// wx-init
import { z } from "zod"

export const searchSchema = z.object({
  slug: z
    .string()
    .min(1, "validation.required")
    .regex(/^\S+$/, "validation.noSpaces"),
})

export type SearchValues = z.infer<typeof searchSchema>

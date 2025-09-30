import { z } from 'zod'

export const CopySchema = z.object({
  locale: z.string().default('en'),
  headline: z.string().max(60),
  subheading: z.string().max(90),
  body: z.string().min(30),
  cta: z.string().max(32),
  primary_keywords: z.array(z.string()).min(1).max(2),
  secondary_keywords: z.array(z.string()).max(2).optional(),
  tone: z.enum(['authoritative','friendly','educational','persuasive']),
  target_kpi: z.string()
})
export type CopyT = z.infer<typeof CopySchema>

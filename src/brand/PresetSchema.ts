import { z } from 'zod'

export const MetricPresetSchema = z.object({
  metricName: z.string(),
  value: z.string(),
  delta: z.string(),
  timeframe: z.string(),
  note: z.string().optional()
})
export type MetricPresetT = z.infer<typeof MetricPresetSchema>

export const EMDPresetSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  painStats: z.array(z.object({ label: z.string(), value: z.string()})),
  diagram: z.object({
    nodes: z.array(z.object({ id: z.string(), label: z.string()})),
    edges: z.array(z.object({ from: z.string(), to: z.string()}))
  }),
  cta: z.string()
})
export type EMDPresetT = z.infer<typeof EMDPresetSchema>

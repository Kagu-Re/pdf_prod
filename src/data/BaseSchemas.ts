import { z } from 'zod'

// Base data schemas for all asset templates
export const BaseSchemas = {
  
  // Single metric with change indicator
  SingleMetric: z.object({
    metricName: z.string(),
    value: z.string(),
    delta: z.string().optional(),
    timeframe: z.string(),
    note: z.string().optional(),
    category: z.string().optional()
  }),

  // Multiple metrics with grouping
  MultiMetric: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    metrics: z.array(z.object({
      label: z.string(),
      value: z.string(),
      delta: z.string().optional(),
      category: z.string().optional(),
      trend: z.enum(['up', 'down', 'neutral']).optional()
    })),
    timeframe: z.string()
  }),

  // Time series data with trend
  TimeSeries: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    dataPoints: z.array(z.object({
      date: z.string(),
      value: z.number(),
      label: z.string().optional()
    })),
    trend: z.object({
      direction: z.enum(['up', 'down', 'neutral']),
      percentage: z.string().optional(),
      description: z.string().optional()
    }).optional(),
    timeframe: z.string()
  }),

  // Hierarchical breakdown data
  Hierarchy: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    totalValue: z.string().optional(),
    categories: z.array(z.object({
      name: z.string(),
      value: z.string(),
      percentage: z.string().optional(),
      subcategories: z.array(z.object({
        name: z.string(),
        value: z.string(),
        percentage: z.string().optional()
      })).optional()
    }))
  }),

  // Relationship map (nodes + edges)
  RelationshipMap: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    painStats: z.array(z.object({
      label: z.string(),
      value: z.string()
    })).optional(),
    diagram: z.object({
      nodes: z.array(z.object({
        id: z.string(),
        label: z.string(),
        type: z.string().optional(),
        weight: z.number().optional()
      })),
      edges: z.array(z.object({
        from: z.string(),
        to: z.string(),
        label: z.string().optional(),
        type: z.string().optional()
      }))
    }),
    cta: z.string().optional()
  })
}

// Schema validation helpers
export const validateSchema = (data: unknown, schemaType: keyof typeof BaseSchemas) => {
  try {
    return BaseSchemas[schemaType].parse(data)
  } catch (error) {
    console.error(`Schema validation failed for ${schemaType}:`, error)
    throw error
  }
}

// Type exports for TypeScript
export type SingleMetricData = z.infer<typeof BaseSchemas.SingleMetric>
export type MultiMetricData = z.infer<typeof BaseSchemas.MultiMetric>
export type TimeSeriesData = z.infer<typeof BaseSchemas.TimeSeries>
export type HierarchyData = z.infer<typeof BaseSchemas.Hierarchy>
export type RelationshipMapData = z.infer<typeof BaseSchemas.RelationshipMap>

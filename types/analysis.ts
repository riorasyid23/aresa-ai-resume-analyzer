import { z } from 'zod'

export const AnalysisSchema = z.object({
    id: z.string(),
    userId: z.string(),
    inputText: z.string(),
    outputText: z.string(),
    creditCost: z.number(),
    createdAt: z.number(),
})

export type TAnalysis = z.infer<typeof AnalysisSchema>
import { z } from 'zod'

export const createApiKeySchema = z.object({
  waitlistId: z.string().min(1, 'Waitlist ID is required'),
  name: z.string().min(1, 'API key name is required')
})

export type CreateApiKeyRequest = z.infer<typeof createApiKeySchema>
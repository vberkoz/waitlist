import { z } from 'zod'

export const createSubscriberSchema = z.object({
  email: z.string().email('Invalid email address'),
  waitlistId: z.string().min(1, 'Waitlist ID is required')
})

export const createSubscriberPublicSchema = z.object({
  email: z.string().email('Invalid email address')
})

export type CreateSubscriberRequest = z.infer<typeof createSubscriberSchema>
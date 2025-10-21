import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

const createWaitlistSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/i),
  logo: z.string().optional()
})

type CreateWaitlistData = z.infer<typeof createWaitlistSchema>

interface Waitlist {
  id: string
  name: string
  description: string
  primaryColor: string
  logo?: string
  publicUrl: string
  ownerEmail: string
  subscriberCount: number
  createdAt: string
  updatedAt: string
}

const API_BASE_URL = import.meta.env.VITE_API_URL

export function useWaitlists() {
  return useQuery({
    queryKey: ['waitlists'],
    queryFn: async (): Promise<Waitlist[]> => {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${API_BASE_URL}/waitlists`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch waitlists')
      const data = await response.json()
      return data.waitlists
    }
  })
}

export function useCreateWaitlist() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateWaitlistData) => {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${API_BASE_URL}/waitlists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })
      const result = await response.json()
      if (!response.ok) {
        throw { response: { data: result } }
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlists'] })
    }
  })
}
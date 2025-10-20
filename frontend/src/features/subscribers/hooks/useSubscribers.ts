import { useQuery } from '@tanstack/react-query'

interface Subscriber {
  subscriberId: string
  email: string
  waitlistId: string
  createdAt: string
}

interface SubscribersResponse {
  subscribers: Subscriber[]
  lastKey: string | null
  count: number
}

export function useSubscribers(waitlistId: string = 'test-waitlist-123') {
  return useQuery({
    queryKey: ['subscribers', waitlistId],
    queryFn: async (): Promise<SubscribersResponse> => {
      const response = await fetch(`https://jst5vtct18.execute-api.us-east-1.amazonaws.com/prod/subscribers?waitlistId=${waitlistId}`)
      if (!response.ok) throw new Error('Failed to fetch subscribers')
      return response.json()
    }
  })
}
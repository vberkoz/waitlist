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

interface UseSubscribersOptions {
  waitlistId?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

export function useSubscribers(options: UseSubscribersOptions = {}) {
  const { waitlistId = 'test-waitlist-123', sortOrder = 'desc', search } = options
  
  return useQuery({
    queryKey: ['subscribers', waitlistId, sortOrder, search],
    queryFn: async (): Promise<SubscribersResponse> => {
      const params = new URLSearchParams({
        waitlistId,
        sortOrder
      })
      
      if (search) {
        params.append('search', search)
      }
      
      const response = await fetch(`https://jst5vtct18.execute-api.us-east-1.amazonaws.com/prod/subscribers?${params}`)
      if (!response.ok) throw new Error('Failed to fetch subscribers')
      return response.json()
    }
  })
}
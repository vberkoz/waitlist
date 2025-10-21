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
  const { waitlistId, sortOrder = 'desc', search } = options
  
  return useQuery({
    queryKey: ['subscribers', waitlistId, sortOrder, search],
    queryFn: async (): Promise<SubscribersResponse> => {
      const params = new URLSearchParams({ sortOrder })
      
      if (waitlistId) {
        params.append('waitlistId', waitlistId)
      }
      
      if (search) {
        params.append('search', search)
      }
      
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}/subscribers?${params}`)
      if (!response.ok) throw new Error('Failed to fetch subscribers')
      return response.json()
    }
  })
}
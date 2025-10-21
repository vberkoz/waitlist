import { useMutation, useQueryClient } from '@tanstack/react-query'

const API_BASE_URL = import.meta.env.VITE_API_URL

interface Subscriber {
  subscriberId: string
  email: string
  createdAt: string
}

export function useDeleteSubscriber() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (subscriberId: string) => {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${API_BASE_URL}/subscribers/${subscriberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to delete subscriber')
      return response.json()
    },
    onMutate: async (subscriberId) => {
      await queryClient.cancelQueries({ queryKey: ['subscribers'] })
      const previousData: any[] = []
      
      queryClient.getQueriesData({ queryKey: ['subscribers'] }).forEach(([key, data]) => {
        previousData.push([key, data])
        queryClient.setQueryData(key, (old: any) => ({
          ...old,
          subscribers: old?.subscribers?.filter((s: Subscriber) => s.subscriberId !== subscriberId) || []
        }))
      })
      
      return { previousData }
    },
    onError: (_err, _subscriberId, context) => {
      context?.previousData?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data)
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] })
    }
  })
}

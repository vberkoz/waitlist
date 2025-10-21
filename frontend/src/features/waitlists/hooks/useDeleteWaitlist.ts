import { useMutation, useQueryClient } from '@tanstack/react-query'

const API_BASE_URL = import.meta.env.VITE_API_URL

interface Waitlist {
  id: string
  name: string
  description: string
  subscriberCount: number
  createdAt: string
  publicUrl: string
}

export function useDeleteWaitlist() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (waitlistId: string) => {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${API_BASE_URL}/waitlists/${waitlistId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to delete waitlist')
      return response.json()
    },
    onMutate: async (waitlistId) => {
      await queryClient.cancelQueries({ queryKey: ['waitlists'] })
      const previousWaitlists = queryClient.getQueryData(['waitlists'])
      queryClient.setQueryData(['waitlists'], (old: Waitlist[] | undefined) => 
        old?.filter(w => w.id !== waitlistId) || []
      )
      return { previousWaitlists }
    },
    onError: (_err, _waitlistId, context) => {
      queryClient.setQueryData(['waitlists'], context?.previousWaitlists)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlists'] })
    }
  })
}

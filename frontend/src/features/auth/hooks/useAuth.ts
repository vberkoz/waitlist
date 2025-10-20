import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

type LoginData = z.infer<typeof loginSchema>

interface User {
  email: string
  role: string
}

interface AuthResponse {
  token: string
  user: User
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function useLogin() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: LoginData): Promise<AuthResponse> => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Invalid credentials')
      return response.json()
    },
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.token)
      queryClient.setQueryData(['auth', 'user'], data.user)
    }
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  
  return () => {
    localStorage.removeItem('auth_token')
    queryClient.setQueryData(['auth', 'user'], null)
    queryClient.clear()
  }
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async (): Promise<User | null> => {
      const token = localStorage.getItem('auth_token')
      if (!token) return null
      
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!response.ok) {
        localStorage.removeItem('auth_token')
        return null
      }
      const data = await response.json()
      return data.user
    },
    retry: false
  })
}

export function useIsAuthenticated() {
  const { data: user, isLoading } = useCurrentUser()
  return { isAuthenticated: !!user, isLoading }
}
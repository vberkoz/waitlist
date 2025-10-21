import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
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

const API_BASE_URL = import.meta.env.VITE_API_URL

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
  return () => {
    localStorage.removeItem('auth_token')
    window.location.href = '/login'
  }
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: (): User | null => {
      const token = localStorage.getItem('auth_token')
      if (!token) return null
      
      // Return cached user data without API call for now
      return { email: 'admin@waitlist.com', role: 'admin' }
    },
    enabled: false, // Disable automatic fetching
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity
  })
}

export function useIsAuthenticated() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('auth_token'))
  }, [])
  
  return { isAuthenticated, isLoading: false }
}
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
  username?: string
}

interface CognitoAuthResponse {
  accessToken: string
  idToken: string
  refreshToken: string
  user: User
}

const API_BASE_URL = import.meta.env.VITE_API_URL

export function useCognitoLogin() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: LoginData): Promise<CognitoAuthResponse> => {
      const response = await fetch(`${API_BASE_URL}/auth/cognito-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Login failed')
      }
      return response.json()
    },
    onSuccess: (data) => {
      localStorage.setItem('cognito_access_token', data.accessToken)
      localStorage.setItem('cognito_id_token', data.idToken)
      localStorage.setItem('cognito_refresh_token', data.refreshToken)
      queryClient.setQueryData(['auth', 'user'], data.user)
    }
  })
}

export function useCognitoLogout() {
  const queryClient = useQueryClient()
  
  return () => {
    localStorage.removeItem('cognito_access_token')
    localStorage.removeItem('cognito_id_token')
    localStorage.removeItem('cognito_refresh_token')
    queryClient.setQueryData(['auth', 'user'], null)
    queryClient.clear()
  }
}

export function useCognitoCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async (): Promise<User | null> => {
      const accessToken = localStorage.getItem('cognito_access_token')
      if (!accessToken) return null
      
      const response = await fetch(`${API_BASE_URL}/auth/cognito-verify`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (!response.ok) {
        localStorage.removeItem('cognito_access_token')
        localStorage.removeItem('cognito_id_token')
        localStorage.removeItem('cognito_refresh_token')
        return null
      }
      const data = await response.json()
      return data.user
    },
    retry: false
  })
}

export function useCognitoIsAuthenticated() {
  const { data: user, isLoading } = useCognitoCurrentUser()
  return { isAuthenticated: !!user, isLoading }
}
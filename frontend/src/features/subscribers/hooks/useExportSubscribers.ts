import { useMutation } from '@tanstack/react-query'

interface ExportResponse {
  downloadUrl: string
  filename: string
  count: number
  expiresIn: number
}

export function useExportSubscribers() {
  return useMutation({
    mutationFn: async (waitlistId?: string): Promise<ExportResponse> => {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams()
      if (waitlistId) {
        params.append('waitlistId', waitlistId)
      } else {
        params.append('waitlistId', 'all')
      }

      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}/subscribers/export?${params}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to export subscribers')
      return response.json()
    },
    onSuccess: (data) => {
      window.open(data.downloadUrl, '_blank')
    }
  })
}
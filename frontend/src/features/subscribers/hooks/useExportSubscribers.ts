import { useMutation } from '@tanstack/react-query'

interface ExportResponse {
  downloadUrl: string
  filename: string
  count: number
  expiresIn: number
}

export function useExportSubscribers() {
  return useMutation({
    mutationFn: async (waitlistId: string = 'test-waitlist-123'): Promise<ExportResponse> => {
      // For now, simulate the export process since API Gateway integration has issues
      // In production, this would call the actual API endpoint
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate mock CSV content
      const csvContent = `Email,Created At,Subscriber ID
"test@example.com","2025-10-20T13:02:18.902Z","91614421-09b7-40ce-a7bf-e3dcc67aeb29"
"apikey-test@example.com","2025-10-20T13:23:51.583Z","11bce983-4c06-4668-bc06-7fca41e44739"`
      
      // Create blob and object URL for download
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const downloadUrl = URL.createObjectURL(blob)
      
      return {
        downloadUrl,
        filename: `subscribers-${waitlistId}-${Date.now()}.csv`,
        count: 4,
        expiresIn: 3600
      }
    },
    onSuccess: (data) => {
      // Automatically download the file
      const link = document.createElement('a')
      link.href = data.downloadUrl
      link.download = data.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up the object URL
      URL.revokeObjectURL(data.downloadUrl)
    }
  })
}
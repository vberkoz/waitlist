import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSubscribers } from '@/features/subscribers/hooks/useSubscribers'
import { useExportSubscribers } from '@/features/subscribers/hooks/useExportSubscribers'
import { DataTable } from '@/components/subscribers/data-table'
import { columns } from '@/components/subscribers/columns'
import { toast } from 'sonner'

export default function SubscribersPage() {
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data, isLoading, error } = useSubscribers({
    search: debouncedSearch || undefined,
    sortOrder
  })

  const exportMutation = useExportSubscribers()

  const handleExport = () => {
    exportMutation.mutate('test-waitlist-123', {
      onSuccess: (data) => {
        toast.success(`Exported ${data.count} subscribers successfully`)
      },
      onError: (error) => {
        toast.error('Failed to export subscribers')
      }
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Subscribers</h1>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-muted-foreground">Loading subscribers...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Subscribers</h1>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-destructive">Error loading subscribers: {error.message}</div>
        </div>
      </div>
    )
  }

  const subscribers = data?.subscribers || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subscribers</h1>
        <div className="flex gap-2">
          <Input 
            type="search" 
            placeholder="Search by email..." 
            className="w-64" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest</SelectItem>
              <SelectItem value="asc">Oldest</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleExport}
            disabled={exportMutation.isPending}
          >
            {exportMutation.isPending ? 'Exporting...' : 'Export CSV'}
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={subscribers} />

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {subscribers.length} subscribers
        </div>
      </div>
    </div>
  )
}

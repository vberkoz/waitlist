import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Subscribers</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
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
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Subscribers</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Subscribers</h1>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            Error loading subscribers: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const subscribers = data?.subscribers || []

  return (
    <div className="min-h-0 flex-1 space-y-6 p-6 max-w-full overflow-hidden">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Subscribers</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Subscribers</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Input 
            type="search" 
            placeholder="Search by email..." 
            className="w-full sm:w-64 min-w-0" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-2 flex-shrink-0">
            <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
              <SelectTrigger className="w-full sm:w-32">
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
              className="whitespace-nowrap"
            >
              {exportMutation.isPending ? 'Exporting...' : 'Export CSV'}
            </Button>
          </div>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <DataTable columns={columns} data={subscribers} />
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {subscribers.length} subscribers
      </div>
    </div>
  )
}

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSubscribers } from '@/features/subscribers/hooks/useSubscribers'
import { DataTable } from '@/components/subscribers/data-table'
import { columns } from '@/components/subscribers/columns'

export default function SubscribersPage() {
  const { data, isLoading, error } = useSubscribers()

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
          <Input type="search" placeholder="Search" className="w-64" />
          <Button variant="outline">Filter</Button>
          <Button>Export CSV</Button>
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

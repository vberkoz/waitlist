import { useNavigate } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useWaitlists } from '@/features/waitlists/hooks/useWaitlists'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function WaitlistsPage() {
  const navigate = useNavigate()
  const { data: waitlists, isLoading, error } = useWaitlists()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Waitlists</h1>
          <Button onClick={() => navigate('/waitlists/create')}>+ Create New Waitlist</Button>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-muted-foreground">Loading waitlists...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Waitlists</h1>
          <Button onClick={() => navigate('/waitlists/create')}>+ Create New Waitlist</Button>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            Error loading waitlists: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Waitlists</h1>
        <Button onClick={() => navigate('/waitlists/create')}>+ Create New Waitlist</Button>
      </div>

      {waitlists && waitlists.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Subscribers</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waitlists.map((waitlist) => (
                <TableRow key={waitlist.id}>
                  <TableCell className="font-medium">{waitlist.name}</TableCell>
                  <TableCell>{waitlist.subscriberCount}</TableCell>
                  <TableCell>{new Date(waitlist.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No waitlists yet</h3>
          <p className="text-muted-foreground mb-4">Create your first waitlist to get started</p>
          <Button onClick={() => navigate('/waitlists/create')}>Create New Waitlist</Button>
        </div>
      )}
    </div>
  )
}

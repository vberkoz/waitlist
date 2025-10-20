import { useNavigate } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

export default function WaitlistsPage() {
  const navigate = useNavigate()

  const waitlists = [
    { id: 1, name: 'Product Launch 2024', subscribers: 234, createdAt: '2024-01-15' },
    { id: 2, name: 'Beta Program', subscribers: 89, createdAt: '2024-01-10' },
    { id: 3, name: 'Early Access Campaign', subscribers: 156, createdAt: '2024-01-08' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Waitlists</h1>
        <Button onClick={() => navigate('/waitlists/create')}>+ Create New Waitlist</Button>
      </div>

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
                <TableCell>{waitlist.subscribers}</TableCell>
                <TableCell>{waitlist.createdAt}</TableCell>
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
    </div>
  )
}

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

export default function SubscribersPage() {
  const subscribers = [
    { id: 1, email: 'user@email.com', date: '2024-01-15' },
    { id: 2, email: 'john@example.com', date: '2024-01-14' },
    { id: 3, email: 'jane@test.com', date: '2024-01-13' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subscribers - Product Launch 2024</h1>
        <div className="flex gap-2">
          <Input type="search" placeholder="Search" className="w-64" />
          <Button variant="outline">Filter</Button>
          <Button>Export CSV</Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>{sub.email}</TableCell>
                <TableCell>{sub.date}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Showing 1-10 of 234</div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

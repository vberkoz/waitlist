import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useWaitlists } from '@/features/waitlists/hooks/useWaitlists'
import { DataTable } from '@/components/waitlists/data-table'
import { columns } from '@/components/waitlists/columns'

export default function WaitlistsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data: waitlists, isLoading, error } = useWaitlists()

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
              <BreadcrumbPage>Waitlists</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
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
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Waitlists</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
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

  const filteredWaitlists = (waitlists || []).filter(w => 
    w.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  ).sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
  })

  return (
    <div className="space-y-6 max-w-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Waitlists</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Waitlists</h1>
          <Button onClick={() => navigate('/waitlists/create')}>+ Create New Waitlist</Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Input 
            type="search" 
            placeholder="Search by name..." 
            className="w-full sm:w-64 min-w-0" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest</SelectItem>
              <SelectItem value="asc">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <DataTable columns={columns} data={filteredWaitlists} />
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredWaitlists.length} waitlists
      </div>
    </div>
  )
}

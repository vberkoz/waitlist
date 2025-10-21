import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useDeleteWaitlist } from '@/features/waitlists/hooks/useDeleteWaitlist'
import { toast } from 'sonner'

export type Waitlist = {
  id: string
  name: string
  description: string
  subscriberCount: number
  createdAt: string
  publicUrl: string
}

export const columns: ColumnDef<Waitlist>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'subscriberCount',
    header: 'Subscribers',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      return new Date(row.getValue('createdAt')).toLocaleDateString()
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const waitlist = row.original
      const deleteMutation = useDeleteWaitlist()
      const [showDeleteDialog, setShowDeleteDialog] = useState(false)

      const handleDelete = () => {
        deleteMutation.mutate(waitlist.id, {
          onSuccess: () => {
            toast.success('Waitlist deleted successfully')
            setShowDeleteDialog(false)
          },
          onError: () => {
            toast.error('Failed to delete waitlist')
          }
        })
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.open(waitlist.publicUrl, '_blank')}>
                View Public Page
              </DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => setShowDeleteDialog(true)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Waitlist</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{waitlist.name}"? This will unpublish the page and cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )
    },
  },
]

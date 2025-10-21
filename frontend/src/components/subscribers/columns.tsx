"use client"

import { useState } from 'react'
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useDeleteSubscriber } from '@/features/subscribers/hooks/useDeleteSubscriber'
import { toast } from 'sonner'

export type Subscriber = {
  subscriberId: string
  email: string
  waitlistId: string
  createdAt: string
}

export const columns: ColumnDef<Subscriber>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Email
          {column.getIsSorted() === "asc" ? " ↑" : column.getIsSorted() === "desc" ? " ↓" : ""}
        </Button>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Date
          {column.getIsSorted() === "asc" ? " ↑" : column.getIsSorted() === "desc" ? " ↓" : ""}
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return date.toLocaleDateString()
    },
    sortingFn: (rowA, rowB) => {
      const dateA = new Date(rowA.getValue("createdAt"))
      const dateB = new Date(rowB.getValue("createdAt"))
      return dateA.getTime() - dateB.getTime()
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const subscriber = row.original
      const deleteMutation = useDeleteSubscriber()
      const [showDeleteDialog, setShowDeleteDialog] = useState(false)

      const handleDelete = () => {
        deleteMutation.mutate(subscriber.subscriberId, {
          onSuccess: () => {
            toast.success('Subscriber deleted successfully')
            setShowDeleteDialog(false)
          },
          onError: () => {
            toast.error('Failed to delete subscriber')
          }
        })
      }

      return (
        <>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete
          </Button>

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Subscriber</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{subscriber.email}"? This action cannot be undone.
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
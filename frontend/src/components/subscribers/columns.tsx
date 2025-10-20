"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"

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
      return (
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => {
            // TODO: Implement delete functionality
            console.log("Delete subscriber:", row.original.subscriberId)
          }}
        >
          Delete
        </Button>
      )
    },
  },
]
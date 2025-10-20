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
    header: "Email",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return date.toLocaleDateString()
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
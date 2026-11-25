"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"

import { DataTableContextProvider } from "./context"
import type { DataTableRowData } from "./types"
import type { UseDataTableReturn } from "./use-data-table"

interface DataTableProps<TData extends DataTableRowData> extends React.ComponentProps<"div"> {
  /** The value returned by `useDataTable`. */
  instance: UseDataTableReturn<TData>
}

/**
 * Data table surface: a white card with a 12px radius and a 1px border. Compose the parts inside it:
 * `DataTableToolbar`, `DataTableTable`, `DataTablePagination`, `DataTableCommandBar`.
 */
function DataTable<TData extends DataTableRowData>({ instance, className, children, ...props }: DataTableProps<TData>) {
  return (
    <DataTableContextProvider instance={instance}>
      <TooltipProvider>
        <div
          data-slot="data-table"
          className={cn(
            "relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card text-card-foreground",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </DataTableContextProvider>
  )
}

export { DataTable }
export type { DataTableProps }

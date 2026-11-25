"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

import { useDataTableContext } from "./context"

interface DataTablePaginationTranslations {
  /** @default "of" */
  of?: string
  /** @default "results" */
  results?: string
  /** @default "Page" */
  page?: string
  /** @default "Rows per page" */
  rowsPerPage?: string
  /** @default "Previous page" */
  prev?: string
  /** @default "Next page" */
  next?: string
}

interface DataTablePaginationProps extends React.ComponentProps<"div"> {
  translations?: DataTablePaginationTranslations
  /** Show a rows-per-page picker with these sizes, e.g. [10, 20, 50]. */
  pageSizeOptions?: number[]
}

const DEFAULTS: Required<DataTablePaginationTranslations> = {
  of: "of",
  results: "results",
  page: "Page",
  rowsPerPage: "Rows per page",
  prev: "Previous page",
  next: "Next page",
}

/** Footer with "1 – 10 of 134 results", optional page size, page count and previous / next. */
function DataTablePagination({ translations, pageSizeOptions, className, ...props }: DataTablePaginationProps) {
  const { instance } = useDataTableContext()
  const t = { ...DEFAULTS, ...translations }

  if (!instance.enablePagination) {
    throw new Error("DataTablePagination needs `pagination` in useDataTable.")
  }

  if (instance.showSkeleton) {
    return (
      <div data-slot="data-table-pagination-skeleton" className="flex items-center justify-between px-4 py-3">
        <Skeleton className="h-4 w-36" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="size-8" />
          <Skeleton className="size-8" />
        </div>
      </div>
    )
  }

  const { rowCount: count, pageIndex, pageSize } = instance
  const from = count === 0 ? 0 : pageIndex * pageSize + 1
  const to = Math.min(count, (pageIndex + 1) * pageSize)
  const pageCount = Math.max(instance.getPageCount(), 1)
  const fmt = (n: number) => n.toLocaleString("en-IN")

  return (
    <div
      data-slot="data-table-pagination"
      className={cn(
        "flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t px-4 py-3 text-sm text-muted-foreground tabular-nums",
        className
      )}
      {...props}
    >
      <p aria-live="polite">
        <span className="text-foreground">
          {fmt(from)} – {fmt(to)}
        </span>{" "}
        {t.of} {fmt(count)} {t.results}
      </p>
      <div className="flex items-center gap-2">
        {pageSizeOptions && pageSizeOptions.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap">{t.rowsPerPage}</span>
            <Select value={String(pageSize)} onValueChange={(v) => instance.setPageSize(Number(v))}>
              <SelectTrigger size="sm" aria-label={t.rowsPerPage} className="min-w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <span className="px-1 whitespace-nowrap">
          {t.page} {pageIndex + 1} {t.of} {pageCount}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={t.prev}
          onClick={() => instance.previousPage()}
          disabled={!instance.getCanPreviousPage()}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={t.next}
          onClick={() => instance.nextPage()}
          disabled={!instance.getCanNextPage()}
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  )
}

export { DataTablePagination }
export type { DataTablePaginationProps, DataTablePaginationTranslations }

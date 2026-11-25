"use client"

import * as React from "react"
import { dequal } from "dequal"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { useDataTableContext } from "./context"
import { DataTableFilter } from "./filter"
import { isEmptyFilterValue } from "./utils"

interface DataTableFilterBarProps {
  /** @default "Clear all" */
  clearAllFiltersLabel?: string
  alwaysShow?: boolean
  children?: React.ReactNode
}

interface LocalFilter {
  id: string
  value: unknown
  /** Just added from the filter menu: its picker opens and it drops out if closed empty. */
  isNew: boolean
}

/** Row of active filter chips under the toolbar. Rendered by `DataTableToolbar`. */
function DataTableFilterBar({ clearAllFiltersLabel = "Clear all", alwaysShow = false, children }: DataTableFilterBarProps) {
  const { instance } = useDataTableContext()
  const [localFilters, setLocalFilters] = React.useState<LocalFilter[]>([])
  const parent = instance.getFiltering()

  // Mirror the controlled filter state, keeping chips the user just added (still empty) in place.
  React.useEffect(() => {
    setLocalFilters((prev) => {
      const parentIds = Object.keys(parent)
      const next: LocalFilter[] = prev
        .filter((f) => parentIds.includes(f.id) || f.isNew)
        .map((f) =>
          parentIds.includes(f.id)
            ? { id: f.id, value: parent[f.id], isNew: f.isNew && isEmptyFilterValue(parent[f.id]) }
            : f
        )
      for (const id of parentIds) {
        if (!prev.some((f) => f.id === id)) {
          next.push({ id, value: parent[id], isNew: isEmptyFilterValue(parent[id]) })
        }
      }
      return dequal(next, prev) ? prev : next
    })
    // `parent` is a fresh object every render; compare by value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(parent)])

  const updateFilter = (id: string, value: unknown) => {
    setLocalFilters((prev) => prev.map((f) => (f.id === id ? { ...f, value, isNew: false } : f)))
    if (isEmptyFilterValue(value)) {
      if (parent[id] !== undefined) instance.removeFilter(id)
      return
    }
    instance.updateFilter({ id, value })
  }

  const removeFilter = (id: string) => {
    setLocalFilters((prev) => prev.filter((f) => f.id !== id))
    if (id in parent) instance.removeFilter(id)
  }

  const clearFilters = () => {
    setLocalFilters([])
    instance.clearFilters()
  }

  const count = localFilters.length
  if (count === 0 && !alwaysShow && !children) return null

  if (instance.showSkeleton) {
    return (
      <div data-slot="data-table-filter-bar-skeleton" className="flex items-center gap-2 border-t px-4 py-2">
        {Array.from({ length: count }, (_, i) => (
          <Skeleton key={i} className="h-8 w-44" />
        ))}
      </div>
    )
  }

  return (
    <div
      data-slot="data-table-filter-bar"
      className="flex w-full items-center justify-between gap-2 overflow-x-auto border-t px-4 py-2"
    >
      <div className="flex min-h-8 flex-nowrap items-center gap-2 md:flex-wrap">
        {localFilters.map((f) => (
          <DataTableFilter
            key={f.id}
            id={f.id}
            filter={f.value}
            isNew={f.isNew}
            onUpdate={(value) => updateFilter(f.id, value)}
            onRemove={() => removeFilter(f.id)}
          />
        ))}
        {count > 0 && (
          <Button type="button" variant="ghost" size="sm" className="text-muted-foreground" onClick={clearFilters}>
            {clearAllFiltersLabel}
          </Button>
        )}
      </div>
      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </div>
  )
}

export { DataTableFilterBar }
export type { DataTableFilterBarProps }

"use client"

import * as React from "react"
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, Columns3Icon, ListFilterIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { useDataTableContext } from "./context"
import type { DataTableColumn, DataTableColumnMeta, DataTableFilter, DataTableRowData } from "./types"

/** Icon button that opens a menu, with an optional tooltip. */
function MenuTrigger({
  tooltip,
  label,
  disabled,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { tooltip?: string; label: string }) {
  const button = (
    <DropdownMenuTrigger asChild disabled={disabled}>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={tooltip ?? label}
        className={className}
        {...props}
      >
        {children}
      </Button>
    </DropdownMenuTrigger>
  )
  if (!tooltip) return button
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}

function defaultFilterValue(filter: DataTableFilter) {
  switch (filter.type) {
    case "select":
    case "multiselect":
      return []
    case "string":
      return ""
    default:
      return null
  }
}

interface DataTableFilterMenuProps extends Omit<React.ComponentProps<typeof Button>, "children"> {
  tooltip?: string
  /** Replaces the default "add the filter with an empty value" behaviour. */
  onAddFilter?: (id: string, value: unknown) => void
}

/** Menu of filters not yet applied; picking one adds a chip and opens its value picker. */
function DataTableFilterMenu({ tooltip = "Add filter", onAddFilter, ...props }: DataTableFilterMenuProps) {
  const { instance } = useDataTableContext()
  const enabled = Object.keys(instance.getFiltering())
  const available = instance.getFilters().filter((f) => !enabled.includes(f.id))

  if (instance.getFilters().length === 0) {
    throw new Error("DataTableFilterMenu needs `filters` in useDataTable.")
  }

  if (instance.showSkeleton) return <Skeleton data-slot="data-table-filter-menu-skeleton" className="size-8" />

  return (
    // Non-modal: picking a filter opens its (modal) value picker right away, and two modal layers
    // swapping in the same tick can leave the page with pointer events disabled.
    <DropdownMenu modal={false}>
      <MenuTrigger
        data-slot="data-table-filter-menu"
        tooltip={tooltip}
        label="Add filter"
        disabled={available.length === 0}
        {...props}
      >
        <ListFilterIcon />
      </MenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-auto min-w-44">
        {available.map((filter) => (
          <DropdownMenuItem
            key={filter.id}
            onClick={(e) => {
              e.stopPropagation()
              const value = defaultFilterValue(filter)
              if (onAddFilter) onAddFilter(filter.id, value)
              else instance.addFilter({ id: filter.id, value })
            }}
          >
            {filter.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function getSortLabel(column: DataTableColumn<DataTableRowData>) {
  const meta = column.columnDef.meta as DataTableColumnMeta | undefined
  const header = typeof column.columnDef.header === "string" ? column.columnDef.header : undefined
  return meta?.__sort?.sortLabel ?? header ?? column.id
}

interface DataTableSortingMenuProps extends Omit<React.ComponentProps<typeof Button>, "children"> {
  tooltip?: string
}

/** Menu to pick the sort column and direction. */
function DataTableSortingMenu({ tooltip = "Sort", ...props }: DataTableSortingMenuProps) {
  const { instance } = useDataTableContext()
  const sortable = instance.getAllColumns().filter((c) => c.getCanSort())
  const sorting = instance.getSorting()
  const selected = sortable.find((c) => c.id === sorting?.id)

  if (!instance.enableSorting) {
    throw new Error("DataTableSortingMenu needs `sorting` in useDataTable.")
  }
  if (sortable.length === 0) {
    throw new Error("DataTableSortingMenu needs at least one column with `enableSorting: true`.")
  }

  if (instance.showSkeleton) return <Skeleton data-slot="data-table-sorting-menu-skeleton" className="size-8" />

  const selectedMeta = selected?.columnDef.meta as DataTableColumnMeta | undefined

  return (
    <DropdownMenu>
      <MenuTrigger data-slot="data-table-sorting-menu" tooltip={tooltip} label="Sort" {...props}>
        <ArrowUpDownIcon />
      </MenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="w-auto min-w-48">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={sorting?.id ?? ""}
          onValueChange={(id) => instance.setSorting((prev) => ({ id, desc: prev?.desc ?? false }))}
        >
          {sortable.map((column) => (
            <DropdownMenuRadioItem key={column.id} value={column.id} onSelect={(e) => e.preventDefault()}>
              {getSortLabel(column as DataTableColumn<DataTableRowData>)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        {sorting && selected && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={sorting.desc ? "desc" : "asc"}
              onValueChange={(dir) => instance.setSorting((prev) => ({ id: prev?.id ?? "", desc: dir === "desc" }))}
            >
              <DropdownMenuRadioItem value="asc" onSelect={(e) => e.preventDefault()} className="gap-2">
                <ArrowUpIcon className="text-muted-foreground" />
                {selectedMeta?.__sort?.sortAscLabel ?? "A-Z"}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="desc" onSelect={(e) => e.preventDefault()} className="gap-2">
                <ArrowDownIcon className="text-muted-foreground" />
                {selectedMeta?.__sort?.sortDescLabel ?? "Z-A"}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function getColumnName(column: DataTableColumn<DataTableRowData>) {
  const meta = column.columnDef.meta as DataTableColumnMeta | undefined
  const header = typeof column.columnDef.header === "string" ? column.columnDef.header : undefined
  return meta?.name ?? header ?? column.id
}

interface DataTableColumnVisibilityMenuProps extends Omit<React.ComponentProps<typeof Button>, "children"> {
  tooltip?: string
}

/** Menu to show and hide columns. Renders nothing unless `columnVisibility` is passed to useDataTable. */
function DataTableColumnVisibilityMenu({ tooltip = "Columns", className, ...props }: DataTableColumnVisibilityMenuProps) {
  const { instance } = useDataTableContext()
  if (!instance.enableColumnVisibility) return null

  const columns = instance.getAllColumns().filter((c) => c.getCanHide()) as DataTableColumn<DataTableRowData>[]
  const allVisible = columns.every((c) => c.getIsVisible())
  const someVisible = columns.some((c) => c.getIsVisible())

  return (
    <DropdownMenu>
      <MenuTrigger
        data-slot="data-table-column-visibility-menu"
        tooltip={tooltip}
        label="Columns"
        className={className}
        {...props}
      >
        <Columns3Icon />
      </MenuTrigger>
      <DropdownMenuContent align="end" className="w-auto min-w-52">
        <DropdownMenuLabel>Show columns</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={allVisible ? true : someVisible ? "indeterminate" : false}
          onSelect={(e) => e.preventDefault()}
          onCheckedChange={() =>
            instance.setColumnVisibility(Object.fromEntries(columns.map((c) => [c.id, !allVisible])))
          }
        >
          All columns
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <div className={cn("max-h-64 overflow-y-auto")}>
          {columns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onSelect={(e) => e.preventDefault()}
              onCheckedChange={() => column.toggleVisibility()}
            >
              <span className="truncate">{getColumnName(column)}</span>
            </DropdownMenuCheckboxItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { DataTableColumnVisibilityMenu, DataTableFilterMenu, DataTableSortingMenu }
export type { DataTableColumnVisibilityMenuProps, DataTableFilterMenuProps, DataTableSortingMenuProps }

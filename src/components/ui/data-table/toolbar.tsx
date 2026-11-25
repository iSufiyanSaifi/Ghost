"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import { DataTableFilterBar } from "./filter-bar"

interface DataTableToolbarTranslations {
  /** @default "Clear all" */
  clearAll?: string
}

interface DataTableToolbarProps extends React.ComponentProps<"div"> {
  translations?: DataTableToolbarTranslations
  /** Extra content at the end of the filter bar. */
  filterBarContent?: React.ReactNode
  /** Keep the filter bar visible with no filters, to avoid layout shift. */
  alwaysShowFilterBar?: boolean
}

/** Top bar of a data table (title, search, menus), with the active filter chips below it. */
function DataTableToolbar({
  className,
  children,
  translations,
  filterBarContent,
  alwaysShowFilterBar,
  ...props
}: DataTableToolbarProps) {
  return (
    <div data-slot="data-table-toolbar" className="flex flex-col border-b">
      <div className={cn("flex items-center gap-2 px-4 py-3", className)} {...props}>
        {children}
      </div>
      <DataTableFilterBar clearAllFiltersLabel={translations?.clearAll} alwaysShow={alwaysShowFilterBar}>
        {filterBarContent}
      </DataTableFilterBar>
    </div>
  )
}

export { DataTableToolbar }
export type { DataTableToolbarProps, DataTableToolbarTranslations }

"use client"

import * as React from "react"

import type { DataTableRowData } from "./types"
import type { UseDataTableReturn } from "./use-data-table"

interface DataTableContextValue<TData extends DataTableRowData> {
  instance: UseDataTableReturn<TData>
}

const DataTableContext = React.createContext<DataTableContextValue<any> | null>(null)

function DataTableContextProvider<TData extends DataTableRowData>({
  instance,
  children,
}: {
  instance: UseDataTableReturn<TData>
  children: React.ReactNode
}) {
  const value = React.useMemo(() => ({ instance }), [instance])
  return <DataTableContext.Provider value={value}>{children}</DataTableContext.Provider>
}

/** The `useDataTable` instance of the nearest `DataTable`. */
function useDataTableContext<TData extends DataTableRowData = DataTableRowData>(): DataTableContextValue<TData> {
  const context = React.useContext(DataTableContext)
  if (!context) {
    throw new Error("DataTable parts must be rendered inside <DataTable instance={…}>.")
  }
  return context
}

export { DataTableContextProvider, useDataTableContext }
export type { DataTableContextValue }

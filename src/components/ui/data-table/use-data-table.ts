import * as React from "react"
import {
  useTable,
  type ColumnFiltersState,
  type ColumnOrderState,
  type ColumnSort,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type Updater,
  type ColumnVisibilityState as VisibilityState,
} from "@tanstack/react-table"

import { dataTableFeatures, type DataTableFeatures } from "./features"
import {
  DataTableEmptyState,
  type DataTableColumnDef,
  type DataTableColumnFilter,
  type DataTableCommand,
  type DataTableDateComparisonOperator,
  type DataTableFilter,
  type DataTableFilteringState,
  type DataTableFilterOption,
  type DataTablePaginationState,
  type DataTableRow,
  type DataTableRowData,
  type DataTableRowSelectionState,
  type DataTableSortingState,
} from "./types"

interface DataTableOptions<TData extends DataTableRowData>
  extends Pick<TableOptions<DataTableFeatures, TData>, "data" | "getRowId"> {
  /** Columns, usually built with `createDataTableColumnHelper`. */
  columns: DataTableColumnDef<TData, any>[]
  /** Filters the user can add from the filter menu. */
  filters?: DataTableFilter[]
  /** Bulk commands shown in the command bar while rows are selected. */
  commands?: DataTableCommand[]
  /** Data is loading: shows skeleton rows while there are no rows yet. */
  isLoading?: boolean
  filtering?: {
    state: DataTableFilteringState
    onFilteringChange: (state: DataTableFilteringState) => void
  }
  rowSelection?: {
    state: DataTableRowSelectionState
    onRowSelectionChange: (state: DataTableRowSelectionState) => void
    enableRowSelection?: boolean | ((row: DataTableRow<TData>) => boolean)
  }
  sorting?: {
    state: DataTableSortingState | null
    onSortingChange: (state: DataTableSortingState) => void
  }
  search?: {
    state: string
    onSearchChange: (state: string) => void
    /** Milliseconds to wait after typing before `onSearchChange` runs. @default 300 */
    debounce?: number
  }
  pagination?: {
    state: DataTablePaginationState
    onPaginationChange: (state: DataTablePaginationState) => void
  }
  onRowClick?: (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>, row: TData) => void
  /** Total rows across all pages (sorting, filtering and pagination are done by you, e.g. on the server). */
  rowCount?: number
  /** Go back to the first page when sorting, filtering or search changes. @default true */
  autoResetPageIndex?: boolean
  columnVisibility?: {
    state: VisibilityState
    onColumnVisibilityChange: (state: VisibilityState) => void
  }
  /** Enables drag-to-reorder column headers. */
  columnOrder?: {
    state: ColumnOrderState
    onColumnOrderChange: (state: ColumnOrderState) => void
  }
}

type TableInstance<TData extends DataTableRowData> = ReturnType<typeof useTable<DataTableFeatures, TData>>

interface UseDataTableReturn<TData extends DataTableRowData>
  extends Pick<
    TableInstance<TData>,
    | "getHeaderGroups"
    | "getRowModel"
    | "getCanNextPage"
    | "getCanPreviousPage"
    | "nextPage"
    | "previousPage"
    | "getPageCount"
    | "getAllColumns"
    | "setColumnVisibility"
    | "setColumnOrder"
  > {
  getSorting: () => DataTableSortingState | null
  setSorting: (
    sortingOrUpdater: DataTableSortingState | ((prev: DataTableSortingState | null) => DataTableSortingState)
  ) => void
  getFilters: () => DataTableFilter[]
  getFilterOptions: <T extends string | string[] | DataTableDateComparisonOperator>(
    id: string
  ) => DataTableFilterOption<T>[] | null
  getFilterMeta: (id: string) => DataTableFilter | null
  getFiltering: () => DataTableFilteringState
  addFilter: (filter: DataTableColumnFilter) => void
  removeFilter: (id: string) => void
  clearFilters: () => void
  updateFilter: (filter: DataTableColumnFilter) => void
  getSearch: () => string
  onSearchChange: (search: string) => void
  getCommands: () => DataTableCommand[]
  getRowSelection: () => DataTableRowSelectionState
  onRowClick?: (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>, row: TData) => void
  emptyState: DataTableEmptyState
  isLoading: boolean
  showSkeleton: boolean
  pageIndex: number
  pageSize: number
  /** Changes the page size and goes back to the first page. */
  setPageSize: (pageSize: number) => void
  rowCount: number
  enablePagination: boolean
  enableFiltering: boolean
  enableSorting: boolean
  enableSearch: boolean
  enableColumnVisibility: boolean
  enableColumnOrder: boolean
  columnOrder: ColumnOrderState
  setColumnOrderFromArray: (order: string[]) => void
}

function resolve<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === "function" ? (updater as (old: T) => T)(previous) : updater
}

const toColumnFilters = (state?: DataTableFilteringState): ColumnFiltersState =>
  Object.entries(state ?? {}).map(([id, value]) => ({ id, value }))

/**
 * State and behaviour for a data table. All state is controlled by you: sorting, filtering, search
 * and pagination are reported through the callbacks and applied to `data` by you (or your API).
 */
function useDataTable<TData extends DataTableRowData>({
  rowCount = 0,
  filters,
  commands,
  rowSelection,
  sorting,
  filtering,
  pagination,
  search,
  onRowClick,
  autoResetPageIndex = true,
  isLoading = false,
  columnVisibility,
  columnOrder,
  ...options
}: DataTableOptions<TData>): UseDataTableReturn<TData> {
  const { state: sortingState, onSortingChange } = sorting ?? {}
  const { state: filteringState, onFilteringChange } = filtering ?? {}
  const { state: paginationState, onPaginationChange } = pagination ?? {}
  const { state: rowSelectionState, onRowSelectionChange, enableRowSelection } = rowSelection ?? {}
  const { state: columnVisibilityState, onColumnVisibilityChange } = columnVisibility ?? {}
  const { state: columnOrderState, onColumnOrderChange } = columnOrder ?? {}

  const resetPageIndex = React.useCallback(() => {
    if (autoResetPageIndex && paginationState && paginationState.pageIndex !== 0) {
      onPaginationChange?.({ ...paginationState, pageIndex: 0 })
    }
  }, [autoResetPageIndex, paginationState, onPaginationChange])

  const instance = useTable<DataTableFeatures, TData>({
    ...options,
    features: dataTableFeatures,
    state: {
      rowSelection: (rowSelectionState ?? {}) as RowSelectionState,
      sorting: sortingState ? [sortingState] : [],
      columnFilters: toColumnFilters(filteringState),
      pagination: paginationState,
      columnVisibility: columnVisibilityState ?? {},
      columnOrder: columnOrderState ?? [],
    },
    enableRowSelection,
    rowCount,
    onColumnFiltersChange: onFilteringChange
      ? (updater: Updater<ColumnFiltersState>) => {
          resetPageIndex()
          const value = resolve(updater, toColumnFilters(filteringState))
          onFilteringChange(Object.fromEntries(value.map((f) => [f.id, f.value])))
        }
      : undefined,
    onRowSelectionChange: onRowSelectionChange
      ? (updater: Updater<RowSelectionState>) =>
          onRowSelectionChange(resolve(updater, (rowSelectionState ?? {}) as RowSelectionState))
      : undefined,
    onSortingChange: onSortingChange
      ? (updater: Updater<SortingState>) => {
          resetPageIndex()
          const value = resolve(updater, sortingState ? [sortingState] : [])
          // Sorting cycles asc → desc → off; "off" arrives as an empty array.
          onSortingChange(value[0] as DataTableSortingState)
        }
      : undefined,
    onPaginationChange: onPaginationChange
      ? (updater: Updater<PaginationState>) =>
          onPaginationChange(resolve(updater, paginationState ?? { pageIndex: 0, pageSize: 10 }))
      : undefined,
    onColumnVisibilityChange: onColumnVisibilityChange
      ? (updater: Updater<VisibilityState>) =>
          onColumnVisibilityChange(resolve(updater, columnVisibilityState ?? {}))
      : undefined,
    onColumnOrderChange: onColumnOrderChange
      ? (updater: Updater<ColumnOrderState>) => onColumnOrderChange(resolve(updater, columnOrderState ?? []))
      : undefined,
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
  })

  const getSorting = React.useCallback(() => sortingState ?? null, [sortingState])

  const setSorting = React.useCallback(
    (sortingOrUpdater: ColumnSort | ((prev: ColumnSort | null) => ColumnSort)) => {
      const next = typeof sortingOrUpdater === "function" ? sortingOrUpdater(sortingState ?? null) : sortingOrUpdater
      resetPageIndex()
      onSortingChange?.(next)
    },
    [sortingState, onSortingChange, resetPageIndex]
  )

  const getFilters = React.useCallback(() => filters ?? [], [filters])

  const getFilterOptions = React.useCallback(
    <T extends string | string[] | DataTableDateComparisonOperator>(id: string) => {
      const filter = getFilters().find((f) => f.id === id)
      if (!filter || !("options" in filter)) return null
      return (filter.options as DataTableFilterOption<T>[]) ?? null
    },
    [getFilters]
  )

  const getFilterMeta = React.useCallback(
    (id: string) => getFilters().find((f) => f.id === id) ?? null,
    [getFilters]
  )

  const getFiltering = React.useCallback(() => ({ ...(filteringState ?? {}) }), [filteringState])

  const addFilter = React.useCallback(
    (filter: DataTableColumnFilter) => {
      resetPageIndex()
      onFilteringChange?.({ ...getFiltering(), [filter.id]: filter.value })
    },
    [onFilteringChange, getFiltering, resetPageIndex]
  )

  const removeFilter = React.useCallback(
    (id: string) => {
      const next = getFiltering()
      delete next[id]
      resetPageIndex()
      onFilteringChange?.(next)
    },
    [onFilteringChange, getFiltering, resetPageIndex]
  )

  const clearFilters = React.useCallback(() => {
    resetPageIndex()
    onFilteringChange?.({})
  }, [onFilteringChange, resetPageIndex])

  // Search: the field updates at once, the callback is debounced.
  const { state: searchState, onSearchChange, debounce = 300 } = search ?? {}
  const [localSearch, setLocalSearch] = React.useState(searchState ?? "")
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const latestSearchChange = React.useRef(onSearchChange)
  const latestReset = React.useRef(resetPageIndex)
  React.useEffect(() => {
    latestSearchChange.current = onSearchChange
    latestReset.current = resetPageIndex
  })

  React.useEffect(() => {
    setLocalSearch(searchState ?? "")
  }, [searchState])

  React.useEffect(() => () => clearTimeout(timeoutRef.current), [])

  const onSearchChangeHandler = React.useCallback(
    (value: string) => {
      setLocalSearch(value)
      clearTimeout(timeoutRef.current)
      const commit = () => {
        latestReset.current()
        latestSearchChange.current?.(value)
      }
      if (debounce <= 0) commit()
      else timeoutRef.current = setTimeout(commit, debounce)
    },
    [debounce]
  )

  const getSearch = React.useCallback(() => localSearch, [localSearch])
  const getCommands = React.useCallback(() => commands ?? [], [commands])
  const getRowSelection = React.useCallback(() => rowSelectionState ?? {}, [rowSelectionState])

  const rows = instance.getRowModel().rows
  const hasRows = rows.length > 0
  const hasSearch = Boolean(searchState)
  const hasFilters = Object.keys(filteringState ?? {}).length > 0
  const emptyState: DataTableEmptyState = hasRows
    ? DataTableEmptyState.POPULATED
    : hasSearch || hasFilters
      ? DataTableEmptyState.FILTERED_EMPTY
      : DataTableEmptyState.EMPTY

  const setPageSize = React.useCallback(
    (pageSize: number) => onPaginationChange?.({ pageIndex: 0, pageSize }),
    [onPaginationChange]
  )

  const setColumnOrderFromArray = React.useCallback(
    (order: string[]) => instance.setColumnOrder(order),
    [instance]
  )

  return {
    getHeaderGroups: instance.getHeaderGroups,
    getRowModel: instance.getRowModel,
    getAllColumns: instance.getAllColumns,
    setColumnVisibility: instance.setColumnVisibility,
    setColumnOrder: instance.setColumnOrder,
    enablePagination: !!pagination,
    getCanNextPage: instance.getCanNextPage,
    getCanPreviousPage: instance.getCanPreviousPage,
    nextPage: instance.nextPage,
    previousPage: instance.previousPage,
    getPageCount: instance.getPageCount,
    pageIndex: paginationState?.pageIndex ?? 0,
    pageSize: paginationState?.pageSize ?? 10,
    setPageSize,
    rowCount,
    enableSearch: !!search,
    getSearch,
    onSearchChange: onSearchChangeHandler,
    enableSorting: !!sorting,
    getSorting,
    setSorting,
    enableFiltering: !!filtering,
    getFilters,
    getFilterOptions,
    getFilterMeta,
    getFiltering,
    addFilter,
    removeFilter,
    clearFilters,
    updateFilter: addFilter,
    getCommands,
    getRowSelection,
    onRowClick,
    emptyState,
    isLoading,
    showSkeleton: isLoading && !hasRows,
    enableColumnVisibility: !!columnVisibility,
    enableColumnOrder: !!columnOrder,
    columnOrder: columnOrderState ?? [],
    setColumnOrderFromArray,
  }
}

export { useDataTable }
export type { DataTableOptions, UseDataTableReturn }

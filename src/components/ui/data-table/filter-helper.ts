import type { DeepKeys } from "@tanstack/react-table"

import type { DataTableFilter, DataTableFilterProps } from "./types"

/** Typed builder for filters: `accessor` ties a filter to a row key, `custom` takes any id. */
function createDataTableFilterHelper<TData>() {
  return {
    accessor: (accessor: DeepKeys<TData>, props: DataTableFilterProps): DataTableFilter => ({
      id: accessor as string,
      ...props,
    }),
    custom: <T extends DataTableFilterProps>(props: DataTableFilter<T>) => props,
  }
}

export { createDataTableFilterHelper }

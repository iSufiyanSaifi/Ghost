import {
  columnFilteringFeature,
  columnOrderingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
} from "@tanstack/react-table"

/** TanStack Table features the data table registers. */
const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  columnOrderingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
})

type DataTableFeatures = typeof dataTableFeatures

export { dataTableFeatures }
export type { DataTableFeatures }

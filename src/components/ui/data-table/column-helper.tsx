"use client"

import { createColumnHelper } from "@tanstack/react-table"

import { DataTableActionCell, DataTableSelectCell, DataTableSelectHeader } from "./cells"
import type { DataTableFeatures } from "./features"
import type {
  DataTableActionColumnDef,
  DataTableAlignableColumnDef,
  DataTableColumnHelper,
  DataTableColumnMeta,
  DataTableRowData,
  DataTableSelectColumnDef,
  DataTableSortableColumnDef,
  DataTableTruncatableColumnDef,
} from "./types"

/**
 * Typed column builders: `accessor` (value columns, optionally sortable and aligned), `display`,
 * `select` (row checkboxes) and `action` (row "…" menu).
 */
function createDataTableColumnHelper<TData extends DataTableRowData>(): DataTableColumnHelper<TData> {
  const helper = createColumnHelper<DataTableFeatures, TData>()

  return {
    accessor: (accessor, column) => {
      const { sortLabel, sortAscLabel, sortDescLabel, align, truncateTooltip, meta, enableSorting, ...rest } =
        column as typeof column &
          DataTableSortableColumnDef &
          DataTableAlignableColumnDef &
          DataTableTruncatableColumnDef

      const extendedMeta: DataTableColumnMeta<TData> = {
        __sort: { sortLabel, sortAscLabel, sortDescLabel },
        __align: align,
        __truncateTooltip: truncateTooltip,
        ...((meta as object) ?? {}),
      }

      return helper.accessor(accessor as never, {
        ...(rest as object),
        enableSorting: enableSorting ?? false,
        meta: extendedMeta,
      } as never) as never
    },
    display: helper.display,
    action: ({ actions, meta }: DataTableActionColumnDef<TData>) =>
      helper.display({
        id: "action",
        enableHiding: false,
        cell: (ctx) => <DataTableActionCell ctx={ctx} />,
        meta: { __actions: actions, ...((meta as object) ?? {}) } as DataTableColumnMeta<TData>,
      }),
    select: (props?: DataTableSelectColumnDef<TData>) =>
      helper.display({
        id: "select",
        enableHiding: false,
        header: props?.header ?? ((ctx) => <DataTableSelectHeader ctx={ctx} />),
        cell: props?.cell ?? ((ctx) => <DataTableSelectCell ctx={ctx} />),
      }),
  }
}

export { createDataTableColumnHelper }

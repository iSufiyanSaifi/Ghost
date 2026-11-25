"use client"

import * as React from "react"
import { EllipsisIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type {
  DataTableAction,
  DataTableCellContext,
  DataTableColumnMeta,
  DataTableHeaderContext,
  DataTableRowData,
} from "./types"

function DataTableSelectCell<TData extends DataTableRowData>({
  ctx,
}: {
  ctx: DataTableCellContext<TData, unknown>
}) {
  return (
    <Checkbox
      data-slot="data-table-select-cell"
      aria-label="Select row"
      onClick={(e) => e.stopPropagation()}
      checked={ctx.row.getIsSelected()}
      onCheckedChange={(checked) => ctx.row.toggleSelected(checked === true)}
      disabled={!ctx.row.getCanSelect()}
    />
  )
}

function DataTableSelectHeader<TData extends DataTableRowData>({
  ctx,
}: {
  ctx: DataTableHeaderContext<TData, unknown>
}) {
  const allSelected = ctx.table.getIsAllPageRowsSelected()
  const checked = !allSelected && ctx.table.getIsSomePageRowsSelected() ? "indeterminate" : allSelected
  const disabled = !ctx.table.getRowModel().rows.some((row) => row.getCanSelect())

  return (
    <Checkbox
      data-slot="data-table-select-header"
      aria-label="Select all rows on this page"
      onClick={(e) => e.stopPropagation()}
      checked={checked}
      onCheckedChange={(value) => ctx.table.toggleAllPageRowsSelected(value === true)}
      disabled={disabled}
    />
  )
}

function DataTableActionCell<TData extends DataTableRowData>({
  ctx,
}: {
  ctx: DataTableCellContext<TData, unknown>
}) {
  const meta = ctx.column.columnDef.meta as DataTableColumnMeta<TData> | undefined
  const actions = meta?.__actions
  if (!actions) return null

  const resolved = typeof actions === "function" ? actions(ctx) : actions
  if (!Array.isArray(resolved) || resolved.length === 0) return null

  // Normalise to groups so a flat list and grouped lists render the same way.
  const groups: DataTableAction<TData>[][] = Array.isArray(resolved[0])
    ? (resolved as DataTableAction<TData>[][])
    : [resolved as DataTableAction<TData>[]]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          data-slot="data-table-action-cell"
          variant="ghost"
          size="icon-sm"
          aria-label="Row actions"
          onClick={(e) => e.stopPropagation()}
        >
          <EllipsisIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="w-auto min-w-40">
        {groups.map((group, idx) => (
          <React.Fragment key={idx}>
            {group.map((action) => (
              <DropdownMenuItem
                key={action.label}
                variant={action.variant}
                onClick={(e) => {
                  e.stopPropagation()
                  action.onClick(ctx)
                }}
                className="gap-2"
              >
                {action.icon}
                {action.label}
              </DropdownMenuItem>
            ))}
            {idx < groups.length - 1 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { DataTableActionCell, DataTableSelectCell, DataTableSelectHeader }

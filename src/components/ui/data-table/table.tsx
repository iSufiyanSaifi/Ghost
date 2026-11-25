"use client"

import * as React from "react"
import { flexRender, type Cell, type Header } from "@tanstack/react-table"
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Text } from "@/components/ui/text"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { useDataTableContext } from "./context"
import type { DataTableFeatures } from "./features"
import {
  DataTableEmptyState,
  type DataTableColumnAlignment,
  type DataTableColumnMeta,
  type DataTableEmptyStateContent,
  type DataTableEmptyStateProps,
  type DataTableRowData,
  type DataTableSortDirection,
} from "./types"
import { isEditableElementFocused } from "./utils"

// Opaque header background (muted at 40% over the card) so rows never show through the sticky header.
const HEADER_BG = "bg-card bg-linear-to-r from-muted/40 to-muted/40"
// Fixed widths for the pinned select and action columns; the first data column sticks at SELECT_W.
const SELECT_COL = "w-11 min-w-11 max-w-11 pl-4 pr-0"
const ACTION_COL = "w-14 min-w-14 max-w-14 pr-3"
const STICKY_FIRST_WITH_SELECT = "left-11"

const DEFAULT_EMPTY: DataTableEmptyStateContent = {
  heading: "No records yet",
  description: "Records you add will show up here.",
}
const DEFAULT_FILTERED: DataTableEmptyStateContent = {
  heading: "No results",
  description: "Nothing matches your search or filters. Try changing or clearing them.",
}

interface DataTableTableProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Content for the "no records" and "no results" states. */
  emptyState?: DataTableEmptyStateProps
}

type AnyHeader = Header<DataTableFeatures, DataTableRowData, unknown>
type AnyCell = Cell<DataTableFeatures, DataTableRowData, unknown>

function getMeta(column: { columnDef: { meta?: unknown } }) {
  return column.columnDef.meta as DataTableColumnMeta | undefined
}

/** The table body of a data table: sortable headers, drag-to-reorder, sticky first column, empty and loading states. */
function DataTableTable({ emptyState, className, ...props }: DataTableTableProps) {
  const { instance } = useDataTableContext()
  const hoveredRowId = React.useRef<string | null>(null)
  const isKeyDown = React.useRef(false)
  const scrollableRef = React.useRef<HTMLDivElement>(null)
  const [scrolledX, setScrolledX] = React.useState(false)

  const columns = instance.getAllColumns()
  const hasSelect = columns.some((c) => c.id === "select")

  const sortableItems = React.useMemo(
    () => (instance.columnOrder.length > 0 ? instance.columnOrder : columns.map((c) => c.id)),
    [columns, instance.columnOrder]
  )

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const activeId = String(active.id)
    const overId = String(over.id)
    const pinned = ["select", "action"]
    if (pinned.includes(activeId) || pinned.includes(overId)) return
    const oldIndex = sortableItems.indexOf(activeId)
    const newIndex = sortableItems.indexOf(overId)
    if (oldIndex !== -1 && newIndex !== -1) {
      instance.setColumnOrderFromArray(arrayMove([...sortableItems], oldIndex, newIndex))
    }
  }

  // Press X while hovering a row to toggle its selection.
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "x" || isKeyDown.current || isEditableElementFocused()) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const row = instance.getRowModel().rows.find((r) => r.id === hoveredRowId.current)
      if (row && row.getCanSelect()) {
        isKeyDown.current = true
        row.toggleSelected()
      }
    }
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "x") isKeyDown.current = false
    }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("keyup", onKeyUp)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("keyup", onKeyUp)
    }
  }, [instance])

  React.useEffect(() => {
    scrollableRef.current?.scroll({ top: 0, left: 0 })
  }, [instance.pageIndex])

  if (instance.showSkeleton) {
    return <DataTableTableSkeleton pageSize={instance.pageSize} className={className} {...props} />
  }

  if (instance.emptyState !== DataTableEmptyState.POPULATED) {
    const content =
      instance.emptyState === DataTableEmptyState.EMPTY
        ? { ...DEFAULT_EMPTY, ...emptyState?.empty }
        : { ...DEFAULT_FILTERED, ...emptyState?.filtered }
    return (
      <div
        data-slot="data-table-empty"
        data-state={instance.emptyState === DataTableEmptyState.EMPTY ? "empty" : "filtered"}
        className={cn("flex min-h-[220px] w-full flex-1 flex-col items-center justify-center px-6 py-8", className)}
        {...props}
      >
        {content.custom ?? (
          <div className="flex max-w-sm flex-col items-center gap-1 text-center">
            <Text size="base" weight="plus">
              {content.heading}
            </Text>
            <Text size="small" tone="muted">
              {content.description}
            </Text>
          </div>
        )}
      </div>
    )
  }

  const headerGroups = instance.getHeaderGroups()

  const headerRow = (headers: AnyHeader[]) =>
    headers.map((header, idx) => {
      const isSelect = header.id === "select"
      const isAction = header.id === "action"
      const isFirst = hasSelect ? idx === 1 : idx === 0
      const canSort = header.column.getCanSort()
      const align = getMeta(header.column)?.__align ?? "left"
      const draggable = instance.enableColumnOrder && !isSelect && !isAction

      const cellClass = cn(
        HEADER_BG,
        "h-10 px-3 text-xs font-medium text-muted-foreground",
        isSelect && SELECT_COL,
        isAction && ACTION_COL,
        (isFirst || isSelect) && "sticky z-[2]",
        (isSelect || (isFirst && !hasSelect)) && "left-0",
        isFirst && hasSelect && STICKY_FIRST_WITH_SELECT,
        isFirst && scrolledX && "shadow-[inset_-1px_0_0_var(--color-border)]"
      )
      const style: React.CSSProperties | undefined =
        isSelect || isAction
          ? undefined
          : {
              width: header.column.columnDef.size,
              minWidth: header.column.columnDef.minSize,
              maxWidth: header.column.columnDef.maxSize,
            }

      const content = (
        <HeaderContent
          header={header}
          canSort={canSort}
          align={align}
          direction={header.column.getIsSorted()}
          firstDirection={header.column.getFirstSortDir()}
        />
      )

      if (instance.enableColumnOrder) {
        return (
          <SortableHeaderCell
            key={header.id}
            id={header.id}
            draggable={draggable}
            isFirst={isFirst}
            className={cellClass}
            style={style}
          >
            {content}
          </SortableHeaderCell>
        )
      }
      return (
        <TableHead key={header.id} className={cellClass} style={style}>
          {content}
        </TableHead>
      )
    })

  const table = (
    <Table data-slot="data-table-table" className="relative isolate w-full">
      <TableHeader className="sticky top-0 z-[3] [&_tr]:border-b-0 shadow-[0_1px_0_var(--color-border)]">
        {headerGroups.map((group) => (
          <TableRow key={group.id} className="border-b-0 hover:bg-transparent">
            {instance.enableColumnOrder ? (
              <SortableContext items={sortableItems} strategy={horizontalListSortingStrategy}>
                {headerRow(group.headers as unknown as AnyHeader[])}
              </SortableContext>
            ) : (
              headerRow(group.headers as unknown as AnyHeader[])
            )}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {instance.getRowModel().rows.map((row) => {
          const selected = row.getIsSelected()
          return (
            <TableRow
              key={row.id}
              data-state={selected ? "selected" : undefined}
              onMouseEnter={() => (hoveredRowId.current = row.id)}
              onMouseLeave={() => (hoveredRowId.current = null)}
              onClick={instance.onRowClick ? (e) => instance.onRowClick?.(e, row.original) : undefined}
              className={cn(
                "group/row border-b border-divider",
                selected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-accent",
                instance.onRowClick && "cursor-pointer"
              )}
            >
              {row.getVisibleCells().map((cell, idx) => {
                const isSelect = cell.column.id === "select"
                const isAction = cell.column.id === "action"
                const isFirst = hasSelect ? idx === 1 : idx === 0
                return (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "h-12 px-3 py-2 text-sm whitespace-nowrap",
                      isSelect && SELECT_COL,
                      isAction && ACTION_COL,
                      // Sticky cells need an opaque background that matches the row's tint.
                      (isFirst || isSelect) && "sticky z-[1] bg-card",
                      (isFirst || isSelect) &&
                        (selected
                          ? "bg-linear-to-r from-primary/5 to-primary/5 group-hover/row:from-primary/10 group-hover/row:to-primary/10"
                          : "group-hover/row:bg-accent"),
                      (isSelect || (isFirst && !hasSelect)) && "left-0",
                      isFirst && hasSelect && STICKY_FIRST_WITH_SELECT,
                      isFirst && scrolledX && "shadow-[inset_-1px_0_0_var(--color-border)]"
                    )}
                    style={
                      isSelect || isAction
                        ? undefined
                        : {
                            width: cell.column.columnDef.size,
                            minWidth: cell.column.columnDef.minSize,
                            maxWidth: cell.column.columnDef.maxSize,
                          }
                    }
                  >
                    <AlignedCell cell={cell as unknown as AnyCell} special={isSelect || isAction} />
                  </TableCell>
                )
              })}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )

  return (
    <div
      ref={scrollableRef}
      data-slot="data-table-scroll"
      onScroll={(e) => setScrolledX(e.currentTarget.scrollLeft > 0)}
      // The outer box scrolls both ways, so the inner table container must not clip.
      className={cn(
        "min-h-0 w-full flex-1 overflow-auto overscroll-x-contain [&_[data-slot=table-container]]:overflow-visible",
        className
      )}
      {...props}
    >
      {instance.enableColumnOrder ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          {table}
        </DndContext>
      ) : (
        table
      )}
    </div>
  )
}

function HeaderContent({
  header,
  canSort,
  align,
  direction,
  firstDirection,
}: {
  header: AnyHeader
  canSort: boolean
  align: DataTableColumnAlignment
  direction: DataTableSortDirection | false
  firstDirection: DataTableSortDirection
}) {
  const rendered = flexRender(header.column.columnDef.header, header.getContext())
  const alignClass = cn(align === "right" && "w-full justify-end", align === "center" && "w-full justify-center")

  if (!canSort) {
    return <div className={cn("flex items-center gap-1.5", alignClass)}>{rendered}</div>
  }

  const icon = <DataTableSortingIcon direction={direction} firstDirection={firstDirection} />
  return (
    <button
      type="button"
      data-slot="data-table-sort-button"
      onClick={header.column.getToggleSortingHandler()}
      onPointerDown={(e) => e.stopPropagation()}
      aria-sort={direction === "asc" ? "ascending" : direction === "desc" ? "descending" : undefined}
      className={cn(
        "group/sort -mx-1 flex items-center gap-1.5 rounded-sm px-1 py-0.5 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
        direction && "text-foreground",
        alignClass
      )}
    >
      {align === "right" && icon}
      {rendered}
      {align !== "right" && icon}
    </button>
  )
}

/** Arrow beside a sortable header: shows the active direction, or previews the first click on hover. */
function DataTableSortingIcon({
  direction,
  firstDirection = "asc",
}: {
  direction: DataTableSortDirection | false
  firstDirection?: DataTableSortDirection
}) {
  const effective = direction || firstDirection
  const Icon = effective === "desc" ? ArrowDownIcon : ArrowUpIcon
  return (
    <Icon
      aria-hidden="true"
      className={cn(
        "size-3.5 shrink-0 transition-opacity",
        direction ? "opacity-100" : "opacity-0 group-hover/sort:opacity-100 group-focus-visible/sort:opacity-100"
      )}
    />
  )
}

function SortableHeaderCell({
  id,
  draggable,
  isFirst,
  className,
  style: propStyle,
  children,
}: {
  id: string
  draggable: boolean
  isFirst: boolean
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: !draggable,
  })
  // Only move horizontally.
  const style: React.CSSProperties = {
    ...propStyle,
    transform: transform ? CSS.Transform.toString({ x: transform.x, y: 0, scaleX: 1, scaleY: 1 }) : undefined,
    transition,
    zIndex: isDragging ? 50 : isFirst ? 2 : undefined,
  }
  return (
    <TableHead
      ref={setNodeRef}
      data-dragging={isDragging || undefined}
      style={style}
      className={cn(
        className,
        draggable && "cursor-grab active:cursor-grabbing",
        isDragging && "bg-card bg-none text-foreground shadow-md ring-1 ring-border"
      )}
      {...(draggable ? attributes : {})}
      {...(draggable ? listeners : {})}
    >
      {children}
    </TableHead>
  )
}

/** Renders a body cell with the column's alignment, truncating long values with a tooltip. */
function AlignedCell({ cell, special }: { cell: AnyCell; special: boolean }) {
  const meta = getMeta(cell.column)
  const rendered = flexRender(cell.column.columnDef.cell, cell.getContext())
  if (special) return <div className="flex items-center">{rendered}</div>

  const content = meta?.__truncateTooltip === false ? rendered : <TruncatedCell>{rendered}</TruncatedCell>
  const align = meta?.__align
  if (align !== "right" && align !== "center") return content
  return (
    <div className={cn("flex min-w-0 items-center", align === "right" ? "justify-end" : "justify-center")}>
      {content}
    </div>
  )
}

function TruncatedCell({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [open, setOpen] = React.useState(false)
  const [text, setText] = React.useState("")

  return (
    <Tooltip
      open={open}
      onOpenChange={(next) => {
        const el = ref.current
        if (next && el && el.scrollWidth > el.clientWidth) {
          setText(el.textContent ?? "")
          setOpen(true)
        } else {
          setOpen(false)
        }
      }}
    >
      <TooltipTrigger asChild>
        <div ref={ref} className="truncate">
          {children}
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-[360px] break-words">{text}</TooltipContent>
    </Tooltip>
  )
}

function DataTableTableSkeleton({
  pageSize = 10,
  className,
  ...props
}: { pageSize?: number } & React.ComponentProps<"div">) {
  return (
    <div
      data-slot="data-table-skeleton"
      aria-busy="true"
      aria-label="Loading"
      className={cn("flex w-full flex-1 flex-col", className)}
      {...props}
    >
      <div className={cn("flex h-10 items-center border-b px-4", HEADER_BG)}>
        <Skeleton className="h-3 w-24" />
      </div>
      {Array.from({ length: pageSize }, (_, i) => (
        <div key={i} className="flex h-12 items-center gap-4 border-b border-divider px-4 last:border-b-0">
          <Skeleton className="h-3.5 w-1/5" />
          <Skeleton className="h-3.5 w-1/4" />
          <Skeleton className="h-3.5 w-1/6" />
          <Skeleton className="ml-auto h-3.5 w-16" />
        </div>
      ))}
    </div>
  )
}

export { DataTableTable, DataTableSortingIcon }
export type { DataTableTableProps }

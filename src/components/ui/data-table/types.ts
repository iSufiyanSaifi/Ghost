import type * as React from "react"
import type {
  AccessorFn,
  AccessorFnColumnDef,
  AccessorKeyColumnDef,
  CellContext,
  Column,
  ColumnDef,
  ColumnFilter,
  ColumnSort,
  DeepKeys,
  DeepValue,
  DisplayColumnDef,
  HeaderContext,
  IdentifiedColumnDef,
  IdIdentifier,
  PaginationState,
  Row,
  RowData,
  SortDirection,
  StringHeaderIdentifier,
  StringOrTemplateHeader,
} from "@tanstack/react-table"

import type { DataTableFeatures } from "./features"

export type DataTableRowData = RowData

export type DataTableRow<TData extends DataTableRowData> = Row<DataTableFeatures, TData>

export type DataTableAction<TData extends DataTableRowData> = {
  label: string
  onClick: (ctx: CellContext<DataTableFeatures, TData, unknown>) => void
  icon?: React.ReactNode
  /** Render the item in the destructive tone, e.g. "Cancel order". */
  variant?: "default" | "destructive"
}

export interface DataTableCellContext<TData extends DataTableRowData, TValue>
  extends CellContext<DataTableFeatures, TData, TValue> {}

export interface DataTableHeaderContext<TData extends DataTableRowData, TValue>
  extends HeaderContext<DataTableFeatures, TData, TValue> {}

export type DataTableSortDirection = SortDirection

export type DataTableActions<TData extends DataTableRowData> =
  | DataTableAction<TData>[]
  | DataTableAction<TData>[][]

export interface DataTableActionColumnDef<TData extends DataTableRowData>
  extends Pick<DisplayColumnDef<DataTableFeatures, TData>, "meta"> {
  /** Flat list, or groups (separated in the menu), or a function of the row. */
  actions: DataTableActions<TData> | ((ctx: DataTableCellContext<TData, unknown>) => DataTableActions<TData>)
}

export interface DataTableSelectColumnDef<TData extends DataTableRowData>
  extends Pick<DisplayColumnDef<DataTableFeatures, TData>, "cell" | "header"> {}

export type DataTableSortableColumnDef = {
  /** Label in the sorting menu. Defaults to the header when it is a string. */
  sortLabel?: string
  /** Label for ascending order in the sorting menu. @default "A-Z" */
  sortAscLabel?: string
  /** Label for descending order in the sorting menu. @default "Z-A" */
  sortDescLabel?: string
  /** Whether the column is sortable. @default false */
  enableSorting?: boolean
}

export type DataTableColumnAlignment = "left" | "center" | "right"

export type DataTableAlignableColumnDef = {
  /** Alignment of both the header and the body cell. Use "right" for amounts. @default "left" */
  align?: DataTableColumnAlignment
}

export type DataTableTruncatableColumnDef = {
  /** Show a tooltip with the full value when the cell text is truncated. @default true */
  truncateTooltip?: boolean
}

/** Internal metadata the column helper stores on `columnDef.meta`. */
export type DataTableColumnMeta<TData extends DataTableRowData = DataTableRowData> = {
  /** Label in the column visibility menu. Defaults to the header when it is a string. */
  name?: string
  __sort?: Omit<DataTableSortableColumnDef, "enableSorting">
  __align?: DataTableColumnAlignment
  __truncateTooltip?: boolean
  __actions?: DataTableActionColumnDef<TData>["actions"]
}

export interface DataTableColumn<TData extends DataTableRowData, TValue = unknown>
  extends Column<DataTableFeatures, TData, TValue> {}

export type DataTableColumnDef<TData extends DataTableRowData, TValue = unknown> = ColumnDef<
  DataTableFeatures,
  TData,
  TValue
>

export type DataTableColumnSizing = {
  maxSize?: number
  minSize?: number
  size?: number
}

type DataTableColumnIdentifiers<TData extends DataTableRowData, TValue> =
  | IdIdentifier<DataTableFeatures, TData, TValue>
  | StringHeaderIdentifier

export type DataTableDisplayColumnDef<TData extends DataTableRowData, TValue = unknown> = Pick<
  DisplayColumnDef<DataTableFeatures, TData, TValue>,
  "meta" | "header" | "cell" | "minSize" | "maxSize" | "size"
> &
  DataTableColumnIdentifiers<TData, TValue>

export interface DataTableIdentifiedColumnDef<TData extends DataTableRowData, TValue>
  extends Pick<
    IdentifiedColumnDef<DataTableFeatures, TData, TValue>,
    "meta" | "header" | "cell" | "minSize" | "maxSize" | "size"
  > {
  id?: string
  header?: StringOrTemplateHeader<DataTableFeatures, TData, TValue>
}

type DataTableColumnExtras = DataTableSortableColumnDef &
  DataTableAlignableColumnDef &
  DataTableTruncatableColumnDef

export interface DataTableColumnHelper<TData extends DataTableRowData> {
  /** A column that reads a value from the row (a key path or a function). */
  accessor: <
    TAccessor extends AccessorFn<TData> | DeepKeys<TData>,
    TValue extends TAccessor extends AccessorFn<TData, infer TReturn>
      ? TReturn
      : TAccessor extends DeepKeys<TData>
        ? DeepValue<TData, TAccessor>
        : never,
  >(
    accessor: TAccessor,
    column: TAccessor extends AccessorFn<TData>
      ? DataTableDisplayColumnDef<TData, TValue> & DataTableColumnExtras
      : DataTableIdentifiedColumnDef<TData, TValue> & DataTableColumnExtras
  ) => TAccessor extends AccessorFn<TData>
    ? AccessorFnColumnDef<DataTableFeatures, TData, TValue>
    : AccessorKeyColumnDef<DataTableFeatures, TData, TValue>
  /** A column that renders something not tied to a single value. */
  display: (column: DataTableDisplayColumnDef<TData>) => DisplayColumnDef<DataTableFeatures, TData>
  /** The row "…" menu column, pinned to the end. */
  action: (props: DataTableActionColumnDef<TData>) => DisplayColumnDef<DataTableFeatures, TData, unknown>
  /** The row selection checkbox column, pinned to the start. */
  select: (props?: DataTableSelectColumnDef<TData>) => DisplayColumnDef<DataTableFeatures, TData, unknown>
}

export interface DataTableSortingState extends ColumnSort {}
export interface DataTableRowSelectionState {
  [rowId: string]: boolean
}
export interface DataTablePaginationState extends PaginationState {}
export type DataTableFilteringState<T extends Record<string, unknown> = Record<string, unknown>> = {
  [K in keyof T]: T[K]
}

export type DataTableFilterType = "radio" | "select" | "date" | "multiselect" | "string" | "number" | "custom"

export type DataTableFilterOption<T = string> = {
  label: string
  value: T
}

interface DataTableBaseFilterProps {
  type: DataTableFilterType
  label: string
}

export interface DataTableRadioFilterProps extends DataTableBaseFilterProps {
  type: "radio"
  options: DataTableFilterOption[]
}

export interface DataTableSelectFilterProps extends DataTableBaseFilterProps {
  type: "select"
  options: DataTableFilterOption[]
}

export interface DataTableDateFilterProps extends DataTableBaseFilterProps {
  type: "date"
  /** "date-time" adds hours and minutes to the custom range pickers. @default "date" */
  format?: "date" | "date-time"
  /** @default "Custom" */
  rangeOptionLabel?: string
  /** @default "Starting" */
  rangeOptionStartLabel?: string
  /** @default "Ending" */
  rangeOptionEndLabel?: string
  /** Hide the custom range option. */
  disableRangeOption?: boolean
  /** Formats a custom range date in the filter chip. @default DD/MM/YYYY */
  formatDateValue?: (value: Date) => string
  /** Preset ranges, e.g. `{ label: "Last 7 days", value: { $gte: iso } }`. */
  options: DataTableFilterOption<DataTableDateComparisonOperator>[]
}

export interface DataTableMultiselectFilterProps extends DataTableBaseFilterProps {
  type: "multiselect"
  options: DataTableFilterOption[]
  /** Show a search field above the options. @default true */
  searchable?: boolean
}

export interface DataTableStringFilterProps extends DataTableBaseFilterProps {
  type: "string"
  placeholder?: string
}

export interface DataTableNumberFilterProps extends DataTableBaseFilterProps {
  type: "number"
  placeholder?: string
  /** Offer comparison operators (greater than, less than…). @default true */
  includeOperators?: boolean
}

export interface DataTableCustomFilterProps extends DataTableBaseFilterProps {
  type: "custom"
  render: (props: {
    value: unknown
    onChange: (value: unknown) => void
    onRemove: () => void
  }) => React.ReactNode
}

export type DataTableFilterProps =
  | DataTableRadioFilterProps
  | DataTableSelectFilterProps
  | DataTableDateFilterProps
  | DataTableMultiselectFilterProps
  | DataTableStringFilterProps
  | DataTableNumberFilterProps
  | DataTableCustomFilterProps

export type DataTableFilter<T extends DataTableFilterProps = DataTableFilterProps> = T & {
  id: string
}

/** Which body the table shows: rows, "no records yet", or "nothing matches". */
export const DataTableEmptyState = {
  EMPTY: "EMPTY",
  FILTERED_EMPTY: "FILTERED_EMPTY",
  POPULATED: "POPULATED",
} as const
export type DataTableEmptyState = (typeof DataTableEmptyState)[keyof typeof DataTableEmptyState]

export type DataTableDateComparisonOperator = {
  /** On or after this ISO date. */
  $gte?: string
  /** On or before this ISO date. */
  $lte?: string
  /** Before this ISO date. */
  $lt?: string
  /** After this ISO date. */
  $gt?: string
}

export type DataTableNumberComparisonOperator = {
  $gte?: number
  $lte?: number
  $lt?: number
  $gt?: number
  $eq?: number
}

type DataTableCommandAction = (selection: DataTableRowSelectionState) => void | Promise<void>

export interface DataTableCommand {
  /** Label in the command bar. */
  label: string
  /** Runs with the current row selection. */
  action: DataTableCommandAction
  /** Single key that runs the command while rows are selected, e.g. "r". */
  shortcut: string
}

export type DataTableEmptyStateContent = {
  heading?: string
  description?: string
  /** Replaces the heading and description. */
  custom?: React.ReactNode
}

export type DataTableEmptyStateProps = {
  /** Shown when a search or filter matches nothing. */
  filtered?: DataTableEmptyStateContent
  /** Shown when there are no records at all. */
  empty?: DataTableEmptyStateContent
}

export interface DataTableColumnFilter extends ColumnFilter {}

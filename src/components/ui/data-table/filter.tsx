"use client"

import * as React from "react"
import { dequal } from "dequal"
import { CheckIcon, SearchIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

import { useDataTableContext } from "./context"
import type {
  DataTableCustomFilterProps,
  DataTableDateComparisonOperator,
  DataTableDateFilterProps,
  DataTableFilter as DataTableFilterDef,
  DataTableFilterOption,
  DataTableNumberFilterProps,
} from "./types"
import { formatDataTableDate, isDateComparisonOperator, isEmptyFilterValue } from "./utils"

const DEFAULT_RANGE_OPTION_LABEL = "Custom"
const DEFAULT_RANGE_OPTION_START_LABEL = "Starting"
const DEFAULT_RANGE_OPTION_END_LABEL = "Ending"

const NUMBER_OPERATORS = [
  { value: "eq", label: "Equals", symbol: "=" },
  { value: "gt", label: "Greater than", symbol: ">" },
  { value: "gte", label: "Greater than or equal", symbol: "≥" },
  { value: "lt", label: "Less than", symbol: "<" },
  { value: "lte", label: "Less than or equal", symbol: "≤" },
]

function hasFilterValue(value: unknown) {
  if (isEmptyFilterValue(value)) return false
  if (typeof value === "number") return true
  if (isDateComparisonOperator(value)) return Boolean(value.$gte || value.$lte || value.$gt || value.$lt)
  if (typeof value === "object" && value !== null) {
    return Object.values(value).some((v) => v !== null && v !== undefined)
  }
  return true
}

function getDisplayValue(meta: DataTableFilterDef, value: unknown) {
  const options = "options" in meta ? (meta.options as DataTableFilterOption<unknown>[]) : undefined
  let display: string | null = null
  let isCustomRange = false

  if (typeof value === "string") {
    display = options?.length ? (options.find((o) => o.value === value)?.label ?? null) : value
  } else if (typeof value === "number") {
    display = value.toLocaleString("en-IN")
  } else if (Array.isArray(value)) {
    display = value.map((v) => options?.find((o) => o.value === v)?.label ?? String(v)).join(", ")
  } else if (isDateComparisonOperator(value)) {
    display = options?.find((o) => dequal(o.value, value))?.label ?? null
    if (!display && meta.type === "date") {
      isCustomRange = true
      const format = meta.formatDateValue ?? ((d: Date) => formatDataTableDate(d, meta.format === "date-time"))
      if (value.$gte && value.$lte) display = `${format(new Date(value.$gte))} – ${format(new Date(value.$lte))}`
      else if (value.$gte)
        display = `${meta.rangeOptionStartLabel ?? DEFAULT_RANGE_OPTION_START_LABEL} ${format(new Date(value.$gte))}`
      else if (value.$lte)
        display = `${meta.rangeOptionEndLabel ?? DEFAULT_RANGE_OPTION_END_LABEL} ${format(new Date(value.$lte))}`
    }
  } else if (typeof value === "object" && value !== null) {
    const [op, num] = Object.entries(value)[0] ?? []
    const symbol = NUMBER_OPERATORS.find((o) => `$${o.value}` === op)?.symbol ?? op
    if (typeof num === "number") display = `${symbol} ${num.toLocaleString("en-IN")}`
  }

  return { display, isCustomRange }
}

interface DataTableFilterProps {
  id: string
  filter: unknown
  isNew?: boolean
  onUpdate: (value: unknown) => void
  onRemove: () => void
}

/** One active filter chip: label, value (opens the value picker) and remove. */
function DataTableFilter({ id, filter, isNew = false, onUpdate, onRemove }: DataTableFilterProps) {
  const { instance } = useDataTableContext()
  const [open, setOpen] = React.useState(isNew)
  const meta = instance.getFilterMeta(id)
  const hasValue = hasFilterValue(filter)

  const onOpenChange = (next: boolean) => {
    setOpen(next)
    // Closing a picker with nothing chosen drops the chip.
    if (!next && !hasValue) onRemove()
  }

  if (!meta) return null

  const { display, isCustomRange } = getDisplayValue(meta, filter)
  const showsIs = meta.type === "select" || meta.type === "multiselect" || meta.type === "radio"
  const segment = "flex items-center px-2.5 whitespace-nowrap"
  const interactive =
    "outline-none transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset"

  return (
    <Popover open={open} onOpenChange={onOpenChange} modal>
      <PopoverAnchor asChild>
        <div
          data-slot="data-table-filter"
          data-filter-id={id}
          className="flex h-8 shrink-0 items-stretch divide-x divide-border overflow-hidden rounded-md border bg-card text-sm"
        >
          {hasValue ? (
            <span className={cn(segment, "text-muted-foreground")}>{meta.label}</span>
          ) : (
            <PopoverTrigger asChild>
              <button type="button" className={cn(segment, interactive, "text-muted-foreground")}>
                {meta.label}
              </button>
            </PopoverTrigger>
          )}
          {hasValue && (
            <>
              {showsIs && <span className={cn(segment, "text-muted-foreground")}>is</span>}
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(segment, interactive, "max-w-60 font-medium text-foreground tabular-nums")}
                >
                  <span className="truncate">{display || " "}</span>
                </button>
              </PopoverTrigger>
              <button
                type="button"
                aria-label={`Remove ${meta.label} filter`}
                onClick={onRemove}
                className={cn("flex w-8 items-center justify-center text-muted-foreground hover:text-foreground", interactive)}
              >
                <XIcon className="size-3.5" />
              </button>
            </>
          )}
        </div>
      </PopoverAnchor>
      <PopoverContent
        data-slot="data-table-filter-content"
        align="start"
        sideOffset={6}
        collisionPadding={16}
        className="w-auto gap-0 p-0"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <FilterContent meta={meta} filter={filter} isCustomRange={isCustomRange} onUpdate={onUpdate} onRemove={onRemove} />
      </PopoverContent>
    </Popover>
  )
}

function FilterContent({
  meta,
  filter,
  isCustomRange,
  onUpdate,
  onRemove,
}: {
  meta: DataTableFilterDef
  filter: unknown
  isCustomRange: boolean
  onUpdate: (value: unknown) => void
  onRemove: () => void
}) {
  switch (meta.type) {
    case "select":
    case "multiselect":
      return (
        <OptionsContent
          filter={(filter as string[] | undefined) ?? []}
          options={meta.options}
          searchable={meta.type === "select" ? true : (meta.searchable ?? true)}
          indicator={meta.type === "multiselect" ? "checkbox" : "check"}
          onUpdate={onUpdate}
        />
      )
    case "radio":
      return (
        <OptionList
          ariaLabel={meta.label}
          items={meta.options.map((o) => ({ key: o.value, label: o.label, selected: filter === o.value }))}
          onSelect={(idx) => onUpdate(meta.options[idx].value)}
        />
      )
    case "date":
      return <DateContent meta={meta} filter={filter} isCustomRange={isCustomRange} onUpdate={onUpdate} />
    case "string":
      return <StringContent filter={filter as string | undefined} placeholder={meta.placeholder} onUpdate={onUpdate} />
    case "number":
      return <NumberContent meta={meta} filter={filter} onUpdate={onUpdate} />
    case "custom":
      return <>{(meta as DataTableCustomFilterProps).render({ value: filter, onChange: onUpdate, onRemove })}</>
    default:
      return null
  }
}

/** Vertical list of option buttons; arrow keys move focus, Enter / Space choose. */
function OptionList({
  items,
  onSelect,
  ariaLabel,
  indicator = "check",
  className,
}: {
  items: { key: string; label: string; selected: boolean }[]
  onSelect: (index: number) => void
  ariaLabel: string
  indicator?: "check" | "checkbox"
  className?: string
}) {
  const listRef = React.useRef<HTMLDivElement>(null)

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return
    const buttons = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? [])
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement)
    const next = event.key === "ArrowDown" ? Math.min(index + 1, buttons.length - 1) : Math.max(index - 1, 0)
    event.preventDefault()
    buttons[next]?.focus()
  }

  return (
    <div
      ref={listRef}
      role="group"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cn("flex max-h-72 min-w-48 flex-col overflow-y-auto p-1", className)}
    >
      {items.map((item, idx) => (
        <button
          key={item.key}
          type="button"
          aria-pressed={item.selected}
          onClick={() => onSelect(idx)}
          className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-none hover:bg-accent focus-visible:bg-accent"
        >
          {indicator === "checkbox" ? (
            // A visual checkbox (the row itself is the button), styled like Ghost's Checkbox.
            <span
              aria-hidden="true"
              data-state={item.selected ? "checked" : "unchecked"}
              className="cn-checkbox pointer-events-none shrink-0"
            >
              {item.selected && <CheckIcon className="size-3.5" />}
            </span>
          ) : (
            <span className="flex size-4 shrink-0 items-center justify-center">
              {item.selected && <CheckIcon className="size-4 text-primary" />}
            </span>
          )}
          <span className="min-w-0 truncate">{item.label}</span>
        </button>
      ))}
    </div>
  )
}

function OptionsContent({
  filter,
  options,
  searchable,
  indicator,
  onUpdate,
}: {
  filter: string[]
  options: DataTableFilterOption[]
  searchable: boolean
  indicator: "check" | "checkbox"
  onUpdate: (value: unknown) => void
}) {
  const [search, setSearch] = React.useState("")
  const visible = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options
  }, [options, search])

  const toggle = (value: string) => {
    const next = filter.includes(value) ? filter.filter((v) => v !== value) : [...filter, value]
    onUpdate(next.length > 0 ? next : undefined)
  }

  return (
    <div className="w-64">
      {searchable && (
        <div className="flex items-center gap-2 border-b px-3 py-1.5">
          <SearchIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault()
                ;(e.currentTarget.closest("[data-slot=data-table-filter-content]") as HTMLElement | null)
                  ?.querySelector<HTMLButtonElement>("[aria-pressed]")
                  ?.focus()
              }
            }}
            placeholder="Search"
            aria-label="Search options"
            autoFocus
            className="h-7 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch("")}
              className="grid size-5 place-items-center rounded-sm text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>
      )}
      {visible.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">No results</p>
      ) : (
        <OptionList
          ariaLabel="Options"
          indicator={indicator}
          items={visible.map((o) => ({ key: o.value, label: o.label, selected: filter.includes(o.value) }))}
          onSelect={(idx) => toggle(visible[idx].value)}
        />
      )}
    </div>
  )
}

function DateContent({
  meta,
  filter,
  isCustomRange,
  onUpdate,
}: {
  meta: DataTableFilterDef<DataTableDateFilterProps>
  filter: unknown
  isCustomRange: boolean
  onUpdate: (value: unknown) => void
}) {
  const {
    options,
    format = "date",
    rangeOptionLabel = DEFAULT_RANGE_OPTION_LABEL,
    rangeOptionStartLabel = DEFAULT_RANGE_OPTION_START_LABEL,
    rangeOptionEndLabel = DEFAULT_RANGE_OPTION_END_LABEL,
    disableRangeOption = false,
  } = meta
  const current = isDateComparisonOperator(filter) ? filter : undefined
  const [isCustom, setIsCustom] = React.useState(isCustomRange)
  React.useEffect(() => setIsCustom(isCustomRange), [isCustomRange])

  const granularity = format === "date-time" ? "minute" : "day"

  const setBound = (key: "$gte" | "$lte", date: Date | null) => {
    const next: DataTableDateComparisonOperator = { ...current }
    if (!date) delete next[key]
    else {
      const value = new Date(date)
      // Whole days: the end date includes that day.
      if (granularity === "day") {
        if (key === "$gte") value.setHours(0, 0, 0, 0)
        else value.setHours(23, 59, 59, 999)
      }
      next[key] = value.toISOString()
    }
    onUpdate(Object.keys(next).length > 0 ? next : undefined)
  }

  const items = options.map((o) => ({
    key: o.label,
    label: o.label,
    selected: !isCustom && current !== undefined && dequal(o.value, current),
  }))
  if (!disableRangeOption) items.push({ key: "__custom", label: rangeOptionLabel, selected: isCustom })

  return (
    <div className="w-64">
      <OptionList
        ariaLabel={meta.label}
        items={items}
        onSelect={(idx) => {
          if (idx === options.length) {
            setIsCustom(true)
          } else {
            setIsCustom(false)
            onUpdate(options[idx].value)
          }
        }}
      />
      {!disableRangeOption && isCustom && (
        <>
          <Separator />
          <div className="flex flex-col gap-3 p-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">
                {rangeOptionStartLabel}
              </Label>
              <DatePicker
                aria-label={rangeOptionStartLabel}
                size="small"
                granularity={granularity}
                isClearable
                maxValue={current?.$lte ? new Date(current.$lte) : undefined}
                value={current?.$gte ? new Date(current.$gte) : null}
                onChange={(d) => setBound("$gte", d)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">
                {rangeOptionEndLabel}
              </Label>
              <DatePicker
                aria-label={rangeOptionEndLabel}
                size="small"
                granularity={granularity}
                isClearable
                minValue={current?.$gte ? new Date(current.$gte) : undefined}
                value={current?.$lte ? new Date(current.$lte) : null}
                onChange={(d) => setBound("$lte", d)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/** Runs `fn` after `delay` ms of quiet; `flush` runs it now. */
function useDebounced<T>(fn: (value: T) => void, delay: number) {
  const timeout = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const latest = React.useRef(fn)
  React.useEffect(() => {
    latest.current = fn
  })
  React.useEffect(() => () => clearTimeout(timeout.current), [])
  return {
    run: (value: T) => {
      clearTimeout(timeout.current)
      timeout.current = setTimeout(() => latest.current(value), delay)
    },
    flush: (value: T) => {
      clearTimeout(timeout.current)
      latest.current(value)
    },
  }
}

function StringContent({
  filter,
  placeholder = "Enter a value",
  onUpdate,
}: {
  filter?: string
  placeholder?: string
  onUpdate: (value: unknown) => void
}) {
  const [value, setValue] = React.useState(filter ?? "")
  const commit = useDebounced<string>((v) => onUpdate(v.trim() || undefined), 500)
  return (
    <div className="w-64 p-3">
      <Input
        value={value}
        placeholder={placeholder}
        autoFocus
        className="h-8"
        onChange={(e) => {
          setValue(e.target.value)
          commit.run(e.target.value)
        }}
        onKeyDown={(e) => e.key === "Enter" && commit.flush(value)}
      />
    </div>
  )
}

function NumberContent({
  meta,
  filter,
  onUpdate,
}: {
  meta: DataTableFilterDef<DataTableNumberFilterProps>
  filter: unknown
  onUpdate: (value: unknown) => void
}) {
  const { placeholder = "Enter a number", includeOperators = true } = meta
  // Seed from the current filter once, when the picker opens.
  const [initial] = React.useState(() => {
    if (typeof filter === "number") return { op: "eq", value: String(filter) }
    if (filter && typeof filter === "object") {
      const [op, num] = Object.entries(filter)[0] ?? []
      if (op) return { op: op.replace("$", ""), value: String(num ?? "") }
    }
    return { op: "eq", value: "" }
  })
  const [operator, setOperator] = React.useState(initial.op)
  const [value, setValue] = React.useState(initial.value)

  const build = (op: string, raw: string) => {
    if (raw.trim() === "") return undefined
    const num = Number(raw)
    if (Number.isNaN(num)) return null
    return includeOperators && op !== "eq" ? { [`$${op}`]: num } : num
  }
  const commit = useDebounced<{ op: string; raw: string }>(({ op, raw }) => {
    const next = build(op, raw)
    if (next !== null) onUpdate(next)
  }, 500)

  return (
    <div className="flex w-64 flex-col gap-2 p-3">
      {includeOperators && (
        <Select
          value={operator}
          onValueChange={(op) => {
            setOperator(op)
            commit.flush({ op, raw: value })
          }}
        >
          <SelectTrigger size="sm" className="w-full" aria-label="Comparison">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NUMBER_OPERATORS.map((op) => (
              <SelectItem key={op.value} value={op.value}>
                {op.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <Input
        type="number"
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        autoFocus={!includeOperators}
        className="h-8 tabular-nums"
        onChange={(e) => {
          setValue(e.target.value)
          commit.run({ op: operator, raw: e.target.value })
        }}
        onKeyDown={(e) => e.key === "Enter" && commit.flush({ op: operator, raw: value })}
      />
    </div>
  )
}

export { DataTableFilter }
export type { DataTableFilterProps }

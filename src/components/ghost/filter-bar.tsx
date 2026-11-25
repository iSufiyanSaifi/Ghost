import * as React from "react"
import { ListFilter, SlidersHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"

export interface FilterBarProps extends Omit<React.ComponentProps<"div">, "children" | "onToggle"> {
  /** Quick-filter chip labels. */
  filters: string[]
  /** Currently active filters. @default [] */
  active?: string[]
  /** Called with the chip label when a chip is toggled. */
  onToggle?: (filter: string) => void
  /** Current sort label. @default "Newest first" */
  sort?: string
  /** Result count shown at the end of the bar. */
  count?: number
  /** When set, the "Filters" label becomes a button (e.g. to open a filter sheet). */
  onOpenFilters?: () => void
  /** When set, the sort label becomes a button (e.g. to open a sort menu). */
  onSortClick?: () => void
}

/**
 * Filter chips with active count and sort (Figma "Filter & Sort bar", "Filter/Options").
 */
function FilterBar({
  filters = [],
  active = [],
  onToggle,
  sort = "Newest first",
  count,
  onOpenFilters,
  onSortClick,
  className,
  ...props
}: FilterBarProps) {
  const filtersLabel = (
    <>
      <ListFilter aria-hidden="true" />
      Filters
      {active.length > 0 && (
        <span className="grid h-4.5 min-w-4.5 place-items-center rounded-sm bg-primary px-1 text-[11px] font-semibold text-primary-foreground tabular-nums">
          {active.length}
          <span className="sr-only"> active</span>
        </span>
      )}
    </>
  )
  const sortLabel = (
    <>
      <SlidersHorizontal aria-hidden="true" />
      <span className="sr-only">Sort: </span>
      {sort}
    </>
  )

  return (
    <div data-slot="filter-bar" className={cn("flex flex-wrap items-center gap-2", className)} {...props}>
      {onOpenFilters ? (
        <Button variant="outline" size="sm" onClick={onOpenFilters}>
          {filtersLabel}
        </Button>
      ) : (
        <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 text-[13px] font-medium text-muted-foreground [&_svg]:size-3.5">
          {filtersLabel}
        </span>
      )}
      <div role="group" aria-label="Quick filters" className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <Toggle
            key={f}
            variant="outline"
            size="sm"
            pressed={active.includes(f)}
            onPressedChange={() => onToggle?.(f)}
            className="border-border bg-card text-[13px] text-muted-foreground data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
          >
            {f}
          </Toggle>
        ))}
      </div>
      <span className="flex-1" />
      {count != null && (
        <span aria-live="polite" className="text-[13px] text-muted-foreground tabular-nums">
          {count.toLocaleString("en-IN")} {count === 1 ? "result" : "results"}
        </span>
      )}
      {onSortClick ? (
        <Button variant="ghost" size="sm" onClick={onSortClick}>
          {sortLabel}
        </Button>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground [&_svg]:size-3.5">
          {sortLabel}
        </span>
      )}
    </div>
  )
}

export { FilterBar }

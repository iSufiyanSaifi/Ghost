import * as React from "react"
import { Package } from "lucide-react"

import { cn } from "@/lib/utils"

export interface PartCardProps extends React.ComponentProps<"div"> {
  name: string
  /** Stock-keeping unit, shown in mono, e.g. "BP-HY-CR-F01". */
  sku: string
  stock: number
  /** Pre-formatted price, e.g. "₹2,450". */
  price: string
  /** Flags the part as at or below reorder level. */
  low?: boolean
}

/**
 * Inventory part row (Figma "Part Card-CVG", "Part Item"). Set `low` to flag reorder level.
 */
export function PartCard({
  name,
  sku,
  stock,
  price,
  low = false,
  className,
  ...props
}: PartCardProps) {
  return (
    <div
      data-slot="part-card"
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 text-card-foreground",
        className
      )}
      {...props}
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
        <Package className="size-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{name}</div>
        <div className="mt-0.5 truncate font-mono text-xs text-muted-foreground">{sku}</div>
      </div>
      <div className="text-right tabular-nums">
        <div className="text-sm font-semibold">{price}</div>
        <div className={cn("text-xs", low ? "text-error-text" : "text-muted-foreground")}>
          {stock.toLocaleString("en-IN")} in stock
          {low && <span className="sr-only"> (low stock)</span>}
        </div>
      </div>
    </div>
  )
}

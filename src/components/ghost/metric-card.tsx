import * as React from "react"
import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { statusToneText, type StatusTone } from "@/components/ghost/status-badge"
import { Card } from "@/components/ui/card"


export interface MetricCardProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Metric name, e.g. `Today's revenue`. */
  label: string
  /** Pre-formatted value, e.g. `₹84,250` (use `toLocaleString('en-IN')`). */
  value: string
  /** Change vs the comparison period, e.g. `+12%`. */
  delta?: string
  /** Overrides the trend colour. Defaults to `success`, or `error` when `trend` is `down`. */
  tone?: StatusTone
  /** Shows a trend arrow next to the delta. */
  trend?: "up" | "down"
  /** Comparison context, e.g. `vs yesterday`. */
  hint?: string
  /** Optional lucide icon shown before the label (was a Jin icon-name string). */
  icon?: LucideIcon
}

/**
 * KPI tile with tabular figures and trend delta.
 */
function MetricCard({ label, value, delta, tone, trend, hint, icon: Icon, className, ...props }: MetricCardProps) {
  const t: StatusTone = tone ?? (trend === "down" ? "error" : "success")
  const TrendIcon = trend === "down" ? TrendingDown : TrendingUp
  return (
    <Card data-slot="metric-card" className={cn("min-w-45 gap-2.5 p-4", className)} {...props}>
      <div className="flex items-center gap-2.5">
        {Icon && (
          <span className="grid size-8 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
            <Icon className="size-4" aria-hidden="true" />
          </span>
        )}
        <span className="text-[13px] font-medium text-muted-foreground">{label}</span>
      </div>
      <span className="text-[28px] leading-8 font-semibold tracking-[-.01em] text-foreground tabular-nums">
        {value}
      </span>
      {(delta || hint) && (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {delta && (
            <span className={cn("inline-flex items-center gap-0.5 font-semibold tabular-nums", statusToneText[t])}>
              {trend && <TrendIcon className="size-3.5" aria-hidden="true" />}
              {trend && <span className="sr-only">{trend === "down" ? "Down" : "Up"}</span>}
              {delta}
            </span>
          )}
          {hint}
        </span>
      )}
    </Card>
  )
}

export { MetricCard }

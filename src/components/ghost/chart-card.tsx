import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export interface ChartCardProps
  extends Omit<React.ComponentProps<typeof Card>, "title"> {
  /** Card heading, e.g. "Revenue". */
  title: React.ReactNode
  /** Headline figure shown above the chart, e.g. "₹48.2L". Rendered with tabular-nums. */
  value?: React.ReactNode
  /** Secondary line under the title, e.g. "Last 6 months". */
  subtitle?: React.ReactNode
  /** Optional control in the top-right corner (filter, menu, period toggle). */
  action?: React.ReactNode
  /** The chart itself, typically a `ChartContainer` from `@/components/ui/chart`. */
  children?: React.ReactNode
}

/**
 * Card frame for any chart (Figma "CVG Chart Card", "Pie Chart Card"): title, optional
 * subtitle, headline value and a top-right action above the chart body.
 */
export function ChartCard({
  title,
  value,
  subtitle,
  action,
  children,
  className,
  ...props
}: ChartCardProps) {
  return (
    <Card data-slot="chart-card" className={cn("gap-4", className)} {...props}>
      <CardHeader>
        <CardTitle className="text-[15px] font-semibold">{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      {(value !== undefined || children) && (
        <CardContent className="flex flex-col gap-4">
          {value !== undefined && (
            <div className="text-2xl font-semibold tabular-nums">{value}</div>
          )}
          {children}
        </CardContent>
      )}
    </Card>
  )
}

import * as React from "react"
import { Wrench } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export interface ServiceCardProps extends Omit<React.ComponentProps<"div">, "title" | "children"> {
  /** Job name, e.g. `Brake overhaul`. */
  title: string
  /** Secondary line, usually the service order number. */
  subtitle?: string
  /** Completion, 0–100. @default 0 */
  progress?: number
  /** Expected delivery date (DD/MM/YYYY). */
  eta?: string
}

/**
 * Service job progress card (Figma "Car Service Card").
 */
function ServiceCard({ title, subtitle, progress = 0, eta, className, ...props }: ServiceCardProps) {
  const value = Math.max(0, Math.min(100, progress))
  return (
    <Card data-slot="service-card" className={cn("gap-2.5 p-4", className)} {...props}>
      <div className="flex items-center gap-2.5">
        <Wrench className="size-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="min-w-0">
          <div className="text-sm font-semibold text-foreground">{title}</div>
          {subtitle && <div className="text-xs text-muted-foreground tabular-nums">{subtitle}</div>}
        </div>
        <span className="ml-auto text-xs font-medium text-muted-foreground tabular-nums">{value}%</span>
      </div>
      <Progress value={value} aria-label={`${title} progress`} />
      {eta && <div className="text-xs text-muted-foreground tabular-nums">Expected {eta}</div>}
    </Card>
  )
}

export { ServiceCard }
